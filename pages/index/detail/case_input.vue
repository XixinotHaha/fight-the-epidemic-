<template>
	<view class="quotation">
		<uni-title class="nav">
			<view slot="left" @click="back()" class="nav-left"><image src="/static/center/backGray.png" mode=""></image></view>
			<view slot="center" class="tab-bar" style="font-size: 18px;">{{ data.indexBtn }}</view>
			<view slot="right">
				<view class="nav-r" @click="toSubmit">{{data.submitBtn}}</view>
			</view>
		</uni-title>
		<view class="per">
			<view class="per_row">
				<text class="text">{{ data.checkHospital}}</text>
				<view class="row_right">
					<input type="text" class="input" v-model="checkHospital"  :placeholder="data.inputHospital" placeholder-class="placeholder" style="text-align: right;"></input>
				</view>
			</view>
			<view class="per_row">
				<text class="text">{{ data.checkDate }}</text>
				<view class="row_right">
					<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
						<view class="inputs">{{checkDate}}</view>
					</picker>
					<view class="arrow"><image src="/static/center/next.png" mode=""></image></view>
				</view>
			</view>
			<view class="per_row">
				<text class="text">{{ data.contactWay}}</text>
				<view class="row_right">
					<input type="number" class="input" v-model="contactWay"  :placeholder="data.inputContactWay"  placeholder-class="placeholder" style="text-align: right;"></input>
				</view>
			</view>
			<view class="line_box"></view>
			<view class="per_row">
				<text class="text">{{ data.sexT }}</text>
				<view class="row_right" style="font-size: 12px;">
					<picker @change="bindPickerChange" :value="sexIndex" :range="sex" name="sex">
						<view class="inputs">
							{{data.sex[sexIndex]}}
						</view>
					</picker>
					<view class="arrow"><image src="/static/center/next.png" mode=""></image></view>
				</view>
			</view>
			<view class="per_row" v-for="(item,index) in detail" :key= "index">
				<text class="text">{{industry.name =='chinese'? item.name_cn:item.name_en}}({{item.short_name}})</text>
				<view class="row_right">
					<input type="number" class="input" confirm-type="next"  @blur="inputHandle($event,item.id)" :placeholder="item.name_en=='age' ? data.inputAge:data.inputAPTT"  placeholder-class="placeholder" style="text-align: right;"></input>
					<text style="margin-left: 20upx;">{{item.unit}}</text>
				</view>
			</view>
		</view>
		<view class="buttons" @click="toSubmit">{{data.submitBtn}}</view>
	</view>
</template>

