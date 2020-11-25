<!--
 * @Author: mzr
 * @Date: 2020-11-24 10:36:26
 * @LastEditTime: 2020-11-25 18:05:28
 * @LastEditors: Please set LastEditors
 * @Description: 改签详情
 * @FilePath: \positiond:\tests\Distribution\yunshang_fission\src\order\changeDetails.vue
-->
<template>
<view class="change_detail">

    <yun-header
      :statusHeight="iStatusBarHeight"
      centerTitle="改签单详情"
    ></yun-header>

    <!-- 改签头部 -->
    <view class="details_header">
      <view class="header_top">
        <view class="order_type">
         {{

            changeDetailsData.change_status === 1 
            ? "申请中"
            : changeDetailsData.change_status === 2
            ? "待支付"
            : changeDetailsData.change_status === 3
            ? "待出票"
            : changeDetailsData.change_status === 4
            ? "已完成"
            : ""
         }}
        </view>

        <view
          class="order_price"
          v-if="JSON.stringify(changeDetailsData) !== '{}'"

        >
          <text class="price_text">改签费&yen;</text>
          <text>1920</text>
        </view>

        <view class="price_other" v-else> 数据获取中 </view>
      </view>
      <!-- 剩余时间 待支付 -->
      <!-- <view
        class="remaining_time"
        v-if="changeDetailsData.change_status === 2"
      >
        <image
          class="time_icon"
          src="@/static/order_remaining_time.png"
          mode="aspectFit"
        />
        <text class="time_text">剩余支付时间：{{ '' }}分钟</text
        >
      </view> -->
      
      <!-- 订单状态 -->
      <view class="remaining_time">
        <text class="time_text">
            {{
              changeDetailsData.change_status === 1
                ? "您的申请已提交，等待后台审核"
                : changeDetailsData.change_status === 2
                ? "剩余支付时间"
                : changeDetailsData.change_status === 3
                ? "订单支付成功，出票中..."
                : changeDetailsData.change_status === 4
                ? "订单改签完成，已出票"
                : ""
            }}
        </text>
      </view>

      <view class="order_option">
        <view
          class="option_btn"
          v-if="orderDetails.status !== 5 && orderDetails.status !== 3"
          @click="sendMessage" 
          >发送短信</view
        >
        <view 
          class="option_btn"
          v-if="
            orderDetails.status !== 0 &&
            orderDetails.status !== 5 &&
            orderDetails.pay_status === 1 &&
            orderDetails.left_min > 0
          "
          @click="getCancel(item)"
          >取消订单</view
        >
        <view
          class="option_btn important_btn"
          v-if="
            orderDetails.status !== 0 &&
            orderDetails.status !== 5 &&
            orderDetails.pay_status === 1 &&
            orderDetails.left_min > 0
          "
          @click="jumpOrderPay()"
          >去支付</view
        >
        <view
          @click="notMessage"
          class="option_btn"
          v-if="orderDetails.status === 3"
          >报销凭证</view
        >
        <view
          @click="sendMessage"
          class="option_btn"
          v-if="orderDetails.status === 3"
          >发送短信</view
        >
        <view
          class="option_btn"
          v-if="orderDetails.status === 3"
          @click="getRefund()"
          >退票</view
        >
        <view
          class="option_btn"
          @click="getChange()"
          v-if="orderDetails.status === 3"
          >改签</view
        >
        <view
          class="option_btn"
          v-if="
            orderDetails.status === 5 ||
            (orderDetails.pay_status === 1 &&
              orderDetails.status === 1 &&
              orderDetails.left_min <= 0)
          "
          @click="reOrder()"
          >再次预定</view
        >
      </view>
    </view>

    <scroll-view
      :enable-back-to-top="true"
      :scroll-y="true"
      class="details_main"
    >
      <view class="content">

        <!-- 乘机人 -->
        <view class="main_list passenger">
          <view class="main_list_title">乘机人</view>
          <view class="passenger_list">
            <view class="list_item">
              <view class="list_info">
                <view class="info_type">成人票</view>
                <view class="info_name">{{ "" }}</view>
                <view
                  class="is_insurance"
                >
                  <image src="@/static/insurance_icon.png" mode="aspectFit" />
                </view>
                <view class="group_type">员工</view>
              </view>

              <view class="list_message">
                <view class="message_title">身份证</view>
                <view class="message_number">{{ "" }}</view>
              </view>

              <view class="ticket_no">
                <view class="ticket_no_title">票号</view>
                <view>{{ "" }}</view>
              </view>
            </view>
          </view>

          <view class="contact">
            <view class="contact_list">
              <view class="list_title">联系人</view>
              <view class="list_message">{{ '' }}</view>
            </view>
            <view class="contact_list">
              <view class="list_title">联系电话</view>
              <view class="list_message">{{ '' }}</view>
            </view>
          </view>
        </view>
        
        <!-- <flight-header
          v-if="JSON.stringify(orderDetails) !== '{}'"
          :flightData="flightData"
          :roundTripFlightData="roundTripFlightData"
          :roundTripType="roundTripType"
          :interType="false"
          @openHeadExpPopup="openHeadExpPopup"
        ></flight-header>

        <view v-else class="not_flight_data">
          <text></text>
          <text></text>
          <view></view>
        </view> -->

        <!-- 订单信息 -->
        <view class="main_list order_message">
          <view class="main_list_title">
            <text>订单信息</text>
          </view>
          <view class="message_list">
            <view class="list_item">
              <view class="item_title">订单编号</view>
              <view class="item_message">{{ changeDetailsData.order_no }}</view>
            </view>
            <view class="list_item">
              <view class="item_title">PNR</view>
              <view class="item_message">{{ changeDetailsData.pnr_code }}</view>
            </view>
            <view class="list_item" v-if="changeDetailsData.change_status === 4">
              <view class="item_title">YATP订单号</view>
              <view class="item_message">{{ changeDetailsData.yatp_id }}</view>
            </view>
            <view class="list_item">
              <view class="item_title">订票员</view>
              <view class="item_message">{{ changeDetailsData.login_name }}</view>
            </view>
            <view class="list_item">
              <view class="item_title">分销商</view>
              <view class="item_message">{{ changeDetailsData.admin_name }}</view>
            </view>
            <view class="list_item"  v-if="changeDetailsData.change_status === 4">
              <view class="item_title">出票员</view>
              <view class="item_message">{{ changeDetailsData.change_passengers[0].ticket_passenger.out_ticket_name }}</view>
            </view>
            <view class="list_item">
              <view class="item_title">申请时间</view>
              <view class="item_message">{{ changeDetailsData.created_at }}</view>
            </view>
            <view class="list_item">
              <view class="item_title">备注</view>
              <view class="item_message input-right-arrow">{{remark || '无'}}</view>
            </view>
          </view>
        </view>

      </view>
    </scroll-view>

