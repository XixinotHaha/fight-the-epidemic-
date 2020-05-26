export function checkHotVersions(url, api, isClick = false) {
	// 检测是否更新
	plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
		uni.request({
			url: url + api,
			data: {
				versions: widgetInfo.version,
			},
			success: (result) => {
				getApp().globalData.version = widgetInfo.version;
				uni.setStorageSync('edition',getApp().globalData.version)
				console.log("当前版本号：" + getApp().globalData.version);
				let {
					code,
					data
				} = result.data;
				console.log(result.data.data);
				if (code) {
					let {
						is_force,
						edition,
						update_detail,
						down_url
					} = data;
					let editionNum = edition.split('.').join('');
					let versionNum = getApp().globalData.version.split('.').join('');
					console.log(editionNum);
					console.log(versionNum);
					console.log(edition);
					if (editionNum > versionNum) {
						if(is_force == 1){
							uni.showModal({
								title: "更新内容",
								content: update_detail,
								confirmText: '立即更新',
								showCancel:false,
								success(res) {
									if (res.confirm) {
										uni.showLoading({
											title: '下载中请勿离开',
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
									} 
								}
							})
						}
						else{
							uni.showModal({
								title: "更新内容",
								content: update_detail,
								confirmText: '立即更新',
								success(res) {
									if (res.confirm) {
										uni.showLoading({
											title: '下载中请勿离开',
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
					} else {
						if (isClick) {
							uni.showModal({
								title: '',
								showCancel: false,
								content: "已经是最新版本",
								success() {

								}
							})
						}
					}
				}
			}
		});
	});
}
