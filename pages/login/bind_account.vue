<template>
	<!-- 绑定新手机号码 -->
	<view>
		<uni-title class="nav">
			<view slot="left" @click="back()" class="nav-left"><image src="/static/center/backGray.png" mode=""></image></view>
			<view slot="center" class="tab-bar" style="font-size: 18px;">{{ data.bind_account }}</view>
		</uni-title>
		<view class="form">
			<view class="username">
				<input type="number"  :placeholder="data.mobile"  v-model.trim="mobile" maxlength="11" placeholder-style="color:#999999" />
			</view>
			<view class="code">
				<view class="input">
					<input :placeholder="data.inputCode" maxlength="4" v-model="code" placeholder-style="color:#999999" confirm-type="send" />
				</view>
				<view class="get-code" :style="{'color':getCodeBtnColor}" @click.stop="getCode()">{{getCodeText}}</view>
			</view>
			<view class="btn" @tap="doReg">{{data.sure}}</view>
		</view>
	</view>
</template>

<script>
	var _self;
	export default {
		data() {
			return {
				data:getApp().globalData.data.login,
				mobile: '',
				Resetpassword: '',
				code: '',
				password: '',
				getCodeText:"",
				getCodeBtnColor: '#2ABAC2',
				getCodeisWaiting: false,
				code_id: 0,
				invite_code: '',
				type:""
			};
		},
		onLoad() {
			_self = this
			_self.type= _self.$Route.query.type
			let industry = uni.getStorageSync('industry');
			if(industry.name=="chinese"){
				this.data = this.$chinese[0].login
			}else{
				this.data = this.$chinese[1].login
			}
			this.getCodeText = this.data.getcode
		},
		methods: {
			Timer() {},
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			async getCode() {
				uni.hideKeyboard()
				if (this.getCodeisWaiting) {
					return;
				}
				if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.mobile))) {
					uni.showToast(!this.mobile ? {
						title: this.data.mobile,
						icon: "none"
					} : {
						title: this.data.rightMobile,
						icon: "none"
					});
					return false;
				}
				this.getCodeText = this.data.send
				this.getCodeisWaiting = true;
				this.getCodeBtnColor = "rgba(0,0,0,0.5);"
				_self.$ajax({
					title: "",
					path: _self.$api.send_code,
					data: {
						mobile: this.mobile,
						event: "changemobile"
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
					fail(res){
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						})
						_self.getCodeText = this.data.getcode;
						_self.getCodeBtnColor = "#2ABAC2";
						_self.getCodeisWaiting = false;
					}

				})
			},
			setTimer() {
				let holdTime = 60;
				this.getCodeText = this.data.getcodeAgain + "(60)"
				this.Timer = setInterval(() => {
					if (holdTime <= 0) {
						this.getCodeisWaiting = false;
						this.getCodeBtnColor = "#2ABAC2";
						this.getCodeText = this.data.getcode
						clearInterval(this.Timer);
						return;
					}
					this.getCodeText = this.data.getcodeAgain + "(" + holdTime + ")"
					holdTime--;
				}, 1000)
			},
			
			async doReg() {
				uni.hideKeyboard();
				//模板示例部分验证规则
				if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.mobile))) {
					uni.showToast(!this.mobile ? {
						title: this.data.mobile,
						icon: "none"
					} : {
						title: this.data.rightMobile,
						icon: "none"
					});
					return false;
				}
				// if (this.code_id != 1) {
				// 	uni.showToast({
				// 		title: this.data.getCodeFirst,
				// 		icon: "none"
				// 	});
				// 	return false;
				// }
				if (!this.code) {
					uni.showToast({
						title: this.data.inputCode,
						icon: "none"
					});
					return false;
				}
				uni.showLoading({
					title: this.data.inSubmit
				})
				_self.$ajax({
					path: this.$api.change_mobile,
					data: {
						mobile:_self.mobile,
						captcha:_self.code
					},
					success(res) {
						console.log(res);
						let {
							data,
							code,
							msg
						} = res.data;
						uni.hideLoading();
						if (code == 1) {
							_self.$Router.replace({
								name: "setting",
								params:{}
							});
							var user = uni.getStorageSync('USERINFO');
							user.mobile = _self.mobile
							uni.setStorageSync("USERINFO", user)
							uni.$emit("mobile",{
								mobile:_self.mobile
							})
						} 
					},
					fail(res){
						console.log(res);
					}
				})
				
				
			}
		}
	};
