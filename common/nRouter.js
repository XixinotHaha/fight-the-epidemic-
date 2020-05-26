import {routers} from "@/common/router.js"
function getPath(name){
	let path;
	routers.forEach((item,index)=>{
		if(item.name === name){
			path =  item.path
		}
	})
	return path;
}

function setParams(params){
	return '?query=' + encodeURIComponent(JSON.stringify(params))
}

let nRouter = {
	query(options){
		return JSON.parse(decodeURIComponent(options.query));
	},
	push(options){
		if(!options.name){
			console.log('请检查nvue页面路由跳转');
			return;
		}
		uni.navigateTo({
			url:getPath(options.name)+setParams(options.params)
		})
	},
	replace(options){
		if(!options.name){
			console.log('请检查nvue页面路由跳转');
			return;
		}
		uni.redirectTo({
			url:getPath(options.name)+setParams(options.params)
		})
	},
	replaceAll(options){
		if(!options.name){
			console.log('请检查nvue页面路由跳转');
			return;
		}
		uni.reLaunch({
			url:getPath(options.name)+setParams(options.params)
		})
	},
	pushTab(options){
		if(!options.name){
			console.log('请检查nvue页面路由跳转');
			return;
		}
		uni.switchTab({
			url:getPath(options.name)+setParams(options.params)
		})
	},
	back(){
		uni.navigateBack({
			delta:delta
		})
	}
	
}
module.exports = nRouter;















