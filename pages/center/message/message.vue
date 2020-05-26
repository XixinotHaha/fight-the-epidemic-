<template>
	<view class="my-message">
		<uni-title class="nav">
			<view slot="left" @click="back()" class="nav-left"><image src="/static/center/backGray.png" mode=""></image></view>
			<view slot="center" class="tab-bar" style="font-size: 18px;">{{ data.platformMes }}</view>
		</uni-title>
		<view class="big-box">
			<view class="all_not" v-if="list.length==0">
				<image src="/static/mescroll-empty.png" mode=""></image>
				<!-- <view class="">暂无相关数据</view> -->
			</view>
			<view class="box"  v-for="(item,index) in list" :key="index">
				<view class="time">{{item.createtime}}</view>
				<view class="message" @click="toMessageDetail(item.id)">
					<view class="top">
						<view class="title">{{item.title}}</view>
					</view>
					<!-- <view class="content" v-html="item.content"></view> -->
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
				list: []
			}
		},
		onLoad() {
			_self = this
			let industry = uni.getStorageSync('industry');
			if (industry.name == 'chinese') {
				this.data = this.$chinese[0].index;
			} else {
				this.data = this.$chinese[1].index;
			}
			_self.message()
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			//系统消息
			message() {
				_self.$ajax({
					path: _self.$api.getSystemMsg,
					data: {},
					success(res) {
						let {
							data,
							code,
							msg
						} = res.data;
						_self.list = data; //数据
						console.log(_self.list);
					}
				});

			},
			toMessageDetail(id){
				this.$Router.push({
					name: "message_detail",
					params: {
						id:id
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	page{
		height: 100%;
		background-color: #F8F8F8;
	}
	.my-message {
		padding-bottom: 40upx;
	}
	.big-box{
		margin-top: 150upx;
	}
	.time{
		height:33upx;
		font-size:24upx;
		font-weight:400;
		line-height:33upx;
		text-align: center;
		color:rgba(153,153,153,1);
	}

	.message {
		background: rgba(255, 255, 255, 1);
		// box-shadow: 0upx 1upx 20upx rgba(0, 0, 0, 0.1);
		opacity: 1;
		border-radius: 16upx;
		margin: 32upx 0;
		padding: 30upx 50upx;

		.top {
			.title {
				font-size: 28upx;
				font-weight: 500;
				line-height: 45upx;
				color: rgba(51, 51, 51, 1);
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2; //行数需设置    
				line-clamp: 2;
				-webkit-box-orient: vertical;
				
			}

			.time {

				font-size: 26upx;
				font-weight: 400;
				line-height: 37px;
				color: rgba(191, 191, 191, 1);
			}
		}

		.content {
			font-size: 28upx;
			font-weight: 400;
			line-height: 50upx;
			color: rgba(102, 102, 102, 1);
			margin-top: 20upx;
			max-height: 100upx;
			text-overflow: -o-ellipsis-lastline;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2; //行数需设置    
			line-clamp: 2;
			-webkit-box-orient: vertical;
		}

	}
</style>
