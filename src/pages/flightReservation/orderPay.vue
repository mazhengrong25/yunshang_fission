<!--
 * @Description: 确认支付页面
 * @Author: wish.WuJunLong
 * @Date: 2020-08-21 14:23:01
 * @LastEditTime: 2020-08-25 17:26:54
 * @LastEditors: wish.WuJunLong
-->
<template>
  <view class="order_pay">
    <yun-header :statusHeight="iStatusBarHeight" centerTitle="确认支付"></yun-header>
    <view class="order_price">
      <text>订单总价</text>
      <view>
        <text>&yen;</text>
        {{price}}
      </view>
    </view>

    <scroll-view :enable-back-to-top="true" :scroll-y="true" class="order_pay_main">
      <flight-header :flightData="flightData"></flight-header>

      <view class="order_message box-shadow-style">
        <view class="message_list" v-for="(item, index) in payOrder" :key="index">
          <view
            class="list_title"
          >{{payOrder.length> 1 && index === 0? '成人': payOrder.length> 1 && index === 1?'儿童':''}}订单编号</view>
          <view class="list_text">{{item}}</view>
        </view>
        <view class="message_list">
          <view class="list_title">收款方</view>
          <view class="list_text">重庆云上航空票务股份有限公司</view>
        </view>
      </view>

      <view class="pay_type box-shadow-style">
        <view class="title">支付方式</view>
        <radio-group @change="radioChange">
          <label class="type_group">
            <view class="group_title">
              <image src="@/static/pay_wallet.png" mode="contain" />钱包支付
            </view>
            <radio value="钱包" color="#0070E2" checked="true" />
          </label>
          <label class="type_group">
            <view class="group_title">
              <image src="@/static/pay_yibao.png" mode="contain" />易宝支付
            </view>
            <radio value="易宝" disabled color="#0070E2" />
          </label>
        </radio-group>
      </view>
    </scroll-view>

    <view class="pay_bottom">
      <view class="bottom_tip">
        您的订单已提交，剩余支付时间
        <text>{{remainingTime}}</text>
      </view>
      <view :class="['bottom_submit',{is_two_pay: payOrder.length> 1}]">
        <button
          :class="['submit_pay',{is_disabled: !payBtnStatus}]"
          :disabled="!payBtnStatus"
          @click="jumpPay()"
        >{{payOrder.length> 1? '成人支付':'立即支付'}}</button>
        <button
          v-if="payOrder.length> 1"
          :class="['submit_pay child_pay',{is_disabled: childPayStatus}]"
          :disabled="childPayStatus"
          @click="jumpPay('儿童')"
        >儿童支付</button>
      </view>
    </view>
  </view>
</template>

