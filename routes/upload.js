var express = require('express');
var router = express.Router();
var multer = require('multer');
var crypto = require('crypto');
var fs = require('fs');
var async = require('async');
var imgInfo = require('../models/imgInfo.js');
var config = require('../config/config.js');                //Call the configuration file
//加载图片数据模型
var multer = require('multer');
var images = require("images");
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
var ffmpeg = require('ffmpeg');

//多个上传
router.post('/upload', upload.array('files'), function (req, res, next) {
    function imgsanalyseobj() {
        var arr = {};
        for (var i = 0; i < req.files.length; i++) {
            arr['find' + i] = function (i) {
                return function (callback) {
                    var buffer = req.files[i].buffer;
                    var hashvalue = crypto.createHash('md5').update(buffer).digest('hex');
                    imgInfo.find({ id: hashvalue }, function (err, docs) { callback(null, docs) });
                    fs.writeFile('temporary', buffer, function (err) {
                        if (err) {
                            console.error(err);
                        } else {
                        }
                    });
                }
            }(i);

            arr['process' + i] = function (i) {
                return ['find' + i, function (arg, callback) {
                    var findfile = arg['find' + i];
                    var id = crypto.createHash('md5').update(req.files[i].buffer).digest('hex');
                    if (req.files[i].mimetype.substring(0, 5) == 'image') {
                        var fileUrl = '/file/thumbnail/' + id + '.' + req.files[i].mimetype.split('/')[1]
                    }
                    else if(req.files[i].mimetype.split('/')[0] == 'audio'){
                        var fileUrl = '/file/original/' + id + '.' + req.files[i].mimetype.split('/')[1]
                    }else{
                        var fileUrl = '/file/original/' + id + '.' + req.files[i].mimetype.split('/')[1]
                    };

                    if (findfile.length > 0) {
                        var orgdoc = findfile[0]._doc;
                        var hh = {
                            newName: orgdoc.newName,
                            mimetype: orgdoc.mimetype,
                            size: orgdoc.size,
                            id: orgdoc.id,
                            repetition: true,
                            fileUrl: fileUrl
                        };
                        resdataArr.push(hh);
                        callback(null, hh);
                    } else {
                        var file = req.files[i];
                        var buffer = file.buffer;
                        var mimetype = file.mimetype;
                        var size = file.size;
                        var originalname = file.originalname;
                        var duration = null;
                        var extName = originalname.substr(originalname.lastIndexOf('.'));                        

                        // 创建时间戳
                        var stamp = parseInt(new Date().getTime()/1000);                        
        
                        var results = { name: originalname, mimetype: mimetype, size: size, id: id }
                        if (req.session.user) {
                            var owner = req.session.user.username                          //上传来源赋值
                        }
                        else {
                            var owner = "unknow"
                        };

                        if (mimetype.indexOf("video") >= 0 || mimetype.indexOf("audio") >= 0)     //获取音频时长
                        {
                            var process = new ffmpeg('./temporary');
                            process.then(function (data) {
                                saveData(data.metadata.duration.raw);
                                fs.unlink('./temporary', function (err) {                    //删除音频临时文件
                                    if (err) return console.log(err);
                                });
                            }, function (err) {
                                return false
                            });
                        } else {
                            saveData();
                        };

                        function saveData(dur) {
                            var duration = dur || null;
                            ImgInfo = new imgInfo({
                                buffer: buffer,
                                mimetype: mimetype,
                                id: id,
                                size: size,
                                newName: originalname,
                                owner: owner,
                                duration: duration,
                                created: stamp,
                                updated:stamp,
                                extName:extName
                            });
                            ImgInfo.save(function () {
                                var hh = {
                                    newName: originalname,
                                    mimetype: mimetype,
                                    size: size,
                                    id: id,
                                    repetition: false,
                                    fileUrl: fileUrl
                                };
                                resdataArr.push(hh);
                                callback(null, findfile);
                            });
                        }

                    }
                }]
            }(i)
        }
        return arr;
    }

    var resdataArr = [];
    var performobj = imgsanalyseobj();
    async.auto(performobj, function (err, results) {
        var resdata = {
            code: "0",
            result: "success",
            message: "",
            files: resdataArr
        };
        res.json(resdata);
    });
});



module.exports = router;



