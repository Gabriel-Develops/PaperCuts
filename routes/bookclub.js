const router = require('express').Router()
const bookclubController = require('../controllers/bookclub')
const { ensureAuth, ensureInstructor } = require('../middleware/auth')

// Bookclub Routes
router.post('/', ensureAuth, ensureInstructor, bookclubController.createBookclub)
router.get('/:bookclubID', ensureAuth, bookclubController.getBookclub)
router.put('/:bookclubID/addStudent', ensureAuth, ensureInstructor, bookclubController.addStudent)

module.exports = router