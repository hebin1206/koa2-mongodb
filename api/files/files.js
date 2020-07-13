/*
 * file
 * @Author: heyiyi 
 * @Date: 2020-06-24 10:06:23 
 * @Last Modified by: heyiyi
 * @Last Modified time: 2020-06-28 11:02:11
 */
// const Koa = require('koa')
// const koaBody = require('koa-body');
const router = require('koa-router')()
const filesServe = require("./files-services")
const SERVER_CONFIG = require('../../config/server_config.conf');
const _ = require('lodash')

// const app = new Koa()

// app.use(koaBody({
//   multipart: true,
//   formidable: {
//     maxFileSize: 20000 * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
//   }
// }));

router.post('/upload', _upload)

module.exports = router
/**
 * 创建用户
 */
async function _upload(ctx) {
  const { type } = ctx.request.body;
  // 上传单个文件
  const file = ctx.request.files.file; // 获取上传文件

  if (!file) {
    return ctx.resMessage(SERVER_CONFIG.REQ_CODE.ERROR_PARAMS_INVALID)
  }

  let promise = filesServe._upload(file, type)
  await ctx.writeByPromise(promise)
}
