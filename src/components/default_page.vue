<!--
 * @Description: 缺省页
 * @Author: wish.WuJunLong
 * @Date: 2020-09-08 14:41:53
 * @LastEditTime: 2020-10-10 09:57:08
 * @LastEditors: wish.WuJunLong
-->
<template>
  <view class="default_main">
    <image
      v-if="!defaultType"
      class="default_image"
      src="@/static/not_flight.png"
      mode="aspectFit"
    />
    <image
      v-if="defaultType === '404'"
      class="default_image"
      src="@/static/not_404.png"
      mode="aspectFit"
    />
    <image
      v-if="defaultType === 'not_passenger'"
      class="default_image"
      src="@/static/not_passenger.png"
      mode="aspectFit"
    />
    <image
      v-if="defaultType === 'not_order'"
      class="default_image"
      src="@/static/not_order.png"
      mode="aspectFit"
    />

    <view class="default_text">
      {{
        defaultType === "404"
          ? "您的页面已偏离地球，去火星看一看吧。"
          : defaultType === "not_passenger"
          ? "您还没有旅客信息"
          : defaultType === "not_order"
          ? "空空的，什么都没有"
          : "抱歉，没有查询到符合条件的航班"
      }}
    </view>

    <view v-if="showReturn" class="default_btn" @click="returnBtn"
      >重新查询</view
    >

    <view
      v-if="showAddPassenger"
      class="add_passenger_btn"
      @click="addPassenger"
      >
      <image class="passenger_icon" src="@/static/add_passenger_btn.png" mode="aspectFit" />
      添加乘客</view
    >

    <view></view>
  </view>
</template>
<script>
export default {
  props: {
    showReturn: {
      type: Boolean,
      default: () => false,
    },
    defaultType: {
      type: String,
      default: () => "",
    },
    showAddPassenger: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {};
  },
  methods: {
    returnBtn() {
      this.$emit("returnBtn");
    },

    addPassenger(){
      this.$emit("addPassengerBtn");
    },
  },
};
</script>
<style lang="less" scoped>
.default_main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f3f5f7;
  height: 100%;
  width: 100%;
  .default_image {
    width: 463upx;
    height: 374upx;
    object-fit: contain;
    margin: 0 auto;
  }
  .default_text {
    font-size: 32upx;
    font-weight: 400;
    color: #666666;
    letter-spacing: 4upx;
    margin-top: 100upx;
  }
  .default_btn {
    font-size: 32upx;
    font-weight: 400;
    color: #0070e2;
    letter-spacing: 4upx;
    margin-top: 64upx;
  }
  .add_passenger_btn {
    height: 90upx;
    background: linear-gradient(90deg, #0070e2 0%, #56c5ff 100%);
    box-shadow: 0 6upx 12upx rgba(0, 112, 226, 0.3);
    border-radius: 80upx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32upx;
    font-weight: 400;
    color: #ffffff;
    width: calc(100% - 100upx);
    margin-top: 15vh;
    .passenger_icon{
      width: 40upx;
      height: 40upx;
      object-fit: contain;
      margin-right: 20upx;
    }
  }
}
</style>