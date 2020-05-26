<template>
	<view class="">
		<uni-title class="nav">
			<view slot="left" @click="back()" class="nav-left"><image src="/static/center/backGray.png" mode=""></image></view>
			<view slot="center" class="tab-bar" style="font-size: 18px;">{{ data.aboutUS}}</view>
		</uni-title>
		<view style="height:197rpx;"></view>
		<view style="padding:20rpx 0;text-align: center;">
			<image :src="column.logo" style="width:172rpx; height:172upx;box-shadow:0px 0px 20px rgba(136,136,136,0.2);border-radius:40upx;" 
			 mode=""></image>
		</view>
		<view style="padding:20rpx 0;text-align: center; font-size: 24upx;"> {{data.versions}} : {{column.version}}</view>
		<!-- 底部 -->
		<view class="bottom">
			<view style="padding:10rpx 0;text-align: center;font-size: 24upx;">{{column.copyright}}</view>
			<view style="padding:10rpx 0;text-align: center; font-size: 24upx;">{{column.all}}</view>
		</view>
<!-- 		<view class="footer">
			<text @click="toAgreement" hover-class="other-navigator-hover" class="user_agreenment">
				《用户协议》
			</text>
		</view> -->
	</view>
</template>

<script>
	var _self;
	var graceRichText = require("@/common/js/richText.js");
	export default {
		data() {
			return {
				data: getApp().globalData.data.index,
				baseUrl: '',
				column: {
					logo: '/static/center/LGlogo.png',
					edition: '1.0.2',
					footer: 'copyight@2019 XXXXX',
					all: ' All Rights Reserved'
				},
			};
		},
		onLoad() {
			_self = this
			this.baseUrl = this.$req.baseuUrl
			let industry = uni.getStorageSync('industry');
			if(industry.name=="chinese"){
				this.data = this.$chinese[0].index
			}else{
				this.data = this.$chinese[1].index
			}
			this.getData();
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			getData() {
				//数据请求
				_self.$ajax({
					path: _self.$api.contact,
					data: {},
					success(res) {
						let {
							data,
							code,
							msg
						} = res.data;
						if(code==1){
							_self.column = data; //数据
						}else {
							uni.showToast({
								title: msg,
								icon: 'none'
							})
						}
					}
				});
			},
			toAgreement() {
				uni.navigateTo({
					url: '/pages/login/agreenment'
				})
			}
		}
	};
</script>

<style lang="scss">
	.bottom {
		position: absolute;
		width: 100%;
		bottom: 150upx;
		left: 0;
		color: rgba(191, 191, 191, 1);
	}

	.footer {
		position: absolute;
		bottom: 100upx;
		width: 100%;
		font-size: 24upx;
		text-align: center;

		.user_agreenment {
			font-size: 24upx;
			color: #2ABAC2;
		}
	}
</style>
