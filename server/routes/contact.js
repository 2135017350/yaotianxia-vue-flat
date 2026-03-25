import express from 'express'

const router = express.Router()

// 提交联系信息
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, company, subject, message } = req.body

    // 基本验证
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: '请填写必填项：姓名、邮箱、主题、留言内容'
      })
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: '请输入有效的邮箱地址'
      })
    }

    // 导入数据库模块
    const { default: db } = await import('../db.js')

    // 插入数据库
    const [result] = await db.query(
      'INSERT INTO contact_messages (name, email, phone, company, subject, message) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone || null, company || null, subject, message]
    )

    if (!result || !result.insertId) {
      return res.status(500).json({
        success: false,
        message: '提交失败，请稍后重试'
      })
    }

    console.log(`[CONTACT] 新的联系信息，ID=${result.insertId}，来自=${name} (${email})`)

    // 这里可以添加发送邮件通知客服的逻辑
    // 例如：await sendEmailToCustomerService(name, email, subject, message)

    res.json({
      success: true,
      message: '感谢您的留言，我们会尽快与您联系！',
      data: {
        id: result.insertId,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('[CONTACT] 提交错误:', error)
    res.status(500).json({
      success: false,
      message: error.message || '提交失败'
    })
  }
})

// 获取联系信息列表（仅管理员）
router.get('/contact/messages', async (req, res) => {
  try {
    const { default: db } = await import('../db.js')

    const [rows] = await db.query(
      'SELECT id, name, email, phone, company, subject, message, status, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 100'
    )

    res.json({
      success: true,
      data: rows
    })
  } catch (error) {
    console.error('[CONTACT] 获取列表错误:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// 标记为已读
router.put('/contact/:id/read', async (req, res) => {
  try {
    const { default: db } = await import('../db.js')
    const id = parseInt(req.params.id, 10)

    const [result] = await db.query(
      'UPDATE contact_messages SET status = ? WHERE id = ?',
      ['read', id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: '消息不存在'
      })
    }

    res.json({
      success: true,
      message: '已标记为已读'
    })
  } catch (error) {
    console.error('[CONTACT] 更新错误:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// 回复联系信息
router.post('/contact/:id/reply', async (req, res) => {
  try {
    const { default: db } = await import('../db.js')
    const id = parseInt(req.params.id, 10)
    const { reply_message } = req.body

    if (!reply_message) {
      return res.status(400).json({
        success: false,
        message: '请输入回复内容'
      })
    }

    const [result] = await db.query(
      'UPDATE contact_messages SET status = ?, reply_message = ?, replied_at = NOW() WHERE id = ?',
      ['replied', reply_message, id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: '消息不存在'
      })
    }

    console.log(`[CONTACT] 消息已回复，ID=${id}`)

    res.json({
      success: true,
      message: '回复成功'
    })
  } catch (error) {
    console.error('[CONTACT] 回复错误:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

export default router