<script>
var _self;
export default {
	data() {
		const currentDate = this.getDate({
			format: true
		})
		return {
			data: getApp().globalData.data.index,
			date: currentDate,
			sexIndex: 0,
			sex: [],
			checkHospital:"",
			checkDate:"",
			contactWay:"",
			sexT:"",
			detail:{},
			dataNumber:"",
			placeholderText:"",
			quota_info:{},
			industry:""
		};
	},
	onLoad() {
		_self = this
		_self.industry = uni.getStorageSync('industry');
		if(_self.industry.name=="chinese"){
			this.data = this.$chinese[0].index
		}else{
			this.data = this.$chinese[1].index
		}
		_self.sex = this.data.sex
		this.checkDate = this.data.selectDate
		if(_self.$Route.query){
			_self.checkHospital = _self.$Route.query.check_Hospital; //检查医院
			_self.checkDate = _self.$Route.query.checkDate; //检查日期
			_self.contactWay = _self.$Route.query.contact_Way; //联系方式
		}
		_self.getList()
	},
	onShow() {
		_self.industry = uni.getStorageSync('industry');
	},
	onBackPress(option) {
		console.log(option);
	},
	computed: {
		startDate() {
			return this.getDate('start');
		},
		endDate() {
			return this.getDate('end');
		}
	},
	methods: {
		bindDateChange(e) {
			this.checkDate = e.target.value
		},
		bindPickerChange(e) {
			this.sexIndex = e.detail.value;
			this.sexT = Number(this.sexIndex)
		},
		getList(){
			_self.$ajax({
				path: _self.$api.quota_list,
				data: {
					id: _self.id
				},
				success(res) {
					let { data, code, msg } = res.data;
					_self.detail = data; //数据
					_self.detail.forEach((item,index)=>{
						_self.quota_info[item.id] = 0
					})
				}
			});
		},
		inputHandle(e,id){
			this.quota_info[id] = Number(e.detail.value)
			// console.log(Object.keys(this.quota_info).length, _self.detail.length);
		},
		getDate(type) {
			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();
		
			if (type === 'start') {
				year = year - 60;
			} else if (type === 'end') {
				year = year + 2;
			}
			month = month > 9 ? month : '0' + month;
			day = day > 9 ? day : '0' + day;
			return `${year}-${month}-${day}`;
		},
		back() {
			_self.$Router.pushTab({
				name: 'index',
				params: {}
			});
		},
		toSubmit(){
			if (this.checkHospital== '') {
				uni.showToast({
					title: this.data.inputHospital,
					icon: 'none'
				});
				return false;
			}
			if (this.checkDate == this.data.selectDate) {
				uni.showToast({
					title: this.data.selectDate,
					icon: 'none'
				});
				return false;
			}
			if (this.contactWay == '') {
				uni.showToast({
					title: this.data.inputContactWay,
					icon: 'none'
				});
				return false;
			}
			if (this.sexT == ''||this.sexT == 0) {
				uni.showToast({
					title: this.data.sex[0],
					icon: 'none'
				});
				return false;
			}

			//请求接口，成功之后跳转
			uni.showLoading({
				title: this.data.inSubmit
			});
			let formData = {
				hospital: this.checkHospital,
				check_day: this.checkDate,
				contact: this.contactWay,
				gender:this.sexT==1?"男":"女",
				quota_info:JSON.stringify(this.quota_info),
			};
			console.log(formData);
			_self.$ajax({
				path: _self.$api.create_data,
				data: formData,
				success(res) {
					let { data, code, msg } = res.data;
					uni.hideLoading();
					if (code == 1) {
						for(let i in _self.quota_info){
							if( _self.quota_info[i] == 0 ){
								uni.showToast({
									title:_self.data.infoDetail,
									icon: 'none'
								});
							}
						}
						setTimeout(() => {
							// 跳转到结果页
							_self.$Router.replace({
								name: 'pay',
								params: data
							});
						}, 2000);
					} else {
						uni.showToast({
							title: msg,
							icon: 'none'
						});
					}
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
	.page{
		height: 100%;
	}
	.buttons{
		height:88upx;
		line-height: 88upx;
		text-align: center;
		background:rgba(42,186,194,1);
		border-radius:44upx;
		margin: 85upx 32upx 0;
		// padding-bottom: 200upx;
		font-size:32upx;
		font-weight:400;
		color:rgba(255,255,255,1);
	}
	.quotation{
		padding-bottom: 85upx;
	}
	.nav-r {
		display: flex;
		justify-content: flex-end;
		font-size:28upx;
		font-weight:400;
		color:rgba(42,186,194,1);
	}
	.placeholder{
		font-size: 28upx;
	}
	.per {
		font-size: 28upx;
		background-color: #FFF;
		margin: 150upx 0 0;
		// padding-bottom: 100upx;
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
			padding: 30upx 30upx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1px solid #eeeeee;
			color: rgba(51, 51, 51, 1);
	
			.text {
				font-size: 28upx;
				width: 280upx;
			}
	
			.row_right {
				flex: 1;
				text-align: right;
				display: flex;
				justify-content: right;
				align-items: center;
				.input{
				}
				.inputs{
					color: grey;
					width: 363upx;
					font-size: 28upx;
					
				}
				.arrow{
					width: 30upx;
					height: 50upx;
					line-height: 50upx;
					margin-left: 10upx;
					image{
						width: 30upx;
						height: 50upx;
					}
				}
			}
		}
	}
	
</style>
