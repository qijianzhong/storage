/**
 * beacon 关联附件
 * 
 */
var mongoose = require('mongoose');
var conn1 = require('../bin/mongodb.js').conn1;

var BeaconAssociatedAttachmentSchema = new mongoose.Schema({
    id: String,              //附件id
    name:String,
    attachments: [{           //关联附件
        type: mongoose.Schema.Types.ObjectId ,
        ref: 'Attachment'
    }],
    timestamp: {
        tyle:Number,        //最后修改时间戳
    }
});

var BeaconAssociatedAttachment = conn1.model('BeaconAssociatedAttachment', BeaconAssociatedAttachmentSchema, 'beacon_associated_attachment');

module.exports = BeaconAssociatedAttachment;