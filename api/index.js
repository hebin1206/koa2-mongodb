/**
 * 路由中转
 * @author Heyiyi
 */

const router = require('koa-router')()
const account = require('./account/account')

router.use('/account', account.routes(), account.allowedMethods())

module.exports = router