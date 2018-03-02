var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var async = require('async');
var cuid = require('cuid');
var request = require('request');
var fs = require('fs');

var tool = require('../lib/util/tool.js');
var obj = require('../lib/util/obj.js');
var cbAPI = require('../lib/net/cbDeal.js');
var CODE = require('../lib/error/code.js');
var MSG = require('../lib/error/msg.js');

var sysApi = require('../lib/util/sysApi.js');

var Beacon = require('../models/beacon');
var BeaconAssociatedAttachment = require('../models/beacon_associated_attachments');
var Attachment = require('../models/attachment');

var config = require('../config/config.js');                //调用配置文件

/* 资产beacon输入 typeahead */
router.get("/typeahead", function (req, res) {
	if (req.query.beaconType == 'asset') {
		tagRegionLocation.aggregate()
			.match({})
			.group({
				_id: '$tid',
				location: {
					$last: { floor: '$floor', position: '$position', at: '$at' }
				}
			})
			.project({
				_id: 0,
				tag_id: '$_id',
			})
			.exec(function (err, beaconidlist) {
				if (err) {
					console.log('err:', err);
					return;
				}
				var ids = new Array;
				beaconidlist.forEach(function (item, index) {
					item.tag_id ? ids.push(item.tag_id) : null;
				})
				// console.log("beaconid 总计:",ids.length);
				res.json(ids);
			});
	}
	if (req.query.beaconType == 'tour') {
		Beacon.aggregate()
			.match({})
			.exec(function (err, beaconidlist) {
				if (err) {
					console.log('err:', err);
					return;
				}
				var ids = new Array;
				beaconidlist.forEach(function (item, index) {
					item.beaconid ? ids.push(item.beaconid) : null;
				})
				// console.log("beaconid 总计:",ids.length);
				res.json(ids);
			});
	}
});

/**
 * GET tour_beacon page.
 */
router.get('/tour', function (req, res, next) {
	// if (!(req.session.user && req.session.user.permissions && req.session.user.permissions.storage)) {
	// 	return res.redirect(config.host.account + "/user/login?s=storage");				              //未登录则重定向到 /login 路径
	// }
	res.render('beacon/tour');
});

/* 导览信标beacon table */
router.get("/list", function (req, res) {
	var floor_id = req.query.floor_id;
	var beaconid = req.query.beaconid;
	var pageIndex = tool.toNumber(req.query.pageIndex) || 1; //×ª»»³ÉÊý×ÖÐÍ
	var pageSize = tool.toNumber(req.query.pageSize) || 100;
	var sortName = req.query.sortName;                         //ÅÅÐò×Ö¶Î
	var sortOrder = req.query.sortOrder;

	var query = {};
	if (floor_id) {
		query.floor = ObjectId(floor_id)
	}
	if (beaconid) {
		query.beaconid = beaconid
	}

	req.session.user ? query.source = req.session.user.username : query.source = "unknown";
	if (req.session.user && req.session.user.permissions && req.session.user.permissions.storage && req.session.user.permissions.storage.indexOf("beacons") >= 0 ) {
		delete query.source
	}
	console.log("source:",query.source);

	async.auto({
		beaconlist: function (callback) {
			Beacon.find(query)
				.skip((pageIndex - 1) * pageSize)
				.limit(pageSize)
				.sort({ [sortName]: sortOrder })
				.exec(callback);
		},
		beaconcount: function (callback) {
			Beacon.count(query).exec(callback);
		}
	},
		function (err, beacons) {
			if (err) {
				console.log('err:', err);
			}
			var beacondata = { total: 0, rows: [] };
            if(beacons.beaconcount > 0){
				beacondata = { total: beacons.beaconcount, rows: beacons.beaconlist };
			}
			console.log('beacon共有:' + beacons.beaconcount + '条数据;详情:' + beacons.beaconlist);
			res.json(beacondata);
		});
});

router.get("/getattachmentinfo", function (req, res) {
	var beaconid = req.query.beaconid;
	var query = { id: beaconid }
	var populate = {
		path: 'attachment',
		select: { _id: 0, __v: 0 },
		populate: {
			path: 'attachments',
			select: { __v: 0 },
		}
	};
	Beacon.findOne(query).populate(populate).exec(function (err, doc) {
		var beaconinfo = doc;
		res.json(beaconinfo);
	});
});


