/**
 * 路由中转
 * @route openApi 开放接口，不需要token验证
 * @route signApi 私密接口，需要token验证
 * @author Huisir q273250950
 */

const fs = require('fs')
const path = require('path')
const router = require('koa-router')()
const {error} = require('../config')		//抛出错误
const UserModel = require('../db/models/user') 	//用户Model
const {decodeToken} = require('../utils/encryptToken')	//token解析
const redis = require('../utils/redis')		//redis

//读取openApi路由文件
let openPath = path.resolve(__dirname, './open')
let openRoutes = fs.readdirSync(openPath) , openApiModules = {}
openRoutes.forEach(route=>{
    let basename = path.basename(route, '.js')
    openApiModules[basename] = require(`./open/${route}`)
})

//读取signApi路由文件
let signPath = path.resolve(__dirname, './sign')
let signRoutes = fs.readdirSync(signPath) , signApiModules = {}
signRoutes.forEach(route=>{
    let basename = path.basename(route, '.js')
    signApiModules[basename] = require(`./sign/${route}`)
})

//接口访问限制中间件（token锁）
//这里判断如果403，前台需要跳转到登陆页面
router.use('/sign',async (ctx,next) => {
	
	//获取请求头中的token
	const token = ctx.headers.token
	if(!token){
		error.e403()
		return
	}
	
	//这里判断token是否合法
	const {userid,loginTime} = decodeToken(token)
  	if(!userid || userid.length!=24){	
  		error.e403()
		return
  	}
	
	//与数据库比对是否有此用户
	const user = await UserModel.findById(userid)
	if(!user){
		error.e403('token对应的用户不存在')
		return
	}
  
  	//使用userid去redis中查询，如果存在且相同，则next()，如果不存在或不同，则已过期
	const redisToken = await redis.get(userid)
	if(!redisToken || redisToken!=token){
		error.e403('抱歉，您的登陆已过期')
	}else{
		ctx.curUserInfo = {userid,loginTime}	//通过ctx向子路由传值
		await next()
	}
})

//启动接口openApi
for (const key in openApiModules) {
    if(openApiModules[key] && Object.keys(openApiModules[key]).length != 0) //判断是否为空对象
		router.use('/open',openApiModules[key].routes(), openApiModules[key].allowedMethods())
}

//启动接口signApi
for (const key in signApiModules) {
    if(signApiModules[key] && Object.keys(signApiModules[key]).length != 0) //判断是否为空对象
		router.use('/sign',signApiModules[key].routes(), signApiModules[key].allowedMethods())
}

module.exports = router