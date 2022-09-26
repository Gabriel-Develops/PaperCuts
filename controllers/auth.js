const validator = require('validator')

module.exports = {
    getSignup: (req, res) => {
        res.render('signup.ejs')
    },
    postSignup: (req, res) => {
        console.log(req.body)
        const validationErrors = []
        if (!validator.isEmail(req.body.email))
            validationErrors.push({msg: "Please enter a valid email address."})
        if (validator.isLength(req.body.password, {min: 8}))
            validationErrors.push({msg: "Password mus be at least 8 characters long."})
        if (req.body.password !== req.body.confirmPassword) {
            validationErrors.push({msg: "Passwords do not match."})
        }

        if (validationErrors.length) {
            req.flash("errors", validationErrors)
            return res.redirect("../signup")
        }
        res.redirect('/signup')
    }
}