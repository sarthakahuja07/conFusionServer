const express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Dish = require('../models/dishes');

const dishRouter = express.Router();
dishRouter.use(express.json());//bodyParser


//ROUTE /dishes/
dishRouter.route('/')
    .get((req, res, next) => {
        Dish.find({})
            .populate('comments.author')
            .then(dishes => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(dishes);
            })
            .catch(err => next(err))
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Dish.create(req.body)
            .then(dish => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(dish);
            })
            .catch(err => next(err))
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes');
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Dish.remove({})
            .then(resp => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(resp);
            })
            .catch(err => next(err))
    });

//ROUTE /dishes/:dishId

dishRouter.route('/:dishId')
    .get((req, res, next) => {
        Dish.findById(req.params.dishId)
            .populate('comments.author')
            .then(dish => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(dish);
            })
            .catch(err => next(err))
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('post operation is forbidden');
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Dish.findByIdAndUpdate(req.params.dishId,
            { $set: req.body }, { new: true })
            .then(dish => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(dish);
            })
            .catch(err => next(err))
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Dish.findByIdAndRemove(req.params.dishId)
            .then(resp => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(resp);
            })
            .catch(err => next(err))
    });





//ROUTE /dishes/:dishId:comments
dishRouter.route('/:dishId/comments')
    .get((req, res, next) => {
        Dish.findById(req.params.dishId)
            .populate('comments.author')
            .then(dish => {
                dish ?
                    (
                        res.statusCode = 200,
                        res.setHeader('Content-type', 'application/json'),
                        res.json(dish?.comments)
                    )
                    :
                    (
                        err = new Error('Dish ' + req.params.dishId + ' not found'),
                        err.status = 404,
                        next(err)
                    )
            })
            .catch(err => next(err))
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Dish.findById(req.params.dishId)
            .populate('comments.author')
            .then(dish => {
                dish ?
                    (
                        req.body.author = req.user._id,
                        dish?.comments.push(req.body),
                        dish.save()
                            .then(dish => {
                                Dish.findById(dish._id)
                                    .populate('comments.author')
                                    .then(dish => {
                                        res.statusCode = 200,
                                            res.setHeader('Content-type', 'application/json'),
                                            res.json(dish)
                                    })
                            })
                    )
                    :
                    (
                        err = new Error('Dish ' + req.params.dishId + ' not found'),
                        err.status = 404,
                        next(err)
                    )
            })
            .catch(err => next(err))
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported');
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Dish.findById(req.params.dishId)
            .then(dish => {
                dish ?
                    (
                        dish?.comments.splice(0, dish?.comments.length),
                        dish.save()
                            .then(dish => {
                                res.statusCode = 200,
                                    res.setHeader('Content-type', 'application/json'),
                                    res.json(dish)
                            })
                    )
                    :
                    (
                        err = new Error('Dish ' + req.params.dishId + ' not found'),
                        err.status = 404,
                        next(err)
                    )
            })
            .catch(err => next(err))
    });

// ROUTE / dishes /: dishId / comments /: commentId

dishRouter.route('/:dishId/comments/:commentId')
    .get((req, res, next) => {
        Dish.findById(req.params.dishId)
            .populate('comments.author')
            .then(dish => {
                dish ?
                    (
                        dish.comments?.id(req.params.commentId) ?
                            (
                                res.statusCode = 200,
                                res.setHeader('Content-type', 'application/json'),
                                res.json(dish?.comments?.id(req.params.commentId))
                            )
                            :
                            (
                                err = new Error('Comment ' + req.params.commentId + ' not found'),
                                err.status = 404,
                                next(err)
                            )
                    )
                    :
                    (
                        err = new Error('Dish ' + req.params.dishId + ' not found'),
                        err.status = 404,
                        next(err)
                    )
            })
            .catch(err => next(err))
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('post operation is forbidden');
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        Dish.findById(req.params.dishId)
            .then(dish => {
                dish ?
                    (
                        dish.comments?.id(req.params.commentId) ?
                            (
                                myComment = dish?.comments?.id(req.params.commentId),
                                !myComment.author._id.equals(req.user._id) ?
                                    (
                                        err = new Error("You are not authorized to perform this operation!"),
                                        err.status = 404,
                                        next(err)
                                    ) :
                                    (
                                        res.statusCode = 200,
                                        res.setHeader('Content-type', 'application/json'),
                                        myComment.set(req.body),
                                        dish.save()
                                            .then(dish => {
                                                Dish.findById(dish._id)
                                                    .populate('comments.author')
                                                    .then((dish) => {
                                                        res.statusCode = 200;
                                                        res.setHeader('Content-Type', 'application/json');
                                                        res.json(dish);
                                                    })
                                            })
                                    )
                            )
                            :
                            (
                                err = new Error('Comment ' + req.params.commentId + ' not found'),
                                err.status = 404,
                                next(err)
                            )
                    )
                    :
                    (
                        err = new Error('Dish ' + req.params.dishId + ' not found'),
                        err.status = 404,
                        next(err)
                    )
            })
            .catch(err => next(err))
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Dish.findById(req.params.dishId)
            .then(dish => {
                dish ?
                    (
                        dish.comments?.id(req.params.commentId) ?
                            (
                                myComment = dish?.comments?.id(req.params.commentId),
                                !myComment.author._id.equals(req.user._id) ?
                                    (
                                        err = new Error("You are not authorized to perform this operation!"),
                                        err.status = 404,
                                        next(err)
                                    ) :
                                    (
                                        res.statusCode = 200,
                                        res.setHeader('Content-type', 'application/json'),
                                        dish?.comments?.id(req.params.commentId).remove(),
                                        dish.save()
                                            .then(dish => {
                                                res.json(dish)
                                            })
                                    )


                            )
                            :
                            (
                                err = new Error('Comment ' + req.params.commentId + ' not found'),
                                err.status = 404,
                                next(err)
                            )
                    )
                    :
                    (
                        err = new Error('Dish ' + req.params.dishId + ' not found'),
                        err.status = 404,
                        next(err)
                    )
            })
            .catch(err => next(err))
    });



module.exports = dishRouter;