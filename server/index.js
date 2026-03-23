import express from 'express'
import cors from 'cors'
import session from 'express-session'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import captchaRouter from './routes/captcha.js'
import authRouter from './routes/auth.js'
import formsRouter from './routes/forms.js'
import uploadRouter from './routes/upload.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: process.env.SESSION_SECRET || 'yaotianxia_session',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 10 * 60 * 1000 }, // 10分钟
}))

// API 路由
app.use('/api', captchaRouter)
app.use('/api/auth', authRouter)
app.use('/api', formsRouter)
app.use('/api', uploadRouter)

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: '药天下后端服务运行正常', time: new Date().toISOString() })
})

// 生产环境：托管前端静态文件
const distPath = path.join(__dirname, '../dist')
app.use(express.static(distPath))
app.use('/downloads', express.static(path.join(__dirname, '../public/downloads')))
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`\n🚀 药天下后端服务已启动`)
  console.log(`   API 地址: http://localhost:${PORT}/api`)
  console.log(`   前端地址: ${process.env.FRONTEND_URL || `http://localhost:${PORT}`}`)
  console.log(`\n📋 使用说明：`)
  console.log(`   1. 确保 MySQL 已启动并创建数据库 yaotianxia`)
  console.log(`   2. 执行 server/init.sql 初始化数据库表`)
  console.log(`   3. 修改 .env 文件中的数据库连接信息`)
  console.log(`   4. 运行 pnpm build 构建前端，再运行 node server/index.js`)
})
