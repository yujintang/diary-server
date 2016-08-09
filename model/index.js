/**
 * Created by yujintang on 16/7/27.
 */
'use strict';

var mongoose = require('mongoose'),
    configM = require('../config/config').mongoose,
    logger = require('../config/log4js-config');


var dbURI = `mongodb://${configM.HOST}:${configM.PORT}/${configM.DATABASE}`;
/**
 * 连接数据库
 * @type {Promise}
 */
mongoose.Promise = global.Promise;
mongoose.connect(dbURI);

/**
 * 连接错误监控
 */
mongoose.connection.on('connected', function () {
    logger.system.info('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function (err) {
    logger.system.error('Mongoose connection error: ' + err);
    process.exit(1);
});

exports.user = require('./user');
exports.mail = require('./mail');