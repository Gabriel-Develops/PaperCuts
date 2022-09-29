const Bookclub = require('../models/Bookclub')

exports.getIndex =  (req, res) => {
    res.render('index.ejs')
}

exports.getFeed = async (req, res) => {
    if (req.user.accountType === 'student'){
        const bookclubs = await Bookclub.find({'students': req.user.id})
        // console.log(bookclubs, req.user.id)
        res.render('feedStudent', {bookclubs: bookclubs})
    }
    else if (req.user.accountType === 'instructor') {
        const bookclubs = await Bookclub.find({instructor: req.user.id})
        res.render('feedInstructor', {bookclubs: bookclubs})
    }
    else {
        console.error('accountType incorrect', req.body.accountType)
        res.redirect('/logout')
    }
}