<template>
	<view class="content">
		<view class="cropper-wrapper" style="height:617px">
			<canvas
				class="cropper"
				disable-scroll="true"
				@touchstart="touchStart"
				@touchmove="touchMove"
				@touchend="touchEnd"
				:style="{ width: cropperOpt.width, height: cropperOpt.height }"
				canvas-id="cropper"
			></canvas>
		</view>
		<view class="cropper-buttons">
			<view class="upload" @tap="uploadTap">重新选择</view>
			<view class="getCropperImage" @tap="getCropperImage">确定</view>
		</view>
	</view>
</template>

<script>
import weCropper from '@/common/js/weCropper';
const device = uni.getSystemInfoSync();
const width = device.windowWidth;
const height = device.windowHeight - 50;
export default {
	data() {
		return {
			cropperOpt: {
				id: 'cropper',// 用于手势操作的canvas组件标识符
				width: width,
				height: height,
                pixelRatio: device.pixelRatio, // 传入设备像素比
				scale: 8,// 最大缩放倍数
				zoom: 18,// 缩放系数
				cut: {
					x: (width - 300) / 2,
					y: (height - 300) / 2,
					width: 300,
					height: 300
				}
			},
			weCropper: '',
			userinfo:''
		};
	},
	methods: {
		touchStart(e) {
			this.weCropper.touchStart(e);
		},
		touchMove(e) {
			this.weCropper.touchMove(e);
		},
		touchEnd(e) {
			this.weCropper.touchEnd(e);
		},
		convertBase64UrlToBlob(dataURI, type) {
			var binary = atob(dataURI.split(',')[1]);
			var array = [];
			for (var i = 0; i < binary.length; i++) {
				array.push(binary.charCodeAt(i));
			}
			return new Blob([new Uint8Array(array)], { type: type }, { filename: '1111.jpg' });
		},
		blobToDataURL(blob) {
			var a = new FileReader();
			a.readAsDataURL(blob); //读取文件保存在result中
			a.onload = function(e) {
				var getRes = e.target.result; //读取的结果在result中
				console.log(getRes);
			};
		},
		getCropperImage() {
			let _this = this;
			let baseUrl = this.$req.baseuUrl
			let pathurl = baseUrl+this.$api.upload.path;//上传服务器地址	
			this.weCropper.getCropperImage(avatar => {
				if (avatar) {
					//下面是上传到服务器的方法
					console.log(avatar);
					uni.uploadFile({
						url: pathurl,
						filePath: avatar,
						name: 'file',
						success: res => {
                            var rescult = JSON.parse(res.data);
                            console.log(rescult)
							if(rescult.code==1){
								uni.showToast({
									title: rescult.msg,
									icon: 'success',
									duration: 1000,
									async success() {
										_this.userinfo = _this.$common.getUserInfo();
										_this.userinfo.avatar = baseUrl+  rescult.data.url
										console.log(_this.userinfo.avatar);
										uni.setStorageSync('USERINFO', _this.userinfo);
									}
								});
								
							}
							//  获取到裁剪后的图片
							uni.$emit('upHead',{
								avatar: avatar,
								path:  baseUrl + rescult.data.url
							})

							this.$Router.replace({
								name: 'user_info_input',
								params: {}
							});
						},
						fail: err => {
							console.log('uploadImage fail', err);
							uni.showModal({
								content: err.errMsg,
								showCancel: false
							});
							uni.hideLoading();
						},
						// complete: () => {
						// 	console.log('complate');
						// }
					});
				} else {
					console.log('获取图片失败，请稍后重试');
				}
			});
		},
		uploadTap() {
			const self = this;
			uni.chooseImage({
				count: 1, // 默认9
				sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
				success(res) {
					let src = res.tempFilePaths[0];
					//  获取裁剪图片资源后，给data添加src属性及其值
					self.weCropper.pushOrign(src);
				}
			});
		}
	},
	onLoad(option) {
		// do something
		console.log(111);
		const cropperOpt = this.cropperOpt;
		const src = option.src;
		if (src) {
			Object.assign(cropperOpt, {
				src
			});

			this.weCropper = new weCropper(cropperOpt)
				.on('ready', function(ctx) {})
				.on('beforeImageLoad', ctx => {
					uni.showToast({
						title: '上传中',
						icon: 'loading',
						duration: 3000
					});
				})
				.on('imageLoad', ctx => {
					uni.hideToast();
				});
		}
	}
};
</script>

<style>
.content {
	background: rgba(255, 255, 255, 1);
}

.head-list {
	height: 43px;
	width: 100%;
	background: #ffffff;
	justify-content: center;
	align-items: center;
	display: flex;
	border-bottom: 1px solid rgba(244, 244, 244, 1);
}

.head-info {
	text-align: center;
	font-size: 18px;
	color: #000000;
	font-weight: bold;
}

.save-box {
	position: absolute;
	right: 0px;
	width: 50px;
	height: 43px;
	line-height: 43px;
}

.save {
	color: rgba(98, 111, 252, 1);
	font-size: 16px;
	font-weight: 400;
}

.icon-back {
	margin-top: 11px;
	width: 10px;
	height: 18px;
	color: #000000;
	margin-left: 6px;
}

.icon-back-box {
	display: block;
	position: absolute;
	left: 6px;
	height: 43px;
	width: 30px;
	align-items: center;
}
.cropper {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

.cropper-buttons {
	background-color: #2ABAC2;
	color: #04b00f;
}
.cropper-wrapper {
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	background-color: #F0F0F0;
}

.cropper-buttons {
	width: 100vw;
	height: 50px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	position: fixed;
	bottom: 0;
	left: 0;
	line-height: 50px;
}

.cropper-buttons .upload,
.cropper-buttons .getCropperImage {
	width: 50%;
	text-align: center;
    color: #fff;
}
.cropper-buttons .upload{
	border-right:1upx solid #fff;
}
</style>
