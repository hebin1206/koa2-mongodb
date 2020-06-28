/**
 * 路由中转
 * @author Heyiyi
 */

const router = require('koa-router')()
const account = require('./account/account')
const user = require('./user/user')
const role = require('./role/role')
const menu = require('./menu/menu')

router.use('/account', account.routes(), account.allowedMethods())
router.use('/user', user.routes(), user.allowedMethods())
router.use('/role', role.routes(), role.allowedMethods())
router.use('/menu', menu.routes(), menu.allowedMethods())

module.exports = router