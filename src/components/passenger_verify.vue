<!--
 * @Description: 火车票 --- 选择乘车人 (乘车人核验)
 * @Author: mzr
 * @Date: 2021-09-09 10:03:14
 * @LastEditTime: 2021-09-17 16:14:45
 * @LastEditors: mzr
-->
<template>
  <uni-popup ref="verifyDialog" type="dialog">
    <view class="passenger_verify">
      <view class="verify_content">
        <view class="content_title">乘车人核验</view>
        <view class="content_input">
          乘客<view class="input_inline">【{{passengerName}}】</view>手机号码尚未通过核验。根据有关部门要求，乘客需办理手机号核验后方可购票，请根据步骤完成手机号核验
        </view>
        <view class="content_button">
          <view class="submit_button" @click="colseVerifyPopup()">暂 不 核 验</view>
          <view class="submit_button sign" @click="jumpVerify()">去 核 验</view>
        </view>
      </view>
    </view>
  </uni-popup>
</template>

<script>
export default {
    props: {
      // 乘客姓名
      passengerName: {
        type:String,
        default:() => "",
      }
    },
    methods: {
      // 打开弹窗
      openVerifyPopup() {
        this.$refs.verifyDialog.open();
      },
      // 关闭弹窗
      colseVerifyPopup() {
        this.$refs.verifyDialog.close();
      },
      // 跳转到核验
      jumpVerify() {
        this.$emit("jumpVerify")
      }
    },

}
</script>

<style lang="less" scoped>
.passenger_verify {
  display: flex;
  width: 600upx;
  height: 520upx;
  background: #FFFFFF;
  border-radius: 20upx;
  .verify_content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 12upx;
    padding: 30upx 36upx 34upx;
    border-radius: 20upx;
    background: linear-gradient(180deg, rgba(0, 112, 226, 0.1) 0%, rgba(0, 112, 226, 0) 100%);
    .content_title {
      font-size: 40upx;
      font-weight: bold;
      color: #2A2A2A;
      letter-spacing: 8upx;
    }
    .content_input {
      font-size: 28upx;
      font-weight: 400;
      color: #2A2A2A;
      margin: 50upx 0upx 64upx;
      letter-spacing: 4upx;
      .input_inline {
        display: inline-block;
        font-weight: bold;
      }
    }
    .content_button {
      display: flex;
      align-items: center;
      justify-content: center;
      .submit_button {
        background-color: rgba(0, 112, 226, .1);
        border-radius: 46upx;
        font-size: 28upx;
        font-weight: 400;
        color: #0070E2;
        width: 240upx;
        height: 90upx;
        display: flex;
        justify-content: center;
        align-items: center;
        &.sign {
          background: #0070E2;
          color: #fff;
          margin-left: 30upx;
        }
      }
    }
  }
}
</style>