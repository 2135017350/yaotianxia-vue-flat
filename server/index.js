import express from 'express'
import cors from 'cors'
import session from 'express-session'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import fs from 'fs'
import captchaRouter from './routes/captcha.js'
import authRouter from './routes/auth.js'
import formsRouter from './routes/forms.js'
import uploadRouter from './routes/upload.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
// Bug Fix #1: 固定使用 3000 端口，不再依赖环境变量
const PORT = 3000

// Bug Fix #1: 优化 CORS 配置，主要支持 3000 端口的前端
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
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

// Bug Fix #1: 优化静态文件托管配置
const distPath = path.join(__dirname, '../dist')
const downloadsPath = path.join(__dirname, '../public/downloads')

// Bug Fix #3: 修复 ES Module 兑容性错误，使用 fs 对象而不是 require
if (!fs.existsSync(downloadsPath)) {
  fs.mkdirSync(downloadsPath, { recursive: true })
  console.log(`[SERVER] 创建上传目录: ${downloadsPath}`)
}

// 托管前端静态文件
app.use(express.static(distPath))

// Bug Fix #1: 添加上传目录的静态文件托管，便前端下载
app.use('/downloads', express.static(downloadsPath))

// Bug Fix #9: 使用自定义中间件处理 SPA 路由
// 这个中间件能智慧地处理 SPA 路由，自动排除静态文件和 API 路由
// 相比第三方库，自定义实现更加可靠且避免了 ESM/CommonJS 兼容性问题
app.use((req, res, next) => {
  // 如果请求以下前缀开头，直接跳过（不重定向到 index.html）
  const skipPaths = [
    '/api',           // API 路由
    '/downloads',     // 文件下载
    '/public',        // 公开资源
    '.',              // 隐藏文件
  ]

  // 检查是否是静态文件（有文件扩展名）
  const hasExtension = /\.\w+$/.test(req.path)
  
  // 检查是否应该跳过
  const shouldSkip = skipPaths.some(prefix => req.path.startsWith(prefix)) || hasExtension

  if (shouldSkip) {
    // 继续处理，不重定向
    return next()
  }

  // 检查文件是否真实存在
  const filePath = path.join(distPath, req.path)
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    // 文件存在，继续处理
    return next()
  }

  // 不是 API、文件下载、静态文件，且文件不存在
  // 则重定向到 index.html（SPA 路由）
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      console.error(`[SPA] 重定向到 index.html 失败: ${err.message}`)
      res.status(500).send('Internal Server Error')
    }
  })
})

// 最后再托管一遍前端静态文件（为了处理 SPA 路由后的文件请求）
app.use(express.static(distPath))

app.listen(PORT, () => {
  console.log(`\n🚀 药天下后端服务已启动`)
  console.log(`   API 地址: http://localhost:${PORT}/api`)
  console.log(`   前端地址: http://localhost:${PORT}`)
  console.log(`   允许跨域: ${allowedOrigins.join(', ')}`)
  console.log(`\n📋 使用说明：`)
  console.log(`   开发模式: pnpm dev（前端 3001）+ node server/index.js（后端 3000）`)
  console.log(`   生产模式: pnpm build && node server/index.js`)
})
