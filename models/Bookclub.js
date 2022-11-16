const mongoose = require('mongoose')

const BookclubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    clubmaker: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    readers: {
        type: [mongoose.Schema.Types.ObjectId],
    },
    clubId: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Bookclub', BookclubSchema)