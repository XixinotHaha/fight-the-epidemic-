<template>
	<view class="">
		<view class="extension">
			<uni-title class="nav">
				<view slot="left" @click="back()" class="nav-left"><image src="/static/center/backGray.png" mode=""></image></view>
				<view slot="center" class="tab-bar" style="font-size: 18px;">{{ data.invite }}</view>
			</uni-title>
			<view class="qrcode-image-box-box">
				<image class="image-box" src="/static/index/box.png" mode=""></image>
				<image :src="code" class="qrcode-image"></image>
			</view>
			<view class="line"></view>
			<view class="bottom-bar">
				<button class="btn" @click="doDraw">{{data.poster}}</button>
			</view>
			<view class="canvas-box">
				<canvas :style="'width: 750px;height: '+ height+'px;'" width="750" :height="height" class="canvas" canvas-id="canvas"></canvas>
			</view>
			<!-- <image :src="result" mode="widthFix" class="res"></image> -->
		</view>
	</view>
</template>

<script>
	var _self;
	/**该方法用来绘制一个有填充色的圆角矩形 
	 *@param cxt:canvas的上下文环境 
	 *@param x:左上角x轴坐标 
	 *@param y:左上角y轴坐标 
	 *@param width:矩形的宽度 
	 *@param height:矩形的高度 
	 *@param radius:圆的半径 
	 *@param fillColor:填充颜色 
	 **/
	function fillRoundRect(cxt, x, y, width, height, radius, /*optional*/ fillColor) {
		//圆的直径必然要小于矩形的宽高          
		if (2 * radius > width || 2 * radius > height) {
			return false;
		}

		cxt.save();
		cxt.translate(x, y);
		//绘制圆角矩形的各个边  
		drawRoundRectPath(cxt, width, height, radius);
		cxt.fillStyle = fillColor || "#000"; //若是给定了值就用给定的值否则给予默认值  
		cxt.fill();
		cxt.restore();
	}


	/**该方法用来绘制圆角矩形 
	 *@param cxt:canvas的上下文环境 
	 *@param x:左上角x轴坐标 
	 *@param y:左上角y轴坐标 
	 *@param width:矩形的宽度 
	 *@param height:矩形的高度 
	 *@param radius:圆的半径 
	 *@param lineWidth:线条粗细 
	 *@param strokeColor:线条颜色 
	 **/
	function strokeRoundRect(cxt, x, y, width, height, radius, /*optional*/ lineWidth, /*optional*/ strokeColor) {
		//圆的直径必然要小于矩形的宽高          
		if (2 * radius > width || 2 * radius > height) {
			return false;
		}

		cxt.save();
		cxt.translate(x, y);
		//绘制圆角矩形的各个边  
		drawRoundRectPath(cxt, width, height, radius);
		cxt.lineWidth = lineWidth || 2; //若是给定了值就用给定的值否则给予默认值2  
		cxt.strokeStyle = strokeColor || "#000";
		cxt.stroke();
		cxt.restore();
	}

	function drawRoundRectPath(cxt, width, height, radius) {
		cxt.beginPath(0);
		//从右下角顺时针绘制，弧度从0到1/2PI  
		cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2);

		//矩形下边线  
		cxt.lineTo(radius, height);

		//左下角圆弧，弧度从1/2PI到PI  
		cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);

		//矩形左边线  
		cxt.lineTo(0, radius);

		//左上角圆弧，弧度从PI到3/2PI  
		cxt.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);

		//上边线  
		cxt.lineTo(width - radius, 0);

		//右上角圆弧  
		cxt.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);

		//右边线  
		cxt.lineTo(width, height - radius);
		cxt.closePath();
	}
	export default {
		data() {
			return {
				data: getApp().globalData.data.index,
				code: "",
				Invitation_img: "/static/index/box.png",
				result:"",
				height:0,
				user:"",
				redHeight:"",
				redWidth:"",
				addr:""
			}
		},
		onLoad() {
			_self = this;
			let industry = uni.getStorageSync('industry');
			if(industry.name=="chinese"){
				this.data = this.$chinese[0].index
			}else{
				this.data = this.$chinese[1].index
			}
			uni.getSystemInfo({
			    success: function (res) {
			        console.log(res.screenHeight); // 屏幕高度
					console.log(res.screenWidth);
					_self.redHeight = res.screenHeight
					_self.redWidth = res.screenWidth
			    }
			});
			let UserInfo = uni.getStorageSync("USERINFO");
			_self.user = UserInfo
			let common = uni.getStorageSync("commonData")
			let unicode = encodeURIComponent(common.tuiguang)
			let code = "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data="+unicode;
			uni.showLoading({
				title:this.data.load,
				success() {
					uni.getImageInfo({
						src:code,
						success() {
							_self.code =code
							setTimeout(()=>{
								uni.hideLoading()
							},1500)
						}
					})
				}
			})
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			doDraw(){
				uni.showLoading({title:this.data.draw})
				uni.getImageInfo({
					src:_self.Invitation_img,
					success(res) {
						let {widht,height} = res;
						_self.height = height;
						console.log(height);
						_self.drawCanvas(_self.redWidth*2,_self.redHeight*2)
					}
				})
				// _self.drawCanvas(_self.redWidth*2,_self.redHeight*2)
			},
			drawCanvas(w,h) {
				let id = 'canvas';
				var context = uni.createCanvasContext(id)
				context.setFillStyle('#FFFFFF')
				context.fillRect(0, 0,w, h)
				
				context.drawImage("/static/index/box.png",168, 120,420, 260)
				context.save();
				
				context.drawImage(_self.code, 197, 135,360, 225)
				
				context.setLineDash([10, 20], 5);
				context.beginPath();
				context.moveTo(50,500);
				context.lineTo(700, 500);
				context.stroke();
				context.draw(true, () => {
					uni.canvasToTempFilePath({
						x: 0,
						y: 0,
						width: w,
						height: h,
						destWidth: w/2,
						destHeight: h/2,
						canvasId: id,
						success(res) {
							console.log(res);
							_self.result = res.tempFilePath;
							uni.showLoading({
								title:_self.data.inpro,
								success() {
									uni.saveImageToPhotosAlbum({
										filePath: _self.result,
										success() {
											uni.showToast({
												title: _self.data.incaram,
												icon: "none"
											});
										},
										fail() {
											uni.showToast({
												title: _self.data.testAgain,
												icon: "none"
											});
										},
										complete() {
											uni.hideLoading()
										}
									}, _self);
								}
							})
							
						},
						fail(e) {
							console.log(e);
							uni.showToast({
								title: _self.data.failPoster,
								icon: 'none'
							});
						}
					}, _self);
				
				})
			}
		}
	}
