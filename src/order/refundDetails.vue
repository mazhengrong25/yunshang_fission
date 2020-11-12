<!--
 * @Description: 退票单详情
 * @Author: mazhengrong
 * @Date: 2020-09-18 10:14:28
 * @LastEditTime: 2020-11-12 15:31:44
 * @LastEditors: Please set LastEditors
-->

<template>
  <view class="order_details">
    <yun-header :statusHeight="iStatusBarHeight" centerTitle="退票单详情"></yun-header>

    <view class="details_header">
      <view class="header_top">
        <view class="order_type">
          {{
           flightData.order_status === 1
            ? "申请中"
            : flightData.order_status === 2
            ? "成功"
            : flightData.order_status === 3
            ? "已取消"
            : ""
          }}
        </view>

        <view class="order_price">
          <view class="price_text" v-if="flightData.order_status === 2">退票金额&yen;{{Number(flightData.ticket_refund_passenger[0].refund_money).toFixed(0)}}</view>
          <view class="price_text" v-if="flightData.order_status === 1 || flightData.order_status === 3">退票金额参考</view>
        </view>
      </view>
      <!-- 状态提示 -->
      <view class="remaining_time">
        <text class="time_text">{{
             flightData.order_status === 1
            ? "您的申请已提交，等待后台审核"
            : flightData.order_status === 2
            ? "您的订单已成功退款"
            : flightData.order_status === 3
            ? "您的申请已取消"
            : ""
        }}</text>
      </view>
    </view>

    <view class="details_main">
      <scroll-view :enable-back-to-top="true" :scroll-y="true" class="content">
        <!-- 航班信息  -->
        <view class="main_list filght_info" 
        v-for="(item, index) in flightData.ticket_segments" 
        :key="index">
          <view class="info_header">
            <view class="header_type">{{
              refundDetail.segment_type === 1
                ? "单程"
                : refundDetail.segment_type === 2
                ? "往返"
                : refundDetail.segment_type === 3
                ? "多程"
                : ""
            }}</view>
            <view class="header_time">
              <text>{{ $dateTool(item.departure_time,"YYYY-MM-DD") }}</text>
              <text>{{ $dateTool(item.departure_time, "ddd") }}</text>
            </view>
          </view>
          <view class="info_message">
            <view class="message_box">
              <view class="date">{{
                item.departure_time.substring(11, 16)
              }}</view>
              <view class="address"
                >{{ item.departure_CN.city_name
                }}{{ item.departure_CN.air_port_name }}{{item.departure_terminal}}机场</view>
            </view>

            <view class="message_center">
              <view class="date"
                >{{ Math.floor(item.duration / 3600) }}h{{
                  Math.floor((item.duration / 60) % 60)
                }}m</view
              >
              <view class="center_icon"></view>
            </view>

            <view class="message_box">
              <view class="date">{{ item.arrive_time.substring(11, 16) }}</view>
              <view class="address"
                >{{ item.arrive_CN.city_name
                }}{{ item.arrive_CN.air_port_name }}{{item.arrive_terminal}}机场</view>
            </view>
          </view>

          <view class="filght_message">
            <!-- 航班图标 -->
            <view class="message_icon">
              <image
                class="message_icon"
                :src="'https://fxxcx.ystrip.cn/' + refundDetail.image"
                mode="aspectFill"
              />
            </view>
            <view class="message_list">{{ item.flight_no }}</view>
            <view class="message_list">{{ item.model }}</view>
          </view>
        </view>
        <!-- 出行信息 -->
        <view class="main_list passenger">
          <view class="main_list_title">出行信息</view>
          <view class="passenger_list">
            <view
              class="list_item"
              v-for="(oitem, oindex) in flightData.ticket_refund_passenger"
              :key="oindex"
            >
              <view class="list_info">
                <view class="info_type"
                  >{{
                    oitem.ticket_passenger.PassengerType === "ADT"
                      ? "成人"
                      : oitem.ticket_passenger.PassengerType === "CNN"
                      ? "儿童"
                      : oitem.ticket_passenger.PassengerType === "INF"
                      ? "婴儿"
                      : ""
                  }}票</view
                >
                <view class="info_name">{{ oitem.ticket_passenger.PassengerName }}</view>
                <view class="is_insurance" v-if="oitem.insure_count !== 0">
                    <image src="@/static/insurance_icon.png" mode="contain" />
                </view>
                <view class="group_type">票号</view>
                <view class="group_number">{{ oitem.ticket_no }}</view>
              </view>
            </view>
          </view>

          <view class="contact">
            <view class="contact_list">
              <view class="list_title">联系人</view>
              <view class="list_message">{{ refundDetail.contact }}</view>
            </view>
            <view class="contact_list">
              <view class="list_title">联系电话</view>
              <view class="list_message">{{ refundDetail.phone }}</view>
            </view>
          </view>
        </view>
        <!-- 退票信息 -->
        <view class="main_list order_message">
          <view class="main_list_title">退票信息</view>
          <view class="message_list">
            <view class="list_item">
              <view class="item_title">退票单号</view>
              <view class="item_message">{{ refundDetail.refund_no }}</view>
            </view>
            <view class="list_item">
              <view class="item_title">PNR</view>
              <view class="item_message">{{ refundDetail.pnr_code }}</view>
            </view>
            <view class="list_item">
              <view class="item_title">分销商</view>
              <view class="item_message">{{ refundDetail.admin_name }}</view>
            </view>
            <view class="list_item">
              <view class="item_title">申请时间</view>
              <view class="item_message">{{ refundDetail.created_at }}</view>
            </view>
            <view class="list_item">
              <view class="item_title">退废票备注</view>
              <view class="item_message input-right-arrow">{{ refundDetail.remark }}</view>
            </view>
          </view>
        </view>

      </scroll-view>
    </view>
  </view>
