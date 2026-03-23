import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const JWT_SECRET = process.env.JWT_SECRET || 'yaotianxia_secret'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const router = express.Router()

// 配置存储引擎
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../public/downloads')
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        }
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})

// 文件过滤（只允许特定类型）
const fileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|xls|xlsx|mp4|avi|mov|rar|zip/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
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

function requireAdmin(req, res) {
    const user = getUserFromToken(req)
    if (!user) {
      res.status(401).json({ success: false, message: '请先登录' })
      return null
    }
    return user
}

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const user = getUserFromToken(req)
        if (!user) return res.status(401).json({ success: false, message: '未授权' })

        if (!req.file) {
            return res.status(400).json({ success: false, message: '未选择文件' })
        }

        const { uploadType, description } = req.body
        const type = uploadType === 'video' ? 'video' : 'contract'

        await db.query(
          'INSERT INTO download_resources (name, description, size, file_name, file_path, type, media_type, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [req.file.originalname, description || '', `${Math.round(req.file.size / 1024)}KB`, req.file.filename, `/downloads/${req.file.filename}`, type, req.file.mimetype, user.id]
        )

        res.json({
            success: true,
            message: '上传成功',
            data: {
                filename: req.file.filename,
                originalname: req.file.originalname,
                size: req.file.size,
                path: `/downloads/${req.file.filename}`
            }
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
})

router.get('/uploads/list', async (req, res) => {
    try {
      const [rows] = await db.query('SELECT dr.*, u.username AS uploaded_by FROM download_resources dr LEFT JOIN users u ON dr.created_by = u.id ORDER BY dr.created_at DESC')
      res.json({ success: true, data: rows })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
})

router.delete('/uploads/:id', async (req, res) => {
    try {
      const tokenUser = getUserFromToken(req)
      if (!tokenUser) return res.status(401).json({ success: false, message: '未授权' })

      const [userRows] = await db.query('SELECT role FROM users WHERE id = ?', [tokenUser.id])
      if (!userRows[0] || userRows[0].role !== 'admin') {
        return res.status(403).json({ success: false, message: '仅管理员可删除' })
      }

      const id = parseInt(req.params.id, 10)
      await db.query('DELETE FROM download_resources WHERE id = ?', [id])
      res.json({ success: true, message: '删除成功' })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
})

export default router
