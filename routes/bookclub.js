const router = require('express').Router()
const bookclubController = require('../controllers/bookclub')
const { ensureAuth, ensureClubmaker } = require('../middleware/auth')

// Bookclub Routes
router.post('/', ensureAuth, ensureClubmaker, bookclubController.createBookclub)
router.put("/", ensureAuth, bookclubController.addBookclub)
router.get('/:bookclubID', ensureAuth, bookclubController.getBookclub)
router.put('/:bookclubID/addReader', ensureAuth, ensureClubmaker, bookclubController.addReader)
router.put('/:bookclubID/leaveBookclub', ensureAuth, bookclubController.leaveBookclub)
router.delete('/:bookclubID', ensureAuth, ensureClubmaker, bookclubController.deleteBookclub)

module.exports = router