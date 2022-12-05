const Bookclub = require('../models/Bookclub')
const Thread = require('../models/Thread')

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
        } else if (req.user.accountType === 'clubmaker') {
            bookclubs = await Bookclub.find({clubmaker: req.user.id})
        }

        const bookclubsForFE = []
        for (let bookclub of bookclubs) {
            // If there are threads in the bookclub, it will default to an empty object
            let threadQuery = await Thread.findOne({bookclubId: bookclub._id}).sort({$natural:-1}).limit(1)
            let recentThread
            if (threadQuery) {
                recentThread = {
                    title: threadQuery.title,
                    description: threadQuery.description
                }
            } else {
                recentThread = null
            }
            bookclubsForFE.push({
                id: bookclub._id,
                name: bookclub.name,
                clubId: bookclub.clubId,
                readers: bookclub.readers,
                recentThread: recentThread
            })
        }
        res.render('feed', {
            user: {
                loggedIn: true,
                accountType: req.user.accountType
            }, 
            bookclubs: bookclubsForFE
        })
    } catch(e) {
        console.error(e)
        res.redirect('/')
    }
}