/**
 * 业务配置
 * @Author: heyiyi 
 * @Date: 2020-06-18 14:14:31 
 * @Last Modified by: heyiyi
 * @Last Modified time: 2020-06-23 15:28:28
 */
let config = {}

// 返会code
config.REQ_CODE = {
  ERROR_OK: 200,
  ERROR_USER_NON_REGISTERED: 10003, //尚未注册
  ERROR_USER_PASSWORD_ERROR: 10000, //密码错误
  ERROR_PASSWORD_SAME: 10001, //新密码就密码相同
  ERROR_USER_REGISTERED: 10007, //账号已注册
  ERROR_USER_ALREADY_EXISTS: 10007, //账号已注册
  ERROR_SMS_CODE_INVALID: 10009, //验证码无效
  ERROR_USER_NAME_INVALID: -10004, //用户名码无效

  ERROR_PARAMS_INVALID: -10100, //参数错误
  ERROR_EXECUTE_FAILED: -10200, //执行错误

  ERROR_NOT_ALLOW_FILE_FORMAT: -30001, //禁止文件格式

  ERROR_SERVER_EXCEPTION: -20000, //服务器异常
  ERROR_UNKNOWN: -20001, //未知错误
  ERROR_SERVER_TIMEOUT: -20004, //请求超时
}

module.exports = config;