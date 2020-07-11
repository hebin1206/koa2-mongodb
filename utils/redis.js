/**
 * redis 配置文件（存储登陆用户）
 * @author Heyiyi 
 */

const Redis = require('ioredis') //此模块已将redis封装为promise

//配置
const cfg = {
	port: 6379, // Redis port
	host: '127.0.0.1', // Redis host
	//password: '',		//密码
	db: 0 //存到第一个数据库里，默认为0（第一个库），redis默认有16个库
	//如果除了登陆用户，还有其他需求用到redis，要存到不同库，可以摒弃此文件
}

//创建连接
const newRedis = new Redis(cfg)

//打印日志
newRedis.on('connect', () => {
	console.log(new Date().toLocaleString(), 'Redis连接成功')
})

//输出
module.exports = newRedis