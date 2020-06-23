/**
 * 登陆接口 post
 * @author Heyiyi
 */

const router = require('koa-router')()
const {loginTimeOut , error} = require('../../config')
const UserModel = require('../../db/models/user')
const {creatToken , encrypt} = require('../../utils/encryptToken')	//加密
const redis = require('../../utils/redis')	//redis

router
	.post('/login', async ctx => {
		//请求数据格式须为：x-www-form-urlencoded才能使用ctx.request.body接收
		let {username,password} = ctx.request.body
		
		//与数据库比对
		const res = await UserModel.findOne({username,password:encrypt(password)},'-password -__v')	//不返回密码
		
		ctx.response.type = 'json'
		
		if(res){
			const token = creatToken(res._id)
			
			//这里将token存到redis(key为userid，value为token)
			//一个用户只有一条缓存，便于查询当前登陆用户数
			//注意配置失效时间
			const saveToken = await redis.set(res._id.toString(), token , 'EX', loginTimeOut)
			
			//缓存成功则返回，否则报错
			if(saveToken == 'OK'){
				ctx.response.body = {
					ok:1,
					data:res,
					token
				}
			}
		}else{
			error.e401('用户名或密码错误')
		}
	})	
	
module.exports = router