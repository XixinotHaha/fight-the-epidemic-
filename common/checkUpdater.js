export function checkUpdater(currentId, updaterPage) {
	console.log(this.$req.baseuUrl + this.$api.update.path);
    uni.request({
        url: this.$req.baseuUrl + this.$api.update.path,
        method: 'POST',
        success: res => {
			console.log('热更新-----------------',res);
            if (res.data.code == 1) {
                const response = res.data.data
                const latestId = response.version
                const method = response.force
				
				console.log( currentId , latestId ,'-------------------');
				
                if (currentId < latestId && method == 1) {
                    const iosLink = response.app_ios_download
                    const androidLink = response.is_update_apk
                    let downloadLink = ''
                    let ready = false
                    // 判断系统类型
                    if (plus.os.name.toLowerCase() === 'android') {
                        console.log('安卓系统')
                        if (androidLink && androidLink !== '#') { // 我这里默认#也是没有地址，请根据业务自行修改
                            console.log('发现下载地址')
                            // 安卓：创建下载任务
                            if (androidLink.match(RegExp(/.wgt/))) {
                                console.log('确认wgt热更新包')
                                downloadLink = androidLink
                                ready = true
                            } else {
								ready = true
								downloadLink = androidLink
                                console.log(androidLink+'安卓推荐.wgt强制更新，.apk的强制更新请您自行修改程序')
								// uni.showModal({
								//     title: '提示',
								//     content: '系统有重大更新，请下载最新版app，否则可能会影响您的使用！',
								//     success: function (res) {
								//         if (res.confirm) {
								//             console.log('用户点击确定');
								// 			plus.runtime.openURL(androidLink); //  在浏览器打开链接去下载整包
								//         } else if (res.cancel) {
								//             console.log('用户点击取消');
								//         }
								//     }
								// });
                            }
                        } else {
                            console.log('下载地址是空的，无法继续')
                        }
                    } else {
                        console.log('苹果系统')
                        if (iosLink && iosLink !== '#') { // 我这里默认#也是没有地址，请根据业务自行修改
                            console.log('发现下载地址')
                            // 苹果(A)：进行热更新（如果iosLink是wgt更新包的下载地址）判断文件名中是否含有.wgt
                            if (iosLink.match(RegExp(/.wgt/))) {
                                console.log('确认wgt热更新包')
                                downloadLink = iosLink
                                ready = true
                            } else {
                                console.log('苹果只支持.wgt强制更新')
								plus.runtime.openURL(iosLink);  //  在浏览器打开链接去下载整包
                            }
                        } else { 
                            console.log('下载地址是空的，无法继续')
                        }
                    }
                    if (ready) {
                        console.log('任务开始');
						uni.showToast({
						    title: '发现新版本，后台自动更新中...',
							icon:'none',
						    duration: 2000
						});
                        let downloadTask = uni.downloadFile({
                            url: downloadLink,
                            success: (res) => {
                                if (res.statusCode === 200) {
                                    // 保存下载的安装包
                                    console.log('保存安装包')
                                    uni.saveFile({
                                        tempFilePath: res.tempFilePath,
                                        success: (res) => {
                                            const packgePath = res.savedFilePath
                                            // 保存更新记录到stroage，下次启动app时安装更新
                                            uni.setStorage({
                                                key: 'updated',
                                                data: {
                                                    completed: false,
                                                    packgePath: packgePath
                                                },
                                                success: () => {
                                                    console.log('成功保存记录')
                                                }
                                            })
                                            // 任务完成，关闭下载任务
                                            console.log('任务完成，关闭下载任务，下一次启动应用时将安装更新')
											// 安装更新
											plus.runtime.install(packgePath, { force: true });
											// 保存更新记录到stroage，方便下次启动app时删除安装包
											uni.setStorage({
												key: 'updated',
												data: {
													completed: true,
													packgePath: packgePath
												},
												success: res => {
													console.log('成功保存更新记录');
												}
											});
											// 判断是否为热更新（判断文件名中是否含有.wgt）
											if (packgePath.match(RegExp(/.wgt/))) {
												uni.showModal({
													title: '提示',
													content: '应用将重启以完成更新',
													showCancel: false,
													complete: () => {
														plus.runtime.restart();
													}
												});
											}
                                           /* downloadTask.abort()
                                            downloadTask = null */
                                        }
                                    })
                                }
                            }
                        })
                    } else {
                        console.log('下载地址未准备，无法开启下载任务')
                    }

                } else if (currentId < latestId) {
                    console.log('检测到更新')
                    uni.showModal({
                        title: '发现新版本',
                        content: '有新版本可用 (版本id:' + latestId + ')，请问您是否更新？',
                        success: (res) => {
                            if (res.confirm) {
                                uni.navigateTo({
                                    url: updaterPage
                                })
                            } else if (res.cancel) {
                                console.log('取消')
                            }
                        }
                    })
                } else {
                    console.log('现在是最新版本')
                }
            }
        }
    })
}