</script>
<style lang="scss">
	@font-face {
		font-family: 'HMfont-login';
		src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAVwAAsAAAAACiwAAAUhAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDMgqHTIY+ATYCJAMUCwwABCAFhG0HRhvICBEVpCGR/UgwbhrPeq6LhESdqBKaSN/kw79n/bk3aCYZKO1yZCbTFZBZqLv71CzRPvkPQPDEzrPbAAEEdy/nHLBRL1RJVpMf+cAnKX4Do/NzekpNyAm5/zlmunw+sPy2tUt22QBHAx5Q5EUGHvAdnfOh3DK8OuQd0OlAAIiIQw5IS1uPAgEstFUEAFmxdPFcCDE92AIcgaDigV1ZkBvBQaCH6csAbnB/nnyDIiIAFBwDbePAotYFaAjIY0OMFtTMsBEQdGcFwOwFMAByALAAWQfaV4Dx4zlgIEpRFg2A/DsBFDQgB2oDc8eGgkGQeEFKUZejCznt9o/HQ5OHYmxDggUCskkBBgjUUoAAgbkUoMDYkPDCyDliuQhABkgJQK6yyhT38BIY8CBxYSRMEkkMSSATwkJdISFRxmEK1/vOnrTzXjViHzwz8aKlGEYs2iibpmp+5ratsgWGNWLbfrapGoZCpmU/tfdypWk3P2UpyrXbL9yT7r9NuzXF7fWdOOu/rp+KJfM9J10u24o94tV0yTZj7Q1k2sNGbKz3FE7fJrlO6jZTvS8u0ZhJun8isa0RspKxyKuEe2NZXZZOEuakK+yhNyZTXZI887RY8YQzlSXpoBHeCI5wo155sye1OndEW2qmqrgfekbypF8gtj1yfSpZR24fvUPxWVJPRLG2DHcxzf7n0tWR1+x5R0CV6j3Gds3IOfkK9MdFr5Un3mk4rSddo6/Jd1vEsCbatsu6R7YZUv2mevIuRf9nThs/zvYVz49u+Zw5nLqge+KujIq2hXHLc265lFGtRqxMdB4ZW7GDGxWkhRXLMpfNnaPMmLeT8S2mw3TIt3Ynv5P1TWOGGMW3c6cDCdUbnElHp9An2M7UvfFrl9Se3Mpl2OsC/OPrLn+Z/t+8OYMbyc7EULKrYRH0H8RvBcrsPjrZH/r9uO9DFSlsbnuo+4UQU/18N/9U41O/hEONfOLyA79rcYXtbq65rDorfijy9epSZFw8fEWNBN4peoL0Ll7SS4QBfh0/4Jnj+Jabk3XpkHSMdxxyuKysOZ4BfiuXySHl2UXydcnnx30kioxf/vShfUSnz/oZraNzc1Nu0tJttfyZxEhcTaOb/Ofrls75Pu/7/A/zPvxwpc/TJ34YSpffeeM2qlH/jVhDV9gcvNONnb7ZJePd7ubF++dFqYkkt2sh8dkoHjBpXMs3De/mt/y3dmCZ8424T5Y6B9aQf4r8dxu+imujrYtcywuiBztmF7Bt/yXK7wSmVlUEpshvJ/7HthUAHPDGBa7l2AIACD6yMPolEHyG+Y62A8EXmZ8Xf8adtzCtX+sirIn7vGB2RM1vgnSbRt7WD193ec251eT45BSoLPg221gAwV8Wxoo0A8eK3SZfLOSwDxLwhIWfYccX6Y7Gh90o5crFAIEAOQQKByYDAwEpSBabAxwktBLgCepBlK3eWxLDWSILAZDljYCI9AEq3GPAiPRFstgfcJz+wItsCaKRYg4pSas5NDtkASXwFzSCRmWYwsErPaK+9cxFRS7+is43IUijJJmqcUTXxRb+rrMQFChHA1TobNj3BJOjFkWITAhTHscKeqFI0DA7aOYgJkAS4F5AQyAjZQ8PDqnvP0LaTY9xBT0l9ivkeM34IBVJKiBr+Vip51SqvTstE4ioAhRTTAagIqyo1+METPC8FhKCiGkQneRiYpCqKo+GVw7nWPBn9NWuwEUJQ1jCER7cseG02dIwGppNhOPnjIu1djYDAAAA') format('woff2');
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

	page {
		height: 100%;
	}

	.logo {
		width: 100%;
		padding: 92upx 0 100upx;
		display: flex;
		justify-content: center;
		align-items: center;

		image {
			width: 140upx;
			height: 140upx;
			border-radius: 100%;
		}
	}

	.form {
		margin-top: 150upx;
		.res {
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #FFFFFF !important;
		}

		.code {
			.get-code {
				position: absolute;
				height: 102upx;
				display: flex;
				align-items: center;
				justify-content: center;
				right: 0;
				padding: 0 70upx 0 20upx;
				font-size: 24upx;
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
					top: 20upx;
				}
			}
		}

		.result {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 39upx;

			.line {
				color: #ccc;
				font-size: 24upx;
				margin: 0 30upx;
			}
		}

		width: 100%;
		padding: 0 30upx;
		font-size: 30upx;

		.username,
		.password,
		.code {
			width: calc(100%);
			height: 116upx;
			display: flex;
			align-items: center;
			border-bottom: 1px solid rgba(220, 220, 220, 0.5);
			display: flex;
			flex-direction: row;

			image {
				width: 42upx;
				height: 42upx;
				margin-right: 20upx;
			}

			.input {
				display: flex;
				flex-direction: row;

			}

			input {
				width: 100%;
				padding: 0 10upx;
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
			background-color: rgba(42,186,194,1);
			font-size: 40upx;
			border-radius: 45upx;
			border: 1upx solid rgba(42,186,194,1);
			margin-top: 200upx;
		}
	}

	.oauth {
		position: absolute;
		bottom: 50upx;
		width: 100%;

		.text {
			width: 100%;
			height: 60upx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: rgba($color: #ffffff, $alpha: 0.8);
			font-size: 28upx;
		}

		.list {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 20upx 0;

			.icon {
				font-size: 80upx;
				margin: 0 30upx;
			}
		}
	}

	.del_draft {
		.title {
			text-align: right;
			padding: 20upx 10px 0 0;

			image {
				width: 23upx;
				height: 23upx;
			}
		}

		.content {
			height: 200upx;
			line-height: 200upx;
			text-align: center;
			font-size: 32upx;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
			border-bottom: #CCCCCC;
		}

		button {
			background-color: #fff;
			height: 101upx;
			line-height: 101upx;
			font-size: 32upx;
		}
	}
</style>
