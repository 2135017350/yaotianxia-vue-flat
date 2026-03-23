import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'yaotianxia_secret'

// 生成 JWT Token
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email || null, phone: user.phone || null },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// 注册（邮箱或手机号）
// 注意：验证码由前端 Canvas 验证，后端不再校验验证码
router.post('/register', async (req, res) => {
  try {
    const { type, email, phone, password, username } = req.body

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: '密码至少6位' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    let sql, params

    if (type === 'email') {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ success: false, message: '邮箱格式不正确' })
      }
      // 检查邮箱是否已注册
      const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email])
      if (existing.length > 0) {
        return res.status(400).json({ success: false, message: '该邮箱已注册，请直接登录' })
      }
      sql = 'INSERT INTO users (email, username, password_hash, register_type, role) VALUES (?, ?, ?, ?, ?)'
      params = [email, username || email.split('@')[0], passwordHash, 'email', 'user']
    } else if (type === 'phone') {
      if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
        return res.status(400).json({ success: false, message: '手机号格式不正确' })
      }
      // 检查手机号是否已注册
      const [existing] = await db.query('SELECT id FROM users WHERE phone = ?', [phone])
      if (existing.length > 0) {
        return res.status(400).json({ success: false, message: '该手机号已注册，请直接登录' })
      }
      sql = 'INSERT INTO users (phone, username, password_hash, register_type, role) VALUES (?, ?, ?, ?, ?)'
      params = [phone, username || phone, passwordHash, 'phone', 'user']
    } else {
      return res.status(400).json({ success: false, message: '注册类型不正确' })
    }

    const [result] = await db.query(sql, params)
    const userId = result.insertId

    const token = generateToken({ id: userId, email, phone })
    res.json({
      success: true,
      message: '注册成功',
      token,
      userId,
      user: {
        id: userId,
        username: username || (type === 'email' ? email.split('@')[0] : phone),
        email: type === 'email' ? email : null,
        phone: type === 'phone' ? phone : null,
        role: 'user',
      }
    })
  } catch (err) {
    console.error('注册错误:', err)
    res.status(500).json({ success: false, message: '服务器错误，请稍后重试' })
  }
})

// 登录（邮箱或手机号）
// 注意：验证码由前端 Canvas 验证，后端不再校验验证码
router.post('/login', async (req, res) => {
  try {
    const { account, password } = req.body

    if (!account || !password) {
      return res.status(400).json({ success: false, message: '请填写账号和密码' })
    }

    // 判断是邮箱、手机号或用户名
    let sql
    let queryValue = account
    if (account.includes('@')) {
      sql = 'SELECT * FROM users WHERE email = ?'
    } else if (/^1[3-9]\d{9}$/.test(account)) {
      sql = 'SELECT * FROM users WHERE phone = ?'
    } else {
      sql = 'SELECT * FROM users WHERE username = ?'
    }

    const [rows] = await db.query(sql, [queryValue])
    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: '账号不存在，请先注册' })
    }

    const user = rows[0]
    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return res.status(400).json({ success: false, message: '密码错误' })
    }

    // 更新最后登录时间
    await db.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id])

    const token = generateToken(user)
    res.json({
      success: true,
      message: '登录成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role || 'user',
      }
    })
  } catch (err) {
    console.error('登录错误:', err)
    res.status(500).json({ success: false, message: '服务器错误，请稍后重试' })
  }
})

// 获取当前用户信息（需要 Token）
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: '未登录' })
    }
    const token = authHeader.slice(7)
    const decoded = jwt.verify(token, JWT_SECRET)
    const [rows] = await db.query(
      'SELECT id, username, email, phone, created_at, role FROM users WHERE id = ?',
      [decoded.id]
    )
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: '用户不存在' })
    }
    res.json({ success: true, user: rows[0] })
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token 无效或已过期' })
  }
})

export default router
