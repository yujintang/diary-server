/**
 * Created by yujintang on 16/7/27.
 */

'use strict';

var port;

switch (process.env.NODE_ENV) {
    case 'dev':
        port = 3000;
        break;
    case 'online':
        port = 3000;
        break;
    default:
        port = 3000;
        break;
}

module.exports = {

    //签名cookie密钥
    appkey: 'first koa server',
    //端口号
    port: port,

    //mongoose
    mongoose: {
        HOST: 'localhost',
        PORT: 27017,
        DATABASE: 'yjt'
    },

    //各种文件路径
    path: {
        log_path: 'logs' //日志路径
    },

    //发送邮件配置
    mailconfig: {
        host: 'smtp.mxhichina.com',
        port: 465,
        secureConnection: true, // 使用 SSL
        auth: {
            user: 'vip@7diary.com',
            pass: 'fW123456'
        }
    }
};