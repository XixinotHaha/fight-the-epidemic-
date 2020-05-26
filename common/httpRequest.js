import configdata from './config'
import cache from './cache'
import lbframe from './lbframe'

module.exports = {
	config: function(name) {
		var info = null;
		if (name) {
			var name2 = name.split("."); //字符分割
			if (name2.length > 1) {
				info = configdata[name2[0]][name2[1]] || null;
			} else {
				info = configdata[name] || null;
			}
			if (info == null) {
				let web_config = cache.get("web_config");
				if (web_config) {
					if (name2.length > 1) {
						info = web_config[name2[0]][name2[1]] || null;
					} else {
						info = web_config[name] || null;
					}
				}
			}
		}
		return info;
	},
	post: function(url, data) {
		var Sign = lbframe.getSign(data);
		var UserInfo = lbframe.getUserInfo();
		if (UserInfo == undefined || UserInfo == '') {
			var token = 0;
		} else {
			var token = UserInfo.user_token;
		}
		url = this.config("APIHOST")+url;
		return new Promise((resolve, reject)=>{
			uni.request({
				url: url,
				data: data,
				method: 'POST',
				header: {
					"content-type": "application/x-www-form-urlencoded",
					// "content-type": "application/json; charset=utf-8",
					"token":token,
					"appid":Sign.appid,
					"signaturenonce":Sign.signaturenonce,
					"signature":Sign.signature,
					"timestamp":Sign.timestamp
				},
				success: function(res) {
					if(res.statusCode==200){
                        if(res.data.code == -201){
                            //检测登录失效，清空本地缓存，跳转登录页
                            uni.showToast({ title: res.data.msg, icon: 'none' });
                            uni.removeStorageSync('USERINFO')
                            setTimeout(function(){
                                uni.navigateTo({
                                    url:'/pages/login/login'
                                })
                            },500)
                            return false;
                        }
						resolve(res.data);
					}else{
						uni.showToast({ title: res.errMsg, icon: 'none' });
						reject();
					} 
				},
				fail(e) {
					reject(e);
				}
			});
		})
	},
	get: function(url, data) {
		var Sign = lbframe.getSign(data);
		var UserInfo = lbframe.getUserInfo();
		if (UserInfo == undefined || UserInfo == '') {
			var token = 0;
		} else {
			var token = UserInfo.user_token;
		}
		url = this.config("APIHOST")+url;
		return new Promise((resolve, reject)=>{
			uni.request({
				url: url,
				data: data,
				method: 'GET',
				header: {
					//"content-type": "application/x-www-form-urlencoded",
					"token":token,
					"appid":Sign.appid,
					"signaturenonce":Sign.signaturenonce,
					"signature":Sign.signature,
					"timestamp":Sign.timestamp
				},
				success: function(res) {
					if(res.statusCode==200){
                        if(res.data.code == -201){
                            //检测登录失效，清空本地缓存，跳转登录页
                            uni.showToast({ title: res.data.msg, icon: 'none' });
                            uni.removeStorageSync('USERINFO')
                            setTimeout(function(){
                                uni.navigateTo({
                                    url:'/pages/login/login'
                                })
                            },500)
                            return false;
                        }
						resolve(res.data);
					}else{
						uni.showToast({ title: res.errMsg, icon: 'none' });
						reject();
					} 
				}
			});
		})
	},
    /*
     *   上传图片
     * 		successFn  //回调
     * 		num		  	//选择图片的数量
     * 		data		//上传的参数
     * 		progressFn	//进度的回调
     */
    
    uploadImg(successFn,num=1,data={},progressFn) { //上传图片
    	let url = this.config("APIHOST");
    	uni.chooseImage({
    		count: num, //默认1
    		sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
    		sourceType: ['album', 'camera'], //从相册选择
    		success: function(res) { //选择后
    			//console.log(res, '选择的图片');
    			/*uni.showLoading({
    				title:'上传中...'
    			})*/
    			const tempFilePaths = res.tempFilePaths;
    			let fileList = {};	//储存上传实例；
    			for(var i in tempFilePaths){
    				fileList['uploadTask'+i] = uni.uploadFile({ //上传后台
    					url: url + 'v1/5d5fa8984f0c2',
    					filePath: tempFilePaths[i],
    					name: 'file[]',
    					formData: data,
    					success: function(upRes) { //上传成功
    						//uni.hideLoading();
    						//console.log(upRes, '上传图片');
    						if( upRes.statusCode == 200 ){
    							let data = JSON.parse(upRes.data);
    							if( typeof(successFn) == 'function' ){
    								successFn(data)
    							}
    						}else{
    							uni.showToast({
    								title: upRes.errMsg,
    								icon : 'none'
    							})
    						}
    						
    					},
    					fail: function(err){
    						//console.log('上传失败',err);
    						uni.showToast({
    							title: '图片上传失败，请稍后再试.'+err.errMsg,
    							icon : 'none'
    						})
    					}
    				})
    				//监听进度
    				fileList['uploadTask'+i].onProgressUpdate(function(res) {
    					if( typeof(progressFn) == 'function' ){
    						progressFn(res)
    					}
    					if( res.progress < 99.99 ){ 
    						uni.showLoading({
    							title: res.progress+'%'
    						});
    					}else{
							uni.hideLoading()
						}
    					//console.log('上传进度' + res.progress);
    					//console.log('已经上传的数据长度' + res.totalBytesSent);
    					//console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
    				});
    			};
    		} //选择成功——end
    	});
    }
}