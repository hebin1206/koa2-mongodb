/**
 * 这里定义users表的数据类型和默认值
 * @author Heyiyi 
 */
var db = require('../db') //mongoose对象 
var Schema = db.Schema;

//Schema（模式/架构）对象
var roleSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    menu: {
        type: Array,
        default: 0
    },
    createTime: {
        type: Date,
        default: Date.now()
    }
})

module.exports = db.model('role', roleSchema)