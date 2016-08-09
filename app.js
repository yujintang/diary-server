/**
 * Created by yujintang on 16/7/27.
 */

'use strict';
var start_time = Date.now();
const koa = require('koa'),
    app = koa(),
    session = require('koa-generic-session'),
    MongoStore = require('koa-generic-session-mongo'),
    bodyParser = require('koa-bodyparser'),
    json = require('koa-json'),
    KoaLogger = require('koa-logger'),
    log4js = require('log4js'),
    router = require('koa-router')(),
    errorhandler = require('koa-errorhandler');


let config = require('./config/config'),
    users = require('./routers/users'),
    index = require('./routers/index'),
    logger = require('./config/log4js-config');


//处理中间件

app.use(errorhandler());
app.use(json());
app.use(bodyParser());
app.use(KoaLogger());
app.keys = [config.appkey];
app.use(session({
    store: new MongoStore({
        url: `mongodb://${config.mongoose.HOST}:${config.mongoose.PORT}/${config.mongoose.DATABASE}`
    }),
    cookie: {
        maxage: 30 * 24 * 60 * 60 * 1000
    }
}));

router.use('/', index.routes(), index.allowedMethods());
router.use('/users', users.routes(), users.allowedMethods());

app.use(router.routes());

app.listen(config.port);
logger.system.info(((ms) => `Server startup in ${ms} ms, port: ${config.port}`)(Date.now() - start_time))


//服务器错误处理
app.on('error', (err, ctx) => {
    logger.system.error('server error', err, ctx);
    //process.exit(1);
});
process.on('uncaughtException', (e) => {
    logger.system.error('unhandledRejection from process', e);
});
process.on('unhandledRejection', (e) => {
    logger.system.warn('rejectionHandled from process', e);
});
process.on('rejectionHandled', (e) => {
    loggers.system.warn('rejectionHandled from process', e);
});

module.exports = app;