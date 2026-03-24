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

// Bug Fix #4: 修复 SPA 路由顺序问题
// 必须先托管所有静态文件和 API 路由，再处理 SPA 通配符路由
// 否则文件下载请求会被 SPA 路由拦截并返回 HTML 内容

// 托管前端静态文件
app.use(express.static(distPath))

// Bug Fix #1: 添加上传目录的静态文件托管，便前端下载
app.use('/downloads', express.static(downloadsPath))

// Bug Fix #4: SPA 通配符路由必须放在最后
// 这样所有真实的文件请求都会被静态文件中间件处理
// 只有不存在的路由才会被重定向到 index.html
// Bug Fix #6: 修复 Express 5.x 中的路由通配符语法
// Express 5.x 使用 path-to-regexp 8.x，不再支持 /* 写法
// 必须使用 (.*) 或 :path(*) 来匹配所有路径
app.get('/:path(.*)', (req, res) => {
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
