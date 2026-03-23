import { Router } from 'express'
import svgCaptcha from 'svg-captcha'

const router = Router()

// 生成图片验证码
router.get('/captcha', (req, res) => {
  const captcha = svgCaptcha.create({
    size: 4,
    noise: 3,
    color: true,
    background: '#f0f4ff',
    width: 120,
    height: 40,
    fontSize: 40,
  })
  req.session.captcha = captcha.text.toLowerCase()
  res.type('svg')
  res.send(captcha.data)
})

// 验证验证码（供其他路由调用的中间件）
export function verifyCaptcha(req, res, next) {
  const { captcha } = req.body
  if (!captcha) {
    return res.status(400).json({ success: false, message: '请输入验证码' })
  }
  if (captcha.toLowerCase() !== req.session.captcha) {
    return res.status(400).json({ success: false, message: '验证码错误' })
  }
  next()
}

export default router
