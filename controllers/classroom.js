const Classroom = require('../models/Classroom')

exports.createClassroom = async (req, res) => {
    await Classroom.create({
        name: req.body.name,
        instructor: req.user.id
    })
    console.log('Classroom has been created!')

    res.redirect('/feed')
}

exports.getClassroom = async (req, res) => {
    console.log(req.params.classroomID)
    const classroom = await Classroom.findById(req.params.classroomID)
    console.log(classroom)
    console.log(req.user)
    res.render('classroom', {
        classroomName: classroom.name,
        userName: req.user.firstName,
        accountType: req.user.accountType
    })
}