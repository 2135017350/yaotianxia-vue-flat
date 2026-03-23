import { Router } from 'express'
import db from '../db.js'
import { verifyCaptcha } from './captcha.js'

const router = Router()

// 提交申请试用
router.post('/trial', verifyCaptcha, async (req, res) => {
  try {
    const { companyName, contactName, contactPhone, province, city, district, products } = req.body

    if (!companyName || !contactName || !contactPhone) {
      return res.status(400).json({ success: false, message: '请填写必填项' })
    }
    if (!/^1[3-9]\d{9}$/.test(contactPhone)) {
      return res.status(400).json({ success: false, message: '联系电话格式不正确' })
    }

    await db.query(
      'INSERT INTO trial_applications (company_name, contact_name, contact_phone, province, city, district, products) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [companyName, contactName, contactPhone, province, city, district, JSON.stringify(products || [])]
    )

    res.json({ success: true, message: '申请提交成功，我们将在1-2个工作日内联系您！' })
  } catch (err) {
    console.error('申请试用错误:', err)
    res.status(500).json({ success: false, message: '提交失败，请稍后重试' })
  }
})

// 提交项目报备
router.post('/project', verifyCaptcha, async (req, res) => {
  try {
    const { customerName, projectRequirements, contactName, contactPhone, partnerCode } = req.body

    if (!customerName || !contactName || !contactPhone) {
      return res.status(400).json({ success: false, message: '请填写必填项' })
    }
    if (!/^1[3-9]\d{9}$/.test(contactPhone)) {
      return res.status(400).json({ success: false, message: '联系电话格式不正确' })
    }

    await db.query(
      'INSERT INTO project_reports (customer_name, project_requirements, contact_name, contact_phone, partner_code) VALUES (?, ?, ?, ?, ?)',
      [customerName, projectRequirements, contactName, contactPhone, partnerCode]
    )

    res.json({ success: true, message: '项目报备提交成功！' })
  } catch (err) {
    console.error('项目报备错误:', err)
    res.status(500).json({ success: false, message: '提交失败，请稍后重试' })
  }
})

// 获取企业动态列表
router.get('/news', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, title, summary, category, published_at FROM news ORDER BY published_at DESC LIMIT 20'
    )
    res.json({ success: true, data: rows })
  } catch (err) {
    console.error('获取动态错误:', err)
    res.status(500).json({ success: false, message: '获取失败' })
  }
})

// 获取企业动态详情
router.get('/news/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM news WHERE id = ?', [req.params.id])
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: '动态不存在' })
    }
    res.json({ success: true, data: rows[0] })
  } catch (err) {
    res.status(500).json({ success: false, message: '获取失败' })
  }
})

export default router
