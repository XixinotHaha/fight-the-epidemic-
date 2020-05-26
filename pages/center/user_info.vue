<template>
	<view class="grace-body">
		<view class="grace-form grace-margin-top">
			<uni-title class="nav">
				<view slot="left" @click="back()" class="nav-left">
					<image src="/static/center/backGray.png" mode=""></image>
				</view>
				<view slot="center" class="tab-bar" style="font-size: 18px;">
					{{data.userInfo}}
				</view>
				<view slot="right" style="color:#2ABAC2 ;" @click="formSubmit" v-if="page_type==1">{{data.save}}</view>
				<view slot="right" @click="editInfo" v-if="page_type==0">{{data.edit}}</view>
			</uni-title>
			<view class="head_list cu-list menu" style="padding-top:144upx;" @click.stop="upload">
				<view class="head-icon">
					<image :src="userImage || '/static/center/morenavatar.png'" mode=""></image>
					<view class="camera" v-if="page_type==1">
						<image src="/static/center/camera.png" mode=""></image>
					</view>
				</view>
			</view>
			<view class="cu-list">
				<view class="cu-item ">
					<view class="content" style="display: flex;justify-content: space-between;">
						<text class="text-grey">{{data.username}}</text>
						<input type="text" class="input" :disabled="disabled" maxlength="12" name="name" v-model="user.username"
						:placeholder="data.inputUsername" style="text-align: right;"></input>
					</view>
				</view>
				<view :class="['cu-item',disabled? '':'arrow' ]">
					<view class="content" style="display: flex;justify-content: space-between;">
						<text class="text-grey">{{data.sexT}}</text>
						<view class="sex-text" v-if="page_type==0">
							<text v-if="user.gender==1">{{data.sex[1]}}</text>
							<text v-if="user.gender==2">{{data.sex[2]}}</text>
						</view>
						<picker v-else @change="bindPickerChange" :value="sexIndex" :range="sex" name="sex">
							{{data.sex[sexIndex]}}
						</picker>
					</view>
				</view>
				<view class="cu-item ">
					<view class="content" style="display: flex;justify-content: space-between;">
						<text class="text-grey">{{data.contactWay}}</text>
						<input type="text" class="input" :disabled="disabled" name="mobile" v-model="user.mobile" :placeholder="data.mobile"
						 style="text-align: right;"></input>
					</view>
				</view>

				<view :class="['cu-item',disabled? '':'arrow' ]">
					<view class="content" style="display: flex;justify-content: space-between;"  @click="showMulLinkageThreePicker">
						<text class="text-grey">{{data.currentAddress}}</text>
						<input class="input" type="text" :value="pickerText.result|| '' " disabled  :placeholder="data.addressSelect" style="width: 100%;" />
					</view>
				</view>
			</view>
		</view>
		<w-picker :defaultVal="pickerText.checkArr || [0,0,0]" @confirm="onConfirm" ref="cityPicker" mode="region"></w-picker>
	</view>
