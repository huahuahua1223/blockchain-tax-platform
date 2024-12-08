const mysql = require('mysql2');

// 创建数据库连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'tax',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 导出数据库连接池以供其他模块使用
module.exports = pool.promise();
