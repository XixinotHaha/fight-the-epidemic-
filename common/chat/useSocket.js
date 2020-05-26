import Vue from 'vue'
import socket from "./socket.js"; //引入socket.js 重要
import store from "@/common/chat/store.js";
import {
	req
} from "@/common/request.js"
async function getMessage(that) {
	try {
		const res = await req.ajax({
			path: "Msg/msgList",
			title: "",
			data: {}
		})
		let {
			data,
			code,
		} = res.data;
		if (code == 1) {
			store.commit('setSocketMessage', data)
		} else {
			uni.showToast({
				title: "加载失败",
				icon: "none"
			})
		}
	} catch (e) {
		console.log(e) //请求发生了错误
	}
}
Vue.prototype.$getMessage = getMessage;
let Socket;
function initSocket() {
	Socket = new socket({
		url: 'ws://116.255.251.252:7373', //连接地址 必填
		maxInterValCount: 5,
		interValTime: 1000,
		onOpen(res) {
			let userinfo = uni.getStorageSync("USERINFO")
			if (userinfo !== "") {
				req.defaultReq.baseData.token = userinfo.token;
				let msg = {
					"type": "init",
					"id": userinfo.user_id,
					"username": userinfo.nickname,
					"avatar": userinfo.avatar,
					"sign": userinfo.mobile
				};
				this.nsend(JSON.stringify(msg));
				console.log("websocket握手成功!");
			} else {
				this.nclose()
				console.log("未登陆，主动断开");
			}

		},
		onClose(err) {
			console.log('关闭了连接')

		},
		onReload(res) {
			console.log('重载：' + res)
		},
		onRdFinsh(count) {
			console.log(count + '次重连已完成')
		},
		onMsg(msg) {
			const res = JSON.parse(msg.data);
			if (res.hasOwnProperty("data")) {
				store.commit('setSocketState', res.data)
				getMessage()
			}
		}
	})
	Vue.prototype.$Socket = Socket;
}
Vue.prototype.$initSocket = initSocket;
