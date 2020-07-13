/**
 * 路由中转
 * @author Heyiyi
 */

const router = require('koa-router')()
const account = require('./account/account')
const user = require('./user/user')
const role = require('./role/role')
const menu = require('./menu/menu')
const files = require('./files/files')

router.use('/account', account.routes(), account.allowedMethods())
router.use('/user', user.routes(), user.allowedMethods())
router.use('/role', role.routes(), role.allowedMethods())
router.use('/menu', menu.routes(), menu.allowedMethods())
router.use('/files', files.routes(), files.allowedMethods())

module.exports = router