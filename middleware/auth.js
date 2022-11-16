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
    ensureClubmaker: (req, res, next) => {
        if (req.user.accountType === 'clubmaker'){
            return next()
        }
        else {
            res.redirect('/feed')
        }
    }
}