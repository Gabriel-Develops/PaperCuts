const Bookclub = require('../models/Bookclub')
const Thread = require('../models/Thread')
const validator = require('validator')
const User = require('../models/User')
const nanoid = require('../middleware/nanoid')
const Book = require('../models/Book')

exports.createBookclub = async (req, res) => {
    const validationErrors = []
    if (validator.isEmpty(req.body.name))
        validationErrors.push({msg: 'Name of bookclub can not be empty.'})
    if (validator.isEmpty(req.body['book-isbn']))
        validationErrors.push({msg: 'ISBN can not be empty.'})
    if (!validator.isISBN(req.body['book-isbn']))
        validationErrors.push({msg: 'ISBN must be ISBN-10 or ISBN-13.'})
    if (validationErrors.length) {
        req.flash('errors', validationErrors)
        return res.redirect(`/feed`)
    }

    const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=isbn:' + req.body['book-isbn'])
    const results = await response.json()
    const bookFromAPI = results.items[0]

    let book
    if (!await Book.findOne({googleBooksId: bookFromAPI.id})) {
        book = await Book.create({
            googleBooksId: bookFromAPI.id,
            title: bookFromAPI.volumeInfo.title,
            description: bookFromAPI.volumeInfo.description,
            author: bookFromAPI.volumeInfo.authors[0],
            imgLink: bookFromAPI.volumeInfo.imageLinks['thumbnail'],
            infoLink: bookFromAPI.volumeInfo.infoLink
        })
        console.log(book)
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
        bookId: book.id
    })

    res.redirect(`/bookclub/${bookclub.id}`)
}

exports.getBookclub = async (req, res) => {
    const bookclub = await Bookclub.findById(req.params.bookclubID)
    const clubmaker = await User.findById(bookclub.clubmaker)
    const book = await Book.findById(bookclub.bookId)

    const threadsFromDB = await Thread.find({
        bookclubId: req.params.bookclubID
    }).sort({createdAt: -1})
    const threadsForFrontend = []
    for (const thread of threadsFromDB) {
        const author = await User.findById(thread.author)
        threadsForFrontend.push({
            id: thread._id,
            createdBy: author.firstName,
            title: thread.title,
            description: thread.description,
            likes: thread.likes,
            createdAt: thread.createdAt
        })
    }
    const readers = []
    for (const reader of bookclub.readers) {
        const userQuery = await User.findById(reader._id)
        readers.push({
            firstName: userQuery.firstName
        })
    }
    // We could do clean up the threads using a map, but since we have an asynchronious action we would need to use Promise.all to resolve the array of promises that would be returned, this is a valid solution but using a for...of loop feels more readable
    // const threads = await Promise.all(threadsFromDB.map(async thread => {
    //     const author = await User.findById(thread.author)
    //     return {
    //         threadId: thread._id,
    //         createdBy: author.firstName,
    //         title: thread.title,
    //         description: thread.description,
    //         likes: thread.likes,
    //         createdAt: thread.createdAt
    //     }
    // }))

    // console.log(threadsForFrontend)
    // console.log(req.user)
    // console.log(bookclub)
    res.render('bookclub', {
        user: {
            loggedIn: true,
            firstName: req.user.firstName,
            accountType: req.user.accountType
        },
        bookclub: {
            name: bookclub.name,
            readers: readers,
            id: bookclub._id,
            clubId: bookclub.clubId,
            createdAt: bookclub.createdAt,
            createdBy: clubmaker.firstName
        },
        threads: threadsForFrontend,
        book: {
            title: book.title,
            description: book.description,
            author: book.author,
            imgLink: book.imgLink,
            infoLink: book.infoLink
        }
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
    await Bookclub.findByIdAndUpdate(
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
    res.redirect('/feed')
}

exports.deleteBookclub = async (req, res) => {
    await Bookclub.findByIdAndDelete(req.params.bookclubID)
    res.redirect('/feed')
}