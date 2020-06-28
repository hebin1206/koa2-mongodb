/*
 * 角色
 * @Author: heyiyi 
 * @Date: 2020-06-24 10:06:23 
 * @Last Modified by: heyiyi
 * @Last Modified time: 2020-06-24 15:43:32
 */
const router = require('koa-router')()
const roleServe = require("./role-services")
const SERVER_CONFIG = require('../../config/server_config.conf');
const _ = require('lodash')

router.get('/list', _list)
router.post('/add', _add)
router.post('/update', _update)
router.post('/del', _del)

module.exports = router
/**
 * 创建
 */
async function _add(ctx) {
  let {
    name,
    menu
  } = ctx.request.body;
  if (!menu || !name) {
    return ctx.resMessage(SERVER_CONFIG.REQ_CODE.ERROR_PARAMS_INVALID)
  }
  const option = {
    name,
    menu
  }
  let promise = roleServe.add(option)
  await ctx.writeByPromise(promise)
}
/**
 * 更新信息
 */
async function _update(ctx) {
  let info = ctx.request.body;
  if (!info.id) {
    return ctx.resMessage(SERVER_CONFIG.REQ_CODE.ERROR_PARAMS_INVALID)
  }

  let promise = roleServe.update(info)
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

  let promise = roleServe.list(option)

  await ctx.writeByPromise(promise)

}


/**
 * 删除用户
 * @param {*} ctx 
 */
async function _del(ctx) {
  let {
    id,
  } = ctx.request.body;
  if (!id) {
    return ctx.resMessage(SERVER_CONFIG.REQ_CODE.ERROR_PARAMS_INVALID)
  }


  let promise = roleServe.del(id)
  await ctx.writeByPromise(promise)
}