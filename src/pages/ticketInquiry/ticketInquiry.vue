<!--
 * @Description: 机票查询 - 单程
 * @Author: wish.WuJunLong
 * @Date: 2020-06-18 17:56:32
 * @LastEditTime: 2020-09-15 17:52:37
 * @LastEditors: wish.WuJunLong
--> 

<template>
  <view class="ticket_inquiry">
    <yun-header :statusHeight="iStatusBarHeight" :headerAddress="ticketAddress"></yun-header>

    <view class="ticket_header" v-if="!showDefaultType">
      <scroll-view scroll-x="true" class="ticket_time_list" :scroll-into-view="timeIndex">
        <block v-for="(item, index) in ticketTimeList" :key="index">
          <view
            :id="item.id"
            :class="['ticket_time_btn',{'active': item.date === activeTimeNumber},{'is_before': !item.status}]"
            @click="clickBtn(item,item.status)"
          >
            <view class="time_day">{{item.day}}</view>
            <view class="time_number">{{item.number}}</view>
          </view>
        </block>
      </scroll-view>
      <view class="calendar_btn" @click="backCalendar">
        <image class="calendar_btn_icon" src="@/static/flight_time.png" mode="contain" />日历
      </view>
    </view>

    <scroll-view
      :enable-back-to-top="true"
      :scroll-y="true"
      class="ticket_content"
      lower-threshold="100"
    >
      <view
        class="ticket_list"
        v-for="(item, index) in ticketList"
        :key="index"
        @click="jumpFlightInfo(item)"
      >
        <view class="ticket_left">
          <view class="ticket_message">
            <view class="ticket_start ticket_time">
              <view class="ticket_date">{{$dateTool(item.segments[0].depTime,'HH:mm')}}</view>
              <view
                class="ticket_address"
              >{{item.segments[0].depAirport_CN.air_port_name}}{{item.segments[0].depTerminal !== '--'? item.segments[0].depTerminal: ''}}</view>
            </view>
            <view class="ticket_arrow">
              <view>{{Number(item.segments[0].duration.split(":")[0])}}h{{Number(item.segments[0].duration.split(":")[1])}}m</view>
              <view class="ticket_type" v-if="ticketType !== '国内'">{{item.voyageType}}</view>
            </view>
            <view class="ticket_end ticket_time">
              <view class="ticket_date">
                {{$dateTool(item.segments[0].arrTime,'HH:mm')}}
                <text class="more_time" v-if="item.moreTime">+{{item.moreTime}}天</text>
              </view>
              <view
                class="ticket_address"
              >{{item.segments[0].arrAirport_CN.air_port_name}}{{item.segments[0].arrTerminal !== '--' ?item.segments[0].arrTerminal : ''}}</view>
            </view>
          </view>

          <view class="ticket_details">
            <image
              class="ticket_details_icon"
              :src="'https://fxxcx.ystrip.cn/'+ item.segments[0].image"
              mode="contain"
            />
            {{item.segments[0].airline_CN}}{{item.segments[0].flightNumber}} | {{item.segments[0].aircraftCode}}
          </view>
        </view>

        <view class="ticket_right">
          <view class="ticket_price">
            <text class="currency" v-if="item.available_cabin > 0 && item.min_price !== 0">&yen;</text>
            <view v-if="item.available_cabin > 0 && item.min_price !== 0">{{item.min_price}}</view>
            <view class="sold_out" v-if="item.min_price === 0">售罄</view>
            <!-- <view v-else class="not_price"></view> -->
          </view>
          <view class="overseas" v-if="item.overseas">(境外&yen;{{item.overseas}})</view>
          <view class="ticket_cabin">{{item.ItineraryInfos['经济舱'][0].cabinInfo.cabinDesc}}</view>
          <view v-if="item.reward" class="ticket_reward">奖励金 &yen;{{item.reward}}</view>
        </view>
      </view>

      <!-- 骨架屏 -->
      <view class="flight_skeleton" v-for="i in ticketList.length < 1? skeletonNumber :0" :key="i">
        <view class="top">
          <text></text>
          <text></text>
        </view>
        <text></text>
      </view>

      <default-page v-if="showDefault" @returnBtn="getTicketData()" :defaultType="showDefaultType"></default-page>

      <!-- <view class="next_data" v-if="nextGetData">
        <view class="next_text">加载中</view>
      </view>-->

      <view class="no_data" v-if="dataListApplyType">
        <text>到底啦</text>
      </view>
    </scroll-view>

    <view class="footer_box" v-if="!showDefault">
      <flight-filter @openFilter="openFilter" @filterType="listFilter"></flight-filter>
    </view>

    <flight-filter-dialog
      ref="filterDialog"
      @ticketFilterData="ticketFilter"
      :airlines="airlineList"
    ></flight-filter-dialog>
  </view>
