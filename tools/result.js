/**
 * Created by yujintang on 16/7/29.
 */

const _ = require('lodash');


var enums = {
    ERROR: 'ERROR', //操作失败
    OK: 'OK' //操作成功
};

var Result = function (ret, msg, err, content) {
    let base = {
        ret: undefined,
        msg: msg,
        err: err,
        content: content
    };
    
    (ret && Result[ret]) && (base.ret = Result[ret]);

    return base;
};

_.merge(Result, enums);

module.exports = Result;