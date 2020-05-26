<template>
	<view class="my">
		<uni-title class="nav">
			<view slot="left" @click="back()" class="nav-left"><image src="/static/center/backGray.png" mode=""></image></view>
			<view slot="center" class="tab-bar" style="font-size: 18px;">{{ data.contact }}</view>
		</uni-title>
		<view class="contact">
			<image class="bgc" src="/static/center/contactus.png" mode=""></image>
			<view class="company_introduction">
				<view class="name"  @tap="toMobile"><text class="left">{{data.contactPhone}} </text><text class="right">{{companyIntroduction.consumer_hotline}}</text></view>
				<view class="name"><text class="left">{{data.workTime}}</text><text class="right">{{companyIntroduction.schedule}}</text></view>
			</view>
		</view>
		<uni-popup ref="mobile" type="center" class="del_draft">
			<view class="title">{{data.toCall}}</view>
			<view class="title" style="font-size: 36upx;">
				{{companyIntroduction.consumer_hotline}}
			</view>
			<view class="button">
				<button class="current" @click="closePopup" plain="true">{{data.notSure}}</button>
				<button @click="sureMobile" plain="true">{{data.dial}}</button>
			</view>
		</uni-popup>
	</view>
</template>
<script>
	import uniPopup from '@/components/popup/uni-popup/uni-popup.vue';
	var _self;
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				user: {},
				data: getApp().globalData.data.index,
				companyIntroduction:{}
			};
		},
		onLoad() {
			_self = this
			let industry = uni.getStorageSync('industry');
			if (industry.name == 'chinese') {
				this.data = this.$chinese[0].index;
			} else {
				this.data = this.$chinese[1].index;
			}
			this.getData()
		},

		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			toMobile(){
				this.$refs.mobile.open();
			},
			closePopup() {
				this.$refs.mobile.close();
			},
			sureMobile(){
				uni.makePhoneCall({
				    phoneNumber: this.mobile
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
						_self.companyIntroduction = data; //数据
						
					}
				});
			}
			
		}
	};
</script>
<style lang="scss">
	.my{
		.contact{
			margin-top: 120upx;
			.bgc{
				width: 276upx;
				height: 276upx;
				margin: 78upx 237upx 120upx;
			}
			.company_introduction{
				padding: 0 32upx;
				.top-name{
					height:45upx;
					font-size:32upx;
					font-weight:bold;
					line-height:45upx;
					color:rgba(33,160,231,1);
					margin:32upx 0;
				}
				.name{
					margin-bottom: 70upx;
					font-size:28upx;
					font-weight:400;
					line-height:40upx;
					color:rgba(51,51,51,1);
					display: flex;
					justify-content: space-between;
					.left{
						color: #333333;
					}
					.right{
						color: #2ABAC2;
					}
				}
			}
			.service{
				margin:80upx 145upx 0;
				padding: 38upx;
				background:rgba(247,247,247,1);
				border-radius:16px;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				.left{
					.title,.time{
						margin-bottom: 30upx;
						font-size: 32upx;
						color: #333333;
					}
					.mobile{
						color: #EE494F;
					}
				}
				image{
					width: 88upx;
					height: 100upx;
				}
				
			}
		}
	}
	.del_draft {
		display: flex;
		flex-direction: column;
		.title {
			width: 100%;
			font-size: 40upx;
			&:nth-child(1) {
				font-size: 28upx;
				padding-top: 50upx;
			}
			&:nth-child(2){
				color: #2ABAC2;
				padding-bottom: 50upx;
				margin-top: 20upx;
			}
		}
	
		.button {
			display: flex;
			flex-direction: row;
			width: 100%;
	
			button {
				border: none;
				border-top: 1upx solid #B2B2B2;
				width: 50%;
				line-height: 100upx;
				height: 100upx;
				font-size: 36upx;
				color: #999999 !important;
				background-color: #FFF;
				border-radius: 0 !important;
	
				&:nth-child(2) {
					border-left: 1upx solid #B2B2B2;
					color: #2ABAC2 !important;
				}
			}
		}
	}
</style>
