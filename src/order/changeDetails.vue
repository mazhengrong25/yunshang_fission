<!--
 * @Author: mzr
 * @Date: 2020-11-24 10:36:26
 * @LastEditTime: 2020-12-08 17:59:58
 * @LastEditors: Please set LastEditors
 * @Description: 改签详情
 * @FilePath: \positiond:\tests\Distribution\yunshang_fission\src\order\changeDetails.vue
-->
<template>
  <view class="change_detail">
    <yun-header :statusHeight="iStatusBarHeight" centerTitle="改签单详情"></yun-header>

    <!-- 改签头部 -->
    <view class="details_header">
      <view class="header_top">
        <view class="order_type">
          {{
            changeDetailsData.change_status === 1
              ? "申请中"
              : changeDetailsData.change_status === 2
              ? "待支付"
              : changeDetailsData.change_status === 3
              ? "待出票"
              : changeDetailsData.change_status === 4
              ? "已完成"
              : ""
          }}
        </view>

        <view
          class="order_price"
          v-if="JSON.stringify(changeDetailsData) !== '{}'"
          @click="openTotalChange()"
        >
          <text class="price_text">改签费&yen;</text>
          <text>{{ changeDetailsData.change_fee }}</text>
        </view>

        <view class="price_other" v-else> 数据获取中 </view>
      </view>
      <!-- 剩余时间 待支付 -->
      <view class="remaining_time" v-if="changeDetailsData.change_status === 2">
        <view class="time_info">
          <image
            class="time_icon"
            src="@/static/order_remaining_time.png"
            mode="aspectFit"
          />
          <text class="time_text"
            >剩余支付时间：{{ changeDetailsData.overdue_time }}分钟</text
          >
        </view>
      </view>

      <!-- 订单状态 -->
      <view class="remaining_time" v-else>
        <text class="time_text">
          {{
            changeDetailsData.change_status === 1
              ? "您的申请已提交，等待后台审核"
              : changeDetailsData.change_status === 3
              ? "订单支付成功，出票中..."
              : changeDetailsData.change_status === 4
              ? "订单改签完成，已出票"
              : ""
          }}
        </text>

        <view class="option_btn" v-if="changeDetailsData.change_status === 1"
        @click="getCancel()"
        >取消订单</view>
      </view>

      <view class="order_option">
        <view class="option_btn" v-if="changeDetailsData.change_status === 2"
        @click="getCancel()"
        >取消订单</view>
        <view
          class="option_btn important_btn"
          v-if="changeDetailsData.change_status === 2"
          @click="jumpOrderPay()"
          >去支付</view
        >
      </view>
    </view>

    <view class="details_main">
      <scroll-view :enable-back-to-top="true" :scroll-y="true" class="content">
        <!-- 乘机人 -->
        <view class="main_list passenger">
          <view class="main_list_title">乘机人</view>
          <view class="passenger_list">
            <view
              :class="['list_item', { active: passInfoChecket === index }]"
              v-for="(item, index) in changeDetailsData.change_passengers"
              :key="index"
            >
              <view class="list_info" @click="openPassInfo(index)">
                <view class="info_type">
                  {{
                    item.ticket_passenger.PassengerType === "ADT"
                      ? "成人"
                      : item.ticket_passenger.PassengerType === "CNN"
                      ? "儿童"
                      : item.ticket_passenger.PassengerType === "INF"
                      ? "婴儿"
                      : ""
                  }}票
                </view>
                <view class="info_name">{{ item.ticket_passenger.PassengerName }}</view>
                <view class="is_insurance" v-if="Number(item.insurance_total) > 0">
                  <image src="@/static/insurance_icon.png" mode="aspectFit" />
                </view>
                <view class="group_info" v-if="changeDetailsData.change_status !== 4">
                  <view class="group_type">旧票号</view>
                  <view class="group_number">
                    {{ item.ticket_passenger.ticket_no || "" }}
                  </view>
                </view>
                <!-- 已完成状态 -->
                <view class="group_info" v-else>
                  <view class="group_type">新票号</view>
                  <view class="group_number">
                    {{ item.ticket_no || "" }}
                  </view>
                </view>
                <view class="price_arrow">
                  <image src="@/static/unfold.png" mode="aspectFit" />
                </view>
              </view>
              <!-- 展开内容 -->
              <view class="list_main">
                <view class="list_item" v-if="changeDetailsData.change_status === 4">
                  <view class="item_title_old">旧票号</view>
                  <view class="item_message_old">{{
                    item.ticket_passenger.ticket_no || ""
                  }}</view>
                </view>

                <view class="list_item">
                  <view class="item_title">{{
                    item.ticket_passenger.Credential === "0"
                      ? "身份证"
                      : item.ticket_passenger.Credential === "1"
                      ? "护照"
                      : item.ticket_passenger.Credential === "2"
                      ? "港澳通行证"
                      : item.ticket_passenger.Credential === "3"
                      ? "台胞证"
                      : item.ticket_passenger.Credential === "4"
                      ? "回乡证"
                      : item.ticket_passenger.Credential === "5"
                      ? "台湾通行证"
                      : item.ticket_passenger.Credential === "6"
                      ? "入台证"
                      : item.ticket_passenger.Credential === "7"
                      ? "国际海员证"
                      : item.ticket_passenger.Credential === "8"
                      ? "其它证件"
                      : ""
                  }}</view>
                  <view class="item_message">{{
                    item.ticket_passenger.CredentialNo
                  }}</view>
                </view>

                <view class="list_item">
                  <view class="item_title">手机号</view>
                  <view class="item_message">{{ item.ticket_passenger.phone || ''}}</view>
                </view>
              </view>
            </view>
          </view>

          <view class="contact">
            <view class="contact_list">
              <view class="list_title">联系人</view>
              <view class="list_message">{{ changeDetailsData.contact || "" }}</view>
            </view>
            <view class="contact_list">
              <view class="list_title">联系电话</view>
              <view class="list_message">{{ changeDetailsData.phone || "" }}</view>
            </view>
          </view>
        </view>

        <!-- 新航班 -->
        <flight-header
          v-if="flightData.data.length > 0"
          :flightData="flightData"
          :roundTripFlightData="roundTripFlightData"
          :roundTripType="roundTripType"
          :interType="false"
          flightTitle="detail_new"
        ></flight-header>

        <view v-else class="not_flight_data">
          <text></text>
          <text></text>
          <view></view>
        </view>

        <!-- 原航班 -->
        <flight-header
          v-if="flightOldData.data.length > 0"
          :flightData="flightOldData"
          :roundTripFlightData="roundTripFlightData"
          :roundTripType="roundTripType"
          :interType="false"
          flightTitle="change"
        ></flight-header>

        <view v-else class="not_flight_data">
          <text></text>
          <text></text>
          <view></view>
        </view>

        <!-- 多次改签 -->
        <view
          class="main_list"
          v-if="JSON.stringify(mulChangeList) !== '{}'"
          @click="openHistoryChange"
        >
          <text class="flight_list_title">更多历史航班信息</text>
        </view>

        <!-- 订单信息 -->
        <view class="main_list order_message">
          <view class="main_list_title">
            <text>订单信息</text>
          </view>
          <view class="message_list">
            <view class="list_item">
              <view class="item_title">订单编号</view>
              <view class="item_message">{{ changeDetailsData.order_no }}</view>
            </view>
            <view class="list_item">
              <view class="item_title">PNR</view>
              <view class="item_message">{{ changeDetailsData.pnr_code }}</view>
            </view>
            <view class="list_item" v-if="changeDetailsData.change_status === 4">
              <view class="item_title">YATP订单号</view>
              <view class="item_message">{{ changeDetailsData.yatp_id }}</view>
            </view>
            <view class="list_item">
              <view class="item_title">订票员</view>
              <view class="item_message">{{ changeDetailsData.login_name }}</view>
            </view>
            <view class="list_item">
              <view class="item_title">分销商</view>
              <view class="item_message">{{
                changeDetailsData.disinfo.company_name
              }}</view>
            </view>
            <view class="list_item" v-if="changeDetailsData.change_status === 4">
              <view class="item_title">出票员</view>
              <view class="item_message">{{
                changeDetailsData.change_passengers[0].ticket_passenger.out_ticket_name
              }}</view>
            </view>
            <view class="list_item">
              <view class="item_title">申请时间</view>
              <view class="item_message">{{ changeDetailsData.created_at }}</view>
            </view>
            <view class="list_item">
              <view class="item_title">备注</view>
              <view class="item_message input-right-arrow">{{ remark || "无" }}</view>
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

    <!-- 改签费弹窗 -->
    <uni-popup ref="totalChange" type="bottom">
      <view class="price_info">
        <view class="title">
          改签费用
          <view class="close_btn" @click="closeTotalChange()"></view>
        </view>
        <view class="price_info_box">
          <view class="total_price_header">
            <view class="header_left">
              <view class="total_price_title">订单总价</view>
              <view class="total_price_message">
                <text>&yen;</text>{{ changeDetailsData.change_fee }}
              </view>
            </view>
          </view>

          <scroll-view :scroll-y="true" class="price_info_main">
            <view
              :class="['price_info_list', { active: priceInfoChecket === index }]"
              v-for="(item, index) in changeDetailsData.change_passengers"
              :key="index"
            >
              <view class="list_title" @click="openPriceInfo(index)">
                <view class="title_name">{{ item.ticket_passenger.PassengerName }}</view>

                <view class="title_price">
                  <view class="title_text">总金额</view>
                  <view class="peice_style">
                    <text>&yen; {{ item.ticket_passenger.total_price }}</text>
                    <view class="price_arrow">
                      <image src="@/static/unfold.png" mode="aspectFit" />
                    </view>
                  </view>
                </view>
              </view>

              <view class="list_main">
                <view class="list_item">
                  <view class="item_title">票面价</view>
                  <view class="item_message"
                    >&yen; {{ item.ticket_passenger.ticket_price }}</view
                  >
                </view>

                <view class="list_item">
                  <view class="item_title">机建/燃油</view>
                  <view class="item_message">{{
                    "&yen; " + item.build_price + " / &yen; " + item.fuel_price
                  }}</view>
                </view>

                <view class="list_item">
                  <view class="item_title">保险</view>
                  <view class="item_message">&yen; {{ item.insurance_price }}</view>
                </view>

                <view class="list_item">
                  <view class="item_title">服务费</view>
                  <view class="item_message"
                    >&yen; {{ item.ticket_passenger.service_price }}</view
                  >
                </view>

                <view class="list_item">
                  <view class="item_title">误机费</view>
                  <view class="item_message">&yen; {{ item.delay_price }}</view>
                </view>
              </view>
            </view>

            <!-- <view class="price_info_list active">
              <view class="list_title">
                <view class="title_name">所有乘客票面总价</view>
              </view>
              <view class="list_main">
                <view class="list_item">
                  <view class="item_title">总票面价</view>
                  <view class="item_message">&yen; {{ totalPrice.ticket_price }}</view>
                </view>
                <view class="list_item">
                  <view class="item_title">总机建/燃油</view>
                  <view class="item_message"
                    >&yen;
                    {{ totalPrice.build_price + "/" + totalPrice.fuel_price }}</view
                  >
                </view>
                <view class="list_item">
                  <view class="item_title">总保险</view>
                  <view class="item_message">&yen; {{ totalPrice.insurance_price }}</view>
                </view>
                <view class="list_item">
                  <view class="item_title">总服务费</view>
                  <view class="item_message">&yen; {{ totalPrice.service_price }}</view>
                </view>
                <view class="list_item">
                  <view class="item_title">总误机费</view>
                  <view class="item_message">&yen; {{ totalPrice.delay_price }}</view>
                </view>
              </view>
            </view> -->
          </scroll-view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import orderApi from "@/api/order.js";
