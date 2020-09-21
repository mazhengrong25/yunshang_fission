<!--
 * @Description: 信息弹窗
 * @Author: wish.WuJunLong
 * @Date: 2020-09-07 15:24:39
 * @LastEditTime: 2020-09-21 15:27:32
 * @LastEditors: wish.WuJunLong
-->
<template>
  <uni-popup ref="configPopup" type="dialog">
    <view class="config_box">
      <view class="box_title">{{title}}</view>  
      <view class="box_content" v-if="content">{{content}}</view>
      <view class="input_value" v-if="showInput">
        <input type="text" v-model="inputValue" placeholder="请输入姓名" placeholder-class="input_placeholder">
      </view>
      <view class="box_bottom">
        <view class="submit_btn active" @click="submitConfig('left')">{{submitText.left}}</view>
        <view class="submit_btn" @click="submitConfig('right')">{{submitText.right}}</view>
      </view>
    </view>
  </uni-popup>
</template>
<script>
export default {
  props: {
    // configData: {
    //   type: Object,
    //   default: () => {}
    // },

      title: {
      // 居中文字标题
      type: String,
      default: () => "",
    },
     content: {
      // 内容摘要
      type: String,
      default: () => "",
    },
    submitIndex: {
      // 确认按钮位置
      type: String,
      default: () => 'left'
    },

    showInput: {
      type: Boolean,
      default: () => false
    },

    submitText:{
      type: Object,
      default: () => ({
        left: '点 错 了',
        right: '确 认 取 消'
      })
    }

  },
  data() {
    return {
      inputValue: ''
    }
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
    submitConfig(type) {
      if(this.submitIndex === type){
         this.$emit("submitConfig",this.inputValue);
      }
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
    font-size: 26upx;
    height: 80upx;
    letter-spacing: 2px;
    margin-left: 122upx;
    padding: 30upx 50upx 30upx 20upx;
    color: rgba(42, 42, 42, 1);
  }
  .input_value{
    height: 80upx;
    padding: 0 40upx;
    display: flex;
    align-items: center;
    justify-content: center;
    input{
      border: 2upx solid #F1F3F5;
      width: 100%;
      padding: 10upx 20upx;
    }
  }
  .box_bottom {
    margin-top: auto;
    display: flex;
    align-items: center;
    height: 90upx;
    .submit_btn {
      flex: 1;
      background: rgba(0, 112, 226, 0.1);
      font-size: 28upx;
      font-weight: 400;
      color: rgba(0, 112, 226, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      &.active {
        background: rgba(0, 112, 226, 1);
        color: rgba(255, 255, 255, 1);
      }
    }
  }
}
</style>