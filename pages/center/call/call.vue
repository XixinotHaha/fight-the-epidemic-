<template>
	<view class="container">
		<view  class="cu-item arrow">
			<view class="content" v-for="item in list" :key="item" @tap="call">
				<view style="display:flex">
					<view class="img">
						<image src="../../../static/img/index/call.png" mode=""></image>
					</view>
					<text   class="text-grey">{{item.call}}</text>
				</view>
				<image  style="margin-right:20upx;width:14upx;height:24upx;"  src="../../../static/img/index/big.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[{
					id:1,
					call:31541351
				},
				{
					id:2,
					call:13546987521
				}
				]
			}
		},
		methods: {
			call(){
				uni.makePhoneCall({
				    phoneNumber: '114'//拨打电话
				});
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 0;
		margin-top: 50upx;
		background-color: #fff;
		border-radius: 38upx 38upx 0upx 0upx;
		.content {
			padding: 0upx 20upx 30upx 20upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 34upx !important;
			color: rgba(91, 91, 91, 1) !important;
			border-bottom:1upx solid rgba(247,247,247,1);
			.img{
				width:80upx;
				height:80upx;
				background: #000000;
				border-radius: 50%;
				position: relative;
				image {
					width: 50upx;
					height: 50upx;
					margin-right: 42upx !important;
					position: absolute;
					top:14upx;
					left:14upx;
					
				}
			}
			
			.text-grey {
				line-height:84upx;
				margin-left:30upx;
			}
		}
	}
</style>
