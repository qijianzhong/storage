/*!
 * Module dependencies.
 */
// var mongoose = gCmpp.module.mongoose;
var mongoose = require('mongoose');
var MongooseError = mongoose.Error;
// var util = gCmpp.module.util;
var util = require('util');
var CODE = require('./code.js');
var ECmpp = require('./cmpp.js');

/**
 * parse 
 */
function parse(err) {
    var codeKV = err;
    if (codeKV == null) {
        codeKV = CODE.Success;
    } else if (err instanceof CmmError) {
        codeKV = err.codeKV;
    } else if (err instanceof MongooseError) {
        codeKV = CODE.DBOperateWrong;
    } else if (err instanceof ECmpp) {
        codeKV = { code: CODE.Custom.code, error: err.message };
    } else if (err instanceof Error) {
        codeKV = CODE.System;
    } else if (typeof err != 'object' || !err.code) {
        codeKV = CODE.Unknow;
    }
    return codeKV;
}

/**
 * Common Error constructor.
 * 
 * @param err {any}
 */
function CmmError(err) {
    Object.assign(this, parse(err));
}

/*!
 * exports
 */
module.exports = CmmError;