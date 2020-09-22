<!--
 * @Description: 机票查询 - 国内往返
 * @Author: wish.WuJunLong
 * @Date: 2020-07-20 16:32:48
 * @LastEditTime: 2020-09-22 13:58:06
 * @LastEditors: wish.WuJunLong
--> 
<template>
  <view class="ticketRoundTrip">
    <!-- 导航栏 -->
    <yun-header :statusHeight="iStatusBarHeight" :statusType="true" :headerAddress="ticketAddress"></yun-header>
    <!-- 往返时间 -->
    <view class="header_time" v-if="!showDefaultType">
      <round-trip-header :timeData="timeData"></round-trip-header>
    </view>
    <!-- 航班列表 -->
    <scroll-view
      v-if="!showDefaultType"
      :enable-back-to-top="true"
      class="flight_list"
      :scroll-top="scrollTop"
      @scroll="scroll"
      :scroll-y="true"
      lower-threshold="100"
    >
      <view class="round_trip_header" v-if="showRoundTrip">
        <view class="header_box">
          <view class="box_tag">已选去程</view>
          <text>{{showRoundTripData.toCode}}</text>
          <text>{{showRoundTripData.toTime}}</text>
        </view>
        <view class="header_box">
          <view class="box_tag">已选返程</view>
          <text>{{showRoundTripData.fromCode}}</text>
          <text>{{showRoundTripData.fromTime}}</text>
        </view>
      </view>
      <view class="flight_content">
        <view class="left_flight">
          <view
            v-for="(item, index) in flightList"
            :key="index"
            @click="checkedFlight('to',item,index)"
            :class="[{toActive: index === toActive},'flight_box']"
          >
            <view class="box_top">
              <view class="top_time start_time">
                <view class="time">{{$dateTool(item.segments[0].depTime,'HH:mm')}}</view>
                <view
                  class="address"
                >{{item.segments[0].depAirport_CN.air_port_name}}{{item.segments[0].depTerminal !== '--'? item.segments[0].depTerminal: ''}}</view>
              </view>
              <view class="flight_line">
                <view
                  class="time"
                > {{ Math.floor(item.segments[0].duration / 60) }}h{{
                Math.floor(item.segments[0].duration % 60)
                }}m</view>
                <view class="line_icon"></view>
              </view>
              <view class="top_time end_time">
                <view class="time">{{$dateTool(item.segments[0].arrTime,'HH:mm')}}</view>
                <view
                  class="address"
                >{{item.segments[0].arrAirport_CN.air_port_name}}{{item.segments[0].arrTerminal !== '--' ?item.segments[0].arrTerminal : ''}}</view>
              </view>
            </view>
            <view class="total_price_message">
              <!-- <text v-if="!item.premium && item.totalPrice">往返总价</text> -->
            </view>
            <view class="flight_bottom">
              <view class="airlines">
                <image
                  class="airlines_icon"
                  :src="'https://fxxcx.ystrip.cn/'+ item.segments[0].image"
                  mode="contain"
                />
                {{item.segments[0].airline_CN}}{{item.segments[0].flightNumber}}
              </view>
              <view class="price" v-if="item.min_price > 0">
                <view class="price_mini">&yen;</view>
                <!-- <text>{{item.totalPrice}}</text> -->
                <text>{{item.min_price}}</text>
                <!-- <view class="price_mini">起</view> -->
              </view>
              <view v-else class="not_price">售罄</view>
            </view>
          </view>

          <!-- 骨架屏 -->
          <view
            class="flight_skeleton"
            v-for="i in flightList.length < 1?skeletonNumber:0"
            :key="i"
          >
            <view class="top">
              <text></text>
              <text></text>
            </view>
            <text></text>
          </view>

          <view class="no_data" v-if="dataListApplyType">
            <text>到底啦</text>
          </view>
        </view>

        <view class="right_flight">
          <view
            v-for="(item, index) in roundFlightList"
            :key="index"
            @click="checkedFlight('from',item,index)"
            :class="[{fromActive: index === fromActive},'flight_box']"
          >
            <view class="box_top">
              <view class="top_time start_time">
                <view class="time">{{$dateTool(item.segments[0].depTime,'HH:mm')}}</view>
                <view
                  class="address"
                >{{item.segments[0].depAirport_CN.air_port_name}}{{item.segments[0].depTerminal !== '--'? item.segments[0].depTerminal: ''}}</view>
              </view>
              <view class="flight_line">
                <view
                  class="time"
                > {{ Math.floor(item.segments[0].duration / 60) }}h{{
                Math.floor(item.segments[0].duration % 60)
                }}m</view>
                <view class="line_icon"></view>
              </view>
              <view class="top_time end_time">
                <view class="time">{{$dateTool(item.segments[0].arrTime,'HH:mm')}}</view>
                <view
                  class="address"
                >{{item.segments[0].arrAirport_CN.air_port_name}}{{item.segments[0].arrTerminal !== '--' ?item.segments[0].arrTerminal : ''}}</view>
              </view>
            </view>
            <view class="total_price_message">
              <!-- <text v-if="!item.premium && item.totalPrice">往返总价</text> -->
            </view>
            <view class="flight_bottom">
              <view class="airlines">
                <image
                  class="airlines_icon"
                  :src="'https://fxxcx.ystrip.cn/'+ item.segments[0].image"
                  mode="contain"
                />
                {{item.segments[0].airline_CN}}{{item.segments[0].flightNumber}}
              </view>
              <view class="price" v-if="item.min_price > 0">
                <view class="price_mini">&yen;</view>
                <!-- <text>{{item.totalPrice}}</text> -->
                <text>{{item.min_price}}</text>
                <!-- <view class="price_mini">起</view> -->
              </view>
              <view v-else class="not_price">售罄</view>
            </view>
          </view>

          <!-- 骨架屏 -->
          <view
            class="flight_skeleton"
            v-for="i in roundFlightList.length < 1? skeletonRoundNumber :0"
            :key="i"
          >
            <view class="top">
              <text></text>
              <text></text>
            </view>
            <text></text>
          </view>

          <view class="no_data" v-if="dataRoundListApplyType">
            <text>到底啦</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <default-page
      style="flex: 1"
      v-if="showDefault"
      @returnBtn="getTicketData()"
      :defaultType="showDefaultType"
    ></default-page>

    <view class="filter" v-if="!showDefaultType">
      <flight-filter @openFilter="openFilter" :filterMini="true" @filterType="listFilter"></flight-filter>
    </view>

    <flight-filter-dialog
      ref="filterDialog"
      @ticketFilterData="ticketFilter"
      :directFlight="true"
      :airlines="airlineList"
    ></flight-filter-dialog>

    <view class="bottom_bar" v-if="!showDefaultType">
      <view class="left_message">
        <view class="price_box">
          <text>&yen;</text>
          {{price}}
        </view>
        <view class="not_pass_message">往返总价</view>
      </view>
      <button
        :disabled="submitBtnType"
        :class="['right_btn',{'is_false': submitBtnType}]"
        @click="submitRoundTrip()"
      >下一步</button>
    </view>
  </view>
