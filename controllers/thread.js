const Thread = require('../models/Thread')
const validator = require('validator')

exports.createThread = async (req, res) => {
    if (validator.isEmpty(req.body.title) || validator.isEmpty(req.body.description)) {
        console.log('hit')
        req.flash('threadError', 'Title and Description cannot be empty.')
        return res.redirect(`/bookclub/${req.params.bookclubID}`)
    }
    
    try {
        await Thread.create({
            title: req.body.title,
            description: req.body.description,
            author: req.user._id,
            bookclubId: req.params.bookclubID
        })
    } catch(e) {
        console.error(e)
    }

    res.redirect('/bookclub/' + req.params.bookclubID)
}

exports.getThread = async (req, res) => {
    try {
        const thread = await Thread.findById(req.params.threadId)
        console.log(thread)
        res.render('thread', {
            user: {
                loggedIn: true,
                accountType: req.user.accountType
            },
            thread: {
                id: thread._id,
                title: thread.title,
                description: thread.description,
                author: thread.author,
                likes: thread.likes,
                createdAt: thread.createdAt
            }
        })
    } catch(e) {
        console.error(e)
        res.redirect('/')
    }
}