const router = require('express').Router()
const homeController = require('../controllers/home')
const authController = require('../controllers/auth')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

// Main Routes
router.get("/", ensureGuest, homeController.getIndex)
router.get("/signup", ensureGuest, authController.getSignup)
router.post("/signup", ensureGuest, authController.postSignup)
router.get("/login", ensureGuest, authController.getLogin)
router.post("/login", ensureGuest, authController.postLogin)
router.get("/logout", ensureAuth, authController.logout)
router.get("/feed", ensureAuth, homeController.getFeed)

module.exports = router