</template>

<script>
import roundTripHeader from "@/components/roundTrip_header.vue"; // 往返日期状态栏
import flightFilter from "@/components/flight_filter.vue"; // 航班筛选
import flightFilterDialog from "@/components/flight_filter_dialog.vue"; // 航班筛选弹窗
import ticket from "@/api/ticketInquiry.js";
import moment from "moment";
moment.locale("zh-cn");
export default {
  components: {
    roundTripHeader,
    flightFilter,
    flightFilterDialog,
  },
  data() {
    return {
      iStatusBarHeight: 0, // 导航栏高度

      scrollTop: 0, // 页面滚动高度
      oldScrollTop: 0,

      showRoundTrip: false, // 往返提示数据
      showRoundTripData: {}, // 往返提示数据内容

      ticketData: {}, // 航班数据
      timeData: {}, // 日期数据

      ticketAddress: {}, // 导航栏地址

      flightList: [], // 航班信息

      oldFlightList: [], // 备份单程数据

      skeletonNumber: 5,
      skeletonRoundNumber: 5,

      pageNumber: 1, // 分页页面
      dataListApplyType: false, // 是否还有新page
      dataRoundListApplyType: false, // 往返是否还有新page

      roundFlightList: [], // 往返航班信息

      checketFlightList: [], // 选中航程
      toActive: 0, // 默认选中去程
      fromActive: 0, // 默认选中返程

      price: 0, // 往返总价

      file_key: "", // 去程key
      roundFlightKey: "", // 返程key

      submitBtnType: true, // 下一步按钮状态

      showDefault: false, // 报错页面
      showDefaultType: "", // 报错类型

      airlineList: ["不限"], // 航班列表
    };
  },
  methods: {
    // 页面滚动距离
    scroll(e) {
      this.oldScrollTop = e.detail.scrollTop;
      this.getScrollData();
    },

    // 获取往返提示头部信息
    getScrollData() {
      this.showRoundTrip = this.oldScrollTop > 10;
      if(this.flightList.length > 0 && this.roundFlightList.length > 0 ){
        this.showRoundTripData = {
          toCode: this.flightList[this.toActive].segments[0].flightNumber,
          fromCode: this.roundFlightList[this.fromActive].segments[0]
            .flightNumber,
          toTime:
            moment(this.flightList[this.toActive].segments[0].depTime).format(
              "HH:mm"
            ) +
            "-" +
            moment(this.flightList[this.toActive].segments[0].arrTime).format(
              "HH:mm"
            ),
          fromTime:
            moment(
              this.roundFlightList[this.fromActive].segments[0].depTime
            ).format("HH:mm") +
            "-" +
            moment(
              this.roundFlightList[this.fromActive].segments[0].arrTime
            ).format("HH:mm"),
        };
      }
      
    },

    // 获取去程航班信息
    getTicketData() {
      let data = {
        departure: this.ticketAddress.to.city_code, // 起飞机场三字码
        arrival: this.ticketAddress.from.city_code, // 到达机场三字码
        departureTime: this.ticketAddress.toTime.date, // 起飞时间
        airline: "", // 航司二字码
        only_segment: 1,
      };
      ticket.getTicket(data).then((res) => {
        if (res.errorcode === 10000) {
          this.file_key = res.data.IBE.file_key;
          this.flightList = res.data.IBE.list;
          // this.flightList = uni.getStorageSync("flightList");
          // this.oldFlightList = JSON.parse(JSON.stringify(this.flightList));
          this.price += this.flightList[this.toActive].min_price;
          this.dataListApplyType = true;

          this.submitBtnType =
            this.flightList.length < 1 || this.roundFlightList.length < 1;
          if (this.flightList.length < 1) {
            uni.showToast({
              title: "当日暂无去程航班信息，请切换其他日期",
              icon: "none",
            });
          }
        } else {
          uni.showToast({
            title: "查询去程航班失败，" + res.msg,
            icon: "none",
            mask: true,
            duration: 4000,
          });
          this.showDefault = true;
          this.showDefaultType = "404";
          this.skeletonNumber = 0;
          this.dataListApplyType = false;
        }
      });
      console.log("去程", this.flightList);
    },
    // 获取返程航班信息
    getRoundTicketData() {
      let data = {
        departure: this.ticketAddress.from.city_code, // 起飞机场三字码
        arrival: this.ticketAddress.to.city_code, // 到达机场三字码
        departureTime: this.ticketAddress.fromTime.date, // 起飞时间
        airline: "", // 航司二字码
        only_segment: 1,
      };
      ticket.getTicket(data).then((res) => {
        if (res.errorcode === 10000) {
          this.roundFlightKey = res.data.IBE.file_key;
          this.roundFlightList = res.data.IBE.list;
          // this.roundFlightList = uni.getStorageSync("roundFlightList");
          // this.oldRoundFlightList = JSON.parse(
          //   JSON.stringify(this.roundFlightList)
          // );

          this.price += this.roundFlightList[this.fromActive].min_price;
          this.dataRoundListApplyType = true;
          this.submitBtnType =
            this.flightList.length < 1 || this.roundFlightList.length < 1;
          if (this.roundFlightList.length < 1) {
            uni.showToast({
              title: "当日暂无返程航班信息，请切换其他日期",
              icon: "none",
            });
          }
        } else {
          uni.showToast({
            title: "查询返程航班失败，" + res.msg,
            icon: "none",
            mask: true,
            duration: 4000,
          });
          this.showDefault = true;
          this.showDefaultType = "404";
          this.skeletonRoundNumber = 0;
          this.dataRoundListApplyType = false;
        }
      });
      console.log("返程", this.roundFlightList);
    },

    // 选择航班
    checkedFlight(type, val, index) {
      console.log(type, val, index);
      if (val.min_price === 0) {
        return false;
      }
      if (type === "to") {
        this.toActive = index;
      } else if (type === "from") {
        this.fromActive = index;
      }
      this.price =
        this.flightList[this.toActive].min_price +
        this.roundFlightList[this.fromActive].min_price;
      this.getScrollData();
      this.$forceUpdate();
    },

    // 价格排序
    priceSort(p) {
      return (m, n) => {
        var a = m[p];
        var b = n[p];
        return a - b;
      };
    },

    // 时间排序
    timeSort(t) {
      return (m, n) => {
        var a = new Date(m.segments[0][t]).getTime();
        var b = new Date(n.segments[0][t]).getTime();
        return a - b;
      };
    },

    // 列表筛选
    listFilter(val) {
      if (val === "price") {
        this.flightList.sort(this.priceSort("min_price"));
        this.roundFlightList.sort(this.priceSort("min_price"));


        let priceList = this.flightList.filter((item) => item.min_price !== 0);
        let notPriceList = this.flightList.filter(
          (item) => item.min_price === 0
        );
        this.flightList = [...priceList, ...notPriceList];

        let roundPriceList = this.roundFlightList.filter((item) => item.min_price !== 0);
        let notRoundPriceList = this.roundFlightList.filter(
          (item) => item.min_price === 0
        );
        this.roundFlightList = [...roundPriceList, ...notRoundPriceList];



        this.price = this.flightList[this.toActive].min_price;
        this.price += this.roundFlightList[this.fromActive].min_price;
      } else if (val === "time") {
        this.flightList.sort(this.timeSort("depTime"));
        this.roundFlightList.sort(this.timeSort("depTime"));
        this.price = this.flightList[this.toActive].min_price;
        this.price += this.roundFlightList[this.fromActive].min_price;
      }
    },

    // 打开筛选
    openFilter() {
      this.$refs.filterDialog.openFilterDialog();
      this.flightList.forEach((item) => {
        this.airlineList.push(item.segments[0].airline_CN);
      });
      this.roundFlightList.forEach((item) => {
        this.airlineList.push(item.segments[0].airline_CN);
      });
      this.airlineList = [...new Set(this.airlineList)];
      console.log(this.airlineList);
    },
    // 关闭弹出框
    closeFilterDialog() {
      this.$refs.filterDialog.closeFilterDialog();
    },

    // 确认筛选
    ticketFilter(val, status) {
      console.log(val, status);
      if (!status && val.length < 1) {
        this.flightList = this.oldFlightList;
        this.roundFlightList = this.oldRoundFlightList;
        return false;
      }
      if (status) {
        this.flightList = this.flightList.filter(
          (item) => item.segments.length < 2
        );
        this.roundFlightList = this.roundFlightList.filter(
          (item) => item.segments.length < 2
        );
      } else {
        this.flightList = this.oldFlightList;
        this.roundFlightList = this.oldRoundFlightList;
      }

      if (val[0]) {
        if (val[0] === "不限") {
          this.flightList = this.oldFlightList;
          this.roundFlightList = this.oldRoundFlightList;
        }
        if (val[0].indexOf("上午") !== -1) {
          this.flightList = this.flightList.filter(
            (item) =>
              new Date(item.segments[0].depTime).getHours() >= 0 &&
              new Date(item.segments[0].depTime).getHours() < 12
          );
          this.roundFlightList = this.roundFlightList.filter(
            (item) =>
              new Date(item.segments[0].depTime).getHours() >= 0 &&
              new Date(item.segments[0].depTime).getHours() < 12
          );
        }
        if (val[0].indexOf("中午") !== -1) {
          this.flightList = this.flightList.filter(
            (item) =>
              new Date(item.segments[0].depTime).getHours() >= 12 &&
              new Date(item.segments[0].depTime).getHours() < 14
          );
          this.roundFlightList = this.roundFlightList.filter(
            (item) =>
              new Date(item.segments[0].depTime).getHours() >= 12 &&
              new Date(item.segments[0].depTime).getHours() < 14
          );
        }
        if (val[0].indexOf("下午") !== -1) {
          this.flightList = this.flightList.filter(
            (item) =>
              new Date(item.segments[0].depTime).getHours() >= 14 &&
              new Date(item.segments[0].depTime).getHours() < 18
          );
          this.roundFlightList = this.roundFlightList.filter(
            (item) =>
              new Date(item.segments[0].depTime).getHours() >= 14 &&
              new Date(item.segments[0].depTime).getHours() < 18
          );
        }
        if (val[0].indexOf("晚上") !== -1) {
          this.flightList = this.flightList.filter(
            (item) =>
              new Date(item.segments[0].depTime).getHours() >= 18 &&
              new Date(item.segments[0].depTime).getHours() < 24
          );
          this.roundFlightList = this.roundFlightList.filter(
            (item) =>
              new Date(item.segments[0].depTime).getHours() >= 18 &&
              new Date(item.segments[0].depTime).getHours() < 24
          );
        }
      }
      if (val[1]) {
        if (val[1] === "不限") {
          this.flightList = this.oldFlightList;
          this.roundFlightList = this.oldRoundFlightList;
        } else {
          this.flightList = this.flightList.filter(
            (item) => item.segments[0].airline_CN === val[1]
          );
          this.roundFlightList = this.roundFlightList.filter(
            (item) => item.segments[0].airline_CN === val[1]
          );
        }
      }

      if (this.flightList.length < 1 || this.roundFlightList.length < 1) {
        this.flightList = this.oldFlightList;
        this.roundFlightList = this.oldRoundFlightList;
        uni.showToast({
          title:
            (this.flightList.length < 1
              ? "去程"
              : this.roundFlightList.length < 1
              ? "返程"
              : "") + "暂无该筛选类别，请更换其他条件",
          duration: 2000,
          icon: "none",
          mask: true,
        });
        setTimeout(() => {
          this.$refs.filterDialog.openFilterDialog();
        }, 1000);
      }
    },

    // 往返航班提交
    submitRoundTrip() {
      let data = {
        ticketMessage: this.ticketAddress,
        start: this.flightList[this.toActive],
        end: this.roundFlightList[this.fromActive],
      };
      let roundTripKey = {
        start: this.file_key,
        end: this.roundFlightKey,
      };
      uni.navigateTo({
        url:
          "/pages/flightInfo/flightInfo?roundTripData=" +
          JSON.stringify(data) +
          "&roundTripKey=" +
          JSON.stringify(roundTripKey) +
          "&pageType=true",
      });
    },
  },
  onLoad(data) {
    // let data = uni.getStorageSync("data");
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.ticketData = data.data ? JSON.parse(data.data) : "";
    console.log("往返数据", this.ticketData);
    // 组装头部数据
    this.ticketAddress = this.ticketData;

    // 组装日期数据
    this.timeData = {
      toTime: this.ticketData.toTime,
      fromTime: this.ticketData.fromTime,
      jetLag: moment(this.ticketData.fromTime.date).diff(
        moment(this.ticketData.toTime.date),
        "days"
      ),
    };

    this.price = 0;
    this.getTicketData();
    this.getRoundTicketData();
    this.getScrollData();
  },
};
</script>

