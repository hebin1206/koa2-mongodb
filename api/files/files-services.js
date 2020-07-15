const SERVER_CONFIG = require('../../config/server_config.conf');
const fs = require('fs')
const { mkdir } = require('../../utils/hyFs')
const path = require('path')
class FilerServe {
  constructor() {

  }
  /**
   * 上传
   * @param {object} files 
   */
  async _upload(file) {
    return new Promise(async (resolve, reject) => {
      try {
        // TODO 存储数据到本地临时文件
        // console.log(file)
        let fileName = file.name
        const reader = fs.createReadStream(file.path);
        let filePath = path.join(__dirname, '../../public/upload/') + `${fileName}`;
        // 创建可写流
        // await mkdir(filePath)
        const upStream = fs.createWriteStream(filePath);
        // 可读流通过管道写入可写流
        reader.pipe(upStream);
        resolve({ url: filePath })
      } catch (err) {
        reject(err)
      }
    })
  }
}

module.exports = new FilerServe()