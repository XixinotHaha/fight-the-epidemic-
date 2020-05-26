<script>
import Vue from 'vue';
var _self
export default {
	globalData: {
		data: ''
	},
	onLaunch: function() {
		console.log('App Launch');
		// #ifdef APP-PLUS
		this.$checkHotVersions(this.$req.baseuUrl, '/api/common/version_check');
		// #endif
		let user_address = uni.getStorageSync('user_address');
		let industry = uni.getStorageSync('industry');
		console.log(user_address, industry);
		if (!industry) {
			uni.reLaunch({
				url: '/pages/index/trade/trade'
			});
			return;
		}
		if (!user_address) {
			uni.reLaunch({
				url: '/pages/index/address/address'
			});
			return;
		}
		if (industry) {
			if (industry.name == 'chinese') {
				this.globalData.data = this.$chinese[0];
			} else {
				this.globalData.data = this.$chinese[1];
			}
		}
	},
	onShow: function() {
		_self = this
		console.log('App Show');
		_self.$ajax({
			path: _self.$api.contact,
			data: {},
			success(res) {
				let {
					data,
					code,
					msg
				} = res.data;
				uni.setStorageSync("commonData",data)
			}
		});
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style lang="scss">
/*每个页面公共css */
/* #ifndef APP-NVUE */
/*UI自带CSS,请勿修改*/
@import './colorui/main.css';
@import './colorui/icon.css';
@import './static/iconfont/iconfont.css';

button::after {
	border: none;
}

// page {
// 	font-family: PingFang SC;
// 	box-sizing: border-box;
// 	min-height: 100%;
// }

text,
view {
	box-sizing: border-box;
	line-height: 1;
}

.container {
	display: flex;
	flex-direction: column;
}

.show-box .clear[data-v-7ae2b45c] {
	padding: 1px;
	font-size: 10px;
}

/* 中间弹框 */
.uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box {
	width: 80%;
	max-width: 540upx;
	background: rgba(255, 255, 255, 1);
	border-radius: 20upx;
	text-align: center;
	color: #666666;
	font-size: 32upx;
	padding: 0 !important;
	overflow: hidden;
}

/* 底部弹框 */
.uni-popup__wrapper.uni-custom.top .uni-popup__wrapper-box,
.uni-popup__wrapper.uni-custom.bottom .uni-popup__wrapper-box {
	border-radius: 30upx 30upx 0 0;
}

/* 暂无数据 */
.all_not {
	text-align: center;

	image {
		margin-top: 40upx;
		width: 304upx !important;
		height: 304upx !important;
	}

	view {
		font-size: 24upx;
		color: gray;
	}
}

wx-swiper .wx-swiper-dot-active {
	width: 20px;
	border-radius: 4px;
}
.uni-picker-view-content {
	background-color: #2abac2;
	overflow: hidden;
}

.nav-left {
	height: 100%;

	image {
		width: 50upx;
		height: 60%;
		margin-top: 25%;
	}
}

.line_box {
	width: 100%;
	height: 20upx;
	background: rgba(248, 248, 248, 1);
}
/* #endif */
</style>