</script>

<style scoped>
	page{
		width: 100%;
		height: 100%;
		background:rgba(250,250,250,1);
	}
	.invite_code{
		width:750upx;
		height: 280upx;
		line-height: 280upx;
		font-size: 48upx;
		font-weight: 900;
		color: #FFFFFF;
		text-align: center;
		overflow: hidden;
	}
	.canvas-box {
		width:750upx;
		height: 1204upx;
		position: absolute;
		top: -99999em;
		left: -99999em;
		z-index: -999;
	}
	.res{
		width: 750upx;
		display: block;
		position: absolute;
		top: 0;
		left: 0;
	}
	.canvas{
		width: 100%;
		height: 100%;
	}

	.extension {
		width: 100%;
		height: 100%;
	}

	.extension .background {
		width: 90%;
		height: 500upx;
		display: block;
		margin: auto;
		margin-top: 30upx;
	}

	.extension-section {
		width: 100%;
		height: 500upx;
		box-sizing: border-box;
		display: flex;
		overflow: hidden;
	}
	.bg-image{
		width: 100%;
		height: 500upx;
	}

	.bottom-bar {
		width: 100%;
		height: 200upx;
		padding-bottom: 50px;
		margin-top: 100upx;
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.bottom-bar .btn{
		width:560upx;
		height:88upx;
		background:rgba(255,255,255,1);
		border:2upx solid rgba(188,188,188,1);
		border-radius:8upx;
		color: #333333;
	}
	.qrcode-image-box-box{
		width: 420upx;
		height: 420upx;
		margin:auto;
		padding-top: 300upx;
		position: relative;
	}
	.line{
		height: 2upx;
		width: 530upx;
		margin:auto;
		padding-top: 400upx;
		border-bottom: 2upx dashed  #ccc;
	}
	.image-box{
		width: 420upx;
		height: 420upx;
		padding: 20upx;
		margin:auto;
		overflow: hidden;
	}
	.qrcode-image {
		width: 310upx;
		height: 310upx;
		position: absolute;
		top: 355upx;
		left: 55upx;
	}
</style>