<style scoped lang="less">
.ticketRoundTrip {
  background: rgba(243, 245, 247, 1);
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  .header_time {
    background: rgba(0, 112, 226, 1);
    padding: 20upx;
  }
  .flight_list {
    flex: 1;
    width: 100%;
    overflow-y: auto;
    padding-top: 20upx;
    position: relative;
    .round_trip_header {
      position: fixed;
      display: flex;
      width: 100%;
      justify-content: space-between;
      z-index: 3;
      padding: 0 20upx;
      box-sizing: border-box;
      background: #f3f5f7;
      .header_box {
        display: flex;
        align-items: center;
        height: 60upx;
        width: 350upx;
        border-radius: 20upx 20upx 0 0;
        box-sizing: border-box;
        padding: 0 20upx;
        &:first-child {
          background: #bfdfff;
          color: #0070e2;
        }
        &:last-child {
          background: #c2efc1;
          color: #5ab957;
        }
        .box_tag {
          width: 80upx;
          height: 30upx;
          background: #ffffff;
          border-radius: 10upx;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 18upx;
          font-weight: 400;
          margin-right: 10upx;
        }
        text {
          font-size: 20upx;
          font-weight: 400;
          &:not(:last-child) {
            margin-right: 15upx;
          }
        }
      }
    }

    .flight_content {
      display: flex;
      justify-content: space-between;
      padding: 0 20upx 20upx;
    }
    .left_flight,
    .right_flight {
      display: flex;
      flex-direction: column;
      width: 350upx;
      margin-bottom: 140upx;
    }
    .flight_box {
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 12upx 18upx rgba(0, 0, 0, 0.04);
      padding: 28upx 16upx 16upx;
      display: inline-flex;
      flex-direction: column;
      height: 157upx;
      // width: 42%;
      margin-bottom: 4upx;
      position: relative;
      border: 2upx solid transparent;
      overflow: hidden;
      &:first-child {
        border-radius: 20upx 20upx 0 0;
      }

      &.toActive {
        border: 2upx solid rgba(0, 112, 226, 1);
        &::before {
          content: "已选去程";
          position: absolute;
          top: 0;
          left: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 4upx 16upx 4upx 10upx;
          border-radius: 0 0 20upx 0;
          font-size: 16upx;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          background: rgba(0, 112, 226, 1);
        }
      }
      &.fromActive {
        border: 2upx solid rgba(133, 205, 131, 1);
        &::before {
          content: "已选返程";
          position: absolute;
          top: 0;
          left: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 4upx 16upx 4upx 10upx;
          border-radius: 0 0 20upx 0;
          font-size: 16upx;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          background: rgba(133, 205, 131, 1);
        }
      }
      .box_top {
        display: flex;
        align-items: flex-start;
        margin-bottom: 18upx;
        .top_time {
          .time {
            font-size: 34upx;
            font-weight: bold;
            color: rgba(42, 42, 42, 1);
            margin-bottom: 4upx;
          }
          .address {
            font-size: 22upx;
            font-weight: 400;
            color: rgba(42, 42, 42, 1);
          }
        }
        .flight_line {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          font-size: 22upx;
          font-weight: 400;
          color: rgba(175, 185, 196, 1);
          margin: 0 28upx;
          .line_icon {
            background: url(@/static/ticket_path.png) no-repeat center center;
            background-size: contain;
            width: 80upx;
            height: 14upx;
          }
        }
      }
      .total_price_message {
        font-size: 10px;
        font-weight: 400;
        color: rgba(175, 185, 196, 1);
        text-align: right;
        margin-bottom: 6upx;
        height: 28upx;
      }
      .flight_bottom {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        .airlines {
          font-size: 20upx;
          font-weight: 400;
          color: rgba(175, 185, 196, 1);
          display: inline-flex;
          align-items: center;
          .airlines_icon {
            width: 20upx;
            height: 14upx;
            object-fit: contain;
            margin-right: 12upx;
          }
        }
        .price {
          display: inline-flex;
          align-items: baseline;
          font-size: 36upx;
          font-weight: bold;
          color: rgba(255, 0, 0, 1);
          .price_mini {
            font-size: 22upx;
            margin: 0 3upx;
          }
        }
        .not_price {
          font-size: 38rpx;
          font-weight: bold;
          color: #ff0000;
        }
      }
    }

    .flight_skeleton {
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 12upx 18upx rgba(0, 0, 0, 0.04);
      display: inline-flex;
      flex-direction: column;
      margin-bottom: 4upx;
      height: 226upx;
      padding: 28upx 16upx 16upx;
      box-sizing: border-box;
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
      .top {
        display: flex;
        flex-direction: column;
        text {
          width: 80%;
          height: 44upx;
          background: #e5e9f2;
          margin-bottom: 10upx;
          &:last-child {
            height: 33upx;
          }
        }
      }
      > text {
        margin-top: auto;
        width: 95%;
        height: 44upx;
        background: #e5e9f2;
      }
    }

    .no_data {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 20upx;
      font-size: 28upx;
      font-weight: 400;
      color: rgba(175, 185, 196, 1);
      margin-top: 30upx;
      text {
        flex-shrink: 0;
        margin: 0 10upx;
      }
      &::after,
      &::before {
        content: "";
        display: block;
        border-bottom: 2upx dashed #d9e1ea;
        flex: 1;
      }
    }
  }

  .filter {
    position: fixed;
    width: calc(100% - 40upx);
    bottom: calc(156upx + var(--status-bar-height));
    left: 20upx;
    height: 80upx;
    border-radius: 50upx;
    box-shadow: 0 0 12upx rgba(0, 0, 0, 0.16);
    background: rgba(255, 255, 255, 1);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .bottom_bar {
    background: rgba(255, 255, 255, 1);
    height: 100upx;
    width: calc(100% - 60upx);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24upx 20upx var(--status-bar-height) 40upx;
    border-top: 2upx solid rgba(229, 229, 229, 1);

    .left_message {
      .price_box {
        font-size: 48upx;
        font-weight: bold;
        color: rgba(0, 112, 226, 1);
        text {
          font-size: 28upx;
          margin-right: 6upx;
        }
      }
      .not_pass_message {
        font-size: 20upx;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
      }
    }

    .right_btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 260upx;
      height: 90upx;
      background: linear-gradient(
        90deg,
        rgba(0, 112, 226, 1) 0%,
        rgba(86, 197, 255, 1) 100%
      );
      box-shadow: 0 6upx 12upx rgba(0, 112, 226, 0.3);
      font-size: 32upx;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      letter-spacing: 10upx;
      border-radius: 80upx;
      margin: 0;
      opacity: 1;
      &.is_false {
        opacity: 0.4;
      }
    }
  }
}
</style>
