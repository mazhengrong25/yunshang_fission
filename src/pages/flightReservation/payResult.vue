<!--
 * @Description: 支付结果页
 * @Author: wish.WuJunLong
 * @Date: 2020-08-25 15:35:17
 * @LastEditTime: 2020-09-27 09:50:49
 * @LastEditors: wish.WuJunLong
-->
<template>
  <view class="pay_result">
    <yun-header :statusHeight="iStatusBarHeight" centerTitle="支付结果"></yun-header>
    <view class="result_main">
      <view class="main_header">
        <image class="header_icon" src="@/static/order_result.png" mode="contain" />
        <text class="header_message">支付成功</text>
      </view>

      <view class="main_content">
        <view class="content_box">
          <view class="price">
            <text>&yen;</text>{{orderInfo.price}}
          </view>

          <view class="order_info">
            <view class="info_list" v-for="(item, index) in orderInfo.payId" :key="index">
              <view class="list_title">{{orderInfo.payId.length > 1 && index === 0? '成人': orderInfo.payId.length > 1 && index === 1? '儿童': ''}}订单号</view>
              <view class="list_text">{{item}}</view>
            </view>
            <view class="info_list">
              <view class="list_title">支付时间</view>
              <view class="list_text">{{orderInfo.payDate}}</view>
            </view>
            <view class="info_list">
              <view class="list_title">支付方式</view>
              <view class="list_text">{{orderInfo.payType}}支付</view>
            </view>
            <view class="info_list">
              <view class="list_title">收款方</view>
              <view class="list_text">重庆云上航空票务股份有限公司</view>
            </view>
          </view>
        </view>
      </view>

      <view class="main_submit">
        <button class="submit_btn return_btn" @click="jumpIndex()">返回首页</button>
        <button class="submit_btn jump_btn" @click="jumpOrderDetails()">订单详情</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
			iStatusBarHeight: 0, // 导航栏高度
			orderInfo: {}
    };
  },
  methods: {
    // 返回首页按钮
    jumpIndex() {
      uni.switchTab({
        url: "/pages/index/index",
      });
    },
    // 跳转订单详情页
    jumpOrderDetails() {
      uni.reLaunch({
        url: "/pages/order/orderinterDetails?orderNo=" + this.orderInfo.payId[0],
      });
    },
  },
  onLoad(data) {
		this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
		this.orderInfo = JSON.parse(data.orderData)
		console.log(this.orderInfo)
  },
};
</script>

<style lang="less" scoped>
.pay_result {
  background: rgba(243, 245, 247, 1);
  display: flex;
  flex-direction: column;
  height: 100vh;
  .result_main {
    position: relative;
    &::before {
      content: "";
      display: block;
      width: 100%;
      height: 320upx;
      background: rgba(0, 112, 226, 1);
      box-shadow: 5px 15px 27px rgba(0, 0, 0, 0.05);
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
    }
    .main_header {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 44upx;
      margin-bottom: 28upx;
      .header_icon {
        width: 203upx;
        height: 169upx;
        object-fit: contain;
      }
      .header_message {
        font-size: 40upx;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        margin-left: 20upx;
      }
    }
    .main_content {
      position: relative;
      z-index: 2;
      margin: 0 20upx;
      &::before {
        content: "";
        width: 100%;
        height: 20upx;
        background: rgba(1, 80, 161, 1);
        border-radius: 12upx;
        position: absolute;
        top: -10upx;
        left: 0;
        z-index: 0;
      }
      .content_box {
        margin: 0 20upx;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 12upx 18upx rgba(0, 0, 0, 0.04);
        border-radius: 0 0 20upx 20upx;
        position: relative;
        z-index: 1;
        padding: 60upx 20upx;
        &::before {
          content: "";
          width: 100%;
          height: 30upx;
          background: linear-gradient(
            180deg,
            rgba(0, 112, 226, 0.3) 0%,
            rgba(0, 112, 226, 0) 100%
          );
          position: absolute;
          top: 0;
          left: 0;
        }
        .price {
          display: flex;
          justify-content: center;
          align-items: baseline;
          font-size: 60upx;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
          border-bottom: 2upx dashed rgba(217, 225, 234, 1);
          padding-bottom: 42upx;
          margin-bottom: 60upx;
          text {
            font-size: 28upx;
            font-weight: 400;
          }
        }
        .order_info {
          .info_list {
            display: flex;
            align-items: center;
            &:not(:last-child) {
              margin-bottom: 50upx;
            }
            .list_title {
              font-size: 24upx;
              font-weight: 400;
              color: rgba(153, 153, 153, 1);
              min-width: 100upx;
              margin-right: 20upx;
            }
            .list_text {
              font-size: 24upx;
              font-weight: 400;
              color: rgba(42, 42, 42, 1);
            }
          }
        }
      }
    }
    .main_submit {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 80upx;
      .submit_btn {
        width: 320upx;
        height: 90upx;
        border-radius: 80upx;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        &:not(:last-child) {
          margin-right: 20upx;
        }
        &.return_btn {
          font-size: 32upx;
          font-weight: 400;
          color: rgba(0, 112, 226, 1);
          border: 2upx solid rgba(0, 112, 226, 1);
        }
        &.jump_btn {
          background: linear-gradient(
            90deg,
            rgba(0, 112, 226, 1) 0%,
            rgba(86, 197, 255, 1) 100%
          );
          box-shadow: 0 6upx 12upx rgba(0, 112, 226, 0.3);
          font-size: 32upx;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
        }
      }
    }
  }
}
</style>