/* POST 新增tourbeacon */
router.post('/add', function (req, res, next) {
	// console.log("tour:",JSON.stringify(req.body));
	async.auto({
		chinese: function (callback) {
			var doc = {
				id: cuid(),
				lang: 'zh-CN',   //zh 中文
				title: req.body.chinese_title,
				audio: req.body.chinese_audiourl,
				text: req.body.chinese_contentText
			};
			Attachment.create(doc, function (error, docs) {  // 增加记录 基于model操作
				if (error) {
					console.log(error);
				}
				// console.log("chinese",docs);
				callback(null, docs._id);
			});
		},
		english: function (callback) {
			var doc = {
				id: cuid(),
				lang: 'en-US',   //en 英文
				title: req.body.english_title,
				audio: req.body.english_audiourl,
				text: req.body.english_contentText
			};
			Attachment.create(doc, function (error, docs) {  // 增加记录 基于model操作
				if (error) {
					console.log(error);
				}
				// console.log("english",docs);
				callback(null, docs._id);
			});
		},
		japanese: function (callback) {
			var doc = {
				id: cuid(),
				lang: 'ja-JP',   //ja 日文
				title: req.body.japanese_title,
				audio: req.body.japanese_audiourl,
				text: req.body.japanese_contentText
			};
			Attachment.create(doc, function (error, docs) {  // 增加记录 基于model操作
				if (error) {
					console.log(error);
				}
				// console.log("japanese",docs);
				callback(null, docs._id);
			});
		},
		portuguese: function (callback) {
			var doc = {
				id: cuid(),
				lang: 'pt-BR',   //pt 葡萄牙文
				title: req.body.portuguese_title,
				audio: req.body.portuguese_audiourl,
				text: req.body.portuguese_contentText
			};
			Attachment.create(doc, function (error, docs) {  // 增加记录 基于model操作
				if (error) {
					console.log(error);
				}
				// console.log("portuguese",docs);
				callback(null, docs._id);
			});
		},
		russian: function (callback) {
			var doc = {
				id: cuid(),
				lang: 'ru-RU',   //ru 俄文
				title: req.body.russian_title,
				audio: req.body.russian_audiourl,
				text: req.body.russian_contentText
			};
			Attachment.create(doc, function (error, docs) {  // 增加记录 基于model操作
				if (error) {
					console.log(error);
				}
				// console.log("russian",docs);
				callback(null, docs._id);
			});
		},
		france: function (callback) {
			var doc = {
				id: cuid(),
				lang: 'fr-FR',   //fr-FR 法文
				title: req.body.france_title,
				audio: req.body.france_audiourl,
				text: req.body.france_contentText
			};
			Attachment.create(doc, function (error, docs) {  // 增加记录 基于model操作
				if (error) {
					console.log(error);
				}
				// console.log("russian",docs);
				callback(null, docs._id);
			});
		},
		german: function (callback) {
			var doc = {
				id: cuid(),
				lang: 'de-DE',   //de-DE 德文
				title: req.body.german_title,
				audio: req.body.german_audiourl,
				text: req.body.german_contentText
			};
			Attachment.create(doc, function (error, docs) {  // 增加记录 基于model操作
				if (error) {
					console.log(error);
				}
				// console.log("russian",docs);
				callback(null, docs._id);
			});
		},
		images: function (callback) {
			var doc = {
				id: cuid(),
				image: req.body.attachment_imgurl ? req.body.attachment_imgurl.split(",") : []
			};
			Attachment.create(doc, function (error, docs) {  // 增加记录 基于model操作
				if (error) {
					console.log(error);
				}
				// console.log("images",docs);
				callback(null, docs._id);
			});
		},
		associated: ["chinese", "english", "japanese", "portuguese", "russian", "images", "france", "german", function (arg, callback) {
			// console.log('chinese:',JSON.stringify(arg.chinese));
			var arrdata = new Array;
			arrdata.push(arg.chinese, arg.english, arg.japanese, arg.portuguese, arg.russian, arg.france, arg.german, arg.images);
			// console.log('arrdata:', arrdata);
			var doc = {
				id: cuid(),
				name: req.body.attachment_title || new Date() + "attachment",
				attachments: arrdata,
				timestamp: new Date().getTime()
			};
			BeaconAssociatedAttachment.create(doc, function (error, docs) {  // 增加记录 基于model操作
				if (error) {
					console.log(error);
				}
				// console.log("images",docs);
				callback(null, docs._id);
			});
		}],
		beacon: ["associated", function (arg, callback) {
			console.log('associated:', arg.associated);
			var sorc = /^/;
			if (req.session.user) {
				sorc = req.session.user.username;                          //上传来源赋值
			} else {
				sorc = "unknow";
			}
			var doc = {
				id: cuid(),
				beaconid: req.body.beaconid,
				model: req.body.model,
				status: req.body.status,
				stability: req.body.stability,
				latlng: [req.body.longitude, req.body.latitude],
				floor: req.body.floor_id,
				point: [req.body.point_x, req.body.point_y],
				description: req.body.description,
				attachment: arg.associated,
				source: sorc,
				timestamp: new Date().getTime()
			};
			Beacon.create(doc, function (error, docs) {  // 增加记录 基于model操作
				if (error) {
					console.log(error);
				}
				console.log("beacon", docs);
				callback(null, docs);
			});
		}]
	},
	function (err, docs) {
		if (err) {
			console.log('err:', err);
		}
		res.json(docs);
	});
});

