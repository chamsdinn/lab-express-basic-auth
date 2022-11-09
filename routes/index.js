const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
router.get("/profile", (req, res, next) => {
	console.log(req.session.currentUser)
	res.render("profile", { currentUser: req.session.currentUser })
})

module.exports = router;
