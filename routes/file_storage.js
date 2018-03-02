var express = require('express');
var router = express.Router();
var fs = require('fs');
var async = require("async");
var cache = require('memory-cache');
var config = require('../config/config.js');                //Call the configuration file
var imgInfo = require('../models/imgInfo.js');
var gm = require('gm');


//获取文件列表信息
router.get('/list', function (req, res, next) {
  //如果有排序参数传过来
  if (req.query.startIndex) {
    if (req.query.orderBy) {
      var order = req.query.order;
      var orderBy = req.query.orderBy;
      if (order == "DESC") {
        orderBy = '-' + req.query.orderBy;
      }
    } else {    //当只有参数'cookireObj'传过来时,利用前端cookie获取列表,应用于页面中的刷新按钮
      var order = req.query.cookireObj.order || 'ASC';
      var orderBy = req.query.cookireObj.orderBy || 'time';
      if (order == "DESC") {
        orderBy = '-' + req.query.cookireObj.orderBy;
      }
    }
  }

  var query = {};
  req.session.user ? query.source = req.session.user.username : query.source = "unknown"
  if (req.session.user && req.session.user.permissions && req.session.user.permissions.storage && req.session.user.permissions.storage.indexOf("beacons") >= 0 ) {
    delete query.source
  }
  var mimeType = req.query.mimeType;
  if (mimeType == 'all' || mimeType == undefined) { 
    query.mimetype = /^/
  } else if (mimeType == 'photo') { 
    query.mimetype = /^image/
  } else if (mimeType == 'audio') {
    query.mimetype = /^audio/
  } else if (mimeType == 'video') { 
    query.mimetype = /^video/
  } else {
    query.mimetype = 'error code'
  }
  console.log("query:",query);

  var pageIndex = Number((req.query.startIndex - 1) * req.query.maxResult);
  var pageSize = Number(req.query.maxResult);
  async.parallel([
    function (callback) {
      imgInfo.find(query,{buffer:0}).skip(pageIndex).limit(pageSize).sort({$natural:-1}).exec(function (err, docs) {
        var result = new Array();
        docs.forEach(function (item) {
          var duration = item.duration || 'null'
          if (item.mimetype.split('/')[0] == 'image') {
            var fileUrl = config.host.outprefix + '/file/thumbnail/' + item.id + '.' + item.mimetype.split('/')[1]
          }
          else if(item.mimetype.split('/')[0] == 'audio'){
              var fileUrl = config.host.outprefix + '/file/original/' + item.id + '.' + item.mimetype.split('/')[1]
          }else{
              var fileUrl = config.host.outprefix + '/file/original/' + item.id + '.' + item.mimetype.split('/')[1]
          };
            data = { 'id': item.id, 'mimetype': item.mimetype, 'time': item.time, 'size': item.size, 'newName': item.newName, 'source': item.source, 'fileUrl': fileUrl, 'duration': duration };
            result.push(data);
          });
          callback(null, result);
        });
    },
    function (callback) {
      imgInfo.count(query).exec(function (err, length) {
        var pagination = Math.ceil(length / pageSize);
        var data = { total: length, pagination: pagination }
        callback(null, data);
      });
    }
  ],
    function (err, results) {
      res.setHeader('Content-Type', 'application/json');
      res.json({ code: "0", result: "成功", message: "", "data": results });
    });
});


/* Query file information */
router.get('/filesinformation', function (req, res, next) {
  var idArr = req.query.filesId;
  function findfilesinformation() {
    var arr = [];
    for (var i in idArr) {
      arr[i] = function (i) {
        return function (callback) {
          var reg2 = /([^/]+)$/;
          var hashid = idArr[i].match(reg2)[1].replace(/\..*/,'');
          imgInfo.findOne({ id: hashid }, { buffer: 0 }, function (err, docs) {
            if (docs && docs.mimetype) {
              if (docs.mimetype.split('/')[0] == 'image') {
                  var fileUrl = config.host.outprefix + '/file/thumbnail/' + docs.id + '.' + docs.mimetype.split('/')[1]
              }
              else if(docs.mimetype.split('/')[0] == 'audio'){
                  var fileUrl = config.host.outprefix + '/file/original/' + docs.id + '.' + docs.mimetype.split('/')[1]
              }else{
                  var fileUrl = config.host.outprefix + '/file/original/' + docs.id + '.' + docs.mimetype.split('/')[1]
              };
              data = {
                'id': docs.id,
                'mimetype': docs.mimetype,
                'time': docs.time,
                'size': docs.size,
                'newName': docs.newName,
                'source': docs.source,
                'fileUrl': fileUrl
              };
              callback(null, data);
            } else {
              callback(null, null);
            }
          });
        }
      }(i)
    }
    return arr;
  }
  var filesprocess = findfilesinformation();

  async.parallel(filesprocess, function (err, results) {
    res.json({ code: "0", result: "success", message: "", "data": results });
  })
});

