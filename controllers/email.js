/**
 * Created by yujintang on 16/8/2.
 */

'use strict';
const Result = require('../tools/result'),
    config = require('../config/config'),
    nodemailer = require('nodemailer'),
    User = require('../model').user,
    Mail = require('../model').mail;

/**
 * 系统发送验证邮件
 * @returns {Result}
 */
exports.sendEmail = function *() {

    /* flag为发送邮件的类型 */
    let {email, flag} = this.request.body;
    if (!email || !flag) {
        return this.body = new Result(Result.ERROR, '缺少参数');
    }
    let regExp = /^([\w-_]+(?:\.[\w-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,6})$/;
    if(!regExp.test(email)) {
        return this.body = new Result(Result.ERROR, '请输入正确的邮箱');
    }
    let findU = yield User.findOne({email: email}, {_id: 1});
    if(!findU) {
        return this.body = new Result(Result.ERROR, '该邮箱没有绑定用户');
    }

    let mailOptions = void 0;
    /* 1.绑定新邮箱模版 */
    var mailOptions1 = {
        from: config.mailconfig.auth.user,
        to: email,
        subject: '[七日记]绑定邮箱',
        //text和html两者只支持一种
        text: `您好,感谢您绑定日日记,如果是本人操作,请点击下面链接绑定,www.xxxx.com`
        //html: '<b>Hello world ?</b>' // html 内容
    };
    /* 2.找回密码模版 */
    var mailOptions2 = {
        from: config.mailconfig.auth.user,
        to: email,
        subject: '[七日记]找回密码',
        //text和html两者只支持一种
        text: `您好,感谢您使用日日记,如果是本人操作,请点击下面链接找回密码www.xxxx.com`
        //html: '<b>Hello world ?</b>' // html 内容
    };
    /* 3.验证邮箱模版 */
    var mailOptions3 = {
        from: config.mailconfig.auth.user,
        to: email,
        subject: '[七日记]验证邮箱',
        //text和html两者只支持一种
        text: `您好,感谢您使用日日记,如果是本人操作,请点击下面链接验证邮箱,www.xxxx.com`
        //html: '<b>Hello world ?</b>' // html 内容
    };

    switch (flag) {
        case 1: mailOptions = mailOptions1;
            break;
        case 2: mailOptions = mailOptions2;
            break;
        case 3: mailOptions = mailOptions3;
            break;
        default: mailOptions = mailOptions1;
            break;
    }

    let transporter = nodemailer.createTransport(config.mailconfig);
    yield transporter.sendMail(mailOptions);
    return this.body = new Result(Result.OK, '发送邮件成功');
};

/**
 * 邮件修改密码
 * @returns {Result}
 */
exports.resetPwd = function *() {
    let {newPassword, mailId, type} = this.request.body;
    if (!newPassword || !mailId || !type) {
        return this.body = new Result(Result.ERROR, '缺少参数');
    }
    let regExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/;
    if(!regExp.test(newPassword)){
        return this.body = new Result(Result.ERROR, '密码的强度必须是包含大小写字母和数字的组合，不能使用特殊字符，长度在8-10之间。');
    }

    let timestamp = Date.parse(new Date());
    let findM = Mail.findOne({mailId:mailId});
    let _idTime = Date.parse(findM[_id].getTimestamp()) + 24 * 60 * 60;
    if(timestamp < _idTime) {
        return this.body = new Result(Result.ERROR, '链接已经超时');
    }
    if(type !== findM.type) {
        return this.body = new Result(Result.ERROR, '不可进行的操作');
    }

    yield User.update({_id: findM.userId}, {$set: {password: newPassword}});

    return this.body = new Result(Result.OK, '密码修改成功');
    
};
