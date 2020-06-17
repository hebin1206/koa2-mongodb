/**
 * 加密 & Token生成
 * 类似于jsonwebtoken模块，优于jsonwebtoken
 * @author Huisir q273250950
 */

class EncryptToken {
	//创建token，搭配redis，过期时间在redis处配置
	//redis存储的时候key为userid，value为token,相当于一个登陆用户在redis中只有一条
	constructor() {
		//密钥
		this.skey = 'abc..123'
	    //矫正this指向，否则无法在类中的方法中通过this访问其他方法
		this.creatToken = this.creatToken.bind(this)
		this.decodeToken = this.decodeToken.bind(this)
		this.encrypt = this.encrypt.bind(this)
		this.decrypt = this.decrypt.bind(this)
	}
	
	//注意  使用静态方法可以直接使用类名.进行访问，不需要new对象
	creatToken(userid,skey=this.skey){
		let curTime = Date.now()	//当前时间戳(保证每次生成不同的token)
		let curTime36 = curTime.toString(36)	//转为36进制
		return this.encrypt(`${userid},${curTime36}`,skey)
	}
	
	//解析token，搭配redis
	decodeToken(token,skey=this.skey){
		try{
			let [userid,curTime36] = this.decrypt(token,skey).split(',')
			
			const loginTime = parseInt(curTime36,36)	//36进制转10进制
			
			if((loginTime+'').length!==13){
				console.error(new Date().toLocaleString(),'token不合法')
				return {userid:null,loginTime:null}
			}
			
			return {
				userid,
				loginTime
			}
		}catch(err){
			console.error(new Date().toLocaleString(),'token不合法')
			return {userid:null,loginTime:null}
		}
	}
	
	//加密
	encrypt(str,skey=this.skey){
		let strArr = Buffer.from(str+skey).toString('base64').split('')	//Base64
		strArr.reverse()	//逆序
		let enStr = strArr.join('').replace(/=/g,"$")	//将=替换
		return enStr
	}
	
	//解密
	decrypt(pass,skey=this.skey){
		let strArr = pass.replace(/\$/g,"=").split('')
		strArr.reverse()	//逆序
		let str = Buffer.from(strArr.join(''),'base64').toString().split(skey)[0]
		return str
	}
}

module.exports = new EncryptToken()