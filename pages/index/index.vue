<template>
	<view class="container">
		<uni-title>
			<view slot="left">
				<view class="nav-l" @tap="toUserCenter">
					<view class="address-img"><image :src="user.avatar || '/static/public/morentouxiang.png'" mode=""></image></view>
					<view class="province" @tap="toLogin">{{ user.username || data.pleaseLogin}}</view>
				</view>
			</view>
			<view slot="right">
				<view class="nav-r" @tap="toShow">
					<view class="news-img"><image src="/static/index/diandiandian.png" mode=""></image></view>
				</view>
			</view>
		</uni-title>
		<!-- 左边个人中心遮罩 -->
		<view v-show="maskLayerCenter" class="mask-layer" @tap="hideMaskLayer">
			<view class="user-center">
				<view class="userInfo">
					<image src="/static/index/guan.png" mode=""></image>
					<view class="bottom">{{ data.Ltitle }}</view>
				</view>
				<view class="padding">
					<view class="nav_list color-gray radius">
						<view class="cu-list menu" style="padding-top:40upx;">
							<view @tap.stop="toPage('user_info')" class="cu-item " >
								<view class="content">
									<image src="/static/index/geren.png" mode=""></image>
									<text class="text-grey">{{data.personalData}}</text>
								</view>
							</view>
							<view @tap.stop="toPage('case_report')" class="cu-item " >
								<view class="content">
									<image src="/static/index/bingli.png" mode=""></image>
									<text class="text-grey">{{data.myCase}}</text>
								</view>
							</view>

							<view @tap.stop="toPage('feedback')" class="cu-item ">
								<view class="content">
									<image src="/static/index/fankui.png" mode=""></image>
									<text class="text-grey">{{data.feedback}}</text>
								</view>
							</view>

							<view @tap.stop="toPage('contact')" class="cu-item ">
								<view class="content">
									<image src="/static/index/lianxi.png" mode=""></image>
									<text class="text-grey">{{data.contact}}</text>
								</view>
							</view>

							<view @tap.stop="toPage('setting')" class="cu-item " >
								<view class="content">
									<image src="/static/index/shezhi.png" mode=""></image>
									<text class="text-grey">{{data.setting}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 右边分享遮罩 -->
		<view v-show="maskLayer" class="mask-layer" @tap="hideMaskLayer">
			<view class="up-down">
				<image src="/static/index/up-down.png" mode=""></image>
				<view class="list">
					<view class="" @tap.stop="toPage('message')">{{ data.platformMes }}</view>
					<view class="" @tap.stop="toPage('about_patforml')">{{ data.aboutPlatform }}</view>
					<view class="" @tap.stop="toPage('writequotation')">{{ data.shareApp }}</view>
					<view class="" @tap.stop="toPage('logout')" v-if="user">{{ data.logout }}</view>
					<view class="" @tap.stop="toLogin" v-else>{{ data.pleaseLogin }}</view>
				</view>
			</view>
		</view>
		<!-- 轮播图 -->
		<view class="carousel">
			<swiper class="swiper" :indicator-active-color="indicator_active_color" :indicator-dots="true" :autoplay="true" :interval="4000" :duration="1000" :circular="true">
				<swiper-item v-for="(item, index) of carouselList" :key="index">
					<image lazy-load="true" style="width: 100%; height: 400upx;" :src="item.image" @tap="toBannerDetail(item)"/>
				</swiper-item>
			</swiper>
		</view>
		<view class="help-check">
			<view class="top">
				<view class="title">
					<image src="/static/index/icon.png" mode=""></image>
					<text>{{data.Ltitle}}</text>
				</view>
				<view class="tips">{{data.indexTip}}</view>
			</view>
			<view class="bottom">
				<view class="title">{{data.inputSource}}</view>
				<view class="cu-list">
					<view class="cu-item ">
						<view class="content" style="display: flex;justify-content: space-between;">
							<text class="text-grey">{{data.checkHospital}}</text>
							<input type="text" class="input" v-model="check_Hospital"  name="mobile"  :placeholder="data.inputHospital" placeholder-class="placeholder" style="text-align: right;"></input>
						</view>
					</view>
					<view class='cu-item arrow'>
						<view class="content" style="display: flex;justify-content: space-between;">
							<text class="text-grey">{{data.checkDate}}</text>
							<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
								<view class="inputs">{{checkDate}}</view>
							</picker>
						</view>
					</view>
					<view class='cu-item'>
						<view class="content" style="display: flex;justify-content: space-between;">
							<text class="text-grey">{{data.contactWay}}</text>
							<input type="number" class="input" v-model="contact_Way" name="mobile"  :placeholder="data.inputContactWay"  placeholder-class="placeholder" style="text-align: right;"></input>
						</view>
					</view>
				</view>
				<view class="buttons" @tap="toCaseInput">{{data.indexBtn}}</view>
			</view>
		</view>
		<!-- 去填写临床症状页 -->
		<view class="check_basic" @tap="toPage('check_basic')">{{data.check_basic}}</view>
		<uni-popup ref="popup" type="center" class="del_draft">
			<view class="title">
				{{data.popupsTips}}
			</view>
			<view class="title" style="font-size: 36upx;">
				{{data.logoutAsk}}
			</view>
			<view class="button">
				<button class="current" @tap="closePopup" plain="true">{{data.notSure}}</button>
				<button @tap="logoutPopup" plain="true">{{data.sure}}</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
var _self;

export default {
	
	data() {
		const currentDate = this.getDate({
			format: true
		})
		return {
			data: getApp().globalData.data.index,
			user: {},
			carouselList: ['/static/index/swiper.png'], //轮播图
			trade: '',
			url: '../../static/index/cable.png',
			indicator_active_color: '#2ABAC2',
			industry: '',
			maskLayer: false,
			maskLayerCenter: false,
			checkDate:"",
			date: currentDate,
			check_Hospital:"",
			contact_Way:"",
		};
	},
	computed: {
		startDate() {
			return this.getDate('start');
		},
		endDate() {
			return this.getDate('end');
		}
	},
	beforeCreate() {
		let industry = uni.getStorageSync('industry');
	},
	onLoad() {
		_self = this;
		uni.hideTabBar()
		_self.user = uni.getStorageSync('USERINFO');
		let industry = uni.getStorageSync('industry');
		if(industry.name=="chinese"){
			this.data = this.$chinese[0].index
		}else{
			this.data = this.$chinese[1].index
		}
		this.checkDate = this.data.selectDate
		_self.bannerlist();
	},
	onShow() {
		_self.user = uni.getStorageSync('USERINFO');
		let industry = uni.getStorageSync('industry');
		if(industry.name=="chinese"){
			this.data = this.$chinese[0].index
		}else{
			this.data = this.$chinese[1].index
		}
		this.checkDate = this.data.selectDate
	},
	methods: {
		toShow() {
			this.maskLayer = true;
		},
		hideMaskLayer() {
			this.maskLayer = false;
			this.maskLayerCenter = false;
		},
		toUserCenter() {
			this.maskLayerCenter = true;
		},
		toLogin(){
			_self.$Router.push({
				name: 'login',
				params: {}
			});
		},
		toBannerDetail(item){
			console.log(item.id);
			_self.$Router.push({
				name: 'banner_detail',
				params: {
					url:item.url
				}
			});
		},
		toPage(type){
			if(type == "logout"){
				this.$refs.popup.open();
				this.maskLayer = false;
				return
			}
			this.$Router.push({
				name: type,
				params: {
				}
			});
			this.maskLayer = false;
		},
		closePopup() {
			this.$refs.popup.close();
		},
		logoutPopup() {
			this.$refs.popup.close();
			uni.removeStorageSync('USERINFO');
			this.$Router.replaceAll({
				name: "login",
				params: {}
			});
		},
		bindDateChange(e) {
			this.checkDate = e.target.value
			console.log(this.checkDate);
		},
		getDate(type) {
			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();
		
			if (type === 'start') {
				year = year - 60;
			} else if (type === 'end') {
				year = year + 2;
			}
			month = month > 9 ? month : '0' + month;;
			day = day > 9 ? day : '0' + day;
			return `${year}-${month}-${day}`;
		},
		//轮播图
		bannerlist() {
			_self.$ajax({
				path: _self.$api.banner,
				data: {},
				success(res) {
					let { data, code, msg } = res.data;
					_self.carouselList = data;
				}
			});
		},
		toCaseInput(){
			// if (this.check_Hospital== '') {
			// 	uni.showToast({
			// 		title: this.data.inputHospital,
			// 		icon: 'none'
			// 	});
			// 	return false;
			// }
			// if (this.checkDate == '') {
			// 	uni.showToast({
			// 		title: this.data.selectDate,
			// 		icon: 'none'
			// 	});
			// 	return false;
			// }
			// if (this.contact_Way == '') {
			// 	uni.showToast({
			// 		title: this.data.inputContactWay,
			// 		icon: 'none'
			// 	});
			// 	return false;
			// }
			let formData = {
				check_Hospital: this.check_Hospital,
				checkDate: this.checkDate,
				contact_Way: this.contact_Way,
			};
			setTimeout(() => {
				// 跳转到填写全部数据页
				_self.$Router.push({
					name: 'case_input',
					params: formData
				});
			}, 1000);
			
		}
		
	}
};
</script>

<style lang="scss" scoped>
.carousel {
	width: 100%;
	height: 360upx;
	margin-top: 180upx;
	.swiper {
		width: 90%;
		margin: 0 5%;
		height: 360upx;
		
		swiper-item{
			border-radius: 20upx;
			image{
				border-radius: 20upx;
			}
		}
	}
}
.nav-l {
	display: flex;
	justify-content: space-between;
	text-align: center;

	.address-img {
		width: 66upx;
		height: 66upx;
		margin-right: 20upx;
		image {
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}
	}
	.province {
		height: 66upx;
		font-size: 34upx;
		font-weight: 400;
		line-height: 66upx;
		color: rgba(51, 51, 51, 1);
	}
}
.nav-r {
	display: flex;
	justify-content: flex-end;
	width: 128upx;

	.news-img {
		width: 40upx;
		height: 40upx;
		position: relative;

		image {
			width: 100%;
			height: 100%;
		}
	}
}
.check_basic{
	position: fixed;
	background: linear-gradient(313deg, rgba(42, 186, 194, 1) 0%, rgba(91, 206, 213, 1) 100%);
	top: 740upx;
	right: 0;
	padding: 20upx;
	border-radius: 40upx 0 0 40upx;
	color: #fff;
}
.mask-layer {
	position: fixed;
	top: 0;
	width:100%;
	height: 100%;
	background: rgba(102, 102, 102, 0.2);
	z-index: 99999;

	.up-down {
		position: absolute;
		top: 95upx;
		right: 18upx;
		width: 240upx;
		height: 423upx;
		image {
			width: 100%;
			height: 100%;
		}

		.list {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			padding: 40upx 20upx;
			view {
				width: 100%;
				height: 85upx;
				line-height: 95upx;
				text-align: center;
			}
		}
	}
}
.user-center {
	width: 660upx;
	.userInfo {
		width: 660upx;
		height: 510upx;
		background: linear-gradient(313deg, rgba(42, 186, 194, 1) 0%, rgba(91, 206, 213, 1) 100%);
		opacity: 1;
		image {
			width: 253upx;
			height: 258upx;
			margin-top: 90upx;
			margin-left: 220upx;
		}
		.bottom {
			width: 100%;
			text-align: center;
			line-height: 88upx;
			height: 88upx;
			color: rgba(255, 255, 255, 1);
			font-size: 32upx;
			margin-top: 30upx;
		}
	}

	.padding {
		padding: 0;
		margin-top: -50upx;
		background-color: #ffffff;
		width: 660upx;
		height: calc(100vh - 510upx + 50upx);
		border-radius: 30upx 30upx 0px 0px;
		.select {
			height: 40upx;
			font-size: 28upx;
			font-weight: 400;
			line-height: 40upx;
			color: rgba(51, 51, 51, 1);
			text-align: center;
			margin-top: 88upx;
			margin-bottom: 48upx;
		}
		.zhongwen,
		.yingwen,
		.submit {
			width: 406upx;
			height: 88upx;
			background: rgba(255, 255, 255, 1);
			border: 1px solid rgba(112, 112, 112, 1);
			border-radius: 44upx;
			margin-left: 172upx;
			line-height: 88upx;
			text-align: center;
		}
		.yingwen {
			margin-top: 40upx;
		}
		.submit {
			background: rgba(42, 186, 194, 1);
			border: 1px solid rgba(42, 186, 194, 1);
			margin-top: 80upx;
		}
		.current {
			background: rgba(232, 247, 248, 1);
			border: 1upx solid rgba(35, 158, 165, 1);
		}
	}
}
.cu-item{
	height: 90upx;
	.input{
		color: grey;
	}
	.inputs{
		color: grey;
		font-size: 28upx;
		text-align: right;
	}
	.placeholder{
		font-size: 24upx;
	}
	.content {
		height: 109upx;
		align-items: center;
	}
	
	.text-grey {
		width: 200upx;
		color: #333333;
		font-size: 32upx;
		font-weight:500;
	}
}
.help-check{
	padding: 0 32upx;
	margin-top: 56upx;
	.top{
		.title{
			image{
				width: 42upx;
				height: 38upx;
				margin-right:20upx
			}
			text{
				height:59upx;
				font-size:42upx;
				font-weight:600;
				color:rgba(51,51,51,1);
			}
		}
		.tips{
			font-size:28upx;
			font-weight:400;
			color:rgba(153,153,153,1);
			margin-top: 18upx;
		}
		
	}
	.bottom{
		padding: 0 24upx;
		.title{
			margin-top: 80upx;
			margin-bottom: 40upx;
			font-size:28upx;
			font-weight:400;
			line-height:24px;
			color:rgba(153,153,153,1);
		}
	}
}
.buttons{
	height:88upx;
	line-height: 88upx;
	text-align: center;
	background:rgba(42,186,194,1);
	border-radius:44upx;
	margin: 85upx 0;
	font-size:32upx;
	font-weight:400;
	color:rgba(255,255,255,1);
}
	.del_draft {
		display: flex;
		flex-direction: column;

		.title {
			line-height: 80upx;
			height: 80upx;
			width: 100%;

			&:nth-child(1) {
				line-height: 80upx;
				height: 80upx;
			}
		}

		.button {
			display: flex;
			flex-direction: row;
			width: 100%;
			margin-top: 20upx!important;
			button {
				border: none;
				border-top: 1upx solid #B2B2B2;
				width: 50%;
				line-height: 100upx;
				height: 100upx;
				font-size: 36upx;
				color: #333333 !important;
				background-color: #FFF;
				border-radius: 0 !important;
				&:nth-child(2) {
					border-left: 1upx solid #B2B2B2;
					color: #2ABAC2 !important;
				}
			}
		}
	}

</style>
