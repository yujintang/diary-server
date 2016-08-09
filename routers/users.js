/**
 * Created by yujintang on 16/7/27.
 */
"use strict";

var router = require('koa-router')(),
    UserControllers = require('../controllers/user'),
    checkSession = require('../controllers/common').checkSession,
    emailControllsers = require('../controllers/email');
/**
 * users主目录
 */
router.get('/', function *() {
    this.body = 'this is users';
});
/**
 * 注册
 */
router.post('/register', UserControllers.register);

/**
 * 登陆
 */
router.post('/login', UserControllers.login);

/**
 * 查看个人信息
 */
router.get('/userInfo', checkSession, UserControllers.userInfo);

/**
 * 退出登陆
 */
router.get('/logout', UserControllers.logout);

/**
 * 修改密码
 */
router.post('/modifyPassword', checkSession, UserControllers.modifyPassword);

/**
 * 发送邮件
 */
router.post('/sendEmail', emailControllsers.sendEmail);

/**
 * 根据邮件找回密码
 */
router.post('resetPwd', emailControllsers.resetPwd);


module.exports = router;