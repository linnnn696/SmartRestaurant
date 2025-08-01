import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';

// MySQL 连接配置
const dbConfig = {
  host: 'localhost',
  port: 15000,
  user: 'root',
  password: '123456789'
};

async function initTables() {
  try {
    // 创建数据库连接
    const connection = await mysql.createConnection(dbConfig);
    console.log('数据库连接成功！');

    // 使用order数据库
    await connection.query('USE `order`');
    console.log('已切换到 order 数据库');

    // 1. 初始化餐桌数据
    await connection.query(`
      INSERT INTO tables (qr_code, location) VALUES 
      ('TABLE_001', '大厅1号桌'),
      ('TABLE_002', '大厅2号桌'),
      ('TABLE_003', '大厅3号桌'),
      ('TABLE_004', '包间1号桌'),
      ('TABLE_005', '包间2号桌')
      ON DUPLICATE KEY UPDATE 
        location = VALUES(location),
        updated_at = CURRENT_TIMESTAMP;
    `);
    console.log('1. 餐桌数据初始化成功');

    // 2. 初始化用户数据
    await connection.query(`
      INSERT INTO users (phone_number, points, total_points) VALUES 
      ('13800138000', 150, 500),
      ('13800138001', 80, 200),
      ('13800138002', 200, 800),
      ('13800138003', 50, 150),
      ('wx_user_001', 300, 1000),
      ('wx_user_002', 120, 400)
      ON DUPLICATE KEY UPDATE 
        points = VALUES(points),
        total_points = VALUES(total_points),
        updated_at = CURRENT_TIMESTAMP;
    `);
    console.log('2. 用户数据初始化成功！');

    // 检查用户数据是否存在
    const [userCheck] = await connection.query<RowDataPacket[]>('SELECT user_id, phone_number FROM users');
    if (userCheck.length === 0) {
      throw new Error('用户数据初始化失败，无法继续初始化订单和评价');
    }
    console.log(`已确认：${userCheck.length} 个用户数据初始化成功`);

    // 3. 初始化菜品数据
    await connection.query(`
      INSERT INTO menu_items (name, category, price, image_url, description, tag) VALUES 
      -- 热菜
      ('宫保鸡丁', '热菜', 38.00, 'gongbao_chicken.png', '经典川菜，口感麻辣鲜香', '招牌'),
      ('水煮鱼片', '热菜', 58.00, 'fish_dish.png', '新鲜草鱼片，麻辣鲜香', '特色'),
      ('北京烤鸭', '热菜', 108.00, 'roasted_duck.png', '外酥里嫩，搭配特制酱料', '推荐'),
      ('蒜蓉粉丝扇贝', '热菜', 48.00, 'scallop_dish.png', '新鲜扇贝，蒜香浓郁', '新品'),
      ('青椒炒肉', '热菜', 32.00, 'pork_dish.png', '农家小炒，下饭首选', null),
      ('素炒什锦', '热菜', 28.00, 'mixed_veggies.png', '营养搭配，清淡爽口', null),
      ('鱼香肉丝', '热菜', 36.00, 'yuxiang_pork.png', '传统川菜，酸甜可口', '特色'),
      ('麻婆豆腐', '热菜', 28.00, 'mapo_tofu.png', '川菜代表，麻辣鲜香', '推荐'),
      
      -- 凉菜
      ('凉拌黄瓜', '凉菜', 18.00, 'cucumber_salad.png', '清脆爽口，开胃解腻', null),
      ('凉拌木耳', '凉菜', 22.00, 'black_fungus.png', '爽滑可口，营养丰富', null),
      ('口水鸡', '凉菜', 36.00, 'saliva_chicken.png', '川式凉菜，麻辣爽口', '特色'),
      ('白切鸡', '凉菜', 48.00, 'white_cut_chicken.png', '鲜嫩多汁，配姜葱酱', '推荐'),
      ('皮蛋豆腐', '凉菜', 22.00, 'tofu_egg.png', '经典搭配，营养美味', null),
      
      -- 主食
      ('扬州炒饭', '主食', 28.00, 'yangzhou_rice.png', '色香味俱全，料足味美', '招牌'),
      ('阳春面', '主食', 18.00, 'plain_noodles.png', '汤鲜面滑，经典好味', null),
      ('蒸包子', '主食', 12.00, 'steamed_bun.png', '皮薄馅大，现蒸现卖', null),
      ('和牛炒饭', '主食', 88.00, 'wagyu_rice.png', '顶级食材，入口即化', '新品'),
      ('松露炒饭', '主食', 48.00, 'truffle_rice.png', '奢华新品，松露飘香', '新品'),
      ('蛋炒饭', '主食', 16.00, 'egg_rice.png', '粒粒分明，香气扑鼻', '推荐'),
      
      -- 汤品
      ('例汤', '汤品', 8.00, 'soup_dish.png', '每日新鲜熬制，滋补养生', null),
      ('番茄蛋汤', '汤品', 20.00, 'tomato_soup.png', '家常美味，营养健康', null),
      ('紫菜蛋花汤', '汤品', 20.00, 'seaweed_soup.png', '清淡养生，开胃暖身', null),
      
      -- 饮品
      ('柠檬水', '饮品', 12.00, 'lemon_water.png', '清新柠檬，冰镇提神', null),
      ('茉莉花茶', '饮品', 8.00, 'jasmine_tea.png', '茉莉飘香，回甘悠长', null),
      ('雪碧', '饮品', 6.00, 'sprite.png', '冰镇雪碧，透心凉', null),
      ('可乐', '饮品', 6.00, 'cola.png', '冰镇可乐，畅快爽口', null)
      ON DUPLICATE KEY UPDATE 
        category = VALUES(category),
        price = VALUES(price),
        image_url = VALUES(image_url),
        description = VALUES(description),
        tag = VALUES(tag),
        updated_at = CURRENT_TIMESTAMP;
    `);
    console.log('3. 菜品数据初始化成功！');

    // 4. 创建订单
    console.log('4. 开始初始化订单数据...');
    
    // 4.1 获取用户ID和餐桌ID
    const [users] = await connection.query<RowDataPacket[]>('SELECT user_id FROM users LIMIT 3');
    const [tables] = await connection.query<RowDataPacket[]>('SELECT table_id FROM tables LIMIT 3');
    
    if (users.length < 3 || tables.length < 3) {
      throw new Error('没有足够的用户数据或餐桌数据来创建订单');
    }

    // 4.2 创建订单
    await connection.query(`
      INSERT INTO orders (user_id, table_id, status) VALUES 
      (?, ?, '已完成'),
      (?, ?, '制作中'),
      (?, ?, '已提交')
      ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;
    `, [
      users[0].user_id, tables[0].table_id,
      users[1].user_id, tables[1].table_id,
      users[2].user_id, tables[2].table_id
    ]);
    console.log('4.2 订单基本信息创建成功');

    // 4.3 检查订单是否创建成功
    const [orderCheck] = await connection.query<RowDataPacket[]>('SELECT order_id, user_id FROM orders');
    if (orderCheck.length === 0) {
      throw new Error('订单创建失败，无法继续初始化订单明细和评价');
    }
    console.log(`已确认：${orderCheck.length} 个订单创建成功`);

    // 4.4 获取菜品ID
    const [menuItems] = await connection.query<RowDataPacket[]>('SELECT item_id, price FROM menu_items LIMIT 10');
    if (menuItems.length === 0) {
      throw new Error('没有找到菜品数据');
    }

    // 4.5 添加订单明细
    for (let i = 0; i < orderCheck.length; i++) {
      // 为每个订单随机添加2-4个菜品
      const numItems = Math.floor(Math.random() * 3) + 2; // 2到4个菜品
      for (let j = 0; j < numItems; j++) {
        const menuItem = menuItems[Math.floor(Math.random() * menuItems.length)];
        await connection.query(`
          INSERT INTO order_items (order_id, item_id, quantity, price) 
          VALUES (?, ?, ?, ?)
        `, [
          orderCheck[i].order_id,
          menuItem.item_id,
          Math.floor(Math.random() * 2) + 1, // 1-2份
          menuItem.price
        ]);
      }
    }
    console.log('4.5 订单明细数据初始化成功！');

    // 5. 添加评价数据
    console.log('5. 开始初始化评价数据...');
    
    // 5.1 只为已完成的订单添加评价
    const [completedOrders] = await connection.query<RowDataPacket[]>(
      'SELECT order_id FROM orders WHERE status = ?',
      ['已完成']
    );
    
    if (completedOrders.length > 0) {
      for (const order of completedOrders) {
        await connection.query(`
          INSERT INTO reviews (
            order_id, 
            taste_rating, 
            service_rating, 
            environment_rating, 
            overall_rating, 
            comment,
            reply,
            reply_time
          ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
          ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP
        `, [
          order.order_id,
          Math.floor(Math.random() * 2) + 4, // 4-5分
          Math.floor(Math.random() * 2) + 4, // 4-5分
          Math.floor(Math.random() * 2) + 4, // 4-5分
          Math.floor(Math.random() * 2) + 4, // 4-5分
          '菜品美味，服务周到，环境很好。',
          '感谢您的评价，欢迎再次光临！'
        ]);
      }
      console.log('5.2 评价数据初始化成功！');
    } else {
      console.log('没有已完成的订单，跳过评价数据初始化');
    }

    // 6. 最后进行数据统计
    const [userCount] = await connection.query('SELECT COUNT(*) as count FROM users');
    const [menuCount] = await connection.query('SELECT COUNT(*) as count FROM menu_items');
    const [orderCount] = await connection.query('SELECT COUNT(*) as count FROM orders');
    const [orderItemCount] = await connection.query('SELECT COUNT(*) as count FROM order_items');
    const [reviewCount] = await connection.query('SELECT COUNT(*) as count FROM reviews');

    console.log('\n=== 最终数据统计 ===');
    console.log('用户数量:', (userCount as any)[0].count);
    console.log('菜品数量:', (menuCount as any)[0].count);
    console.log('订单数量:', (orderCount as any)[0].count);
    console.log('订单明细数量:', (orderItemCount as any)[0].count);
    console.log('评价数量:', (reviewCount as any)[0].count);

    // 关闭连接
    await connection.end();
    console.log('\n数据库连接已关闭');

  } catch (error) {
    console.error('初始化数据时出错:', error);
    process.exit(1);
  }
}

initTables(); 