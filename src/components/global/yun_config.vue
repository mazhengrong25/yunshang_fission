<!--
 * @Description: 信息弹窗
 * @Author: wish.WuJunLong
 * @Date: 2020-09-07 15:24:39
 * @LastEditTime: 2020-09-07 15:54:13
 * @LastEditors: wish.WuJunLong
-->
<template>
  <uni-popup ref="configPopup" type="dialog">
    <view class="config_box">
      <view class="box_title">{{configData.title || '标题'}}</view>
      <view class="box_content">{{configData.content || '标题'}}</view>
      <view class="box_bottom">
        <view class="submit" @click="submitConfig()">确 定</view>
        <view @click="closeConfig()">取 消</view>
      </view>
    </view>
  </uni-popup>
</template>
<script>
export default {
  props: {
    configData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  methods: {
    // 打开弹窗
    openConfigPopup() {
      this.$refs.configPopup.open();
    },
    // 关闭弹窗
    closeConfig() {
      this.$refs.configPopup.close();
    },

    // 确认按钮
    submitConfig() {
      this.$emit("submitConfig");
      this.closeConfig()
    },
  },
};
</script>
<style lang="less" scoped>
.config_box {
  width: 540upx;
  height: 330upx;
  background: rgba(255, 255, 255, 1);
  border-radius: 20upx;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-top: 36upx;
  .box_title {
    font-size: 36upx;
    font-weight: bold;
    color: rgba(42, 42, 42, 1);
    text-align: center;
    margin-bottom: 18upx;
  }
  .box_content {
    height: 80upx;
    margin: 0 20upx;
    padding: 0 22upx;
    padding: 0 20upx 20upx;
  }
  .box_bottom {
    margin-top: auto;
    display: flex;
    align-items: center;
    height: 90upx;
    view {
      flex: 1;
      background: rgba(0, 112, 226, 0.1);
      font-size: 28upx;
      font-weight: 400;
      color: rgba(0, 112, 226, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      &.submit {
        background: rgba(0, 112, 226, 1);
        color: rgba(255, 255, 255, 1);
      }
    }
  }
}
</style>