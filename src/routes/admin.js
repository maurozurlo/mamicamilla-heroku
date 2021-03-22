const router = require('express').Router();
const fs = require('fs');
const dayjs = require('dayjs')
const { saveSession, verifySession } = require('../middleware/auth')
const { cleanUpBreadcrumbs } = require('../helpers/template')
const { getLogs } = require('../controllers/logger')
const { getGenericCount, getDistinctCount, getFromField, getAll, getSetting } = require('../helpers/database')
const { getBookingsByDay } = require('../controllers/bookingController');


router.get("/", (req, res) => {
  return res.render("login")
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect('/');
  });
  res.render("logout")
})

router.get("/dashboard", saveSession, async (req, res) => {
  let logs = []
  let bookingsTotal, bookingsUnique, itemsTotal, categoryTotal

  try {
    logs = await getLogs(10)
    bookingsTotal = await getGenericCount('bookings')
    bookingsUnique = await getDistinctCount('bookings', 'email')
    itemsTotal = await getGenericCount('menuItem')
    categoryTotal = await getGenericCount('menuCategory')
  } catch (error) {
    console.log(error)
  }

  return res.render("dashboard",
    {
      username: req.session.username,
      breadcrumbs: cleanUpBreadcrumbs(req.breadcrumbs),
      url: req.originalUrl,
      partial: './pages/demo',
      logs,
      menu: {
        items: itemsTotal,
        categories: categoryTotal,
      },
      bookings: {
        total: bookingsTotal,
        unique: bookingsUnique,
      }
    })
})

router.get("/bookings/create", verifySession, (req, res) => {
  return res.render("dashboard",
    {
      username: req.session.username,
      breadcrumbs: cleanUpBreadcrumbs(req.breadcrumbs),
      url: req.originalUrl,
      partial: './pages/bookings_create'
    })
})

router.get("/bookings/configure", verifySession, async (req, res) => {
  try {
    const [{ value }] = await getSetting('booking_settings')
    return res.render("dashboard",
    {
      username: req.session.username,
      breadcrumbs: cleanUpBreadcrumbs(req.breadcrumbs),
      url: req.originalUrl,
      booking_settings: value,
      partial: './pages/bookings_configure'
    })

  } catch (error) {
    console.error(error)
    return res.render("dashboard",
    {
      username: req.session.username,
      breadcrumbs: cleanUpBreadcrumbs(req.breadcrumbs),
      url: req.originalUrl,
      booking_settings: JSON.stringify(require("../defaults/booking_settings.json")), // TODO: convert to an actual request
      partial: './pages/bookings_configure'
    })
  }
})

router.get("/bookings/:id", verifySession, async (req, res) => {
  const [data] = await getFromField('bookings', 'id', req.params.id)
  const template = {
    fname: '',
    lname: '',
    date: '',
    phone: '',
    email: '',
    comments: '',
    guests: '',
    time: '',
    isRecurring: 0,
    isCancelled: 0,
    ...data
  }

  return res.render("dashboard",
    {
      username: req.session.username,
      breadcrumbs: cleanUpBreadcrumbs(req.breadcrumbs, 'DETAIL'),
      id: req.params.id,
      url: req.originalUrl,
      ...template,
      partial: './pages/bookings_detail'
    })
})

router.get("/bookings", verifySession, async (req, res) => {
  const date = dayjs().format('YYYY-MM-DD')
  const [{ count }] = await getBookingsByDay(date)

  return res.render("dashboard",
    {
      username: req.session.username,
      breadcrumbs: cleanUpBreadcrumbs(req.breadcrumbs, 'VIEW'),
      url: req.originalUrl,
      date: date,
      num: count || 0,
      partial: './pages/bookings_view'
    })
})


router.get("/menu/pdf", verifySession, (req, res) => {
  let generatedPDF = false

  try {
    if (fs.existsSync(`${publicDir}/download/Menu.pdf`)) {
      generatedPDF = true
    }
  } catch (err) {
    console.error(err)
  }

  return res.render("dashboard",
    {
      username: req.session.username,
      breadcrumbs: cleanUpBreadcrumbs(req.breadcrumbs),
      url: req.originalUrl,
      partial: './pages/menu_pdf',
      fileExists: generatedPDF
    })
})

router.get("/menu", verifySession, (req, res) => {
  return res.render("dashboard",
    {
      username: req.session.username,
      breadcrumbs: cleanUpBreadcrumbs(req.breadcrumbs),
      url: req.originalUrl,
      partial: './pages/menu_edit'
    })
})

router.get("/profile", verifySession, (req, res) => {
  return res.render("dashboard",
    {
      username: req.session.username,
      id: req.session.userId,
      breadcrumbs: cleanUpBreadcrumbs(req.breadcrumbs),
      url: req.originalUrl,
      partial: './pages/profile'
    })
})

router.get("/staff", verifySession, async (req, res) => {
  const users = await getAll('users')
  return res.render("dashboard",
    {
      username: req.session.username,
      breadcrumbs: cleanUpBreadcrumbs(req.breadcrumbs),
      url: req.originalUrl,
      users,
      partial: './pages/staff'
    })
})

router.get("/logs", verifySession, async (req, res) => {
  const logs = await getLogs(50)
  return res.render("dashboard",
    {
      username: req.session.username,
      breadcrumbs: cleanUpBreadcrumbs(req.breadcrumbs),
      url: req.originalUrl,
      partial: './pages/logs',
      logs: logs
    })
})

module.exports = router
