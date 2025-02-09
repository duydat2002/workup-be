import transporter from '@/configs/nodemailer'
import ejs from 'ejs'
import path from 'path'

export const sendMail = async (to: string, subject: string, templateName: string, templateData: any) => {
  try {
    const filePath = path.join(__dirname, 'templates', `${templateName}.ejs`)
    const html = (await ejs.renderFile(filePath, templateData)) as string

    const info = await transporter.sendMail({
      from: {
        name: 'WorkUp',
        address: 'duydat30122002@gmail.com'
      },
      to,
      subject,
      html
    })
    console.log('Message sent: %s', info.messageId)
    return info
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

export const sendMailRaw = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: {
        name: 'WorkUp',
        address: ''
      },
      to,
      subject,
      html
    })
    console.log('Message sent: %s', info.messageId)
    return info
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}
