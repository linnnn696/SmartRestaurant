import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  port: 15000,
  user: 'root',
  password: '123456789'
};

async function checkSchema() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query('USE `order`');
    
    const [rows] = await connection.query('SHOW CREATE TABLE orders');
    console.log('Orders表结构：');
    console.log(rows[0]['Create Table']);
    
    await connection.end();
  } catch (error) {
    console.error('发生错误:', error);
  }
}

checkSchema(); 