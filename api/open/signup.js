/**
 * 注册接口 post
 * 密码进行base64加密
 * @author Huisir q273250950
 */
const router = require('koa-router')()
const UserModel = require('../../db/models/user') 
const {encrypt} = require('../../utils/encryptToken')	//加密
const {error} = require('../../config')

router.post('/signup', async ctx => {
	
    var postData = ctx.request.body		//post数据
	
    ctx.response.type = 'json'		//返回格式
	
	var findRes = await UserModel.findOne({'username':postData.username})	//比对
	
	if(!findRes){	//不存在
		postData.password = encrypt(postData.password)	//密码加密
		const createRes = await UserModel.create(postData)	//新增
		//返回结果
		ctx.response.body = {ok:1,data:{
			_id:createRes._id,
			username:createRes.username,
			sex:createRes.sex,
			state:createRes.state
		}}	
	}else{
		error.e200('用户名已存在')
	}
})

module.exports = router