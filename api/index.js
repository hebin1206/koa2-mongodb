/**
 * 路由中转
 * @route openApi 开放接口，不需要token验证
 * @route signApi 私密接口，需要token验证
 * @author Heyiyi
 */

const fs = require('fs')
const path = require('path')
const router = require('koa-router')()

const account = require('./account/account')

//读取openApi路由文件
let openPath = path.resolve(__dirname, './open')
let openRoutes = fs.readdirSync(openPath),
	openApiModules = {}
openRoutes.forEach(route => {
	let basename = path.basename(route, '.js')
	openApiModules[basename] = require(`./open/${route}`)
})

//读取signApi路由文件
let signPath = path.resolve(__dirname, './sign')
let signRoutes = fs.readdirSync(signPath),
	signApiModules = {}
signRoutes.forEach(route => {
	let basename = path.basename(route, '.js')
	signApiModules[basename] = require(`./sign/${route}`)
})

//启动接口openApi
for (const key in openApiModules) {
	if (openApiModules[key] && Object.keys(openApiModules[key]).length != 0) //判断是否为空对象
		router.use('/open', openApiModules[key].routes(), openApiModules[key].allowedMethods())
}

//启动接口signApi
for (const key in signApiModules) {
	if (signApiModules[key] && Object.keys(signApiModules[key]).length != 0) //判断是否为空对象
		router.use('/sign', signApiModules[key].routes(), signApiModules[key].allowedMethods())
}


router.use('/account', account.routes(), account.allowedMethods())

module.exports = router