import express from 'express'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const JWT_SECRET = process.env.JWT_SECRET || 'yaotianxia_secret'
const router = express.Router()

// 内存存储（不写入磁盘）
const storage = multer.memoryStorage()

// 文件过滤（只允许特定类型）
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|xls|xlsx|mp4|avi|mov|rar|zip/
  const extname = allowedTypes.test(file.originalname.split('.').pop().toLowerCase())
  if (extname) {
    cb(null, true)
  } else {
    cb(new Error('不支持的文件类型'))
  }
}

// 限制文件大小（100MB）
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }
})

function getUserFromToken(req) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('[AUTH] 缺少 Authorization 头')
    return null
  }
  try {
    const token = authHeader.slice(7)
    const decoded = jwt.verify(token, JWT_SECRET)
    console.log('[AUTH] Token 解析成功:', { id: decoded.id, role: decoded.role })
    return decoded
  } catch (err) {
    console.error('[AUTH] Token 验证失败:', err.message)
    return null
  }
}

// 上传文件到数据库
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const user = getUserFromToken(req)
    if (!user) {
      console.warn('[UPLOAD] 用户未授权')
      return res.status(401).json({ success: false, message: '未授权，请先登录' })
    }

    // 检查用户是否为管理员（从 token 中读取 role，避免异步查询导致的时序问题）
    if (!user.role || user.role !== 'admin') {
      console.warn(`[UPLOAD] 用户 ${user.id} 权限不足，role=${user.role}`)
      return res.status(403).json({ success: false, message: '仅管理员可上传文件' })
    }
    console.log(`[UPLOAD] 管理员 ${user.id} 开始上传文件`)

    if (!req.file) {
      return res.status(400).json({ success: false, message: '未选择文件' })
    }

    const { uploadType, description } = req.body
    const type = uploadType === 'video' ? 'video' : 'contract'
    
    // 确保文件名使用 UTF-8 编码
    let fileName = req.file.originalname
    if (Buffer.isBuffer(fileName)) {
      fileName = fileName.toString('utf8')
    }
    
    const fileSize = `${Math.round(req.file.size / 1024)}KB`
    const fileBuffer = req.file.buffer

    console.log(`[UPLOAD] 准备写入数据库：文件名=${fileName}，大小=${fileSize}，缓冲区=${fileBuffer.length} bytes`)

    // 将文件内容存入数据库的 file_data 字段
    const [result] = await db.query(
      'INSERT INTO download_resources (name, description, size, file_name, file_path, file_data, type, media_type, created_by) VALUES (?, ?, ?, ?, NULL, ?, ?, ?, ?)',
      [fileName, description || '', fileSize, fileName, fileBuffer, type, req.file.mimetype, user.id]
    )

    // 校验插入结果
    if (!result || !result.insertId) {
      console.error('[UPLOAD] 数据库插入失败：insertId 为空')
      return res.status(500).json({ success: false, message: '文件保存失败，请检查数据库配置' })
    }

    // 验证文件是否真的写入了数据库
    const [verify] = await db.query(
      'SELECT id, file_name, OCTET_LENGTH(file_data) as data_size FROM download_resources WHERE id = ?',
      [result.insertId]
    )
    if (!verify || verify.length === 0) {
      console.error(`[UPLOAD] 数据库验证失败：ID=${result.insertId} 的记录不存在`)
      return res.status(500).json({ success: false, message: '文件保存失败，验证不通过' })
    }
    if (!verify[0].data_size || verify[0].data_size === 0) {
      console.error(`[UPLOAD] 数据库验证失败：ID=${result.insertId} 的文件数据为空，大小=${verify[0].data_size}`)
      return res.status(500).json({ success: false, message: '文件数据保存失败，请检查 max_allowed_packet 配置' })
    }

    console.log(`[UPLOAD] 文件上传成功，ID=${result.insertId}，文件名=${fileName}，数据库已验证，实际大小=${verify[0].data_size} bytes`)
    res.json({
      success: true,
      message: '上传成功',
      data: {
        id: result.insertId,
        filename: fileName,
        size: req.file.size,
      }
    })
  } catch (error) {
    console.error('上传错误:', error)
    res.status(500).json({ success: false, message: error.message || '上传失败' })
  }
})

// 获取文件列表
router.get('/uploads/list', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, file_name, description, size, type, created_by, created_at, (SELECT username FROM users WHERE id = created_by) AS uploaded_by FROM download_resources ORDER BY created_at DESC'
    )
    res.json({ success: true, data: rows })
  } catch (error) {
    console.error('获取列表错误:', error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// 下载文件（从数据库读取）
router.get('/uploads/:id/download', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)
    const [rows] = await db.query(
      'SELECT file_name, file_data, media_type FROM download_resources WHERE id = ?',
      [id]
    )

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: '文件不存在' })
    }

    const { file_name, file_data, media_type } = rows[0]

    if (!file_data || file_data.length === 0) {
      console.error(`[DOWNLOAD] 文件数据为空，ID=${id}`)
      return res.status(404).json({ success: false, message: '文件数据为空' })
    }

    // 设置正确的响应头，确保中文文件名正确显示
    res.setHeader('Content-Type', media_type || 'application/octet-stream')
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(file_name)}`)
    res.setHeader('Content-Length', file_data.length)

    console.log(`[DOWNLOAD] 下载文件，ID=${id}，文件名=${file_name}，大小=${file_data.length} bytes`)
    res.send(file_data)
  } catch (error) {
    console.error('下载错误:', error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// 删除文件（仅管理员）
router.delete('/uploads/:id', async (req, res) => {
  try {
    const tokenUser = getUserFromToken(req)
    if (!tokenUser) {
      console.warn('[DELETE] 用户未授权')
      return res.status(401).json({ success: false, message: '未授权' })
    }

    // 从 token 中检查 role，而不是查询数据库
    if (!tokenUser.role || tokenUser.role !== 'admin') {
      console.warn(`[DELETE] 用户 ${tokenUser.id} 权限不足，role=${tokenUser.role}`)
      return res.status(403).json({ success: false, message: '仅管理员可删除' })
    }

    const id = parseInt(req.params.id, 10)
    const [result] = await db.query('DELETE FROM download_resources WHERE id = ?', [id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: '文件不存在' })
    }

    console.log(`[DELETE] 文件删除成功，ID=${id}`)
    res.json({ success: true, message: '删除成功' })
  } catch (error) {
    console.error('删除错误:', error)
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
