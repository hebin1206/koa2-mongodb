const SERVER_CONFIG = require('../../config/server_config.conf');
const roleModel = require('../../controllers/role/role')

const redis = require('../../utils/redis') //redis

class UserServe {
  constructor() {

  }
  /**
   * 添加新用户
   * @param {object} roleInfo
   *  
   */
  async add(roleInfo) {
    return new Promise(async (resolve, reject) => {
      try {
        var findRes = await roleModel.add(roleInfo)
        resolve(findRes)
      } catch (err) {
        reject(err)
      }
    })
  }
  /**
   * 更新
   * @param {object} userInfo 
   */
  async update(userInfo) {
    return new Promise(async (resolve, reject) => {
      try {
        var findRes = await roleModel.update(userInfo)
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
        var findRes = await roleModel.pageFind(option)
        resolve(findRes)
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
   * 删除
   */
  async del(id) {
    return new Promise(async (resolve, reject) => {
      try {
        var findRes = await roleModel.del(id)
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