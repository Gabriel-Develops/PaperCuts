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

    const bookclub = await Bookclub.create({
        name: req.body.name,
        clubmaker: req.user.id,
        clubId: clubId,
    })

    console.log('Bookclub has been created!')

    res.redirect(`/bookclub/${bookclub.id}`)
}

exports.getBookclub = async (req, res) => {
    const bookclub = await Bookclub.findById(req.params.bookclubID)
    // console.log(req.user)
    // console.log(bookclub)
    res.render('bookclub', {
        loggedIn: true,
        bookclubName: bookclub.name,
        userName: req.user.firstName,
        accountType: req.user.accountType,
        readers: bookclub.readers,
        bookclubID: bookclub.id,
        clubId: bookclub.clubId
    })
}

exports.addReader = async (req, res) => {
    const validationErrors = []
    if (validator.isEmpty(req.body.readerEmail))
        validationErrors.push({msg: 'Please enter a reader email.'})
    if (!validator.isEmail(req.body.readerEmail))
        validationErrors.push({msg: 'Please enter a valid email address.'})

    if (validationErrors.length) {
        req.flash('errors', validationErrors)
        return res.redirect(`/bookclub/${req.params.bookclubID}`)
    }

    req.body.readerEmail = validator.normalizeEmail(req.body.readerEmail, {
        gmail_remove_dots: false
    })

    const readerToAdd = await User.findOne({
        email: req.body.readerEmail,
        accountType: 'reader'
    }).lean()

    // Reader was not found
    if (!readerToAdd) {
        req.flash('errors', [{msg: 'Reader not found.'}])
        return res.redirect(`/bookclub/${req.params.bookclubID}`)
    }

    await Bookclub.findOneAndUpdate({
        // Condition
        _id: req.params.bookclubID,
        readers: { $ne: readerToAdd._id }
    }, {
        // Update
        $push: {
            readers: readerToAdd._id
        }
    })

    res.redirect(`/bookclub/${req.params.bookclubID}`)
}

exports.addBookclub = async (req, res) => {
    const validationErrors = []
    if (validator.isEmpty(req.body.clubCode))
        validationErrors.push({msg: 'Bookclub code can not be empty.'})

    if (validationErrors.length) {
        req.flash('errors', validationErrors)
        return res.redirect('/feed')
    }

    const bookclub = await Bookclub.findOneAndUpdate({
        // Condition - Find club with user specified ID, and Club where user isn't already enrolled
        clubId: req.body.clubCode,
        readers: { $ne: req.user.id }
    }, { 
        // Update
        $push: { 
            readers: req.user.id,
        } 
    })

    if (!bookclub) {
        req.flash('errors', [{msg: 'Bookclub not found with.'}])
    }

    res.redirect('/feed')
}

exports.leaveBookclub = async (req, res) => {
    console.log('Bookclub left!')
    const temp = await Bookclub.findByIdAndUpdate(
        // Condition (id)
        req.params.bookclubID,
        // Update
        {
            // Pull operator removes from an existing array all instances of a value that match a specified condition
            $pull: {
                readers: req.user.id
            }
        }
    )
    console.log('result', temp)
    res.redirect('/feed')
}

exports.deleteBookclub = async (req, res) => {
    await Bookclub.findByIdAndDelete(req.params.bookclubID)
    res.redirect('/feed')
}