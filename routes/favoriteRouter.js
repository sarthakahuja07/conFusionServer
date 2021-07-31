const express = require('express');
var mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favorite = require('../models/favorites');
const User = require('../models/user');

const favoriteRouter = express.Router()
favoriteRouter.use(express.json());//bodyParser


favoriteRouter.route('/')
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.find({ user: req.user })
            .populate('user')
            .populate('dishes')
            .then((favorites) => {
                if (favorites.length == 0) {
                    const err = new Error("you have no favorites")
                    err.status = 404
                    return next(err)
                }
                res.statusCode = 200
                res.setHeader('Content-type', 'application/json')
                res.json(favorites)
            })
    })

module.exports = favoriteRouter