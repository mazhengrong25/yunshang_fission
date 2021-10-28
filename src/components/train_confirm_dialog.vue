<!--
 * @Description: 确认退票/改签弹窗
 * @Author: mzr
 * @Date: 2021-09-07 14:04:01
 * @LastEditTime: 2021-10-28 09:26:09
 * @LastEditors: mzr
-->
<template>
  <uni-popup class="train_pop_modal" ref="trainConfirm" type="bottom">
    <view class="train_pop">
        <view class="title">
            <view class="explanation_header">确认{{titleType === "change"?"改签":"退票"}}</view>
            <view class="close_btn" @click="closePop()"></view>
        </view>
        <view class="refund_content">
            <view class="content_title">
                {{titleType === "change"?"改签新车次":"退票行程"}}
                 <text v-if="titleType === 'change'">
                    {{trainObject.train?$moment(trainObject.train.departure_date).format('YYYY-MM-DD'):'-'}}（{{trainObject.train?$moment(trainObject.train.departure_date).format('ddd'):'-'}}）
                    
                </text>
                 <text v-else>
                    {{trainObject.segments[0]?$moment(trainObject.segments[0].departure_time).format('YYYY-MM-DD'):'-'}}（{{trainObject.segments[0]? $moment(trainObject.segments[0].departure_time).format('ddd'):'-'}}）
                    
                </text>
            </view>
            <view class="content_background">
                <view class="background_left" v-if="titleType==='change'">
                    {{trainObject.train.departure}}
                    <text>{{trainObject.station.departure_name}}</text>
                </view>
                <view class="background_left" v-else>
                    {{trainObject.segments[0]?$moment(trainObject.segments[0].departure_time).format('HH:mm'):'-'}}
                    <text>{{trainObject.segments[0].from_city}}</text>
                </view>
                <view class="background_middle">
                    <view class="middle_img"></view>
                    <view class="middle_text">{{titleType === "change" ? trainObject.train.code:trainObject.segments[0].train_number}}</view>
                </view>
                <view class="background_left" v-if="titleType==='change'">
                    {{trainObject.train.arrive}}
                    <text style="text-align:right">{{trainObject.station.arrive_name}}</text>
                </view>
                <view class="background_left" v-else>
                    {{trainObject.segments[0]?$moment(trainObject.segments[0].arrive_time).format('HH:mm'):'-'}}
                    <text style="text-align:right">{{trainObject.segments[0].to_city}}</text>
                </view>
            </view>
            <view class="content_title">{{titleType === "change"?"改签":"退票"}}乘客</view>
            <view class="content_background passenger">
                <view class="passenger_list" v-for="(item,index) in passengerArray" :key="index">
                    <view class="type_item">
                        <view :class="['passenger_img',{'difference':(item.PassengerType === 'CHD')}]"></view>
                        <view class="passenger_name">{{item.PassengerName}}</view>
                    </view>
                    <view class="passenger_item">
                        <!-- <view>座位号:</view> -->
                        <view class="item_value">{{item.seat_info.replace("厢,","")}}</view>
                    </view>
                    <view class="passenger_item">
                        <!-- <view>票号:</view> -->
                        <view class="item_value">{{item.ticket_no}}</view>
                    </view>
                </view>
            </view>
        </view>

        <view class="filter_bottom">
            <view class="bottom_btn reset_btn" @click="closePop">取消</view>

            <button class="bottom_btn submit_btn" @click="yesBtn">
                确认{{titleType === "change"?"改签":"退票"}}
            </button>
        </view>
    </view>
  </uni-popup>
</template>

