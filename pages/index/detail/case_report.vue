<template>
	<view class="quotation">
		<uni-title class="nav">
			<view slot="left" @click="back()" class="nav-left"><image src="/static/center/backGray.png" mode=""></image></view>
			<view slot="center" class="tab-bar" style="font-size: 18px;">{{ data.myCase }}</view>
		</uni-title>
		<view class="content">
			<mescroll-uni :fixed="false" top="0" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" @init="mescrollInit">
			<view class="item" v-for="(item,index) in list" :key="index">
				<view class="top">
					<text class="time">{{item.createtime}}</text>
					<text class="probability-value">{{data.probabilityValue}}:{{item.probability}}%</text>
				</view>
				<view class="center">
					<view class="name"><text class="left">{{data.checkHospital}} </text><text class="right">{{item.hospital}}</text></view>
					<view class="name"><text class="left">{{data.checkDate}} </text><text class="right">{{item.check_day}}</text></view>
					<view class="name"><text class="left">{{data.contactWay}} </text><text class="right">{{item.contact}}</text></view>
					<view class="name"><text class="left">{{data.sexT}} </text><text class="right">{{item.gender}}</text></view>
					<view class="name"><text class="left">{{data.age}} </text><text class="right">{{item.age}}</text></view>
				</view>
				<view class="seedetail" @click="toDetail(item.id)">{{data.seeDetail}}</view>
			</view>
			</mescroll-uni>
		</view>
	</view>
</template>

<script>
	var _self;
	export default {
		data() {
			return {
				data: getApp().globalData.data.index,
				list:[],
				mescroll: null, //mescroll实例对象
				downOption: {
					auto: true // 不自动加载
				},
				upOption: {
					auto: true, // 不自动加载
					textLoading: '正在加载',
					textNoMore: '没有更多数据了',
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10 // 每页数据的数量
					},
					noMoreSize: 1, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty: {}
				}
			};
		},
		onLoad() {
			_self = this;
			let industry = uni.getStorageSync('industry')
			if(industry.name=="chinese"){
				this.data = this.$chinese[0].index
			}else{
				this.data = this.$chinese[1].index
			}
		},

		computed: {},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			mescrollInit(mescroll) {
				_self.mescroll = mescroll;
			},
			downCallback(mescroll) {
				_self.getListDataFromNet(
					0,
					1,
					data => {
						mescroll.endSuccess();
						_self.mescroll.resetUpScroll();
					},
					() => {
						mescroll.endErr();
					}
				);
			},
			upCallback(mescroll) {
				_self.getListDataFromNet(
					mescroll.num,
					mescroll.size,
					curPageData => {
						mescroll.endSuccess(curPageData.length);
						if (mescroll.num == 1) _self.list = []; //如果是第一页需手动制空列表
						_self.list = _self.list.concat(curPageData); //追加新数据
					},
					() => {
						mescroll.endErr();
					}
				);
			},
			getListDataFromNet(pageNum, pageSize, successCallback, errorCallback) {
				//数据请求
				_self.$ajax({
					path: _self.$api.test_sheet_list,
					data: {
						page: pageNum,
						pagesize: pageSize
					},
					success(res) {
						let {
							data,
							code,
							msg
						} = res.data;
						let listData = [];
						listData = data.list; //数据
						successCallback && successCallback(listData);
					}
				});
			},

			toDetail(id){
				console.log(id);
				this.$Router.push({
					name: "detail",
					params: {
						id:id
					}
				});
			}
		},

	};
</script>

<style lang="scss">
	page{
		background-color: #FAFAFA;
		height: 100%;
	}
	.quotation {
		padding-bottom: 50upx;
		.content{
			margin-top: 120upx;
			padding: 0 32upx;
			.item{
				padding: 20upx;
				margin:30upx 0 ;
				background-color: #fff;
				position: relative;
				.top{
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 30upx;
					.time{
						font-size:28upx;
						font-weight:500;
						color:rgba(51,51,51,1);
					}
					.probability-value{
						font-size:28upx;
						font-weight:500;
						line-height:40upx;
						color:rgba(42,186,194,1);
					}
				}
				.seedetail{
					width: 200upx;
					height:50upx;
					font-size:24upx;
					font-weight:400;
					line-height:50upx;
					color:rgba(42,186,194,1);
					background:rgba(255,255,255,1);
					border:1upx solid rgba(42,186,194,1);
					border-radius:25upx;
					text-align: center;
					position: absolute;
					bottom: 60upx;
					right: 30upx;
				}
			}
			.name{
				margin-bottom: 54upx;
				font-size:28upx;
				font-weight:400;
				line-height:40upx;
				color:rgba(51,51,51,1);
				display: flex;
				.left{
					width: 250upx;
					color: #999;
				}
				.right{
					color: #333;
				}
			}
		}
	}
</style>
