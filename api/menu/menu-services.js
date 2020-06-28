const SERVER_CONFIG = require('../../config/server_config.conf');
const menuModel = require('../../controllers/menu/menu')
const accountModel = require('../../controllers/account/account')
const roleModel = require('../../controllers/role/role')

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
        var findRes = await menuModel.add(roleInfo)
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
        var findRes = await menuModel.update(userInfo)
        resolve(findRes)
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
   * 获取列表
   */
  async list(option) {
    return new Promise(async (resolve, reject) => {
      try {
        let parameter = Object.assign({}, option)
        delete parameter.page
        delete parameter.size
        var findRes = await menuModel.pageFind(option, parameter, {
          sort: 1
        })

        resolve(findRes)
      } catch (err) {
        reject(err)
      }
    })
  }
  
  /**
   * 获取菜单树
   */
  async tree(option) {
    return new Promise(async (resolve, reject) => {
      try {
        let parameter = Object.assign({}, option)
        delete parameter.page
        delete parameter.size
        var findRes = await menuModel.pageFind(option, parameter, {
          sort: 1
        })
        let menuList = findRes.list
        let data = this._formatMenu(menuList, '0')
        resolve(data)
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
   * 根据userId获取列表
   */
  async listByUserId(userId) {
    return new Promise(async (resolve, reject) => {
      try {

        // 更具userId 获取角色id 列表
        // 根据角色查询所有菜单id
        // 更具菜单Id 查询所有菜单信息
        // 整理菜单信息返回数据

        let roles = []
        const userInfo = await accountModel.findOne({
          _id: userId
        }, {
          role: 1,
        })
        roles = userInfo.role
        if (roles.length <= 0) {
          resolve({
            data: []
          })
          return
        }
        let rolesList = await roleModel.find({
          _id: {
            $in: roles
          }
        })
        let menuIds = [];
        rolesList.forEach(element => {
          menuIds.push(...element.menu)
        });
        if (menuIds.length <= 0) {
          resolve({
            data: []
          })
          return
        }
        let menuList = await menuModel.find({
          _id: {
            $in: menuIds
          }
        })
        resolve(menuList)
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
        var findRes = await menuModel.del(id)
        resolve({
          msg: "删除成功"
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  _formatMenu(arr, id) {
    let array = [];
    arr.forEach((item) => {
      if (item.parentId == id) {
        item = item.toObject()
        item.child = this._formatMenu(arr, item["_id"]);
        array.push(item);
      }
    })
    return array;
  }
}


module.exports = new UserServe()