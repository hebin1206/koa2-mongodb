const SERVER_CONFIG = require('../config/server_config.conf');

module.exports = function writeByPromise() {
  return async function (ctx, next) {
    if (ctx.writeByPromise) return await next();

    ctx.writeByPromise = async function (promise) {
      try {
        let result = await promise
        if (result.code) {
          ctx.resMessage(result.code, result)
        } else {
          ctx.resMessage(SERVER_CONFIG.REQ_CODE.ERROR_OK, result)
        }
      } catch (err) {

        if (err && err.code) {
          let code = err.code.code || err.code;
          delete err.code;
          ctx.resMessage(code, err);
        } else {
          // 打印错误
          ctx.app.emit('error', err, ctx); //如果错误被try...catch捕获，就不会触发error事件，故需要使用emit方法

          ctx.resMessage(SERVER_CONFIG.REQ_CODE.ERROR_UNKNOWN, err);
        }
      }
    }
    await next();
  }
}