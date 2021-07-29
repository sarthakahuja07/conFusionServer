var express = require('express');
var userRouter = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
var authenticate = require('../authenticate');
const passport = require('passport');
const cors = require('./cors');

userRouter.use(express.json());//bodyParser

/* GET users listing. */
userRouter.get('/', cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, function (req, res, next) {
	User.find({})
		.then(users => {
			if (users) {
				res.status = 200;
				res.setHeader("Content-type", "application/json");
				res.json(users)
			} else {
				err = new Error("No users found")
				err.state = 404;
				next(err)
			}
		})
});

userRouter.post('/signup', cors.corsWithOptions, (req, res, next) => {
	User.register(new User({ username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname }), req.body.password, (err, user) => {
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

userRouter.post('/signin', cors.corsWithOptions, passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), (req, res, next) => {
	var token = authenticate.getToken({ _id: req.user._id });
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.json({ success: true, token: token, status: 'You are successfully logged in!' });
})

userRouter.get('/logout', cors.cors, authenticate.verifyUser, (req, res, next) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.json({ success: true, status: 'You are successfully logged out!' });
})


userRouter.get('/facebookLogin', cors.corsWithOptions, passport.authenticate('facebook'), (req, res, next) => {
	var token = authenticate.getToken({ _id: req.user._id });
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.json({ success: true, token: token, status: 'You are successfully logged in!' });
})

module.exports = userRouter;
