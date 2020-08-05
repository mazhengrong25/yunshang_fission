<!--
 * @Description: 订单详情页面
 * @Author: wish.WuJunLong
 * @Date: 2020-08-05 14:29:00
 * @LastEditTime: 2020-08-05 18:31:00
 * @LastEditors: wish.WuJunLong
-->
<template>
  <view class="order_details">
    <yun-header :statusHeight="iStatusBarHeight" centerTitle="订单详情"></yun-header>

    <view class="details_header">
      <view class="header_top">
        <view class="order_type">已预订</view>

        <view class="order_price">
          <text class="price_text">总价 &yen;</text>
          <text>1920</text>
        </view>
      </view>

      <view class="remaining_time">
        <image class="time_icon" src="@/static/order_remaining_time.png" mode="aspectFit" />
        <text class="time_text">剩余支付时间：14:00</text>
      </view>

      <view class="order_option">
        <view class="option_btn">发送短信</view>
        <view class="option_btn">取消订单</view>
        <view class="option_btn important_btn">去支付</view>
      </view>
    </view>

		<view class="details_main">
			<scroll-view :scroll-y="true" class="content">
				<flight-info :flightInfo="false" :flightData="flightData"></flight-info>


			</scroll-view>
		</view>


  </view>
</template>

<script>
import orderApi from "@/api/order.js";
import flightInfo from '@/components/flight_header.vue';  // 航班信息组件
export default {
	components: {
		flightInfo
	},
  data() {
    return {
			iStatusBarHeight: 0,
			orderDetails: {}, // 订单详情
			flightData: {}, // 航班信息
    };
  },
  methods: {
    // 获取订单详情
    getOrderDetails(val) {
      let data = {
        order_no: val,
      };
      orderApi.orderInterDetails(data).then((res) => {
        console.log(res);
      });
		},
		
		// 航班信息处理
		getFlightData(){
			this.flightData = {
				flightType: this.orderDetails.routing_type,  // 行程类型
				routes: [], // 行程数据
				airline: '',
				model: '',
				food: ''
			}
			this.orderDetails.routes.forEach(item =>{
				this.flightData.routes.push({
					type: item.direction_type,  // 飞行方向
					departure_time: item.departure_time,  // 起飞时间
					arrive_time: item.arrive_time,  // 到达时间
					fromTime: '',
					fromAddress: '',
					duration: item.duration,  // 飞行时长
					toTime: '',
					toAddress:'',
				})
			})
		},
  },
  onLoad(data) {
		this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
		console.log(JSON.parse(data.orderData))
		this.orderDetails = JSON.parse(data.orderData)
    // this.getOrderDetails(data.orderNo);
  },
};
</script>

<style lang="less" scoped>
.order_details {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: rgba(243, 245, 247, 1);
  .details_header {
    background: rgba(0, 112, 226, 1);
    padding: 40upx 20upx 30upx;
    .header_top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 22upx;
      .order_type {
        font-size: 40upx;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
      }
      .order_price {
        display: inline-flex;
        align-items: center;
        font-size: 40upx;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        &::after {
          content: "";
          background: url(@/static/arrow_white.png) no-repeat center center;
          background-size: contain;
          width: 12upx;
          height: 21upx;
          display: block;
          margin-left: 14upx;
        }
        .price_text {
          font-size: 24upx;
          font-weight: 400;
          margin-right: 6upx;
          margin-top: 10upx;
        }
      }
    }
    .remaining_time {
      display: flex;
      align-items: center;
      margin-bottom: 32upx;
      .time_icon {
        width: 24upx;
        height: 24upx;
        object-fit: contain;
        margin-right: 10upx;
      }
      .time_text {
        font-size: 24upx;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
      }
    }
    .order_option {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .option_btn {
        width: 150upx;
        height: 56upx;
        border: 2upx solid rgba(255, 255, 255, 0.3);
        border-radius: 50upx;
        font-size: 24upx;
        font-weight: 400;
				color: rgba(255, 255, 255, 1);
				display: flex;
				align-items: center;
				justify-content: center;
				margin-left: 32upx;
        &.important_btn {
          border-color: #fff;
          background: #fff;
          color: rgba(0, 112, 226, 1);
        }
      }
    }
	}
	.details_main{
		position: relative;
		flex: 1;
		&::after{
			content: '';
			display: block;
			background: #0070E2;
			width: 100%;
			height: 90upx;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 0;
		}
		.content{
			height: 100%;
			overflow-y: auto;
			position: relative;
			z-index: 1;
		}
	}
}
</style>
