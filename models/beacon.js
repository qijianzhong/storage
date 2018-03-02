var mongoose = require('mongoose');
var conn1 = require('../bin/mongodb.js').conn1;

var BeaconSchema = new mongoose.Schema({
    id: String,                 //系统id
    beaconid: String,           //标签id
    model: {
		default: 1,
		type: Number
	},
    status: String,
    stability: String,
    latlng: {
        type:Array,
        default:[]
    },
    floor: {           //所属楼层
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Floor'
    },
    point:{
        type:Array,
        default:[]
    },
    description:String,
    source:String,          //保存者
    timestamp: {
        tyle:Number,        //最后修改时间戳
    },
    attachment: {           //所属楼层
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BeaconAssociatedAttachment'
    }
});

// var Beacon = mongoose.model('Beacon', BeaconSchema, 'tagRegionLocation');
var Beacon = conn1.model('Beacon', BeaconSchema, 'beacon');

module.exports = Beacon;