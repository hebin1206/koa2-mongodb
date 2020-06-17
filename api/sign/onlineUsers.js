/**
 * 当前在线用户 GET
 * 获取当前redis缓存中的用户
 * @author Huisir q273250950
 */

const router = require('koa-router')()
const redis = require('../../utils/redis')	//redis
const UserModel = require('../../db/models/user')	//db

router.get('/onlineUsers', async ctx => {
	//查询缓存userid
	const getRedisUsers = await redis.keys('*')
	
	//读取user数据(多值查询，链式查询)
	let users = await UserModel.find({},'-password -__v').where('_id').in(getRedisUsers)
	
	ctx.response.type = 'json'
	
	ctx.response.body = {
		ok:1,
		data:users
	}
})

module.exports = router