import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  port: 15000,
  user: 'root',
  password: '123456789'
};

async function checkMenuItems() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query('USE `order`');
    
    // 1. 检查表结构
    const [tableInfo] = await connection.query('SHOW CREATE TABLE menu_items');
    console.log('\n=== menu_items表结构 ===');
    console.log(tableInfo[0]['Create Table']);

    // 2. 检查是否有重复数据
    const [duplicates] = await connection.query(`
      SELECT name, COUNT(*) as count
      FROM menu_items
      GROUP BY name
      HAVING count > 1
    `);
    console.log('\n=== 重复的菜品 ===');
    console.log(duplicates);

    // 3. 检查所有菜品
    const [allItems] = await connection.query(`
      SELECT item_id, name, category, price, tag
      FROM menu_items
      ORDER BY category, name
    `);
    console.log('\n=== 所有菜品 ===');
    console.log(allItems);

    await connection.end();
  } catch (error) {
    console.error('发生错误:', error);
  }
}

checkMenuItems(); 