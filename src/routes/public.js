const router = require('express').Router()
const { verifyTokenOrCaptcha } = require('../middleware/auth')
require("dotenv").config()
const { getSetting } = require('../helpers/database')
const { sendEmail } = require('../controllers/mailer')
const fs = require('fs')
const { getFormattedMenu } = require('../controllers/menuController')

const getGeneratedPDF = () => {
  try {
    if (fs.existsSync(`${publicDir}/download/Menu.pdf`)) {
      return true
    }
  } catch (err) {
    console.error(err)
  }
  return false
}

// Unauthenticated routes
router.get("/", (req, res) => {
  return res.render("./landing/index",
    {
      url: req.originalUrl,
      title: 'Leckerste, neapolitanische Pizza Berlin. Bei Mami Camilla!',
      partial: "./home",
      generatedPDF: getGeneratedPDF()
    })
})

router.get("/pizzeria-berlin", (req, res) => {
  return res.render("./landing/index",
    {
      url: req.originalUrl,
      partial: "./about_us",
      generatedPDF: getGeneratedPDF()
    })
})

router.get("/pizza-berlin", async (req, res) => {
  let categories = []
  try {
    categories = await getFormattedMenu()
  } catch (error) {
    console.error('Unable to load formatted menu')
  }

  return res.render("./landing/index",
    {
      url: req.originalUrl,
      partial: "./menu",
      categories,
      generatedPDF: getGeneratedPDF()
    })
})

router.get("/pizzeria-berlin-kontakt", (req, res) => {
  return res.render("./landing/index",
    {
      url: req.originalUrl,
      partial: "./contact",
      hcaptcha: process.env.HCAPTCHA_PUBLIC,
      generatedPDF: getGeneratedPDF()
    })
})

router.get("/pizzeria-berlin-impressum", (req, res) => {
  return res.render("./landing/index",
    {
      url: req.originalUrl,
      partial: "./imprint",
      generatedPDF: getGeneratedPDF()
    })
})

router.get("/sitemap", (req, res) => {
  return res.render("./landing/index",
    {
      url: req.originalUrl,
      partial: "./sitemap",
      generatedPDF: getGeneratedPDF()
    })
})

router.get("/datenschutz", (req, res) => {
  return res.render("./landing/index",
    {
      url: req.originalUrl,
      partial: "./datenschutz",
      generatedPDF: getGeneratedPDF()
    })
})

router.get("/tisch-reservieren-berlin", async (req, res) => {
  try {
    const [{ value }] = await getSetting('booking_settings')
    const parsedValues = JSON.parse(value)

    return res.render("./landing/index",
      {
        url: req.originalUrl,
        partial: parseInt(parsedValues.enabled) ? "./booking" : "./booking_disabled",
        hours: JSON.stringify({ hours: parsedValues.hours }),
        holidays: parsedValues.holidays,
        hcaptcha: process.env.HCAPTCHA_PUBLIC,
        generatedPDF: getGeneratedPDF()
      })
  } catch (error) {
    console.log("DB seems unavailable: ", error)
    const parsedValues = require("../defaults/booking_settings.json")
    return res.render("./landing/index",
    {
      url: req.originalUrl,
      partial: parseInt(parsedValues.enabled) ? "./booking" : "./booking_disabled",
      hours: JSON.stringify({ hours: parsedValues.hours }),
      holidays: parsedValues.holidays,
      hcaptcha: process.env.HCAPTCHA_PUBLIC,
      generatedPDF: getGeneratedPDF()
    })

  }

})

router.post("/api/send-contact",
  verifyTokenOrCaptcha,
  async (req, res) => {
    try {
      await sendEmail(process.env.EMAIL_INFO, 'contact_form', 'New contact', req.body, req.body.email)
      return res.status(200).json({ message: 'Message sent' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "Message couldn't be sent" })
    }
  })

module.exports = router
