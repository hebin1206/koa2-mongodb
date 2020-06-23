/**
 * 这里定义users表的数据类型和默认值
 * @author Heyiyi 
 */
var db = require('../db')   //mongoose对象 
var Schema = db.Schema;

//Schema（模式/架构）对象
var userSchema = new Schema({
    username:{
		type:String,
		required: true
	},
	password: {
		type:String,
		required: true
	},
    sex: {
        type:Number,
        default:0
    },
    state:{
        type:Number,
        default:0
    },
    createTime:{
        type: Date, 
        default: Date.now
    }
})

module.exports = db.model('user', userSchema)