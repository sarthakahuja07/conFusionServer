var express = require('express')
var cors = require('cors')
var app = express()

var allowlist = ['http://localhost:3000', 'https://localhost:3443','http://Sarthak:3001']
var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (allowlist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
}

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);