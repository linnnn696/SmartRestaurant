import express, { Request, Response } from 'express';
import pool from '../utils/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { success, fail } from '../utils/response';

const router = express.Router();

interface MenuItem extends RowDataPacket {
  item_id: number;
  name: string;
  category: string;
  price: number;
  image_url?: string;
  description: string;
  tag?: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}

// 获取所有菜单项
router.get('/', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<MenuItem[]>(`
      SELECT DISTINCT
        item_id,
        name,
        category,
        price,
        image_url,
        description,
        tag,
        status
      FROM menu_items
      WHERE status = true
      ORDER BY category, name
    `);
    
    // 为每个菜品添加随机销量
    const processedRows = rows.map(item => ({
      ...item,
      sales: Math.floor(Math.random() * 200) + 50 // 随机生成50-250之间的销量
    }));
    
    success(res, processedRows);
  } catch (error) {
    console.error('获取菜单项失败:', error);
    fail(res, 500, '获取菜单项失败');
  }
});

// 获取单个菜单项
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<MenuItem[]>(
      'SELECT * FROM menu_items WHERE item_id = ? AND status = true',
      [req.params.id]
    );

    if (rows.length === 0) {
      return fail(res, 404, '菜单项不存在');
    }

    success(res, rows[0]);
  } catch (error) {
    console.error('获取菜单项失败:', error);
    fail(res, 500, '获取菜单项失败');
  }
});

// 创建菜单项
router.post('/', async (req: Request, res: Response) => {
  const { name, category, price, image_url, description, tag } = req.body;

  // 数据验证
  if (!name || !category || !price) {
    return fail(res, 400, '名称、分类和价格为必填项');
  }

  try {
    // 检查名称是否已存在
    const [existing] = await pool.query<MenuItem[]>(
      'SELECT * FROM menu_items WHERE name = ?',
      [name]
    );

    if (existing.length > 0) {
      return fail(res, 400, '该菜品名称已存在');
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO menu_items (name, category, price, image_url, description, tag)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, category, price, image_url || null, description || '', tag || null]
    );

    success(res, { id: result.insertId, name }, '创建菜单项成功');
  } catch (error) {
    console.error('创建菜单项失败:', error);
    fail(res, 500, '创建菜单项失败');
  }
});

// 更新菜单项
router.put('/:id', async (req: Request, res: Response) => {
  const { name, category, price, image_url, description, tag, status } = req.body;

  // 数据验证
  if (!category || !price) {
    return fail(res, 400, '分类和价格为必填项');
  }

  try {
    // 如果提供了新名称，检查是否已存在
    if (name) {
      const [existing] = await pool.query<MenuItem[]>(
        'SELECT * FROM menu_items WHERE name = ? AND item_id != ?',
        [name, req.params.id]
      );

      if (existing.length > 0) {
        return fail(res, 400, '新的菜品名称已存在');
      }
    }

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE menu_items SET
        name = COALESCE(?, name),
        category = ?,
        price = ?,
        image_url = ?,
        description = ?,
        tag = ?,
        status = ?
       WHERE item_id = ?`,
      [
        name || null,
        category,
        price,
        image_url || null,
        description || '',
        tag || null,
        status !== undefined ? status : true,
        req.params.id
      ]
    );

    if (result.affectedRows === 0) {
      return fail(res, 404, '菜单项不存在');
    }

    success(res, null, '更新菜单项成功');
  } catch (error) {
    console.error('更新菜单项失败:', error);
    fail(res, 500, '更新菜单项失败');
  }
});

// 删除菜单项
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    // 检查是否有关联的订单项
    const [orderItems] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM order_items WHERE item_id = ?',
      [req.params.id]
    );

    if (orderItems[0].count > 0) {
      // 如果有关联的订单项，则软删除
      await pool.query(
        'UPDATE menu_items SET status = false WHERE item_id = ?',
        [req.params.id]
      );
    } else {
      // 如果没有关联的订单项，则物理删除
      await pool.query(
        'DELETE FROM menu_items WHERE item_id = ?',
        [req.params.id]
      );
    }

    success(res, null, '删除菜单项成功');
  } catch (error) {
    console.error('删除菜单项失败:', error);
    fail(res, 500, '删除菜单项失败');
  }
});

export default router; 