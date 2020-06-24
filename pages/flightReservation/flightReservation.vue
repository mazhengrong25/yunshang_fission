<template>
	<view class="flight_reservation">
		<flight-header :flightInfo="false" :flightData="flightData"></flight-header>
		
		<view class="passenger_box box-shadow-style">
			<view class="passenger_title">
				<view class="title_text">乘机人</view>
				<view class="add_passenger_btn">添加乘机人</view>
			</view>
		</view>
		
		<view class="order_passenger_message box-shadow-style">
			<view class="title_text title_required">订单联系人信息</view>
			
			<view class="order_passenger_form">
				<view class="form_item">
					<view class="form_item_title">联系人</view>
					<input class="form_item_input" 
						type="text" 
						placeholder="请填写姓名" 
						placeholder-style="fontSize: 28upx;fontWeight:400;color:rgba(175,185,196,1);" 
						v-model="orderPassenger.userName">
				</view>
				<view class="form_item">
					<view class="form_item_title">手机号</view>
					<input class="form_item_input" 
						type="number" 
						placeholder="用于接收订单通知" 
						placeholder-style="fontSize: 28upx;fontWeight:400;color:rgba(175,185,196,1);" 
						v-model="orderPassenger.telPhone">
				</view>
				
			</view>
			
		</view>
		
		
		
	</view>
</template>

<script>
	import flightHeader from '@/components/flight_header.vue'
	export default {
		components: {
			flightHeader
		},
		data() {
			return {
				flightData: { // 航班头部信息
					flightType: '单程', // 航程类型
					time: '2020-4-18 周六', // 航程日期
					fromTime: '08:00', // 出发时间
					fromAddress: '重庆江北机场T3', // 出发机场
					duration: '2h30m', // 飞行时长
					toTime: '10:32', // 到达时间
					toAddress: '北京首都机场T3', // 到达机场
					airline: '南航', // 航司
					model: '空客A320(中)', // 机型
					food: '有早餐', // 餐饮
				},
				orderPassenger: {  // 订单联系人信息
					userName: '',  // 联系人
					telPhone: '',  // 手机号
				},
			};
		}
	}
</script>

<style scoped lang="less">
	.flight_reservation{
		padding-top: 20upx;
		background:rgba(243,245,247,1);
		height: 100vh;
		overflow-y: auto;
		.passenger_box{
			padding: 24upx 20upx;
			margin-bottom: 20upx;
			.passenger_title{
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				
				.add_passenger_btn{
					display: inline-flex;
					align-items: center;
					justify-content: center;
					height: 50upx;
					border: 2upx solid rgba(0,112,226,1);
					border-radius: 30upx;
					font-size: 24upx;
					font-weight:400;
					color:rgba(0,112,226,1);
					padding: 0 20upx;
				}
			}
		}
		.order_passenger_message{
			padding: 24upx 20upx;
			.order_passenger_form{
				margin-top: 12upx;
				.form_item{
					display: flex;
					align-items: center;
					padding: 24upx 0 34upx;
					&:not(:last-child){
						border-bottom: 2upx solid rgba(241,243,245,1);
					}
					.form_item_title{
						font-size: 26upx;
						font-weight:400;
						color:rgba(42,42,42,1);
						margin-right: 30upx;
					}
					.form_item_input{
						padding-left: 10upx;
					}
					.input_style{
						font-size: 28upx;
						font-weight:400;
						color:rgba(175,185,196,1);
					}
				}
			}
		}
	}
</style>
