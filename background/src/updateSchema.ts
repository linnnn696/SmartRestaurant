import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';

const dbConfig = {
  host: 'localhost',
  port: 15000,
  user: 'root',
  password: '123456789',
  database: 'order',  // 直接指定数据库
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function updateSchema() {
  try {
    // 创建数据库连接池
    const pool = mysql.createPool(dbConfig);
    console.log('数据库连接成功！');

    // 获取当前列信息
    const [columns] = await pool.query<RowDataPacket[]>('SHOW COLUMNS FROM menu_items');
    const columnNames = columns.map(col => col.Field);

    // 删除旧列（如果存在）
    if (columnNames.includes('is_hot')) {
      await pool.query('ALTER TABLE menu_items DROP COLUMN is_hot');
      console.log('已删除is_hot字段');
    }
    if (columnNames.includes('is_new')) {
      await pool.query('ALTER TABLE menu_items DROP COLUMN is_new');
      console.log('已删除is_new字段');
    }
    if (columnNames.includes('is_combo')) {
      await pool.query('ALTER TABLE menu_items DROP COLUMN is_combo');
      console.log('已删除is_combo字段');
    }

    // 添加新列（如果不存在）
    if (!columnNames.includes('description')) {
      await pool.query('ALTER TABLE menu_items ADD COLUMN description TEXT');
      console.log('已添加description字段');
    }
    if (!columnNames.includes('tag')) {
      await pool.query('ALTER TABLE menu_items ADD COLUMN tag VARCHAR(50)');
      console.log('已添加tag字段');
    }

    // 验证表结构
    const [tableInfo] = await pool.query('DESCRIBE menu_items');
    console.log('\n当前menu_items表结构：');
    console.log(tableInfo);

    // 关闭连接池
    await pool.end();
    console.log('\n数据库连接已关闭');
  } catch (error) {
    console.error('发生错误:', error);
  }
}

// 运行更新
updateSchema().catch(console.error); 