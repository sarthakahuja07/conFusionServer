var express = require('express');
var userRouter = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');

userRouter.use(express.json());//bodyParser

/* GET users listing. */
userRouter.get('/', function (req, res, next) {
	res.send('respond with a resource');
});

userRouter.post('/signup', (req, res, next) => {
	User.findOne({ username: req.body.username })
		.then(user => {
			if (user != null) {
				const err = new Error('user already exists')
				err.status = 403
				return next(err)
			} else {
				return User.create(req.body)
			}
		})
		.then(	user => {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json({ status: 'Registration Successful!', user: user });
		})
		.catch(err => next(err))
})

userRouter.post('/signin', (req, res, next) => {
	if (!req.session.user) {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			res.setHeader('WWW-Authenticate', 'Basic');
			const err = new Error("unauthorized");
			err.status = 401;
			return next(err);
		}
		const [username, password] = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
		User.findOne({ username: username })
			.then((user) => {
				if (user === null) {
					var err = new Error('User ' + username + ' does not exist!');
					err.status = 403;
					return next(err);
				}
				else if (user.password !== password) {
					var err = new Error('Your password is incorrect!');
					err.status = 403;
					return next(err);
				}
				else if (user.username === username && user.password === password) {
					req.session.user = 'authenticated';
					res.statusCode = 200;
					res.setHeader('Content-Type', 'text/plain');
					res.end('You are authenticated!')
				}
			})
			.catch(err => next(err))
	} else {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/plain');
		res.end('You are already authenticated!');
	}
})

userRouter.get('/logout', (req, res, next) => {
	if (req.session.user) {
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
