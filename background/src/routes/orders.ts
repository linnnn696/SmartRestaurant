import express, { Request, Response, Router } from 'express';
import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import pool from '../utils/db';
import { createSuccessResponse, createErrorResponse } from '../utils/response';

const router: Router = express.Router();

interface OrderItem {
  menu_item_id: number;
  quantity: number;
  price: number;
}

interface CreateOrderBody {
  user_id: string;
  items: OrderItem[];
}

interface OrderDetail extends RowDataPacket {
  order_id: number;
  user_id: number;
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
              o.user_id,
              o.status,
              o.created_at,
              o.updated_at,
              JSON_ARRAYAGG(
                JSON_OBJECT(
                  'menu_item_id', oi.item_id,
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

// 请求体类型定义
interface UpdateOrderStatusBody {
  status: OrderStatus;
}

// 创建订单
router.post('/', async (req: Request<{}, {}, CreateOrderBody>, res: Response): Promise<void> => {
  console.log('收到创建订单请求，请求体:', JSON.stringify(req.body, null, 2));
  const { user_id, items } = req.body;

  // 数据验证
  if (!user_id || !Array.isArray(items) || items.length === 0) {
    console.error('请求数据验证失败:', { user_id, items });
    res.status(400).json({ 
      code: 400, 
      message: '请求数据格式错误',
      details: '缺少必要的订单信息'
    });
    return;
  }

  // 验证订单项数据
  for (const item of items) {
    if (!item.menu_item_id || !item.quantity || !item.price || 
        item.quantity <= 0 || item.price <= 0) {
      console.error('订单项数据验证失败:', item);
      res.status(400).json({ 
        code: 400, 
        message: '订单项数据格式错误',
        details: '菜品ID、数量和价格必须为正数'
      });
      return;
    }
  }
  
  let connection;
  try {
    // 开始事务
    connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 验证菜品是否存在并获取名称
      const itemIds = items.map(item => item.menu_item_id);
      const [menuItems] = await connection.query(
        'SELECT item_id, name FROM menu_items WHERE item_id IN (?)',
        [itemIds]
      ) as [MenuItem[], any];

      if (menuItems.length !== itemIds.length) {
        throw new Error('部分菜品不存在');
      }

      // 创建菜品ID到名称的映射
      const menuItemMap = new Map(
        menuItems.map(item => [item.item_id, item.name])
      );

      // 获取当前时间
      const now = new Date();
      const currentTime = formatDateTime(now);

      // 创建订单记录
      const [orderResult] = await connection.query(
        'INSERT INTO orders (user_id, status, created_at, updated_at) VALUES (?, ?, ?, ?)',
        [user_id, '制作中', currentTime, currentTime]
      ) as [ResultSetHeader, any];
      
      const orderId = orderResult.insertId;
      console.log('订单创建成功，ID:', orderId);
      
      // 添加订单项
      let totalAmount = 0;
      const orderItems = [];
      for (const item of items) {
        const [result] = await connection.query(
          'INSERT INTO order_items (order_id, item_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.menu_item_id, item.quantity, item.price]
        ) as [ResultSetHeader, any];

        if (result.affectedRows !== 1) {
          throw new Error(`添加订单项失败: ${JSON.stringify(item)}`);
        }

        totalAmount += item.quantity * item.price;
        orderItems.push({
          menu_item_id: String(item.menu_item_id),
          name: menuItemMap.get(item.menu_item_id),
          quantity: item.quantity,
          price: item.price
        });
      }

      // 更新订单总金额
      const [updateResult] = await connection.query(
        'UPDATE orders SET total_amount = ? WHERE order_id = ?',
        [totalAmount, orderId]
      ) as [ResultSetHeader, any];

      if (updateResult.affectedRows !== 1) {
        throw new Error('更新订单总金额失败');
      }
      
      await connection.commit();

      // 构造返回数据
      const responseData = {
        order_id: orderId,
        table_id: null,
        status: '制作中',
        total_amount: totalAmount,
        created_at: currentTime,
        updated_at: currentTime,
        items: orderItems
      };

      console.log('返回数据:', JSON.stringify(responseData, null, 2));
      
      res.json({ 
        code: 200,
        message: '订单创建成功',
        data: responseData
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error('创建订单错误:', error);
    res.status(500).json({ 
      code: 500, 
      message: '创建订单失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  } finally {
    if (connection) {
      connection.release();
    }
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
router.put('/:id/status', async (req: Request<{ id: string }, {}, UpdateOrderStatusBody>, res: Response) => {
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