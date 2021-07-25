const express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const authenticate = require('../authenticate');
const Leader = require('../models/leaders');

const leaderRouter = express.Router();
leaderRouter.use(express.json());//bodyParser

leaderRouter.route('/')
    .get((req, res, next) => {
        Leader.find({})
            .then(leaders => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(leaders)
            })
            .catch(err => next(err))
    })
    .post(authenticate.verifyUser,(req, res, next) => {
        Leader.create(req.body)
            .then(leader => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(leader)
            })
            .catch(err => next(err))
    })
    .put(authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promos');
    })
    .delete(authenticate.verifyUser,(req, res, next) => {
        Leader.remove({})
            .then(resp => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(resp)
            })
            .catch(err => next(err))
    });

leaderRouter.route('/:promoId')
    .get((req, res, next) => {
        Leader.findById(req.params.promoId)
            .then(leader => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(leader)
            })
            .catch(err => next(err))
    })
    .post(authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end('post operation is forbidden');
    })
    .put(authenticate.verifyUser,(req, res, next) => {
        Leader.findByIdAndUpdate(req.params.promoId,
            { $set: req.body }, { new: true })
            .then(leader => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(leader)
            })
            .catch(err => next(err))
    })
    .delete(authenticate.verifyUser,(req, res, next) => {
        Leader.findByIdAndRemove(req.params.promoId)
            .then(resp => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(resp)
            })
            .catch(err => next(err))
    });

module.exports = leaderRouter;