</template>

<script>
import moment from "moment";
moment.locale("zh-cn");
import ticket from "@/api/ticketInquiry.js";
import flightFilter from "@/components/flight_filter.vue"; // 航班筛选
import flightFilterDialog from "@/components/flight_filter_dialog.vue"; // 航班筛选弹窗
export default {
  components: {
    flightFilter,
    flightFilterDialog,
  },
  data() {
    return {
      iStatusBarHeight: 0, // 导航栏高度
      ticketType: "国内", // 机票查询默认值
      ticketAddress: {
        // 导航栏地址
        to: "",
        from: "",
        departure: "", // 起飞机场三字码
        arrival: "",
      },

      timeIndex: null, // 日期选择下标

      nextGetData: false, // 下拉加载动画

      airMessage: {}, // 首页传参

      skeletonNumber: 6, // 骨架屏数量
      showDefault: false, // 报错页面
      showDefaultType: "", // 报错类型
      // showReturnBtn: false,

      file_key: "", // av key

      ticketTimeList: [],

      pageNumber: 1, // 分页页面
      dataListApplyType: false, // 是否还有新page

      activeTimeNumber: "04-18", // 日期选择
      ticketList: [],
      ticketListData: [
        {
          startTime: "",
          startAddress: "",
          voyageTime: "",
          endTime: "",
          endAddress: "",
          price: "",
          cabin: "",
          reward: "",
          airline: "",
          model: "",
        },
      ],

      filterList: [], // 过滤数组

      airlineList: ["不限"], // 航司列表
    };
  },
  methods: {
    // 获取航班信息
    getTicketData() {
      this.airMessage["only_segment"] = 1;
      ticket.getTicket(this.airMessage).then((res) => {
        console.log(res);
        if (res.errorcode === 10000) {
          this.showDefaultType = "";
          this.file_key = res.data.IBE.file_key;
          this.showDefault = false;
          this.oldTicketList = res.data.IBE.list
          this.ticketList = JSON.parse(JSON.stringify(this.oldTicketList));
          this.dataListApplyType = true;
          console.log(this.ticketList);
          if (this.ticketList.length < 1) {
            this.showDefault = true;
            this.dataListApplyType = false;
            this.skeletonNumber = 0;
          }
          this.nextGetData = false;
        } else {
          this.ticketList = [];
          this.showDefault = true;
          this.showDefaultType = "404";
          this.skeletonNumber = 0;
          this.$forceUpdate();
        }
      });
    },

    // 选择日期
    clickBtn(val, status) {
      if (status) {
        this.skeletonNumber = 6;
        this.ticketList = [];
        console.log(val);
        this.activeTimeNumber = val.date;
        this.airMessage = {
          departure: this.ticketData.to.city_code, // 起飞机场三字码
          arrival: this.ticketData.from.city_code, // 到达机场三字码
          departureTime: val.date, // 起飞时间
          airline: "", // 航司二字码
        };
        this.file_key = "";
        this.getTicketData();
      }
    },
    // 时间列表处理
    getDateList() {
      this.ticketTimeList = [];
      let day = moment(this.ticketData.toTime.date)
        .subtract(7, "days")
        .format("YYYY-MM-DD");
      let dayNumber = 0;
      for (let index = 0; index < 14; index++) {
        this.ticketTimeList.push({
          id: "id_" + index,
          day: moment(day).add(dayNumber, "d").calendar(null, {
            lastDay: "昨天",
            sameDay: "今天",
            nextDay: "明天",
            nextWeek: "ddd",
            lastWeek: "ddd",
            sameElse: "ddd",
          }),
          date: moment(this.ticketData.toTime.date)
            .subtract(7, "days")
            .add(dayNumber, "d")
            .format("YYYY-MM-DD"),
          number:
            moment(day).add(dayNumber, "d").format("DD") === "01"
              ? moment(day).add(dayNumber, "d").format("MM") +
                "-" +
                moment(day).add(dayNumber, "d").format("DD")
              : moment(day).add(dayNumber, "d").format("DD"),
          status: +moment() < +moment(day).add(dayNumber, "d"),
        });
        dayNumber += 1;
      }
      this.$nextTick(() => {
        this.timeIndex = this.ticketTimeList[7].id;
      });

      this.timeIndex = "";
      this.activeTimeNumber = this.airMessage.departureTime;
    },

    // 返回日历选择
    backCalendar() {
      let data = {
        type: false,
        data: this.airMessage.departureTime,
      };
      uni.navigateTo({
        url: "/pages/dateSelect/dateSelect?ticketType=" + JSON.stringify(data),
      });
    },

    // 国内单程价格排序
    priceSort(p) {
      return (m, n) => {
        var a = m[p];
        var b = n[p];
        return a - b;
      };
    },
    // 国内单程时间排序
    timeSort(t) {
      return (m, n) => {
        var a = new Date(m.segments[0][t]).getTime();
        var b = new Date(n.segments[0][t]).getTime();
        return a - b;
      };
    },

    // 列表筛选
    listFilter(val) {
      console.log(val);
      if (val === "price") {
        this.ticketList.sort(this.priceSort("min_price"));
      } else if (val === "time") {
        this.ticketList.sort(this.timeSort("depTime"));
      }
    },

    // 时段筛选
    timeFilter(time, oldFilterList) {
      if (time === "不限") {
        this.ticketList = oldFilterList;
      }
      if (time.indexOf("上午") !== -1) {
        this.ticketList = oldFilterList.filter(
          (item) =>
            new Date(item.segments[0].depTime).getHours() >= 0 &&
            new Date(item.segments[0].depTime).getHours() < 12
        );
      }
      if (time.indexOf("中午") !== -1) {
        this.ticketList = oldFilterList.filter(
          (item) =>
            new Date(item.segments[0].depTime).getHours() >= 12 &&
            new Date(item.segments[0].depTime).getHours() < 14
        );
      }
      if (time.indexOf("下午") !== -1) {
        this.ticketList = oldFilterList.filter(
          (item) =>
            new Date(item.segments[0].depTime).getHours() >= 14 &&
            new Date(item.segments[0].depTime).getHours() < 18
        );
      }
      if (time.indexOf("晚上") !== -1) {
        this.ticketList = oldFilterList.filter(
          (item) =>
            new Date(item.segments[0].depTime).getHours() >= 18 &&
            new Date(item.segments[0].depTime).getHours() < 24
        );
      }
    },

    // 航司筛选
    airFilter(air, oldFilterList) {
      if (air === "不限") {
        return (this.ticketList = this.ticketList);
      }
      this.ticketList = oldFilterList.filter(
        (item) => item.segments[0].airline_CN === air
      );
    },

    // 航班信息筛选
    ticketFilter(val) {
      this.ticketList = JSON.parse(JSON.stringify(this.oldTicketList));
      if (val.length > 0) {
        if (val[0]) {
          this.timeFilter(val[0], this.oldTicketList);
        }
        if (!val[0] && val[1]) {
          this.airFilter(val[1], this.oldTicketList);
        }
        if (val[0] && val[1]) {
          this.airFilter(val[1], this.ticketList);
        }
        if (val[0] === "不限" && val[1] === "不限") {
          this.ticketList = JSON.parse(JSON.stringify(this.oldTicketList));
        }
      } else {
        this.ticketList = JSON.parse(JSON.stringify(this.oldTicketList));
      }
      if (val.length > 0 && this.ticketList.length < 1) {
        this.ticketList = JSON.parse(JSON.stringify(this.oldTicketList));
        uni.showToast({
          title: "暂无该筛选类别，请更换其他条件",
          duration: 2000,
          icon: "none",
          mask: true,
        });
        setTimeout(() => {
          this.$refs.filterDialog.openFilterDialog();
        }, 1000);
      }
    },

    // 打开筛选
    openFilter() {
      this.$refs.filterDialog.openFilterDialog();
      this.ticketList.forEach((item) => {
        this.airlineList.push(item.segments[0].airline_CN);
      });
      this.airlineList = [...new Set(this.airlineList)];
    },
    // 关闭弹出框
    closeFilterDialog() {
      this.$refs.filterDialog.closeFilterDialog();
    },

    // 跳转航程信息
    jumpFlightInfo(data) {
      console.log("跳转");
      if (data.min_price === 0) {
        return false;
      }
      uni.navigateTo({
        url:
          "/pages/flightInfo/flightInfo?airData=" +
          JSON.stringify(data) +
          "&fileKey=" +
          this.file_key +
          "&pageType=false",
      });
    },
  },
  onLoad(data) {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.ticketData = JSON.parse(data.data);
    console.log('单程查询数据',this.ticketData)
    // 组装数据
    this.ticketAddress = {
      to: this.ticketData.to.city_name,
      from: this.ticketData.from.city_name,
      departure:
        this.ticketData.to_type === "air"
          ? this.ticketData.to.air_port
          : this.ticketData.to.city_code, // 起飞机场三字码
      arrival:
        this.ticketData.from_type === "air"
          ? this.ticketData.from.air_port
          : this.ticketData.from.city_code, // 到达机场三字码
    };
    if(this.ticketData.to_type === "hot"){
      this.ticketAddress.to = this.ticketData.to.city_name === '上海'?  this.ticketData.to.city_name + this.ticketData.to.air_port_name: this.ticketData.to.city_name
      this.ticketAddress.departure = this.ticketData.to.city_name === '上海'? this.ticketData.to.air_port: this.ticketData.to.city_code
    }
    if(this.ticketData.from_type === "hot"){
      this.ticketAddress.from = this.ticketData.from.city_name === '上海'?  this.ticketData.from.city_name + this.ticketData.from.air_port_name: this.ticketData.from.city_name
      this.ticketAddress.arrival = this.ticketData.from.city_name === '上海'? this.ticketData.from.air_port: this.ticketData.from.city_code
    }
    this.airMessage = {
      departure:
        this.ticketData.to_type === "air"
          ? this.ticketData.to.air_port
          : this.ticketData.to.city_code, // 起飞机场三字码
      arrival:
        this.ticketData.from_type === "air"
          ? this.ticketData.from.air_port
          : this.ticketData.from.city_code, // 到达机场三字码
      departureTime: this.ticketData.toTime.date, // 起飞时间
      airline: "", // 航司二字码
    };

    if(this.ticketData.to_type === "hot"){
      this.airMessage.departure = this.ticketData.to.city_name === '上海'? this.ticketData.to.air_port: this.ticketData.to.city_code
    }
    if(this.ticketData.from_type === "hot"){
       this.airMessage.arrival = this.ticketData.from.city_name === '上海'? this.ticketData.from.air_port: this.ticketData.from.city_code
    }

    // 获取时间日期
    if (uni.getStorageSync("time")) {
      let timeData = JSON.parse(uni.getStorageSync("time"));
      this.airMessage.departureTime = timeData.date;
      this.ticketData.toTime.date = timeData.date;

      uni.removeStorageSync("time");
    }
    this.getTicketData();
    this.getDateList(); // 时间处理
  },
};
</script>

