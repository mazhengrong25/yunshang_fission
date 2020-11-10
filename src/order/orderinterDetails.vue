<!--
 * @Description: 订单详情页面
 * @Author: wish.WuJunLong
 * @Date: 2020-08-05 14:29:00
 * @LastEditTime: 2020-11-06 16:58:56
 * @LastEditors: Please set LastEditors
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
            $timeBefore(
              new Date(orderDetails.created_at).getTime() + 30 * 60 * 1000
            ) &&
            orderDetails.pay_status === 1
              ? "已预订"
              : orderDetails.status === 1 && orderDetails.pay_status === 2
              ? "待出票"
              : orderDetails.status === 3
              ? "已出票"
              : orderDetails.status === 5
              ? "已取消"
              : orderDetails.status === 1 &&
                !$timeBefore(
                  new Date(orderDetails.created_at).getTime() + 30 * 60 * 1000
                )
              ? "已取消"
              : ""
          }}
        </view>

        <view
          class="order_price"
          v-if="JSON.stringify(orderDetails) !== '{}'"
          @click="openTotalOrder()"
        >
          <text class="price_text">总价&yen;</text>
          <text>{{ orderDetails.total_price || "" }}</text>
        </view>

        <view class="price_other" v-else> 数据获取中 </view>
      </view>
      <!-- 剩余时间  已预订 -->
      <view
        class="remaining_time"
        v-if="
          orderDetails.status !== 0 &&
          orderDetails.status !== 5 &&
          orderDetails.pay_status === 1 &&
          $timeBefore(
            new Date(orderDetails.updated_at).getTime() + 30 * 60 * 1000
          )
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
              new Date(orderDetails.updated_at).getTime() + 30 * 60 * 1000,
              new Date(),
              "minutes"
            )
          }}分钟</text
        >
      </view>

      <view class="order_option">
        <view
          class="option_btn"
          v-if="orderDetails.status === 1 && orderDetails.pay_status === 2"
          @click="sendMessage"
          >发送短信</view
        >
        <view
          class="option_btn"
          v-if="
            orderDetails.status !== 0 &&
            orderDetails.status !== 5 &&
            orderDetails.pay_status === 1 &&
            $timeBefore(
              new Date(orderDetails.created_at).getTime() + 30 * 60 * 1000
            )
          "
          @click="getCancel(item)"
          >取消订单</view
        >
        <view
          class="option_btn important_btn"
          v-if="
            orderDetails.status !== 0 &&
            orderDetails.status !== 5 &&
            orderDetails.pay_status === 1 &&
            $timeBefore(
              new Date(orderDetails.created_at).getTime() + 30 * 60 * 1000
            )
          "
          @click="jumpOrderPay()"
          >去支付</view
        >
        <view
          @click="notMessage"
          class="option_btn"
          v-if="orderDetails.status === 3"
          >报销凭证</view
        >
        <view
          @click="sendMessage"
          class="option_btn"
          v-if="orderDetails.status === 3"
          >发送短信</view
        >
        <view
          class="option_btn"
          v-if="orderDetails.status === 3"
          @click="getRefund()"
          >退票</view
        >
        <view
          class="option_btn"
          @click="notMessage"
          v-if="orderDetails.status === 3"
          >改签</view
        >
        <view
          class="option_btn"
          v-if="
            orderDetails.status === 5 ||
            (orderDetails.pay_status === 1 &&
              orderDetails.status === 1 &&
              !$timeBefore(
                new Date(orderDetails.created_at).getTime() + 30 * 60 * 1000
              ))
          "
          @click="reOrder()"
          >再次预定</view
        >
      </view>
    </view>

    <scroll-view
      :enable-back-to-top="true"
      :scroll-y="true"
      class="details_main"
    >
      <view class="content">
        <flight-header
          v-if="JSON.stringify(orderDetails) !== '{}'"
          :flightData="flightData"
          :roundTripFlightData="roundTripFlightData"
          :roundTripType="roundTripType"
          :interType="false"
          @openHeadExpPopup="openHeadExpPopup"
        ></flight-header>

        <view v-else class="not_flight_data">
          <text></text>
          <text></text>
          <view></view>
        </view>

        <!-- 出行信息 -->
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
                <view class="info_name">{{ item.PassengerName || "" }}</view>
                <view
                  class="is_insurance"
                  v-if="Number(item.insurance_total) > 0"
                >
                  <image src="@/static/insurance_icon.png" mode="contain" />
                </view>
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

          <view class="contact">
            <view class="contact_list">
              <view class="list_title">已购保险</view>
              <view class="list_message">{{
                orderDetails.insurance_total
                  ? orderDetails.insurance_total + "元"
                  : ""
              }}</view>
            </view>
            <view class="contact_list">
              <view class="list_title">联系人</view>
              <view class="list_message">{{ orderDetails.contact }}</view>
            </view>
            <view class="contact_list">
              <view class="list_title">联系电话</view>
              <view class="list_message">{{ orderDetails.phone }}</view>
            </view>
          </view>
        </view>
        <!-- 订单信息 -->
        <view class="main_list order_message">
          <view class="main_list_title">订单信息</view>
          <view class="message_list">
            <view class="list_item" v-if="orderDetails.status === 3" v-for="(item, index) in orderDetails.ticket_passenger" :key="index">
              <view class="item_title">票号</view>
              <view class="item_message">{{ item.ticket_no }}</view>
            </view>
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
            </view>
            <view class="list_item">
              <view class="item_title">备注</view>
              <view class="item_message input-right-arrow">{{
                orderDetails.remark
              }}</view>
            </view>
          </view>
        </view>

        <!-- 退改信息弹窗 -->
        <flight-explanation
          ref="flightExplanation"
          :ruleInfos="ruleInfos"
        ></flight-explanation>
      </view>
    </scroll-view>

    <!-- 取消订单弹窗 -->
    <yun-config
      ref="yunConfig"
      @submitConfig="getSubmit"
      title="温馨提示"
      content="您是否要取消此订单"
      submitIndex="right"
    ></yun-config>

    <!-- 订单总价弹窗 -->
    <uni-popup ref="totalOrder" type="bottom">
      <view class="price_info">
        <view class="title">
          订单总价
          <view class="close_btn" @click="closeTotalOrder()"></view>
        </view>
        <div class="price_info_box">
          <view class="info_box">
            <view class="info_content">
              <view class="info_top">
                <view class="list_title">订单总价</view>
                <view class="list_message">
                  <text>&yen;</text>{{ priceInfo.totalPrice }}
                </view>
              </view>

              <view class="info_list">
                <view class="list_title">票价</view>
                <view class="list_message">
                  <text>&yen; {{ priceInfo.adtPrice }}</text>
                  <text>×{{ passengerNumber.adt }}人</text>
                </view>
              </view>

              <view class="info_list">
                <view class="list_title">机建+燃油</view>
                <view class="list_message">
                  <text>&yen; {{ priceInfo.buildPrice }}</text>
                  <text>×{{ passengerNumber.adt }}人</text>
                </view>
              </view>

              <view class="info_list">
                <view class="list_title">保险</view>
                <view class="list_message">
                  <text
                    >&yen;{{ priceInfo.insPrice ? priceInfo.insPrice : 0 }}
                  </text>
                  <text
                    >×{{
                      passengerNumber.ins ? passengerNumber.ins : 0
                    }}份</text
                  >
                </view>
              </view>
            </view>
          </view>

          <view class="info_bottom">
            <view class="list_title">奖励金</view>
            <view class="list_message">
              <text>&yen; {{ priceInfo.reward }}</text>
            </view>
          </view>
        </div>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import orderApi from "@/api/order.js";
