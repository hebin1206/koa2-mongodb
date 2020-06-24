// 输出json格式消息

module.exports = function message() {
  return async function (ctx, next) {
    if (ctx.resMessage) {
      return await next()
    }
    ctx.resMessage = async function (code, data) {
      let output = {
        code: code
      };
      if (data === null || typeof (data) !== 'object' || Object.keys(data).length > 0) {
        output.data = data;
      }
      ctx.response.type = ctx.response.type || 'json'
      ctx.response.body = output

      //后台捕获
      // if (code !== 401 && code !== 403 && code !== 404 && code !== 200)
      //   ctx.app.emit('error', ctx); //如果错误被try...catch捕获，就不会触发error事件，故需要使用emit方法

    }
    await next();
  }


  // //错误捕获
  // try {
  //   await next();
  //   ctx.response.type = ctx.response.type || 'json'
  // } catch (err) {
  //   //前台捕获
  //   const status = err.statusCode || err.status || 500
  //   ctx.response.status = status;
  //   ctx.response.type = 'json';
  //   ctx.response.body = {
  //     code: 0,
  //     msg: err.message
  //   }

  //   //后台捕获
  //   if (status !== 401 && status !== 403 && status !== 404 && status !== 200)
  //     ctx.app.emit('error', err, ctx); //如果错误被try...catch捕获，就不会触发error事件，故需要使用emit方法
  // }
};