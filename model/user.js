/**
 * Created by yujintang on 16/7/27.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    account: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        default: ""
    },
    vip: {
        type: Number,
        default: 0 //vip等级
    },
    status: {
        type: Number,
        default: 1 //1:正常 0:关闭 -1:存在异常
    }

}, {
    versionKey: false //控制 __v 的输出
});

UserSchema.index({
    account: 1
});

module.exports = mongoose.model('User', UserSchema);