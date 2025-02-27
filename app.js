// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');
const session = require("express-session")
const MongoStore = require("connect-mongo")
// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');
const port = process.env.PORT
const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

app.set("trust proxy", 1)

app.use(
	session({
		secret: process.env.SESS_SECRET,
		cookie: {
			maxAge: 1000 * 60 * 60,
		},
		store: MongoStore.create({
			mongoUrl: process.env.MONGO_URI || "mongodb://127.0.0.1/lab-express-basic-auth"
		}),
	})
)


const { exposeUserToView } = require("./middlewares/middlewares")

app.use(exposeUserToView)
// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

const authoRouter = require('./routes/autho')
app.use('/autho', authoRouter)

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;

