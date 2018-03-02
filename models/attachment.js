/**
 * beacon 关联附件
 * 
 */
var mongoose = require('mongoose');
var conn1 = require('../bin/mongodb.js').conn1;

var AttachmentSchema = new mongoose.Schema({
    id: String,             //附件id
    lang: String,
    title: {
        type: String,
        default: ''
    },
    audio: {
        type: String,
        default: ''
    },
    text: {
        type: String,
        default: ''
    },
    image: String,
});

var Attachment = conn1.model('Attachment', AttachmentSchema, 'attachment');

module.exports = Attachment;