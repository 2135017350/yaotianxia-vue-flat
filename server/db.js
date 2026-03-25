import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

// 创建连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'yaotianxia',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
})

console.log(`[DB] MySQL 连接池已创建: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`)

// 测试连接
pool.getConnection()
  .then(conn => {
    console.log('[DB] MySQL 连接成功！')
    conn.release()
  })
  .catch(err => {
    console.error('[DB] MySQL 连接失败:', err.message)
  })

export default pool
