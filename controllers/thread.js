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