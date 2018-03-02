var express = require('express');
var async = require('async');
var router = express.Router();

var Beacon = require('../models/beacon');
var BeaconAssociatedAttachment = require('../models/beacon_associated_attachments');
var Attachment = require('../models/attachment');
var Version = require('../config/version.js');

var config = require('../config/config.js');                //Call the configuration file

/** 移动端H5页面适配API */

//查找单个指定Beacon信息,返回web
router.get('/find/single/webshow', function (req, res, next) {
    var beaconid = req.query.beaconid;
    var language = req.query.language;
    Beacon.findOne({ beaconid: beaconid }).populate({ path: 'attachment', populate: { path: 'attachments', select: { _id: 0, _v: 0 } }, select: { _id: 0, _v: 0 } }).exec(function (err, docs) {
        if (err) { console.log(err) }
        if (docs) {
            var contents = docs._doc.attachment._doc.attachments;
            var content = null,imgurl = new Array;
            var isSame = false;
            for (var j in contents) {
                if (contents[j].lang == language) {
                    content = contents[j];
                    isSame = true;
                    break;
                }
            }
            for (var k in contents) {
                if (contents[k].image) {
                    imgurl = contents[k].image.split(",");
                    break;
                }
            }
            if (isSame) {
                // console.log("data:",data);
                var title = null;
                content.title ? title = content.title : title="404页面丢失";
                var imgbanner = new Array;
                imgurl.length > 0 ? imgbanner = imgurl : imgbanner = ["../images/webshow/404.jpg"];
                for(var l = 0; l < imgbanner.length ; l++){
                    imgbanner[l] = config.host.outprefix +  imgbanner[l].replace(/\/thumbnail\//,"/original/");
                }
                var audiourl = null;
                content.audio ? audiourl = config.host.outprefix + content.audio : audiourl = "../images/webshow/test.mp3";
                var contenttext = null;
                content.text ? contenttext = content.text : contenttext = "";
                console.log("content:",imgbanner);
                res.render("beacon/webshow", { title: title, imgbanner: imgbanner, audiourl: audiourl, contenttext: contenttext });
            } else {
                var dic = { code: 209030, error: "不存在该语种" }
                res.json(dic);
            }

        } else {
            var dic = { code: 209031, error: "没有对应的Beacon信息" }
            res.json(dic);
        }
    });
});


/** APP的API */

//查找单个指定Beacon信息,返回web
router.get('/find/single/appshow', function (req, res, next) {
    var beaconid = req.query.beaconid;
    var language = req.query.language;
    Beacon.findOne({ beaconid: beaconid }).populate({ path: 'attachment', populate: { path: 'attachments', select: { _id: 0, _v: 0 } }, select: { _id: 0, _v: 0 } }).exec(function (err, docs) {
        if (err) { console.log(err) }
        if (docs) {
            var contents = docs._doc.attachment._doc.attachments;
            var content = null,imgurl = new Array;
            var isSame = false;
            for (var j in contents) {
                if (contents[j].lang == language) {
                    content = contents[j];
                    isSame = true;
                    break;
                }
            }
            for (var k in contents) {
                if (contents[k].image || contents[k].image == '') {
                    imgurl = contents[k].image.split(",");
                    break;
                }
            }
            if (isSame) {
                var title = null;
                content.title ? title = content.title : null;
                var imgbanner = new Array;
                imgurl.length > 0 ? imgbanner = imgurl : imgbanner = ["../images/webshow/404.jpg"];
                for(var l = 0; l < imgbanner.length ; l++){
                    imgbanner[l] = config.host.outprefix +  imgbanner[l].replace(/\/thumbnail\//,"/original/");
                }
                var audiourl = null;
                content.audio ? audiourl = config.host.outprefix + content.audio : audiourl = "../images/webshow/test.mp3";
                var contenttext = null;
                content.text ? contenttext = content.text : contenttext = "";
                console.log("content:",imgurl);
                res.render("beacon/appshow", { title: title, imgbanner: imgbanner, audiourl: audiourl, contenttext: contenttext });
            } else {
                var dic = { code: 209031, error: "不存在该语种" }
                res.json(dic);
            }

        } else {
            var dic = { code: 209031, error: "没有对应的Beacon信息" }
            res.json(dic);
        }
    });
});


//查找多个指定Beacon的信息
router.post('/beacons', function (req, res, next) {
    var list = req.body.beaconids;
    if (!list) {
        return res.json({ code: 209030, error: "Beaconids can not empty" });
    }
    if (!Object.prototype.toString.call(list) === '[object Array]') {
        return res.json({ code: 209031, error: "Data format error" });
    }
    var beaconids = new Array();
    list.forEach(function (item, index) {
        beaconids.push(item.beaconid);
    })
    
    Beacon.find({ beaconid: { $in: beaconids } },{ _id: 0, __v: 0 }).populate({ path: 'attachment', populate: { path: 'attachments', select: { _id: 0, __v: 0 } }, select: { _id: 0, __v: 0 } }).exec(function (err, docs) {
        if (err) console.log("err: " + err);
        if (docs) {
            for (var i = 0; i < docs.length; i++) {

                for (var m = 0; m < list.length; m++) {
                    if (list[m].beaconid == docs[i]._doc.beaconid) {
                        docs[i]._doc.distance = list[m].distance;
                        break;
                    }
                }

                var obj = docs[i]._doc.attachment._doc.attachments;

                var tempimg = [];
                for (var k = 0; k < obj.length; k++) {
                    if(obj[k].audio && obj[k].audio != ""){
                        obj[k].audio = config.host.outprefix + obj[k].audio
                    }
                    if (obj[k].image || obj[k].image == '') {
                        console.log("img:"+[k],obj[k].image);
                        tempimg = obj[k].image.split(",");
                        for(var g = 0; g < tempimg.length ; g++){
                            tempimg[g] = config.host.outprefix +   tempimg[g]
                        }
                        obj.splice(k, 1);
                        break;
                    }
                }
                delete docs[i]._doc.attachment;
                docs[i]._doc.attachments = {image:tempimg,content:obj};
                docs[i]._doc.model ? null : docs[i]._doc.model = 1;
            }
            res.json({ code: 200, message: "成功", data: docs });
        } else {
            res.json({ code: 209032, error: "can not find any beacon" });
        }
    });
})


/**版本更新 */
//安卓
router.post('/android/version', function (req, res, next) {
    var data = { versionName: Version.androidVersion, versionCode: Version.androidCode, url: Version.androidUrl }
    var dic = { code: 200, message: "成功", data: data }
    res.json(dic);
})

//苹果
router.post('/iOS/version', function (req, res, next) {
    var data = { version: Version.iOSVersion, build: Version.iOSBuild, url: Version.iOSUrl }
    var dic = { code: 200, message: "成功", data: data }
    res.json(dic);
})

//App Store苹果
router.post('/iOS/AppStore/version', function (req, res, next) {
    var data = { version: Version.AppVersion, build: Version.AppBuild, url: Version.AppUrl }
    var dic = { code: 200, message: "成功", data: data }
    res.json(dic);
})


module.exports = router;