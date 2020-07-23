<!--
 * @Description: 旅客管理 - 乘机人列表没有乘客时显示
 * @Author: wish.WuJunLong
 * @Date: 2020-07-23 18:23:19
 * @LastEditTime: 2020-07-23 18:30:47
 * @LastEditors: wish.WuJunLong
--> 
<template>
  <view class="passenger_manage">
    <yun-header :statusHeight="iStatusBarHeight" centerTitle="旅客管理"></yun-header>
    <view class="manage_main">
      <image class="main_icon" src="@/static/passenger_manage_icon.png" mode="contain" />

      <view class="mian_text">您还没有旅客信息</view>

			<view class="add_passenger_btn">
        <image class="add_icon" src="@/static/add_passenger_btn.png" mode />
        <text>添加旅客</text>
      </view>

    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      iStatusBarHeight: 0 // 状态栏高度
    };
  },

  onLoad() {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
  }
};
</script>

<style lang="less" scoped>
.passenger_manage {
  background: rgba(243, 245, 247, 1);
  display: flex;
  flex-direction: column;
  height: 100vh;
  .manage_main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .main_icon {
      width: 435upx;
      height: 358upx;
    }
    .mian_text {
      text-align: center;
      margin: 92upx 0 220upx;
      font-size: 32upx;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      letter-spacing: 5upx;
		}
		.add_passenger_btn {
      
      width: 650upx;
			height: 90upx;
			background:linear-gradient(90deg,rgba(0,112,226,1) 0%,rgba(86,197,255,1) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 80upx;
      font-size: 32upx;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      letter-spacing: 6upx;
      .add_icon {
        width: 35upx;
        height: 35upx;
        margin-right: 12upx;
      }
    }
  }
}
</style>
