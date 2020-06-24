<!-- 航班信息 - 头部信息 -->
<template>
	<view class="fight_header">
		<view class="header_message">
			<view class="header_type">{{flightData.flightType}}</view>
			<view class="header_time">{{flightData.time}}</view>
		</view>

		<view class="content_message">
			<view class="left_message address_message">
				<view class="time">{{flightData.fromTime}}</view>
				<view class="address">{{flightData.fromAddress}}</view>
			</view>
			<view class="center_message">
				<view class="duration">{{flightData.duration}}</view>
				<view class="arrow_icon"></view>
			</view>
			<view class="right_message address_message">
				<view class="time">{{flightData.toTime}}</view>
				<view class="address">{{flightData.toAddress}}</view>
			</view>
		</view>

		<view class="bottom_message">
			<image class="bottom_message_icon" src="../static/dhlogo@2x.png" mode=""></image>
			{{flightData.airline}} | {{flightData.model}} | {{flightData.food}}
		</view>
		
		<view class="flight_reservation_box" v-if="!flightInfo">
			W经济舱 | 退改签规则 | 每人托运2件,每件23KG
			<view class="message_more_btn"></view>
		</view>

	</view>
</template>

<script>
	export default {
		props: {
			flightInfo: {  // 航班信息状态 true 航班信息、 false 预定页面
				type: Boolean,
				default: () => true
			},
			flightData: {  // 航班信息数据
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style scoped lang="less">
	.fight_header {
		border-radius: 20upx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0 12upx 18upx rgba(0, 0, 0, 0.04);
		padding: 30upx 20upx 22upx;
		margin: 0 20upx 20upx;

		.header_message {
			display: flex;
			align-items: center;
			margin-bottom: 20upx;

			.header_type {
				display: inline-flex;
				padding: 2upx 20upx;
				background: linear-gradient(270deg, rgba(0, 112, 226, 1) 0%, rgba(86, 197, 255, 1) 100%);
				border-radius: 10upx;
				font-size: 20upx;
				font-weight: 400;
				color: rgba(255, 255, 255, 1);
				margin-right: 20upx;
			}

			.header_time {
				font-size: 24upx;
				font-weight: 400;
				color: rgba(42, 42, 42, 1);
			}
		}

		.content_message {
			display: flex;
			justify-content: space-between;
			margin-bottom: 26upx;

			.address_message {
				.time {
					font-size: 36upx;
					font-weight: bold;
					color: rgba(42, 42, 42, 1);
					margin-bottom: 8upx;
				}

				.address {
					font-size: 24upx;
					font-weight: 400;
					color: rgba(42, 42, 42, 1);
				}

				&.right_message {
					text-align: right;
				}
			}

			.center_message {
				font-size: 22upx;
				font-weight: 400;
				color: rgba(175, 185, 196, 1);
				position: relative;

				.arrow_icon {
					background: url(../static/ticket_path.png) no-repeat;
					background-size: contain;
					width: 113upx;
					height: 21upx;
					position: absolute;
					top: 22upx;
					left: -6upx;
				}
			}
		}

		.bottom_message {
			text-align: center;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 20upx;
			font-weight: 400;
			color: rgba(175, 185, 196, 1);

			.bottom_message_icon {
				display: inline-flex;
				width: 22upx;
				height: 16upx;
				margin-right: 8upx;
			}
		}
		
		
		.flight_reservation_box{
			border-top:1px dashed rgba(217,225,234,1);
			margin-top: 24upx;
			padding-top: 22upx;
			font-size: 24upx;
			font-weight:400;
			color:rgba(175,185,196,1);
			text-align: center;
			display: flex;
			align-items: center;
			justify-content: center;
			.message_more_btn {
				background: url(../static/arrow.png) no-repeat;
				background-size: contain;
				width: 8upx;
				height: 14upx;
				margin-left: 18upx;
				display: inline-flex;
			}
		}
		
		
	}
</style>