</template>

<script>
import orderApi from "@/api/order.js";
import moment from "moment";
import flightExplanation from "@/components/flight_explanation.vue"; // 航班退改信息
moment.locale("zh-cn");
export default {

  components: {
    flightExplanation,
    
  },

  data() {
    return {
      iStatusBarHeight: 0,

      flightData: {}, // 航班信息 从列表传过来的数据

      orderId: "", // 订单号

      refundDetail: {}, // 退票单详情

    };
  },
  methods: {

     // 获取订单详情
    getOrderDetails() {
     
      let data = {
        refund_no: this.orderId,
      };

      orderApi.orderInterRefund(data).then((res) => {
        if (res.result === 10000) {
          this.refundDetail = res.data;
          console.log('this.refundDetail',this.refundDetail)
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      });
    },

    

    onLoad(data) {
      this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
      this.flightData = JSON.parse(data.refundData);
      this.orderId = this.flightData.refund_no;
      console.log('退票详情',this.flightData);
      this.getOrderDetails();
    },
  },
};
</script>

<style lang="less" scoped>
.order_details {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: rgba(243, 245, 247, 1);
  .details_header {
    background: rgba(0, 112, 226, 1);
    padding: 40upx 20upx 30upx;
    .header_top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 22upx;
      .order_type {
        font-size: 40upx;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
      }
      .order_price {
        display: inline-flex;
        align-items: center;
        font-size: 40upx;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        &::after {
          content: "";
          background: url(@/static/arrow_white.png) no-repeat center center;
          background-size: contain;
          width: 12upx;
          height: 21upx;
          display: block;
          margin-left: 14upx;
          flex:1;
        }
        .price_text {
          font-size: 24upx;
          font-weight: 400;
          margin-right: 6upx;
          margin-top: 10upx;
        }
      }
    }
    .remaining_time {
      display: flex;
      align-items: center;
      margin-bottom: 32upx;
      .time_icon {
        width: 24upx;
        height: 24upx;
        object-fit: contain;
        margin-right: 10upx;
      }
      .time_text {
        font-size: 24upx;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        opacity: 0.8;
      }
    }
    .order_option {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .option_btn {
        width: 150upx;
        height: 56upx;
        border: 2upx solid rgba(255, 255, 255, 0.3);
        border-radius: 50upx;
        font-size: 24upx;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 32upx;
        &.important_btn {
          border-color: #fff;
          background: #fff;
          color: rgba(0, 112, 226, 1);
        }
      }
    }
  }
  .details_main {
    position: relative;
    flex: 1;
    display: flex;
    &::after {
      content: "";
      display: block;
      background: #0070e2;
      width: 100%;
      height: 90upx;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
    }
    .content {
      flex: 1;
      height: 100%;
      overflow-y: auto;
      position: relative;
      z-index: 1;
      .main_list {
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 12upx 18upx rgba(0, 0, 0, 0.04);
        border-radius: 20upx;
        margin: 0 20upx 20upx;
        padding: 24upx 20upx 20upx;
        .main_list_title {
          font-size: 32upx;
          font-weight: bold;
          color: rgba(42, 42, 42, 1);
        }
        &.filght_info {
          .info_header {
            display: flex;
            align-items: center;
            margin-bottom: 20upx;
            .header_type {
              width: 80upx;
              height: 30upx;
              background: linear-gradient(
                270deg,
                rgba(0, 112, 226, 1) 0%,
                rgba(86, 197, 255, 1) 100%
              );
              border-radius: 10upx;
              font-size: 20upx;
              font-weight: 400;
              color: rgba(255, 255, 255, 1);
              display: inline-flex;
              align-items: center;
              justify-content: center;
              margin-right: 12upx;
            }
            .header_time {
              font-size: 24upx;
              font-weight: 400;
              color: rgba(42, 42, 42, 1);
              text {
                margin-left: 12upx;
              }
            }
          }
          .info_message {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 26upx;
            .message_box {
              .date {
                font-size: 36upx;
                font-weight: bold;
                color: rgba(42, 42, 42, 1);
                margin-bottom: 4upx;
              }
              .address {
                font-size: 24upx;
                font-weight: 400;
                color: rgba(42, 42, 42, 1);
              }
            }
            .message_center {
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: column;
              .date {
                font-size: 22upx;
                font-weight: 400;
                color: rgba(175, 185, 196, 1);
              }
              .center_icon {
                width: 112upx;
                height: 20upx;
                background: url(@/static/ticket_path.png) no-repeat center
                  center;
                background-size: contain;
                display: block;
              }
              .type {
                font-size: 22upx;
                font-weight: 400;
                color: rgba(175, 185, 196, 1);
              }
            }
          }
          .filght_message {
            display: flex;
            align-items: center;
            justify-content: center;
            .message_icon {
              width: 24upx;
              height: 24upx;
              object-fit: contain;
              margin-right: 6upx;
              display: flex;
            }
            .message_list {
              font-size: 22upx;
              font-weight: 400;
              color: rgba(175, 185, 196, 1);
              display: inline-flex;
              align-items: center;
              &:not(:last-child) {
                &::after {
                  content: "";
                  display: block;
                  width: 2upx;
                  height: 20upx;
                  background: rgba(217, 225, 234, 1);
                  margin: 0 8upx;
                }
              }
            }
          }
          .filght_bottom {
            display: flex;
            align-items: center;
            border-top: 2upx dashed rgba(217, 225, 234, 1);
            margin-top: 20upx;
            padding-top: 20upx;
            justify-content: center;
            .bottom_list {
              font-size: 24upx;
              font-weight: 400;
              color: rgba(175, 185, 196, 1);
              display: inline-flex;
              align-items: center;
              &:not(:last-child) {
                &::after {
                  content: "";
                  display: block;
                  width: 2upx;
                  height: 20upx;
                  background: rgba(217, 225, 234, 1);
                  margin: 0 8upx;
                }
              }
            }
          }
        }
        &.passenger {
          .passenger_list {
            margin-top: 46upx;
            .list_item {
              &:not(:last-child) {
                margin-bottom: 60upx;
              }
              &:last-child {
                padding-bottom: 32upx;
                border-bottom: 2upx solid rgba(241, 243, 245, 1);
                margin-bottom: 30upx;
              }
              .list_info {
                display: flex;
                align-items: center;
                margin-bottom: 34upx;
                .info_type {
                  width: 100upx;
                  height: 30upx;
                  border: 2upx solid rgba(127, 183, 240, 1);
                  border-radius: 20upx;
                  margin-right: 12upx;
                  font-size: 20upx;
                  font-weight: 400;
                  color: rgba(127, 183, 240, 1);
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                }
                .info_name {
                  font-size: 28upx;
                  font-weight: bold;
                  color: rgba(42, 42, 42, 1);
                  margin-right: 8upx;
                }
                .is_insurance {
                  
                    width: 30upx;
                    height: 30upx;
                    margin-right: 8upx;
                    display: flex;
                    image {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                    }
                }
                .group_type {
                    margin-left: 28upx;
                    font-size: 28upx;
                    font-weight: 400;
                    color: #333333;
                    margin-right: 10px;
                }
                .group_number {
                    font-weight: bold;
                    font-size: 14px;
                    color: #2a2a2a;
                }
              }
              .list_message {
                display: flex;
                align-items: center;
                .message_title {
                  font-size: 28upx;
                  font-weight: 400;
                  color: rgba(42, 42, 42, 1);
                  margin-right: 32upx;
                }
                .message_number {
                  font-size: 28upx;
                  font-weight: bold;
                  color: rgba(42, 42, 42, 1);
                }
              }
            }
          }
          .contact {
            .contact_list {
              display: flex;
              align-items: center;
              &:not(:last-child) {
                margin-bottom: 36upx;
              }
              .list_title {
                font-size: 28upx;
                font-weight: 400;
                color: rgba(102, 102, 102, 1);
                width: 132upx;
              }
              .list_message {
                font-size: 28upx;
                font-weight: bold;
                color: rgba(42, 42, 42, 1);
              }
            }
          }
        }
        &.certificate {
          .certificate_message {
            margin-top: 32upx;
            border-top: 2upx solid #f1f3f5;
            padding-top: 34upx;
            display: flex;
            align-items: center;
            .message_title {
              font-size: 28upx;
              font-weight: 400;
              color: rgba(153, 153, 153, 1);
              margin-right: 40upx;
            }
            .message_text {
              font-size: 28upx;
              font-weight: 400;
              color: rgba(51, 51, 51, 1);
            }
          }
        }
        &.order_message {
          .message_list {
            margin-top: 40upx;
            .list_item {
              display: flex;
              align-items: center;
              &:not(:last-child) {
                margin-bottom: 30upx;
              }
              .item_title {
                font-size: 24upx;
                font-weight: 400;
                color: rgba(153, 153, 153, 1);
                // width: 100upx;
              }
              .item_message {
                flex: 1;
                text-align: right;
                font-size: 24upx;
                font-weight: 400;
                color: rgba(42, 42, 42, 1);
              }
            }
          }
        }
      }

      .not_flight_data {
        border-radius: 20rpx;
        background: #ffffff;
        box-shadow: 0 12rpx 18rpx rgba(0, 0, 0, 0.04);
        padding: 30rpx 20rpx 22rpx;
        margin: 0 20rpx 20rpx;
        height: 144upx;
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: hidden;
        &::before {
          content: "";
          display: block;
          width: 44upx;
          height: 200%;
          position: absolute;
          top: -30%;
          transform: rotate(30deg);
          background: #fff;
          left: -30%;
          animation: skeleton 3s infinite;
          -webkit-animation: skeleton 3s infinite;
        }
        @keyframes skeleton {
          from {
            left: -30%;
          }
          to {
            left: 120%;
          }
        }
        text {
          display: block;
          width: 80%;
          height: 28upx;
          background: #e5e9f2;
          margin-bottom: 10upx;
        }
        view {
          width: 80%;
          height: 40upx;
          margin: auto auto 0;
          background: #e5e9f2;
        }
      }
    }
  }
}
</style>