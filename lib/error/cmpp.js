/*!
 * CMPP error
 */

var util = require('util');


/**
 * ECmpp
 * 
 *{name,message,stack}
 */
function ECmpp(msg, name) {
    ECmpp.super_.call(this);
    if (Error.captureStackTrace) {
        Error.captureStackTrace(this);
    } else {
        this.stack = new Error().stack;
    }
    this.name = name || '';
    this.message = msg || '';
}

/*!
 * Inherits from CommonError.
 */
util.inherits(ECmpp, Error);
/*!
 * exports
 */
module.exports = ECmpp;