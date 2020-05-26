<template>
	<view class="container">
		<view class="userInfo">
			<view class="top">
				<view @click="back()" class="nav-left"><image class="back-image" src="/static/center/back-w.png" mode=""></image></view>
				<view class="tab-bar" style="font-size: 18px;">{{ data.aboutPlatform }}</view>
			</view>
			<image class="image" src="/static/index/guan.png" mode=""></image>
			<view class="bottom">{{data.Ltitle}}</view>
		</view>
		<!-- <view class="aboutText">
			{{data.aboutText}}
		</view> -->
		<rich-text  class="aboutText" :nodes="aboutText"></rich-text>
	</view>
</template>

<script>
	var _self
	export default {
		data() {
			return {
				data: getApp().globalData.data.index,
				category_id: 18,
				aboutText:""
			};
		},
		onLoad() {
			_self=this
			let industry = uni.getStorageSync('industry');
			if(industry.name=="chinese"){
				this.data = this.$chinese[0].index
			}else{
				this.data = this.$chinese[1].index
			}
			_self.getData()
		},
		methods:{
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			getData(){
				// 数据请求
				_self.$ajax({
					path: _self.$api.agreenMent,
					data: {
						category_id:this.category_id
					},
					success(res) {
						let {
							data,
							code,
							msg
						} = res.data;
						if(code==1){
							_self.aboutText = data.content; //数据
						}else {
							uni.showToast({
								title: msg,
								icon: 'none'
							})
						}
					}
				});
			}
		}
	}
</script>

<style lang="less">
.container {
	width:100%;
	height:100vh;
	background:linear-gradient(313deg,rgba(42,186,194,1) 0%,rgba(91,206,213,1) 100%);
	opacity:1;
	.userInfo {
		.top{
			padding-top: 30upx;
			width: 100%;
			display: flex;
			align-items: center;
			line-height: 88upx;
			height:88upx;
			color:rgba(255,255,255,1);
			font-size: 32upx;
			margin-top: 44upx;
			.tab-bar{
				flex: 1;
				margin-left: -50upx;
				text-align: center;
			}
		}
		.image{
			width: 253upx;
			height: 258upx;
			margin-top:60upx;
			margin-left: 50%;
			transform: translateX(-50%);
		}
		.bottom{
			width: 100%;
			text-align: center;
			line-height: 88upx;
			height:88upx;
			color:rgba(255,255,255,1);
			font-size: 32upx;
			margin-top: 30upx;
		}
	}
	.nav-left {
		height: 100%;
	
		image {
			width: 20upx;
			height: 60%;
			margin-left: 30upx;
		}
	}
	.aboutText{
		margin: 88upx 32upx 0;
		font-size:28upx;
		font-weight:400;
		line-height: 40upx;
		color:rgba(255,255,255,1);
	}
}
</style>
