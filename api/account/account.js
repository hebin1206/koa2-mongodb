/**
 * 登陆接口 post
 * @author Heyiyi
 */

const router = require('koa-router')()
const accountServe = require("./account-services")
const SERVER_CONFIG = require('../../config/server_config.conf');
const redis = require('../../utils/redis') //redis


router.post('/login', _login)
router.post('/logout', _logout)
router.post('/signup', _signup)
router.post('/resetPass', _resetPass)
router.get('/allUser', _allUser)
router.get('/onlineUsers', _onlineUsers)
router.get('/userInfo', _userInfo)



module.exports = router
/**
 * 登录server
 * @param {返回数据} ctx 
 */
async function _login(ctx) {
  let {
    username,
    password
  } = ctx.request.body

  if (!username || !password) {
    return ctx.resMessage(SERVER_CONFIG.REQ_CODE.ERROR_PARAMS_INVALID)
  }

  const option = {
    username,
    password
  }
  let promise = accountServe.login(option)
  await ctx.writeByPromise(promise)
}

/**
 * 登出server
 * @param {返回数据} ctx 
 */
async function _logout(ctx) {
  const {
    userid
  } = ctx.curUserInfo

  //将用户从redis中删除
  const delToken = await redis.del(userid)

  if (delToken == '1') {
    return ctx.resMessage(SERVER_CONFIG.REQ_CODE.ERROR_OK)
  }
}

/**
 * 注册
 * @param {*} ctx 
 */
async function _signup(ctx) {
  let {
    username,
    password,
    sex,
    state
  } = ctx.request.body;

  if (!username || !password) {
    return ctx.resMessage(SERVER_CONFIG.REQ_CODE.ERROR_PARAMS_INVALID)
  }
  const option = {
    username,
    password,
    sex,
    state
  }
  let promise = accountServe.signup(option)
  await ctx.writeByPromise(promise)
}

/**
 * 修改密码
 * @param {*} ctx 
 */
async function _resetPass(ctx) {
  let {
    oldPass,
    newPass
  } = ctx.request.body;

  if (!oldPass || !newPass) {
    return ctx.resMessage(SERVER_CONFIG.REQ_CODE.ERROR_PARAMS_INVALID)
  }
  const {
    userid
  } = ctx.curUserInfo
  const option = {
    oldPass,
    newPass,
    userid
  }
  let promise = accountServe.resetPass(option)
  await ctx.writeByPromise(promise)
}

/**
 * 获取所有用户列表
 * @param {*} ctx 
 */
async function _allUser(ctx) {
  let promise = accountServe.allUser()
  await ctx.writeByPromise(promise)
}

/**
 * 获取当前登录用户列表
 * @param {*} ctx 
 */
async function _onlineUsers(ctx) {

  let promise = accountServe.onlineUsers()
  await ctx.writeByPromise(promise)
}

/**
 * 获取当前登录用户
 * @param {*} ctx 
 */
async function _userInfo(ctx) {
  const {
    userid
  } = ctx.curUserInfo
  let promise = accountServe.userInfo(userid)
  await ctx.writeByPromise(promise)
}

