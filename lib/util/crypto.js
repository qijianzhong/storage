var cryptoJS = require('crypto-js');
var tool = require('./tool.js');


var LEN = 128 / 16,
    SIZE = 128 / 32;

/**
 * encode the password
 * 
 * @pwd:password
 * @len:the salt length
 * @size:the key size
 * 
 * @return salt + key
 */
exports.encode = function(pwd, len, size) {
    if (!pwd) return null;
    len = len || LEN;
    size = size || SIZE;
    var salt = tool.random(len, tool.RangeType.LOWER_NUMBER);
    var keyBits = cryptoJS.PBKDF2(pwd, salt, { keySize: size });
    return salt + keyBits.toString();
}

/**
 * decode the cryptograph
 * 
 * @pwd:password 
 * @cryptograph:salt+key
 * @len:the salt length
 * 
 * @return: boolean
 */
exports.decode = function(pwd, cryptograph, len, size) {
    len = len || LEN;
    size = size || SIZE;
    var salt = cryptograph.slice(0, len);
    var key = cryptograph.slice(len);
    var keyBits = cryptoJS.PBKDF2(pwd, salt, { keySize: size });
    return key == keyBits.toString();
}

/**
 * md5
 * 
 * @param {string} msg  加密的内容
 * @return {string} 签名值
 */
exports.md5 = function(msg) {
    return cryptoJS.MD5(msg).toString();
}