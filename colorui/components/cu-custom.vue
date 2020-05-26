<template>
	<view>
		<view class="cu-custom" :style="[{height: (isFixed?'0':CustomBar) + 'px'}]">
			<view class="cu-bar fixed" :style="style" :class="[bgImage!=''?'none-bg text-white bg-img':'',bgColor]">
				<view class="action" @tap="BackPage" v-if="isBack">
					<text class="cuIcon-back"></text>
					<slot name="backText"></slot>
				</view>
				<view class="action" v-if="isBackText">
					<slot name="backText"></slot>
				</view>
				<view class="content" :style="[{top:StatusBar + 'px'}]">
					<slot name="content"></slot>
				</view>
				<slot name="right"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar
			};
		},
		name: 'cu-custom',
		computed: {
			style() {
				var StatusBar= this.StatusBar;
				var CustomBar= this.CustomBar;
				var bgImage = this.bgImage;
				var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
				if (this.bgImage) {
					style = `${style}background-image:url(${bgImage});`;
				}
				return style
			}
		},
		props: {
			bgColor: {		//作用在cu-bar上的类
				type: String,
				default: 'bg-gradual-theme'
			},
			isBack: {		//是否显示返回箭头和左边的文字
				type: [Boolean, String],
				default: false
			},
			isBackText: {	//开启显示左边的文字
				type: [Boolean, String],
				default: false
			}, 
			isFixed: {		//是否设置导航高度为 0
				type: [Boolean, String],
				default: false
			},
			bgImage: {		//导航背景图片
				type: String,
				default: ''
			},
		},
		methods: {
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			}
		}
	}
</script>

<style>
.bg-gradual-theme{
	background: linear-gradient(#4DB34A, #3E9E4D);
	color: #fff;
}
</style>
