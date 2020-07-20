const UserModel = require('../../db/models/user')
const MongoModel = require('./../mongoModel')
const SERVER_CONFIG = require('../../config/server_config.conf');

class Account extends MongoModel {
  constructor() {
    super(UserModel);

  }
  /**
   * 登录模块
   */
  async login(username, password) {
    return new Promise(async (resolve, reject) => {
      try {
        // const res = await UserModel.findOne({
        //   username,
        //   password,
        // }, '-password -__v') //不返回密码

        const res = await this.findOne({
          username,
        }) //不返回密码
        resolve(res)
      } catch (err) {
        reject(err)
      }
    })
  }
  /**
   * 查询所有用户
   */
  async allUser() {
    return new Promise(async (resolve, reject) => {
      try {
        let res = await this.find({}, '-password -__v')
        resolve(res)
      } catch (err) {
        reject(err)
      }
    })
  }
  /**
   * 查询当前登录用户
   */
  async userInfo(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        let res = await UserModel.findById({
          _id: userId
        }, '-password -__v').lean()
        console.log(res)
        resolve(res)
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
        let userInfo = await this.findOne({
          _id: userid
        })
        if (!userInfo) {
          reject({
            code: SERVER_CONFIG.REQ_CODE.ERROR_EXECUTE_FAILED,
            msg: '删除失败，用户不存在'
          })
          return
        }
        let res = await this.findOneAndRemove({
          _id: userid
        })
        resolve(res)
      } catch (err) {
        reject(err)
      }
    })
  }


  /**
   * 获取所有登录用户
   * @param {*} redisUsers 
   */
  async onlineUsers(redisUsers) {
    return new Promise(async (resolve, reject) => {
      try {
        //读取user数据(多值查询，链式查询) this 暂不支持链式调用
        let res = await UserModel.find({}, '-password -__v').where('_id').in(redisUsers)
        resolve(res)
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
   * 注册 添加新用户
   * @param {userInfo} option 
   */
  async signup(option) {
    return new Promise(async (resolve, reject) => {
      try {
        const findRes = await this.findOne({
          username: option.username
        })

        if (!findRes) { //不存在
          // postData.password = option.password //密码加密
          const createRes = await this.create(option) //新增
          //返回结果
          resolve({
            _id: createRes._id,
            username: createRes.username,
            sex: createRes.sex,
            state: createRes.state
          })
        } else {
          reject({
            code: SERVER_CONFIG.REQ_CODE.ERROR_USER_ALREADY_EXISTS
          })
        }
      } catch (err) {
        reject(err)
      }
    })
  }
  /**
   * 更新用户信息
   * @param {userInfo} option 
   */
  async updateUserInfo(option) {
    return new Promise(async (resolve, reject) => {
      try {
        const findRes = await this.findOne({
          _id: option.userId
        }, '-password -__v')

        if (findRes) {
          // option = Object.assign({}, findRes, option)
          const updateRes = await this.findByIdAndUpdate(findRes._id, option) //新增
          //返回结果
          resolve(updateRes)
        } else {
          reject({
            code: SERVER_CONFIG.REQ_CODE.ERROR_USER_NON_REGISTERED
          })
        }
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
      const {
        oldPass,
        newPass,
        userid
      } = option

      const checkOldPass = await this.findOne({
        _id: userid,
        password: oldPass
      }, '-password -__v')

      if (!checkOldPass) {
        reject({
          code: SERVER_CONFIG.REQ_CODE.ERROR_USER_PASSWORD_ERROR,
          msg: "原密码错误"
        })
      }

      if (oldPass === newPass) {
        reject({
          code: SERVER_CONFIG.REQ_CODE.ERROR_PASSWORD_SAME,
          mag: '新密码不能与旧密码相同'
        })
        return
      }
      //密码格式校验(可写可不写，因为可以前端校验)
      //...
      const resetPass = await this.updateOne({
        _id: userid
      }, {
        password: newPass
      })
      if (resetPass.ok == 1) {
        resolve()
      }
    })
  }
}

module.exports = new Account()