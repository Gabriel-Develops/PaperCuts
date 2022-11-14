const Bookclub = require('../models/Bookclub')

exports.getIndex =  (req, res) => {
    res.render('index.ejs', {loggedIn: false})
}

exports.getFeed = async (req, res) => {
    if (req.user.accountType === 'student'){
        // We are searching through the student array in the bookclub objects
        // $elemMatch is not necessary because this is a single query condition
        const bookclubs = await Bookclub.find({students: req.user.id})
        res.render('feedStudent', {loggedIn: true, bookclubs: bookclubs})
    }
    else if (req.user.accountType === 'instructor') {
        const bookclubs = await Bookclub.find({instructor: req.user.id})
        res.render('feedInstructor', {loggedIn: true, bookclubs: bookclubs})
    }
    else {
        console.error('accountType incorrect', req.body.accountType)
        res.redirect('/logout')
    }
}