/* POST 验证设备是否存在 */
router.post('/validate', function (req, res, next) {
	Beacon.findOne({ beaconid: eval("/^" + req.body.beaconid.replace(/:/g, '') + "$/i") }).exec(function (err, docs) {
		console.log("查询结果：", tool.hasValue(docs));
		if (err) {
			console.log(err);
			return;
		}
		if (req.body.type == "add") {
			tool.hasValue(docs) ? res.json({ "valid": false }) : res.json({ "valid": true });
		}
		if (req.body.type == "edit") {
			if (tool.hasValue(docs)) {
				docs.id == req.body.beacon_id ? res.json({ "valid": true }) : res.json({ "valid": false });
			} else {
				res.json({ "valid": true });
			}
		}
	});
});

/* POST 修改tourbeacon信息 */
router.post('/update', function (req, res, next) {
	// console.log("tour-edit:", req.body);
	var conditions = { id: req.body.beaconid_id };
	var update = {
		$set:
			obj.trim({
				beaconid: req.body.beaconid,
				model: req.body.model,
				status: req.body.status,
				stability: req.body.stability,
				latlng: [req.body.longitude, req.body.latitude],
				floor: req.body.floor_id,
				point: [req.body.point_x, req.body.point_y],
				description: req.body.description,
				timestamp: new Date().getTime()
			})
	};
	var options = { upsert: false };
	Beacon.update(conditions, update, options, function (err, rel) {
		// console.log("修改结果：",rel)
		res.sendStatus(200);
	});

});

/**
 * GET beacon tour_attachment page.
 */
router.get('/attachment', function (req, res, next) {
	res.render('beacon/attachment', { beaconid: req.query.beaconid });
});

/**
 * GET beacon tour_imgslibrary page.
 */
router.get('/imgslibrary', function (req, res, next) {
	res.render('beacon/imgslibrary', { beaconid: req.query.beaconid });
});

/**
 * GET beacon tour_imgslibrary page.
 */
router.get('/audioslibrary', function (req, res, next) {
	res.render('beacon/audioslibrary', { beaconid: req.query.beaconid });
});

