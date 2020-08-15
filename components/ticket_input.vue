<!--
 * @Description: 乘机地址选择组件
 * @Author: wish.WuJunLong
 * @Date: 2020-06-15 17:02:50
 * @LastEditTime: 2020-08-13 18:29:17
 * @LastEditors: wish.WuJunLong
--> 
<template>
  <view :class="['ticket_input',{'multi_pass':ticketType === '多程'}]">
    <view class="ticket_item">
      <text class="multi_pass_number">1</text>
      <view class="ticket_address">
        <view class="to_input address_input" @click="tocketToBtn">{{addressForm.to}}</view>
        <view
          class="check_toform_btn"
          @click="checkTickedBtn(false,addressForm.to,addressForm.from)"
        >
          <image class="ticket_image" src="@/static/ticket_btn.png" mode="contain" />
        </view>
        <view class="from_input address_input" @click="tocketFromBtn">{{addressForm.from}}</view>
      </view>

      <view class="ticket_time">
        <view class="ticket_to_time time_box" @click="jumpDate('start')">
          <view class="time_true" v-if="addressForm.toTime">
            <view class="time">{{addressForm.toTime}}</view>
            <view class="time_day">{{addressForm.toDay}}出发</view>
          </view>
          <view v-else class="time_false">
            <image class="time_icon" src="@/static/from_time.png" mode="contain" />
            <text class="time_text">出发日期</text>
          </view>
        </view>
        <view class="ticket_from_time time_box" @click="jumpDate('end')">
          <view class="time_true" v-if="addressForm.fromTime">
            <image class="close_from_btn" src="@/static/close.png" @click="closeFromBtn" />
            <view class="time">{{addressForm.fromTime}}</view>
            <view class="time_day">{{addressForm.fromDay}}返回</view>
          </view>
          <view v-else class="time_false">
            <image class="time_icon" src="@/static/from_time.png" mode="contain" />
            <text class="time_text">返程日期</text>
          </view>
        </view>
      </view>
    </view>

    <view class="ticket_item" v-if="ticketType === '多程'">
      <text class="multi_pass_number">2</text>
      <view class="ticket_address">
        <view class="to_input address_input" @click="tocketToBtn">{{addressForm.multi_pass_to}}</view>
        <view
          class="check_toform_btn"
          @click="checkTickedBtn(true,addressForm.multi_pass_to,addressForm.multi_pass_from)"
        >
          <image class="ticket_image" src="@/static/ticket_btn.png" mode="contain" />
        </view>
        <view
          class="from_input address_input"
          @click="tocketFromBtn"
        >{{addressForm.multi_pass_from}}</view>
      </view>
      <view class="ticket_time">
        <view class="ticket_to_time time_box">
          <view class="time_true" v-if="addressForm.toTime">
            <view class="time">{{addressForm.toTime}}</view>
            <view class="time_day">{{addressForm.toDay}}出发</view>
          </view>
          <view v-else class="time_false">
            <image class="time_icon" src="@/static/from_time.png" mode="contain" />
            <text class="time_text">出发日期</text>
          </view>
        </view>
        <view class="ticket_from_time time_box">
          <view class="time_true" v-if="addressForm.fromTime">
            <image class="close_from_btn" src="@/static/close.png" @click="closeFromBtn" />
            <view class="time">{{addressForm.fromTime}}</view>
            <view class="time_day">{{addressForm.fromDay}}返回</view>
          </view>
          <view v-else class="time_false">
            <image class="time_icon" src="@/static/from_time.png" mode="contain" />
            <text class="time_text">返程日期</text>
          </view>
        </view>
      </view>
    </view>

    <uni-popup ref="popup" type="message">
      <uni-popup-message type="success" message="成功消息" :duration="0"></uni-popup-message>
    </uni-popup>
  </view>
</template>

<script> 
export default {
  props: {
    ticketType: {
      // 航程类型
      type: String,
      default: () => "国内",
    },
    addressForm: {
      // 航程数据
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  methods: {
    // 出发按钮
    tocketToBtn() {
      console.log("选择出发地");
      uni.navigateTo({
        url: "/pages/citySelect/citySelect?type=to",
      });
    },
    // 切换出发返程地
    checkTickedBtn(type, to, form) {
      let data = {
        type: type,
        to: to,
        rorm: form,
      };
      this.$emit("checkTicked", data);
      console.log("交换出发返程地");
    },
    // 返程按钮
    tocketFromBtn() {
      console.log("选择返程地");
      uni.navigateTo({
        url: "/pages/citySelect/citySelect?type=from",
      });
    },
    // 清除返程按钮
    closeFromBtn() {
      console.log("清除返程");
      this.$emit("closeFromBtn", true);
    },
    // 跳转日历
    jumpDate(val){
      uni.navigateTo({
        url: "/pages/dateSelect/dateSelect?type="+val,
      });
    }
  },
};
</script>

<style scoped lang="less">
.ticket_input {
  &.multi_pass {
    .ticket_item {
      position: relative;
      &:nth-child(2) {
        margin-top: 40upx;
      }
      .multi_pass_number {
        width: 25upx;
        height: 25upx;
        background: rgba(0, 112, 226, 0.6);
        font-size: 20upx;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        left: -30upx;
        margin-right: 12upx;
        margin-top: 17upx;
        position: absolute;
      }
      .ticket_address {
        .address_input {
          border-bottom-color: transparent;
        }
      }
      .ticket_from_time {
        display: none;
      }
    }
  }
  .multi_pass_number {
    display: none;
  }
  .ticket_address {
    display: flex;
    align-items: flex-start;
    .address_input {
      height: 65upx;
      line-height: 50upx;
      border-bottom: 1px solid #e0e0e0;
      font-size: 40upx;
      font-weight: bold;
      color: rgba(42, 42, 42, 1);
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &.from_input {
        text-align: right;
      }
    }

    .check_toform_btn {
      flex-shrink: 0;
      margin: 0 40upx;
      display: inline-flex;
      align-items: center;
      justify-content: center;

      .ticket_image {
        width: 70upx;
        height: 70upx;
        object-fit: cover;
      }
    }
  }

  .ticket_time {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70upx;
    margin-top: 20upx;
    border-bottom: 2upx solid #dfdfdf;

    .time_box {
      .time_true {
        display: flex;
        align-items: center;

        .close_from_btn {
          width: 30upx;
          height: 30upx;
          object-fit: contain;
          margin-right: 16upx;
        }

        .time {
          font-size: 32upx;
          font-weight: 400;
          line-height: 38upx;
          color: rgba(42, 42, 42, 1);
        }

        .time_day {
          height: 36upx;
          font-size: 24upx;
          font-weight: 400;
          line-height: 28upx;
          color: rgba(42, 42, 42, 1);
          margin-left: 12upx;
          display: inline-flex;
          align-items: flex-end;
        }
      }

      .time_false {
        .time_icon {
          width: 30upx;
          height: 30upx;
          margin-right: 12upx;
        }

        .time_text {
          font-size: 32upx;
          font-weight: 400;
          line-height: 38upx;
          color: rgba(175, 185, 196, 1);
        }
      }
    }
  }
}
</style>
