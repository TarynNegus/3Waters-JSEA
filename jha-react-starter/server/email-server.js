const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const nodemailer = require('nodemailer')

const app = express()
app.use(cors())
app.use(bodyParser.json({ limit: '25mb' }))

app.post('/send', async (req, res) => {
  try {
    const { to, subject, text, attachmentName, attachmentBase64 } = req.body
    if (!to) return res.status(400).json({ ok: false, error: 'recipient required' })

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || process.env.EMAIL_USER,
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASS
      }
    })

    const attachments = []
    if (attachmentBase64) {
      attachments.push({
        filename: attachmentName || 'attachment.pdf',
        content: Buffer.from(attachmentBase64, 'base64'),
      })
    }

    const mail = {
      from: process.env.SMTP_USER || process.env.EMAIL_FROM || 'no-reply@example.com',
      to,
      subject: subject || 'Job Hazard Analysis',
      text: text || 'Please find attached the JHA document',
      attachments
    }

    const info = await transporter.sendMail(mail)
    res.json({ ok: true, info })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log('Email server listening on', PORT))
