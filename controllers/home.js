const Bookclub = require('../models/Bookclub')

exports.getIndex =  (req, res) => {
    res.render('index.ejs', {
        user: {
            loggedIn: false
        }
    })
}

exports.getFeed = async (req, res) => {
    if (req.user.accountType === 'reader'){
        // We are searching through the reader array in the bookclub objects
        // $elemMatch is not necessary because this is a single query condition
        const bookclubs = await Bookclub.find({readers: req.user.id})
        res.render('feedReader', {
            user: {
                loggedIn: false
            }, 
            bookclubs: bookclubs
        })
    }
    else if (req.user.accountType === 'clubmaker') {
        const bookclubs = await Bookclub.find({clubmaker: req.user.id})
        res.render('feedClubmaker', {
            user: {
                loggedIn: false
            }, 
            bookclubs: bookclubs
        })
    }
    else {
        console.error('accountType incorrect', req.body.accountType)
        res.redirect('/logout')
    }
}