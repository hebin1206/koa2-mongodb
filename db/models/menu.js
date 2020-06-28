/**
 * 这里定义users表的数据类型和默认值
 * @author Heyiyi 
 */
var db = require('../db') //mongoose对象 
var Schema = db.Schema;

//Schema（模式/架构）对象
var menuSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    parentId: {
        type: String,
        required: true
    },
    backApi: {
        type: String,
        required: false
    },
    sort: {
        type: Number
    },
    meta: {
        type: Object
    },
    createTime: {
        type: Date,
        default: Date.now()
    }
})

module.exports = db.model('menu', menuSchema)