import flightHeader from "@/components/flight_header.vue"; // 航程信息
export default {
  components: {
    flightHeader,
  },

  data() {
    return {
      iStatusBarHeight: 0,

      changeDetailsData: {}, //列表传入

      flightData: {}, //新航班
      flightOldData: {}, //原航班

      passInfoChecket: null, //乘客信息展开值

      mulChangeList: [], //多次改签列表

      priceInfoChecket: null, // 改签金额明细展开值

      totalPrice: {
        // 改签所有乘客计算
        ticket_price: 0,
        build_price: 0,
        fuel_price: 0,
        insurance_price: 0,
        service_price: 0,
        delay_price: 0,
      },
    };
  },
  methods: {
    // 展开乘客信息详情
    openPassInfo(i) {
      this.passInfoChecket = this.passInfoChecket === i ? null : i;
      this.$forceUpdate();
    },

    // 订单总价 弹窗
    openTotalChange() {
      this.$refs.totalChange.open();
    },

    // 订单总价  关闭弹窗
    closeTotalChange() {
      this.$refs.totalChange.close();
    },

    // 展开改签金额详情信息
    openPriceInfo(i) {
      this.priceInfoChecket = this.priceInfoChecket === i ? null : i;
      this.$forceUpdate();
    },

    // 取消订单弹窗
    getCancel() {
      this.$refs.yunConfig.openConfigPopup();
    },

     //取消订单弹窗 确认取消
    getSubmit(type) {
      console.log(type);
      let data = {
        order_no: this.changeDetailsData.order_no,
      };
      console.log(data);
      orderApi.cancleInterRefund(data).then((res) => {
        if (res.result === 10000) {
      
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

      let orderId = [this.changeDetailsData.order_no];
      let priceList = [this.changeDetailsData.need_pay_amount];
      let priceNumber = this.changeDetailsData.need_pay_amount;
      let passengerList = []
      this.changeDetailsData.change_passengers.forEach(item =>{
        passengerList.push(item.ticket_passenger)
      })

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
          JSON.stringify(passengerList) +
          "&headerType=false" +
          "&type=false",        
      });
    },
    // 跳转到多次改签页面
    openHistoryChange() {
      let data = {
        oldDetails: this.changeDetailsData,
        newDetails: this.mulChangeList,
      };
      uni.navigateTo({
        url: "/order/changeHistory?changeData=" + JSON.stringify(data),
      });
    },

    // 获取多次改签
    getMulChangeList() {
      let data = {
        pid: this.changeDetailsData.id,
      };

      orderApi.mulChangeList(data).then((res) => {
        if (res.result === 10000) {
          this.mulChangeList = res.data;
        }
      });
    },
  },
  onShow() {
    this.getMulChangeList();
  },
  onLoad(data) {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.changeDetailsData = JSON.parse(data.changeData);

    console.log("改签详情", this.changeDetailsData);
    // 组装航程信息   新航班
    this.flightData = {
      flightType: this.changeDetailsData.change_segments.segment_num
        ? Number(this.changeDetailsData.change_segments.segment_num) === 2
          ? "去程"
          : "返程"
        : "单程",
      data: this.changeDetailsData.change_segments || [], // 单程信息
      cabinInfo: this.changeDetailsData.change_segments || [], //退票规则
    };

    // 组装航程信息  原航班
    this.flightOldData = {

      flightType: (this.changeDetailsData.ticket_order.ticket_segments.length) === 2
      ? Number(this.changeDetailsData.ticket_order.ticket_segments[1].segment_num) === 2
        ? "往返"
        : "单程"
      : "单程",
      
      // flightType: this.changeDetailsData.ticket_order.ticket_segments[0].segment_num
      //   ? Number(this.changeDetailsData.ticket_order.ticket_segments[0].segment_num) === 2
      //     ? "往返"
      //     : "单程"
      //   : "",
      data: this.changeDetailsData.ticket_order.ticket_segments || [], // 单程信息
      cabinInfo: this.changeDetailsData.ticket_order.ticket_segments || [], //退票规则
    };

    this.changeDetailsData.change_passengers.forEach((item) => {
      this.totalPrice.ticket_price += item.ticket_price;
      this.totalPrice.build_price += item.build_price;
      this.totalPrice.fuel_price += item.fuel_price;
      this.totalPrice.insurance_price += item.insurance_price;
      this.totalPrice.service_price += item.service_price;
      this.totalPrice.delay_price += item.delay_price;
    });
  },
};
</script>

<style lang="less" scoped>
.change_detail {
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
      justify-content: space-between;
      .time_icon {
        width: 24upx;
        height: 24upx;
        object-fit: contain;
        margin-right: 10upx;
      }
      .time_text {
        font-size: 24upx;
        font-weight: 400;
        color: #ffffff;
        opacity: 0.8;
      }
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
      .time_info {
        display: inline-flex;
        align-items: center;
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
    display: flex;
    overflow: hidden;
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
      position: relative;
      overflow-y: auto;
      z-index: 2;
      padding-top: 20upx;

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
        &:last-child {
          margin-bottom: var(--status-bar-height);
        }
        .flight_list_title {
          font-size: 28upx;
          font-weight: 400;
          color: #333333;
          margin-left: 34%;
        }
        .main_list_title {
          font-size: 32upx;
          font-weight: bold;
          color: rgba(42, 42, 42, 1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          .showPriceInfo {
            text-align: right;
            font-size: 24upx;
            font-weight: 400;
            color: #2a2a2a;
          }
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
                background: url(@/static/ticket_path.png) no-repeat center center;
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
        @keyframes openPassenger {
          from {
            margin-top: -100%;
          }
          to {
            margin-top: 0;
          }
        }

        @keyframes closePassenger {
          from {
            margin-top: 0;
          }
          to {
            margin-top: -100%;
          }
        }
        &.passenger {
          .passenger_list {
            min-height: 40upx;
            margin-top: 32upx;
            .list_item {
              min-height: 40rpx;
              overflow: hidden;
              &:not(:last-child){
                margin-bottom: 40upx;
              }
              &.active {
                .list_info {
                  .price_arrow {
                    transform: rotate(180deg);
                  }
                }
                .list_main {
                  animation: openPassenger 0.4s forwards;
                  padding-bottom: 24rpx;
                  border-bottom: 2rpx solid #f1f3f5;
                  margin-bottom: 32rpx;
                  padding-top: 28upx;
                }
              }

              .list_info {
                display: flex;
                align-items: center;
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
                .group_info {
                  display: flex;
                  justify-content: center;
                  align-items: center;

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
                .price_arrow {
                  transition: all 0.3s;
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  width: 22upx;
                  height: 12upx;
                  margin-left: auto;
                  image {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                  }
                }
              }
              .list_main {
                overflow: hidden;
                animation: closePassenger 0.4s forwards;
                padding-left: 37%;
                .list_item {
                  display: flex;
                  align-items: center;
                  &:not(:last-child) {
                    margin-bottom: 24upx;
                  }
                  .item_title {
                    font-size: 28upx;
                    font-weight: 400;
                    color: #666666;
                  }
                  .item_message {
                    font-size: 28upx;
                    font-weight: 400;
                    color: #666666;
                    margin-left: 10upx;
                  }
                  .item_title_old {
                    font-size: 28upx;
                    font-weight: 400;
                    color: #afb9c4;
                  }
                  .item_message_old {
                    font-size: 28upx;
                    font-weight: 400;
                    color: #afb9c4;
                    margin-left: 10upx;
                  }
                }
              }
              .list_message {
                display: flex;
                align-items: center;
                .message_title {
                  font-size: 28upx;
                  font-weight: 400;
                  color: rgba(42, 42, 42, 1);
                  width: 114upx;
                }
                .message_number {
                  font-size: 28upx;
                  font-weight: bold;
                  color: rgba(42, 42, 42, 1);
                }
              }
              .ticket_no {
                margin-top: 20upx;
                display: flex;
                align-items: center;
                font-size: 28upx;
                color: rgba(42, 42, 42, 1);
                font-weight: bold;
                .ticket_no_title {
                  width: 114upx;
                  font-weight: 400;
                }
              }
            }
          }
          .contact {
            margin-top: 32upx;
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
                width: 132upx;
                text {
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
              animation: openMain 0.4s forwards;
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
            animation: closeMain 0.4s forwards;
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
</style>
