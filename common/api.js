module.exports = {
	login:{
		path:"user/login",  //已调
		filter:true, //是否需要登录拦截，true不需要，不填写或flase为需要
		description:"密码登录"
	},
	register:{
		path:"user/register", //已调
		filter:true,
		description:"注册"
	},
	send_code:{
		path:"sms/send", //已调
		filter:true,
		description:"发送验证码"
	},
	agreenMent:{
		path:"common/page_detail",  //已调  
		filter:true,
		description:"用户协议(单页面)"
	},
	update_password:{
		path:"user/pass_update_password",  //已调
		description:"修改密码"
	},
	forget_password:{
		path:"user/resetpwd",   //已调
		filter:true,
		description:"忘记密码"
	},
	// code_login:{
	// 	path:"user/mobilelogin",  
	// 	filter:true,
	// 	description:"验证码登录"
	// },
	change_mobile:{
		path:"user/changemobile",  //已调
		description:"绑定新手机" 
	},
	verification_account:{
		path:"sms/check",
		description:"验证旧手机"   //已调
	},
	profile:{
		path:"user/profile",      //已调
		description:"修改用户信息"
	},
	upload:{
		path:"/api/common/upload", //已调
		description:"上传图片/视频"
	},
	feedback:{
		path:"user/feedback",     //已调 
		description:"意见反馈"
	},
	getmsg_detail:{
		path:"msg/getMsgDetail",  //已调
		description:"系统消息详情"
	},
	getSystemMsg:{
		path:"msg/getSystemMsg",  //已调
		description:"系统消息列表"
	},
	banner:{
		path:"index/banner",     //已调
		filter:true,
		description:"轮播图"
	},
	update:{
		path:"common/version_check",  // 已调
		description:"版本检测"
	},
	symptom_add:{
		path:"user/symptom_add", //已调
		description:"症状登记"
	},
	update_filed_values:{
		path:"user/update_filed_values", //已调
		filter:true,
		description:"修改语言"
	},
	contact:{
		path:"common/site_list",  //已调
		filter:true,   
		description:"联系我们(公共配置接口)"
	},
	test_sheet_list:{
		path:"test_sheet/test_sheet_list",  //已调
		description:"我的病例列表"
	},
	test_sheet_detail:{
		path:"test_sheet/test_sheet_detail",  //已调
		description:"病例详情"
	},
	quota_list:{
		path:"test_sheet/quota_list",   // 已调
		filter:true,
		description:"指标列表"
	},
	create_data:{
		path:"test_sheet/create_data",  
		filter:true,
		description:"添加指标概率计算"
	},

}







