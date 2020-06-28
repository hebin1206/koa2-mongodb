/*
 * 角色
 * @Author: heyiyi 
 * @Date: 2020-06-24 10:06:23 
 * @Last Modified by: heyiyi
 * @Last Modified time: 2020-06-28 15:38:47
 */
const router = require('koa-router')()
const menuServe = require("./menu-services")
const SERVER_CONFIG = require('../../config/server_config.conf');
const _ = require('lodash')

router.get('/list', _list)
router.get('/tree', _tree)
router.get('/listByUserId', _listByUserId)
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
    path,
    backApi,
    parentId
  } = ctx.request.body;
  if (!path || !name || !backApi) {
    return ctx.resMessage(SERVER_CONFIG.REQ_CODE.ERROR_PARAMS_INVALID)
  }
  parentId = parentId || '0'
  const option = Object.assign({}, ctx.request.body, {
    parentId
  })
  let promise = menuServe.add(option)
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

  parentId = info.parentId || '0'
  const option = Object.assign({}, info, {
    parentId
  })
  console.log(option)
  let promise = menuServe.update(option)
  await ctx.writeByPromise(promise)
}
/**
 * 获取列表
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

  const option = Object.assign({}, ctx.request.query, {
    page: page || 1,
    size: size || 10
  })

  let promise = menuServe.list(option)

  await ctx.writeByPromise(promise)

}
/**
 * 获取菜单树
 * @param  ctx 
 */
async function _tree(ctx) {

  const option = Object.assign({}, ctx.request.query, {
    page: 1,
    size: 500
  })

  let promise = menuServe.tree(option)

  await ctx.writeByPromise(promise)

}

/**
 * 获取当前登录用户下的菜单列表
 * @param {} ctx 
 */
async function _listByUserId(ctx) {
  // const {
  //   userid
  // } = ctx.curUserInfo
  let {
    userId,
  } = ctx.request.query;
  console.log(ctx.request.query)
  if (!userId) {
    return ctx.resMessage(SERVER_CONFIG.REQ_CODE.ERROR_USER_NOT_LOGIN)
  }

  let promise = menuServe.listByUserId(userId)

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


  let promise = menuServe.del(id)
  await ctx.writeByPromise(promise)
}