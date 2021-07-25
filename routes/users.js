var express = require('express');
var userRouter = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
var authenticate = require('../authenticate');
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
	var token = authenticate.getToken({ _id: req.user._id });
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.json({ success: true, token: token, status: 'You are successfully logged in!' });
})

userRouter.get('/logout', authenticate.verifyUser, (req, res, next) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.json({ success: true, token: token, status: 'You are successfully logged out!' });
})

module.exports = userRouter;
