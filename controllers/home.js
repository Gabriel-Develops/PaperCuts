const Classroom = require('../models/Classroom')

exports.getIndex =  (req, res) => {
    res.render('index.ejs')
}

exports.getFeed = async (req, res) => {
    if (req.user.accountType === 'student'){
        const classrooms = await Classroom.find({'students': req.user.id})
        // console.log(classrooms, req.user.id)
        res.render('feedStudent', {classrooms: classrooms})
    }
    else if (req.user.accountType === 'instructor') {
        const classrooms = await Classroom.find({instructor: req.user.id})
        res.render('feedInstructor', {classrooms: classrooms})
    }
    else {
        console.error('accountType incorrect', req.body.accountType)
        res.redirect('/logout')
    }
}