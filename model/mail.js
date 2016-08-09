/**
 * Created by yujintang on 16/8/2.
 */
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mailSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    used: {
        type: Boolean,
        default: false
    },
    mailId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Mail', mailSchema);