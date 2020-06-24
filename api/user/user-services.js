const SERVER_CONFIG = require('../../config/server_config.conf');
const userModel = require('../../controllers/account/account')

const {
  creatToken,
  encrypt
} = require('../../utils/encryptToken') //加密
const redis = require('../../utils/redis') //redis

class UserServe {
  constructor() {

  }
  /**
   * 添加新用户
   * @param {object} userInfo 
   */
  async add(userInfo) {
    return new Promise(async (resolve, reject) => {
      try {
        userInfo.password = encrypt(userInfo.password)
        var findRes = await userModel.signup(userInfo)
        resolve(findRes)
      } catch (err) {
        reject(err)
      }
    })
  }
  /**
   * 添加新用户
   * @param {object} userInfo 
   */
  async update(userInfo) {
    return new Promise(async (resolve, reject) => {
      try {
        var findRes = await userModel.updateUserInfo(userInfo)
        resolve(findRes)
      } catch (err) {
        reject(err)
      }
    })
  }
  /**
   * 获取用户列表
   */
  async list(option) {
    return new Promise(async (resolve, reject) => {
      try {
        var findRes = await userModel.pageFind(option)
        resolve(findRes)
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
   * 删除用户
   */
  async delUser(userid) {
    return new Promise(async (resolve, reject) => {
      try {
        var findRes = await userModel.delUser(userid)
        resolve({
          msg: "删除成功"
        })
      } catch (err) {
        reject(err)
      }
    })
  }


}


module.exports = new UserServe()