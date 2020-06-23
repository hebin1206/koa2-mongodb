/**
 * 这里使用mongoose模块连接mongodb数据库
 * 使用mongoose模块操作数据库的模块层在根目录db文件夹中
 * 连接数据库需要配置的选项在根目录config.js中
 * @author Heyiyi
 */

const mongoose = require('mongoose')
const {db} = require('../config')  //配置文件

//连接数据库
//说明:虽然连接数据库是异步操作，但mongoose内置了缓存，即使还没有连接到数据库，也能使用模型并不会报错。
//故这里不比使用回调或者promise去等待数据库连接成功再执行后续增删改查
const Account = db.account?`${db.account}:${db.pass}@`:'';   //是否有账号和密码
mongoose.connect(`mongodb://${Account}127.0.0.1:${db.port}/${db.name}`,{useNewUrlParser: true},err=>{
    if(!err){
	    console.log(new Date().toLocaleString(),'数据库'+db.name+'已连接成功')
    }else{
        console.error(err)
    }
})

module.exports = mongoose