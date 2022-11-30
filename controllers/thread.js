const Thread = require('../models/Thread')
const Comment = require('../models/Comment')
const User = require('../models/User')
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
        const comments = await Comment.find({threadId: req.params.threadId})
        const commentsForFE = []
        for (const comment of comments) {
            const author = await User.findById(comment.createdBy)
            commentsForFE.push({
                textContent: comment.text,
                createdAt: comment.createdAt,
                author: author.firstName
            })
        }
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
            },
            bookclub: {
                id: req.params.bookclubID
            },
            comments: commentsForFE
        })
    } catch(e) {
        console.error(e)
        res.redirect('/')
    }
}

exports.createComment = async (req, res) => {
    const commentText = req.body['comment-text'],
        threadId = req.params.threadId,
        bookclubId = req.params.bookclubID,
        userId = req.user._id
    try {
        await Comment.create({
            threadId: threadId,
            text: commentText,
            createdBy: userId
        })
        res.redirect('/bookclub/' + bookclubId + '/thread/' + threadId)
    } catch(e) {
        console.error(e)
        res.redirect('/')
    }
}