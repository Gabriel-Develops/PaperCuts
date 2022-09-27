module.exports = {
    ensureAuth: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
        } else {
            res.redirect('/')
        }
    },
    ensureGuest: (req, res, next) => {
        if (!req.isAuthenticated()) {
            return next()
        } else {
            res.redirect('/feed')
        }
    },
    ensureInstructor: (req, res, next) => {
        if (req.user.accountType === 'instructor'){
            return next()
        }
        else {
            res.redirect('/feed')
        }
    }
}