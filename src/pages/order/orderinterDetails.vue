<!--
 * @Description: 订单详情页面
 * @Author: wish.WuJunLong
 * @Date: 2020-08-05 14:29:00
 * @LastEditTime: 2020-09-07 18:27:03
 * @LastEditors: mazhengrong
-->
<template>
  <view class="order_details">
    <yun-header
      :statusHeight="iStatusBarHeight"
      centerTitle="订单详情"
    ></yun-header>

    <!-- 国内详情 -->
    <view class="details_header">
      <view class="header_top">
        <view class="order_type">
          {{
            orderDetails.status !== 0 &&
            orderDetails.status !== 5 &&
            orderDetails.pay_status === 1
              ? "已预订"
              : orderDetails.status === 1
              ? "待出票"
              : orderDetails.status === 3
              ? "已出票"
              : orderDetails.status === 5
              ? "已取消"
              : ""
          }}
        </view>

        <view class="order_price">
          <text class="price_text">总价&yen;</text>
          <text>{{ orderDetails.ticket_price || "金额数据错误" }}</text>
        </view>
      </view>
      <!-- 剩余时间  已预订 -->
      <view
        class="remaining_time"
        v-if="
          orderDetails.status !== 0 &&
            orderDetails.status !== 5 &&
            orderDetails.pay_status === 1
        "
      >
        <image
          class="time_icon"
          src="@/static/order_remaining_time.png"
          mode="aspectFit"
        />
        <text class="time_text"
          >剩余支付时间：{{
            $timeDiff(
              new Date(orderDetails.created_at).getTime() + 30 * 60 * 1000,
              new Date(),
              "minutes"
            )
          }}分钟</text
        >
      </view>

      <view class="order_option">
        <view class="option_btn" v-if="orderDetails.status === 1"
          >发送短信</view
        >
        <view
          class="option_btn"
          v-if="
            orderDetails.status !== 0 &&
              orderDetails.status !== 5 &&
              orderDetails.pay_status === 1
          "
          @click="getCancel(item)"
          >取消订单</view
        >
        <view
          class="option_btn important_btn"
          v-if="
            orderDetails.status !== 0 &&
              orderDetails.status !== 5 &&
              orderDetails.pay_status === 1
          "
          >去支付</view
        >
        <view class="option_btn" v-if="orderDetails.status === 3"
          >报销凭证</view
        >
        <view class="option_btn" v-if="orderDetails.status === 3"
          >发送短信</view
        >
        <view
          class="option_btn"
          v-if="orderDetails.status === 3"
          @click="getRefund(item)"
          >退票</view
        >
        <view class="option_btn" v-if="orderDetails.status === 3">改签</view>
        <!-- <view class="option_btn" v-if="orderDetails.status === 5">查看退废单</view> -->
        <view class="option_btn" v-if="orderDetails.status === 5"
          >再次预定</view
        >
      </view>
    </view>

    <view class="details_main">
      <scroll-view :enable-back-to-top="true" :scroll-y="true" class="content">
        <view
          class="main_list filght_info"
          v-for="(item, index) in orderDetails.ticket_segments"
          :key="index"
        >
          <view class="info_header">
            <view class="header_type">{{
              orderDetails.segment_type === 1
                ? "单程"
                : orderDetails.segment_type === 2
                ? "往返"
                : orderDetails.segment_type === 3
                ? "多程"
                : ""
            }}</view>
            <view class="header_time">
              {{ item.departure_time.substring(0, 10) }}
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
                }}{{ item.departure_CN.air_port_name }}</view
              >
            </view>

            <view class="message_center">
              <view class="date"
                >{{ Math.floor(item.duration / 3600) }}h{{
                  Math.floor((item.duration / 60) % 60)
                }}m</view
              >
              <view class="center_icon"></view>
              <view class="type">直飞</view>
            </view>

            <view class="message_box">
              <view class="date">{{ item.arrive_time.substring(11, 16) }}</view>
              <view class="address"
                >{{ item.arrive_CN.city_name
                }}{{ item.arrive_CN.air_port_name }}</view
              >
            </view>
          </view>

          <view class="filght_message">
            <!-- 航班图标 -->
            <view class="message_icon">
              <image
                class="message_icon"
                :src="'https://fxxcx.ystrip.cn/' + item.image"
                mode="contain"
              />
            </view>
            <view class="message_list">{{ item.flight_no }}</view>
            <view class="message_list">{{ item.model }}</view>
            <view class="message_list">有早餐</view>
          </view>

          <view class="filght_bottom">
            <view class="bottom_list"
              >{{ item.cabin
              }}{{
                item.cabin_level === "ECONOMY"
                  ? "经济舱"
                  : item.cabin_level === "FIRST"
                  ? "头等舱"
                  : item.cabin_level === "BUSINESS"
                  ? "公务舱"
                  : ""
              }}</view
            >
            <view class="bottom_list">退改签规则</view>
            <view class="bottom_list">每人托运2件，每件23KG</view>
          </view>
        </view>

        <view class="main_list passenger">
          <view class="main_list_title">出行信息</view>
          <view class="passenger_list">
            <view
              class="list_item"
              v-for="(item, index) in orderDetails.ticket_passenger"
              :key="index"
            >
              <view class="list_info">
                <view class="info_type"
                  >{{
                    item.PassengerType === "ADT"
                      ? "成人"
                      : item.PassengerType === "CNN"
                      ? "儿童"
                      : item.PassengerType === "INF"
                      ? "婴儿"
                      : ""
                  }}票</view
                >
                <view class="info_name">{{ item.PassengerName }}</view>
                <view class="is_insurance" v-if="item.insure_count > 0"></view>
                <view class="group_type">员工</view>
              </view>

              <view class="list_message">
                <view class="message_title">{{
                  item.Credential === "0"
                    ? "身份证"
                    : item.Credential === "1"
                    ? "护照"
                    : item.Credential === "2"
                    ? "港澳通行证"
                    : item.Credential === "3"
                    ? "其它证件"
                    : item.Credential === "4"
                    ? "台胞证"
                    : item.Credential === "5"
                    ? "台湾通行证"
                    : item.Credential === "8"
                    ? "其他证件"
                    : ""
                }}</view>
                <view class="message_number">{{ item.CredentialNo }}</view>
                <!-- 身份证号码 -->
              </view>
            </view>
          </view>

          <view
            class="contact"
            v-for="(item, index) in orderDetails.ticket_passenger"
            :key="index"
          >
            <view class="contact_list">
              <view class="list_title">联系人</view>
              <view class="list_message">{{ item.PassengerName }}</view>
            </view>
            <view class="contact_list">
              <view class="list_title">联系电话</view>
              <view class="list_message">{{ item.phone }}</view>
            </view>
            <view class="contact_list">
              <view class="list_title">已购保险</view>
              <view class="list_message"
                >{{ orderDetails.insurance_total }}元</view
              >
            </view>
          </view>
        </view>
        <view class="main_list order_message">
          <view class="main_list_title">订单信息</view>
          <view class="message_list">
            <view class="list_item">
              <view class="item_title">订单编号</view>
              <view class="item_message">{{ orderDetails.order_no }}</view>
            </view>
            <view class="list_item">
              <view class="item_title">PNR</view>
              <view class="item_message">{{ orderDetails.pnr_code }}</view>
            </view>
            <view class="list_item">
              <view class="item_title">订票员</view>
              <view class="item_message">{{ orderDetails.book_user }}</view>
            </view>
            <view class="list_item">
              <view class="item_title">预定时间</view>
              <view class="item_message">{{ orderDetails.created_at }}</view>
              <!-- 时间 -->
            </view>
            <view class="list_item">
              <view class="item_title">备注</view>
              <view class="item_message input-right-arrow">{{
                orderDetails.remark
              }}</view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    <!-- 取消订单弹窗 -->
    <yun-config
      ref="yunConfig"
      @submitConfig="getSubmit"
      title="温馨提示"
      content="您是否要取消此订单"
      submitIndex="right"
    ></yun-config>
  </view>
