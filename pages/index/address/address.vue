<template>
	<!-- 免责声明 -->
	<view class="container">
		<view class="userInfo">
			<view class="top"></view>
			<image src="/static/index/guan.png" mode=""></image>
			<view class="bottom">{{data.Ltitle}}</view>
		</view>
		<view class="padding">
			<view class="select">
				{{data.disclaimer}}
			</view>
			<view class="disclaimer">
				<view class="top">
					{{data.disclaimerText}}
				</view>
				<view class="ask">
					{{data.disclaimerAsk}}
				</view>
			</view>
			<view class="button">
				<view :class="['zhongwen', chinese==1?'current':'']" @click="toSelect('no')">{{data.notAgreen}}</view>
				<view :class="['yingwen', english==1?'current':'']" @click="toSelect('yes')" >{{data.agreen}}</view>
			</view>
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
			toSelect(type){
				if(type=="no"){
					this.chinese = 1
					this.english = 0
				}else if(type == "yes"){
					this.chinese = 0
					this.english = 1
					this.tradeBtn()
				}
			},
			tradeBtn (){
				let item = {id:1,name:"disclaimerYes"}
				console.log(item);
				uni.setStorageSync('user_address', item)
				// this.updateFiledValues()
				this.$Router.replaceAll({
					name: "index",
					params:{}
				});
			},
			// 选择语言
			updateFiledValues(){
				let industry = uni.getStorageSync('industry');
				_self.$ajax({
					path: _self.$api.update_filed_values,
					data: {
						industry: industry, //语言
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
		width:750upx;
		height:645upx;
		background:linear-gradient(313deg,rgba(42,186,194,1) 0%,rgba(91,206,213,1) 100%);
		opacity:1;
		.top{
			width: 100%;
			text-align: center;
			line-height: 88upx;
			height:88upx;
			color:rgba(255,255,255,1);
			font-size: 32upx;
			margin-top: 20upx;
		}
		image{
			width: 253upx;
			height: 258upx;
			margin-top:60upx;
			margin-left: 248upx;
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
		.disclaimer{
			padding: 0 32upx;
			margin-top: 30upx;
			.top{
				font-size:28upx;
				font-weight:400;
				line-height:48upx;
				color:rgba(51,51,51,1);
			}
			.ask{
				font-size:28upx;
				font-weight:400;
				margin-top: 50upx;
			}
		}
		.button{
			display: flex;
			margin: 50upx 0;
			padding-bottom: 50upx;
		}
		
		.zhongwen,.yingwen,{
			width:406upx;
			height:88upx;
			background:rgba(255,255,255,1);
			border:1px solid rgba(112,112,112,1);
			border-radius:44upx;
			line-height: 88upx;
			text-align: center;
			margin: 0 20upx
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
