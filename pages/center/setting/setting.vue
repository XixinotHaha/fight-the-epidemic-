<template>
	<view class="">
		<uni-title class="nav">
			<view slot="left" @click="back()" class="nav-left"><image src="/static/center/backGray.png" mode=""></image></view>
			<view slot="center" class="tab-bar" style="font-size: 18px;">{{ data.index.setting }}</view>
		</uni-title>
		<view class="per">
			<navigator url="/pages/index/trade/trade_edit">
				<view class="per_row">
					<text>{{ data.login.editLanguage }}</text>
					<view class="qianwang">
						<text v-if="industry.name=='chinese'">{{data.login.china[0].chinese}}</text>
						<text v-else>{{data.login.china[1].english}}</text>
						<image src="/static/center/next.png" mode=""></image>
					</view>
				</view>
			</navigator>
			<!-- <navigator url="/pages/login/editpassword">
				<view class="per_row">
					<text>{{ data.login.editpassword }}</text>
					<view class="qianwang">
						<image src="/static/center/next.png" mode=""></image>
					</view>
				</view>
			</navigator> -->
			<!-- <navigator url="/pages/login/verification_account">
				<view class="per_row">
					<text>{{ data.login.bindAcount }}</text>
					
					<view class="qianwang">
						<text>{{mobile}}</text>
						<image src="/static/center/next.png" mode=""></image>
					</view>
				</view>
			</navigator> -->
			<navigator url="/pages/center/about">
				<view class="per_row" style="border-bottom: none;">
					<text>{{ data.index.aboutUS }}</text>
					<view class="qianwang">
						<image src="/static/center/next.png" mode=""></image>
					</view>
				</view>
			</navigator>
			<view class="line_box"></view>
			<view class="per_row" @click="clear">
				<text>{{ data.index.cache }}</text>
				<view class="row_right">
					<text class="aa">{{storage}}</text>
					<text class="iconfont iconqianwang"></text>
				</view>
			</view>
			<view class="per_row" @click="update">
				<text>{{ data.index.version }}</text>
				<view class="row_right">
					<text class="aa">{{edition}}</text>
					<text class="iconfont iconqianwang"></text>
				</view>
			</view>
		</view>
	
		<uni-popup ref="clear" type="center" class="del_draft">
			<view class="title">
				{{data.index.popupsTips}}
			</view>
			<view class="title" style="font-size: 36upx;">
				{{data.index.cacheAsk}}
			</view>
			<view class="button">
				<button class="current" @click="closePopup" plain="true">{{data.index.notSure}}</button>
				<button @click="clearStorage" plain="true">{{data.index.sure}}</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/popup/uni-popup/uni-popup.vue';
	var _self;
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				data: getApp().globalData.data,
				islogin: 0,
				storage: '',
				phone_type: '',
				edition: '',
				editionNew: "",
				mobile:"",
				industry:""
			};
		},
		onLoad() {
			_self = this
			var user = uni.getStorageSync('USERINFO');
			// this.edition = uni.getStorageSync('edition')
			// const app = getApp();
			if (user.id > 0) {
				this.islogin = 1
			}
			if (user) {
				_self.formatSize()
				_self.mobile = user.mobile
			}
			this.industry = uni.getStorageSync('industry');
			if(this.industry.name=="chinese"){
				this.data = this.$chinese[0]
			}else{
				this.data = this.$chinese[1]
			}
			_self.phone_type = _self.$checkPlatform()
		},
		onShow() {
			const app = getApp();
			this.edition = app.globalData.version;
			uni.$on("mobile",(data)=>{
				console.log(data);
				_self.mobile = data.mobile
			})
		},
		methods: {
			back() {
				this.$Router.pushTab({
					name: "index",
					params:{}
				});
			},
			closePopup() {
				this.$refs.clear.close();
				// this.$refs.update.close();
			},
			clear() {
				this.$refs.clear.open();
			},
			update() {
				this.sureUpdate();
			},
			async sureUpdate() {
				_self.$ajax({
					path: _self.$api.update,
					data: {},
					success(res) {
						let {
							data,
							code,
							msg
						} = res.data;
						if (code == 1) {
							let {
								is_force,
								edition,
								update_detail,
								down_url,
								ios_dswitch,
								ios_durl
							} = data;
							console.log(down_url);
							uni.setStorageSync('edition', edition)
							let editionNum = edition.split('.').join('');
							let versionNum = _self.edition.split('.').join('');
							if (versionNum == 0 || versionNum == "") {
								versionNum = editionNum
							}
							console.log(editionNum);
							console.log(versionNum);

							if (editionNum > versionNum) {
								// #ifdef APP-PLUS  
								if (plus.os.name == 'android') {
									if (is_force == 1) {
										uni.showModal({
											title: _self.data.index.popupsTips,
											content: update_detail,
											confirmText: _self.data.index.updataNow,
											showCancel: false,
											success(res) {
												if (res.confirm) {
													if (down_url) {
														uni.showLoading({
															title: _self.data.index.updataing,
															success() {
																uni.downloadFile({
																	url: down_url,
																	success: (downloadResult) => {
																		let title = JSON.stringify(downloadResult)
																		if (downloadResult.statusCode === 200) {
																			plus.runtime.install(downloadResult.tempFilePath, {
																				force: true
																			}, function() {
																				console.log('install success...');
																				uni.hideLoading()
																				plus.runtime.restart();
																			}, function(e) {
																				console.error('install fail...');
																			});
																		}
																	}
																});
															}
														})
													} else {
														uni.showToast({
															title:_self.data.index.noUpdata
														});
													}

												}
											}
										})
									} else {
										uni.showModal({
											title: _self.data.index.updataContent,
											content: update_detail,
											confirmText: _self.data.index.updataNow,
											success(res) {
												if (res.confirm) {
													uni.showLoading({
														title: _self.data.index.updataing,
														success() {
															uni.downloadFile({
																url: url + "/" + down_url,
																success: (downloadResult) => {
																	let title = JSON.stringify(downloadResult)
																	if (downloadResult.statusCode === 200) {
																		plus.runtime.install(downloadResult.tempFilePath, {
																			force: true
																		}, function() {
																			console.log('install success...');
																			uni.hideLoading()
																			plus.runtime.restart();
																		}, function(e) {
																			console.error('install fail...');
																		});
																	}
																}
															});
														}
													})
												} else if (res.cancel) {
													uni.hideLoading()
												}
											}
										})
									}

								} else if(plus.os.name == 'iOS'){
									if (ios_durl) {
										if (ios_dswitch==0) {
											return
										} else {
											plus.runtime.openURL(ios_durl);
										}
									} else {
										uni.showToast({
											title:_self.data.index.iosShopNot
										})
									}
								}
								// #endif  
							} else {
								uni.showToast({
									title: _self.data.index.newversion,
									icon: 'none'
								})
							}
						} else {
							uni.showToast({
								title: msg,
								icon: 'none'
							})
						}
					},
					fail(e) {
						console.log(e);
					}
				})
			},

			// 清除缓存
			clearStorage() {
				this.$refs.clear.close();
				try {
					uni.showLoading({
						title: _self.data.index.casheClear,
						success() {
							setTimeout(() => {
								uni.hideLoading()
								try {
									_self.clearCache()
								} catch (e) {
									//TODO handle the exception
								}
							}, 600)
						}
					})
				} catch (e) {

				}
			},
			formatSize() {
				try {
					plus.cache.calculate(function(size) {
						let sizeCache = parseInt(size);
						// console.log(sizeCache);
						if (sizeCache == 0) {
							_self.storage = "0B";
						} else if (sizeCache < 1024) {
							_self.storage = sizeCache + "B";
						} else if (sizeCache < 1048576) {
							_self.storage = (sizeCache / 1024).toFixed(2) + "KB";
						} else if (sizeCache < 1073741824) {
							_self.storage = (sizeCache / 1048576).toFixed(2) + "MB";
						} else {
							_self.storage = (sizeCache / 1073741824).toFixed(2) + "GB";
						}
					});
				} catch (e) {
					//TODO handle the exception
				}
			},
			clearCache() {
				let os = plus.os.name;
				if (os == 'Android') {
					let main = plus.android.runtimeMainActivity();
					let sdRoot = main.getCacheDir();
					let files = plus.android.invoke(sdRoot, "listFiles");
					let len = files.length;
					for (let i = 0; i < len; i++) {
						let filePath = '' + files[i]; // 没有找到合适的方法获取路径，这样写可以转成文件路径  
						plus.io.resolveLocalFileSystemURL(filePath, function(entry) {
							if (entry.isDirectory) {
								entry.removeRecursively(function(entry) { //递归删除其下的所有文件及子目录  
									uni.showToast({
										title: _self.data.index.clearOff,
										duration: 2000
									});
									_self.formatSize(); // 重新计算缓存  
								}, function(e) {
									// console.log(e.message)
								});
							} else {
								entry.remove();
							}
						}, function(e) {
							console.log('文件路径读取失败')
						});
					}
				} else { // ios暂时未找到清理缓存的方法，以下是官方提供的方法，但是无效，会报错  
					try {
						plus.cache.clear(function() {
							uni.showToast({
								title: _self.data.index.clearOff,
								duration: 2000
							});
							_self.formatSize();
						});
					} catch (e) {
						console.log(e);
						//TODO handle the exception
					}

				}
			}
		}
	};
</script>

<style lang="scss">
	page {
		height: auto;
		box-sizing: border-box;
		// background-color: #F7F7F7;
	}

	.per {
		font-size: 28upx;
		background-color: #FFF;
		margin-top: 130upx;

		.per_row {
			padding: 40upx 30upx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1px solid #eeeeee;
			color: rgba(51, 51, 51, 1);

			text {
				font-size: 28upx;
			}

			.row_right {
				text-align: right;

				.aa {
					display: inline-block;
					margin-right: 10upx;
				}
			}
		}
	}

	.qianwang {
		// width: 48upx;
		display: flex;
		align-items: center;
		height: 48upx;
		image {
			width: 48upx;
			height: 48upx;
		}
	}

	.out_login {
		margin-top: 40upx;
		background-color: #FFFFFF !important;
		color: #2ABAC2 !important;
		text-align: center;
	}

	.del_draft {
		display: flex;
		flex-direction: column;

		.title {
			line-height: 100upx;
			height: 100upx;
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