</template>
<script>
	var _self;
	const Checker = require("@/common/js/formValidation.js")
	import wPicker from "@/components/w-picker/w-picker.vue";
	export default {
		components: {
			wPicker
		},
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				data: getApp().globalData.data.center,
				baseUrl : this.$req.baseuUrl,
				userImage: '',
				page_type: "",
				sexIndex: 0,
				user: {},
				birthday: '',
				sex: [],
				avatar_path: "",
				name: "点击选择",
				defaultVal: [1, 0, 0],
				city: "",
				disabled: true,
				index: '',
				province: [],
				provinceList: [], //要展示的数据
				region_id:'',
				date: currentDate,
				title:"",
				pickerText: {}, //所在地文本
			}
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		onLoad(option) {
			_self = this
			let industry = uni.getStorageSync('industry');
			if(industry.name=="chinese"){
				this.data = this.$chinese[0].center
			}else{
				this.data = this.$chinese[1].center
			}
			_self.sex = this.data.sex
			_self.title = this.data.userInfo
			this.getinfo();
			// 监听上传头像 
			uni.$on('upHeadImg', (data) => {
				console.log(data, '监听图片修改参数');
				this.userImage = data.path;
				console.log(this.userImage);
			})
		},
		methods: {
			back() {
				this.$Router.pushTab({
					name: "index",
					params:{}
				});
			},
			editInfo() {
				this.page_type = 1;
				this.disabled = false;
			},
			bindPickerChange(e) {
				this.sexIndex = e.detail.value;
				this.user.gender = Number(this.sexIndex)
				console.log(this.user.gender);
			},
			// 三级联动选择
			showMulLinkageThreePicker() {
				this.$refs.cityPicker.show()
			},
			onConfirm(e) {
				console.log(e)
				this.pickerText = e
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
			getinfo: function() {
				this.user = uni.getStorageSync('USERINFO');
				this.userImage = this.user.avatar
				this.pickerText.result = this.user.address
				this.sexIndex = this.user.gender
				if (!this.user) {
					uni.showToast({
						title: '请先登录',
						icon: "none"
					})
					setTimeout(function() {
						setTimeout(() => {
							_self.$Router.push({
								name: 'login',
								params: {}
							});
						}, 500)
					}, 1000)
				}
			},
			upload() {
				uni.chooseImage({
					count: 1, // 默认9
					sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success(res) {
						const src = res.tempFilePaths[0];
						uni.navigateTo({
							url: '/pages/center/upload?src=' + src
						});
					}
				});
			},

			formSubmit(e) { //form提交
				var formData = {
					usernames: this.user.username,
					phone: this.user.mobile,
					avatar: this.userImage,
					gender: this.user.gender,
					address: this.pickerText.result,
				}
				console.log(formData)
				//定义表单规则	
				if (formData.usernames.trim() == "" || formData.usernames.trim().length > 12) {
					uni.showToast({
						title: formData.usernames.trim() == "" ? this.data.nickName : this.data.nickNameRule,
						icon: "none"
					});
					return;
				}

				if (formData.gender == "0") {
					uni.showToast({
						title:  this.data.sexSelect,
						icon: "none"
					});
					return;
				}
				if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(formData.phone))) {
					uni.showToast(!formData.phone ? {
						title: this.data.mobile,
						icon: "none"
					} : {
						title: this.data.rightMobile,
						icon: "none"
					});
					return false;
				}
				if (formData.address == "") {
					uni.showToast({
						title: this.data.addressSelect,
						icon: "none"
					});
					return;
				}
				_self.$ajax({
					path: _self.$api.profile,
					data: formData,
					success(res) {
						let {
							data,
							code,
							msg
						} = res.data;
						uni.hideLoading();
						if (code == 1) {
							var userinfo = uni.getStorageSync('USERINFO');
							userinfo.avatar = formData.avatar;
							userinfo.gender = formData.gender;
							userinfo.username = formData.usernames;
							userinfo.mobile = formData.phone;
							userinfo.address = formData.address 
							console.log(userinfo)
							uni.setStorageSync('USERINFO', userinfo);
							_self.page_type = 0;
							_self.disabled = true;

						} else {
							uni.showToast({
								title: msg,
								icon: 'none'
							});
						}
					}

				})


			}
		},
	}
</script>
<style lang="scss">
	page {
		height: auto;
	}

	.picker {
		background: #00B26A;
		width: 100%;
		line-height: 40px;
		text-align: right;
	}

	.head_list {
		background: #fff;
		padding: 20rpx 0;
	}

	.head-icon {
		position: relative;
		margin: 50upx auto;
		width: 179upx;
		height: 179upx;
		border-radius: 50%;

		image {
			border-radius: 50%;
			width: 100%;
			height: 100%
		}
	}

	.camera {
		position: absolute;
		bottom: 0;
		right: 23upx;
		width: 44upx;
		height: 44upx;
		background-color: #333333;
		opacity: 0.86;
		border-radius: 50%;

		image {
			width: 40upx;
			height: 40upx;
			margin: 2upx;
		}
	}

	.cu-list {
		padding: 32upx;
		.cu-item{
			height:90upx
		}
		.content {
			height: 109upx;
			align-items: center;
		}

		.text-grey {
			height: 64upx;
			line-height: 64upx;
			color: #333333;
			font-size: 32upx;
		}
	
	}
	.btn {
		color: #fff;
		width: 90%;
		height: 90upx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #2abac2;
		font-size: 40upx;
		border-radius: 45upx;
		border: 1upx solid #2abac2;
		margin: 0 5%;
		margin-top: 80upx;
	}

	.out_login {
		margin-top: 50upx;
		background: #333 !important;
		color: #fff;
		text-align: center;
		border-radius: 45px;
	}

	.del_draft button {
		line-height: 150upx;
		height: 100upx;
		font-size: 28upx;
		border: none;
	}

	input,
	picker {
		font-size: 28upx;
		color: rgba(153, 153, 153, 1);
		height: 64upx;
		line-height: 64upx;
		flex: 1;
		margin-left: 30upx;
		text-align: right;
	}
	.uni-input{
		line-height: 64upx;
	}

	.input-detail {
		font-size: 28upx;
		color: rgba(153, 153, 153, 1);
		flex: 1;
		margin-left: 30upx;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}



	.sex-text {
		color: #999;
		font-size: 28upx;
		height: 64upx;
		line-height: 64upx;
	}
</style>
