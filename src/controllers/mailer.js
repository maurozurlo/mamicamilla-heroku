require('dotenv').config()
const nodemailer = require("nodemailer")
const ejs = require("ejs")

const sendEmail = async (receiver, template, subject, payload, sender) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SENDER, // generated ethereal user
      pass: process.env.EMAIL_PASS, // generated ethereal password
    },
  })
  const html = await ejs.renderFile(`${viewsDir}/templates/${template}.ejs`, payload)

  const replyTo = sender ? { replyTo: `${payload.name} <${sender}>` } : null
  // Don't send email in debug mode
  if (process.env.DEBUG === 'true') return

  try {
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `${process.env.RESTAURANT_NAME} <${process.env.EMAIL_SENDER}>`, // sender address,
      to: receiver, // list of receivers
      bcc: process.env.EMAIL_INFO,
      subject: subject, // Subject line
      text: "Please view in a browser that supports html", // plain text body
      ...replyTo,
      html: html
    });
    console.log("Message sent: %s", info.messageId)
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  sendEmail
}