<script>
export default {
    props: {
        //  行程信息
        trainObject: {
            type: Object,
            default: () => {}
        },

        // 乘客信息
        passengerArray: {
            type: Array,
            default: () => []
        },

        // 区别退票改签
        titleType: {
            type: String,
            default: () => ""
        },
    },
    data() {
        return {

        }
    },
    methods: {
        //  打开弹窗
        openPop() {
          this.$refs.trainConfirm.open();
        },
        // 关闭弹窗
        closePop() {
          this.$refs.trainConfirm.close();
        },

        // 确认退票
        yesBtn() {
          this.$emit('confirmRefund', true)
        }
    },
}
</script>
<style lang="less" scoped>
.train_pop_modal {
  .train_pop {
      height: 70vh;
      .title {
          height: 60px;
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
                      content: "";
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
      .refund_content {
          height: 45vh;
          overflow-y: auto;
          background-color: rgba(255, 255, 255, 1);
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 40upx 20upx 0upx;
          .content_title {
              font-size: 32upx;
              font-weight: bold;
              color: #2a2a2a;
              text {
                  font-size: 26upx;
                  font-weight: 400;
                  margin-left: 20upx;
              }
          }
          .content_background {
              background: #f3f5f7;
              border-radius: 20upx;
              margin: 20upx 0upx 50upx;
              display: flex;
              justify-content: space-between;
              // align-items: center;
              padding: 28upx 20upx;
              .background_left {
                  display: inline-grid;
                  font-size: 48upx;
                  font-weight: bold;
                  color: #333333;
                  text {
                      font-size: 26upx;
                      font-weight: 400;
                      color: #2a2a2a;
                  }
              }
              .background_middle {
                  margin-top: 24upx;
                  .middle_img {
                      width: 124upx;
                      height: 21upx;
                      background: url("@/static/train_path.png") no-repeat center
                          center;
                      background-size: cover;
                  }
                  .middle_text {
                      font-size: 26upx;
                      font-weight: 400;
                      color: #afb9c4;
                      width: 120upx;
                      text-align: center;
                      margin-top: 18upx;
                  }
              }
              &.passenger {
                  display: flex;
                  flex-direction: column;
                  .passenger_list {
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      font-size: 26upx;
                      margin: 15upx 0upx;
                      .type_item {
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          .passenger_img {
                              width: 30upx;
                              height: 30upx;
                              background: url("@/static/train_pop_adt.png")
                                  no-repeat center center;
                              background-size: contain;
                              &.difference {
                                  background: url("@/static/train_pop_chd.png")
                                      no-repeat center center;
                                  background-size: contain;
                              }
                          }
                          .passenger_name {
                              font-weight: bold;
                              color: #2a2a2a;
                              min-width: 80upx;
                              margin-left: 10upx;
                          }
                      }
                      .passenger_item {
                          display: flex;
                          color: #333333;
                          // margin: 0upx 16upx;
                          .item_value {
                              font-weight: bold;
                          }
                      }
                  }
              }
          }
      }
      .filter_bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: fixed;
          border-top: 2upx solid rgba(229, 229, 229, 1);
          bottom: 0;
          left: 0;
          width: 100vw;
          height: calc(144upx + var(--status-bar-height));
          padding: 26upx 20upx;
          padding-bottom: calc(26upx + var(--status-bar-height));
          box-sizing: border-box;
          background: #fff;
          z-index: 1;
          .bottom_btn {
              width: 320upx;
              height: 90upx;
              border: 2upx solid transparent;
              border-radius: 80upx;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 32upx;
              font-weight: 400;
              margin: 0;
              letter-spacing: 10upx;
              &.reset_btn {
                  border-color: rgba(0, 112, 226, 1);
                  color: rgba(0, 112, 226, 1);
              }
              &.submit_btn {
                  background: linear-gradient(
                      90deg,
                      rgba(0, 112, 226, 1) 0%,
                      rgba(86, 197, 255, 1) 100%
                  );
                  box-shadow: 0 6upx 12upx rgba(0, 112, 226, 0.3);
                  color: rgba(255, 255, 255, 1);
              }
              &.disabled {
                  opacity: 0.4;
              }
          }
      }
  }
}
</style>