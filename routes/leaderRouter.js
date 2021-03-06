const express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const authenticate = require('../authenticate');
const Leader = require('../models/leaders');
const cors = require('./cors');

const leaderRouter = express.Router();
leaderRouter.use(express.json());//bodyParser

leaderRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })    
    .get(cors.cors, (req, res, next) => {
        Leader.find(req.query)
            .then(leaders => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(leaders)
            })
            .catch(err => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Leader.create(req.body)
            .then(leader => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(leader)
            })
            .catch(err => next(err))
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promos');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Leader.remove({})
            .then(resp => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(resp)
            })
            .catch(err => next(err))
    });

leaderRouter.route('/:promoId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })    
    .get(cors.cors, (req, res, next) => {
        Leader.findById(req.params.promoId)
            .then(leader => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(leader)
            })
            .catch(err => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('post operation is forbidden');
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Leader.findByIdAndUpdate(req.params.promoId,
            { $set: req.body }, { new: true })
            .then(leader => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(leader)
            })
            .catch(err => next(err))
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Leader.findByIdAndRemove(req.params.promoId)
            .then(resp => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(resp)
            })
            .catch(err => next(err))
    });

module.exports = leaderRouter;