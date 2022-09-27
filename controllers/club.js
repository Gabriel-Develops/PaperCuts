exports.getFeed =  (req, res) => {
    if (req.user.accountType === 'student')
        res.render('feedStudent')
    else if (req.user.accountType === 'instructor')
        res.render('feedInstructor')
    else {
        console.error('accountType incorrect', req.body.accountType)
        res.redirect('/logout')
    }
}