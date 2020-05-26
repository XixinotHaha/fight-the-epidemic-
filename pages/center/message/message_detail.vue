<template>
	<view class="content">
		<uni-title class="nav">
			<view slot="left" @click="back()" class="nav-left"><image src="/static/center/backGray.png" mode=""></image></view>
			<view slot="center" class="tab-bar" style="font-size: 18px;">{{ data.platformMesDet }}</view>
		</uni-title>
		<view class="info-detail">
			<view class="title">
				{{province.title}}
			</view>
			<view class="time">
				{{province.createtime}}
			</view>
			<view class="content" v-html="province.content"></view>
		</view>
	</view>
</template>

<script>
	var _self;
	export default {
		data() {
			return {
				province: {},
				data: getApp().globalData.data.index,
			}
		},
		onLoad() {
			_self = this;
			_self.id = _self.$Route.query.id
			console.log(_self.id);
			let industry = uni.getStorageSync('industry');
			if (industry.name == 'chinese') {
				this.data = this.$chinese[0].index;
			} else {
				this.data = this.$chinese[1].index;
			}
			_self.info_detail()
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			info_detail() {
				_self.$ajax({
					path: _self.$api.getmsg_detail,
					data: {
						msg_id: _self.id,
					},
					success(res) {
						let {
							data,
							code,
							msg
						} = res.data;
						_self.province = data
					}
				})
			}
		}

	}
</script>

<style lang="scss" scoped>
	.info-detail {
		padding: 32upx;
		margin-top: 120upx;
		.title {
			line-height: 60upx;
			font-size: 34upx;
			font-weight: bold;
			line-height: 50upx;
			color: rgba(51, 51, 51, 1);
		}

		.time {
			font-size: 26upx;
			font-weight: 400;
			line-height: 50upx;
			color: rgba(153, 153, 153, 1);
			margin: 20upx 0;
		}

		.image {
			width: 100%;

			image {
				width: 100%;
			}
		}

		.content {
			font-size: 28upx;
			font-weight: 400;
			line-height: 48upx;
			color: rgba(51, 51, 51, 1);
			margin: 32upx 0;
		}
	}
</style>
