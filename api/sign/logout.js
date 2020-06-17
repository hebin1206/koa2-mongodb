/**
 * 注销登陆 POST
 * 注销登陆要将redis缓存中的用户删除
 * @author Huisir q273250950
 */

const router = require('koa-router')()
const {decodeToken} = require('../../utils/encryptToken')	//解析token
const redis = require('../../utils/redis')	//redis

router.post('/logout', async ctx => {
	//通过中间件的传值拿到token中的user信息，这里无需再次解析token
	const {userid} = ctx.curUserInfo
	
	//将用户从redis中删除
	const delToken = await redis.del(userid)
	
	ctx.response.type = 'json'
	
	//删除成功则返回，否则报错
	if(delToken == '1'){
		ctx.response.body = {
			ok:1,
			data:{},
		}
	}
})

module.exports = router
