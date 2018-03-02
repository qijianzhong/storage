var mongoose = require('mongoose');
var conn2 = require('../bin/mongodb.js').conn2;

var imgSchema = new mongoose.Schema({
  mimetype:String,
  id:String,
  size:Number,
  time:String,
  newName:String,
  buffer:Buffer,
  owner:String,
  duration:String,
  // audiofileurl:String
  created:Number,
  updated:Number,
  extName:String
})


module.exports = conn2.model('imgInfo', imgSchema);