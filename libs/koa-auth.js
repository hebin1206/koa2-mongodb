/**
 * 权限验证
 */
const path = require('path')
const {
  error
} = require('../config') //抛出错误
const {
  decodeToken
} = require('../utils/encryptToken') //token解析
const UserModel = require('../db/models/user') //用户Model
const redis = require('../utils/redis') //redis

module.exports = async function auth(ctx, next) {
  let pathObj = path.parse(ctx.request.url)
  const ignorePaths = ['login', 'signup']
  // console.log(pathObj)
  let ignore = ignorePaths.some((ignorePath) => {
    return ignorePath == pathObj.base;
  });

  // 如果不需要登录 进行下一步
  if (ignore) {
    return await next()
  }

  //获取请求头中的token
  const token = ctx.headers.token
  if (!token) {
    error.e403()
    return
  }

  //这里判断token是否合法
  const {
    userid,
    loginTime
  } = decodeToken(token)
  if (!userid || userid.length != 24) {
    error.e403()
    return
  }

  //与数据库比对是否有此用户
  const user = await UserModel.findById(userid)
  if (!user) {
    error.e403('token对应的用户不存在')
    return
  }

  //使用userid去redis中查询，如果存在且相同，则next()，如果不存在或不同，则已过期
  const redisToken = await redis.get(userid)
  if (!redisToken || redisToken != token) {
    error.e403('抱歉，您的登陆已过期')
  } else {
    ctx.curUserInfo = {
      userid,
      loginTime
    } //通过ctx向子路由传值
    await next()
  }
}