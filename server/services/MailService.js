import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

class MailService {
  constructor() {
    this.transporter = null
    this.mailTo = process.env.MAIL_TO || '2135017350@qq.com'
    this.initTransporter()
  }

  initTransporter() {
    const service = process.env.MAIL_SMTP_SERVICE || 'QQ'
    
    let config = null

    switch (service.toUpperCase()) {
      case 'QQ':
        config = {
          host: process.env.MAIL_SMTP_QQ_HOST || 'smtp.qq.com',
          port: parseInt(process.env.MAIL_SMTP_QQ_PORT || '465', 10),
          secure: true,
          auth: {
            user: process.env.MAIL_SMTP_QQ_USER || '2135017350@qq.com',
            pass: process.env.MAIL_SMTP_QQ_PASS || 'your_qq_auth_code_here',
          }
        }
        break

      case '163':
        config = {
          host: process.env.MAIL_SMTP_163_HOST || 'smtp.163.com',
          port: parseInt(process.env.MAIL_SMTP_163_PORT || '465', 10),
          secure: true,
          auth: {
            user: process.env.MAIL_SMTP_163_USER,
            pass: process.env.MAIL_SMTP_163_PASS,
          }
        }
        break

      case 'GMAIL':
        config = {
          host: process.env.MAIL_SMTP_GMAIL_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.MAIL_SMTP_GMAIL_PORT || '587', 10),
          secure: false,
          auth: {
            user: process.env.MAIL_SMTP_GMAIL_USER,
            pass: process.env.MAIL_SMTP_GMAIL_PASS,
          }
        }
        break

      default:
        console.warn(`[MAIL] 未知的邮件服务: ${service}，使用 QQ 邮箱默认配置`)
        config = {
          host: 'smtp.qq.com',
          port: 465,
          secure: true,
          auth: {
            user: '2135017350@qq.com',
            pass: 'your_qq_auth_code_here',
          }
        }
    }

    try {
      this.transporter = nodemailer.createTransport(config)
      console.log(`[MAIL] 邮件服务已初始化，使用服务: ${service}`)
    } catch (error) {
      console.error(`[MAIL] 邮件服务初始化失败: ${error.message}`)
    }
  }

  async sendContactNotification(contactData) {
    if (!this.transporter) {
      console.error('[MAIL] 邮件服务未初始化')
      return false
    }

    const { name, email, phone, company, subject, message } = contactData

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">📬 新的客户咨询</h2>
          
          <div style="margin-top: 20px;">
            <p style="margin: 10px 0;"><strong>👤 联系人：</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>📧 邮箱：</strong> <a href="mailto:${email}">${email}</a></p>
            ${phone ? `<p style="margin: 10px 0;"><strong>📱 电话：</strong> ${phone}</p>` : ''}
            ${company ? `<p style="margin: 10px 0;"><strong>🏢 公司：</strong> ${company}</p>` : ''}
            <p style="margin: 10px 0;"><strong>📌 主题：</strong> ${subject}</p>
          </div>

          <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #007bff; border-radius: 4px;">
            <h3 style="color: #333; margin-top: 0;">💬 留言内容：</h3>
            <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>

          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999;">
            <p>这是一封自动生成的邮件，请勿直接回复。请登录管理后台查看并回复此客户咨询。</p>
            <p>发送时间：${new Date().toLocaleString('zh-CN')}</p>
          </div>
        </div>
      </div>
    `

    const textContent = `
新的客户咨询

联系人：${name}
邮箱：${email}
${phone ? `电话：${phone}\n` : ''}${company ? `公司：${company}\n` : ''}主题：${subject}

留言内容：
${message}

---
发送时间：${new Date().toLocaleString('zh-CN')}
    `

    try {
      const info = await this.transporter.sendMail({
        from: `"药天下客服系统" <${process.env.MAIL_SMTP_QQ_USER || '2135017350@qq.com'}>`,
        to: this.mailTo,
        subject: `【新客户咨询】${subject}`,
        text: textContent,
        html: htmlContent,
        replyTo: email,
      })

      console.log(`[MAIL] 邮件发送成功，ID=${info.messageId}，收件人=${this.mailTo}`)
      return true
    } catch (error) {
      console.error(`[MAIL] 邮件发送失败: ${error.message}`)
      return false
    }
  }

  async sendReplyNotification(contactData, replyMessage) {
    if (!this.transporter) {
      console.error('[MAIL] 邮件服务未初始化')
      return false
    }

    const { name, email, subject } = contactData

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333; border-bottom: 2px solid #28a745; padding-bottom: 10px;">✓ 我们已收到您的咨询</h2>
          
          <p style="color: #555; margin-top: 20px;">亲爱的 ${name}，</p>
          <p style="color: #555; line-height: 1.6;">感谢您的咨询！我们已收到您关于"${subject}"的留言，我们的团队会尽快与您联系。</p>

          <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #28a745; border-radius: 4px;">
            <h3 style="color: #333; margin-top: 0;">💬 我们的回复：</h3>
            <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${replyMessage}</p>
          </div>

          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999;">
            <p>如有任何疑问，欢迎随时联系我们。</p>
            <p>发送时间：${new Date().toLocaleString('zh-CN')}</p>
          </div>
        </div>
      </div>
    `

    try {
      const info = await this.transporter.sendMail({
        from: `"药天下客服系统" <${process.env.MAIL_SMTP_QQ_USER || '2135017350@qq.com'}>`,
        to: email,
        subject: `回复：${subject}`,
        html: htmlContent,
      })

      console.log(`[MAIL] 回复邮件发送成功，ID=${info.messageId}，收件人=${email}`)
      return true
    } catch (error) {
      console.error(`[MAIL] 回复邮件发送失败: ${error.message}`)
      return false
    }
  }
}

export default new MailService()
