import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';

// MySQL 连接配置
const dbConfig = {
  host: 'localhost',
  port: 15000,
  user: 'root',
  password: '123456789'
};

interface DataDirResult extends RowDataPacket {
  Variable_name: string;
  Value: string;
}

interface TableStatus extends RowDataPacket {
  Name: string;
  Engine: string;
  Rows: number;
  Data_length: number;
  Index_length: number;
}

interface TableStructure extends RowDataPacket {
  'Table': string;
  'Create Table': string;
}

async function main() {
  try {
    // 创建数据库连接
    const connection = await mysql.createConnection(dbConfig);
    console.log('数据库连接成功！');

    // 创建order数据库（如果不存在）
    await connection.query('CREATE DATABASE IF NOT EXISTS `order`');
    console.log('已创建 order 数据库');

    // 使用order数据库
    await connection.query('USE `order`');
    console.log('已切换到 order 数据库');

    // 删除现有表（按照依赖关系的反序删除）
    await connection.query('DROP TABLE IF EXISTS reviews');
    await connection.query('DROP TABLE IF EXISTS order_items');
    await connection.query('DROP TABLE IF EXISTS orders');
    await connection.query('DROP TABLE IF EXISTS menu_items');
    await connection.query('DROP TABLE IF EXISTS tables');
    await connection.query('DROP TABLE IF EXISTS users');

    // 创建用户信息表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '用户唯一标识',
        phone_number VARCHAR(50) UNIQUE COMMENT '电话/微信ID',
        register_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        points INT NOT NULL DEFAULT 0 COMMENT '用户积分',
        total_points INT NOT NULL DEFAULT 0 COMMENT '历史总积分'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户信息表';
    `);
    console.log('用户信息表创建成功！');

    // 创建餐桌信息表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tables (
        table_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '餐桌编号',
        qr_code VARCHAR(255) UNIQUE NOT NULL COMMENT '餐桌二维码编码',
        location VARCHAR(100) COMMENT '餐桌位置',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='餐桌信息表';
    `);
    console.log('餐桌信息表创建成功！');

    // 创建菜单菜品表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        item_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '菜品ID',
        name VARCHAR(100) NOT NULL COMMENT '菜品名称',
        category VARCHAR(50) NOT NULL COMMENT '分类',
        price DECIMAL(10,2) NOT NULL COMMENT '单价',
        image_url VARCHAR(255) COMMENT '图片链接',
        description TEXT COMMENT '描述',
        tag VARCHAR(50) COMMENT '标签',
        is_hot BOOLEAN DEFAULT FALSE COMMENT '是否热销菜',
        is_new BOOLEAN DEFAULT FALSE COMMENT '是否新品',
        is_combo BOOLEAN DEFAULT FALSE COMMENT '是否套餐',
        status BOOLEAN DEFAULT TRUE COMMENT '是否可用',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        INDEX idx_category (category),
        INDEX idx_hot_new_combo (is_hot, is_new, is_combo)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='菜单菜品表';
    `);
    console.log('菜单菜品表创建成功！');

    // 创建订单总表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        order_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '订单ID',
        table_id INT COMMENT '对应桌台ID',
        user_id INT NOT NULL COMMENT '下单用户ID',
        status VARCHAR(20) NOT NULL DEFAULT '已提交' COMMENT '状态（已提交/制作中/待取餐/已完成）',
        total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '订单总金额',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        FOREIGN KEY (table_id) REFERENCES tables(table_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        INDEX idx_status (status),
        INDEX idx_table_status (table_id, status),
        INDEX idx_user (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单总表';
    `);
    console.log('订单总表创建成功！');

    // 创建订单详情表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        order_item_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '明细ID',
        order_id INT NOT NULL COMMENT '所属订单ID',
        item_id INT NOT NULL COMMENT '菜品ID',
        quantity INT NOT NULL DEFAULT 1 COMMENT '数量',
        price DECIMAL(10,2) NOT NULL COMMENT '单项价格',
        subtotal DECIMAL(10,2) GENERATED ALWAYS AS (quantity * price) STORED COMMENT '小计金额',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
        FOREIGN KEY (item_id) REFERENCES menu_items(item_id),
        INDEX idx_order (order_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单详情表';
    `);
    console.log('订单详情表创建成功！');

    // 创建评价表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        review_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '评价ID',
        order_id INT NOT NULL COMMENT '关联订单ID',
        taste_rating TINYINT NOT NULL COMMENT '口味评分(1-5)',
        service_rating TINYINT NOT NULL COMMENT '服务评分(1-5)',
        environment_rating TINYINT NOT NULL COMMENT '环境评分(1-5)',
        overall_rating TINYINT NOT NULL COMMENT '整体评分(1-5)',
        comment TEXT COMMENT '评价内容',
        reply TEXT COMMENT '商家回复',
        reply_time DATETIME COMMENT '回复时间',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '评价时间',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
        INDEX idx_order (order_id),
        INDEX idx_ratings (overall_rating, taste_rating, service_rating, environment_rating)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='餐后评价表';
    `);
    console.log('评价表创建成功！');

    // 创建触发器：更新订单总金额
    await connection.query(`
      CREATE TRIGGER IF NOT EXISTS update_order_total
      AFTER INSERT ON order_items
      FOR EACH ROW
      BEGIN
        UPDATE orders 
        SET total_amount = (
          SELECT SUM(subtotal) 
          FROM order_items 
          WHERE order_id = NEW.order_id
        )
        WHERE order_id = NEW.order_id;
      END;
    `);
    console.log('订单总金额更新触发器创建成功！');

    // 检查并添加points字段
    try {
      await connection.query(`
        ALTER TABLE users
        ADD COLUMN points INT NOT NULL DEFAULT 0 COMMENT '用户积分';
      `);
      console.log('points字段添加成功！');
    } catch (error: any) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('points字段已存在');
      } else {
        throw error;
      }
    }

    // 检查并添加total_points字段
    try {
      await connection.query(`
        ALTER TABLE users
        ADD COLUMN total_points INT NOT NULL DEFAULT 0 COMMENT '历史总积分';
      `);
      console.log('total_points字段添加成功！');
    } catch (error: any) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('total_points字段已存在');
      } else {
        throw error;
      }
    }

    // 查询所有表的信息
    const [tables] = await connection.query(`
      SELECT 
        table_name AS '表名',
        table_comment AS '描述',
        table_rows AS '预估行数'
      FROM 
        information_schema.tables 
      WHERE 
        table_schema = 'order'
    `);
    console.log('\n数据库表信息:');
    console.log(tables);

    // 关闭连接
    await connection.end();
    console.log('\n数据库连接已关闭');
  } catch (error) {
    console.error('发生错误:', error);
  }
}

// 运行主函数
main().catch(console.error);
