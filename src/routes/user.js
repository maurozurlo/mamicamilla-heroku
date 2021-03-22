const router = require('express').Router();
const userController = require('../controllers/userController')
const {verifyToken} = require('../middleware/auth')

//Auth
router.post('/login', userController.login)
//Protected routes
router.post('/register', verifyToken, userController.register)
router.put('/', verifyToken, userController.update)
router.delete('/', verifyToken, userController.delete)

module.exports = router
