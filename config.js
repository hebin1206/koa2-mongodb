/**
 * 项目配置层
 * @author Huisir q273250950
 */

const isDev = process.argv.includes('--dev')

 module.exports = {
	 
    baseURL:isDev?'http://127.0.0.1':'https://myweb.com',	//接口层域
	
	port:isDev?8080:8888,	//端口
	
    db:{   //数据库配置
        port:'27017',   //数据库默认为27017端口
        name:'myDB',    //要连接的数据库名称
        account:null,   //此数据库账号(没有可为null)
        pass:null       //数据库密码(没有可为null)
    },
	
	loginTimeOut:60*30,		//用户登陆过期时间为半小时（以秒计算）
	
	error:{	//错误信息
		e200(msg="请求失败"){
			let err = new Error(msg)
			err.status = 200
			throw err
		},
		e403(msg='对不起，您暂未登陆'){
			let err = new Error(msg)
			err.status = 403
			throw err
		},
		e401(msg='登陆超时'){
			let err = new Error(msg)
			err.status = 401
			throw err
		},
		e404(msg='路径不存在'){
			let err = new Error(msg)
			err.status = 404
			throw err
		},
		e500(msg='内部服务器错误'){
			let err = new Error(msg)
			err.status = 500
			throw err
		},
		e502(msg='数据库错误'){
			let err = new Error(msg)
			err.status = 502
			throw err
		},
		e504(msg='数据库请求超时'){
			let err = new Error(msg)
			err.status = 504
			throw err
		}
	}
	
 }