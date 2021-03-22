const router = require('express').Router();
const { verifyToken, verifyTokenOrCaptcha } = require('../middleware/auth')
const { getFromField } = require('../helpers/database')
const abstractController = require('../controllers/abstractController')
const { bookingController,sendConfirmationEmail } = require('../controllers/bookingController')
const tableName = 'bookings'
//Abstract controller
const items = new abstractController(tableName, 'Booking')

// Small middleware that checks for users email before adding their booking to the database
const checkForRecurringCustomer = async (req, res, next) => {
  //Extra business logic
  const { email } = req.body
  try {
    const row = await getFromField(tableName, 'email', email)
    //Extra data
    req.body.isRecurring = row.length >= 1 ? 1 : 0
    req.extra = {} //TODO add function to do this
    req.extra.email = email
  } catch (error) {
    console.log(error)
    return res.status(500).json('Server Error')
  }
  next()
}
//Public route
router.post('/', verifyTokenOrCaptcha, checkForRecurringCustomer, bookingController.addItem)

//Get booking
router.get('/month', bookingController.getByStartAndEnd)

//Protected routes
router.put('/',verifyToken,bookingController.editItem)
router.put('/settings', verifyToken, bookingController.updateBookingSettings)

//Unused generic routes
router.delete('/',verifyToken,items.deleteItem.bind(items))
router.get('/:id', verifyToken, items.getItem.bind(items))

module.exports = router
