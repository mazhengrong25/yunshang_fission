<!--
 * @Author: mzr
 * @Date: 2020-11-10 11:14:42
 * @LastEditTime: 2021-09-10 17:19:07
 * @LastEditors: mzr
 * @Description: 添加备注
 * @FilePath: \positiond:\tests\fission\yunshang_fission\src\order\addRemark.vue
-->

<template>
  <view class="remark">
    <yun-header
      :statusHeight="iStatusBarHeight"
      :headerColor="true"
      centerTitle="添加备注"
    ></yun-header>
    <view class="content">
      <textarea
        :maxlength="100"
        placeholder-style="color:#DFDFDF"
        style="padding: 20rpx"
        v-model="content"
        placeholder="请输入备注信息"
      />
      <view class="remark_count">
        <p>{{ content.length }}</p>
        /100
      </view>
    </view>

    <button class="remark_btn" @click="getSave()">保存</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      iStatusBarHeight: 0,

      content: "", // 输入内容
    };
  },

  methods: {
    // 点击保存
    getSave() {
      if (!this.content) {
        return uni.showToast({
          title: "请输入备注信息",
          icon: "none",
        });
      }

      uni.navigateBack();
      uni.setStorageSync("remark_key", this.content);
      console.log("内容", this.content);
    },

    onLoad(data) {
      this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
      this.content = data.remark? data.remark: '';
    },
  },
};
</script>

<style lang="less" scoped>
.remark {
  display: flex;
  height: 100vh;
  background: rgba(255, 255, 255, 1);
  flex-direction: column;
  align-items: center;
  .content {
    width: 710rpx;
    height: 460rpx;
    background: #f9f9f9;
    border: 1px solid #eaeaea;
    border-radius: 20rpx;
    margin-top: 40rpx;
    position: relative;
    textarea {
      width: 100%;
      height: 80%;
      box-sizing: border-box;
    }
    .remark_count {
      display: flex;
      justify-content: flex-end;
      font-size: 24rpx;
      font-weight: 400;
      color: #333333;
      padding: 20rpx 20rpx;
      position: absolute;
      width: 100%;
      bottom: 0;
      box-sizing: border-box;

      p {
        font-size: 24rpx;
        color: #dfdfdf;
      }
    }
  }
  .remark_btn {
    display: flex;
    justify-content: center;
    width: 650rpx;
    height: 90rpx;
    background: linear-gradient(90deg, #0070e2 0%, #56c5ff 100%);
    box-shadow: 0rpx 6rpx 12rpx rgba(0, 112, 226, 0.3);
    opacity: 1;
    border-radius: 80rpx;
    color: #ffffff;
    font-weight: 400;
    font-size: 32rpx;
    letter-spacing: 4rpx;
    margin-top: 60rpx;
  }
}
</style>
