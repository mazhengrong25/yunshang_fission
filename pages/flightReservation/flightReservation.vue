<template>
	<view class="flight_reservation">
		<voyage-header :statusHeight="iStatusBarHeight" :headerBottom="Number(10)"></voyage-header>
		<scroll-view :scroll-y="true" class="flight_reservation_main">
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
						<input class="form_item_input" type="text" placeholder="请填写姓名" placeholder-style="fontSize: 28upx;fontWeight:400;color:rgba(175,185,196,1);"
						 v-model="orderPassenger.userName">
					</view>
					<view class="form_item">
						<view class="form_item_title">手机号</view>
						<input class="form_item_input" type="number" placeholder="用于接收订单通知" placeholder-style="fontSize: 28upx;fontWeight:400;color:rgba(175,185,196,1);"
						 v-model="orderPassenger.telPhone">
					</view>

				</view>

			</view>


			<view class="insurance_list box-shadow-style">
				<view class="title_text">
					<image class="title_icon" src="../../static/insurance.png" mode="aspectFill"></image>购买保险
				</view>
				<view class="insurance_box">
					<view class="insurance_box_item" v-for="(item, index) in insuranceList" :key="index" @click="changeInsurance(item)">
						<view class="item_name">{{item.value}}</view>
						<view class="item_check">
							<view class="item_price"><text>&yen; {{item.checked}}</text>/份</view>
							<view :class="['item_icon',{'is_active':insuranceActive.value === item.value}]"></view>
						</view>
					</view>
				</view>
			</view>

			<view class="reward_list box-shadow-style">
				<view class="title_text">
					<image class="title_icon" src="../../static/reward.png" mode="aspectFill"></image>本单奖励
				</view>
				<view class="reward_box">
					<view class="reward_list">
						<view class="list_name">奖励金</view>

						<view class="list_price">&yen; 12</view>
					</view>
					<view class="reward_list">
						<view class="list_name">返点</view>

						<view class="list_price">&yen; 5</view>
					</view>

				</view>
			</view>

			<view class="disclaimer">
				免责声明：下单表示已阅读并同意遵守退改签规则
				<text>《关于规范互联网机票销售行为的通知》</text>
				<text>《山东航运输总条件》</text>
				<text>《锂电池航空运输规范》</text>
			</view>

		</scroll-view>

		<view class="bottom_bar">
			<view class="left_message">
				<view class="not_pass_message">请先添加乘机人</view>
			</view>
			<view class="right_btn">去支付</view>
		</view>
	</view>
</template>

<script>
	import voyageHeader from "@/components/voyage_header.vue" // 自定义状态栏
	import flightHeader from '@/components/flight_header.vue' // 航程信息
	export default {
		components: {
			flightHeader,
			voyageHeader
		},
		data() {
			return {
				iStatusBarHeight: 0, // 状态栏高度
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
				orderPassenger: { // 订单联系人信息
					userName: '', // 联系人
					telPhone: '', // 手机号
				},
				insuranceList: [{ // 保险列表
					value: '众安航意险20元(保额80万）',
					checked: 20
				}, {
					value: '众安航意险30元(保额320万）',
					checked: 30
				}, {
					value: '众安航意险40元(保额420万）',
					checked: 40
				}, {
					value: '众安航意险50元(保额500万）',
					checked: 50
				}],
				insuranceActive: '', // 选择保险
			};
		},
		methods: {
			changeInsurance(val) {
				this.insuranceActive = val !== this.insuranceActive ? val : ''
				console.log(this.insuranceActive)
			},
		},
		onLoad() {
			this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight
		}
	}
</script>

