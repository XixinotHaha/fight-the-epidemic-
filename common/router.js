const whitelist = { //声明了一个白名单
	'/pages/index/index': 'index',
	'/pages/center/center': 'center',
}

module.exports.routers = [{
		path: '*',
		name: 'moddle',
		redirect: to => {
			const name = whitelist[to.path];
			if (name) {
				return {
					name
				}
			};
			return {
				name: 'index'
			}
		}
	},
	{
		aliasPath: '/index',
		path: "/pages/index/index",
		name: 'index',
		ch_name: "首页",
		filter: true, // true不拦截 false拦截
		beforeEnter: (to, from, next) => {
			let user_address = uni.getStorageSync("user_address")
			let industry = uni.getStorageSync("industry")
			let name = ""
			if (!industry) {
				next({
					name: 'trade',
					NAVTYPE: 'replaceAll',
					params: {
		
					}
				});
				return
			}
			if (!user_address) {
				next({
					name: 'address',
					NAVTYPE: 'replaceAll',
					params: {
		
					}
				});
				return
			}
			next()
		}
	},
	{
		path: "/pages/index/trade/trade",
		name: 'trade',
		ch_name: "选择语言",
		filter: true,
	},
	{
		path: "/pages/login/login",
		name: 'login',
		ch_name: "登录",
		filter: true,
		
	},
	{
		path: "/pages/login/mobile_login",
		name: 'mobile_login',
		ch_name: "验证码登录",
		filter: true,
	},
	{
		path: "/pages/login/register",
		name: 'register',
		ch_name: "注册",
		filter: true,
	},
	{
		path: "/pages/login/agreenment",
		name: 'agreenment',
		ch_name: "用户协议",
		filter: true,
	},
	{
		path: "/pages/login/resetpassword",
		name: 'resetpassword',
		ch_name: "忘记密码",
		filter: true,
	},
	{
		path: "/pages/login/editpassword",
		name: 'editpassword',
		ch_name: "修改密码",
		filter: false,
	},
	{
		path: "/pages/login/bind_account",
		name: 'bind_account',
		ch_name: "绑定新账号",
		filter: true,
	},
	{
		path: "/pages/login/verification_account",
		name: 'verification_account',
		ch_name: "验证旧账号",
		filter: true,
	},
	{
		path: "/pages/index/address/address",
		name: 'address',
		ch_name: "免责声明",
		filter: true,
	},
	{
		"path": "/pages/center/user_info",
		name: 'user_info',
		ch_name: "个人资料",
		filter: false,
	},
	{
		"path": "/pages/center/user_info_input",
		name: 'user_info_input',
		ch_name: "基本信息",
		filter: true,
	},
	{
		path: "/pages/center/contact",
		name: 'contact',
		ch_name: "联系我们",
		filter: false,
	},
	{
		path: "/pages/center/setting/setting",
		name: 'setting',
		ch_name: "设置",
		filter: false,
	},
	{
		path: "/pages/center/feedback/feedback",
		name: 'feedback',
		ch_name: "反馈",
		filter: false,
	},
	{
		path: "/pages/center/about",
		name: 'about',
		ch_name: "关于我们",
		filter: false,
	},
	{
		"path": "/pages/center/upload",
		name: 'upload',
		ch_name: "上传头像",
		filter: true,
	},
	{
		"path": "/pages/center/upload_input",
		name: 'upload_input',
		ch_name: "基本信息上传头像",
		filter: true,
	},
	{
		path: "/pages/center/message/message",
		name: 'message',
		ch_name: "平台消息",
		filter: false,
	},
	{
		path: "/pages/center/check_basic",
		name: 'check_basic',
		ch_name: "是否存在以下症状",
		filter: false,
	},
	{
		path: "/pages/index/about_patforml",
		name: 'about_patforml',
		ch_name: "关于平台",
		filter: false,
	},
	{
		path: "/pages/index/detail/case_report",
		name: 'case_report',
		ch_name: "我的病例",
		filter: false,
	},
	{
		path: "/pages/index/detail/case_input",
		name: 'case_input',
		ch_name: "填写化验指标",
		filter: false,
	},
	{
		path: "/pages/index/detail/detail",
		name: 'detail',
		ch_name: "病例详情",
		filter: false,
	},
	{
		path: "/pages/index/detail/banner_detail",
		name: 'banner_detail',
		ch_name: "广告详情",
		filter: true,
	},
	{
		path: "/pages/index/trade/trade_edit",
		name: 'trade',
		ch_name: "修改语言",
		filter: false,
	},
	{
		path: "/pages/center/pay/pay",
		name: 'pay',
		ch_name: "诊断概率",
		filter: false,
	},
	{
		path: "/pages/index/writequotation/writequotation",
		name: 'writequotation',
		ch_name: "我要邀请好友",
		filter: false,
	},
	{
		path: "/pages/center/message/message_detail",
		name: 'message_detail',
		ch_name: "系统消息详情",
		filter: false,
	},



	{
		aliasPath: "/center",
		path: "/pages/center/center",
		name: 'center',
		ch_name: "个人中心",
		filter: true,
	},
]
