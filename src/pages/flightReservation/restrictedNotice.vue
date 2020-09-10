<!--
 * @Description: 锂电池运输规范
 * @Author: wish.WuJunLong
 * @Date: 2020-09-10 18:07:57
 * @LastEditTime: 2020-09-10 18:39:45
 * @LastEditors: wish.WuJunLong
-->
<template>
  <view class="restricted_notice">
    <yun-header :statusHeight="iStatusBarHeight" centerTitle="锂电池航空运输规范"></yun-header>
    <view class="notice_main">
      <view class="title">关于民航乘客携带锂电池及危险品乘机的限制性公告</view>
      <view class=""></view>


    </view>


  </view>
</template>
<script>
export default {
  data(){
    return {
      iStatusBarHeight: 0,
    }
  },
  onLoad() {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
  },
}
</script>
<style lang="less" scoped>
  .restricted_notice{
    display: flex;
    flex-direction: column;
    height: 100vh;
    .notice_main{
      float: 1;
      overflow-y: auto;
      padding: 20upx;
      .title{
        font-size: 34upx;
        text-align: center;
        padding-bottom: 10upx;
        border-bottom: 2upx solid #EAEAEA;
        margin-bottom: 20upx;
      }
    }
  }
</style>