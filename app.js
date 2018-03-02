'use strict';
/**
 * the application entrance
 * 
 * start express mongodb and so on.
 */

var fs = require('fs'),
    path = require('path'),
    http = require('http'),
    util = require('util'),
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    debug = require('debug')('Location:server'),
    ejs = require('ejs'),
    async = require('async'),
    crypto = require('crypto-js'),
    cuid = require('cuid'),
    sha1 = require('sha1'),
    logger = require('morgan'),
    schedule = require('node-schedule'),
    favicon = require('serve-favicon'),
    session = require('express-session');

var express = require('./bin/express.js');
var mongodb = require('./bin/mongodb.js');

var config = require('./config/config.js');

/**
 * Get port from environment and store in Express.
 */
/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || config.express.port);
express.set('port', port);

console.log("port:", config.express.port);

/**
 * Create HTTP server.
 */

var server = http.createServer(express);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
}






