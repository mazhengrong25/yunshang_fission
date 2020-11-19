<!--
 * @Description: 退票页面-退票金额参考弹窗
 * @Author: mazhengrong
 * @Date: 2020-09-22 11:10:03
 * @LastEditTime: 2020-11-19 15:44:11
 * @LastEditors: Please set LastEditors
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
            *以下退票金额仅供参考，请以实际退票金额为准
          </view>

          <view class="price_info">
        
              <view class="price_info_box">
                <view class="total_price_header">
                  <view class="header_left">
                    <view class="total_price_title">订单总价</view>
                    <view class="total_price_message">
                      <text>&yen;</text>{{ refundInfo.total_price }}
                    </view>
                  </view>
                </view>

                <scroll-view :scroll-y="true" class="price_info_main">
                  <view
                    :class="[
                      'price_info_list',
                      { active: priceInfoChecket === index },
                    ]"
                    v-for="(item, index) in refundInfo.ticket_passenger"
                    :key="index"
                  >
                    <view class="list_title" @click="openPriceInfo(index)">
                      <view class="title_name">{{ item.PassengerName }}</view>

                      <view class="title_price">
                        <view class="title_text">总金额</view>
                        <view class="peice_style">
                          <text>&yen; {{ item.total_price }}</text>
                          <view class="price_arrow">
                            <image src="@/static/unfold.png" mode="aspectFit" />
                          </view>
                        </view>
                      </view>
                    </view>

                    <view class="list_main">
                      <view class="list_item">
                        <view class="item_title">销售价</view>
                        <view class="item_message"
                          >&yen; {{ item.ticket_price }}</view
                        >
                      </view>

                      <view class="list_item">
                        <view class="item_title">机建/燃油</view>
                        <view class="item_message">{{
                          "&yen; " + item.build_total + " / &yen; " + item.fuel_total
                        }}</view>
                      </view>

                      <view class="list_item">
                        <view class="item_title">保险</view>
                        <view class="item_message"
                          >&yen; {{ item.insurance_total }}</view
                        >
                      </view>

                      <!-- <view class="list_item">
                        <view class="item_title">服务费</view>
                        <view class="item_message"
                          >&yen; {{ item.service_price }}</view
                        >
                      </view>
                      <view class="list_item">
                        <view class="item_title">奖励金</view>
                        <view class="item_message"
                          >&yen; {{ item.reward_price }}</view
                        >
                      </view> -->
                    </view>
                  </view>

                  <view class="price_info_list active">
                    <view class="list_title">
                      <view class="title_name">退票费率明细</view>
                    </view>
                    <view class="list_main">
                      <view class="list_item">
                        <view class="item_title">退票费率</view>
                        <view class="item_message"
                          >{{''}}%</view
                        >
                      </view>
                      <view class="list_item">
                        <view class="item_title">参考退票费</view>
                        <view class="item_message"
                          >&yen; {{''}}</view
                        >
                      </view>
                      <view class="list_item">
                        <view class="item_title">参考退票金额</view>
                        <view class="item_message"
                          >&yen; {{''}}</view
                        >
                      </view>
                    </view>
                  </view>

                  
                </scroll-view>
              </view>
          </view>

        </view>
      </view>
    </uni-popup>
  </view>
