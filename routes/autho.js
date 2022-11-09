const router = require("express").Router()
const User = require("./../models/User.model")
const bcrypt = require("bcryptjs")
const salt = 11

router.get("/signup", (req,res,next)=>{
    res.render("autho/signup")
})

router.get("/login", (req,res,next)=>{
    res.render("autho/login")
})

router.get("/main", (req,res,next)=>{
    res.render("main")
})
router.get("/private", (req,res,next)=>{
    res.render("private")
})

router.post("/signup", async(req,res,next)=>{
    const {username, password} = req.body

    try {

        if(!username || !password){
            return res.render("autho/signup",
            {errorMessage: "Please put your username and your password"})
        }

        const foundUser = await User.findOne({username})

        if(foundUser){
            return res.render("autho/signup",{
                errorMessage: "Usrname already taken"
            })
        }

        const generatedSalt = await bcrypt.genSalt(salt)
		const hashedPassword = await bcrypt.hash(password, generatedSalt)

        const newUser = await User.create({
			username,
			password: hashedPassword,
		})
        res.redirect("/")
    } catch (error) {
        console.log(error)
    }
})

router.post("/login", async (req, res, next) => {
	const { username, password } = req.body

	try {
		if (!username || !password) {
			return res.render("autho/login", {
				errorMessage: "Both fields are mandatory",
			})
		}
		const foundUser = await User.findOne({ username })

		if (!foundUser) {
			return res.render("autho/login", {
				errorMessage: "This user isn't found !",
			})
		}

		const samePassword = await bcrypt.compare(password, foundUser.password)

		if (!samePassword) {
			return res.render("autho/login", {
				errorMessage: "Wrong password",
			})
		}

		req.session.currentUser = foundUser

		res.redirect("/profile")
	} catch (error) {
		next(error)
	}
})

router.get("/logout", async (req, res, next) => {
	await req.session.destroy()
	res.redirect("/")
})

module.exports = router