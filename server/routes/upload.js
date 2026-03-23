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
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  try {
    const token = authHeader.slice(7)
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

// 上传文件到数据库
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const user = getUserFromToken(req)
    if (!user) {
      return res.status(401).json({ success: false, message: '未授权，请先登录' })
    }

    // 检查用户是否为管理员（从 token 中读取 role，避免异步查询导致的时序问题）
    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: '仅管理员可上传文件' })
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: '未选择文件' })
    }

    const { uploadType, description } = req.body
    const type = uploadType === 'video' ? 'video' : 'contract'
    const fileName = req.file.originalname // 保留原始文件名（包含中文）
    const fileSize = `${Math.round(req.file.size / 1024)}KB`

    // 将文件内容存入数据库的 file_data 字段
    const [result] = await db.query(
      'INSERT INTO download_resources (name, description, size, file_name, file_data, type, media_type, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [fileName, description || '', fileSize, fileName, req.file.buffer, type, req.file.mimetype, user.id]
    )

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

    // 设置正确的响应头，确保中文文件名正确显示
    res.setHeader('Content-Type', media_type || 'application/octet-stream')
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(file_name)}`)
    res.setHeader('Content-Length', file_data.length)

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
      return res.status(401).json({ success: false, message: '未授权' })
    }

    // 从 token 中检查 role，而不是查询数据库
    if (tokenUser.role !== 'admin') {
      return res.status(403).json({ success: false, message: '仅管理员可删除' })
    }

    const id = parseInt(req.params.id, 10)
    const [result] = await db.query('DELETE FROM download_resources WHERE id = ?', [id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: '文件不存在' })
    }

    res.json({ success: true, message: '删除成功' })
  } catch (error) {
    console.error('删除错误:', error)
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
