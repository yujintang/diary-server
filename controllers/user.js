/**
 * Created by yujintang on 16/7/27.
 */
'use strict';

var User = require('../model').user,
    logger = require('../config/log4js-config'),
    Result = require('../tools/result');

/***************************** 命名规则 **********************************************
 *
 * 查询或者修改某个数据库,类似于 : User表:  setU:修改 getU:获取  createU:创建
 * 返回内容,一般new一个 Result
 *
 * **********************************************************************************
 */

/**
 * 注册用户
 */
exports.register = function *() {

    let {account, password} = this.request.body;
    if (!account || !password) {
        return this.body = new Result(Result.ERROR, '缺少参数');
    }

    let regExpPwd = /^[\s\S]{6,20}$/;
    let regExpAccount = /\w{6,12}$/;
    let name = '7D' + account;
    if(!regExpAccount.test(account)) {
        return this.body = new Result(Result.ERROR, '账号不能使用特殊字符, 长度在6-12之间')
    }
    if(!regExpPwd.test(password)){
        return this.body = new Result(Result.ERROR, '密码长度必须大于6');
    }
    let getU = yield User.findOne({account: account});
    if (getU) {
        return this.body = new Result(Result.ERROR, '该ID已经被注册');
    }

    let createU = yield User.create({account: account, password: password, name: name});

    //将用户信息保存到session
    this.session.user = {
        _id:createU._id,
        account: createU.account
    }
    return this.body = new Result(Result.OK, '用户创建成功', undefined, createU);
};

/**
 * 登陆
 * @returns {*}
 */
exports.login = function *() {

    let {account, password} = this.request.body;
    if (!account || !password) {
        return this.body = new Result(Result.ERROR, '缺少参数');
    }

    let whereAccount = {account: account, password: password};
    let whereEmail = {email: account, password: password};
    let getU = yield User.findOne({$or: [whereAccount, whereEmail]});

    if (getU) {

        if (getU.status !== 1) {
            return this.body = new Result(Result.ERROR, '账户状态异常');
        }

        //将用户信息保存到session
        this.session.user = {
            _id:getU._id,
            account: getU.account
        }
        return this.body = new Result(Result.OK, '登陆成功', undefined, getU);
    }
    return this.body = new Result(Result.ERROR, '用户名或密码错误');
};


/**
 * 个人信息
 */
exports.userInfo = function *() {

    let {_id} =this.session.user;

    let getU = yield User.find({_id: _id}).exec();
    return this.body = new Result(Result.OK, '个人信息返回成功', undefined, getU)
};

/**
 * 退出登陆
 * @returns {Result}
 */
exports.logout = function *() {

    this.session = null;
    return this.body = new Result(Result.OK, '用户已退出登陆');
};

/**
 * 修改密码
 * @returns {Result}
 */
exports.modifyPassword = function *() {

    let {oldPassword, newPassword} = this.request.body;
    let {_id} = this.session.user;

    let regExp =  /^[\s\S]{6,20}$/;
    if(!regExp.test(newPassword)){
        return this.body = new Result(Result.ERROR, '密码长度必须大于6');
    }

    let getU = yield User.findOne({_id: _id}, {password: 1});

    if(oldPassword !== getU.password) {
        return this.body = new Result(Result.ERROR, '原密码错误');
    }
    yield User.update({_id: _id}, {$set: {password: newPassword}});

    this.session = null;
    return this.body = new Result(Result.OK, '密码已修改成功,请重新登陆');

};

/**
 * 绑定邮箱
 */
exports.modifyEmail = function *() {

    let {newEmail} = this.request.body;
    let regExp = /^([\w-_]+(?:\.[\w-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,6})$/;

    if(!regExp.test(newEmail)) {
        return this.body = new Result(Result.ERROR, '请输入正确的邮箱');
    }
}