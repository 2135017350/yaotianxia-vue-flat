import sql from 'mssql'
import dotenv from 'dotenv'

dotenv.config()

// SQL Server 连接配置
const config = {
  server: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 1433,
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'YourPassword123',
  database: process.env.DB_NAME || 'yaotianxia',
  authentication: {
    type: 'default',
    options: {
      userName: process.env.DB_USER || 'sa',
      password: process.env.DB_PASSWORD || 'YourPassword123',
    }
  },
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true' || false,
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true' || true,
    enableKeepAlive: true,
    keepAliveInitialDelaySeconds: 0,
  },
  pool: {
    min: 0,
    max: 10,
  },
  connectionTimeout: 15000,
  requestTimeout: 30000,
}

// 创建连接池
let pool = null

async function getPool() {
  if (pool) {
    return pool
  }

  try {
    pool = new sql.ConnectionPool(config)
    
    pool.on('error', (err) => {
      console.error('[DB] 连接池错误:', err)
      pool = null
    })

    await pool.connect()
    console.log('[DB] SQL Server 连接池已创建')
    return pool
  } catch (error) {
    console.error('[DB] SQL Server 连接失败:', error)
    pool = null
    throw error
  }
}

// 执行查询的包装函数（兼容 MySQL 的 API）
async function query(sql, params = []) {
  try {
    const pool = await getPool()
    const request = pool.request()

    // 为参数添加绑定
    if (Array.isArray(params) && params.length > 0) {
      let paramIndex = 1
      // 将 ? 替换为 @p1, @p2 等
      let modifiedSql = sql
      const paramNames = []
      
      for (let i = 0; i < params.length; i++) {
        const paramName = `@p${paramIndex}`
        paramNames.push(paramName)
        request.input(`p${paramIndex}`, params[i])
        paramIndex++
      }

      // 替换 SQL 中的 ?
      for (const paramName of paramNames) {
        modifiedSql = modifiedSql.replace('?', paramName)
      }

      const result = await request.query(modifiedSql)
      return [result.recordset, result]
    } else {
      const result = await request.query(sql)
      return [result.recordset, result]
    }
  } catch (error) {
    console.error('[DB] 查询错误:', error.message)
    console.error('[DB] SQL:', sql)
    throw error
  }
}

// 关闭连接池
async function closePool() {
  if (pool) {
    await pool.close()
    pool = null
    console.log('[DB] 连接池已关闭')
  }
}

export default {
  query,
  getPool,
  closePool,
}