import moment from "moment";
import flightExplanation from "@/components/flight_explanation.vue"; // 航班退改信息
import flightHeader from "@/components/flight_header.vue"; // 航程信息

moment.locale("zh-cn");
export default {
  components: {
    flightExplanation,
    flightHeader,
  },
  data() {
    return {
      iStatusBarHeight: 0,
      orderDetails: {}, // 订单详情  对象判断119
      orderListType: "", // 订单列表页 类型

      orderId: "", // 订单号
      type: "", // 单程 返程

      cancelOrder: "", //取消订单

      ruleInfos: {
        // 退改签信息
        gauge: {
          refund: [],
          change: [],
        },
      },

      skeletonNumber: 1, // 骨架屏数量
      roundTripType: false, // 是否往返

      flightData: {
        // 单程航班信息
        flightType: "", // 航程类型
        time: "", // 航程日期
        week: "", // 航程星期
        fromTime: "", // 出发时间
        fromAddress: "", // 出发机场
        duration: "", // 飞行时长
        toTime: "", // 到达时间
        toAddress: "", // 到达机场
        airIcon: "", // 航司图片
        airline: "", // 航司
        model: "", // 机型
        food: "", // 餐饮
        cabin: "", // 舱位信息
        baggage: "", // 行李额
      },

      flightRoundData: {
        // 往返航班信息
        flightType: "", // 航程类型
        time: "", // 航程日期
        week: "", // 航程星期
        fromTime: "", // 出发时间
        fromAddress: "", // 出发机场
        duration: "", // 飞行时长
        toTime: "", // 到达时间
        toAddress: "", // 到达机场
        airIcon: "", // 航司图片
        airline: "", // 航司
        model: "", // 机型
        food: "", // 餐饮
        cabin: "", // 舱位信息
        baggage: "", // 行李额
      },

      cancelType: false, // 取消订单状态

      ticketOrder: {
        //再次预定
      },

      priceInfo: {
        // 金额数据
        totalPrice: 0, // 总价
        adtPrice: 0, //票价
        buildPrice: 0, // 机建燃油费
        insPrice: 0, // 保险票价
        buildPrice: 0, // 机建燃油费
        reward: 0, // 奖励金额
      },

      passengerNumber: {
        // 乘机人数量
        adt: 0, //成人
        ins: 0, //保险
      },

      passengerInfo: {},
      segmentDetails: {}, // 票号
    };
  },
  methods: {
    notMessage() {
      uni.showToast({
        title: "相关功能开发中，请等待后续版本更新",
        icon: "none",
        duration: 3000,
      });
    },

    // 发送短信
    sendMessage(data) {
      uni.navigateTo({
        url: "/order/sendMessage?orderId=" + this.orderId,
      });
    },

    // 订单总价 弹窗
    openTotalOrder() {
      this.$refs.totalOrder.open();
    },

    // 订单总价  关闭弹窗
    closeTotalOrder() {
      this.$refs.totalOrder.close();
    },

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
            title: res.data,
            icon: "none",
          });
        }
      });
    },

    // 去支付
    jumpOrderPay() {
      let orderId = [this.orderDetails.order_no];
      let priceList = [this.orderDetails.need_pay_amount];
      let priceNumber = this.orderDetails.need_pay_amount;

      uni.navigateTo({
        url:
          "/flightReservation/orderPay?orderId=" +
          JSON.stringify(orderId) +
          "&flightData=" +
          JSON.stringify(this.flightData) +
          "&priceList=" +
          JSON.stringify(priceList) +
          "&price=" +
          priceNumber +
          "&passMessage=" +
          JSON.stringify(this.orderDetails.ticket_passenger) +
          "&headerType=false" +
          "&type=false",
      });
    },

    // 组装退改信息
    getGaugeInfo() {
      console.log(this.orderDetails.ticket_segments[0].cabin_level);
      // 组装航班数据
      let filghtMessage = {
        time: moment(
          this.orderDetails.ticket_segments[0].departure_time
        ).format("YYYY-MM-DD HH:mm:ss"), // 起飞时间
        code: this.orderDetails.ticket_segments[0].flight_no, // 航班号
        address:
          this.orderDetails.ticket_segments[0].departure_CN.city_name +
          " " +
          this.orderDetails.ticket_segments[0].departure_CN.city_code +
          " - " +
          this.orderDetails.ticket_segments[0].arrive_CN.city_name +
          " " +
          this.orderDetails.ticket_segments[0].arrive_CN.city_code, // 行程
        cabin:
          this.orderDetails.ticket_segments[0].cabin +
          (this.orderDetails.ticket_segments[0].cabin_level === "ECONOMY"
            ? "经济舱"
            : this.orderDetails.ticket_segments[0].cabin_level === "FIRST"
            ? "头等舱"
            : this.orderDetails.ticket_segments[0].cabin_level === "BUSINESS"
            ? "公务舱"
            : ""), // 舱位
        price: this.orderDetails.ticket_price, // 票面价
        // baggage: data.baggage, 行李额
      };

      // 组装退改信息
      let gaugeMessage = this.orderDetails.ticket_segments[0].gaugeType
        .gauge_type_value;

      this.ruleInfos = {
        filght: filghtMessage,
        gauge: gaugeMessage,
      };
      this.ruleInfos.gauge[
        "back_msg"
      ] = this.orderDetails.ticket_segments[0].gaugeType.back_msg;
    },

    // 打开退改签说明弹窗
    openExp() {
      this.getGaugeInfo();
      this.$refs.flightExplanation.openExp();
    },

    // 关闭产品说明弹窗
    closeExp() {
      this.$refs.flightExplanation.closeExp();
    },

    // 打开航班退改信息弹窗
    openHeadExpPopup(val) {
      if (val === "arr") {
        this.$refs.flightExplanation.openArrExp();
      } else {
        this.$refs.flightExplanation.openExp();
      }
    },

    // 关闭航班退改信息弹窗
    closePopup() {
      this.$refs.flightExplanation.closeExp();
    },

    // 获取订单详情
    getOrderDetails() {
      let data = {
        order_no: this.orderId, //订单号
      };

      orderApi.orderDetails(data).then((res) => {
        if (res.result === 10000) {
          this.orderDetails = res.data.order_msg;
          this.passengerInfo = res.data.order_msg.ticket_passenger;
          this.segmentDetails =
            res.data.order_msg.ticket_passenger.ticket_segment_passenter;
          if (JSON.stringify(this.orderDetails) === "{}") {
            this.skeletonNumber = 0;
          }

          // 组装航程信息
          this.flightData = {
            flightType: this.type
              ? this.type === "0"
                ? "去程"
                : "返程"
              : "单程",
            data: this.orderDetails.ticket_segments, // 单程信息
            cabinInfo: this.orderDetails.ticket_segments, //退票规则
          };

          // 组装订单总价
          this.priceInfo = {
            totalPrice: this.orderDetails.total_price, // 订单总价
            buildPrice: this.orderDetails.build_total, // 机建票价
            insPrice: this.orderDetails.insurance_total, // 保险票价
            adtPrice: this.orderDetails.ticket_price, // 成人票价
            reward: this.orderDetails.reward_price, // 奖励金
          };

          this.passengerNumber = {
            adt: this.passengerInfo.filter((u) => u.PassengerType === "ADT")
              .length, //成人
            ins:
              this.passengerInfo.filter((u) => u.insurance_total).length > 0
                ? this.passengerInfo.filter((u) => u.insurance_total).length
                : 0, // 保险
          };

          if (this.cancelType) {
            this.cancelType = false;
            this.getCancel();
          }
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      });
    },

    // 跳转退票
    getRefund(data) {
      uni.navigateTo({
        url: "/order/refund?refundData=" + JSON.stringify(this.orderDetails),
      });
    },

    // 再次预定
    reOrder() {
      this.ticketOrder = {
        to: {
          city_code: this.orderDetails.ticket_segments[0].departure,
          city_name: this.orderDetails.ticket_segments[0].departure_CN
            .city_name,
          country_code: this.orderDetails.ticket_segments[0].departure_CN
            .country_code,
          province: this.orderDetails.ticket_segments[0].departure_CN.province,
        },
        from: {
          city_code: this.orderDetails.ticket_segments[
            this.orderDetails.ticket_segments.length - 1
          ].arrive,
          city_name: this.orderDetails.ticket_segments[
            this.orderDetails.ticket_segments.length - 1
          ].arrive_CN.city_name,
          country_code: this.orderDetails.ticket_segments[
            this.orderDetails.ticket_segments.length - 1
          ].arrive_CN.country_code,
          province: this.orderDetails.ticket_segments[
            this.orderDetails.ticket_segments.length - 1
          ].arrive_CN.province,
        },
        toTime: {
          date: moment(
            this.orderDetails.ticket_segments[0].departure_time
          ).format("YYYY-MM-DD"),
          month: moment(
            this.orderDetails.ticket_segments[0].departure_time
          ).format("M月DD日"),
          status: "start",
          type: "time",
          week: moment(
            this.orderDetails.ticket_segments[0].departure_time
          ).format("ddd"),
        },
        fromTime: {},
        to_type: "",
        from_type: "",
      };

      this.ticketOrder["type"] = 0;
      uni.navigateTo({
        url:
          "/ticketInquiry/ticketInquiry?data=" +
          JSON.stringify(this.ticketOrder),
      });
    },

    onLoad(data) {
      this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
      this.orderId = data.orderNo; //订单编号
      console.log(this.orderId);

      this.type = data.roundType; //去程  返程
      this.cancelType = data.cancel ? data.cancel : false; //取消订单
      this.cancelOrderType = data.cancel !== "";

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
  overflow: hidden;
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
      .price_other {
        color: #ffffff;
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
    //兼容问题
    position: relative;
    flex: 1;
    height: 100%;
    overflow-y: auto;
    .content {
      height: 100%;
      position: relative;
      z-index: 2;
      padding-top: 20rpx;
      // &::after {
      //   content: "";
      //   display: block;
      //   background: #0070e2;
      //   width: 100%;
      //   height: 90upx;
      //   position: absolute;
      //   top: 0;
      //   left: 0;
      //   z-index: 0;
      // }

      /deep/.fight_header {
        position: relative;
        z-index: 2;
      }

      .main_list {
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 12upx 18upx rgba(0, 0, 0, 0.04);
        border-radius: 20upx;
        margin: 0 20upx 20upx;
        padding: 24upx 20upx 20upx;
        position: relative;
        z-index: 2;
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
                text{
                  font-size: 20upx;
                }
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

.price_info {
  position: relative;
  &::before {
    content: "";
    position: absolute;
    bottom: -120upx;
    width: 100%;
    height: 120upx;
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
</style>
