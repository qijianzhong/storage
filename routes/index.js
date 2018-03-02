var express = require('express');
var router = express.Router();
var imgInfo = require('../models/imgInfo.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/file', function(req, res, next) {
  res.render('file',{type:req.query.type});
});

router.get('/upload', function(req, res, next) {

  if(req.query.type == 'audio'){
    var joggle = 'upload_media'
  }else{
    var joggle = 'upload'
  };
  
  res.render('upload',{type:joggle});
});


module.exports = router;
