const SERVER_CONFIG = require('../config/server_config.conf');

class Util {
  handleCallback(ctx, data) {
    // console.log(data)
    // console.log(ctx)
    ctx.response.type = ctx.response.type || 'json'
    ctx.response.body = {
      code: ctx.response.body ? ctx.response.body.code : SERVER_CONFIG.REQ_CODE.ERROR_OK,
      data,
    }
  }

  async writeByPromise(ctx, data) {
    console.log(data)
    data.then(async (res) => {
      console.log('成功')
      this.handleCallback(ctx, res)
    }).catch((error) => {
      this.handleCallback(ctx, {
        code: 0,
        msg: error
      })

    })
  }
}
module.exports = new Util()