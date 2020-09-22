<!--
 * @Description: 退票页面-退票金额参考弹窗
 * @Author: mazhengrong
 * @Date: 2020-09-22 11:10:03
 * @LastEditTime: 2020-09-22 18:29:30
 * @LastEditors: mazhengrong
-->

<template>
  <view>
    <uni-popup ref="refundAmount" type="bottom">
      <view class="flight_explanation">
        <view class="title">
          <view class="close_btn" @click="closeExp"></view>
          <view class="explanation_header">
            <view>退票金额参考</view>
          </view>
        </view>

        <view class="flight_scroll">
          <!-- 黄色警示 -->
          <view class="top_yellow">
              <view class="content">*以下退票金额仅供参考，请以实际退票金额为准</view>
          </view>
          <view class="center">
              <view class="center_order">订单总价   
              </view>
              <view class="center_order">成人销售价</view>
              <view class="center_order">机建+燃油</view>
              <view class="center_order">保险</view>
          </view>
          <view class="last">
              <view class="last_refund">退票费率</view>
              <view class="last_refund">参考退票费</view>
              <view class="last_refund">参考退票金额</view>
          </view>
      </view>
      </view>
    </uni-popup>
  </view>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      popupCurrent: 'info',
    }
  },
  created() {},
  methods: {
    checkedExplanationBtn(val) {
      this.popupCurrent = val
    },
    // 打开退改签说明弹窗
    openExp() {
      this.popupCurrent = 'info'
      this.$refs.refundAmount.open()
    },
    // 关闭产品说明弹窗
    closeExp() {
      this.$refs.refundAmount.close()
    },
  },
}
</script>
<style lang="less" scoped>
.flight_explanation {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    bottom: -120upx;
    width: 100%;
    height: 120upx;
    background-color: #fff;
  }
  .title {
    height: 120upx;
    background: rgba(255, 255, 255, 1);
    border-radius: 80upx 80upx 0 0;
    position: relative;
    border-bottom: 2upx solid rgba(217, 225, 234, 1);
    display: flex;
    align-items: flex-end;
    .explanation_header {
      display: flex;
      justify-content: center;
      width: 100%;
      padding: 120rpx 0 30rpx;
      font-size: 18px;
      font-weight: bold;
      line-height: 22px;
      color: #333333;
      opacity: 1;

      .header_btn {
        font-size: 30upx;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        &::after {
          content: '';
          width: 60upx;
          height: 8upx;
          background: rgba(0, 112, 226, 1);
          opacity: 0;
          border-radius: 4upx;
          margin-top: 32upx;
          transition: opacity 0.3s;
        }
        &.is_active {
          &::after {
            opacity: 1;
          }
          color: rgba(0, 112, 226, 1);
        }
      }
    }

    .close_btn {
      position: absolute;
      background: url(@/static/popup_close.png) no-repeat;
      background-size: contain;
      width: 30upx;
      height: 30upx;
      top: 54upx;
      right: 44upx;
    }
  }
  .flight_scroll {
    height: 60vh;
    width: 100%;
    background: rgba(255, 255, 255, 1);
   
    .top_yellow {
        width: 375px;
        height: 40px;
        background: rgba(251, 152, 38, 1);
        opacity: 0.11;
        z-index: -1;
  
        .content {
            font-size: 14px;
            font-weight: 400;
            color: rgba(251, 152, 38, 1);
            opacity: 1;
        }
    }
    .center {
      background: #F9F9F9;
      opacity: 1;
      margin: 20upx 20upx 20upx;
      padding: 24upx 20upx 20upx;
      &:first-child {
        border: 1px solid #EAEAEA;
      }
    
      .center_order {
        
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          color: #333333;
          opacity: 1;
          padding: 20upx 20upx 20upx 10upx;
      }
    }

    .last{
      
      background: #ffffff;
      opacity: 1;
      margin: 20upx 20upx 20upx;
      padding: 24upx 20upx 20upx;
      .last_refund {
        
          font-size: 14px;
          font-weight: bold;
          line-height: 22px;
          color: #333333;
          opacity: 1;
          padding: 20upx 20upx 20upx 10upx;
      }
    }

  }
}
</style>
