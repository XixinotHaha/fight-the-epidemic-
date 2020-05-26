<template>
	<!-- 密码登录 -->
	<view>
		<view class="logo">
			<image mode="aspectFill" src="/static/center/LGlogo.png"></image>
		</view>
		<view class="form">
			<view class="username">
				<image src="/static/login/mobile.png" mode=""></image>
				<input type="number" placeholder="请输入手机号" maxlength="11" v-model="mobile" placeholder-style="color:#999999" />
			</view>
			<view class="code">
				<image src="/static/login/yanzheng.png" mode=""></image>
				<view class="get-code" :style="{ color: getCodeBtnColor }" @click.stop="getCode()">{{ getCodeText }}</view>
				<input placeholder="请输入验证码" maxlength="4" v-model="code" placeholder-style="color:#999999" />
			</view>
			<view class="res">
				<view @tap="toPage('login')" class="active-con">密码登录</view>
			</view>
			<view class="btn" @tap="doLogin">登 录</view>
			<view class="result">
				<view @tap="toPage('register')" class="active-con1">注册账号</view>
				<view class="line">|</view>
				<view @tap="toPage('resetpassword')" class="active-con2">忘记密码</view>
			</view>
		</view>
		<!-- 第三方登录 -->
		<!-- <view class="oauth" v-if="isShowOauth && hasFixed">
			<view class="text">——— 快速登录 ———</view>
			<view class="list">
				<view @tap="oauthLogin('weixin')" v-if="showProvider.weixin" class="weixin">
					<image src="/static/login/weixin.png" mode="" />
				</view>
				<view @tap="oauthLogin('qq')" v-if="showProvider.qq" class="weixin">
					<image src="/static/login/qq.png" mode="" />
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	var _self
	export default {
		data() {
			return {
				mobile: '',
				code: '',
				// isShowOauth: false,
				isShowOauth: true,
				showProvider: {
					weixin: true,
					qq: true,
					sinaweibo: false,
					xiaomi: false
				},
				windowHeight: '', //设备高度
				hasFixed: true, // 是否显示底部定位元素
				getCodeText: '获取验证码',
				getCodeBtnColor: '#2ABAC2',
				getCodeisWaiting: false,
				code_id: 0,
				province: '',
				industry: ''
			};
		},
		onLoad() {
			_self = this
		},
		methods: {
			oauthLogin(provider) {
				uni.showLoading({
					title: '请稍等'
				});
				uni.login({
					provider: provider,
					success: loginRes => {
						console.log(loginRes);
						uni.getUserInfo({
							provider: provider,
							success: async infoRes => {
								console.log(infoRes, '第三方登录');
								if (provider == 'weixin') {
									_self.$ajax({
										path: _self.$api.third_login,
										data: {
											type: provider,
											open_key: infoRes.userInfo.openId
										},
										success(res) {
												let {
													data,
													code,
													msg
												} = res.data;
											if (code == 1) {
												console.log(msg);
												uni.showToast({
													title: msg
												});
												uni.setStorageSync('USERINFO', data.userinfo);
												_self.$req.defaultReq.baseData["token"] = data.userinfo.token;
												_self.province = uni.getStorageSync('user_address').id;
												_self.industry = uni.getStorageSync('industry').id;
												if (data.userinfo.province == 0 || data.userinfo.industry == 0) {
													_self.updateFiledValues()
												} else {
													let province = uni.getStorageSync('user_address')
													let industry = uni.getStorageSync('industry')
													province = data.userinfo.province_name
													industry = data.userinfo.industry_name
													uni.setStorageSync('user_address', province);
													uni.setStorageSync('industry', industry);
												}
												_self.$Router.pushTab({
													name: "index",
													params:{}
												});
											}
										},
										fail(res){
											console.log(res);
											uni.setStorageSync('wechatinfo', infoRes.userInfo);
											_self.$Router.push({
												name: 'bind_account',
												params: {
													type: 'weixin'
												}
											});
										}
									});
								} else if (provider == "qq") {
									_self.$ajax({
										path: _self.$api.third_login,
										data: {
											type: provider,
											open_key: infoRes.userInfo.openId
										},
										success(res) {
												let {
													data,
													code,
													msg
												} = res.data;
											if (code == 1) {
												console.log(msg);
												uni.showToast({
													title: msg
												});
												uni.setStorageSync('USERINFO', data.userinfo);
												_self.$req.defaultReq.baseData["token"] = data.userinfo.token;
												_self.province = uni.getStorageSync('user_address').id;
												_self.industry = uni.getStorageSync('industry').id;
												if (data.userinfo.province == 0 || data.userinfo.industry == 0) {
													_self.updateFiledValues()
												} else {
													let province = uni.getStorageSync('user_address')
													let industry = uni.getStorageSync('industry')
													province = data.userinfo.province_name
													industry = data.userinfo.industry_name
													uni.setStorageSync('user_address', province);
													uni.setStorageSync('industry', industry);
												}
												_self.$Router.pushTab({
													name: "index",
													params:{}
												});
											}
										},
										fail(res){
											console.log(res);
											uni.setStorageSync('wechatinfo', infoRes.userInfo);
											_self.$Router.push({
												name: 'bind_account',
												params: {
													type: 'qq'
												}
											});
										}
									});
								}
							}
						});
					},
					fail: e => {
						uni.hideLoading();
						let filesfrom = e.errMsg.substring(17, 11);
						uni.showToast({
							title: filesfrom,
							icon: 'success'
						});
						console.log('fail: ' + JSON.stringify(e));
					}
				});
			},
			// 获取验证码
			async getCode() {
				uni.hideKeyboard();
				if (this.getCodeisWaiting) {
					return;
				}
				if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.mobile)) {
					uni.showToast(
						!this.mobile ? {
							title: '请输入手机号码',
							icon: 'none'
						} : {
							title: '请填写正确手机号码',
							icon: 'none'
						}
					);
					return false;
				}
				this.getCodeText = '发送中...';
				this.getCodeisWaiting = true;
				this.getCodeBtnColor = 'rgba(0,0,0,0.5);';
				_self.$ajax({
					title: "",
					path: _self.$api.send_code,
					data: {
						mobile: this.mobile,
						event: "login"
					},
					success(res) {
						let {
							data,
							code,
							msg
						} = res.data;
						uni.hideLoading();
						if (code == 1) {
							_self.code_id = 1;
							_self.setTimer();
							uni.showToast({
								title: msg,
								icon: "none"
							});
						} else {
							uni.showToast({
								title: msg,
								icon: "none"
							});
						}
					},
					fail(res) {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						})
						_self.getCodeText = '获取验证码';
						_self.getCodeBtnColor = "#2ABAC2";
						_self.getCodeisWaiting = false;
					}
				})
			},
			setTimer() {
				let holdTime = 60;
				this.getCodeText = '重新获取(60)';
				this.Timer = setInterval(() => {
					if (holdTime <= 0) {
						this.getCodeisWaiting = false;
						this.getCodeBtnColor = '#2ABAC2 ';
						this.getCodeText = '获取验证码';
						clearInterval(this.Timer);
						return;
					}
					this.getCodeText = '重新获取(' + holdTime + ')';
					holdTime--;
				}, 1000);
			},
			doLogin() {
				uni.hideKeyboard();
				//模板示例部分验证规则
				if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.mobile)) {
					uni.showToast({
						title: '请填写正确手机号码',
						icon: 'none'
					});
					return false;
				}

				if (!this.code_id) {
					uni.showToast({
						title: '请先获取验证码',
						icon: 'none'
					});
					return false;
				}

				if (!this.code) {
					uni.showToast({
						title: '请输入验证码',
						icon: 'none'
					});
					return false;
				}

				uni.showLoading({
					title: '提交中...'
				});
				const userdata = {
					mobile: this.mobile,
					captcha: this.code,
					//#ifdef APP-PLUS
					uuid: plus.device.uuid
					//#endif
				};
				_self.$ajax({
					title: "",
					path: _self.$api.code_login,
					data: userdata,
					success(res) {
						let {
							data,
							code,
							msg
						} = res.data;
						uni.hideLoading();
						if (code == 1) {
							uni.setStorageSync('USERINFO', data.userinfo);
							_self.$req.defaultReq.baseData["token"] = data.userinfo.token;
							_self.province = uni.getStorageSync('user_address').id;
							_self.industry = uni.getStorageSync('industry').id;
							if (data.userinfo.province == 0 || data.userinfo.industry == 0) {
								_self.updateFiledValues()
							} else {
								let province = uni.getStorageSync('user_address')
								let industry = uni.getStorageSync('industry')
								province = data.userinfo.province_name
								industry = data.userinfo.industry_name
								uni.setStorageSync('user_address', province);
								uni.setStorageSync('industry', industry);
							}
							_self.$Router.replaceAll({
								name: 'index',
								params: {}
							});
						} else {
							uni.showToast({
								title: msg,
								icon: 'none'
							});
						}
					}

				})
			},
			// 选择行业和省份
			updateFiledValues() {
				_self.$ajax({
					path: _self.$api.update_filed_values,
					data: {
						province: _self.province_id, //地区
						industry: _self.industry_id, //行业
					},
					success(res) {
						let {
							data,
							code,
							msg
						} = res.data;
						console.log(data);
					}
				});

			},
			toPage(page) {
				uni.hideKeyboard();
				if (page == 'login') {
					uni.redirectTo({
						url: page
					});
					return
				}
				uni.navigateTo({
					url: page
				})

			},
			toIndex(page) {
				uni.hideKeyboard();
				uni.switchTab({
					url: page
				});
			}
		}
	};
