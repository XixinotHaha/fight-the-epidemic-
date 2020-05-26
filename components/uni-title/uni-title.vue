<template>
	<view>
		<view class="title-contents">
			<view class="top-view status" :style="'height:' + statusBarHeight + 'px'"></view>
			<view class="_top title-view">
				<view class="title-view_side left">
					<!-- <view class="title-view_but" @click="onback"></view> -->
					<slot name="left"></slot>
				</view>
				<view class="title-view_center">
					<text class="center_name" v-if="name_text">{{name_text}}</text>
					<slot name="center" v-else></slot>
				</view>
				<view class="title-view_side right">
					<slot name="right"></slot>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	let _this;
	export default {
		name:"uniTitle",
		props:{
			name:{
				type:String,
				default:""
			}
		},
		data() {
			return {
				statusBarHeight: '0',
				name_text:this.name
			};
		},
		created() {
			_this = this;
			let { statusBarHeight, windowHeight, screenHeight } = uni.getSystemInfoSync();
			_this.statusBarHeight = statusBarHeight;
		},
		methods:{
			onback(){
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
		
</script>

<style scoped>
/* 主盒子 */
	.title-contents {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		z-index: 999;
	}
	/* 状态栏 */
	.title-contents .status {
		width: 100vw;
		height: var(--status-bar-height);  
		background-color: #fff;
	}
	/* 导航栏主体 */
	.title-contents .title-view {
		position: relative;
		background-color: #fff;
		width: 100vw;
		padding: 0 32upx 0 32upx;
		height: 44px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	/* 导航栏左右两边 */
	.title-contents .title-view_side{
		/* width: 100upx; */
		height: 100%;
		display: flex;
		align-items: center;
		flex-direction: row;
	}
	/* 返回按钮 */
	.title-contents .title-view_but {
		background: url(~@/static/public/icon-back.png) no-repeat;
		background-size: 100% 100%;
		width: 19upx;
		height: 36upx;
	}
	/* 主体内容 */
	.title-contents .title-view_center{
		flex: 1;
		height: 100%;
		padding: 0 20upx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.title-contents .center_name{
		font-weight: 700;
		font-size: 16px;
		line-height: 30px;
		text-align: center;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>
