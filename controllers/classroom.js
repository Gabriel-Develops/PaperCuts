const Classroom = require('../models/Classroom')
const validator = require('validator')
const User = require('../models/User')

exports.createClassroom = async (req, res) => {
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
    console.log(req.body)
    console.log(req.params)

    req.body.studentEmail = validator.normalizeEmail(req.body.studentEmail, {
        gmail_remove_dots: false
    })

    const classroom = await Classroom.findById(req.params.classroomID)
    const student = await User.find({email: req.body.studentEmail})
    console.log(student,student.id, student._id)
    if (!classroom.students.includes(student.id)) {
        const newStudents = classroom.students.concat(student.id)
        console.log(newStudents)
        await Classroom.findByIdAndUpdate(req.params.classroomID, {
            students: newStudents
        })
    }

    res.redirect('/')
}