<!--
 * @Description: 火车票 --- 订单详情
 * @Author: mzr
 * @Date: 2021-08-20 17:07:00
 * @LastEditTime: 2021-10-28 10:33:39
 * @LastEditors: mzr
-->
<template>
  <view class="train_details">
    <yun-header
      :statusHeight="iStatusBarHeight"
      :centerTitle="orderHeaderTitle"
    ></yun-header>

    <view class="details_header">
      <view class="header_top">
        <view class="order_type">
          <!-- {{detailData.status === 1 ?
                '占座中':detailData.status === 2 ?
                  '待支付':detailData.status === 3 ?
                    '待出票':detailData.status === 4 ?
                      '已出票':detailData.status === 5 ?
                        '已取消':detailData.status === 6 ? 
                          '占座失败':detailData.status === 7 ?
                            '出票失败':''}} -->
          {{
            detailData.status === 1
              ? "占座中,请稍后"
              : detailData.status === 2
              ? "待支付"
              : detailData.status === 3
              ? "出票中，请稍后"
              : detailData.status === 4 &&
                detailData.refund_orders.length < 1 &&
                detailData.change_orders.length < 1 &&
                detailData.offline_refund_number > 0
              ? "线下退票"
              : detailData.status === 4 &&
                detailData.refund_orders.length < 1 &&
                detailData.change_orders.length < 1
              ? "已出票"
              : detailData.status === 4 && detailData.refund_orders.length > 0
              ? "已退票"
              : detailData.status === 4 && detailData.change_orders.length > 0
              ? "已改签"
              : detailData.status === 5
              ? "已取消"
              : detailData.status === 6
              ? "占座失败"
              : detailData.status === 7 && detailData.refund_orders.length > 0
              ? "已退票"
              : detailData.status === 7
              ? "出票失败"
              : ""
          }}
        </view>

        <view class="order_price" @click="openPriceDialog()">
          <text class="price_text">总价</text>
          <text class="price_sign">&yen;</text>
          <text>{{ detailData.total_price || "金额数据错误" }}</text>
        </view>
      </view>

      <view class="remaining_time">
        <image
          class="time_icon"
          v-if="detailData.status === 1 || detailData.status === 2"
          src="@/static/order_remaining_time.png"
          mode="aspectFit"
        />
        <text class="time_text">
          {{
            detailData.status === 1
              ? `预计在${$moment(detailData.created_at)
                  .add(10, "m")
                  .format("mm:ss")}分前完成占座`
              : detailData.status === 2
              ? `剩余支付时间：${remainingTime}`
              : detailData.status === 3
              ? "订单支付成功，出票中..."
              : ""
          }}
        </text>
      </view>

      <view class="order_option">
        <view class="option_btn" v-if="detailData.status !== 1" @click="getSend()"
          >发送短信</view
        >
        <view class="option_btn" v-if="detailData.status === 2" @click="getCancel()"
          >取消订单</view
        >
        <view
          class="option_btn important_btn"
          v-if="detailData.status === 2"
          @click="jumpOrderPay()"
          >去支付</view
        >
        <view
          class="option_btn"
          v-if="
            detailData.status === 4 &&
              detailData.refund_orders.length < 1 &&
              detailData.change_orders.length < 1
          "
          @click="getRefund(detailData)"
          >退票</view
        >
        <view
          class="option_btn"
          v-if="
            detailData.status === 4 &&
              detailData.refund_orders.length < 1 &&
              detailData.change_orders.length < 1
          "
          @click="getChange(detailData)"
          >改签</view
        >
        <view
          class="option_btn important_btn"
          v-if="
            detailData.status === 4 &&
              detailData.refund_orders.length < 1 &&
              detailData.change_orders.length < 1
          "
          @click="returnReserve()"
          >预定返程</view
        >
        <view
          class="option_btn important_btn"
          v-if="
            detailData.status === 5 ||
              detailData.refund_orders.length > 0 ||
              detailData.change_orders.length > 0
          "
          @click="againReserve()"
          >再次预定</view
        >
        <view
          class="option_btn important_btn"
          @click="againReserve()"
          v-if="detailData.status === 6 || detailData.status === 7"
          >重选车次</view
        >
      </view>
    </view>

    <view class="details_main">
      <scroll-view :enable-back-to-top="true" :scroll-y="true" class="content">
        <!-- 车次信息 -->
        <view class="train_class">
          <trainMessageCard
            :trainObject="trainData"
            :isCabin="true"
            :seatObject="singleData"
            :isRule="true"
          ></trainMessageCard>
        </view>
        <!-- 出行信息 -->
        <view class="main_list passenger">
          <view class="main_list_title_box">
            <view
              :class="[
                'main_list_title',
                { main_list_title_label: detailData.ticket_number },
              ]"
              >出行信息</view
            >
            <view class="passenger_right_label" v-if="detailData.ticket_number"
              >取票号{{ detailData.ticket_number }}</view
            >
          </view>

          <view class="passenger_list">
            <view
              :class="['list_item_title', { active: passInfoChecket === index }]"
              v-for="(item, index) in detailData.passengers"
              :key="index"
            >
              <view class="list_info" @click="openPassInfo(index)">
                <view class="info_type"
                  >{{
                    item.PassengerType === "ADT"
                      ? "成人"
                      : item.PassengerType === "CHD"
                      ? "儿童"
                      : ""
                  }}票</view
                >
                <view class="info_name">{{ item.PassengerName }}</view>
                <view
                  class="is_insurance"
                  :style="{ opacity: item.is_insurance === 1 ? '' : '0' }"
                ></view>
                <view class="group_info" v-if="item.seat_info">
                  <view class="group_type">座位号</view>
                  <view class="group_number">
                    {{ item.seat_info.replace("厢,", "") || "" }}
                  </view>
                </view>
                <view class="price_arrow" v-if="item.ticket_no">
                  <image src="@/static/unfold.png" mode="aspectFit" />
                </view>
              </view>
              <!-- 展开内容 -->
              <view class="list_main">
                <view class="list_item">
                  <view v-if="item.PassengerType === 'CHD'" class="list_item_add">
                    用
                    <view v-if="!detailData.ticket_number" style="color: #FB9826">{{
                      item.PassengerName
                    }}</view>
                    <view v-else style="color:#666;">【{{ item.PassengerName }}】</view>
                    证件取票，身高低于1.5米
                  </view>
                  <view v-else class="list_item_add">
                    <view :class="['item_title',{ modal :item.Credential === '1'}]">
                      {{
                        item.Credential === "1"
                          ? "身份证"
                          : item.Credential === "2"
                          ? "港澳居住证"
                          : item.Credential === "B"
                          ? "护照"
                          : item.Credential === "C"
                          ? "港澳通行证"
                          : item.Credential === "G"
                          ? "台湾通行证"
                          : item.Credential === "H"
                          ? "外国人身份证"
                          : item.Credential
                      }}
                    </view>
                    <view class="item_message">{{ item.CredentialNo }}</view>
                  </view>
                </view>

                <view class="list_item" v-if="item.ticket_no">
                  <view class="item_title_old">票号</view>
                  <view class="item_message_old">{{ item.ticket_no }}</view>
                </view>
              </view>
            </view>
          </view>

          <view class="contact">
            <view class="contact_list">
              <view class="list_title">联系人</view>
              <view class="list_message">{{ detailData.contact }}</view>
            </view>
            <view class="contact_list">
              <view class="list_title">联系电话</view>
              <view class="list_message">{{ detailData.phone }}</view>
            </view>
            <view class="contact_list">
              <view class="list_title">已购保险</view>
              <view class="list_message"></view>
            </view>
          </view>
        </view>
        <!-- 订单信息 -->
        <view class="main_list order_message">
          <view class="main_list_title">订单信息</view>
          <view class="message_list">
            <view class="list_item">
              <view class="item_title">订单编号</view>
              <view class="item_message">{{ detailData.order_no }}</view>
            </view>
            <view class="list_item">
              <view class="item_title">订票员</view>
              <view class="item_message">{{
                detailData.book_user_name ? detailData.book_user_name : ""
              }}</view>
            </view>
            <view class="list_item">
              <view class="item_title">预定时间</view>
              <view class="item_message">{{
                detailData.created_at ? detailData.created_at : ""
              }}</view>
            </view>
            <view
              class="list_item"
              v-if="detailData.status === 4 || detailData.status === 7"
            >
              <view class="item_title">支付时间</view>
              <view class="item_message">{{
                detailData.pay_time ? detailData.pay_time : ""
              }}</view>
            </view>
            <view class="list_item" @click="openRemark()">
              <view class="item_title">备注</view>
              <view v-if="trainOrderRemark" class="item_message">{{
                trainOrderRemark
              }}</view>
              <view v-else class="item_message input-right-arrow"></view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 取消订单弹窗 -->
    <yun-config
      ref="yunConfig"
      @submitConfig="getCancelSubmit"
      title="温馨提示"
      content="您是否要取消此订单"
      submitIndex="right"
    ></yun-config>

    <!--  订单总价-->
    <uni-popup ref="orderPrice" type="bottom">
      <view class="price_info">
        <view class="title">
          订单总价
          <view class="close_btn" @click="closePriceDialog()"></view>
        </view>
        <view class="price_info_box">
          <view class="total_price_header">
            <view class="header_left">
              <view class="total_price_title">订单总价</view>
              <view class="total_price_message">
                <text>&yen;</text>{{ detailData.total_price }}
              </view>
            </view>
          </view>

          <scroll-view :scroll-y="true" class="price_info_main">
            <view
              :class="['price_info_list', { active: priceInfoChecket === index }]"
              v-for="(item, index) in detailData.passengers"
              :key="index"
            >
              <view class="list_title" @click="openPriceInfo(index)">
                <view class="title_name"
                  >{{ item.PassengerName }}
                  {{ item.PassengerType === "CHD" ? "(儿童)" : "" }}</view
                >

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
                  <view class="item_title">票面价</view>
                  <view class="item_message">&yen; {{ item.ticket_price }}</view>
                </view>

                <view class="list_item">
                  <view class="item_title">保险</view>
                  <view class="item_message">&yen; {{ item.insurance_price }}</view>
                </view>

                <view class="list_item">
                  <view class="item_title">服务费</view>
                  <view class="item_message">&yen; {{ item.service_price }}</view>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import orderApi from "@/api/order.js";
