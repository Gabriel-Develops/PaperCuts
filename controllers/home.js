const Bookclub = require('../models/Bookclub')
const Thread = require('../models/Thread')
const Book = require('../models/Book')

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
            // If there are no threads in the bookclub, findOne will return null
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

            const book = await Book.findById(bookclub.bookId)

            bookclubsForFE.push({
                id: bookclub._id,
                name: bookclub.name,
                clubId: bookclub.clubId,
                readers: bookclub.readers,
                recentThread: recentThread,
                bookTitle: book.title,
                bookImg: book.imgLink
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