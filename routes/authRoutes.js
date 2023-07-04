const express = require('express');
const { registerController, loginController, logoutController } = require('../controllers/authController');
const router = express.Router()


//routes
//Register routes
router.post('/register', registerController)
//login routes
router.post('/login',loginController)
//logout routes
router.post('/logout',logoutController)

module.exports = router
