/**
 * 路由中转
 * @author Heyiyi
 */

const router = require('koa-router')()
const account = require('./account/account')
const user = require('./user/user')

router.use('/account', account.routes(), account.allowedMethods())
router.use('/user', user.routes(), user.allowedMethods())

module.exports = router