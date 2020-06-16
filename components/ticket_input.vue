<template>
	<view class="ticket_input">
		<view class="ticket_address">
			<view class="to_input address_input" @click="tocketToBtn">{{addressForm.to}}</view>
			<view class="check_toform_btn" @click="checkTickedBtn">
				<image class="ticket_image" src="../static/ticket_btn.png"></image>
			</view>
			<view class="from_input address_input" @click="tocketFromBtn">{{addressForm.from}}</view>
		</view>

		<view class="ticket_time">
			<view class="ticket_to_time time_box">
				<view class="time_true" v-if="addressForm.toTime">
					<view class="time">{{addressForm.toTime}}</view>
					<view class="time_day">明天出发</view>
				</view>
				<view v-else class="time_false">
					<image class="time_icon" src="../static/from_time.png"></image>
					<text class="time_text">出发日期</text>
				</view>
			</view>
			<view class="ticket_from_time time_box">
				<view class="time_true" v-if="addressForm.fromTime">
					<image class="close_from_btn" src="../static/close.png" @click="closeFromBtn" />
					<view class="time">{{addressForm.fromTime}}</view>
					<view class="time_day">{{addressForm.fromDay}}返回</view>
				</view>
				<view v-else class="time_false">
					<image class="time_icon" src="../static/from_time.png"></image>
					<text class="time_text">返程日期</text>
				</view>
			</view>
		</view>
		

		<view class="child_box" v-if="ticketType !== '国内'">
			<view class="child_message" @click="openChildMessageBtn">儿婴票说明<image class="child_message_more" src="../static/arrow.png" mode=""></image>
			</view>
			
			
			<view class="passenger_message" @click="openPassengerNumber">
				<view class="passenger_list">
					<text>成人</text>
					<text class="number">{{passengerForm.adultNumber}}</text>
				</view>
				<view class="passenger_list">
					<text>儿童</text>
					<text class="number">{{passengerForm.childNumber}}</text>
				</view>
				<view class="passenger_list">
					<text>婴儿</text>
					<text class="number">{{passengerForm.babyNumber}}</text>
				</view>
				<image class="open_number_more" src="../static/number_more_btn.png" mode=""></image>
			</view>
			
			<!--
			<view class="child_setting">
				<view class="child_main">
					<text class="number_name">儿童</text>
					<view class="number_box">
						<view :class="['remove_number number_icon',{active: addressForm.childNumber > 0}]" @click="removeChildNumber"></view>
						<view class="number">{{addressForm.childNumber}}</view>
						<view class="add_number number_icon" @click="addChildNumber"></view>
					</view>
				</view>
				
				<view class="child_main">
					<text class="number_name">婴儿</text>
					<view class="number_box">
						<view :class="['remove_number number_icon',{active: addressForm.babyNumber > 0}]" @click="removeBabyNumber"></view>
						<view class="number">{{addressForm.babyNumber}}</view>
						<view class="add_number number_icon" @click="addBabyNumber"></view>
					</view>
				</view>
			</view>
			-->
		</view>


		<view class="submit_btn" @click="submitTicket">飞机票查询</view>
		
		<uni-popup ref="popup" type="message">
		    <uni-popup-message type="success" message="成功消息" :duration="0"></uni-popup-message>
		</uni-popup>
		
	</view>
</template>

<script>
	export default {
		props: {
			ticketType: {
				type: String,
				default: () => ''
			}
		},
		data() {
			return {
				addressForm: {
					to: '重庆',  // 出发地
					from: '北京',  // 到达地
					toTime: '04月15日',  // 出发时间
					fromTime: '04月22日',  // 到达时间
					fromDay: '周三',  // 到达日期
				},
				passengerForm: {
					adultNumber: 0, // 成年人数量
					childNumber: 0,  // 儿童数量
					babyNumber: 0,  // 婴儿数量
				},
			};
		},
		methods: {
			// 出发按钮
			tocketToBtn() {
				console.log('选择出发地')
			},
			// 切换出发返程地
			checkTickedBtn() {
				let toAddress = this.addressForm.to
				let fromAddress = this.addressForm.from
				this.addressForm.to = fromAddress
				this.addressForm.from = toAddress
				console.log('交换出发返程地')
			},
			// 返程按钮
			tocketFromBtn() {
				console.log('选择返程地')
			},
			// 清除返程按钮
			closeFromBtn() {
				console.log('清除返程')
				this.addressForm.fromTime = ''
				this.addressForm.fromDay = ''
			},
			
			// 儿婴票说明 
			openChildMessageBtn(){
				
			},
			
			
			// 打开乘客数量弹窗
			openPassengerNumber(){
				console.log('打开乘机人数选择')
				 uni.$emit('openChild', this.passengerForm)
			},
			
			/**
			// 增加儿童数量
			addChildNumber(){
				console.log('增加儿童数量')
				this.addressForm.childNumber = this.addressForm.childNumber + 1
			},
			// 减少儿童数量
			removeChildNumber(){
				console.log('减少儿童数量')
				if(this.addressForm.childNumber > 0){
					this.addressForm.childNumber = this.addressForm.childNumber - 1
				}
			},
			
			// 增加婴儿数量
			addBabyNumber(){
				console.log('增加婴儿数量')
				this.addressForm.babyNumber = this.addressForm.babyNumber + 1
			},
			// 减少婴儿数量
			removeBabyNumber(){
				console.log('减少婴儿数量')
				if(this.addressForm.babyNumber > 0){
					this.addressForm.babyNumber = this.addressForm.babyNumber - 1
				}
			},
			*/
			
			
			// 提交按钮
			submitTicket() {
				console.log('提交')
			},
		},
		
		mounted() {
			uni.$on('saveChild', (e) => {
				if(e){
					this.passengerForm = e
				}
			})
		}
		
	}
