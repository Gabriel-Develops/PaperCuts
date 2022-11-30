const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    threadId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Comment', CommentSchema)