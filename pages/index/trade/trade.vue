<template>
	<view class="container">
		<view class="userInfo">
			<view class="top">选择语言</view>
			<image src="/static/index/guan.png" mode=""></image>
			<view class="bottom">**新冠筛查助手</view>
		</view>
		<view class="padding">
			<view class="select">请选择语言 / Please select language</view>
			<view :class="['zhongwen', chinese == 1 ? 'current' : '']" @click="toSelect('chinese')">中文</view>
			<view :class="['yingwen', english == 1 ? 'current' : '']" @click="toSelect('english')">English</view>
			<view class="submit" @click="tradeBtn">确定 / Confirm</view>
		</view>
	</view>
</template>

<script>
var _self;
export default {
	data() {
		return {
			data: getApp().globalData.data.login,
			chinese: 1,
			english: 0
		};
	},
	onLoad() {
		_self = this;
	},
	methods: {
		toSelect(type) {
			if (type == 'chinese') {
				this.chinese = 1;
				this.english = 0;
			} else if (type == 'english') {
				this.chinese = 0;
				this.english = 1;
			}
		},
		tradeBtn(e) {
			let item = { id: 1, name: this.chinese == 1 ? 'chinese' : 'english' };
			console.log(item);
			uni.setStorageSync('industry', item);
			_self.$req.defaultReq.baseData['language'] = item.name=="chinese"?1:2;
			_self.$Router.replaceAll({
				name: 'address',
				params: {}
			});
		}
	}
};
</script>

<style lang="less">
.container {
	.userInfo {
		width: 750upx;
		height: 645upx;
		background: linear-gradient(313deg, rgba(42, 186, 194, 1) 0%, rgba(91, 206, 213, 1) 100%);
		opacity: 1;
		.top {
			width: 100%;
			text-align: center;
			line-height: 88upx;
			height: 88upx;
			color: rgba(255, 255, 255, 1);
			font-size: 32upx;
			margin-top: 44upx;
		}
		image {
			width: 253upx;
			height: 258upx;
			margin-top: 60upx;
			margin-left: 248upx;
		}
		.bottom {
			width: 100%;
			text-align: center;
			line-height: 88upx;
			height: 88upx;
			color: rgba(255, 255, 255, 1);
			font-size: 32upx;
			margin-top: 30upx;
		}
	}

	.padding {
		padding: 0;
		margin-top: -50upx;
		background-color: #ffffff;
		width: 750upx;
		height: 719upx;
		border-radius: 30upx 30upx 0px 0px;
		.select {
			height: 40upx;
			font-size: 28upx;
			font-weight: 400;
			line-height: 40upx;
			color: rgba(51, 51, 51, 1);
			text-align: center;
			margin-top: 88upx;
			margin-bottom: 48upx;
		}
		.zhongwen,
		.yingwen,
		.submit {
			width: 406upx;
			height: 88upx;
			background: rgba(255, 255, 255, 1);
			border: 1px solid rgba(112, 112, 112, 1);
			border-radius: 44upx;
			margin-left: 172upx;
			line-height: 88upx;
			text-align: center;
		}
		.yingwen {
			margin-top: 40upx;
		}
		.submit {
			background: rgba(42, 186, 194, 1);
			border: 1px solid rgba(42, 186, 194, 1);
			margin-top: 80upx;
		}
		.current {
			background: rgba(232, 247, 248, 1);
			border: 1upx solid rgba(35, 158, 165, 1);
		}
	}
}
</style>
