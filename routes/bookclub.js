const router = require('express').Router()
const bookclubController = require('../controllers/bookclub')
const { ensureAuth, ensureInstructor } = require('../middleware/auth')

// Bookclub Routes
router.post('/', ensureAuth, ensureInstructor, bookclubController.createBookclub)
router.put("/", ensureAuth, bookclubController.addBookclub)
router.get('/:bookclubID', ensureAuth, bookclubController.getBookclub)
router.put('/:bookclubID/addStudent', ensureAuth, ensureInstructor, bookclubController.addStudent)
router.delete('/:bookclubID', ensureAuth, ensureInstructor, bookclubController.deleteBookclub)

module.exports = router