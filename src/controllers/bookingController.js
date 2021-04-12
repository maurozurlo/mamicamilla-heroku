const pool = require('../config/db')
const { toEvents } = require('../transformers/bookings')
const { addToDB, editInDB, updateSetting } = require('../helpers/database')
const { sendEmail } = require('../controllers/mailer')
const { logger } = require('./logger')
const tableName = 'bookings'

const emailSubjects = {
  confirmed: 'Buchungsbestätigung Mami Camilla',
  cancelled: 'STORNIERUNG: Tisch bei Mami Camilla',
  reconfirmed: 'Buchung bei Mami Camilla'
}

const getByDate = async (start, end) => {
  try {
    const conn = await pool.getConnection()
    const [bookings] = await conn.query('SELECT id, CONCAT(fname, " ", lname) as name, guests, DATE_FORMAT(date, "%Y-%m-%d") as date, time, isCancelled FROM bookings where date >= ? AND date <= ?', [start, end])
    await conn.release()
    return bookings
  } catch (error) {
    console.error(error)
  }
}

const getBookingsByDay = async day => {
  try {
    const [count] = await pool.query('SELECT count(id) as count FROM bookings where DATE_FORMAT(date, "%Y-%m-%d") = DATE_FORMAT(?, "%Y-%m-%d") and isCancelled not like 1', [day])
    return count
  } catch (error) {
    console.error(error)
  }
}

const bookingController = {
  //Get
  getByStartAndEnd: async (req, res) => {
    try {
      const { start, end } = req.query
      const result = await getByDate(start, end)
      return res.status(200).send(toEvents(result))
    } catch (error) {
      console.log(error)
      return res.status(500).json('Server error')
    }
  },
  getBookingsByMonth: async (req, res) => {
    try {
      const { month } = req.params
      const result = await getByDate(month)
      return res.status(200).send(toEvents(result))
    } catch (error) {
      console.log(error)
      return res.status(500).json('Server error')
    }
  },

  //Set
  addItem: async (req, res) => {
    try {
      const result = await addToDB(tableName, req.body, pool)
      const user = req.extra ? req.extra.email : req.session.username // Required for logs
      await logger(req.session.userId, user, 'added', tableName)
      //Send booking email
      await sendEmail(req.body.email, 'bookings_created', emailSubjects.confirmed, req.body)
      return res.status(200).json({ message: 'Booking added successfully' })
    } catch (error) {
      console.log(error)
      return res.status(500).json('Server error')
    }
  },
  editItem: async (req, res) => {
    try {
      const result = await editInDB(tableName, req.body, pool)
      // Logger
      await logger(req.session.userId, req.session.username, 'edited', tableName)
      // Send emails
      if(req.headers['x-send-email'] === 'true'){
        if (req.body.isCancelled === '1') {
          await sendEmail(req.body.email, 'bookings_cancelled', emailSubjects.cancelled, req.body)
        } else {
          await sendEmail(req.body.email, 'bookings_confirmed', emailSubjects.reconfirmed, req.body)
        }
      }
      res.status(200).json({ message: 'Booking edited successfully' })
    } catch (error) {
      console.log(error)
      return res.status(500).json('Server error')
    }
  },
  updateBookingSettings: async (req, res) => {
    try {
      const { value } = req.body
      const result = await updateSetting('booking_settings', value)
      return res.status(200).json({ message: 'Booking setting updated correctly' })
    } catch (error) {
      console.log(error)
      return res.status(500).json('Server error')
    }
  }
}

module.exports = {
  getBookingsByDay,
  bookingController
}