<style scoped lang="less">
.ticket_inquiry {
  display: flex;
  flex-direction: column;
  height: 100vh;
  .header_topbar {
    background: rgba(0, 112, 226, 1);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    position: relative;
    padding: 0 20upx 20upx;
    height: var(--status-bar-height);
    .go_back {
      position: absolute;
      left: 20upx;
      width: 40upx;
      height: 40upx;
    }
    .title {
      font-size: 36upx;
      font-weight: bold;
      letter-spacing: 8upx;
      color: rgba(255, 255, 255, 1);
      display: flex;
      align-items: center;
      .title_icon {
        width: 35upx;
        height: 8upx;
        margin: 0 28upx;
      }
    }
  }

  .header {
    width: 100%;
    height: 88upx;
    background: rgba(0, 112, 226, 1);
  }
  .ticket_header {
    height: 144upx;
    background: rgba(0, 112, 226, 1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 20upx;
    .ticket_time_list {
      display: flex;
      align-items: center;
      text-align: center;
      flex: 1;
      overflow-x: auto;
      width: 100%;
      height: 100%;
      padding-top: 18upx;
      white-space: nowrap;
      box-sizing: border-box;

      .ticket_time_btn {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 130upx;
        height: 104upx;
        background: rgba(30, 139, 249, 0.9);
        border-radius: 20upx;
        margin-right: 20upx;
        color: rgba(255, 255, 255, 1);
        &.active {
          background: rgba(255, 255, 255, 1);
          color: rgba(42, 42, 42, 1);
          .time_price {
            color: rgba(255, 0, 0, 1);
          }
        }
        &.is_before {
          opacity: 0.5;
        }
        .time_day {
          font-size: 18upx;
          font-weight: 400;
          letter-spacing: 5upx;
        }
        .time_number {
          font-size: 34upx;
          font-weight: bold;
          line-height: 40upx;
        }
        .time_price {
          font-size: 20upx;
          font-weight: 500;
        }
      }
    }
    .calendar_btn {
      width: 120upx;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 22upx;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      .calendar_btn_icon {
        width: 40upx;
        height: 40upx;
        margin-bottom: 6upx;
      }
    }
  }

  .ticket_content {
    background: rgba(242, 244, 246, 1);
    flex: 1;
    overflow-y: auto;
    box-sizing: border-box;
    .ticket_list {
      display: flex;
      justify-content: space-between;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 12upx 18upx rgba(0, 0, 0, 0.04);
      border-radius: 20upx;
      padding: 26upx 20upx;
      margin: 10upx 20upx;
      &:first-child {
        margin-top: 20upx;
      }

      .ticket_left {
        width: 60%;
        .ticket_message {
          display: flex;
          justify-content: space-between;
          margin-bottom: 34upx;
          .ticket_time {
            .ticket_date {
              font-size: 36upx;
              font-weight: bold;
              color: rgba(42, 42, 42, 1);
              margin-bottom: 6upx;
              position: relative;
              .more_time {
                position: absolute;
                font-size: 18upx;
                font-weight: 400;
                color: rgba(42, 42, 42, 1);
                top: 0;
                right: -1;
                width: 60upx;
              }
            }
            .ticket_address {
              font-size: 22upx;
              font-weight: 400;
              color: rgba(42, 42, 42, 1);
            }
          }
          .ticket_arrow {
            font-size: 22upx;
            font-weight: 400;
            color: rgba(175, 185, 196, 1);
            position: relative;
            padding-top: 10upx;
            .ticket_type {
              margin-top: 14upx;
            }

            &::before {
              content: "";
              position: absolute;
              background: url(@/static/ticket_path.png) no-repeat;
              background-size: contain;
              width: 113upx;
              height: 21upx;
              top: 32upx;
              left: -6upx;
            }
          }
        }

        .ticket_details {
          font-size: 20upx;
          font-weight: 400;
          color: rgba(175, 185, 196, 1);
          .ticket_details_icon {
            width: 22upx;
            height: 16upx;
            margin-right: 8upx;
          }
        }
      }

      .ticket_right {
        text-align: right;
        .ticket_price {
          font-size: 42upx;
          font-weight: bold;
          color: rgba(255, 0, 0, 1);
          margin-bottom: 2upx;
          display: flex;
          align-items: baseline;
          .currency {
            font-size: 24upx;
            margin-right: 6upx;
          }
        }
        .sold_out {
          color: rgba(255, 0, 0, 1);
          font-size: 48upx;
        }
        .not_price {
          height: 40upx;
          width: 120upx;
          background-color: #f1f3f5;
          display: inline-block;
          position: relative;
          overflow: hidden;
          &::before {
            width: 20upx;
            height: 200%;
            content: "";
            display: block;
            background-color: #fff;
            position: absolute;
            top: -50%;
            left: 60upx;
            transform: rotate(30deg);
            animation: skeleton 1.5s infinite;
          }
          @keyframes skeleton {
            from {
              left: -50upx;
            }
            to {
              left: 120%;
            }
          }
        }
        .overseas {
          font-size: 20upx;
          font-weight: 400;
          color: rgba(0, 112, 226, 1);
        }
        .ticket_cabin {
          font-size: 22upx;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          margin-bottom: 2upx;
        }
        .ticket_reward {
          background: rgba(255, 0, 0, 0.1);
          font-size: 18upx;
          font-weight: 400;
          color: rgba(255, 0, 0, 1);
          padding: 2upx 12upx;
          display: inline-flex;
          align-items: center;
        }
      }
    }

    .flight_skeleton {
      background: rgba(255, 255, 255, 1);
      display: flex;
      flex-direction: column;
      height: 200upx;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
      box-shadow: 0 12upx 18upx rgba(0, 0, 0, 0.04);
      border-radius: 20upx;
      padding: 26upx 20upx;
      margin: 10upx 20upx;
      &:first-child {
        margin-top: 20upx;
      }
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
        height: 22upx;
        background: #e5e9f2;
      }
    }

    .next_data {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 20upx;
      font-size: 28upx;
      font-weight: 400;
      color: rgba(175, 185, 196, 1);
      margin: 30upx 0;
    }

    .no_data {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 20upx;
      font-size: 28upx;
      font-weight: 400;
      color: rgba(175, 185, 196, 1);
      margin: 30upx 0;
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

  .footer_box {
    height: 100upx;
    width: 100vw;
    border-top: 2upx solid rgba(229, 229, 229, 1);
    background-color: #fff;
    padding-bottom: var(--status-bar-height);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
