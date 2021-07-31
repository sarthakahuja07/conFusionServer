
const express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favorite = require('../models/favorites');

const favoriteRouter = express.Router();
favoriteRouter.use(express.json());//bodyParser


// /favorites

favoriteRouter.route('/')
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .then((favorites) => {
                if (!favorites) {
                    const err = new Error("you have no favorites")
                    err.status = 404
                    return next(err)
                }
                res.statusCode = 200
                res.setHeader('Content-type', 'application/json')
                res.json(favorites)
            })
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .then(favorite => {
                if (!favorite) {
                    Favorite.create({ user: req.user._id, dishes: req.body })
                        .then(favs => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(favs);
                        })
                } else {
                    const dish = favorite.dishes.filter(dish => {
                        return (dish._id.toString() === req.params.dishId)
                    })

                    if (dish.length === 0) {
                        favorite.dishes.push(req.params.dishId)
                        favorite.save()
                            .then(favs => {
                                res.statusCode = 200;
                                res.setHeader("Content-Type", "application/json");
                                res.json(favs);
                            })
                    }
                    else {
                        const err = new Error('you already have this dish as fav')
                        err.status = 404
                        return next(err)
                    }
                }
            })
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /favourites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOneAndDelete({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .then(fav => {
                if (!fav) {
                    const err = new Error('no fav dishes')
                    err.status = 404
                    return next(err)
                }
                res.statusCode = 200
                res.setHeader('Content-type', 'application/json')
                res.json(fav)
            })
    })




// /favorites/:dishId

favoriteRouter.route('/:dishId/')
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .then(favorite => {
                const dish = favorite.dishes.filter(dish => {
                    return (dish._id.toString() === req.params.dishId)
                })

                if (dish.length === 0) {
                    const err = new Error('you do not have this dish as fav')
                    err.status = 404
                    return next(err)
                }

                res.statusCode = 200
                res.setHeader('Content-type', 'application/json')
                res.json(dish)
            })
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .then(favorite => {
                if (!favorite) {
                    Favorite.create({ user: req.user._id })
                        .then(userFav => {
                            userFav.dishes.push(req.params.dishId)
                            userFav.save()
                                .then(favs => {
                                    res.statusCode = 200;
                                    res.setHeader("Content-Type", "application/json");
                                    res.json(favs);
                                })
                        })
                } else {
                    const dish = favorite.dishes.filter(dish => {
                        return (dish._id.toString() === req.params.dishId)
                    })

                    if (dish.length === 0) {
                        favorite.dishes.push(req.params.dishId)
                        favorite.save()
                            .then(favs => {
                                res.statusCode = 200;
                                res.setHeader("Content-Type", "application/json");
                                res.json(favs);
                            })
                    }
                    else {
                        const err = new Error('you already have this dish as fav')
                        err.status = 404
                        return next(err)
                    }
                }



            })
    })




module.exports = favoriteRouter