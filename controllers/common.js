/**
 * Created by yujintang on 16/7/30.
 */
'use strict';
const Result = require('../tools/result'),
    config = require('../config/config');
/**
 * 检查是否登陆
 * @param next
 * @returns {Result}
 */
exports.checkSession = function *(next) {

    let session = this.session;
    if (!session.user) {
        //return this.status = 401;
        return this.body = new Result(Result.ERROR, '请登陆后操作');
    } else {
        yield next;
    }
};