<script>
import flightHeader from "@/components/flight_header.vue"; // 航程信息
import ticket from "@/api/ticketInquiry.js";
import moment from "moment";
moment.locale("zh-cn");
export default {
  components: {
    flightHeader,
  },
  data() {
    return {
      iStatusBarHeight: 0, // 导航栏高度
      price: 1920,
      payOrder: "", // 订单号
      flightData: {}, // 航程信息
      payType: "钱包",

      payData: {}, // 订单详情数据
      remainingTime: "00:00",

      _inter: {}, // 倒计时

      payBtnStatus: true, // 支付按钮
      childPayStatus: false, // 儿童票支付状态
    };
  },
  methods: {
    // 获取订单详情
    getOrderDetails() {
      // this.payOrder = ["5000202008251120342122657000000006"];
      let base64Data = uni.arrayBufferToBase64(new Buffer(this.payOrder[0]));
      ticket
        .getPayInfo(base64Data)
        .then((res) => {
          if (res.errorcode === 10000) {
            this.payData = res.data;
            // this.payData.second = 10;
            if (this.payData.second <= 0) {
              this.payBtnStatus = false;
              uni.showToast({
                title: "支付超时",
                time: 2000,
                mask: true,
                icon: "none",
              });
            }
            this._inter = setInterval(() => {
              this.orderCountdown();
            }, 1000);
          } else {
            uni.showToast({
              title: res.data,
              icon: "none",
              mask: true,
            });
            setTimeout(() => {
              uni.navigateBack();
            }, 2500);
          }
        })
        .catch((e) => {
          uni.showToast({
            title: "数据获取错误，请稍后重试",
            icon: "none",
            mask: true,
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 2500);
        });
    },

    // 订单倒计时
    orderCountdown() {
      if (this.payData.second > 0) {
        let minutes = Math.floor(this.payData.second / 60);
        let seconds = Math.floor(this.payData.second % 60);
        this.remainingTime =
          (minutes < 10 ? "0" + minutes : minutes) +
          ":" +
          (seconds < 10 ? "0" + seconds : seconds);
        --this.payData.second;
      } else {
        this.remainingTime = "00:00";
        clearInterval(this._inter);
        console.log("结束");
        this.payBtnStatus = false;
      }
    },

    // 选择支付方式
    radioChange(val) {
      this.payType = val.detail.value;
      console.log(this.payType);
    },

    // 立即支付按钮
    jumpPay(type) {
      if (this.payBtnStatus) {
        let data = {
          pay_type: this.payType === "钱包" ? 1 : "",
        };
        let payType = type === "儿童" ? 1 : 0;
        ticket
          .payOrder(
            uni.arrayBufferToBase64(new Buffer(this.payOrder[payType])),
            data
          )
          .then((res) => {
            if (res.errorcode === 10000) {
              if (payType === 1) {
                this.childPayStatus = true;
              } else {
                this.payBtnStatus = false;
              }
              if (this.childPayStatus && !this.payBtnStatus) {
                console.log("成人儿童支付成功");
                let orderInfo = {
                  payId: this.payOrde,
                  payType: this.payType,
                  price: this.price,
                  payDate: moment().format("YYYY-MM-DD HH:mm:ss")
                }
                uni.reLaunch({
                  url: "/pages/flightReservation/payResult?orderData="+ JSON.stringify(orderInfo),
                });
              }
              uni.showToast({
                title: "支付成功",
                icon: "none",
                mask: true,
              });
            } else {
              uni.showToast({
                title: res.data,
                icon: "none",
              });
            }
          });
      }
    },
  },
  onLoad(data) {
    console.log(data.flightData);
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.payOrder = JSON.parse(data.orderId)
    this.flightData = JSON.parse(data.flightData);
    this.price = data.price
    // this.payOrder = [
    //   "5000202008251650542636889000000006",
    //   "5000202008251650552133258000000006",
    // ];
    // this.flightData = {
    //   airIcon: "/assets/airline/PN.png",
    //   airline: "西部PN6403",
    //   baggage: "行李额0KG",
    //   cabin: "T经济舱",
    //   duration: "2:10",
    //   flightType: "单程",
    //   food: "有早餐",
    //   fromAddress: "重庆江北机场T2",
    //   fromTime: "06:40",
    //   model: "空中客车320",
    //   time: "2020-08-27",
    //   toAddress: "西双版纳嘎洒机场--",
    //   toTime: "08:50",
    //   week: "周四",
    // };
    this.getOrderDetails();
  },
};
</script>

<style lang="less" scoped>
.order_pay {
  background: rgba(243, 245, 247, 1);
  height: 100vh;
  display: flex;
  flex-direction: column;
  .order_price {
    height: 120upx;
    display: flex;
    align-items: baseline;
    background: #0070e2;
    padding: 32upx 20upx;
    color: rgba(255, 255, 255, 1);
    box-sizing: border-box;
    > text {
      font-size: 12px;
      font-weight: 400;
      margin-right: 20upx;
    }
    > view {
      font-size: 48upx;
      font-weight: bold;
      text {
        font-size: 24upx;
        font-weight: 400;
        margin-right: 5upx;
      }
    }
  }
  .order_pay_main {
    position: relative;
    flex: 1;
    height: 100%;
    overflow-y: auto;

    &::before {
      content: "";
      background: #0070e2;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 0;
      width: 100vw;
      height: 120upx;
      display: block;
    }
  }
  .order_message {
    .message_list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      &:not(:last-child) {
        border-bottom: 2upx solid rgba(241, 243, 245, 1);
        padding-bottom: 30upx;
        margin-bottom: 30upx;
      }
      .list_title {
        font-size: 24upx;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        display: inline-flex;
        align-items: center;
        .title_tag {
          width: 80upx;
          height: 30upx;
          border: 1px solid rgba(127, 183, 240, 1);
          border-radius: 20upx;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 10upx;
          font-size: 20upx;
          font-weight: 400;
          color: rgba(127, 183, 240, 1);
        }
      }
      .list_text {
        font-size: 24upx;
        font-weight: 400;
        color: rgba(42, 42, 42, 1);
        text-align: right;
      }
    }
  }
  .pay_type {
    margin-top: 20upx;
    margin-bottom: 40upx;
    .title {
      font-size: 32upx;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      margin-bottom: 30upx;
    }
    .type_group {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 30upx;
      &:first-child {
        border-bottom: 2upx solid #f1f3f5;
        padding-bottom: 30upx;
      }
      .group_title {
        display: flex;
        align-items: center;
        font-size: 28upx;
        font-weight: 400;
        color: rgba(42, 42, 42, 1);
        image {
          width: 60upx;
          height: 60upx;
          object-fit: contain;
          margin-right: 20upx;
        }
      }
    }
  }
  .pay_bottom {
    padding-bottom: var(--status-bar-height);
    background: rgba(255, 255, 255, 1);
    .bottom_tip {
      height: 80upx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(251, 152, 38, 0.1);
      font-size: 24upx;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      text {
        font-size: 28upx;
        font-weight: bold;
        color: rgba(251, 152, 38, 1);
        margin-left: 16upx;
      }
    }
    .bottom_submit {
      height: 144upx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-top: 2upx solid #e5e5e5;
      &.is_two_pay {
        .submit_pay {
          width: 45%;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          &.child_pay {
            border-radius: 80upx;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            background: linear-gradient(
              90deg,
              rgba(251, 152, 38, 0.6) 0%,
              rgba(251, 152, 38, 1)
            );
            box-shadow: 0 6upx 12upx rgba(251, 152, 38, 0.3);
          }
        }
      }
      .submit_pay {
        width: 650upx;
        height: 90upx;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(
          90deg,
          rgba(0, 112, 226, 1) 0%,
          rgba(86, 197, 255, 1) 100%
        );
        box-shadow: 0 6upx 12upx rgba(0, 112, 226, 0.3);
        border-radius: 80upx;
        font-size: 32upx;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        letter-spacing: 5upx;
        &.is_disabled {
          opacity: 0.4;
        }
      }
    }
  }
}
</style>
