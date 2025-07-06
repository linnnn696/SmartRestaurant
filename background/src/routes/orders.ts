import express, { Request, Response, Router } from 'express';
import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import pool from '../utils/db';
import { createSuccessResponse, createErrorResponse } from '../utils/response';

const router: Router = express.Router();

interface OrderItem {
  item_id: number;
  quantity: number;
  price: number;
}

interface CreateOrderBody {
  table_id: string;
  items: Array<{
    menu_item_id: number;
    quantity: number;
  }>;
}

interface OrderDetail extends RowDataPacket {
  order_id: number;
  table_id: number;
  status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  items: any[];
}

interface MenuItem extends RowDataPacket {
  item_id: number;
  name: string;
}

interface OrderTime extends RowDataPacket {
  created_at: Date;
  updated_at: Date;
}

// 格式化日期时间为本地格式
function formatDateTime(date: Date): string {
  const pad = (num: number) => num.toString().padStart(2, '0');
  
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 订单状态枚举
export enum OrderStatus {
  PREPARING = '制作中',
  COMPLETED = '已完成'
}

// 获取所有订单
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query<OrderDetail[]>(
      `SELECT o.order_id, 
              o.table_id,
              o.status,
              o.created_at,
              o.updated_at,
              JSON_ARRAYAGG(
                JSON_OBJECT(
                  'item_id', oi.item_id,
                  'name', mi.name,
                  'quantity', oi.quantity,
                  'price', oi.price,
                  'subtotal', oi.price * oi.quantity
                )
              ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.order_id = oi.order_id
       LEFT JOIN menu_items mi ON oi.item_id = mi.item_id
       GROUP BY o.order_id
       ORDER BY o.created_at DESC`
    );
    
    // 处理没有订单项的情况
    const processedRows = rows.map(row => ({
      ...row,
      items: row.items[0] === null ? [] : row.items
    }));
    
    res.json({ 
      code: 200, 
      message: '获取订单列表成功',
      data: processedRows 
    });
  } catch (error) {
    console.error('获取订单列表错误:', error);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
});

// 计算订单总金额
function calculateTotalAmount(items: CreateOrderBody['items']): number {
  return items.reduce((total, item) => {
    // 这里需要从数据库中获取菜品价格，暂时使用固定价格
    const price = 10; // 假设所有菜品价格都是10元
    return total + (price * item.quantity);
  }, 0);
}

// 创建订单
router.post('/', async (req: Request<{}, {}, CreateOrderBody>, res: Response) => {
  const { table_id, items } = req.body;
  
  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 获取菜品价格
      const menuItemIds = items.map(item => item.menu_item_id);
      const [menuItems] = await connection.execute<RowDataPacket[]>(
        'SELECT item_id, price FROM menu_items WHERE item_id IN (?)',
        [menuItemIds]
      );

      // 创建价格映射
      const priceMap = new Map(menuItems.map(item => [item.item_id, item.price]));

      // 计算总金额并验证价格
      const totalAmount = items.reduce((total, item) => {
        const price = priceMap.get(item.menu_item_id);
        if (typeof price !== 'number') {
          throw new Error(`菜品 ${item.menu_item_id} 不存在或价格无效`);
        }
        return total + (price * item.quantity);
      }, 0);

      // 创建订单
      const [orderResult] = await connection.execute<ResultSetHeader>(
        'INSERT INTO orders (table_id, status, total_amount, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
        [table_id, OrderStatus.PREPARING, totalAmount]
      );

      const orderId = orderResult.insertId;

      // 创建订单项
      for (const item of items) {
        const price = priceMap.get(item.menu_item_id);
        if (typeof price !== 'number') {
          throw new Error(`菜品 ${item.menu_item_id} 不存在或价格无效`);
        }

        await connection.execute(
          'INSERT INTO order_items (order_id, item_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.menu_item_id, item.quantity, price]
        );
      }

      await connection.commit();
      return res.json(createSuccessResponse({ order_id: orderId }));
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('创建订单失败:', error);
    if (error instanceof Error && error.message.includes('菜品')) {
      return res.status(400).json(createErrorResponse(error.message));
    }
    return res.status(500).json(createErrorResponse('创建订单失败'));
  }
});

// 获取订单详情
router.get('/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    // 获取订单基本信息
    const [orders] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM orders WHERE order_id = ?',
      [req.params.id]
    );
    
    if (orders.length === 0) {
      res.status(404).json({ code: 404, message: '订单不存在' });
      return;
    }
    
    // 获取订单项
    const [items] = await pool.query<RowDataPacket[]>(
      `SELECT oi.*, mi.name, mi.category 
       FROM order_items oi 
       LEFT JOIN menu_items mi ON oi.item_id = mi.item_id 
       WHERE oi.order_id = ?`,
      [req.params.id]
    );
    
    res.json({
      code: 200,
      data: {
        ...orders[0],
        items
      }
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
});

// 更新订单状态
router.put('/:id/status', async (req: Request<{ id: string }, {}, { status: OrderStatus }>, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  // 验证状态是否有效
  if (!Object.values(OrderStatus).includes(status)) {
    return res.status(400).json(createErrorResponse('无效的订单状态'));
  }

  try {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE order_id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json(createErrorResponse('订单不存在'));
    }

    // 获取更新后的订单
    const [orders] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM orders WHERE order_id = ?',
      [id]
    );
    
    return res.json(createSuccessResponse(orders[0]));
  } catch (error) {
    console.error('更新订单状态失败:', error);
    return res.status(500).json(createErrorResponse('更新订单状态失败'));
  }
});

// 获取桌台的当前订单
router.get('/table/:tableId', async (req: Request<{ tableId: string }>, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT o.*, 
              JSON_ARRAYAGG(
                JSON_OBJECT(
                  'item_id', oi.item_id,
                  'name', mi.name,
                  'quantity', oi.quantity,
                  'price', oi.price,
                  'subtotal', oi.subtotal
                )
              ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.order_id = oi.order_id
       LEFT JOIN menu_items mi ON oi.item_id = mi.item_id
       WHERE o.table_id = ? AND o.status != '已完成'
       GROUP BY o.order_id`,
      [req.params.tableId]
    );
    
    res.json({ code: 200, data: rows });
  } catch (error) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
});

export default router; 