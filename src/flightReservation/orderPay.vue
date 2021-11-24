<!--
 * @Description: 确认支付页面
 * @Author: wish.WuJunLong
 * @Date: 2020-08-21 14:23:01
 * @LastEditTime: 2021-11-16 09:21:06
 * @LastEditors: wish.WuJunLong
-->
<template>
  <view class="order_pay">
    <yun-header
      :statusHeight="iStatusBarHeight"
      centerTitle="确认支付"
      :showHome="true"
    ></yun-header>
    <view class="order_price">
      <text>订单总价</text>
      <view>
        <text>&yen;</text>
        {{ price }}
      </view>
    </view>

    <scroll-view :enable-back-to-top="true" :scroll-y="true" class="order_pay_main">
      <flight-header
        v-if="JSON.stringify(payData) !== '{}'"
        :flightData="flightData"
        :roundTripType="orderType"
        :roundTripFlightData="flightRoundData"
        :interType="headerType"
      ></flight-header>

      <view v-else class="not_flight_data">
        <text></text>
        <text></text>
        <view></view>
      </view>

      <view class="order_message box-shadow-style" style="margin-bottom: 20rpx">
        <view class="message_list" v-for="(item, index) in passengerList" :key="index">
          <view>
            <text class="list_title">乘客：</text>
            <text class="list_text">{{ item.PassengerName }}</text>
          </view>
          <view>
            <text class="list_title">证件号：</text>
            <text class="list_text">{{ item.CredentialNo }}</text>
          </view>
          <!-- <view class="list_text">{{item.CredentialNo}}</view> -->
        </view>
      </view>

      <view class="order_message box-shadow-style">
        <view class="message_list" v-for="(item, index) in payOrder" :key="index">
          <view class="list_title"
            >{{
              payOrder.length > 1 && index === 0
                ? "成人"
                : payOrder.length > 1 && index === 1
                ? "儿童"
                : ""
            }}订单编号</view
          >
          <view class="list_text">{{ item }}</view>
        </view>
        <view class="message_list">
          <view class="list_title">收款方</view>
          <view class="list_text">{{headerName === '坤昌科技'?'重庆坤昌科技有限公司':'重庆云上航空票务股份有限公司'}}</view>
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
              <image src="@/static/pay_wx.png" mode="contain" />微信支付
            </view>
            <radio value="微信" color="#0070E2" />
          </label>
        </radio-group>
      </view>
    </scroll-view>

    <view class="pay_bottom">
      <view class="bottom_tip">
        您的订单已提交，剩余支付时间
        <text>{{ remainingTime }}</text>
      </view>
      <view :class="['bottom_submit', { is_two_pay: payOrder.length > 1 }]">
        <button
          :class="['submit_pay', { is_disabled: !payPayStatus }]"
          :disabled="!payPayStatus"
          @click="jumpPay()"
        >
          {{ payOrder.length > 1 ? "成人支付 &yen;" + priceList[0] : "立即支付" }}
        </button>
        <button
          v-if="payOrder.length > 1"
          :class="['submit_pay child_pay', { is_disabled: childPayStatus }]"
          :disabled="childPayStatus"
          @click="jumpPay('儿童')"
        >
          儿童支付 &yen;{{ priceList[1] }}
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import flightHeader from "@/components/flight_header.vue"; // 航程信息
import ticket from "@/api/ticketInquiry.js";
import moment from "moment";
moment.locale("zh-cn");

