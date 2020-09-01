<!--
 * @Description: 航班信息 - 航班价格
 * @Author: wish.WuJunLong
 * @Date: 2020-06-24 16:32:24
 * @LastEditTime: 2020-09-01 09:43:25
 * @LastEditors: wish.WuJunLong
--> 
<template>
	<view class="item_box">
		<view class="item_box_header">
			<view class="box_header_left">
				<view class="left_prcie">
					<text class="unit">&yen;</text>
					{{flightData.data.cabinPrices.ADT.rulePrice.price}}
					<!-- <view class="price_message" v-if="flightData.priceMessage">（含机建燃油）</view> -->
				</view>
				<view class="left_reward" v-if="flightData.reward > 0">奖励金 &yen;{{flightData.reward}}</view>
			</view>
			<view class="box_header_right">
				<view class="header_right_btn" @click="jumpReservation">预 定</view>
				<view class="header_right_voteNumber" v-if="flightData.voteNumber !== 'A'">{{flightData.voteNumber}}张</view>
			</view>
		</view>

		<view class="item_box_bottom">
			<view class="bottom_message" @click="openFlightPopop">
				{{flightData.cabin}} | 退改签规则 {{flightData.baggage?' | ' + flightData.baggage: ''}}
				<view class="message_more_btn"></view>
			</view>
			<!-- <view class="bottom_ticket_info">
				30分钟内出票 | 提供发票
			</view> -->
		</view>

	</view>
</template>

<script>
	export default {
		props: {
			flightData: {
				type: Object,
				default: () => {}
			},
			flightDataIndex: {
				type: Number,
				default: () => null
			}
		},
		data() {
			return {

			};
		},
		methods: {
			// 打开说明弹窗
			openFlightPopop(){  
				this.$emit('openExpDialog', true, this.flightData.ruleInfos)
				// this.$parent.$refs.flightExplanation.open()
			},
			
			// 跳转预定页面
			jumpReservation(){
				this.$emit('jumpReservation', true,this.flightData,this.flightDataIndex)
			},
		}
	}
</script>

<style scoped lang="less">
	.item_box {
		padding: 22upx 30upx 20upx 28upx;
		background: rgba(255, 255, 255, 1); 
		box-shadow: 0 12upx 18upx rgba(0, 0, 0, 0.04);
		border-radius: 20upx;
		margin-bottom: 20upx;

		&:first-child {
			border-radius: 0 0 20upx 20upx;
		}

		.item_box_header {
			display: flex;
			justify-content: space-between;
			border-bottom: 1px solid rgba(241, 243, 245, 1);
			padding-bottom: 20upx;
			margin-bottom: 22upx;

			.box_header_left {
				.left_prcie {
					display: flex;
					align-items: baseline;
					font-size: 48upx;
					font-weight: bold;
					color: rgba(255, 0, 0, 1);

					.unit {
						font-size: 28upx;
						margin-right: 6upx;
					}

					.price_message {
						font-size: 20upx;
						font-weight: 400;
						color: rgba(153, 153, 153, 1);
					}
				}

				.left_reward {
					background: rgba(255, 0, 0, .1);
					font-size: 18upx;
					font-weight: 400;
					color: rgba(255, 0, 0, 1);
					padding: 4upx 12upx;
					display: inline;
				}
			}

			.box_header_right {
				position: relative;

				.header_right_btn {
					background: linear-gradient(90deg, rgba(0, 112, 226, 1) 0%, rgba(86, 197, 255, 1) 100%);
					box-shadow: 0 6upx 12upx rgba(0, 112, 226, 0.3);
					border-radius: 90upx;
					font-size: 32upx;
					font-weight: 400;
					color: rgba(255, 255, 255, 1);
					// letter-spacing:20px;
					padding: 18upx 46upx;
				}

				.header_right_voteNumber {
					font-size: 18upx;
					font-weight: 400;
					color: rgba(255, 0, 0, 1);
					text-align: center;
					position: absolute;
					bottom: -6upx;
					width: 100%;
				}
			}
		}

		.item_box_bottom {
			.bottom_message {
				font-size: 24upx;
				font-weight: 400;
				color: rgba(102, 102, 102, 1);
				display: inline-flex;
				align-items: center;
				margin-bottom: 12upx;

				.message_more_btn {
					background: url(@/static/arrow_more.png) no-repeat;
					background-size: contain;
					width: 8upx;
					height: 14upx;
					margin-left: 18upx;
				}
			}

			.bottom_ticket_info {
				font-size: 22upx;
				font-weight: 400;
				color: rgba(175, 185, 196, 1);
			}
		}
	}
</style>
