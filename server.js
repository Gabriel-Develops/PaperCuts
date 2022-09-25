const express = require('express')
const app = express()
const morgan = require('morgan')
const connectDB = require('./config/database')
const mainRoutes = require('./routes/main')
require('dotenv').config({ path: './config/.env' })

// Connect to Database
connectDB()

// EJS - View Engine
app.set('view engine', 'ejs')

// Body Parsing
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Logger
app.use(morgan('dev'))

// Setup Routes
app.use("/", mainRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})