import express from 'express'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import db from '../db.js'

const JWT_SECRET = process.env.JWT_SECRET || 'yaotianxia_secret'
const router = express.Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../public/downloads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
  console.log(`[INIT] 创建上传目录: ${uploadDir}`)
}

// 自定义存储配置（保留原始文件名，避免乱码）
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    // 保留原始文件名（包含中文），multer 会自动处理编码
    cb(null, file.originalname)
  }
})

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

// 上传文件到本地文件系统
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const user = getUserFromToken(req)
    if (!user) {
      console.warn('[UPLOAD] 用户未授权')
      return res.status(401).json({ success: false, message: '未授权，请先登录' })
    }

    // 检查用户是否为管理员
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
    const fileName = req.file.originalname // 原始文件名（包含中文）
    const filePath = `/downloads/${fileName}` // 相对路径，用于下载
    const fileSize = `${Math.round(req.file.size / 1024)}KB`

    console.log(`[UPLOAD] 文件已保存到磁盘: ${req.file.path}`)
    console.log(`[UPLOAD] 准备写入数据库：文件名=${fileName}，路径=${filePath}，大小=${fileSize}`)

    // 将文件信息存入数据库
    const [result] = await db.query(
      'INSERT INTO download_resources (name, description, size, file_name, file_path, type, media_type, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [fileName, description || '', fileSize, fileName, filePath, type, req.file.mimetype, user.id]
    )

    if (!result || !result.insertId) {
      console.error('[UPLOAD] 数据库插入失败：insertId 为空')
      // 删除已上传的文件
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('[UPLOAD] 删除文件失败:', err)
      })
      return res.status(500).json({ success: false, message: '文件保存失败，请检查数据库配置' })
    }

    // 验证数据库记录是否存在
    const [verify] = await db.query(
      'SELECT id, file_name, file_path FROM download_resources WHERE id = ?',
      [result.insertId]
    )
    if (!verify || verify.length === 0) {
      console.error(`[UPLOAD] 数据库验证失败：ID=${result.insertId} 的记录不存在`)
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('[UPLOAD] 删除文件失败:', err)
      })
      return res.status(500).json({ success: false, message: '文件保存失败，验证不通过' })
    }

    console.log(`[UPLOAD] 文件上传成功，ID=${result.insertId}，文件名=${fileName}`)
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
    console.error('[UPLOAD] 上传错误:', error)
    // 如果上传过程中出错，删除已保存的文件
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('[UPLOAD] 删除文件失败:', err)
      })
    }
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
    console.error('[LIST] 获取列表错误:', error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// 下载文件（从本地文件系统读取）
router.get('/uploads/:id/download', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)
    const [rows] = await db.query(
      'SELECT file_name, file_path FROM download_resources WHERE id = ?',
      [id]
    )

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: '文件不存在' })
    }

    const { file_name, file_path } = rows[0]
    const fullPath = path.join(__dirname, '../public', file_path)

    // 检查文件是否存在
    if (!fs.existsSync(fullPath)) {
      console.error(`[DOWNLOAD] 文件不存在，ID=${id}，路径=${fullPath}`)
      return res.status(404).json({ success: false, message: '文件已删除或不存在' })
    }

    // 设置正确的响应头，确保中文文件名正确显示
    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(file_name)}`)

    console.log(`[DOWNLOAD] 下载文件，ID=${id}，文件名=${file_name}，路径=${fullPath}`)
    res.download(fullPath, file_name)
  } catch (error) {
    console.error('[DOWNLOAD] 下载错误:', error)
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

    // 从 token 中检查 role
    if (!tokenUser.role || tokenUser.role !== 'admin') {
      console.warn(`[DELETE] 用户 ${tokenUser.id} 权限不足，role=${tokenUser.role}`)
      return res.status(403).json({ success: false, message: '仅管理员可删除' })
    }

    const id = parseInt(req.params.id, 10)
    
    // 先查询文件路径
    const [rows] = await db.query(
      'SELECT file_path FROM download_resources WHERE id = ?',
      [id]
    )

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: '文件不存在' })
    }

    const { file_path } = rows[0]
    const fullPath = path.join(__dirname, '../public', file_path)

    // 删除数据库记录
    const [result] = await db.query('DELETE FROM download_resources WHERE id = ?', [id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: '文件不存在' })
    }

    // 删除本地文件
    if (fs.existsSync(fullPath)) {
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error(`[DELETE] 删除文件失败，ID=${id}，路径=${fullPath}:`, err)
        } else {
          console.log(`[DELETE] 文件已删除，ID=${id}，路径=${fullPath}`)
        }
      })
    }

    console.log(`[DELETE] 文件删除成功（数据库），ID=${id}`)
    res.json({ success: true, message: '删除成功' })
  } catch (error) {
    console.error('[DELETE] 删除错误:', error)
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
