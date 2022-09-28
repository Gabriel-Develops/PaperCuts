const Classroom = require('../models/Classroom')
const validator = require('validator')
const User = require('../models/User')

exports.createClassroom = async (req, res) => {
    const validationErrors = []
    if (validator.isEmpty(req.body.name))
        validationErrors.push({msg: 'Name of classroom can not be empty.'})
    if (validationErrors.length) {
        req.flash('errors', validationErrors)
        return res.redirect(`/feed`)
    }

    await Classroom.create({
        name: req.body.name,
        instructor: req.user.id
    })
    console.log('Classroom has been created!')

    res.redirect('/feed')
}

exports.getClassroom = async (req, res) => {
    const classroom = await Classroom.findById(req.params.classroomID)
    // console.log(classroom)
    // console.log(req.user)
    console.log(classroom)
    res.render('classroom', {
        classroomName: classroom.name,
        userName: req.user.firstName,
        accountType: req.user.accountType,
        students: classroom.students,
        classroomID: classroom.id
    })
}

exports.addStudent = async (req, res) => {
    const validationErrors = []
    if (validator.isEmpty(req.body.studentEmail))
        validationErrors.push({msg: 'Please enter a student email.'})
    if (!validator.isEmail(req.body.studentEmail))
        validationErrors.push({msg: 'Please enter a valid email address.'})

    if (validationErrors.length) {
        req.flash('errors', validationErrors)
        return res.redirect(`/classroom/${req.params.classroomID}`)
    }

    req.body.studentEmail = validator.normalizeEmail(req.body.studentEmail, {
        gmail_remove_dots: false
    })

    const classroom = await Classroom.findById(req.params.classroomID)
    const studentToAdd = await User.findOne({email: req.body.studentEmail}).lean()

    // Student was not found
    if (!studentToAdd) {
        req.flash('errors', [{msg: 'Student not found.'}])
        return res.redirect(`/classroom/${req.params.classroomID}`)
    }

    if (!classroom.students.includes(studentToAdd._id) && studentToAdd.accountType === 'student') {
        const newStudents = classroom.students.concat(studentToAdd._id)
        await Classroom.findByIdAndUpdate(req.params.classroomID, {
            students: newStudents
        })
    }

    res.redirect('/')
}