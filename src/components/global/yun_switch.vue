<!--
 * @Description: 功能组件 - switch 开关
 * @Author: wish.WuJunLong
 * @Date: 2020-07-23 11:38:53
 * @LastEditTime: 2021-09-18 09:17:18
 * @LastEditors: mzr
--> 
<template>
  <view :class="['yun_switch',{'active': value,'is_disabled':disabled,'active_train':trainValue}]" @click="chlickSwitch">
    <view class="switch_btn"></view>
    <text v-if="text" class="switch_text">{{text}}</text>
  </view>
</template>

<script>
export default {
  name: "yun_switch",
  props: {
    value: {  // 开关状态
      type: Boolean,
      default: () => false
    },
    // 火车票 车票预定选择保险
    trainValue: {
      type:Boolean,
      default:() => false
    },
    text: {
      type: String,
      default: () => ''
    },
    index: {
      type: Number,
      default: () => 0
    },
    disabled: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {};
  },
  methods: {
    chlickSwitch() {
      if(this.disabled){
        return false
      }
      this.$emit("switchStauts", !this.value, this.index,!this.trainValue);
    }
  }
};
</script>

<style lang="less" scoped>
.yun_switch {
  width: 120upx;
  height: 44upx;
  border-radius: 50upx;
  background-color: #eaeaec;
  padding: 2upx;
  display: flex;
  align-items: center;
  transition: all 0.3s;
  position: relative;
  &.is_disabled{
    
  }
  &.active {
    background-color: #036fe5;
    .switch_btn {
      left: 80upx;
    }
    .switch_text{
      left: 20upx;
    }
  }
  &.active_train {
    background-color: #5AB957;
    .switch_btn {
      left: 80upx;
    }
    .switch_text{
      left: 20upx;
    }
  }
  .switch_text {
    font-size:  20upx;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    position: absolute;
    left: 62upx;
  }
  .switch_btn {
    height: 40upx;
    width: 40upx;
    background-color: #fff;
    border-radius: 50%;
    position: absolute;
    left: 6upx;
    transition: all 0.3s;
  }
}
</style>
