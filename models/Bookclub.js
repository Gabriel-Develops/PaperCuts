const mongoose = require('mongoose')

const BookclubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    students: {
        type: [mongoose.Schema.Types.ObjectId],
    },
    clubId: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Bookclub', BookclubSchema)