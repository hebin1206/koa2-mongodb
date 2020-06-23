/**
 * 登陆服务
 * @author Heyiyi
 */

const {
  loginTimeOut,
} = require('../../config')
// const UserModel = require('../../db/models/user')
const SERVER_CONFIG = require('../../config/server_config.conf');

const accountModel = require('../../controllers/account/account')
const {
  creatToken,
  encrypt
} = require('../../utils/encryptToken') //加密
const redis = require('../../utils/redis') //redis

class AccountServe {
  constructor() {

  }
  /**
   * 登录服务
   * @param {账号} username 
   * @param {密码} password 
   */
  async login(option) {
    return new Promise(async (resolve, reject) => {
      //与数据库比对

      const res = await accountModel.login(option.username, encrypt(option.password)) //不返回密码
      if (!res) { //确定用户是否存在
        reject({
          code: SERVER_CONFIG.REQ_CODE.ERROR_USER_NON_REGISTERED,
          msg: "用户不存在"
        })
        return
      }
      if (res && (res.password == encrypt(option.password))) {
        const token = creatToken(res._id)

        //这里将token存到redis(key为userid，value为token)
        //一个用户只有一条缓存，便于查询当前登陆用户数
        //注意配置失效时间
        const saveToken = await redis.set(res._id.toString(), token, 'EX', loginTimeOut)

        //缓存成功则返回，否则报错
        if (saveToken == 'OK') {
          delete res.password //不反会密码
          resolve({
            user: res,
            token
          })
        }
      } else {
        reject({
          code: SERVER_CONFIG.REQ_CODE.ERROR_USER_PASSWORD_ERROR,
          msg: "密码错误"
        })
      }
    })
  }

  /**
   * 注册
   * @param {*} option 
   */
  async signup(option) {
    return new Promise(async (resolve, reject) => {
      option.password = encrypt(option.password)
      try {
        var findRes = await accountModel.signup(option)
        resolve(findRes)
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
   * 修改密码
   * @param {*} option 
   */
  async resetPass(option) {
    return new Promise(async (resolve, reject) => {
      option.oldPass = encrypt(option.oldPass)
      option.newPass = encrypt(option.newPass)
      const {
        userid
      } = option
      try {

        var findRes = await accountModel.resetPass(option)
        console.log(findRes)
        //将用户从redis中删除,登陆状态变为未登陆
        // resolve(findRes)

        const delToken = await redis.del(userid)
        console.log("delToken", delToken)
        if (delToken == '1') {
          resolve({
            msg: '更新成功 重新登录'
          })
        }
      } catch (err) {
        reject(err)
      }
    })
  }
}
module.exports = new AccountServe()