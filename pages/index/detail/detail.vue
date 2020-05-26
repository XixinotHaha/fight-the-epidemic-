<template>
	<view class="page">
		<uni-title class="nav">
			<view slot="left" @click="back()" class="nav-left"><image src="/static/center/backGray.png" mode=""></image></view>
			<view slot="center" class="tab-bar" style="font-size: 18px;">{{ data.myCaseDetail }}</view>
		</uni-title>
		<view class="per">
			<view class="image">
				<image src="/static/center/detailbgc.png" mode=""></image>
				<view class="position">
					<view class="top">{{data.probabilityValue}}</view>
					<view class="bottom">{{detail.probability}}<text>%</text></view>
				</view>
			</view>
			<view class="per_row">
				<text>{{ data.checkHospital}}</text>
				<view class="row_right">
					<text class="aa">{{detail.hospital}}</text>
				</view>
			</view>
			<view class="per_row">
				<text>{{ data.checkDate }}</text>
				<view class="row_right">
					<text class="aa">{{detail.check_day}}</text>
				</view>
			</view>
			<view class="per_row">
				<text>{{ data.contactWay}}</text>
				<view class="row_right">
					<text class="aa">{{detail.contact}}</text>
				</view>
			</view>

			<view class="line_box"></view>
			<view class="per_row">
				<text>{{ data.sexT }}</text>
				<view class="row_right">
					<text class="aa">{{detail.gender}}</text>
				</view>
			</view>
			<view class="per_row" v-for="(item,index) in detail.info" :key="index">
				<text>{{industry.name=='chinese'? item.name_cn:item.name_en}}({{item.short_name}})</text>
				<view class="row_right">
					<text class="aa">{{item.val}}</text><text>{{item.unit}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
var _self;
export default {
	data() {
		return {
			data: getApp().globalData.data.index,
			id:"",
			detail:{},
			industry:""
		};
	},
	onLoad() {
		_self = this, 
		_self.id = _self.$Route.query.id; //病例id
		
		_self.industry = uni.getStorageSync('industry');
		if(_self.industry.name=="chinese"){
			this.data = this.$chinese[0].index
		}else{
			this.data = this.$chinese[1].index
		}
		_self.detailInfo();
	},
	onShow() {
		_self.industry = uni.getStorageSync('industry');
		if(_self.industry.name=="chinese"){
			this.data = this.$chinese[0].index
		}else{
			this.data = this.$chinese[1].index
		}
	},
	onBackPress(option) {
		console.log(option);
	},
	methods: {
		back() {
			uni.navigateBack({
				delta: 1
			});
		},
		//详情
		detailInfo() {
			_self.$ajax({
				path: _self.$api.test_sheet_detail,
				data: {
					id: _self.id
				},
				success(res) {
					let { data, code, msg } = res.data;
					_self.detail = data; //数据
					console.log(data);
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
	.page{
		margin-bottom: 100upx;
	}
	.per {
		font-size: 28upx;
		background-color: #FFF;
		margin-top: 130upx;
		.image{
			width: 100%;
			height: 259upx;
			padding: 32upx;
			margin-bottom: 50upx;
			position: relative;
			image{
				height: 259upx;
				width:100% ;
			}
			.position{
				position: absolute;
				width: 100%;
				height: 259upx;
				padding: 32upx;
				left: 0;
				top: 32upx;
				display: flex;
				flex-direction: column;
				align-items: center;
				.top{
					height:80upx;
					font-size:28upx;
					font-weight:400;
					line-height:80upx;
					color:rgba(255,255,255,1);
					opacity:0.8;
				}
				.bottom{
					height:100upx;
					font-size:46upx;
					font-family:DIN;
					font-weight:900;
					line-height:100upx;
					color:rgba(255,255,255,1);
					text{
						font-size: 32upx;
					}
				}
			}
		}
		
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
	
</style>
