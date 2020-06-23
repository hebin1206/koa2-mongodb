/*
 * @Author: heyiyi 
 * @Date: 2020-06-18 10:48:17 
 * @Last Modified by: heyiyi
 * @Last Modified time: 2020-06-18 10:54:15
 */
const router = require('koa-router')()
const api = require('./api/index') //路由

router.use('/api', api.routes(), api.allowedMethods())
module.exports = router