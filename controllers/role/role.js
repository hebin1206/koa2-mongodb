/*
 * @Author: heyiyi 
 * @Date: 2020-06-24 14:49:56 
 * @Last Modified by: heyiyi
 * @Last Modified time: 2020-06-24 15:45:10
 */
const RoleModel = require('../../db/models/role')
const MongoModel = require('./../mongoModel')
const SERVER_CONFIG = require('../../config/server_config.conf');

// 角色
class Role extends MongoModel {
  constructor() {
    super(RoleModel);
  }
  /**
   * 添加角色
   * @param {}} roleInfo 
   */
  async add(roleInfo) {
    return new Promise(async (resolve, reject) => {
      try {
        const findRes = await this.findOne({
          name: roleInfo.name
        })

        if (!findRes) { //不存在
          const createRes = await this.create(roleInfo) //新增
          //返回结果
          resolve(createRes)
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
   * 更新
   * @param {userInfo} option 
   */
  async update(option) {
    return new Promise(async (resolve, reject) => {
      try {
        const findRes = await this.findOne({
          _id: option.id
        })

        if (findRes) {
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
   * 删
   */
  async del(id) {
    return new Promise(async (resolve, reject) => {
      try {
        let userInfo = await this.findOne({
          _id: id
        })
        if (!userInfo) {
          reject({
            code: SERVER_CONFIG.REQ_CODE.ERROR_EXECUTE_FAILED,
            msg: '删除失败，信息不存在'
          })
          return
        }
        let res = await this.findOneAndRemove({
          _id: id
        })
        resolve(res)
      } catch (err) {
        reject(err)
      }
    })
  }

}

module.exports = new Role()