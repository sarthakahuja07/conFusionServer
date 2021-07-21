const express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

const Dish = require('../models/dishes');

const dishRouter = express.Router();
dishRouter.use(express.json());//bodyParser


//ROUTE /dishes/
dishRouter.route('/')
    .get((req, res, next) => {
        Dish.find({})
            .then(dishes => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(dishes);
            })
            .catch(err => next(err))
    })
    .post((req, res, next) => {
        Dish.create(req.body)
            .then(dish => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(dish);
            })
            .catch(err => next(err))
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes');
    })
    .delete((req, res, next) => {
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
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('Will send details of the dish: ' + req.params.dishId + ' to you!');
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('post operation is forbidden');
    })
    .put((req, res, next) => {
        res.write('Updating the dish: ' + req.params.dishId + '\n');
        res.end('Will update the dish: ' + req.body.name +
            ' with details: ' + req.body.description);
    })
    .delete((req, res, next) => {
        res.end('Deleting dish: ' + req.params.dishId);
    });

module.exports = dishRouter;