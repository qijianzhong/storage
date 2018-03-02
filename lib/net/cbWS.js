var netResult = require('./result.js'),
    resultRsp = netResult.resultRsp;
var C_TAG = 'return';

module.exports = function (tag, cb) {
    if (typeof tag == 'function') {
        cb = tag;
        tag = C_TAG;
    }
    return function (err, res) {
        var ret = {};
        ret[tag] = resultRsp(err, res)
        cb(ret);
    };
}
