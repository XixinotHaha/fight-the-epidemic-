<template>
	<view class="grace-body">
		<view class="grace-form grace-margin-top">
			<uni-title class="nav">
				<view slot="left" @click="back()" class="nav-left"><image src="/static/center/backGray.png" mode=""></image></view>
				<view slot="center" class="tab-bar" style="font-size: 18px;">{{ data.checkBasic }}</view>
			</uni-title>
			<view class="content-box">
				<view class="item">
					<view class="title">1.{{ data.cough }}</view>
					<radio-group class="uni-list" @change="radioChange($event,1)">
						<view class="label"><radio style="transform:scale(0.7)" value="1" :color="color" :checked="checked"></radio><text class="yes-no">{{data.isYes}}</text></view>
						<view  class="label"><radio style="transform:scale(0.7)" value="0" :color="color" :checked="checked"></radio><text class="yes-no">{{data.isNot}}</text></view>
					</radio-group>
					<view class="cu-item ">
						<view class="content" style="display: flex;justify-content: space-between;align-items: center;">
							<text class="text-grey">{{data.coughDays}}</text>
							<input type="text" class="input" maxlength="12" name="name" v-model="coughDays"
							 :placeholder="data.inputCoughDays" style="text-align: right;font-size: 14px;"></input>
						</view>
					</view>
				</view>
				<view class="item">
					<view class="title">2.{{ data.fever }}</view>
					<radio-group class="uni-list" @change="radioChange($event,2)">
						<view  class="label"><radio style="transform:scale(0.7)" value="1" :color="color" :checked="checked"></radio><text class="yes-no">{{data.isYes}}</text></view>
						<view  class="label"><radio style="transform:scale(0.7)" value="0" :color="color" :checked="checked"></radio><text class="yes-no">{{data.isNot}}</text></view>
					</radio-group>
				</view>
				<view class="item">
					<view class="title">3.{{ data.breath }}</view>
					<radio-group class="uni-list" @change="radioChange($event,3)">
						<view  class="label"><radio style="transform:scale(0.7)" value="1" :color="color" :checked="checked"></radio><text class="yes-no">{{data.isYes}}</text></view>
						<view  class="label"><radio style="transform:scale(0.7)" value="0" :color="color" :checked="checked"></radio><text class="yes-no">{{data.isNot}}</text></view>
					</radio-group>
				</view>
				<view class="item">
					<view class="title">4.{{ data.travel }}</view>
					<radio-group class="uni-list" @change="radioChange($event,4)">
						<view  class="label"><radio style="transform:scale(0.7)" value="1" :color="color" :checked="checked"></radio><text class="yes-no">{{data.isYes}}</text></view>
						<view  class="label"><radio style="transform:scale(0.7)" value="0" :color="color" :checked="checked"></radio><text class="yes-no">{{data.isNot}}</text></view>
					</radio-group>
				</view>
				<view class="item">
					<view class="title">5.{{ data.suspected }}</view>
					<radio-group class="uni-list" @change="radioChange($event,5)">
						<view  class="label"><radio style="transform:scale(0.7)" value="1" :color="color" :checked="checked"></radio><text class="yes-no">{{data.isYes}}</text></view>
						<view  class="label"><radio style="transform:scale(0.7)" value="0" :color="color" :checked="checked"></radio><text class="yes-no">{{data.isNot}}</text></view>
					</radio-group>
				</view>
				<view class="btn" @click="formSubmit">{{ data.enterIndex }}</view>
			</view>
		</view>
	</view>
</template>
<script>
var _self;
export default {
	data() {
		return {
			data: getApp().globalData.data.center,
			checked:true,
			cough:"",
			coughDays:"",
			fever:"",
			breath:"",
			travel:"",
			suspected:"",
			color:"#2ABAC2"
		};
	},
	onLoad(option) {
		_self = this;
		let industry = uni.getStorageSync('industry');
		if (industry.name == 'chinese') { 
			this.data = this.$chinese[0].center;
		} else {
			this.data = this.$chinese[1].center;
		}
	},
	methods: {
		back() {
			uni.navigateBack({
				delta: 1
			});
		},
		radioChange(e,type) {
			var checked = e.target.value;
			console.log(type);
			console.log(checked);
			if(type==1){
				this.cough = checked==1?1:0
			}
			if(type==2){
				this.fever = checked==1?1:0
			}
			if(type==3){
				this.breath = checked==1?1:0
			}
			if(type==4){
				this.travel = checked==1?1:0
			}
			if(type==5){
				this.suspected = checked==1?1:0
			}
			
		},
		formSubmit(e) {
			//form提交
			var formData = {
				is_cough:this.cough?this.cough:0,
				cough_number:this.coughDays,
				is_heat:this.fever?this.fever:0,
				is_gasp:this.breath?this.breath:0,
				is_travel:this.travel?this.travel:0,
				is_contact:this.suspected?this.suspected:0,
			};
			console.log(formData);
			_self.$ajax({
				path: _self.$api.symptom_add,
				data: formData,
				success(res) {
					let {
						data,
						code,
						msg
					} = res.data;
					uni.hideLoading();
					if (code == 1) {
						_self.$Router.pushTab({
							name: 'index',
							params: {}
						});
					} else {
						uni.showToast({
							title: msg,
							icon: 'none'
						});
					}
				}
			
			})
			
		}
	}
};
</script>
<style lang="scss">
page {
	height: 100%;
	background-color: #F8F8F8;
	
}
.btn {
	color: #fff;
	width: 90%;
	height: 90upx;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #2abac2;
	font-size: 40upx;
	border-radius: 45upx;
	border: 1upx solid #2abac2;
	margin: 0 5%;
	margin-top: 50upx;
}

.content-box {
	padding: 88upx 0 ;
	margin-top: 62upx;
	.item{
		padding: 32upx 32upx 0;
		margin-bottom: 20upx;
		background-color: #ffffff;
		.title{
			font-size:32upx;
			font-weight:400;
			line-height:45upx;
			color:rgba(51,51,51,1);
			margin-bottom: 40upx;
		}
		.label{
			margin-bottom: 44upx;
			display: flex;
			align-items: center;
			radio{
				margin-right: 30upx;
			}
			text{
				font-size:32upx;
				font-weight:400;
				color:rgba(51,51,51,1);
			}
		}
		.cu-item{
			padding-bottom: 32upx;
		}
	}
}
</style>
