/**
 * API接口配置文件
 * 此文件适用于参照标准模块的接口
 */
module.exports = {
	//公共接口组
	common:{
		getverifycode:"user/sendSms", // 统一获取验证码
		config:"config/getinfo", // 获取服务端配置
		update:"config/update", // 检测更新 
	},
	//用户接口组
	user:{
		user_name_login:"v1/5c78dbfd977cf", // 用户名密码登录
		user_mobile_login:"v1/5c78dca45ebc1", // 手机号登录
		// get_user_info:"v1/5c78c4772da97", // 获取用户信息
		get_user_info:"user/getUserIndexInfo", // 获取用户信息
		user_register:"v1/5cad9f63e4f94",//用户注册
		user_forget_password:"v1/5caeeba9866aa",//忘记密码	
	}
}