let Base64 = {
  decode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(
      atob(str)
        .split("")
        .map(function(c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  },
};

export default {
  components: {
    flightHeader,
  },
  data() {
    return {
      iStatusBarHeight: 0, // 导航栏高度
      price: 0,
      priceList: [], // 金额列表
      orderType: false,
      payOrder: "", // 订单号
      flightData: {
        flightType: "", // 航程类型
        data: [
          {
            // 航班数据
            depTime: "",
            depAirport_CN: "",
            arrTerminal: "",
            depTerminal: "",
            duration: "",
            arrTime: "",
            airline_CN: "",
            flightNumber: "",
            aircraftCode: "",
            hasMeal: "",
          },
        ],
      }, // 航程信息
      flightRoundData: {
        flightType: "", // 航程类型
        data: [
          {
            // 航班数据
            depTime: "",
            depAirport_CN: "",
            arrTerminal: "",
            depTerminal: "",
            duration: "",
            arrTime: "",
            airline_CN: "",
            flightNumber: "",
            aircraftCode: "",
            hasMeal: "",
          },
        ],
      },
      payType: "钱包",

      payData: {}, // 订单详情数据
      remainingTime: "00:00",

      _inter: {}, // 倒计时

      payBtnStatus: true, // 支付按钮
      payPayStatus: true,
      childPayStatus: false, // 儿童票支付状态

      headerType: true, // 航班信息状态

      passengerList: [], //乘客信息


      headerName: ''
    };
  },
  methods: {
    // 获取订单详情
    getOrderDetails() {
      // this.payOrder = ["5000202009250937182148367000002198"];
      let base64Data = uni.arrayBufferToBase64(new Buffer(this.payOrder[0]));
      ticket
        .getPayInfo(base64Data)
        .then((res) => {
          if (res.errorcode === 10000) {
            this.payData = res.data;
            // this.payData.second = 10;
            if (this.payData.second <= 0) {
              this.payBtnStatus = false;
              this.payPayStatus = false;
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
            this.payBtnStatus = false;
            this.payPayStatus = false;
            uni.showToast({
              title: res.data,
              icon: "none",
              mask: true,
              duration: 4000,
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
        this.payPayStatus = false;
      }
    },

    // 选择支付方式
    radioChange(val) {
      this.payType = val.detail.value;
      console.log(this.payType);
      this.payBtnStatus = true;
      this.payPayStatus = true;
    },

    // 易宝支付
    notPayStatus() {
      uni.showToast({
        title: "当前暂不支持此支付方式",
        duration: 2000,
        icon: "none",
      });
    },

    // 立即支付按钮
    jumpPay(type) {
      if (this.payBtnStatus) {
        let _that = this
        uni.showModal({
          title: "提示",
          content: "请确定是否支付当前订单",
          success: (res) => {
            if (res.confirm) {
              let data = {
                pay_type: _that.payType === "钱包" ? 1 : _that.payType === "微信" ? 5 : "",
                code: _that.payType === "微信" ? uni.getStorageSync("userCode") : "",
              };
              let payType = type === "儿童" ? 1 : 0;

              ticket
                .payOrder(
                  uni.arrayBufferToBase64(new Buffer(_that.payOrder[payType])),
                  data
                )
                .then((res) => {
                  if (res.errorcode === 10000) {
                    if (_that.payType === "微信") {
                      console.log(res.data.pay_url)
                      let wxData = JSON.parse(res.data.pay_url);
                      console.log(wxData);
                      wx.requestPayment({
                        timeStamp: wxData.timestamp,
                        nonceStr: wxData.noncestr,
                        package: wxData.package,
                        signType: wxData.signType,
                        paySign: wxData.sign,
                        success: function(res) {
                          wx.login({
                            success(wxcode) {
                              if (wxcode.code) {
                                console.log(wxcode.code);
                                uni.setStorageSync("userCode", wxcode.code);
                              } else {
                                console.log("登录失败！" + wxcode.errMsg);
                              }
                            },
                          });
                          if (_that.payOrder.length > 1) {
                            // 携带儿童订单
                            if (payType === 1) {
                              _that.childPayStatus = true;
                            } else {
                              _that.payPayStatus = false;
                            }
                            if (_that.childPayStatus && !_that.payPayStatus) {
                              console.log("成人儿童支付成功");
                              let orderInfo = {
                                payId: _that.payOrder,
                                payType: _that.payType,
                                price: _that.price,
                                payDate: moment().format("YYYY-MM-DD HH:mm:ss"),
                              };
                              uni.reLaunch({
                                url:
                                  "/flightReservation/payResult?orderData=" +
                                  JSON.stringify(orderInfo),
                              });
                            }
                            uni.showToast({
                              title: "支付成功",
                              icon: "none",
                              mask: true,
                            });
                          } else {
                            // 单个成人订单
                            _that.payPayStatus = false;
                            let orderInfo = {
                              payId: _that.payOrder,
                              payType: _that.payType,
                              price: _that.price,
                              payDate: moment().format("YYYY-MM-DD HH:mm:ss"),
                            };
                            uni.reLaunch({
                              url:
                                "/flightReservation/payResult?orderData=" +
                                JSON.stringify(orderInfo),
                            });
                          }
                        },
                        fail: function(res) {
                          uni.showToast({
                            title: "已取消支付",
                            icon: "none",
                          });
                        },
                        complete: function(res) {},
                      });
                    } else {
                      if (_that.payOrder.length > 1) {
                        // 携带儿童订单
                        if (payType === 1) {
                          _that.childPayStatus = true;
                        } else {
                          _that.payPayStatus = false;
                        }
                        if (_that.childPayStatus && !_that.payPayStatus) {
                          console.log("成人儿童支付成功");
                          let orderInfo = {
                            payId: _that.payOrder,
                            payType: _that.payType,
                            price: _that.price,
                            payDate: moment().format("YYYY-MM-DD HH:mm:ss"),
                          };
                          uni.reLaunch({
                            url:
                              "/flightReservation/payResult?orderData=" +
                              JSON.stringify(orderInfo),
                          });
                        }
                        uni.showToast({
                          title: "支付成功",
                          icon: "none",
                          mask: true,
                        });
                      } else {
                        // 单个成人订单
                        _that.payPayStatus = false;
                        let orderInfo = {
                          payId: _that.payOrder,
                          payType: _that.payType,
                          price: _that.price,
                          payDate: moment().format("YYYY-MM-DD HH:mm:ss"),
                        };
                        uni.reLaunch({
                          url:
                            "/flightReservation/payResult?orderData=" +
                            JSON.stringify(orderInfo),
                        });
                      }
                    }
                  } else {
                    if (payType === 1) {
                      _that.childPayStatus = false;
                    } else {
                      _that.payPayStatus = false;
                      _that.payBtnStatus = false;
                    }
                    uni.showToast({
                      title: res.data.msg,
                      icon: "none",
                      duration: 4000,
                    });
                  }
                });
            }
          },
        });
      }
    },
  },
  onLoad(data) {
    this.headerName = this.$globalType
    console.log(data);
    console.log("确认支付", data);
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.payOrder = JSON.parse(data.orderId);
    this.flightData = JSON.parse(data.flightData);
    this.price = data.price;
    this.priceList = JSON.parse(data.priceList);

    this.orderType = JSON.parse(data.type);
    this.passengerList = data.passMessage ? JSON.parse(data.passMessage) : [];
    if (data.headerType) {
      this.headerType = false;
    }

    console.log(
      "航班信息",
      this.flightData,
      "航班头部状态",
      this.headerType,
      "乘客信息",
      this.passengerList
    );

    if (this.orderType) {
      this.flightRoundData = JSON.parse(data.flightRoundData);
    }
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
  .price_other {
    color: rgba(255, 255, 255, 1);
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
