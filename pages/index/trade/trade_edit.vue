<template>
	<view class="container">
		<view class="userInfo">
			<view class="top">
				<view @click="back()" class="nav-left"><image class="back-image" src="/static/center/back-w.png" mode=""></image></view>
				<view class="tab-bar" style="font-size: 18px;">{{ data.editLanguage }}</view>
			</view>
			<image class="image" src="/static/index/guan.png" mode=""></image>
			<view class="bottom">{{data.Ltitle}}</view>
		</view>
		<view class="padding">
			<view class="select">{{data.toSelectlanguage}}</view>
			<view :class="['zhongwen', chinese==1?'current':'']" @click="toSelect('chinese')">{{data.china[0].chinese}}</view>
			<view :class="['yingwen', english==1?'current':'']" @click="toSelect('english')" >{{data.china[1].english}}</view>
			<view class="submit" @click="tradeBtn">{{data.sure}}</view>
		</view>
	</view>
</template>

<script>
	var _self
	export default {
		data() {
			return {
				data: getApp().globalData.data.login,
				chinese:1,
				english:0,
			};
		},
		onLoad() {
			_self=this
			let industry = uni.getStorageSync('industry');
			if(industry.name=="chinese"){
				this.data = this.$chinese[0].login
			}else{
				this.data = this.$chinese[1].login
			}
		},
		methods:{
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			toSelect(type){
				if(type=="chinese"){
					this.chinese = 1
					this.english = 0
				}else if(type == "english"){
					this.chinese = 0
					this.english = 1
				}
			},
			tradeBtn (e){
				let item = {id:1,name:this.chinese==1?"chinese":"english"}
				// console.log(item);
				uni.setStorageSync('industry', item);
				this.updateFiledValues()
				this.$Router.replace({
					name: "setting",
					params:{}
				});
			},
			// 选择语言
			updateFiledValues(){
				_self.$ajax({
					path: _self.$api.update_filed_values,
					data: {
						default_language: this.chinese == 1?1:2, //语言
					},
					success(res) {
						let { data, code, msg } = res.data;
						console.log(data);
					}
				});
			},
		}
	}
</script>

<style lang="less">
.container {
	.userInfo {
		width:100%;
		height:645upx;
		background:linear-gradient(313deg,rgba(42,186,194,1) 0%,rgba(91,206,213,1) 100%);
		opacity:1;
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
			height: 50%;
			margin-left: 30upx;
		}
	}
	
	.padding {
		padding: 0;
		margin-top: -50upx;
		background-color: #FFFFFF;
		width:750upx;
		height:719upx;
		border-radius:30upx 30upx 0px 0px;
		.select{
			height:40upx;
			font-size:28upx;
			font-weight:400;
			line-height:40upx;
			color:rgba(51,51,51,1);
			text-align: center;
			margin-top: 88upx;
			margin-bottom: 48upx;
		}
		.zhongwen,.yingwen,.submit{
			width:406upx;
			height:88upx;
			background:rgba(255,255,255,1);
			border:1px solid rgba(112,112,112,1);
			border-radius:44upx;
			margin-left: 172upx;
			line-height: 88upx;
			text-align: center;
		}
		.yingwen{
			margin-top: 40upx;
		}
		.submit{
			background:rgba(42,186,194,1);
			border:1px solid rgba(42,186,194,1);
			margin-top: 80upx;
		}
		.current{
			background:rgba(232,247,248,1);
			border:1upx solid rgba(35,158,165,1);
		}
	}
	
	
}
</style>
