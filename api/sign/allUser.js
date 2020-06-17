/**
 * 获取所有用户 GET
 * @author Huisir q273250950
 */

const router = require('koa-router')()
var UserModel = require('../../db/models/user')

router.get('/allUser', async ctx => {
	
	//注意：这里必须使用await形式将异步转换为同步，要不然不能够返回数据
	let users = await UserModel.find({},'-password -__v')
	ctx.response.type = 'json';
	ctx.response.body = {ok:1,data:users}
	
	//处理错误在app.js中使用了中间件，这里不需要再次捕获
})

module.exports = router