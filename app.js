var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session')
var FileStore = require('session-file-store')(session);
const passportLocal = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const dishRouter = require('./routes/dishRouter');
const leaderRouter = require('./routes/leaderRouter');
const promoRouter = require('./routes/promoRouter');
var authenticate = require('./authenticate');
const passport = require('passport');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
	name: 'session-id',
	saveUninitialized: false,
	resave: false,
	secret: 'sarthak07',
	store: new FileStore(),
}))
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);



//AUTH
const auth = (req, res, next) => {
	if (!req.user) {
		var err = new Error('You are not authenticated!');
		err.status = 403;
		return next(err);
	} else {
		next();
	}
}

app.use(auth)

app.use(express.static(path.join(__dirname, 'public')));
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
