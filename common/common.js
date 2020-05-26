module.exports = {
	checkPhone(str) {
		//验证手机号码
		if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(str)) {
			uni.showToast(!str ? {
				title: '请输入手机号码',
				icon: 'none'
			} : {
				title: '请填写正确手机号码',
				icon: 'none'
			});
			return false;
		}
		return true;
	},
	checkPassword(str) {
		if (!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/.test(str))) {
			uni.showToast({
				title: '请输入6-12位，字母、数字组合的密码',
				icon: "none"
			});
			return false;
		}
		return true
	},
	checkQQ(str) {
		var reg = /^[1-9][0-9]{4,9}$/gim;
		if (!reg.test(str)) {
			uni.showToast({
				title: '请输入正确格式的QQ号码',
				icon: "none"
			});
			return false;
		}
		return true
	},
	checkMail(mail) {
		var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if (!filter.test(mail)) {
			uni.showToast({
				title: '请输入正确邮箱',
				icon: "none"
			});
			return false
		}
		return true
	},
	setUserInfo(data, callback) {
		uni.setStorageSync('USERINFO', data);
		callback && callback(data)
	},
	getUserInfo(callback) {
		try {
			const USERINFO = uni.getStorageSync('USERINFO');
			if (USERINFO) {
				callback && callback(USERINFO)
				return USERINFO
			}
		} catch (e) {

		}
		return false
	},
	getParamStrFromObj(url, data = {}, paramProxy = '') {
		return url + '?' + Object.keys(data).map(key => {
			if (paramProxy) {
				return `${paramProxy}[${key}]=${encodeURIComponent(data[key])}`
			}
			return `${key}=${encodeURIComponent(data[key])}`
		}).join('&')
	},
	getAddress(callback) {
		uni.getLocation({
			type: 'wgs84',
			geocode: true,
			success(res) {
				uni.setStorageSync('ADDRESS', res)		//用户实时位置
				uni.setStorageSync('USER_ADDRESS', "")  //替换用户选择位省份
				callback && callback(res)
			}
		});
	},
	loadImage(a,callback){
		for (var i = 0,n = 0,image=[]; i < a.length; i++) {
			uni.getImageInfo({
				src:a[i],
				success(res) {
					n++;
					let progress = n*100/a.length;
					image.push(res)
					uni.showLoading({
						title:"正在加载 "+progress + "%",
						success() {
							if(progress==100){
								setTimeout(()=>{
									uni.hideLoading()
									callback&&callback(image)
								},600)
							}
						}
					})
					
					
				}
			})
		}
	},
	getImageSize(options) {
		let defaults = Object.assign({
			boxW:156,
			boxH:156,
			src:""
		},options)
		uni.getImageInfo({
			src: defaults.src,
			success(res) {
				let {
					width,
					height
				} = res;
				let box_w = uni.upx2px(defaults.boxW);
				let box_h = uni.upx2px(defaults.boxH);
				let x = (width - height) < 0 ? height : width;
				let b_x = box_w / box_h; //盒子的比例
				let i_x = width / height; //图片的比例
				let new_w, new_h; //图片新宽高
				if (i_x < b_x) { //竖版图片
					new_w = box_h / height * width;
					new_h = box_h;
				} else { //横版图片
					new_w = box_w;
					new_h = box_w / width * height;
				}
				let image = {
					src:defaults.src,
					style:{
						width: new_w + 'px',
						height: new_h + 'px',
					}
				}
				defaults.success&&defaults.success(image)
			}
		})
	}
}
