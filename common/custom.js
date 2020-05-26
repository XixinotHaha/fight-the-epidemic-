
import Vue from 'vue'
import $common from '@/common/common.js'
import $api from '@/common/api.js'
import {
	routers
} from "@/common/router.js"
import {
	req
} from "@/common/request.js"

//热更新
import {checkHotVersions} from '@/common/hotProperty.js'
Vue.prototype.$checkHotVersions= checkHotVersions;

req.baseuUrl = "http://huaxi.hncjne.com"; // 实例地址

req.defaultReq.url = req.baseuUrl + '/api/';

let USERINFO = $common.getUserInfo();

function setReqBaseDaata() {
	USERINFO = $common.getUserInfo()
	let industry = uni.getStorageSync('industry');
	req.defaultReq.type = "POST";
	let user_id = "",
		user_token = "",
		language = "";
	if(industry.name=="chinese"){
		language = 1
	}else{
		language = 2
	}
	if (USERINFO) {
		user_id = USERINFO.id;
		user_token = USERINFO.token;
		language = language
	}
	req.defaultReq.baseData = {
		"user_id": user_id,
		"token": user_token,
		"language" : language,
		//#ifdef APP-PLUS
		"uuid": plus.device.uuid
		//#endif
	};
	req.defaultReq.header = {
		'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
	}
}
setReqBaseDaata()

req.defaultReq.beforeSend = (request) => {
	USERINFO = $common.getUserInfo();
	if (!request.filter) {
		return request;
	} else {
		if (USERINFO) {
			setReqBaseDaata()
			return request;
		} else {
			let pages = getCurrentPages();
			let page = pages[pages.length - 1];
			for (let key in router.routers) {
				// for (let i = 0; i < router.routers[key].length; i++) {
				// 	let {
				// 		name,
				// 		path
				// 	} = router.routers[key][i];
				// 	if (path == "/" + page.route) {
				// 		router.push({
				// 			"name": "login",
				// 			params: {
				// 				"from": name
				// 			}
				// 		})
				// 	}
				// }
			}
		}
	}
}

async function myAjax(options) {
	let defaults = Object.assign({
		path: "",
		title: "",
		data: {}
	}, options);
	try {
		const res = await req.ajax({
			path: defaults.path,
			title: defaults.title,
			data: defaults.data,
			abortFun: (info, bt) => {
				if (defaults.filter && defaults.filter()) {
					bt.abort();
				}
			}
		})
		let {
			data,
			code,
			msg
		} = res.data;
		if (code == 2000 || code == 1) {
			defaults.success && defaults.success(res)
		} else if (code === -401) {
			defaults.fail && defaults.fail(res)
			repeatLogin('push')
			uni.hideLoading()
		} else {
			if (defaults.fail) {
				defaults.fail && defaults.fail(res)
				return
			} else {
				uni.showToast({
					title: msg,
					icon: 'none',
					success() {

					}
				});
			}
			defaults.fail && defaults.fail(res)
		}
	} catch (e) {
		// if(e.data.code&&e.data.code===401){
		// 	repeatLogin()
		// 	return;
		// }
		defaults.fail && defaults.fail(e)
	}
}

// 去登录 默认强制登录,非强制登录使用push
function forcedLogin(type = 'push') {
	console.log(type);
	USERINFO = $common.getUserInfo()
	if (!USERINFO) {
		router[type]({
			"name": "login"
		})
	}
}
// 重复登陆401
function repeatLogin(type) {
	uni.showModal({
		title: '提示',
		content: '您的账号已在其他设备登录,请重新登录',
		showCancel: false,
		confirmText: '确定',
		success: res => {
			if (res.confirm) {
				uni.removeStorage({
					key: 'USERINFO',
					success: function(res) {
						// 登录页
						forcedLogin(type)
					}
				});
			}
		}
	});
}


import Router from 'uni-simple-router';
Vue.use(Router);
const router = new Router({
	routes: routers
});
router.beforeEach((to, from, next) => {
	USERINFO = $common.getUserInfo()
	if (!to.filter) {
		if (!USERINFO) {
			next({
				name: 'login',
				NAVTYPE: 'push',
				params: {
					"from": from.name
				}
			});
			return;
		} else {
			setReqBaseDaata()
		}
	} else {

	}
	next()
})

import nRouter from "@/common/nRouter.js"


// admin_id: req.defaultReq.baseData.admin_id,
// 上传图片
$common.upLoadImage = function(options) {
	let defaults = {
		url: $api.uploadImage,
		formData: {
			token: req.defaultReq.baseData.token
		}
	}
	options.formData = Object.assign(defaults.formData, options.formData)
	defaults = Object.assign(defaults, options)
	uni.showLoading({
		title: '正在上传',
		success() {
			const uploadTask = uni.uploadFile({
				url: req.defaultReq.url + defaults.url['path'],
				filePath: defaults.file,
				name: 'file',
				formData: defaults.formData,
				success(uploadFileRes) {
					let {
						code,
						data,
						msg
					} = JSON.parse(uploadFileRes.data);
					uni.showToast({
						title: msg,
						duration: 500,
						icon: (code == 1 || code == 2000) ? "success" : "none",
						success() {
							if (code == 1 || code == 2000) {
								defaults.success && defaults.success(data)
							}
							uni.hideLoading()
						}
					})
				},
				fail() {
					uni.showToast({
						title: '上传失败',
						icon: "none"
					});
				}
			});
			uploadTask.onProgressUpdate((res) => {
				// console.log('上传进度' + res.progress);
				// console.log('已经上传的数据长度' + res.totalBytesSent);
				// console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
				defaults.onProgressUpdate && defaults.onProgressUpdate(res, options.index)
			});
		}
	})
};

module.exports.$common = $common;
module.exports.$api = $api;
module.exports.$req = req;
module.exports.$ajax = myAjax;
module.exports.$forcedLogin = forcedLogin;
module.exports.$nRouter = nRouter;
Vue.prototype.$common = $common;
Vue.prototype.$api = $api;
Vue.prototype.$req = req;
Vue.prototype.$ajax = myAjax;
Vue.prototype.$forcedLogin = forcedLogin;
