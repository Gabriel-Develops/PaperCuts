const router = require('express').Router()
const classroomController = require('../controllers/classroom')
const { ensureAuth, ensureInstructor } = require('../middleware/auth')

// Classroom Routes
router.post('/', ensureAuth, ensureInstructor, classroomController.createClassroom)
router.get('/:classroomID', ensureAuth, classroomController.getClassroom)

module.exports = router