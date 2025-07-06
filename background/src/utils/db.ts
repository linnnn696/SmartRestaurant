import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  port: 15000,
  user: 'root',
  password: '123456789',
  database: 'order',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool; 