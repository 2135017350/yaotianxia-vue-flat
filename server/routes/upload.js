import express from 'express'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import LocalStorageService from '../services/LocalStorageService.js'
// import S3StorageService from '../services/S3StorageService.js' // 未来可切换到云存储

const JWT_SECRET = process.env.JWT_SECRET || 'yaotianxia_secret'
const router = express.Router()

// 初始化存储服务（默认使用本地存储）
// 如需切换到 S3 兼容存储（阿里云 OSS、腾讯云 COS 等），修改下面一行即可：
// const storageService = new S3StorageService()
const storageService = new LocalStorageService()

// 内存存储（multer 不写入磁盘，由 storageService 处理）
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

// 上传文件
router.post('/upload', upload.single('file'), async (req, res) => {
  // 调试：打印 req.file 的完整结构
  console.log('[UPLOAD] req.file 的完整结构:', {
    fieldname: req.file?.fieldname,
    originalname: req.file?.originalname,
    encoding: req.file?.encoding,
    mimetype: req.file?.mimetype,
    size: req.file?.size,
    bufferLength: req.file?.buffer?.length,
  })
  console.log('[UPLOAD] req.headers:', req.headers)
  console.log('[UPLOAD] req.body:', req.body)
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
    
    // 修复 multer 中文乱码问题：将 latin1 编码的文件名转换为 UTF-8
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

    // 导入 db 模块（需要在使用时导入，避免循环依赖）
    const { default: db } = await import('../db.js')

    // 将文件信息存入数据库
    const [result] = await db.query(
      'INSERT INTO download_resources (name, description, size, file_name, file_path, type, media_type, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [fileName, description || '', fileSize, fileName, storageResult.path, type, req.file.mimetype, user.id]
    )

    if (!result || !result.insertId) {
      console.error('[UPLOAD] 数据库插入失败：insertId 为空')
      // 删除已保存的文件
      await storageService.deleteFile(storageResult.path).catch(err => {
        console.error('[UPLOAD] 删除文件失败:', err)
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
      await storageService.deleteFile(storageResult.path).catch(err => {
        console.error('[UPLOAD] 删除文件失败:', err)
      })
      return res.status(500).json({ success: false, message: '文件保存失败，验证不通过' })
    }

    console.log(`[UPLOAD] 文件上传成功，ID=${result.insertId}，文件名=${fileName}`)
    res.json({
      success: true,
      message: '上传成功',
      data: {
        id: result.insertId,
        originalname: fileName,  // 前端需要的字段
        filename: fileName,       // 向后兼容
        size: req.file.size,
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
      'SELECT id, name, file_name, description, size, type, created_by, created_at, (SELECT username FROM users WHERE id = created_by) AS uploaded_by FROM download_resources ORDER BY created_at DESC'
    )
    res.json({ success: true, data: rows })
  } catch (error) {
    console.error('[LIST] 获取列表错误:', error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// 下载文件
router.get('/uploads/:id/download', async (req, res) => {
  try {
    const { default: db } = await import('../db.js')
    const id = parseInt(req.params.id, 10)
    const [rows] = await db.query(
      'SELECT file_name, file_path FROM download_resources WHERE id = ?',
      [id]
    )

    if (!rows || rows.length === 0) {
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

    // 设置正确的响应头，确保中文文件名正确显示
    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(file_name)}`)
    res.setHeader('Content-Length', fileBuffer.length)

    console.log(`[DOWNLOAD] 下载文件，ID=${id}，文件名=${file_name}`)
    res.send(fileBuffer)
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

    const { default: db } = await import('../db.js')
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

    // 删除数据库记录
    const [result] = await db.query('DELETE FROM download_resources WHERE id = ?', [id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: '文件不存在' })
    }

    // 删除存储中的文件
    try {
      await storageService.deleteFile(file_path)
    } catch (err) {
      console.error(`[DELETE] 删除存储文件失败，ID=${id}:`, err)
      // 即使删除文件失败，数据库记录已删除，不返回错误
    }

    console.log(`[DELETE] 文件删除成功，ID=${id}`)
    res.json({ success: true, message: '删除成功' })
  } catch (error) {
    console.error('[DELETE] 删除错误:', error)
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
