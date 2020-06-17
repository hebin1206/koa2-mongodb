/**
 * 中间层入口
 * @author Huisir q273250950
 */

const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const cors = require('koa2-cors')	//解决跨域中间件
const app = new Koa()
const isDev = process.argv.includes('--dev')	//开发环境
const router = require('./api/index')	//路由

//中间件
app.use(bodyparser())

//允许跨域
if(isDev){
	app.use(cors())
	//打印日志
	console.log(new Date().toLocaleString(),'跨域配置成功')
}

//错误捕获
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
		//前台捕获
		const status = err.statusCode || err.status || 500
        ctx.response.status = status;
        ctx.response.type = 'json';
        ctx.response.body = {ok:0,msg:err.message}
		//后台捕获
		if(status!==401 && status!==403 && status!==404  && status!==200)
			ctx.app.emit('error', err, ctx); //如果错误被try...catch捕获，就不会触发error事件，故需要使用emit方法
    }
})

//启动路由
app.use(router.routes())

//打印日志
console.log(new Date().toLocaleString(),'路由启动成功')

//后台错误捕获
app.on('error', (err, ctx)=>{
    console.error(new Date().toLocaleString(),err)
})

module.exports = app