</script>
<style lang="scss">
	@font-face {
		font-family: 'HMfont-login';
		src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAVwAAsAAAAACiwAAAUhAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDMgqHTIY+ATYCJAMUCwwABCAFhG0HRhvICBEVpCGR/UgwbhrPeq6LhESdqBKaSN/kw79n/bk3aCYZKO1yZCbTFZBZqLv71CzRPvkPQPDEzrPbAAEEdy/nHLBRL1RJVpMf+cAnKX4Do/NzekpNyAm5/zlmunw+sPy2tUt22QBHAx5Q5EUGHvAdnfOh3DK8OuQd0OlAAIiIQw5IS1uPAgEstFUEAFmxdPFcCDE92AIcgaDigV1ZkBvBQaCH6csAbnB/nnyDIiIAFBwDbePAotYFaAjIY0OMFtTMsBEQdGcFwOwFMAByALAAWQfaV4Dx4zlgIEpRFg2A/DsBFDQgB2oDc8eGgkGQeEFKUZejCznt9o/HQ5OHYmxDggUCskkBBgjUUoAAgbkUoMDYkPDCyDliuQhABkgJQK6yyhT38BIY8CBxYSRMEkkMSSATwkJdISFRxmEK1/vOnrTzXjViHzwz8aKlGEYs2iibpmp+5ratsgWGNWLbfrapGoZCpmU/tfdypWk3P2UpyrXbL9yT7r9NuzXF7fWdOOu/rp+KJfM9J10u24o94tV0yTZj7Q1k2sNGbKz3FE7fJrlO6jZTvS8u0ZhJun8isa0RspKxyKuEe2NZXZZOEuakK+yhNyZTXZI887RY8YQzlSXpoBHeCI5wo155sye1OndEW2qmqrgfekbypF8gtj1yfSpZR24fvUPxWVJPRLG2DHcxzf7n0tWR1+x5R0CV6j3Gds3IOfkK9MdFr5Un3mk4rSddo6/Jd1vEsCbatsu6R7YZUv2mevIuRf9nThs/zvYVz49u+Zw5nLqge+KujIq2hXHLc265lFGtRqxMdB4ZW7GDGxWkhRXLMpfNnaPMmLeT8S2mw3TIt3Ynv5P1TWOGGMW3c6cDCdUbnElHp9An2M7UvfFrl9Se3Mpl2OsC/OPrLn+Z/t+8OYMbyc7EULKrYRH0H8RvBcrsPjrZH/r9uO9DFSlsbnuo+4UQU/18N/9U41O/hEONfOLyA79rcYXtbq65rDorfijy9epSZFw8fEWNBN4peoL0Ll7SS4QBfh0/4Jnj+Jabk3XpkHSMdxxyuKysOZ4BfiuXySHl2UXydcnnx30kioxf/vShfUSnz/oZraNzc1Nu0tJttfyZxEhcTaOb/Ofrls75Pu/7/A/zPvxwpc/TJ34YSpffeeM2qlH/jVhDV9gcvNONnb7ZJePd7ubF++dFqYkkt2sh8dkoHjBpXMs3De/mt/y3dmCZ8424T5Y6B9aQf4r8dxu+imujrYtcywuiBztmF7Bt/yXK7wSmVlUEpshvJ/7HthUAHPDGBa7l2AIACD6yMPolEHyG+Y62A8EXmZ8Xf8adtzCtX+sirIn7vGB2RM1vgnSbRt7WD193ec251eT45BSoLPg221gAwV8Wxoo0A8eK3SZfLOSwDxLwhIWfYccX6Y7Gh90o5crFAIEAOQQKByYDAwEpSBabAxwktBLgCepBlK3eWxLDWSILAZDljYCI9AEq3GPAiPRFstgfcJz+wItsCaKRYg4pSas5NDtkASXwFzSCRmWYwsErPaK+9cxFRS7+is43IUijJJmqcUTXxRb+rrMQFChHA1TobNj3BJOjFkWITAhTHscKeqFI0DA7aOYgJkAS4F5AQyAjZQ8PDqnvP0LaTY9xBT0l9ivkeM34IBVJKiBr+Vip51SqvTstE4ioAhRTTAagIqyo1+METPC8FhKCiGkQneRiYpCqKo+GVw7nWPBn9NWuwEUJQ1jCER7cseG02dIwGppNhOPnjIu1djYDAAAA') format('woff2');
	}


	.active-con {
		color: #2ABAC2 !important;
		font-size: 28upx;
		margin-top: 28upx;
	}

	.active-con1 {
		color: #2ABAC2 !important;
		font-size: 28upx;
	}

	.active-con2 {
		color: #333333 !important;
		font-size: 28upx;
	}

	.icon {
		font-family: 'HMfont-login' !important;

		font-style: normal;
		color: #ffffff;

		&.weixin {
			&:before {
				content: '\e615';
			}
		}

		&.qq {
			&:before {
				content: '\e752';
			}
		}

		&.weibo {
			&:before {
				content: '\e63d';
			}
		}

		&.xiaomi {
			&:before {
				content: '\e661';
			}
		}
	}

	// page {
	// 	height: 100%;
	// }

	.logo {
		width: 100%;
		padding: 180upx 0 100upx;
		display: flex;
		justify-content: center;
		align-items: center;

		image {
			width: 172upx;
			height: 172upx;
			border-radius: 40upx;
			box-shadow: 0px 0px 20px rgba(136, 136, 136, 0.2);
		}

	}

	.form {
		.username {
			position: relative;
		}

		.code {
			position: relative;

			.get-code {
				position: absolute;
				top: 15upx;
				height: 90upx;
				display: flex;
				align-items: center;
				justify-content: center;
				right: 0;
				padding: 0 20upx 0 20upx;
				font-size: 24upx;
				// border-left: solid 1upx #fff;
				z-index: 3;

				&:after {
					content: ' ';
					width: 1upx;
					height: 50upx;
					background-color: #fff;
					position: absolute;
					z-index: 3;
					margin-right: 100%;
					left: 0;
					top: 30upx;
				}
			}
		}
	}

	.form {
		.res {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			color: #ffffff !important;
		}

		.result {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 39upx;

			.line {
				color: #333;
				font-size: 24upx;
				margin: 0 50upx;
			}
		}

		width: 100%;
		padding: 0 75upx;
		font-size: 30upx;

		.username,
		.password,
		.code {
			width: calc(100%);
			height: 119upx;
			display: flex;
			align-items: center;
			border-bottom: 2upx solid rgba(238, 238, 238, 1);

			image {
				width: 42upx;
				height: 44upx;
				margin-right: 20upx;
			}

			input {
				font-size: 28upx;
				font-weight: 400;
				color: rgba(153, 153, 153, 1);
			}
		}

		.btn {
			color: #fff;
			width: 100%;
			height: 90upx;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #2ABAC2;
			font-size: 40upx;
			border-radius: 45upx;
			border: 1upx solid #2ABAC2;
			margin-top: 80upx;
		}
	}

	.oauth {
		position: absolute;
		bottom: 100upx;
		width: 100%;

		.text {
			width: 100%;
			height: 60upx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: rgba(153, 153, 153, 1);
			font-size: 28upx;
		}

		.list {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;

			.weixin {
				font-size: 80upx;
				margin: 0 30upx;
				width: 72upx;
				height: 72upx;

				image {
					width: 72upx;
					height: 72upx;
				}
			}
		}
	}
</style>
