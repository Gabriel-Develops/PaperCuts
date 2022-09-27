const router = require('express').Router()
const classroomController = require('../controllers/classroom')
const { ensureAuth, ensureInstructor } = require('../middleware/auth')

// Classroom Routes
router.post('/', ensureAuth, ensureInstructor, classroomController.createClassroom)
router.get('/:classroomID', ensureAuth, classroomController.getClassroom)
router.put('/:classroomID/addStudent', ensureAuth, ensureInstructor, classroomController.addStudent)

module.exports = router