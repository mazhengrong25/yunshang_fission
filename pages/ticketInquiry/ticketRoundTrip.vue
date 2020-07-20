<!--
 * @Description: 机票查询 - 国内往返
 * @Author: wish.WuJunLong
 * @Date: 2020-07-20 16:32:48
 * @LastEditTime: 2020-07-20 17:50:20
 * @LastEditors: wish.WuJunLong
--> 
<template>
	<view class="ticketRoundTrip">
		<!-- 导航栏 -->
		<voyage-header :statusHeight="iStatusBarHeight" :statusType="true" :headerAddress="ticketAddress"></voyage-header>
		<!-- 往返时间 -->
		<view class="header_time">
			<round-trip-header></round-trip-header>
		</view>
		<!-- 航班列表 -->
		<view class="flight_list">
			<view 
				class="flight_box" 
				v-for="(item, index) in flightList" 
				:key="index"
				@click="checkedFlight(item)">
					<view class="box_top">
						<view class="top_time start_time">
							<view class="time">{{item.toTime}}</view>
							<view class="address">{{item.toAddress}}</view>
						</view>
						<view class="flight_line">
							<view class="time">{{item.time}}</view>
							<view class="line_icon"></view>
						</view>
						<view class="top_time end_time">
							<view class="time">{{item.fromTime}}</view>
							<view class="address">{{item.fromAddress}}</view>
						</view>
					</view>
					<view class="total_price_message">
						<text v-if="!item.premium && item.totalPrice">往返总价</text>
					</view>
					<view class="flight_bottom">
						<view class="airlines">
							<image class="airlines_icon" src="../../static/ticket_icon.png" mode="" />
							{{item.airlines}}
						</view>
						<view class="price">
							<view class="price_mini" v-if="item.premium && !item.totalPrice">补</view>
							<view class="price_mini">&yen;</view>
							<text>{{item.totalPrice}}</text>
							<text>{{item.premium}}</text>
							<view class="price_mini" v-if="!item.premium && item.totalPrice">起</view>
						</view>
					</view>

			</view>




		</view>

	</view>
</template>

<script>
	import voyageHeader from "@/components/voyage_header.vue"  // 自定义状态栏	
	import roundTripHeader from "@/components/roundTrip_header.vue"  // 往返日期状态栏
	export default {
		components: {
			voyageHeader,
			roundTripHeader
		},
		data() {
			return {
				iStatusBarHeight: 0, // 导航栏高度
				ticketAddress: {  // 导航栏地址
					to: '重庆',
					from: '上海'
				},

				flightList: [  // 航班信息
					{
						toTime: '08:00',  // 出发时间
						toAddress: '江北T3',  // 出发地址
						time: '2h30m',  // 时长
						fromTime: '10:30',  // 到达时间
						fromAddress: '大兴',  // 到达地址
						airlines: '南航CZ2801',  // 航司
						totalPrice: '665',  // 总价
						premium: '',
					},
					{
						toTime: '08:00',  // 出发时间
						tiAddress: '江北T3',  // 出发地址
						time: '2h30m',  // 时长
						fromTime: '10:30',  // 到达时间
						fromAddress: '大兴',  // 到达地址
						airlines: '南航CZ2801',  // 航司
						totalPrice: '',  // 总价
						premium: '20',
					},
					{
						toTime: '08:00',  // 出发时间
						tiAddress: '江北T3',  // 出发地址
						time: '2h30m',  // 时长
						fromTime: '10:30',  // 到达时间
						fromAddress: '大兴',  // 到达地址
						airlines: '南航CZ2801',  // 航司
						totalPrice: '',  // 总价
						premium: '20',
					},
					{
						toTime: '08:00',  // 出发时间
						tiAddress: '江北T3',  // 出发地址
						time: '2h30m',  // 时长
						fromTime: '10:30',  // 到达时间
						fromAddress: '大兴',  // 到达地址
						airlines: '南航CZ2801',  // 航司
						totalPrice: '',  // 总价
						premium: '20',
					},
					{
						toTime: '08:00',  // 出发时间
						tiAddress: '江北T3',  // 出发地址
						time: '2h30m',  // 时长
						fromTime: '10:30',  // 到达时间
						fromAddress: '大兴',  // 到达地址
						airlines: '南航CZ2801',  // 航司
						totalPrice: '',  // 总价
						premium: '20',
					}
				],

			};
		},
		methods: {
			// 选择航班
			checkedFlight(val){
				console.log(val)
			},
		},
		onLoad() {
			this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight
		}
	}
</script>

<style lang="less">
	.ticketRoundTrip{
		background:rgba(243,245,247,1);
		.header_time{
			background:rgba(0,112,226,1);
			padding: 20upx;
		}
		.flight_list{
			padding: 20upx;
			.flight_box{
				background:rgba(255,255,255,1);
				box-shadow:0 12upx 18upx rgba(0,0,0,0.04);
				padding: 28upx 16upx 16upx;
				display: inline-flex;
				flex-direction: column;
				width: 45%;
				margin-bottom: 4upx;
				&:first-child,
				&:nth-child(2){
					border-radius: 20upx 20upx 0 0;
				}
				&:not(:nth-child(2n)){
					margin-right: 7upx;
				}
				.box_top{
					display: flex;
					align-items: flex-start;
					margin-bottom: 18upx;
					.top_time{
						.time{
							font-size: 34upx;
							font-weight:bold;
							color:rgba(42,42,42,1);
							margin-bottom: 4upx;
						}
						.address{
							font-size: 22upx;
							font-weight:400;
							color:rgba(42,42,42,1);
						}
					}
					.flight_line{
						display: flex;
						align-items: center;
						justify-content: center;
						flex-direction: column;
						font-size: 22upx;
						font-weight:400;
						color:rgba(175,185,196,1);
						margin: 0 28upx;
						.line_icon{
							background: url(../../static/ticket_path.png) no-repeat center center;
							background-size: contain;
							width: 80upx;
							height: 14upx;
						}
					}
				}
				.total_price_message{
					font-size:10px;
					font-weight:400;
					color:rgba(175,185,196,1);
					text-align: right;
					margin-bottom: 6upx;
					height: 28upx;
				}
				.flight_bottom{
					display: flex;
					align-items: baseline;
					justify-content: space-between;
					.airlines{
						font-size: 20upx;
						font-weight:400;
						color:rgba(175,185,196,1);
						display: inline-flex;
						align-items: center;
						.airlines_icon{
							width: 20upx;
							height: 14upx;
							object-fit: contain;
							margin-right: 12upx;
						}
					}
					.price{
						display: inline-flex;
						align-items: baseline;
						font-size: 36upx;
						font-weight:bold;
						color:rgba(255,0,0,1);
						.price_mini{
							font-size: 22upx;
							margin: 0 3upx;
						}
					}
				}
			}
		}
	}
</style>
