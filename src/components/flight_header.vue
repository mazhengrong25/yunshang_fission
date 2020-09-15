<!--
 * @Description: 航班信息 - 头部信息
 * @Author: wish.WuJunLong
 * @Date: 2020-06-24 16:18:02
 * @LastEditTime: 2020-09-15 11:07:08
 * @LastEditors: wish.WuJunLong
--> 
<template>
  <view class="fight_header">
    <view class="fight_list">
      <view class="header_message">
        <view class="header_type">{{flightData.flightType}}</view>
        <view class="header_time">{{flightData.time}} {{flightData.week}}</view>
      </view>

      <view class="content_message">
        <view class="left_message address_message">
          <view class="time">{{flightData.fromTime}}</view>
          <view class="address">{{flightData.fromAddress}}</view>
        </view>
        <view class="center_message">
          <view
            class="duration"
          >{{flightData.duration.indexOf(':') !== -1?Number(flightData.duration.split(":")[0]):flightData.duration}}h{{flightData.duration.indexOf(':') !== -1?Number(flightData.duration.split(":")[1]):flightData.duration}}m</view>
          <view class="arrow_icon"></view>
        </view>
        <view class="right_message address_message">
          <view class="time">{{flightData.toTime}}</view>
          <view class="address">{{flightData.toAddress}}</view>
        </view>
      </view>

      <view class="bottom_message">
        <image class="bottom_message_icon" :src="flightData.airIcon" mode="contain" />
        {{flightData.airline}}{{flightData.model?' | '+ flightData.model: ''}} {{flightData.food? ' | 有餐食': ''}}
      </view>

      <view class="flight_reservation_box" v-if="!flightInfo && !roundTripType"  @click="openHeadExp">
        {{flightData.cabin?flightData.cabin+' | ': ''}}退改签规则 {{flightData.baggage?' | '+ flightData.baggage: ''}}
        <view class="message_more_btn"></view>
      </view>
    </view>
    <view class="fight_list found_fight_list" v-if="roundTripType">
      <view class="header_message">
        <view class="header_type round_trip_type">{{roundTripFlightData.flightType}}</view>
        <view class="header_time">{{roundTripFlightData.time}} {{roundTripFlightData.week}}</view>
      </view>
      <view class="content_message">
        <view class="left_message address_message">
          <view class="time">{{roundTripFlightData.fromTime}}</view>
          <view class="address">{{roundTripFlightData.fromAddress}}</view>
        </view>
        <view class="center_message">
          <view
            class="duration"
          >{{roundTripFlightData.duration.indexOf(':') !== -1?Number(roundTripFlightData.duration.split(":")[0]):roundTripFlightData.duration}}h{{roundTripFlightData.duration.indexOf(':') !== -1?Number(flightData.duration.split(":")[1]):flightData.duration}}m</view>
          <view class="arrow_icon"></view>
        </view>
        <view class="right_message address_message">
          <view class="time">{{roundTripFlightData.toTime}}</view>
          <view class="address">{{roundTripFlightData.toAddress}}</view>
        </view>
      </view>

      <view class="bottom_message">
        <image class="bottom_message_icon" :src="roundTripFlightData.airIcon" mode="contain" />
        {{roundTripFlightData.airline}}{{roundTripFlightData.model?' | '+ roundTripFlightData.model: ''}} {{roundTripFlightData.food? ' | 有餐食': ''}}
      </view>

      <view class="flight_reservation_box" v-if="!flightInfo">
        {{flightData.cabin?flightData.cabin+' | ': ''}}退改签规则 {{flightData.baggage?' | '+ flightData.baggage: ''}}
        <view class="message_more_btn"></view>
      </view>
      <view class="flight_reservation_box" v-if="!flightInfo">
        {{roundTripFlightData.cabin?roundTripFlightData.cabin+' | ': ''}}退改签规则 {{roundTripFlightData.baggage?' | '+ roundTripFlightData.baggage: ''}}
        <view class="message_more_btn"></view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    flightInfo: {
      // 航班信息状态 true 航班信息、 false 预定页面
      type: Boolean,
      default: () => true,
    },
    flightData: {
      // 航班信息数据
      type: Object,
      default: () => {},
    },
    roundTripFlightData: {
      // 往返数据
      // 返程数据
      type: Object,
      default: () => {},
    },
    roundTripType: {
      // 是否往返
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {};
  },
  methods: {
    openHeadExp(){
      console.log('打开弹窗')
      this.$emit('openHeadExpPopup')
      
    },
  },
};
</script>

