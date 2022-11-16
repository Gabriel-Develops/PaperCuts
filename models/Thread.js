const mongoose = require('mongoose')

const ThreadSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    likes: {
        type: Number,
        required: true,
        default: 0
    },
    likedBy: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Thread', ThreadSchema)