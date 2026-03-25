import express from 'express'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import path from 'path'
import { fileURLToPath } from 'url'
import LocalStorageService from '../services/LocalStorageService.js'

const JWT_SECRET = process.env.JWT_SECRET || 'yaotianxia_secret'
const router = express.Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 初始化存储服务（本地存储）
const storageService = new LocalStorageService()

// 内存存储（multer 不写入磁盘，由 storageService 处理）
const storage = multer.memoryStorage()

// 文件过滤（只允许特定类型）
const fileFilter = (req, file, cb) => {
  const allowedTypes = /^(pdf|doc|docx|xls|xlsx|mp4|avi|mov|rar|zip|exe|apk)$/i
  const ext = file.originalname.split('.').pop()?.toLowerCase() || ''
  
  if (allowedTypes.test(ext)) {
    console.log(`[UPLOAD] 文件类型校验成功: ${ext}`)
    cb(null, true)
  } else {
    console.warn(`[UPLOAD] 文件类型不支持: ${ext}`)
    cb(new Error(`不支持的文件类型: .${ext}`))
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

// 上传文件接口
router.post('/upload', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('[UPLOAD] Multer 错误:', err.code, err.message)
      if (err.code === 'FILE_TOO_LARGE') {
        return res.status(400).json({ success: false, message: '文件过大，最大 100MB' })
      }
      return res.status(400).json({ success: false, message: `文件上传错误: ${err.message}` })
    } else if (err) {
      console.error('[UPLOAD] 上传错误:', err.message)
      return res.status(400).json({ success: false, message: err.message })
    }
    next()
  })
}, async (req, res) => {
  console.log('[UPLOAD] ===== 上传请求开始 =====')
  console.log('[UPLOAD] 文件信息:', {
    fieldname: req.file?.fieldname,
    originalname: req.file?.originalname,
    size: req.file?.size,
    bufferLength: req.file?.buffer?.length,
  })
  
  try {
    const user = getUserFromToken(req)
    if (!user) {
      console.warn('[UPLOAD] 用户未授权')
      return res.status(401).json({ success: false, message: '未授权，请先登录' })
    }

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
    
    // 修复 multer 中文乱码问题
    let fileName = req.file.originalname
    try {
      fileName = Buffer.from(req.file.originalname, 'latin1').toString('utf8')
      console.log(`[UPLOAD] 文件名编码修正: ${req.file.originalname} -> ${fileName}`)
    } catch (err) {
      console.warn(`[UPLOAD] 文件名编码修正失败: ${err.message}`)
    }
    
    const fileSize = `${Math.round(req.file.size / 1024)}KB`

    // 检查 Buffer 是否有效
    if (!req.file.buffer || req.file.buffer.length === 0) {
      console.error(`[UPLOAD] 错误: 文件 Buffer 为空, size=${req.file.size}`)
      return res.status(400).json({ success: false, message: '文件内容为空' })
    }

    console.log(`[UPLOAD] 准备保存文件：文件名=${fileName}，大小=${fileSize}，Buffer大小=${req.file.buffer.length} bytes`)

    // 调用存储服务保存文件
    const storageResult = await storageService.saveFile(
      fileName,
      req.file.buffer,
      req.file.mimetype
    )

    console.log(`[UPLOAD] 文件已保存，路径=${storageResult.path}`)

    // 导入 db 模块
    const { default: db } = await import('../db.js')

    // 将文件信息存入数据库
    const [result] = await db.query(
      'INSERT INTO download_resources (name, description, size, file_name, file_path, type, media_type, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [fileName, description || '', fileSize, fileName, storageResult.path, type, req.file.mimetype, user.id]
    )

    // MySQL 返回的 insertId 在 result.insertId 中
    const insertedId = result.insertId

    if (!insertedId) {
      console.error('[UPLOAD] 数据库插入失败：无法获取插入的 ID')
      console.error('[UPLOAD] result 对象:', result)
      // 删除已保存的文件
      await storageService.deleteFile(storageResult.path).catch(err => {
        console.error('[UPLOAD] 删除文件失败:', err)
      })
      return res.status(500).json({ success: false, message: '文件保存失败，请检查数据库配置' })
    }

    // 验证数据库记录是否存在
    const [verify] = await db.query(
      'SELECT id, file_name, file_path FROM download_resources WHERE id = ?',
      [insertedId]
    )
    if (!verify || verify.length === 0) {
      console.error(`[UPLOAD] 数据库验证失败：ID=${insertedId} 的记录不存在`)
      await storageService.deleteFile(storageResult.path).catch(err => {
        console.error('[UPLOAD] 删除文件失败:', err)
      })
      return res.status(500).json({ success: false, message: '文件保存失败，验证不通过' })
    }

    console.log(`[UPLOAD] 文件上传成功，ID=${insertedId}，文件名=${fileName}`)
    res.json({
      success: true,
      message: '上传成功',
      data: {
        id: insertedId,
        originalname: fileName,
        filename: fileName,
        size: req.file.size,
        path: storageResult.path,
      }
    })
  } catch (error) {
    console.error('[UPLOAD] 上传错误:', error)
    res.status(500).json({ success: false, message: error.message || '上传失败' })
  }
})

