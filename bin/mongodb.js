/**
 * mongodb service
 */
var mongoose   = require('mongoose');
var config     = require('../config/config.js');

var connection = mongoose.connection;
var url1 = process.env.MONGO || config.mongodb.url1;
var url2 = process.env.MONGO || config.mongodb.url2;

if (global.Promise) {
    mongoose.Promise = global.Promise;
}

// exports.openDB = function(cb) {
//     cb = cb || function () { };
//     mongoose.connect(url1, { useMongoClient: true }).then(function (db) {
//         console.log('mongodb connected');
//         cb(null, db);
//     });
// }


var conn1 = mongoose.createConnection(url1);
var conn2 = mongoose.createConnection(url2);
conn1.on('connected',function(err){
    if(err){
        console.log('连接数据库失败：'+err);
    }else{
        console.log('连接数据库'+conn1.name+'成功！');
    }
});
conn2.on('connected',function(err){
    if(err){
        console.log('连接数据库失败：'+err);
    }else{
        console.log('连接数据库'+conn2.name+'成功！');
    }
});

exports.conn1 = conn1;
exports.conn2 = conn2;

exports.closeDB = function(cb) {
    cb = cb || function() {};
    mongoose.disconnect(cb);
}