var netResult = require('./result.js');

module.exports = function(request, response) {
    return function(err, res) {
        netResult(request, response, err, res);
    };
}