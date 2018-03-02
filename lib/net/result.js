var CODE = require('../error/code');
var CmmError = require('../error/common');

/**
 * @ret db result
 * @tag the node name (ret is the node content) 
 */
module.exports = exports = function (req, res, err, ret) {
    res.send(wrapResult(err, ret));
}

exports.wrapResult = wrapResult = function (err, res) {
    res = res || {};
    var cmmError = new CmmError(err);
    if(cmmError.code != CODE.Success.code) return cmmError;

    /////////
    // Filter: Mongoose Document Format
   
    // if ret is Mongoose Document use ret._doc else use ret
    var doc = (res._doc == null) ? res : res._doc;
    // ret is array you need to deal 
    if (doc instanceof Array) {
        doc = []; // { data: [] };
        res.forEach(function (v) {
            //if v._doc don't exist use v instead
            doc.push(v._doc || v);
        });
    }
    return doc;
}