<style scoped lang="less">
.fight_header {
  border-radius: 20upx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 12upx 18upx rgba(0, 0, 0, 0.04);
  padding: 30upx 20upx 22upx;
  margin: 0 20upx 20upx;
  .fight_list {
    &:nth-child(2) {
      margin-top: 30upx;
      padding-top: 30upx;
      border-top: 2upx dashed #d9e1ea;
    }
    &.found_fight_list {
      .flight_reservation_box {
        border: unset;
        margin-top: 18rpx;
        padding-top: 0;
        justify-content: flex-start;
        padding-left: 6rpx;
        &::before {
          content: "";
          display: inline-flex;
          width: 24upx;
          height: 24upx;
          border-radius: 50%;
          align-items: center;
          justify-content: center;
          margin-right: 12upx;
          font-size: 16upx;
          font-weight: 400;
          color: #ffffff;
        }
        &:nth-last-child(2) {
          padding-top: 28upx;
          margin-top: 20upx;
          border-top: 2upx solid #D9E1EA;
          &::before {
            content: "去";
            background: #bfdfff;
          }
        }
        &:last-child {
          &::before {
            content: "返";
            background: #c2efc1;
          }
        }
      }
    }
  }

  .header_message {
    display: flex;
    align-items: center;
    margin-bottom: 20upx;

    .header_type {
      display: inline-flex;
      padding: 2upx 20upx;
      background: linear-gradient(
        270deg,
        rgba(0, 112, 226, 1) 0%,
        rgba(86, 197, 255, 1) 100%
      );
      border-radius: 10upx;
      font-size: 20upx;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      margin-right: 20upx;
      &.round_trip_type {
        background: linear-gradient(90deg, #9bec99 0%, #85cd83 100%);
      }
    }

    .header_time {
      font-size: 24upx;
      font-weight: 400;
      color: rgba(42, 42, 42, 1);
    }
  }

  .content_message {
    display: flex;
    justify-content: space-between;
    margin-bottom: 26upx;

    .address_message {
      .time {
        font-size: 36upx;
        font-weight: bold;
        color: rgba(42, 42, 42, 1);
        margin-bottom: 8upx;
      }

      .address {
        font-size: 24upx;
        font-weight: 400;
        color: rgba(42, 42, 42, 1);
      }

      &.right_message {
        text-align: right;
      }
    }

    .center_message {
      font-size: 22upx;
      font-weight: 400;
      color: rgba(175, 185, 196, 1);
      position: relative;

      .arrow_icon {
        background: url(@/static/ticket_path.png) no-repeat;
        background-size: contain;
        width: 113upx;
        height: 21upx;
        position: absolute;
        top: 22upx;
        left: -6upx;
      }
    }
  }

  .bottom_message {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20upx;
    font-weight: 400;
    color: rgba(175, 185, 196, 1);

    .bottom_message_icon {
      display: inline-flex;
      width: 22upx;
      height: 16upx;
      margin-right: 8upx;
    }
  }

  .flight_reservation_box {
    border-top: 1px dashed rgba(217, 225, 234, 1);
    margin-top: 24upx;
    padding-top: 22upx;
    font-size: 24upx;
    font-weight: 400;
    color: rgba(175, 185, 196, 1);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    .message_more_btn {
      background: url(@/static/arrow.png) no-repeat;
      background-size: contain;
      width: 8upx;
      height: 14upx;
      margin-left: 18upx;
      display: inline-flex;
    }
  }
}
</style>