/* POST 更新tourbeacon Attachment */
router.post('/attachment/update', function (req, res, next) {
	async.parallel([
		function (callback) {
			var conditions = { _id: req.body.chinese_id };
			var update = {
				$set:
					{
						title: req.body.chinese_title,
						audio: req.body.chinese_audiourl,
						text: req.body.chinese_contentText
					}
			};
			var options = { upsert: false };  //对于upsert(默认为false)：如果upsert=true，如果query找到了符合条件的行，则修改这些行，如果没有找到，则追加一行符合query和obj的行。如果upsert为false，找不到时，不追加。
			//对于multi(默认为false): 如果multi=true，则修改所有符合条件的行，否则只修改第一条符合条件的行。
			Attachment.update(conditions, update, options, callback);
		},
		function (callback) {
			var conditions = { _id: req.body.english_id };
			var update = {
				$set:
					{
						title: req.body.english_title,
						audio: req.body.english_audiourl,
						text: req.body.english_contentText
					}
			};
			var options = { upsert: false };
			Attachment.update(conditions, update, options, callback);
		},
		function (callback) {
			var conditions = { _id: req.body.japanese_id };
			var update = {
				$set:
					{
						title: req.body.japanese_title,
						audio: req.body.japanese_audiourl,
						text: req.body.japanese_contentText
					}
			};
			var options = { upsert: false };
			Attachment.update(conditions, update, options, callback);
		},
		function (callback) {
			var conditions = { _id: req.body.portuguese_id };
			var update = {
				$set:
					{
						title: req.body.portuguese_title,
						audio: req.body.portuguese_audiourl,
						text: req.body.portuguese_contentText
					}
			};
			var options = { upsert: false };
			Attachment.update(conditions, update, options, callback);
		},
		function (callback) {
			var conditions = { _id: req.body.russian_id };
			var update = {
				$set:
					{
						title: req.body.russian_title,
						audio: req.body.russian_audiourl,
						text: req.body.russian_contentText
					}
			};
			var options = { upsert: false };
			Attachment.update(conditions, update, options, callback);
		},
		function (callback) {
			var conditions = { _id: req.body.france_id };
			var update = {
				$set:
					{
						title: req.body.france_title,
						audio: req.body.france_audiourl,
						text: req.body.france_contentText
					}
			};
			var options = { upsert: false };
			Attachment.update(conditions, update, options, callback);
		},
		function (callback) {
			var conditions = { _id: req.body.german_id };
			var update = {
				$set:
					{
						title: req.body.german_title,
						audio: req.body.german_audiourl,
						text: req.body.german_contentText
					}
			};
			var options = { upsert: false };
			Attachment.update(conditions, update, options, callback);
		},
		function (callback) {
			var conditions = { _id: req.body.attachment_id };
			var update = {
				$set:
					{
						image: req.body.attachment_imgurl.split(",")
					}
			};
			var options = { upsert: false };
			Attachment.update(conditions, update, options, callback);
		},
		function (callback) {
			var conditions = { id: req.body.beacon_id };
			var update = {
				$set:
					{
						timestamp: new Date().getTime()
					}
			};
			var options = { upsert: false };
			Beacon.update(conditions, update, options, callback);
		}], function (err, result) {
			var populate = {
				path: 'attachment',
				select: { _id: 0, __v: 0 },
				populate: {
					path: 'attachments',
					select: { __v: 0 },
				}
			};
			Beacon.findOne({ id: req.body.beacon_id }).populate(populate).exec(function (err, item) {
				var dic = { code: 200, message: "更新成功", result: item };
				console.log("附件更新结果：", item);
				res.json(dic);
			})
		});
});

/* POST 删除tourbeacon */
router.post('/del', function (req, res, next) {
	var beacon_id = req.body.id;
	var populate = {
		path: 'attachment',
		select: { __v: 0 },
	}
	Beacon.findOne({ id: beacon_id })
		.populate(populate)
		.exec(function (err, docs) {
			console.log('result:' + docs);
			if (docs) {
				async.parallel([
					function (cb) {
						Beacon.remove({ _id: docs._id }, cb);
					},
					function (cb) {
						BeaconAssociatedAttachment.remove({ _id: docs.attachment._id }, cb);
					},
					function (cb) {
						Attachment.remove({ _id: docs.attachment.attachments[0] }, cb);
					},
					function (cb) {
						Attachment.remove({ _id: docs.attachment.attachments[1] }, cb);
					},
					function (cb) {
						Attachment.remove({ _id: docs.attachment.attachments[2] }, cb);
					},
					function (cb) {
						Attachment.remove({ _id: docs.attachment.attachments[3] }, cb);
					},
					function (cb) {
						Attachment.remove({ _id: docs.attachment.attachments[4] }, cb);
					},
					function (cb) {
						Attachment.remove({ _id: docs.attachment.attachments[5] }, cb);
					},
					function (cb) {
						Attachment.remove({ _id: docs.attachment.attachments[6] }, cb);
					},
					function (cb) {
						Attachment.remove({ _id: docs.attachment.attachments[7] }, cb);
					}
				], function (err, result) {
					if (err) {
						console.log(err);
						res.send('Error:' + err);
					} else {
						var dic = { code: 200, message: "成功" }
						res.json(dic);
					}
				});
			} else {
				var dic = { code: 201, message: "没有对应的Beacon信息" }
				res.json(dic);
			}
		})
});


module.exports = router;