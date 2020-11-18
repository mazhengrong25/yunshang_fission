<!--
 * @Description: 订单主页
 * @Author: wish.WuJunLong
 * @Date: 2020-06-16 13:42:22
 * @LastEditTime: 2020-11-18 13:40:46
 * @LastEditors: Please set LastEditors
-->
<template>
  <view class="order">
    <yun-header
      :showReturn="false"
      :statusHeight="iStatusBarHeight"
      centerTitle="订单"
    ></yun-header>

    <scroll-view :enable-back-to-top="true" :scroll-y="true" class="content">
      <view class="order_list">
        <view class="order_left">
          <view class="order_icon">
            <image src="@/static/order_1.png" mode="aspectFit" />
          </view>
          <view class="order_title">国内机票</view>
        </view>
        <view class="order_right">
          <view class="list_item" @click="jumpOrderList('0')">国内订单</view>
          <view class="list_item" @click="goRefundList()">国内退票订单</view>
          <view class="list_item" @click="goChangeList()">国内改签订单</view
          >
        </view>
      </view>
      <view class="order_list" v-if="false">
        <view class="order_left">
          <view class="order_icon">
            <image src="@/static/order_2.png" mode="aspectFit" />
          </view>
          <view class="order_title">国际机票</view>
        </view>
        <view class="order_right">
          <view class="list_item" @click="jumpOrderList('3')">国际订单</view>
          <view class="list_item" @click="jumpOrderList('4')"
            >国际退票订单</view
          >
          <view class="list_item" @click="jumpOrderList('5')"
            >国际改签订单</view
          >
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
    };
  },
  methods: {
    jumpOrderList(type) {
      
      // return uni.showToast({
      //   title: "当前功能开发中，请等待后续版本更新",
      //   duration: 3000,
      //   icon: "none",
      // });
      
      uni.navigateTo({
        url: "/order/orderList?type=" + type,
      });
    },
    // 跳转到国内退票订单
    goRefundList() {
      //  return uni.showToast({
      //     title: "当前功能开发中，请等待后续版本更新",
      //     duration: 3000,
      //     icon: "none",
      //   });
      uni.navigateTo({
        url: "/order/refundList",
      });
    },

    //跳转到国内改签订单
    goChangeList() {

      // return uni.showToast({
      //   title: "当前功能开发中，请等待后续版本更新",
      //   duration: 3000,
      //   icon: "none",
      // });

      uni.navigateTo({
        url: "/order/changeList",
      });
      
    },
  },
  onLoad() {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
  },
  onShow() {
    uni.removeStorageSync("orderListFilter");
  },
};
</script>

<style lang="less" scoped>
.order {
  background: rgba(243, 245, 247, 1);
  height: 100vh;
  display: flex;
  flex-direction: column;
  .content {
    flex: 1;
    padding: 20upx;
    box-sizing: border-box;

    .order_list {
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 12upx 18upx rgba(0, 0, 0, 0.04);
      border-radius: 20upx;
      display: flex;
      align-items: center;
      padding: 40upx 0;
      margin-bottom: 20upx;

      .order_left {
        width: 240upx;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .order_icon {
          width: 100upx;
          height: 100upx;
          image {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }
        .order_title {
          font-size: 32upx;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
          margin-top: 20upx;
        }
      }
      .order_right {
        flex: 1;
        padding-left: 40upx;
        border-left: 2upx solid #f1f3f5;
        .list_item {
          font-size: 28upx;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          padding: 50upx 30upx 50upx 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          &::after {
            content: "";
            display: inline-block;
            background: url(@/static/arrow.png) no-repeat center center;
            background-size: contain;
            width: 12upx;
            height: 20upx;
          }
          &:first-child {
            padding-top: 20upx;
          }
          &:last-child {
            padding-bottom: 12upx;
          }
          &:not(:last-child) {
            border-bottom: 2upx solid #f1f3f5;
          }
        }
      }
    }
  }
}
</style>