<style scoped lang="less">
	.flight_reservation {
		background: rgba(243, 245, 247, 1);
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100vh;
		.flight_reservation_main{
			flex: 1;
			height: calc(100% - 400rpx);

		}

		.box-shadow-style {
			margin-top: 26upx;
		}

		.passenger_box {
			padding: 24upx 20upx;

			.passenger_title {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.add_passenger_btn {
					display: inline-flex;
					align-items: center;
					justify-content: center;
					height: 50upx;
					border: 2upx solid rgba(0, 112, 226, 1);
					border-radius: 30upx;
					font-size: 24upx;
					font-weight: 400;
					color: rgba(0, 112, 226, 1);
					padding: 0 20upx;
				}
			}
		}

		.order_passenger_message {
			padding: 24upx 20upx 0;

			.order_passenger_form {
				margin-top: 12upx;

				.form_item {
					display: flex;
					align-items: center;
					padding: 24upx 0 34upx;

					&:not(:last-child) {
						border-bottom: 2upx solid rgba(241, 243, 245, 1);
					}

					.form_item_title {
						font-size: 26upx;
						font-weight: 400;
						color: rgba(42, 42, 42, 1);
						margin-right: 30upx;
					}

					.form_item_input {
						padding-left: 10upx;
					}

					.input_style {
						font-size: 28upx;
						font-weight: 400;
						color: rgba(175, 185, 196, 1);
					}
				}
			}
		}

		.insurance_list {
			.title_text {
				margin-bottom: 40upx;
			}

			.insurance_box {
				.insurance_box_item {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 30upx 0;

					&:first-child {
						padding-top: 0;
					}

					&:last-child {
						padding-bottom: 0;
					}

					&:not(:last-child) {
						border-bottom: 2upx solid rgba(241, 243, 245, 1);
					}

					.item_name {
						font-size: 28upx;
						font-weight: 400;
						color: rgba(42, 42, 42, 1);
					}

					.item_check {
						display: inline-flex;
						align-items: center;

						.item_price {
							display: inline-flex;
							align-items: center;
							font-size: 28upx;
							font-weight: 400;
							color: #AFB9C4;

							text {
								color: #0070E2;
							}
						}

						.item_icon {
							background: url(../../static/selected.png) no-repeat;
							background-size: contain;
							width: 40upx;
							height: 40upx;
							margin-left: 12upx;

							&.is_active {
								background: url(../../static/selected_active.png) no-repeat;
								background-size: contain;
							}
						}
					}
				}
			}
		}

		.reward_list {
			.title_text {
				margin-bottom: 40upx;
			}

			.reward_box {

				.reward_list {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 30upx 0;
					font-size: 28upx;
					font-weight: 400;
					color: rgba(42, 42, 42, 1);

					&:first-child {
						padding-top: 0;
					}

					&:last-child {
						padding-bottom: 0;
					}

					&:not(:last-child) {
						border-bottom: 2upx solid rgba(241, 243, 245, 1);
					}
				}
			}
		}

		.disclaimer {
			margin: 40upx 20upx 20upx;
			font-size: 24upx;
			font-weight: 400;
			color: rgba(42, 42, 42, 1);
			line-height: 36upx;

			text {
				color: #0070E2;
			}
		}

		.bottom_bar {
			background: rgba(255, 255, 255, 1);
			height: 100upx;
			width: calc(100% - 60upx);
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 24upx 20upx var(--status-bar-height) 40upx;
			border-top: 2upx solid rgba(229, 229, 229, 1);

			.left_message {
				.not_pass_message {
					font-size: 28upx;
					font-weight: 400;
					color: rgba(42, 42, 42, 1);
				}
			}

			.right_btn {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				width: 260upx;
				height: 90upx;
				background: linear-gradient(90deg, rgba(0, 112, 226, 1) 0%, rgba(86, 197, 255, 1) 100%);
				box-shadow: 0 6upx 12upx rgba(0, 112, 226, 0.3);
				font-size: 32upx;
				font-weight: 400;
				color: rgba(255, 255, 255, 1);
				letter-spacing: 10upx;
				opacity: .4;
				border-radius: 80upx;
			}
		}
	}
</style>
