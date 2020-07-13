let fs = require('fs')
function read(path) {
    return new Promise(function (resolve, reject) {
        fs.readFile(path, { flag: 'r', encoding: "utf-8" }, function (err, data) {
            if (err) {
                //console.log(err)
                //失败执行的内容
                reject(err)

            } else {
                //console.log(data)
                //成功执行的内容
                resolve(data)
            }
            //console.log(456)
        })
    })
}


function write(path, content, flag = 'w') {
    return new Promise(function (resolve, reject) {
        //console.log(path)
        fs.writeFile(path, content, { flag: flag, encoding: "utf-8" }, function (err) {
            if (err) {
                console.log("写入内容出错")
                reject(err)
            } else {
                resolve(err)
                //console.log("写入内容成功")
            }
        })
    })
}

function mkdir(path) {
    return new Promise(function (resolve, reject) {
        fs.mkdir(path, function (err) {
            if (err) {
                console.log(err)
                reject(err)
            } else {
                resolve("成功创建目录")
            }
        })
    })
}

function rename(oldPath, newPath) {
    return new Promise(function (resolve, reject) {
        fs.rename(oldPath, newPath, (error) => {
            if (error) {
                reject(error)
            } else {
                resolve("rename success")
            }
        })
    })
}

function readdir(path, options) {
    return new Promise(function (resolve, reject) {
        fs.readdir(path, options, function (error, files) {
            if (error) {
                reject(error)
            } else {
                resolve(files)
            }
        })
    })
}

function exists(filePath) {
    return new Promise((resolve, reject) => {
        fs.exists(filePath, (isExists) => {
            resolve(isExists)
        })
    })
}

module.exports = { read, readdir, write, rename, mkdir, exists }