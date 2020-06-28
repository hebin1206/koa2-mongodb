/*
 * user
 * @Author: heyiyi 
 * @Date: 2020-06-24 10:06:23 
 * @Last Modified by: heyiyi
 * @Last Modified time: 2020-06-28 11:02:11
 */
const router = require('koa-router')()
const userServe = require("./user-services")
const SERVER_CONFIG = require('../../config/server_config.conf');
const _ = require('lodash')

router.get('/list', _list)
router.post('/add', _add)
router.post('/update', _update)
router.post('/delUser', _delUser)

module.exports = router
/**
 * 创建用户
 */
async function _add(ctx) {
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
  let promise = userServe.add(option)
  await ctx.writeByPromise(promise)
}

/**
 * 更新信息
 */
async function _update(ctx) {
  let userInfo = ctx.request.body;
  console.log(ctx.request.body)
  if (!userInfo.userId) {
    return ctx.resMessage(SERVER_CONFIG.REQ_CODE.ERROR_USER_NOT_LOGIN)
  }

  let promise = userServe.update(userInfo)
  await ctx.writeByPromise(promise)
}
/**
 * 获取用户列表
 * @param  ctx 
 */
async function _list(ctx) {
  let {
    page,
    size
  } = ctx.request.query


  page = Number(page) || 1
  size = Number(size) || 10
  if (!_.isNumber(page) || !_.isNumber(size)) {
    return ctx.resMessage(SERVER_CONFIG.REQ_CODE.ERROR_PARAMS_INVALID)
  }

  const option = {
    page: page || 1,
    size: size || 10
  }

  let promise = userServe.list(option)

  await ctx.writeByPromise(promise)

}


/**
 * 删除用户
 * @param {*} ctx 
 */
async function _delUser(ctx) {
  let {
    delUserId,
  } = ctx.request.body;
  const {
    userid
  } = ctx.curUserInfo

  if (delUserId == userid) {
    return ctx.resMessage(SERVER_CONFIG.REQ_CODE.ERROR_PARAMS_INVALID, {
      msg: '不能删除当前登录用户'
    })

  }
  let promise = userServe.delUser(delUserId)
  await ctx.writeByPromise(promise)
}