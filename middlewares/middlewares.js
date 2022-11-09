function exposeUserToView(req, res, next) {
	if (req.session.currentUser) {
		res.locals.currentUser = req.session.currentUser
		res.locals.isLoggedIn = true
	}
	next()
}

function isLoggedIn(req, res, next) {
	if (req.session.currentUser) {
		next()
        return
	}
	res.redirect("/autho/signup")
}

module.exports = {
	isLoggedIn,
	exposeUserToView,
}