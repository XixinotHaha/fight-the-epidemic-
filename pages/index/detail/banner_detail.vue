<template>
	<view class="page">
		<web-view :src="url"></web-view>
	</view>
</template>
<script>
var _self;
export default {
	data() {
		return {
			url:"",
		};
	},
	onLoad() {
		_self = this, 
		_self.url = _self.$Route.query.url; //外网地址

	},
	onShow() {
	},
	methods: {
		back() {
			uni.navigateBack({
				delta: 1
			});
		},
	}
};
</script>

<style lang="scss" scoped>
	.page{
		// margin-bottom: 100upx;
	}
	web-view{
		padding-bottom: 100upx;
	}
</style>
