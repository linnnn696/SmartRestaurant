import express, { Request, Response, Router } from 'express';
import pool from '../utils/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { OrderStatus } from './orders';

const router: Router = express.Router();

interface CreateReviewBody {
  order_id: number;
  taste_rating: number;
  service_rating: number;
  environment_rating: number;
  overall_rating: number;
  comment: string;
}

// 获取所有评价
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { order_id } = req.query;

    let query = 'SELECT * FROM reviews';
    const params: any[] = [];

    if (order_id) {
      query += ' WHERE order_id = ?';
      params.push(order_id);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    
    res.json({ 
      code: 200, 
      message: '获取评价列表成功',
      data: rows 
    });
  } catch (error) {
    console.error('获取评价列表错误:', error);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
});

// 创建评价
router.post('/', async (req: Request<{}, {}, CreateReviewBody>, res: Response): Promise<void> => {
  const { order_id, taste_rating, service_rating, environment_rating, overall_rating, comment } = req.body;
  
  try {
    // 验证评分范围
    if (taste_rating < 1 || taste_rating > 5 ||
        service_rating < 1 || service_rating > 5 ||
        environment_rating < 1 || environment_rating > 5 ||
        overall_rating < 1 || overall_rating > 5) {
      res.status(400).json({ code: 400, message: '评分必须在1-5之间' });
      return;
    }

    // 验证订单是否存在且状态为已完成
    const [orders] = await pool.query<RowDataPacket[]>(
      'SELECT status FROM orders WHERE order_id = ?',
      [order_id]
    );

    if (orders.length === 0) {
      res.status(404).json({ code: 404, message: '订单不存在' });
      return;
    }

    if (orders[0].status !== OrderStatus.COMPLETED) {
      res.status(400).json({ code: 400, message: '只能评价已完成的订单' });
      return;
    }

    // 检查是否已经评价过
    const [existingReviews] = await pool.query<RowDataPacket[]>(
      'SELECT review_id FROM reviews WHERE order_id = ?',
      [order_id]
    );

    if (existingReviews.length > 0) {
      res.status(400).json({ code: 400, message: '该订单已经评价过了' });
      return;
    }

    // 创建评价
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO reviews (
        order_id, 
        taste_rating, 
        service_rating, 
        environment_rating, 
        overall_rating, 
        comment,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [order_id, taste_rating, service_rating, environment_rating, overall_rating, comment]
    );
    
    res.json({ 
      code: 200, 
      message: '评价创建成功',
      data: { review_id: result.insertId }
    });
  } catch (error) {
    console.error('创建评价错误:', error);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
});

// 获取评价详情
router.get('/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const [reviews] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM reviews WHERE review_id = ?',
      [req.params.id]
    );
    
    if (reviews.length === 0) {
      res.status(404).json({ code: 404, message: '评价不存在' });
      return;
    }

    res.json({ code: 200, data: reviews[0] });
  } catch (error) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
});

// 获取用户的所有评价
router.get('/user/:userId', async (req: Request<{ userId: string }>, res: Response): Promise<void> => {
  try {
    const [reviews] = await pool.query<RowDataPacket[]>(
      `SELECT r.*, 
              o.table_id,
              o.status as order_status,
              u.phone_number as user_phone
       FROM reviews r
       LEFT JOIN orders o ON r.order_id = o.order_id
       LEFT JOIN users u ON o.user_id = u.user_id
       WHERE u.user_id = ?
       ORDER BY r.created_at DESC`,
      [req.params.userId]
    );
    
    res.json({ 
      code: 200, 
      message: '获取用户评价列表成功',
      data: reviews 
    });
  } catch (error) {
    console.error('获取用户评价列表错误:', error);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
});

// 删除评价（需要管理员权限）
router.delete('/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    // TODO: 在实际应用中，需要添加管理员权限验证
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM reviews WHERE review_id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      res.status(404).json({ code: 404, message: '评价不存在' });
      return;
    }
    
    res.json({ code: 200, message: '评价删除成功' });
  } catch (error) {
    console.error('删除评价错误:', error);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
});

// 获取评价统计信息
router.get('/statistics/summary', async (req: Request, res: Response): Promise<void> => {
  try {
    const [stats] = await pool.query<RowDataPacket[]>(
      `SELECT 
        COUNT(*) as total_reviews,
        ROUND(AVG(taste_rating), 2) as avg_taste_rating,
        ROUND(AVG(service_rating), 2) as avg_service_rating,
        ROUND(AVG(environment_rating), 2) as avg_environment_rating,
        ROUND(AVG(overall_rating), 2) as avg_overall_rating,
        SUM(CASE WHEN reply IS NOT NULL THEN 1 ELSE 0 END) as total_replies,
        SUM(CASE 
          WHEN overall_rating >= 4 THEN 1 
          ELSE 0 
        END) * 100.0 / COUNT(*) as satisfaction_rate
      FROM reviews`
    );
    
    // 获取最近一周的评价趋势
    const [weeklyTrend] = await pool.query<RowDataPacket[]>(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as daily_count,
        ROUND(AVG(overall_rating), 2) as daily_avg_rating
      FROM reviews
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC`
    );
    
    res.json({ 
      code: 200, 
      message: '获取评价统计信息成功',
      data: {
        summary: stats[0],
        weeklyTrend
      }
    });
  } catch (error) {
    console.error('获取评价统计信息错误:', error);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
});

export default router; 