import Vue from 'vue'
import App from './App'

import Custom from './common/custom';
import Util from './common/util';
Vue.prototype.$Common = Custom;
Vue.prototype.$util = Util;
Vue.prototype.$store = store;

Vue.prototype.$Cache = HttpCache
import HttpCache from '@/common/cache'


// 引入语言文件
import chinese from '@/common/language/chinese.js'
Vue.prototype.$chinese = chinese;
// let industry = uni.getStorageSync('industry');
// if (industry.name == "chinese") {
// 	Vue.prototype.$chinese = chinese[0];
// } else {
// 	Vue.prototype.$chinese = chinese[1];
// }

import cuCustom from './colorui/components/cu-custom.vue'
//弹出层
import uniPopup from './components/uni-popup/uni-popup.vue'
Vue.component('uni-popup', uniPopup)

// 上拉加载下拉刷新
import MescrollUni from "./components/mescroll-uni/mescroll-uni.vue";
Vue.component('mescroll-uni', MescrollUni)
//聊天
import './common/chat/useSocket.js';
import store from "./common/chat/store.js";
// 头像上传
import avatar from "./components/yq-avatar/yq-avatar.vue";
Vue.component('avatar', avatar)

//角标
import uniBadge from './components/uni-badge/uni-badge.vue'
Vue.component('uni-badge', uniBadge)

// 底部弹出选择器
import mpvuePicker from './components/mpvue-picker/mpvuePicker.vue';
import mpvueCityPicker from './components/mpvue-citypicker/mpvueCityPicker.vue'
Vue.component('mpvue-picker', mpvuePicker)
Vue.component('mpvue-city-picker', mpvueCityPicker)

// 自定义导航栏
import uniTitle from './components/uni-title/uni-title.vue';
Vue.component('uni-title', uniTitle)

// 清理缓存
Vue.prototype.$checkPlatform = function() {
	let {
		platform
	} = uni.getSystemInfoSync()
	if (platform === "ios") {
		return 0
	} else {
		return 1
	}
}
// 轻提示
let toast = (title) => {
	uni.showToast({
		title,
		icon: "none",
		duration: 1500

	})
}

Vue.prototype.toast = toast;
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})


app.$mount()
