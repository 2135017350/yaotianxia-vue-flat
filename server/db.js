import sql from 'mssql'
import dotenv from 'dotenv'

dotenv.config()

// SQL Server 连接配置
const config = {
  server: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'yaotianxia',
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',          // Azure 云端需设为 true
    trustServerCertificate: process.env.DB_TRUST_CERT !== 'false', // 本地/自签名证书设为 true
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMilliseconds: 30000,
  },
  connectionTimeout: 30000,
  requestTimeout: 30000,
}

let pool = null

// 初始化连接池
async function getPool() {
  if (!pool) {
    pool = await sql.connect(config)
    console.log(`[DB] SQL Server 连接池已创建: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`)
  }
  return pool
}

// 将 ? 占位符替换为 @p1, @p2, ... 并构建 mssql Request
async function buildRequest(queryStr, params = []) {
  const p = await getPool()
  const request = p.request()

  // 将 ? 替换为 @p1, @p2, ...
  let idx = 0
  const namedQuery = queryStr.replace(/\?/g, () => {
    idx++
    return `@p${idx}`
  })

  // 绑定参数
  for (let i = 0; i < params.length; i++) {
    const val = params[i]
    if (val === null || val === undefined) {
      request.input(`p${i + 1}`, sql.NVarChar, null)
    } else if (typeof val === 'number' && Number.isInteger(val)) {
      request.input(`p${i + 1}`, sql.Int, val)
    } else if (typeof val === 'number') {
      request.input(`p${i + 1}`, sql.Float, val)
    } else if (val instanceof Date) {
      request.input(`p${i + 1}`, sql.DateTime2, val)
    } else {
      request.input(`p${i + 1}`, sql.NVarChar(sql.MAX), String(val))
    }
  }

  return { request, namedQuery }
}

/**
 * 统一查询接口，兼容 mysql2 的 [rows, fields] 返回格式。
 *
 * 对于 SELECT：返回 [recordset, undefined]
 * 对于 INSERT/UPDATE/DELETE：返回 [{ insertId, affectedRows }, undefined]
 *   - insertId：通过 OUTPUT INSERTED.id 或 @@IDENTITY 获取
 *   - affectedRows：通过 rowsAffected[0] 获取
 */
const db = {
  async query(queryStr, params = []) {
    try {
      const trimmed = queryStr.trim().toUpperCase()

      // INSERT 语句：自动追加 OUTPUT INSERTED.id 以获取自增主键
      if (trimmed.startsWith('INSERT')) {
        return await db._insertQuery(queryStr, params)
      }

      const { request, namedQuery } = await buildRequest(queryStr, params)
      const result = await request.query(namedQuery)

      if (trimmed.startsWith('SELECT')) {
        return [result.recordset, undefined]
      }

      // UPDATE / DELETE
      return [
        {
          affectedRows: result.rowsAffected ? result.rowsAffected[0] : 0,
          insertId: null,
        },
        undefined,
      ]
    } catch (err) {
      console.error('[DB] 查询错误:', err.message)
      console.error('[DB] SQL:', queryStr)
      throw err
    }
  },

  async _insertQuery(queryStr, params) {
    // 在 VALUES 子句之前插入 OUTPUT INSERTED.id
    // 兼容格式：INSERT INTO table (...) VALUES (...)
    const outputQuery = queryStr.replace(
      /\)\s*VALUES\s*\(/i,
      ') OUTPUT INSERTED.id VALUES ('
    )

    const { request, namedQuery } = await buildRequest(outputQuery, params)
    const result = await request.query(namedQuery)

    const insertId =
      result.recordset && result.recordset.length > 0
        ? result.recordset[0].id
        : null

    return [
      {
        insertId,
        affectedRows: result.rowsAffected ? result.rowsAffected[0] : 1,
      },
      undefined,
    ]
  },
}

// 测试连接（异步，不阻塞模块加载）
getPool()
  .then(() => {
    console.log('[DB] SQL Server 连接成功！')
  })
  .catch((err) => {
    console.error('[DB] SQL Server 连接失败:', err.message)
  })

export default db