//获取文件数量,分页页数
router.get('/fileArr', function (req, res, next) {
  var mimeType = req.query.mimeType;
  var pageSize = req.query.pageSize || 10;
  if (mimeType == 'all' || mimeType == undefined) { var minetype = { $or: [{ 'mimetype': /^image/ }, { 'mimetype': /^audio/ }, { 'mimetype': /^video/ }] } }
  if (mimeType == 'photo') { var minetype = { 'mimetype': /^image/ } }
  if (mimeType == 'audio') { var minetype = { 'mimetype': /^audio/ } }
  if (mimeType == 'video') { var minetype = { 'mimetype': /^video/ } }
  imgInfo.find(minetype).exec((err, docs) => {
    var pagination = Math.ceil(docs.length / pageSize);
    var data = { total: docs.length, pagination: pagination };
    res.setHeader('Content-Type', 'application/json');
   // console.log(data)
    res.json({ code: "0", result: "成功", message: "", "data": data });
  });
});

//取源文件
router.get('/original/:id', function (req, res, next) {
  var id = req.params.id.replace(/\..*/,'');
  imgInfo.findOne({ 'id': id }, function (err, docs) {
    if (docs && docs.mimetype) {
      res.setHeader('Content-Length', docs.size);
      res.setHeader('Content-Type', docs.mimetype);
      res.write(docs.buffer);
      res.end();
    } else {
      res.status(404);
      res.write("404");
      res.end();
    }
  });
});

//取说略图
router.get('/thumbnail/:id', function (req, res, next) {
  var id = req.params.id.replace(/\..*/,'');
  imgInfo.findOne({ 'id': id }, function (err, docs) {
    if (docs && docs.mimetype) {
        if (docs.mimetype.indexOf("image") >= 0) {
            if(docs.mimetype.indexOf("gif") != -1 )  // true
            {
              res.setHeader('Content-Type', docs.mimetype)
              res.write(docs.buffer);
              res.end();
            } else {
              gm(docs.buffer)
              .resize(600, 600)
              .toBuffer('PNG',function (err, buffer) {
                  res.setHeader('Content-Type', docs.mimetype)
                  res.write(buffer);
                  res.end();
                // console.log(buffer);
              })
            }
        };
        if(docs.mimetype.indexOf("video") >= 0) {
          res.setHeader('Content-Type', docs.mimetype)
          res.write(docs.buffer);
          res.end();
        };

    } else {
      res.write('No data!'); 
      res.end();
    }
  });
});

//删除文件
router.post('/del', function (req, res, next) {
  imgInfo.remove({ 'id': req.body.id }, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (req.body.mimetype == 'audio/mp3') {
        //__dirname
        fs.unlink('public/media' + req.body.fileurl.split('media')[1], function (err) {                    //删除音频临时文件
          if (err) return console.log(err);
        });
      } else { }
      res.setHeader('Content-Type', 'application/json');
      res.send({ code: "0", result: "成功", message: "" });
    }
  });
});

//命名文件
router.post('/rename', function (req, res, next) {
  var name = req.body.params;
  var id = req.body.id;
  var result, code;
  if (name) {
    result = '更改失败';
    code = 1;
  };
  imgInfo.update({ 'id': id }, { 'newName': name }, function (err, docs) {
    if (err) {
      result = '更改失败';
      code = 1;
    } else {
      result = '更改成功';
      code = 0;
    };
    res.setHeader('Content-Type', 'application/json');
    res.send({ code: code, result: result, message: "" })
  });

});

module.exports = router;