import trainMessageCard from "@/components/train_message_card.vue"; // 车次信息
export default {
  components: {
    trainMessageCard,
  },
  data() {
    return {
      order_no: "", // 订单号
      iStatusBarHeight: 0,
      orderHeaderTitle: "订单详情",

      detailData: {}, // 详情数据

      // 组件 车次信息
      trainData: {},
      singleData: {},

      passInfoChecket: null, // 乘客信息展开值
      priceInfoChecket: null, // 订单总价展开值
      trainOrderRemark: "", // 备注内容

      getTimeType: "", // 预定返程或重选车次状态

      paySecond: 0, // 支付时间
      remainingTime: "00:00", // 倒计时
      _countdown: {}, // 支付倒计时
    };
  },
  methods: {
    // 展开乘车信息详情
    openPassInfo(i) {
      this.passInfoChecket = this.passInfoChecket === i ? null : i;
      this.$forceUpdate();
    },

    // 展开订单总价信息
    openPriceInfo(i) {
      this.priceInfoChecket = this.priceInfoChecket === i ? null : i;
    },

    // 获取详情数据
    getTrainDetail(val) {
      orderApi.trainOrderDetail(val).then((res) => {
        console.log(res);
        if (res.errorcode === 10000) {
          this.detailData = res.data;
          let closeTime = this.$moment(this.detailData.created_at).add(10, "m");
          this.paySecond = closeTime.diff(this.$moment(), "s");
          if (this.paySecond > 0) {
            this._countdown = setInterval(() => {
              this.orderCountdown();
            }, 1000);
          }

          this.getTrainMessage(res.data);
          // 占座状态
          // if (this.detailData.status === 1) {
          //     this.occupyTime = 60;
          //     let timer = setInterval(() => {
          //         this.occupyTime--;
          //         if (this.occupyTime < 1) {
          //             clearInterval(timer);
          //         }
          //     }, 3000);
          //     // 跳转到支付页面
          //     uni.navigateTo({
          //         url:
          //             "/trainReservation/orderPay?detailItem=" +
          //             JSON.stringify(this.detailData),
          //     });
          // }
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
            duration: 3000,
          });
        }
      });
    },

    // 订单倒计时
    orderCountdown() {
      if (this.paySecond > 0) {
        let minutes = Math.floor(this.paySecond / 60);
        let seconds = Math.floor(this.paySecond % 60);
        this.remainingTime =
          (minutes < 10 ? "0" + minutes : minutes) +
          ":" +
          (seconds < 10 ? "0" + seconds : seconds);
        --this.paySecond;
      } else {
        this.remainingTime = "00:00";
        clearInterval(this._countdown);
        this.getTrainDetail(this.order_no);
      }
    },

    // 组装车次数据
    getTrainMessage(val) {
      console.log(val);
      this.trainData = {
        train: {
          departure_date: val.segments[0].departure_time,
          days: this.$moment(
            this.$moment(val.segments[0].arrive_time).format("YYYY-MM-DD")
          ).diff(
            this.$moment(
              this.$moment(val.segments[0].departure_time).format("YYYY-MM-DD")
            ),
            "days"
          ),
          departure: this.$moment(val.segments[0].departure_time).format("HH:mm"),
          arrive: this.$moment(val.segments[0].arrive_time).format("HH:mm"),
          code: val.segments[0].train_number,
          number: val.segments[0].train_code,
          run_minute: this.$moment(
            this.$moment(val.segments[0].arrive_time).format("YYYY-MM-DD HH:mm:ss")
          ).diff(
            this.$moment(
              this.$moment(val.segments[0].departure_time).format("YYYY-MM-DD HH:mm:ss")
            ),
            "minutes"
          ),
        },
        station: {
          departure_name: val.segments[0].from_city,
          arrive_name: val.segments[0].to_city,
        },
      };
      this.singleData = {
        code: val.segments[0].seat_level,
        name: val.segments[0].seat,
      };
    },

    // 跳转备注页面
    openRemark() {
      if (this.detailData.status === 5) {
        return false;
      }
      uni.navigateTo({
        url: "/order/addRemark?remark=" + this.trainOrderRemark,
      });
    },

    // 打开订单总价
    openPriceDialog() {
      this.$refs.orderPrice.open();
    },

    closePriceDialog() {
      this.$refs.orderPrice.close();
    },

    // 打开取消订单弹窗
    getCancel() {
      this.$refs.yunConfig.openConfigPopup();
    },

    // 取消订单
    getCancelSubmit() {
      let data = {
        channel: this.detailData.channel, //类型：Number  必有字段  备注：渠道1 web 2 miniapp 3 wechat
        source: this.detailData.source, //类型：String  必有字段  备注：数据源
        order: {
          //类型：Object  必有字段  备注：无
          order_no: this.detailData.order_no, //类型：String  必有字段  备注：订单号
          out_trade_no: this.detailData.out_trade_no, //类型：String  必有字段  备注：外部订单号
        },
      };
      orderApi.trainOrderCancel(data).then((res) => {
        console.log("取消订单", res);
        if (res.errorcode === 10000) {
          this.getTrainDetail(data.order.order_no);
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      });
    },

    // 跳转到退票
    getRefund(val) {
      uni.navigateTo({
        url: "/order/trainRefund?order_no=" + val.order_no,
      });
    },

    // 跳转到改签
    getChange(val) {
      uni.navigateTo({
        url: "/order/trainChange?order_no=" + val.order_no,
      });
    },
    // 去支付
    jumpOrderPay() {
      uni.navigateTo({
        url:
          "/trainReservation/orderPay?orderNo=" +
          this.detailData.order_no +
          "&detailItem=" +
          JSON.stringify(this.detailData),
      });
      console.log("详情去支付", this.detailData.order_no);
    },

    // 发送短信
    getSend() {
      uni.navigateTo({
        url: "/order/sendMessage?orderId=" + this.detailData.order_no,
      });
    },

    // 预定返程
    returnReserve() {
      this.getTimeType = "return";
      let data = {
        type: false,
        data: this.detailData.train_date,
      };
      uni.navigateTo({
        url: "/pages/dateSelect/dateSelect?ticketType=" + JSON.stringify(data),
      });
    },

    // 再次预定  重选车次
    againReserve() {
      this.getTimeType = "again";
      if (this.$moment(this.detailData.train_date).isAfter(this.$moment())) {
        // 当前订单时间 大于今天时间 =》 直接跳转列表
        let data = {
          to: {
            city_code: this.detailData.from_station_code,
            city_name: this.detailData.from_station,
            country_code: "CN",
            province: this.detailData.from_station,
          },
          from: {
            city_code: this.detailData.to_station_code,
            city_name: this.detailData.to_station,
            country_code: "CN",
            province: this.detailData.to_station,
          },
          toTime: {
            date: this.$moment(this.detailData.train_date).format("YYYY-MM-DD"),
          },
          fromTime: {},
          to_type: "",
          from_type: "",
        };
        uni.navigateTo({
          url:
            "/trainInquiry/trainInquiry?trainData=" +
            JSON.stringify(data) +
            "&checkboxStatus=false",
        });
      } else {
        // 如果当前订单时间小于 当前日期 =》 跳转日期
        let data = {
          type: false,
          data: this.detailData.train_date,
        };
        uni.navigateTo({
          url: "/pages/dateSelect/dateSelect?ticketType=" + JSON.stringify(data),
        });
      }
    },
  },

  onShow() {
    if (uni.getStorageSync("time")) {
      // 判断页面是否从日期返回 =》 组装时间参数 跳转 车次列表
      let time = JSON.parse(uni.getStorageSync("time"));
      let data = {
        toTime: {
          date: time.date,
        },
        fromTime: {},
        to_type: "",
        from_type: "",
      };
      if (this.getTimeType === "return") {
        data.to = {
          city_code: this.detailData.to_station_code,
          city_name: this.detailData.to_station,
          country_code: "CN",
          province: this.detailData.to_station,
        };
        data.from = {
          city_code: this.detailData.from_station_code,
          city_name: this.detailData.from_station,
          country_code: "CN",
          province: this.detailData.from_station,
        };
      } else {
        data.to = {
          city_code: this.detailData.from_station_code,
          city_name: this.detailData.from_station,
          country_code: "CN",
          province: this.detailData.from_station,
        };
        data.from = {
          city_code: this.detailData.to_station_code,
          city_name: this.detailData.to_station,
          country_code: "CN",
          province: this.detailData.to_station,
        };
      }
      uni.navigateTo({
        url:
          "/trainInquiry/trainInquiry?trainData=" +
          JSON.stringify(data) +
          "&checkboxStatus=false",
      });
      uni.removeStorageSync("time");
    }
    // 火车票 备注内容
    if (uni.getStorageSync("remark_key")) {
      this.trainOrderRemark = uni.getStorageSync("remark_key");
      uni.removeStorageSync("remark_key");
    }
  },

  onLoad(data) {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.order_no = data.orderNo; // 订单号
    this.getTrainDetail(this.order_no);
  },
};
</script>