</script>

<style scoped lang="less">
	.ticket_input {
		padding-bottom: 50upx;
		.ticket_address {
			display: flex;
			align-items: flex-start;

			.address_input {
				height: 65upx;
				line-height: 50upx;
				border-bottom: 1px solid #E0E0E0;
				font-size: 42upx;
				font-weight: bold;
				color: rgba(42, 42, 42, 1);
				width: 100%;

				&.from_input {
					text-align: right;
				}
			}

			.check_toform_btn {
				flex-shrink: 0;
				margin: 0 40upx;
				display: inline-flex;
				align-items: center;
				justify-content: center;

				.ticket_image {
					width: 70upx;
					height: 70upx;
					object-fit: cover;
				}
			}
		}


		.ticket_time {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 70upx;
			margin-top: 20upx;
			border-bottom: 2upx solid #DFDFDF;

			.time_box {
				.time_true {
					display: flex;
					align-items: center;

					.close_from_btn {
						width: 30upx;
						height: 30upx;
						object-fit: contain;
						margin-right: 16upx;
					}

					.time {
						font-size: 32upx;
						font-weight: 400;
						line-height: 38upx;
						color: rgba(42, 42, 42, 1);
					}

					.time_day {
						height: 36upx;
						font-size: 24upx;
						font-weight: 400;
						line-height: 28upx;
						color: rgba(42, 42, 42, 1);
						margin-left: 12upx;
						display: inline-flex;
						align-items: flex-end;
					}
				}

				.time_false {
					.time_icon {
						width: 30upx;
						height: 30upx;
						margin-right: 12upx;
					}

					.time_text {
						font-size: 32upx;
						font-weight: 400;
						line-height: 38upx;
						color: rgba(175, 185, 196, 1);
					}
				}
			}
		}


		.child_box {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 50upx;

			.child_message {
				display: inline-flex;
				align-items: center;
				font-size: 22upx;
				font-weight: 400;
				color: rgba(175, 185, 196, 1);

				.child_message_more {
					width: 10upx;
					height: 16upx;
					object-fit: contain;
					margin-left: 10upx;
				}
			}
			
			.passenger_message{
				display: inline-flex;
				align-items: center;
				.passenger_list{
					display: inline-flex;
					align-items: center;
					font-size: 28upx;
					font-weight:500;
					color:rgba(153,153,153,1);
					&:not(:first-child){
						margin-left: 26upx;
					}
					.number{
						font-size: 30upx;
						font-weight:bold;
						color:rgba(42,42,42,1);
						margin-left: 8upx;
					}
				}
				.open_number_more{
					margin-left: 12upx;
					width: 16upx;
					height: 12upx;
					object-fit: contain;
					display: inline-flex;
					align-items: center;
					justify-content: center;
				}
			}

			/**
			.child_setting {
				display: inline-flex;
				align-items: center;
				.child_main{
					display: inline-flex;
					align-items: center;
					&:not(:last-child){
						margin-right: 40upx;
					}
					.number_name {
						font-size: 28upx;
						font-weight: 500;
						color: rgba(42, 42, 42, 1);
						margin-right: 16upx;
					}
					
					.number_box {
						display: inline-flex;
						align-items: center;
						
						.number{
							font-size: 28upx;
							font-weight:500;
							color:rgba(42,42,42,1);
							margin: 0 16upx;
						}
					
						.number_icon {
							width: 36upx;
							height: 36upx;
					
							&.remove_number {
								background: url(../static/number_remove_btn.png) no-repeat;
								background-size: contain;
								&.active{
									background: url(../static/number_remove_btn_active.png) no-repeat;
									background-size: contain;
								}
							}
							&.add_number{
								background: url(../static/number_add_btn.png);
								background-size: contain;
							}
						}
					}		
				}
			}
			*/

		}

		.submit_btn {
			width: 650upx;
			height: 90upx;
			background: rgba(0, 112, 226, 1);
			box-shadow: 0 6upx 12upx rgba(0, 112, 226, 0.3);
			border-radius: 80upx;
			margin: 50upx auto 0;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 32upx;
			font-weight: 400;
			line-height: 38upx;
			color: rgba(255, 255, 255, 1);
			letter-spacing: 10upx;
		}

		
	}
</style>
