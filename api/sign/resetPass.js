/**
 * 重置密码 POST
 * 重置密码后要将登陆状态变为未登陆
 * @author Heyiyi
 */

const router = require('koa-router')()
const redis = require('../../utils/redis')	//redis
const UserModel = require('../../db/models/user')	//db
const {error} = require('../../config')
const {encrypt} = require('../../utils/encryptToken')	//加密

router.post('/resetPass', async ctx => {
	
	//通过中间件的传值拿到token中的user信息，这里无需再次解析token
	const {userid} = ctx.curUserInfo
	
	const {oldPass,newPass} = ctx.request.body
	
	//与数据库比对
	const checkOldPass = await UserModel.findOne({_id:userid,password:encrypt(oldPass)},'-password -__v')
	
	if(!checkOldPass){
		error.e200('旧密码不正确')
		return
	}
	
	if(oldPass === newPass){
		error.e200('新密码不能与旧密码相同')
		return
	}
	
	//密码格式校验(可写可不写，因为可以前端校验)
	//...
	
	//修改密码
	const resetPass = await UserModel.updateOne({_id:userid},{password:encrypt(newPass)})
	
	if(resetPass.ok==1){
		//将用户从redis中删除,登陆状态变为未登陆
		const delToken = await redis.del(userid)
		
		if(delToken == '1'){
			ctx.response.type = 'json'
			ctx.response.body = {
				ok:1,
				data:{}
			}
		}
	}
})

module.exports = router