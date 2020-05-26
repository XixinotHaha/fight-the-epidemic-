<template>
	<view class="change">
		<uni-title class="nav">
			<view slot="left" @click="back()" class="nav-left"><image src="/static/center/backGray.png" mode=""></image></view>
			<view slot="center" class="tab-bar" style="font-size: 18px;">{{ data.index.feedback }}</view>
		</uni-title>
		<form @submit="formSubmit">
			<view class="warp">
				
				<view class="feedback_content">
					<view class="feedback_top">{{data.index.feedbackContent}}</view>
					<view class="content">
						<textarea maxlength="1000" auto-height="true" name="body" v-model="body" :placeholder="data.index.feedbackPlace" />
						<view class="totalNum">
							{{body.length}}/{{totalNum}}
						</view>
					</view>
                </view>
                <view class="cu-form-group">
                    <view class="grid col-4 grid-square flex-sub">
                        <view class="bg-img" v-for="(item, index) in imgList" :key="index" @tap="ViewImage" :data-url="item.path">
                            <image :src="item" mode="aspectFill"></image>
                            <view class="cu-tag-close" @tap.stop="DelImg" :data-index="index"><image src="/static/center/close.png" mode=""></image></view>
                        </view>
                        <view class="solids" @tap="ChooseImage">
							<image src="/static/center/file2.png" mode="widthFix"></image>
						</view>
                    </view>
                </view>
            </view>
            <view class="tijiao">
            	<button class="out_login round" formType="submit" >{{data.login.submit}}</button>
            </view>
        </form>
    </view>
</template>

<script>
var _self;
export default {
    data() {
        return {
			data: getApp().globalData.data.index,
            imgList: [],
            imgpath: [],
            max:4,
            body:"",
            contactName:"",
			contactNum:'',
			totalNum:'1000'
        };
    },
    onLoad() {
        _self = this;
		let industry = uni.getStorageSync('industry');
		if (industry.name == 'chinese') {
			this.data = this.$chinese[0];
		} else {
			this.data = this.$chinese[1];
		}
    },
    methods: {
		back() {
			uni.navigateBack({
				delta: 1
			});
		},
        ChooseImage() {
            uni.chooseImage({
            	count: 9,
            	sourceType: ['camera', 'album'],
            	success: (res_File) => {
            		uni.showLoading({
            			title: this.data.index.loading
            		});
            		if (res_File.tempFilePaths != "" || res_File.tempFilePaths != undefined) {
            			var temp = res_File.tempFilePaths;
            			temp.forEach(item=>{
            				console.log(item);
            				uni.uploadFile({
            					url: this.$req.baseuUrl + this.$api.upload.path,
            					filePath: item,
            					name: 'file',
            					success: (uploadFileRes) => {
            						uni.hideLoading();
            						console.log(uploadFileRes);
            						let {
            							code,
            							msg,
            							data
            						} = JSON.parse(uploadFileRes.data)
            						if (code == 1) {
            							this.imgList.push(item)
            							this.imgpath = this.imgpath+','+ data.url
            						} else {
            							uni.showToast({
            								title: msg,
            							})
            						}
            					},
            					fail(e) {
            						console.log(e);
            					}
            				});
            			})
            			
            		}
            	},
            })
        },
        ViewImage(e) {
			// console.log( e.currentTarget);
            uni.previewImage({
                urls: this.imgList,
                current: e.currentTarget.dataset.url
            });
        },
        DelImg(e) {
            uni.showModal({
                title: this.data.index.popupsTips,
                content: this.data.index.delImage,
                cancelText: this.data.index.notSure,
                confirmText: this.data.index.sure, 
                success: res => {
                    if (res.confirm) {
                        this.imgList.splice(e.currentTarget.dataset.index, 1);
						
                    }
                }
            });
        },
        
        async formSubmit(e) {
            //进行表单检查
            var formData = e.detail.value;
			console.log(formData);
            if(!formData.body){
                uni.showToast({ title: this.data.index.feedbackPlaceTips, icon: 'none' });
                return false;
            }
			if(this.imgList.length<1){
			    uni.showToast({ title:  this.data.index.feedbackImage, icon: 'none' });
			    return false;
			}
			var form ={
				images : this.imgpath.substr(1),
				back_text : formData.body,
			}
			console.log(form);
			_self.$ajax({
				path: _self.$api.feedback,
				data: form,
				success(res) {
					let {data,code,msg} = res.data;
					if(code==1){
						uni.showToast({
							title: msg,
							icon: 'none',
							success() {
								setTimeout(() => {
									uni.navigateBack({
										delta:1
									})
								}, 1000)
							}
						})
					}else {
						uni.showToast({
							title: msg,
							icon: 'none'
						})
					}
				}
			});
        }
    }
};
</script>