</template>

<script>
import orderApi from "@/api/order.js";
import moment from "../../moment";
moment.locale("zh-cn");
export default {
  data() {
    return {
      iStatusBarHeight: 0,
      orderDetails: [], // 订单详情
      flightData: {}, // 航班信息
      orderListType: "", // 订单列表页 类型

      orderId: "", // 订单号
    };
  },
  methods: {
    // 已预订 取消订单弹窗
    getCancel() {
      this.$refs.yunConfig.openConfigPopup();
    },

    //取消订单弹窗 确认取消
    getSubmit(type) {
      console.log(type);
      let data = {
        order_no: this.orderId,
      };
      console.log(data);
      orderApi.cancleInterRefund(data).then((res) => {
        if (res.result === 10000) {
          this.getOrderDetails();
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      });
    },

    // 获取订单详情
    getOrderDetails() {
      console.log("国内订单详情",  this.orderListType);
      let data = {
        order_no: this.orderId,
      };

      orderApi.orderDetails(data).then((res) => {
        if (res.result === 10000) {
          this.orderDetails = res.data.order_msg;
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
      let listData = JSON.parse(data.listData);
      this.orderId = listData.order_no;
      console.log(data);
      this.orderListType = data.type;
      this.orderHeaderTitle =
        this.orderListType === "0"
          ? "国内订单"
          : this.orderListType === "1"
          ? "国内退票订单"
          : this.orderListType === "2"
          ? "国内改签订单"
          : this.orderListType === "3"
          ? "国际订单"
          : this.orderListType === "4"
          ? "国际退票订单"
          : this.orderListType === "5"
          ? "国际改签订单"
          : "";
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
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
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
                  background: url(@/static/insurance_icon.png) no-repeat center
                    center;
                  background-size: contain;
                  width: 25upx;
                  height: 30upx;
                }
                .group_type {
                  margin-left: 28upx;
                  font-size: 22upx;
                  font-weight: 400;
                  color: rgba(153, 153, 153, 1);
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
                width: 100upx;
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
    }
  }
}
</style>