</view>
    
</template>

<script>
export default {

    data() {

        return {

            iStatusBarHeight: 0,

            changeDetailsData:{}, //列表传入
        }
    },
    methods:{

        
    },
    onLoad(data) {
            
      this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
      this.changeDetailsData = JSON.parse(data.changeData)
      console.log("改签列表",this.changeDetailsData)
    },

    
}
</script>

<style lang="less" scoped>
.change_detail {

    height: 100vh;
    display: flex;
    flex-direction: column;
    background: rgba(243, 245, 247, 1);
    overflow: hidden;
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
            .price_other {
            color: #ffffff;
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
              font-weight: 400;
              color: #ffffff;
              opacity: 0.8;
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

     .details_main {
        //兼容问题
        position: relative;
        flex: 1;
        height: 100%;
        overflow-y: auto;
        .content {
            height: 100%;
            position: relative;
            z-index: 2;
            padding-top: 20rpx;
            // &::after {
            //   content: "";
            //   display: block;
            //   background: #0070e2;
            //   width: 100%;
            //   height: 90upx;
            //   position: absolute;
            //   top: 0;
            //   left: 0;
            //   z-index: 0;
            // }

            /deep/.fight_header {
            position: relative;
            z-index: 2;
            }

            .main_list {
            background: rgba(255, 255, 255, 1);
            box-shadow: 0 12upx 18upx rgba(0, 0, 0, 0.04);
            border-radius: 20upx;
            margin: 0 20upx 20upx;
            padding: 24upx 20upx 20upx;
            position: relative;
            z-index: 2;
            .main_list_title {
                font-size: 32upx;
                font-weight: bold;
                color: rgba(42, 42, 42, 1);
                display: flex;
                align-items: center;
                justify-content: space-between;
                .showPriceInfo {
                text-align: right;
                font-size: 24upx;
                font-weight: 400;
                color: #2a2a2a;
                }
            }
            &.filght_info {
                .info_header {
                display: flex;
                align-items: center;
                margin-bottom: 20upx;
                .header_type {
                    width: 80upx;
                    height: 30upx;
                    background: linear-gradient(
                    270deg,
                    rgba(0, 112, 226, 1) 0%,
                    rgba(86, 197, 255, 1) 100%
                    );
                    border-radius: 10upx;
                    font-size: 20upx;
                    font-weight: 400;
                    color: rgba(255, 255, 255, 1);
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 12upx;
                }
                .header_time {
                    font-size: 24upx;
                    font-weight: 400;
                    color: rgba(42, 42, 42, 1);
                    text {
                    margin-left: 12upx;
                    }
                }
                }
                .info_message {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 26upx;
                .message_box {
                    .date {
                    font-size: 36upx;
                    font-weight: bold;
                    color: rgba(42, 42, 42, 1);
                    margin-bottom: 4upx;
                    }
                    .address {
                    font-size: 24upx;
                    font-weight: 400;
                    color: rgba(42, 42, 42, 1);
                    }
                }
                .message_center {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    .date {
                    font-size: 22upx;
                    font-weight: 400;
                    color: rgba(175, 185, 196, 1);
                    }
                    .center_icon {
                    width: 112upx;
                    height: 20upx;
                    background: url(@/static/ticket_path.png) no-repeat center
                        center;
                    background-size: contain;
                    display: block;
                    }
                    .type {
                    font-size: 22upx;
                    font-weight: 400;
                    color: rgba(175, 185, 196, 1);
                    }
                }
                }
                .filght_message {
                display: flex;
                align-items: center;
                justify-content: center;
                .message_icon {
                    width: 24upx;
                    height: 24upx;
                    object-fit: contain;
                    margin-right: 6upx;
                    display: flex;
                }
                .message_list {
                    font-size: 22upx;
                    font-weight: 400;
                    color: rgba(175, 185, 196, 1);
                    display: inline-flex;
                    align-items: center;
                    &:not(:last-child) {
                    &::after {
                        content: "";
                        display: block;
                        width: 2upx;
                        height: 20upx;
                        background: rgba(217, 225, 234, 1);
                        margin: 0 8upx;
                    }
                    }
                }
                }
                .filght_bottom {
                display: flex;
                align-items: center;
                border-top: 2upx dashed rgba(217, 225, 234, 1);
                margin-top: 20upx;
                padding-top: 20upx;
                justify-content: center;
                .bottom_list {
                    font-size: 24upx;
                    font-weight: 400;
                    color: rgba(175, 185, 196, 1);
                    display: inline-flex;
                    align-items: center;
                    &:not(:last-child) {
                    &::after {
                        content: "";
                        display: block;
                        width: 2upx;
                        height: 20upx;
                        background: rgba(217, 225, 234, 1);
                        margin: 0 8upx;
                    }
                    }
                }
                }
            }
            &.passenger {
                .passenger_list {
                margin-top: 46upx;
                .list_item {
                    &:not(:last-child) {
                    margin-bottom: 50upx;
                    }
                    &:last-child {
                    padding-bottom: 32upx;
                    border-bottom: 2upx solid rgba(241, 243, 245, 1);
                    margin-bottom: 30upx;
                    }
                    .list_info {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20upx;
                    .info_type {
                        width: 100upx;
                        height: 30upx;
                        border: 2upx solid rgba(127, 183, 240, 1);
                        border-radius: 20upx;
                        margin-right: 12upx;
                        font-size: 20upx;
                        font-weight: 400;
                        color: rgba(127, 183, 240, 1);
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .info_name {
                        font-size: 28upx;
                        font-weight: bold;
                        color: rgba(42, 42, 42, 1);
                        margin-right: 8upx;
                    }
                    .is_insurance {
                        width: 30upx;
                        height: 30upx;
                        margin-right: 8upx;
                        display: flex;
                        image {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                        }
                    }
                    .group_type {
                        margin-left: 28upx;
                        font-size: 22upx;
                        font-weight: 400;
                        color: rgba(153, 153, 153, 1);
                    }
                    }
                    .list_message {
                    display: flex;
                    align-items: center;
                    .message_title {
                        font-size: 28upx;
                        font-weight: 400;
                        color: rgba(42, 42, 42, 1);
                        width: 114upx;
                    }
                    .message_number {
                        font-size: 28upx;
                        font-weight: bold;
                        color: rgba(42, 42, 42, 1);
                    }
                    }
                    .ticket_no {
                    margin-top: 20upx;
                    display: flex;
                    align-items: center;
                    font-size: 28upx;
                    color: rgba(42, 42, 42, 1);
                    font-weight: bold;
                    .ticket_no_title {
                        width: 114upx;
                        font-weight: 400;
                    }
                    }
                }
                }
                .contact {
                .contact_list {
                    display: flex;
                    align-items: center;
                    &:not(:last-child) {
                    margin-bottom: 36upx;
                    }
                    .list_title {
                    font-size: 28upx;
                    font-weight: 400;
                    color: rgba(102, 102, 102, 1);
                    width: 132upx;
                    }
                    .list_message {
                    font-size: 28upx;
                    font-weight: bold;
                    color: rgba(42, 42, 42, 1);
                    }
                }
                }
            }
            &.certificate {
                .certificate_message {
                margin-top: 32upx;
                border-top: 2upx solid #f1f3f5;
                padding-top: 34upx;
                display: flex;
                align-items: center;
                .message_title {
                    font-size: 28upx;
                    font-weight: 400;
                    color: rgba(153, 153, 153, 1);
                    margin-right: 40upx;
                }
                .message_text {
                    font-size: 28upx;
                    font-weight: 400;
                    color: rgba(51, 51, 51, 1);
                }
                }
            }
            &.order_message {
                .message_list {
                margin-top: 40upx;
                .list_item {
                    display: flex;
                    align-items: center;
                    &:not(:last-child) {
                    margin-bottom: 30upx;
                    }
                    .item_title {
                    font-size: 24upx;
                    font-weight: 400;
                    color: rgba(153, 153, 153, 1);
                    width: 132upx;
                    text {
                        font-size: 20upx;
                    }
                    }
                    .item_message {
                    flex: 1;
                    text-align: right;
                    font-size: 24upx;
                    font-weight: 400;
                    color: rgba(42, 42, 42, 1);
                    }
                }
                }
            }
            }
            .not_flight_data {
            border-radius: 20rpx;
            background: #ffffff;
            box-shadow: 0 12rpx 18rpx rgba(0, 0, 0, 0.04);
            padding: 30rpx 20rpx 22rpx;
            margin: 0 20rpx 20rpx;
            height: 144upx;
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: hidden;
            &::before {
                content: "";
                display: block;
                width: 44upx;
                height: 200%;
                position: absolute;
                top: -30%;
                transform: rotate(30deg);
                background: #fff;
                left: -30%;
                animation: skeleton 3s infinite;
                -webkit-animation: skeleton 3s infinite;
            }
            @keyframes skeleton {
                from {
                left: -30%;
                }
                to {
                left: 120%;
                }
            }
            text {
                display: block;
                width: 80%;
                height: 28upx;
                background: #e5e9f2;
                margin-bottom: 10upx;
            }
            view {
                width: 80%;
                height: 40upx;
                margin: auto auto 0;
                background: #e5e9f2;
            }
            }
        }
    }
}


</style>
