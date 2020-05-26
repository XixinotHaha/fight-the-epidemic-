<template>
	<view class="quotation">
		<uni-title class="nav">
			<view slot="left" @click="back()" class="nav-left"><image src="/static/center/backGray.png" mode=""></image></view>
			<view slot="center" class="tab-bar" style="font-size: 18px;">{{ data.diagnosticProbability }}</view>
		</uni-title>
		<view class="content">
			<view class="image">
				<image src="/static/center/dingnostic.png" mode=""></image>
				<view class="position">
					<view class="top">{{data.probabilityValue}}</view>
					<view class="bottom">{{detail.result}}<text>%</text></view>
				</view>
			</view>
			<view class="tips_text">{{industry.name=="chinese"?detail.data.hint_an:detail.data.hint_en}}</view>
			<view class="btn" @click="toIndex">{{data.toIndex}}</view>
			<view class="bottom_bottom">
				<view class="left">
					<image src="/static/center/contactus.png" mode=""></image>
				</view>
				<view class="right">
					<view class="email">
						{{data.emailTips}}
					</view>
					<view class="email-tips">
						{{Email}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	var _self;
	export default {
		data() {
			return {
				data: getApp().globalData.data.index,
				tips_text:"",
				Email:"Huaxi_Coronavirus@126.com",
				detail:{},
				industry:""
			};
		},
		onLoad() {
			_self = this;
			_self.industry = uni.getStorageSync('industry')
			if(_self.industry.name=="chinese"){
				this.data = this.$chinese[0].index
			}else{
				this.data = this.$chinese[1].index
			}
			_self.detail = this.$Route.query
			console.log(_self.detail);
			let common = uni.getStorageSync("commonData")
			this.Email = common.company_email
			// _self.getData()
		},

		computed: {},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			toIndex(){
				_self.$Router.pushTab({
					name: 'index',
					params: {}
				});
			},
			toDetail(id){
				this.$Router.push({
					name: "detail",
					params: {
						id:id
					}
				});
			}
		},

	};
</script>

<style lang="scss">
	.quotation {

		.content{
			padding: 0 32upx;
			.image{
				padding-top: 168upx;
				width: 257upx;
				height: 225upx;
				margin: 0 214upx;
				margin-bottom: 50upx;
				image{
					height: 259upx;
					width:100% ;
				}
				.position{
					width: 100%;
					display: flex;
					flex-direction: column;
					align-items: center;
					.top{
						height:50upx;
						font-size:28upx;
						font-weight:400;
						line-height:50upx;
						color:#999999;
						opacity:0.8;
					}
					.bottom{
						height:80upx;
						font-size:46upx;
						font-family:DIN;
						font-weight:900;
						line-height:80upx;
						color:#2ABAC2;
						text{
							font-size: 32upx;
						}
					}
				}
			}
			.tips_text{
				padding: 0 30upx;
				text-align: center;
				font-size:32upx;
				font-weight:400;
				line-height:50upx;
				color:rgba(216,80,80,1);
				margin-top: 385upx;
			}
			.btn{
				width:360upx;
				height:88upx;
				line-height: 88upx;
				border:1upx solid rgba(42,186,194,1);
				border-radius:44upx;
				text-align: center;
				font-size:32upx;
				font-weight:400;
				color:rgba(42,186,194,1);
				margin-left: 162upx;
				margin-top: 110upx;
			}
			.bottom_bottom{
				display: flex;
				align-items: center;
				margin-top: 118upx;
				.left{
					image{
						width: 140upx;
						height: 140upx;
						margin-left: 68upx;
					}
				}
				.right{
					margin-left: 50upx;
					text-align: center;
					.email{
						font-size:28upx;
						font-weight:400;
						color: #999999;
					}
					.email-tips{
						margin-top: 10upx;
						color:rgba(42,186,194,1);
					}
				}
			}
			
		}
	}
</style>
