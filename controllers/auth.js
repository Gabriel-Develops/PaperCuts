const validator = require('validator')
const passport = require('passport')
const User = require('../models/User')

exports.getSignup = (req, res) => {
    console.log('User logged in?', !!req.user, req.user)
    res.render('signup.ejs')
}

exports.postSignup = (req, res) => {
    console.log(req.body)
    const validationErrors = []
    if (validator.isEmpty(req.body.firstName))
        validationErrors.push({msg: "Please enter a first name."})
    if (!validator.isEmail(req.body.email))
        validationErrors.push({msg: "Please enter a valid email address."})
    if (!validator.isLength(req.body.password, {min: 8}))
        validationErrors.push({msg: "Password must be at least 8 characters long."})
    if (req.body.password !== req.body.confirmPassword) {
        validationErrors.push({msg: "Passwords do not match."})
    }
    // console.log(validationErrors)
    if (validationErrors.length) {
        req.flash("errors", validationErrors)
        return res.redirect("/signup")
    }

    req.body.email = validator.normalizeEmail(req.body.email, {
        gmail_remove_dots: false
    })

    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
    })
    

    User.findOne({ email: req.body.email}, (err, existingUser) => {
        if (err)
            return next(err)
        if (existingUser) {
            req.flash('errors', {
                msg: 'Account with that email address already exists.'
            })
            return res.redirect('/signup')
        }
        user.save((err) => {
            if (err)
                return next(err)
            req.logIn(user, (err) => {
                if (err)
                    return next(err)
                res.redirect('/feed')
            })
        })
    })
}

exports.logout = (req, res) => {
    // Destroy session first and then log user out.
    req.session.destroy()
    req.logout(() => {
        console.log('User has logged out.')
    })
    res.redirect('/')
}

exports.getLogin = (req, res) => {
    res.render('login')
}

exports.postLogin = (req, res, next) => {
    const validationErrors = []
    if (!validator.isEmail(req.body.email))
        validationErrors.push({ msg: 'Please enter a valid email address.' })
    if (validator.isEmpty(req.body.password))
        validationErrors.push({ msg: 'Password cannot be blank.' })

    if (validationErrors.length) {
        req.flash('errors', validationErrors)
        return res.redirect('/login')
    }
    
    req.body.email = validator.normalizeEmail(req.body.email, {
        gmail_remove_dots: false
    })

    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err)
        if (!user) {
            req.flash('errors', info)
            return res.redirect('/login')
        }
        console.log(user)
        req.logIn(user, (err) => {
            if (err)
                return next(err)
            req.flash('success', { msg: 'Success! You are loggied in.' })
            res.redirect(req.session.returnTo || '/feed')
        })
    })(req, res, next)
}