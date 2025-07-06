import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  port: 15000,
  user: 'root',
  password: '123456789'
};

async function fixMenuItems() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query('USE `order`');
    
    // 1. 先备份order_items表的数据
    console.log('备份order_items数据...');
    const [orderItems] = await connection.query('SELECT * FROM order_items');
    
    // 2. 删除外键约束
    console.log('删除外键约束...');
    await connection.query('ALTER TABLE order_items DROP FOREIGN KEY order_items_ibfk_2');
    
    // 3. 删除旧表
    console.log('删除旧的menu_items表...');
    await connection.query('DROP TABLE IF EXISTS menu_items');
    
    // 4. 创建新表（添加唯一约束）
    console.log('创建新的menu_items表...');
    await connection.query(`
      CREATE TABLE menu_items (
        item_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        category VARCHAR(50) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        image_url VARCHAR(255),
        description TEXT,
        tag VARCHAR(50),
        status BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_tag (tag)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 5. 插入初始数据
    console.log('插入初始菜品数据...');
    await connection.query(`
      INSERT INTO menu_items (name, category, price, image_url, description, tag) VALUES 
      -- 热菜
      ('宫保鸡丁', '热菜', 38.00, 'dishes/hot/gongbao_chicken.png', '经典川菜，口感麻辣鲜香', '招牌'),
      ('鱼香肉丝', '热菜', 36.00, 'dishes/hot/yuxiang_pork.png', '传统川菜，酸甜可口', '特色'),
      ('麻婆豆腐', '热菜', 28.00, 'dishes/hot/mapo_tofu.png', '川菜代表，麻辣鲜香', '推荐'),
      ('青椒炒肉', '热菜', 32.00, 'dishes/hot/pepper_pork.png', '农家小炒，下饭首选', null),
      
      -- 凉菜
      ('口水鸡', '凉菜', 36.00, 'dishes/cold/saliva_chicken.png', '川式凉菜，麻辣爽口', '特色'),
      ('凉拌黄瓜', '凉菜', 18.00, 'dishes/cold/cucumber_salad.png', '清脆爽口，开胃解腻', null),
      ('皮蛋豆腐', '凉菜', 22.00, 'dishes/cold/tofu_egg.png', '经典搭配，营养美味', null),
      
      -- 汤品
      ('番茄蛋汤', '汤品', 20.00, 'dishes/soup/tomato_soup.png', '家常美味，营养健康', null),
      ('紫菜蛋花汤', '汤品', 20.00, 'dishes/soup/seaweed_soup.png', '清淡养生，开胃暖身', null),
      
      -- 主食
      ('蛋炒饭', '主食', 16.00, 'dishes/staple/egg_rice.png', '粒粒分明，香气扑鼻', '推荐'),
      ('阳春面', '主食', 12.00, 'dishes/staple/plain_noodles.png', '汤鲜面滑，经典好味', null),
      ('松露炒饭', '主食', 48.00, 'dishes/staple/truffle_rice.png', '奢华新品，松露飘香', '新品'),
      ('和牛炒饭', '主食', 88.00, 'dishes/staple/wagyu_rice.png', '顶级食材，入口即化', '新品'),

      -- 饮品
      ('可乐', '饮品', 6.00, 'dishes/drink/cola.png', '百事可乐', null),
      ('雪碧', '饮品', 6.00, 'dishes/drink/sprite.png', '清爽解腻', null),
      ('茉莉花茶', '饮品', 8.00, 'dishes/drink/jasmine_tea.png', '清香怡人', null),
      ('柠檬水', '饮品', 8.00, 'dishes/drink/lemon_water.png', '新鲜柠檬', null)
    `);

    // 6. 重新添加外键约束
    console.log('重新添加外键约束...');
    await connection.query(`
      ALTER TABLE order_items 
      ADD CONSTRAINT order_items_ibfk_2 
      FOREIGN KEY (item_id) 
      REFERENCES menu_items(item_id)
    `);

    // 7. 验证数据
    const [items] = await connection.query('SELECT * FROM menu_items ORDER BY category, name');
    console.log('\n=== 当前菜品数据 ===');
    console.log(items);

    await connection.end();
    console.log('\n数据库修复完成！');
  } catch (error) {
    console.error('发生错误:', error);
  }
}

fixMenuItems(); 