// 获取文件列表
router.get('/uploads/list', async (req, res) => {
  try {
    const { default: db } = await import('../db.js')
    const [rows] = await db.query(
      'SELECT dr.id, dr.name, dr.file_name, dr.description, dr.size, dr.type, dr.created_by, dr.created_at, u.username AS uploaded_by FROM download_resources dr LEFT JOIN users u ON dr.created_by = u.id ORDER BY dr.created_at DESC'
    )
    res.json({ success: true, data: rows })
  } catch (error) {
    console.error('[LIST] 获取列表错误:', error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// 直接下载文件（通过静态路由）
// 前端应该直接访问 /downloads/文件名，而不是调用 API
// 这个接口仅作为备选方案
router.get('/uploads/:id/download', async (req, res) => {
  try {
    const { default: db } = await import('../db.js')
    const id = parseInt(req.params.id, 10)
    
    console.log(`[DOWNLOAD] 下载请求，ID=${id}`)
    
    const [rows] = await db.query(
      'SELECT file_name, file_path FROM download_resources WHERE id = ?',
      [id]
    )

    if (!rows || rows.length === 0) {
      console.warn(`[DOWNLOAD] 记录不存在，ID=${id}`)
      return res.status(404).json({ success: false, message: '文件不存在' })
    }

    const { file_name, file_path } = rows[0]

    // 检查文件是否存在
    const exists = await storageService.fileExists(file_path)
    if (!exists) {
      console.error(`[DOWNLOAD] 文件不存在，ID=${id}，路径=${file_path}`)
      return res.status(404).json({ success: false, message: '文件已删除或不存在' })
    }

    // 获取文件内容
    const fileBuffer = await storageService.getFileStream(file_path)

    // 设置正确的响应头
    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(file_name)}`)
    res.setHeader('Content-Length', fileBuffer.length)

    console.log(`[DOWNLOAD] 下载成功，ID=${id}，文件名=${file_name}，大小=${fileBuffer.length} bytes`)
    res.send(fileBuffer)
  } catch (error) {
    console.error('[DOWNLOAD] 下载错误:', error)
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: error.message || '下载失败' })
    }
  }
})

// 删除文件
router.delete('/uploads/:id', async (req, res) => {
  try {
    const { default: db } = await import('../db.js')
    const id = parseInt(req.params.id, 10)

    const user = getUserFromToken(req)
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: '仅管理员可删除文件' })
    }

    const [rows] = await db.query(
      'SELECT file_path FROM download_resources WHERE id = ?',
      [id]
    )

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: '文件不存在' })
    }

    const { file_path } = rows[0]

    // 删除物理文件
    await storageService.deleteFile(file_path).catch(err => {
      console.warn('[DELETE] 删除物理文件失败:', err)
    })

    // 删除数据库记录
    const [result] = await db.query(
      'DELETE FROM download_resources WHERE id = ?',
      [id]
    )

    // MySQL 返回 affectedRows
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: '文件不存在' })
    }

    console.log(`[DELETE] 文件删除成功，ID=${id}`)
    res.json({ success: true, message: '文件删除成功' })
  } catch (error) {
    console.error('[DELETE] 删除错误:', error)
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
