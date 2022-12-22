const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema({
    googleBooksId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    imgLink: {
        type: String,
        required: true
    },
    infoLink: {
        type: String,
        required: true
    }
    
})

module.exports = mongoose.model('Book', BookSchema)