<template>
	<view class="agreenment">
		<uni-title class="nav">
			<view slot="left" @click="back()" class="nav-left"><image src="/static/center/backGray.png" mode=""></image></view>
			<view slot="center" class="tab-bar" style="font-size: 18px;">{{ data.agreement }}</view>
		</uni-title>
		<view class="rich-text">
			<rich-text :nodes="content"></rich-text>
		</view>
	</view>
</template>

<script>
	var _self
	export default {
		data() {
			return {
				content:'',
				data:getApp().globalData.data.login,
				category_id:16
			}
		},
		onLoad() {
			_self = this
			let industry = uni.getStorageSync('industry');
			if(industry.name=="chinese"){
				this.data = this.$chinese[0].login
			}else{
				this.data = this.$chinese[1].login
			}
			_self.getAgreenment()
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			getAgreenment() { 
				_self.$ajax({
					title: "",
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
						uni.hideLoading();
						if (code == 1) {
							_self.content = data.content
							console.log(_self.content);
						} else {
							uni.showToast({
								title: msg,
								icon: 'none'
							})
						}
					}
				
				})
			},
		}
	}
</script>

<style lang="less" scoped>
	.agreenment{
		padding: 0 32upx;
		font-size: 26upx;
	}
	.content{
		width: 100%;
		// min-height: 1246upx;
		padding: 28upx;
		box-sizing: border-box;
		display:block;
		word-break: break-all;
		word-wrap: break-word;
	}
	.rich-text{
		margin-top: 150upx;
	}
</style>
