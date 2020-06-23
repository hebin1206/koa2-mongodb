/**
 * 中间层入口
 * @author Huisir q273250950
 */

const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const cors = require('koa2-cors') //解决跨域中间件
const app = new Koa()
const isDev = process.argv.includes('--dev') //开发环境
const router = require('./router') //路由

const resMessage = require('./libs/koa-message')() //返回消息处理
const auth = require('./libs/koa-auth') //权限
const writeByPromise = require('./libs/koa-write-by-promise')() //权限

//中间件
app.use(bodyparser())

//允许跨域
if (isDev) {
    app.use(cors())
    //打印日志
    console.log(new Date().toLocaleString(), '跨域配置成功')
}
app.use(auth) //登录校验
app.use(resMessage) //输入数据整理
app.use(writeByPromise) // 处理promise

//启动路由
app.use(router.routes())

//打印日志
console.log(new Date().toLocaleString(), '路由启动成功')

//后台错误捕获
app.on('error', (err, ctx) => {
    console.error(new Date().toLocaleString(), err)
})

module.exports = app