<style lang="less" scoped>
.train_details {
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
        align-items: baseline;
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
        .price_sign {
          padding: 0upx 12upx 0upx 16upx;
          font-size: 24upx;
          font-weight: 400;
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
        color: rgba(255, 255, 255, 0.8);
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
    height: 100%;
    overflow-y: hidden;
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
        &.passenger {
          // 取票号
          .main_list_title_box {
            height: 52upx;
            width: 100%;
            position: relative;
            .main_list_title_label {
              font-size: 32upx;
              font-weight: bold;
              color: rgba(42, 42, 42, 1);
              position: absolute;
            }
            .passenger_right_label {
              position: absolute;
              right: -20upx;
              top: -24upx;
              padding: 10upx 26upx 10upx 40upx;
              font-size: 24upx;
              font-weight: 400;
              color: #0070e2;
              background-color: rgba(0, 112, 226, 0.1);
              border-radius: 0upx 20upx 0upx 20upx;
            }
          }

          .passenger_list {
            margin-top: 46upx;
            .list_item_title {
              margin-bottom: 40upx;
              overflow: hidden;
              &.active {
                .list_info {
                  .price_arrow {
                    transform: rotate(180deg);
                  }
                }
                .list_main {
                  height: auto;
                }
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
                  min-width: 90upx;
                  margin-right: 8upx;
                }
                .is_insurance {
                  background: url(@/static/insurance_icon.png) no-repeat center center;
                  background-size: contain;
                  width: 25upx;
                  height: 30upx;
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
                    margin: 0upx 42upx;
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
                padding-left: 17%;
                height: 0;
                .list_item {
                  display: flex;
                  .list_item_add {
                    display: inline-flex;
                    .item_title {
                      font-size: 28upx;
                      font-weight: 400;
                      color: #666666;
                      width: 193upx;
                      &.modal {
                        width: 86upx;
                      }
                    }
                    .item_message {
                      font-size: 28upx;
                      font-weight: bold;
                      color: #2a2a2a;
                      margin-left: 22upx;
                    }
                  }
                  .item_title_old {
                    font-size: 28upx;
                    font-weight: 400;
                    color: #333333;
                    width: 84upx;
                  }
                  .item_message_old {
                    font-size: 28upx;
                    font-weight: bold;
                    color: #2a2a2a;
                    margin-left: 22upx;
                  }
                  &:not(:last-child) {
                    margin-bottom: 28upx;
                  }
                }
              }
            }
          }
          .contact {
            padding-top: 30upx;
            border-top: 2upx solid #f1f3f5;
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
              margin-bottom: 28upx;
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
      .train_class {
        margin: 0upx 20upx 20upx;
      }
    }
  }
}
// 订单总价
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
</style>
