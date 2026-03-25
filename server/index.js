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
const PORT = 3000

const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
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
  cookie: { secure: false, maxAge: 10 * 60 * 1000 },
}))

app.use('/api', captchaRouter)
app.use('/api/auth', authRouter)
app.use('/api', formsRouter)
app.use('/api', uploadRouter)

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: '药天下后端服务运行正常', time: new Date().toISOString() })
})

const distPath = path.join(__dirname, '../dist')
const downloadsPath = path.join(__dirname, '../public/downloads')

if (!fs.existsSync(downloadsPath)) {
  fs.mkdirSync(downloadsPath, { recursive: true })
}

app.use('/downloads', express.static(downloadsPath))
app.use(express.static(distPath))

app.use((req, res, next) => {
  const skipPaths = ['/api', '/downloads', '/public']
  const hasExtension = /\.\w+$/.test(req.path)
  const shouldSkip = skipPaths.some(prefix => req.path.startsWith(prefix)) || hasExtension

  if (shouldSkip) return next()

  const filePath = path.join(distPath, req.path)
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) return next()

  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      if (!res.headersSent) {
        res.status(500).send('Internal Server Error')
      }
    }
  })
})

app.listen(PORT, () => {
  console.log(`🚀 药天下后端服务已启动: http://localhost:${PORT}`)
})
