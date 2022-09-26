const router = require('express').Router()
const homeController = require('../controllers/home')
const authController = require('../controllers/auth')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

// Main Routes
router.get("/", homeController.getIndex)
router.get("/signup", authController.getSignup)
router.post("/signup", authController.postSignup)
router.get("/logout", ensureAuth, authController.logout)

module.exports = router