<style lang="scss">
page {
    font-size: 28upx;
    color: #333;
    background-color: #FFFFFF!important;
    overflow: hidden;
	box-sizing:border-box;
    .change {
		margin-bottom: 60upx;
		.feedback_top {
		    height: 30upx;
		    line-height: 30upx;
			font-size:32upx;
			font-weight:700;
			color:rgba(51,51,51,1);

		}
        .warp {
            width: 100%;
            background: #fff;
            border-bottom: 20upx solid #fff;
			padding-top: 88upx;
            .feedback_content {
				margin:40upx 32upx;
				min-height: 250upx;
                .content {
					position: relative;
                    textarea {
						margin-top: 32upx;
						padding: 20upx 20upx 40upx;
						box-sizing: border-box;
						min-height: 500upx;
						border:1upx solid rgba(220, 220, 220, 1);	
						border-radius:6upx;
                        width: 100%;
                        font-size: 26upx;
						overflow-y: auto;
                    }
                }
				.totalNum{
					position: absolute;
					bottom:10upx;
					right:20upx;
					font-size:22upx;
					font-weight:400;
					color:rgba(153,153,153,1);
				}
            }
        }
        .feedback_contact {
            
            background: #fff;
            .feedback_contact_top {
				padding: 0 30upx;
				width:251px;
				font-size:32upx;
				font-weight:500;
				color:rgba(51,51,51,1);
            }
            .feedback_contact_content {
				padding: 0 30upx;
				
                input {
                    height: 100upx;
                    display: flex;
                    flex-wrap: wrap;
                    flex-direction: row;
                    align-items: center;  
					border-bottom: 1upx solid #eee;
                }
				.placeholder{
					font-size:26upx;
					font-weight:500;
					color:rgba(153,153,153,1);
				}
            }
        }
        .sub {
            margin-top: 30%;
            line-height: 88upx;
            background-color: rgb(0, 129, 255);
            color: #fff;
            text-align: center;
            border-radius: 45px;
            margin-left: 25upx;
            margin-right: 25upx;
        }
    }
}
.tijiao{
	padding: 0 32upx;
	.out_login {
		margin-top:80upx;
	    background:#2ABAC2!important;
	    color: #fff;
	    text-align: center;
	    border-radius: 45px;
	}
}

.solids{
	// background:rgba(245,245,245,1);
	position: relative;
	border: none !important;
	.text{
		position: absolute;
		bottom:20upx;
		left: 25%;
		font-size:20upx;
		font-family:PingFang SC;
		font-weight:400;
		color:rgba(153,153,153,1);
	}
	image{
		width: 100%;
		height: 100%;
	}
}
.img-text{
		// margin:30upx 0 0 15upx;
		width: 400upx!important;
		font-size:24upx;
		font-weight:400;
		color:rgba(51,51,51,1);
		height:150upx;
		line-height: 150upx;
	}
	.cu-tag-close{
		position: absolute;
		top:5upx;
		right:10upx;
		width: 50upx;
		height: 50upx;
		right:5upx!important;
		border-radius: 50%;
		.image{
			width: 100%;
			height: 100%;
		}
	}
</style>
