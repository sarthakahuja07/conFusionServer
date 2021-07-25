const express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Promotion = require('../models/promotions');

const promoRouter = express.Router();
promoRouter.use(express.json());//bodyParser

promoRouter.route('/')
    .get((req, res, next) => {
        Promotion.find({})
            .then(promotions => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(promotions)
            })
            .catch(err => next(err))
    })
    .post(authenticate.verifyUser,(req, res, next) => {
        Promotion.create(req.body)
            .then(promotion => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(promotion)
            })
            .catch(err => next(err))
    })
    .put(authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promos');
    })
    .delete(authenticate.verifyUser,(req, res, next) => {
        Promotion.remove({})
            .then(resp => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(resp)
            })
            .catch(err => next(err))
    });

promoRouter.route('/:promoId')
    .get((req, res, next) => {
        Promotion.findById(req.params.promoId)
            .then(promotion => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(promotion)
            })
            .catch(err => next(err))
    })
    .post(authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end('post operation is forbidden');
    })
    .put(authenticate.verifyUser,(req, res, next) => {
        Promotion.findByIdAndUpdate(req.params.promoId,
            { $set: req.body }, { new: true })
            .then(promotion => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(promotion)
            })
            .catch(err => next(err))
    })
    .delete(authenticate.verifyUser,(req, res, next) => {
        Promotion.findByIdAndRemove(req.params.promoId)
            .then(resp => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(resp)
            })
            .catch(err => next(err))
    });

module.exports = promoRouter;