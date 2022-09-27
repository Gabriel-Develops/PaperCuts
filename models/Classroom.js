const mongoose = require('mongoose')

const ClassroomSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
    },
    students: {
        type: [mongoose.Schema.Types.ObjectId],
    },
})

module.exports = mongoose.model('Classroom', ClassroomSchema)