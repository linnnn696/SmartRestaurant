import express, { Request, Response, Router } from 'express';
import pool from '../utils/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router: Router = express.Router();

interface RegisterBody {
  phone_number: string;
}

interface UpdatePointsBody {
  points_to_add: number;
}

// 用户注册
router.post('/register', async (req: Request<{}, {}, RegisterBody>, res: Response): Promise<void> => {
  const { phone_number } = req.body;
  
  try {
    // 检查用户是否已存在
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT user_id FROM users WHERE phone_number = ?',
      [phone_number]
    );
    
    if (existing.length > 0) {
      res.status(400).json({ code: 400, message: '用户已存在' });
      return;
    }
    
    // 创建新用户
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (phone_number) VALUES (?)',
      [phone_number]
    );
    
    res.json({
      code: 200,
      message: '注册成功',
      data: { user_id: result.insertId }
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
});

// 获取用户信息
router.get('/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT user_id, phone_number, register_time, points, total_points FROM users WHERE user_id = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      res.status(404).json({ code: 404, message: '用户不存在' });
      return;
    }
    
    res.json({ code: 200, data: rows[0] });
  } catch (error) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
});

// 更新用户积分
router.put('/:id/points', async (req: Request<{ id: string }, {}, UpdatePointsBody>, res: Response): Promise<void> => {
  const { points_to_add } = req.body;
  
  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // 更新当前积分和总积分
      const [result] = await connection.query<ResultSetHeader>(
        'UPDATE users SET points = points + ?, total_points = total_points + ? WHERE user_id = ?',
        [points_to_add, points_to_add, req.params.id]
      );
      
      if (result.affectedRows === 0) {
        await connection.rollback();
        res.status(404).json({ code: 404, message: '用户不存在' });
        return;
      }
      
      await connection.commit();
      res.json({ code: 200, message: '积分更新成功' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
});

// 获取用户订单历史
router.get('/:id/orders', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
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
       WHERE o.user_id = ?
       GROUP BY o.order_id
       ORDER BY o.created_at DESC`,
      [req.params.id]
    );
    
    res.json({ code: 200, data: rows });
  } catch (error) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
});

export default router; 