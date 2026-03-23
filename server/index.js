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
const PORT = process.env.PORT || 3000

// 允许的前端来源（支持多个，兼容开发模式和生产模式）
const allowedOrigins = [
  process.env.FRONTEND_URL,
  `http://localhost:${PORT}`,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
].filter(Boolean)

// 中间件
app.use(cors({
  origin: (origin, callback) => {
    // 允许无 origin 的请求（如 curl、Postman）或在白名单内的来源
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS 不允许来自 ${origin} 的请求`))
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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
  console.log(`   前端地址: http://localhost:${PORT}`)
  console.log(`   允许跨域: ${allowedOrigins.join(', ')}`)
  console.log(`\n📋 使用说明：`)
  console.log(`   开发模式: pnpm dev（前端 3001）+ node server/index.js（后端 3000）`)
  console.log(`   生产模式: pnpm build && node server/index.js`)
})
