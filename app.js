var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const config = require('./config');
var mongoose = require('mongoose');
var session = require('express-session')
var FileStore = require('session-file-store')(session);
const passportLocal = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var uploadRouter = require('./routes/uploadRouter');
const dishRouter = require('./routes/dishRouter');
const leaderRouter = require('./routes/leaderRouter');
const promoRouter = require('./routes/promoRouter');
var authenticate = require('./authenticate');
const passport = require('passport');

var app = express();
//Transferring http to https
app.all('*', (req, res, next) => {
	if (req.secure) {
		return next();
	}
	else {
		res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
	}
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/dishes', dishRouter);
app.use('/leaders', leaderRouter);
app.use('/promos', promoRouter);
app.use('/imageUpload', uploadRouter);

//DB
var mongoDB = config.mongoUrl;

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
