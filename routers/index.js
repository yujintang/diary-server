/**
 * Created by yujintang on 16/7/27.
 */
"use strict";

let router = require('koa-router')();

/**
 * 主页
 */
router.get('/', function *() {
    this.body = 'welcome to 7diary';
});

module.exports = router;