</template>
<script>
export default {
  props: {
  
      refundInfo: {
        type: Object,
        default:() => ({})
      },



  },
  data() {
    return {
      popupCurrent: "info",

      insureNumber:{},

      priceInfoChecket: null, // 订单金额明细展开值
    };
  },
  created() {},
  methods: {

    checkedExplanationBtn(val) {
      this.popupCurrent = val;
    },
    // 打开退改签说明弹窗
    openExp() {
      this.popupCurrent = "info";
      this.$refs.refundAmount.open();
    },
    // 关闭产品说明弹窗
    closeExp() {
      this.$refs.refundAmount.close();
    },

    // 展开订单金额详情信息
    openPriceInfo(i) {
      this.priceInfoChecket = this.priceInfoChecket === i ? null : i;
      this.$forceUpdate();
    },
  },
};
</script>
<style lang="less" scoped>
.flight_explanation {
  height: 469.98px;
  position: relative;
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
  .flight_scroll {
    height: 409px;
    width: 100%;
    background-color: rgba(255, 255, 255, 1);
    position: relative;
    .top_yellow {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      background-color: rgba(251, 152, 38, 0.11); //透明度
      font-size: 14px;
      font-weight: 400;
      color: rgba(251, 152, 38, 1);
    }
    .price_info {
    position: relative;
    &::before {
      content: "";
      position: absolute;
      bottom: -120upx;
      width: 100%;
      height: 120upx;
      background-color: #fff;
    }
    .title {
      height: 140upx;
      background: rgba(255, 255, 255, 1);
      border-radius: 80upx 80upx 0 0;
      position: relative;
      border-bottom: 2upx solid rgba(217, 225, 234, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: #333333;
      font-size: 36upx;
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

    .price_info_box {
      background-color: #fff;
      .total_price_header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 28upx;
        padding: 56upx 24upx 0;
        .header_left {
          display: inline-flex;
          align-items: center;
          .total_price_title {
            font-size: 32upx;
            font-weight: bold;
            color: #333333;
            margin-right: 20upx;
          }
          .total_price_message {
            font-size: 36upx;
            font-weight: bold;
            color: #ff0000;
            text {
              font-size: 28upx;
            }
          }
        }
        .header_right {
          display: inline-flex;
          align-items: center;
          .total_price_title {
            font-size: 26upx;
            color: #333333;
            margin-right: 20upx;
          }
          .total_price_message {
            font-size: 30upx;
            font-weight: bold;
            color: #333;
            text {
              font-size: 28upx;
            }
          }
        }
      }

      @keyframes openMain {
        from {
          margin-top: -100%;
        }
        to {
          margin-top: 0;
        }
      }

      @keyframes closeMain {
        from {
          margin-top: 0;
        }
        to {
          margin-top: -100%;
        }
      }

      .price_info_main {
        max-height: 60vh;
        overflow-y: auto;
        box-sizing: border-box;

        .price_info_list {
          background: #f9f9f9;
          padding: 0 16upx 0 24upx;
          margin: 0 24upx 20upx;
          min-height: 96rpx;
          overflow: hidden;
          &:last-child {
            margin-bottom: var(--status-bar-height);
          }
          &.active {
            .list_title {
              .title_price {
                .peice_style {
                  .price_arrow {
                    transform: rotate(180deg);
                  }
                }
              }
            }
            .list_main {
              animation: openMain .4s forwards;
              padding: 40upx 0 46upx;
              border-top: 2upx solid #eaeaea;
            }
          }
          .list_title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 96upx;
            position: relative;
            z-index: 5;
            background: #f9f9f9;

            .title_name {
              font-size: 28upx;
              font-weight: bold;
              color: #333333;
            }

            .title_price {
              display: flex;
              align-items: center;
              .title_text {
                font-size: 28upx;
                font-weight: 400;
                color: #666666;
                margin-right: 16upx;
              }
              .peice_style {
                display: inline-flex;
                align-items: center;
                text {
                  font-size: 28upx;
                  font-weight: bold;
                  color: #ff0000;
                }
                .price_arrow {
                  transition: all 0.3s;
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  width: 22upx;
                  height: 12upx;
                  margin-left: 16upx;
                  image {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                  }
                }
              }
            }
          }
          .list_main {
            overflow: hidden;
            margin-top: -100%;
            animation: closeMain .4s forwards;
            border-top: 2upx solid transparent;
            .list_item {
              display: flex;
              align-items: center;
              justify-content: space-between;
              &:not(:last-child) {
                margin-bottom: 30upx;
              }
              .item_title {
                font-size: 28upx;
                font-weight: 400;
                color: #333333;
              }
              .item_message {
                font-size: 28upx;
                font-weight: 500;
                color: #333333;
              }
            }
          }
        }
      }
    }
    }
  }
}
</style>
