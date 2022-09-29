const Bookclub = require('../models/Bookclub')
const validator = require('validator')
const User = require('../models/User')
const nanoid = require('../middleware/nanoid')

exports.createBookclub = async (req, res) => {
    const validationErrors = []
    if (validator.isEmpty(req.body.name))
        validationErrors.push({msg: 'Name of bookclub can not be empty.'})
    if (validationErrors.length) {
        req.flash('errors', validationErrors)
        return res.redirect(`/feed`)
    }

    let clubId, found
    do {
        clubId = nanoid()
        found = await Bookclub.findOne({clubId: clubId})
    } while (found)

    await Bookclub.create({
        name: req.body.name,
        instructor: req.user.id,
        clubId: clubId,
    })
    console.log('Bookclub has been created!')

    res.redirect('/feed')
}

exports.getBookclub = async (req, res) => {
    const bookclub = await Bookclub.findById(req.params.bookclubID)
    // console.log(bookclub)
    // console.log(req.user)
    console.log(bookclub)
    res.render('bookclub', {
        bookclubName: bookclub.name,
        userName: req.user.firstName,
        accountType: req.user.accountType,
        students: bookclub.students,
        bookclubID: bookclub.id
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
        return res.redirect(`/bookclub/${req.params.bookclubID}`)
    }

    req.body.studentEmail = validator.normalizeEmail(req.body.studentEmail, {
        gmail_remove_dots: false
    })

    const bookclub = await Bookclub.findById(req.params.bookclubID)
    const studentToAdd = await User.findOne({email: req.body.studentEmail}).lean()

    // Student was not found
    if (!studentToAdd) {
        req.flash('errors', [{msg: 'Student not found.'}])
        return res.redirect(`/bookclub/${req.params.bookclubID}`)
    }

    if (!bookclub.students.includes(studentToAdd._id) && studentToAdd.accountType === 'student') {
        const newStudents = bookclub.students.concat(studentToAdd._id)
        await Bookclub.findByIdAndUpdate(req.params.bookclubID, {
            students: newStudents
        })
    }

    res.redirect('/')
}