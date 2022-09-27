const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const morgan = require('morgan')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('express-flash')
const connectDB = require('./config/database')
const mainRoutes = require('./routes/main')
const classroomRoutes = require('./routes/classroom')
require('dotenv').config({ path: './config/.env' })

// Passport config
require('./config/passport')(passport)

// Connect to Database
const clientPromise = connectDB()

// EJS - View Engine
app.set('view engine', 'ejs')

// Body Parsing
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Logger
app.use(morgan('dev'))

// Setup Sessions - stored in MongoDB
app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({
            clientPromise: clientPromise,
            autoRemove: 'interval',
            autoRemoveInterval: 1
        })
    })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Flash messages for errors, info, etc
app.use(flash())

// Setup Routes
app.use("/", mainRoutes)
app.use("/classroom", classroomRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})