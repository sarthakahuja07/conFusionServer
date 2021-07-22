var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const dishRouter = require('./routes/dishRouter');
const leaderRouter = require('./routes/leaderRouter');
const promoRouter = require('./routes/promoRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('sarthak07'));

//AUTH
const auth = (req, res, next) => {
	if (!req.signedCookies.user) {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			res.setHeader('WWW-Authenticate', 'Basic');
			const err = new Error("unauthorized");
			err.status = 401;
			return next(err);
		}
		const [username, password] = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');

		if (username && password && username === 'admin' && password === 'password') {
			res.cookie('user', 'admin', { signed: true })
			return next()
		} else {
			res.setHeader('WWW-Authenticate', 'Basic');
			const err = new Error("wrong username pass");
			err.status = 401;
			return next(err);
		}
	} else {
		if (req.signedCookies.user === 'admin') {
			return next()
		} else {
			const err = new Error("wrong username pass");
			err.status = 401;
			return next(err);
		}
	}
}

app.use(auth)

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/leaders', leaderRouter);
app.use('/promos', promoRouter);

//DB
var mongoDB = 'mongodb://localhost:27017/conFusion';

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
	.then(db => {
		console.log("conneced to db")
	})
	.catch(err => console.log(err))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
