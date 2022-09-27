const Classroom = require('../models/Classroom')

exports.createClassroom = async (req, res) => {
    await Classroom.create({
        name: req.body.name,
        instructor: req.user.id
    })
    console.log('Classroom has been created!')

    res.redirect('/feed')
}

exports.getClassroom = (req, res) => {
    console.log(req.params.classroomID)
    res.redirect('/feed')
}