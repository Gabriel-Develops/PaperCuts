module.exports = {
    getSignup: (req, res) => {
        res.render('signup.ejs')
    },
    postSignup: (req, res) => {
        console.log(req.body)
        res.redirect('/signup')
    }
}