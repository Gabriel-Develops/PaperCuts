const Bookclub = require('../models/Bookclub')

exports.getIndex =  (req, res) => {
    res.render('index.ejs', {
        user: {
            loggedIn: false
        }
    })
}

exports.getFeed = async (req, res) => {
    try {
        let bookclubs
        if (req.user.accountType === 'reader'){
            // We are searching through the reader array in the bookclub objects
            // $elemMatch is not necessary because this is a single query condition
            bookclubs = await Bookclub.find({readers: req.user.id})
        }
        else if (req.user.accountType === 'clubmaker') {
            bookclubs = await Bookclub.find({clubmaker: req.user.id})
        }
    
        res.render('feed', {
            user: {
                loggedIn: true,
                accountType: req.user.accountType
            }, 
            bookclubs: bookclubs
        })
    } catch(e) {
        console.error(e)
        res.redirect('/')
    }
}