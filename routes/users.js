var express = require('express');
var userRouter = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');

const passport = require('passport');

userRouter.use(express.json());//bodyParser

/* GET users listing. */
userRouter.get('/', function (req, res, next) {
	res.send('respond with a resource');
});

userRouter.post('/signup', (req, res, next) => {
	User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
		if (err) {
			res.statusCode = 500;
			res.setHeader('Content-Type', 'application/json');
			res.json({ err: err });
		} else {
			console.log('user registered!');
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json({ status: "signed up" });
		}
	})
})

userRouter.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), (req, res, next) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.json({ success: true, status: 'You are successfully logged in!' });
})

userRouter.get('/logout', (req, res, next) => {
	if (req.session) {
		req.session.destroy();
		res.clearCookie('session-id');
		res.redirect('/');
	}
	else {
		var err = new Error('You are not logged in!');
		err.status = 403;
		next(err);
	}
})

module.exports = userRouter;
