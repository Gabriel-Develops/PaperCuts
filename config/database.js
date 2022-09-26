const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_STRING)

        console.log(`MongoDB Connected: ${conn.connection.host}`)

        return conn.connection.getClient()
    } catch(e) {
        console.error(e)
        process.exit(1)
    }
}

module.exports = connectDB