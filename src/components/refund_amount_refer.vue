<!--
 * @Description: 退票页面-退票金额参考弹窗
 * @Author: mazhengrong
 * @Date: 2020-09-22 11:10:03
 * @LastEditTime: 2020-11-11 15:44:50
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
          <div class="price_info_box">
            
            <view class="info_box">
              <view class="info_content">
                <view class="info_top">
                  <view class="list_title">订单总价</view>
                  <view class="list_message">
                    <text>&yen;</text>{{ refundInfo.total_price }}
                  </view>
                </view>

                <view class="info_list">
                  <view class="list_title">销售价</view>
                  <view class="list_message">
                    <text>&yen; {{ refundInfo.ticket_price }}</text>
                    <text>×{{ refundInfo.ticket_passenger.length }}人</text>
                  </view>
                </view>

                <view class="info_list">
                  <view class="list_title">机建+燃油</view>
                  <view class="list_message">
                    <text>&yen; {{ refundInfo.fuel_total + refundInfo.build_total }}</text>
                    <text>×{{ refundInfo.ticket_passenger.length }}人</text>
                  </view>
                </view>

                <view class="info_list">
                  <view class="list_title">保险</view>
                  <view class="list_message">
                    <text
                      >&yen;{{ refundInfo.insurance_total ? refundInfo.insurance_total : 0 }}
                    </text>
                    <text
                      >×{{
                        (refundInfo.insurance_total).length > 0
                        ? (refundInfo.insurance_total).length :0
                      }}份</text
                    >
                  </view>
                </view>
              </view>
            </view>

            <view class="info_bottom">
              <view class="list_title">退票费率</view>
              <view class="list_message">
                <text>{{ refundInfo.reward }}%</text>
              </view>
            </view>

            <view class="info_bottom">
              <view class="list_title">参考退票费</view>
              <view class="list_message">
                <text>&yen; {{ refundInfo.reward }}</text>
              </view>
            </view>

            <view class="info_bottom">
              <view class="list_title">参考退票金额</view>
              <view class="list_message">
                <text>&yen; {{ refundInfo.reward }}</text>
              </view>
            </view>
          
          </div>
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

      insureNumber:{}
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
    .price_info_box {
      
      background-color: #fff;
      padding-bottom: var(--status-bar-height);
      .info_box {
        display: flex;
        flex-direction: column;
        padding: 20upx;
        background: #fff;

        .info_content {
          background: #f9f9f9;
          padding: 40upx 20upx;

          .info_list {
            display: flex;
            align-items: center;
            justify-content: space-between;
            &:not(:last-child) {
              margin-bottom: 40upx;
            }
            .list_title {
              font-size: 28upx;
              font-weight: 400;
              color: #333333;
            }
            .list_message {
              font-size: 28upx;
              font-weight: 500;
              text {
                display: inline-flex;
                &:first-child {
                  color: rgba(255, 0, 0, 1);
                }
                &:last-child {
                  margin-left: 20upx;
                  color: rgba(153, 153, 153, 1);
                }
              }
            }
          }

          .info_top {
            display: flex;
            align-items: center;
            padding-bottom: 24upx;
            margin-bottom: 28upx;
            .list_title {
              font-size: 28upx;
              font-weight: bold;
              color: #333333;
              margin-right: 24upx;
            }
            .list_message {
              font-size: 36upx;
              font-weight: bold;
              display: inline-flex;
              align-items: baseline;
              color: #ff0000;
              text {
                margin-right: 8upx;
                font-size: 28upx;
              }
            }
            &:first-child {
              border-bottom: 1px solid #eaeaea;
            }
          }
        }
      }
      .info_bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 92upx;
        padding: 0 40upx;
        .list_title {
          font-size: 28upx;
          font-weight: bold;
          color: #333333;
        }
        .list_message {
          font-size: 28upx;
          font-weight: 500;
          text {
            display: inline-flex;
            &:first-child {
              color: rgba(255, 0, 0, 1);
            }
          }
        }
      }
    }
  }
}
</style>
