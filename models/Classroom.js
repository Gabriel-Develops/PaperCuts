const mongoose = require('mongoose')

const ClassroomSchema = new mongoose.Schema({
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
})

module.exports = mongoose.model('Classroom', ClassroomSchema)