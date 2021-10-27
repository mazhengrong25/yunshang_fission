<!--
 * @Description: 火车票查询 
 * @Author: mzr
 * @Date: 2021-07-27 10:44:51
 * @LastEditTime: 2021-10-15 16:34:00
 * @LastEditors: mzr
-->
<template>
  <view class="train_inquery">
    <yun-header
      :statusHeight="iStatusBarHeight"
      :headerAddress="pageHeaderData"
    ></yun-header>

    <!-- 日历 -->
    <view class="train_header">
      <scroll-view scroll-x="true" class="train_time_list" :scroll-into-view="timeIndex">
        <blticket_priceock v-for="(item, index) in ticketTimeList" :key="index">
          <view
            :id="item.id"
            :class="[
              'train_time_btn',
              { active: item.date === activeTimeNumber },
              { is_before: !item.status || !item.is_searchType },
            ]"
            @click="clickBtn(item, item.status,item.is_searchType)"
          >
            <view class="time_day">{{ item.day }}</view>
            <view class="time_number">{{ item.number }}</view>
          </view>
        </blticket_priceock>
      </scroll-view>
      <view class="calendar_btn" @click="backCalendar()">
        <image
          class="calendar_btn_icon"
          src="@/static/flight_time.png"
          mode="contain"
        />日历
      </view>
    </view>

    <scroll-view
      :enable-back-to-top="true"
      :scroll-y="true"
      class="train_content"
      lower-threshold="100"
    >
      <!-- 正常车次 -->
      <view
        class="train_list"
        v-for="(item, index) in saleList"
        :key="index"
        @click="jumpTrainInfo(item)"
      >
        <view class="train_top">
          <view class="item_left">
            <view class="item_left_section">
              <view class="section_time">{{ item.train.departure }}</view>
              <view class="section_where">{{ item.station.departure_name }}</view>
            </view>
            <view class="item_left_join">
              <view class="left_join_time">
                {{
                  `${Math.floor(Number(item.train.run_minute) / 60)}h${Math.floor(
                    Number(item.train.run_minute) % 60
                  )}m`
                }}
              </view>
              <image class="left_join_img" src="@/static/train_path.png" mode="contain" />
              <view class="left_join_time">{{ item.train.code }}</view>
            </view>
            <view class="item_left_section">
              <view class="section_time">{{ item.train.arrive }}</view>
              <view class="section_where">{{ item.station.arrive_name }}</view>
            </view>
          </view>
          <view class="item_right">
            <span>&yen;</span>
            <view class="right_character">{{ Math.min(...getPriceNumber(item.seat)) }}</view>

          </view>
        </view>
        <view class="train_bottom">
          <view v-if="seatStatus(item.seat)">
            <view
              class="train_bottom_item"
              :style="{ display: ticketStatus && pitem.number < 1 ? 'none' : '' }"
              v-for="(pitem, pindex) in item.seat"
              :key="pindex"
            >
              <view
                class="train_seat_title"
                :style="{ color: pitem.number < 1 ? '#C5C5C5' : '' }"
                >{{ pitem.name }}:</view
              >
              <view
                class="train_seat_value"
                :style="{
                  color:
                    pitem.number <= 15 && pitem.number > 0
                      ? '#FB9826'
                      : pitem.number < 1
                      ? '#C5C5C5'
                      : '',
                }"
              >
                {{ pitem.number < 1 ? "无" : pitem.number > 15 ? "有" : pitem.number }}
              </view>
            </view>
          </view>
          <view v-else class="train_bottom_notify"
            >暂无余票，请选择其他车次或稍后再试</view
          >
        </view>
      </view>

      <!-- 折叠栏 -->
      <view
        :class="['train_fold', { active: folderStatus }]"
        v-if="trainList.length > 1 && noSaleList.length > 1"
      >
        <span>{{
          folderStatus
            ? `以下为${noSaleList.length}条暂停发售/未开售车次`
            : `已为您折叠${noSaleList.length}条暂停发售车次`
        }}</span>
        <view
          class="train_action"
          :style="{ display: folderStatus === false ? '' : 'none' }"
          @click="openFolder()"
          >查看</view
        >
      </view>

      <!-- 未开售车次 -->
      <view
        class="train_list"
        v-for="(item, index) in folderStatus ? noSaleList : []"
        :key="index"
      >
        <view class="train_top">
          <view class="item_left">
            <view class="item_left_section">
              <view class="section_time">{{ item.train.departure }}</view>
              <view class="section_where">{{ item.station.departure_name }}</view>
            </view>
            <view class="item_left_join">
              <view class="left_join_time">
                {{
                  `${Math.floor(Number(item.train.run_minute) / 60)}h${Math.floor(
                    Number(item.train.run_minute) % 60
                  )}m`
                }}
              </view>
              <image class="left_join_img" src="@/static/train_path.png" mode="contain" />
              <view class="left_join_time">{{ item.train.code }}</view>
            </view>
            <view class="item_left_section">
              <view class="section_time">{{ item.train.arrive }}</view>
              <view class="section_where">{{ item.station.arrive_name }}</view>
            </view>
          </view>
          <view class="item_right">
            <span>&yen;</span>
            <view class="right_character">*</view>
          </view>
        </view>
        <view class="train_bottom">
          <view class="train_bottom_notify">{{ item.train.note }}</view>
        </view>
      </view>

      <!-- 骨架屏 -->
      <view
        class="flight_skeleton"
        v-for="i in trainList.length < 1 ? skeletonNumber : 0"
        :key="i"
      >
        <view class="top">
          <text></text>
          <text></text>
        </view>
        <text></text>
      </view>
    </scroll-view>

    <!-- 筛选 -->
    <view class="train_inquery_bottom">
      <flight-filter
        ref="flightFilter"
        @openFilter="openFilter"
        @filterType="listFilter"
      ></flight-filter>
    </view>

    <!-- 筛选弹窗 -->
    <filter-Dialog
      ref="filterDialog"
      :trainType="trainTypeList"
      :departureStation="departureStationList"
      :arriveStation="arriveStationList"
      @trainFilterData="trainFilter"
    ></filter-Dialog>
  </view>
</template>

<script>
import train from "@/api/trainInquiry.js";
import flightFilter from "@/components/flight_filter.vue"; // 车次筛选
import filterDialog from "@/components/train_filter_dialog.vue"; // 筛选弹窗

export default {
  components: {
    flightFilter,
    filterDialog,
  },
  data() {
    return {
      iStatusBarHeight: 0, // 导航栏高度
      pageHeaderData: {}, // 导航栏名称
      folderStatus: false, // 折叠栏默认状态

      skeletonNumber: 5,
      trainList: [],
      saleList: [], // 正常开售
      noSaleList: [], // 未开售

      trainTypeList: ["不限"], // 车型
      departureStationList: ["不限"], // 出发车站
      arriveStationList: ["不限"], // 到达车站

      ticketStatus: false, // 有无票

      trainData: {}, // 首页传参
      ticketTimeList: [],
      timeIndex: null,
      activeTimeNumber: "",

      checkboxStatus: false, // 首页传参
      checkboxStatusIndex: null, //
    };
  },
  methods: {
    // 打开折叠栏
    openFolder() {
      this.folderStatus = true;
    },

    // 跳转到选择坐席
    jumpTrainInfo(val) {
      uni.navigateTo({
        url:
          "/pages/trainInfo/trainInfo?trainData=" +
          JSON.stringify(this.trainData) +
          "&code=" +
          val.train.code,
      });
    },

    // 获取车次信息
    getTrainData() {
      let data = {
        departure: this.trainData.to.city_name,
        arrive: this.trainData.from.city_name,
        ticket: "ADT",
        departure_date: this.trainData.toTime.date,
      };
      train.getTrainNumber(data).then((res) => {
        if (res.errorcode === 10000) {
          this.trainList = res.data;
          this.trainList.forEach((item) => {
            let newSeat = [];
            for (const key in item.seat) {
              if (item.seat[key].number >= 0) {
                newSeat.push(item.seat[key]);
              }
            }

            item.seat = newSeat;

            if (item.is_reserve) {
              this.saleList.push(item);
            }
            if (!item.is_reserve) {
              this.noSaleList.push(item);
            }
          });
          this.filterList();
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
            duration: 3000,
          });
        }
      });
    },

    // 获取车票价格
    getPriceNumber(val) {
      
      // let price = 0;
      // price = val[0].price;
      let price = [];
      
      // for (let i = 0; i < val.length; i++) {
      //   if (Number(val[i].number) !== 0) {
      //     price = val[i].price;
      //     break;
      //   }
      // }
      val.forEach((item) => {
        price.push(item.price)
      })
      return price;
    },

    // 判断是否有余票
    seatStatus(val) {
      let notTicket = 0;
      for (let i = 0; i < val.length; i++) {
        if (Number(val[i].number) === 0) {
          notTicket += 1;
        }
      }

      return notTicket !== val.length;
    },

    // 车次信息筛选  val 只看有票 e 条件筛选列表
    trainFilter(e, val) {
      // 只看有票
      this.ticketStatus = val;

      // 清空筛选
      if (e.length < 1) {
        this.saleList = this.trainList;
        return false;
      }

      // 车型
      if (e[0]) {
        if (e[0] === "不限") {
          this.saleList = this.trainList;
        } else {
          this.saleList = [];
          this.trainList.forEach((item) => {
            if (item.train.type === e[0].slice(0, 1)) {
              this.saleList.push(item);
            }
          });
        }
      }

      // 出发时段
      if (e[1]) {
        if (e[1] === "不限") {
          this.saleList = this.trainList;
        } else {
          let newData = [];
          this.trainList.forEach((item) => {
            let thisDate =
              this.$moment().format("YYYY-MM-DD") + " " + item.train.departure; // 拿到当前列表时间
            // 当前时间 比较  其他规定两个时刻
            if (e[1] === "0-6点") {
              if (
                this.$moment(thisDate).isBetween(
                  this.$moment().format("YYYY-MM-DD") + " 00:00",
                  this.$moment().format("YYYY-MM-DD") + " 06:00"
                )
              ) {
                newData.push(item);
              }
            }
            if (e[1] === "6-12点") {
              if (
                this.$moment(thisDate).isBetween(
                  this.$moment().format("YYYY-MM-DD") + " 06:00",
                  this.$moment().format("YYYY-MM-DD") + " 12:00"
                )
              ) {
                newData.push(item);
              }
            }
            if (e[1] === "12-18点") {
              if (
                this.$moment(thisDate).isBetween(
                  this.$moment().format("YYYY-MM-DD") + " 12:00",
                  this.$moment().format("YYYY-MM-DD") + " 18:00"
                )
              ) {
                newData.push(item);
              }
            }
            if (e[1] === "18-24点") {
              if (
                this.$moment(thisDate).isBetween(
                  this.$moment().format("YYYY-MM-DD") + " 18:00",
                  this.$moment().format("YYYY-MM-DD") + " 24:00"
                )
              ) {
                newData.push(item);
              }
            }
          });

          this.saleList = newData;
        }
      }

      // 到达时段
      if (e[2]) {
        if (e[2] === "不限") {
          this.saleList = this.trainList;
        } else {
          let newData = [];
          this.trainList.forEach((item) => {
            let thisDate = this.$moment().format("YYYY-MM-DD") + " " + item.train.arrive; // 拿到当前列表时间
            if (e[2] === "0-6点") {
              if (
                this.$moment(thisDate).isBetween(
                  this.$moment().format("YYYY-MM-DD") + " 00:00",
                  this.$moment().format("YYYY-MM-DD") + " 06:00"
                )
              ) {
                newData.push(item);
              }
            }
            if (e[2] === "6-12点") {
              if (
                this.$moment(thisDate).isBetween(
                  this.$moment().format("YYYY-MM-DD") + " 06:00",
                  this.$moment().format("YYYY-MM-DD") + " 12:00"
                )
              ) {
                newData.push(item);
              }
            }
            if (e[2] === "12-18点") {
              if (
                this.$moment(thisDate).isBetween(
                  this.$moment().format("YYYY-MM-DD") + " 12:00",
                  this.$moment().format("YYYY-MM-DD") + " 18:00"
                )
              ) {
                newData.push(item);
              }
            }
            if (e[2] === "18-24点") {
              if (
                this.$moment(thisDate).isBetween(
                  this.$moment().format("YYYY-MM-DD") + " 18:00",
                  this.$moment().format("YYYY-MM-DD") + " 24:00"
                )
              ) {
                newData.push(item);
              }
            }
          });

          this.saleList = newData;
        }
      }

      // 出发车站
      if (e[3]) {
        if (e[3] === "不限") {
          this.saleList = this.trainList;
        } else {
          this.saleList = [];
          this.trainList.forEach((item) => {
            if (item.station.departure_name === e[3]) {
              this.saleList.push(item);
            }
          });
        }
      }
      // 到达车站
      if (e[4]) {
        if (e[4] === "不限") {
          this.saleList = this.trainList;
        } else {
          this.saleList = [];
          this.trainList.forEach((item) => {
            if (item.station.arrive_name === e[4]) {
              this.saleList.push(item);
            }
          });
        }
      }
      // 是否始发
      if (e[5]) {
        if (e[5] === "不限") {
          this.saleList = this.trainList;
        } else {
          let newData = [];
          this.trainList.forEach((item) => {
            if (e[5] === "始发") {
              if (item.station.departure_name === item.station.start) {
                newData.push(item);
              }
            }
            if (e[5] === "过路") {
              if (item.station.departure_name !== item.station.start) {
                newData.push(item);
              }
            }
          });
          this.saleList = newData;
        }
      }
    },

    // 动车高铁筛选条件
    filterList() {
      this.trainList.forEach((item) => {
        this.trainTypeList.push(item.train.type + "-" + item.train.type_name);
        this.departureStationList.push(item.station.departure_name);
        this.arriveStationList.push(item.station.arrive_name);
      });
      this.trainTypeList = [...new Set(this.trainTypeList)];
      this.departureStationList = [...new Set(this.departureStationList)];
      this.arriveStationList = [...new Set(this.arriveStationList)];

      this.checkboxStatusIndex = null;
      if (this.checkboxStatus) {
        for (let i = 0; i < this.trainTypeList.length; i++) {
          if (this.trainTypeList[i][0] === "G") {
            this.checkboxStatusIndex = i;
            break;
          }
        }
        if (this.checkboxStatusIndex !== null) {
          this.trainFilter(
            [this.trainTypeList[this.checkboxStatusIndex]],
            this.checkboxStatusIndex
          );
        }
      }
    },

    // 打开筛选
    openFilter() {
      this.$refs.filterDialog.openFilterDialog(this.checkboxStatusIndex);
    },

    // 价格排序
    priceSort(p) {
      return (m, n) => {
        var a = m.seat[0][p];
        var b = n.seat[0][p];
        return a - b;
      };
    },

    // 列表筛选
    listFilter(val) {
      let oldTrain = JSON.parse(JSON.stringify(this.trainList));
      if (val === "price") {
        this.saleList = oldTrain.sort(this.priceSort("price"));
      } else if (val === "time") {
        this.saleList = oldTrain;
      }
    },

    // 时间列表处理
    getDateList() {
      this.ticketTimeList = [];
      let day = this.$moment(this.trainData.toTime.date)
        .subtract(7, "days")
        .format("YYYY-MM-DD");
      let dayNumber = 0;
      for (let index = 0; index < 14; index++) {
        this.ticketTimeList.push({
          id: "id_" + index,
          day: this.$moment(day)
            .add(dayNumber, "d")
            .calendar(null, {
              lastDay: "昨天",
              sameDay: "今天",
              nextDay: "明天",
              nextWeek: "ddd",
              lastWeek: "ddd",
              sameElse: "ddd",
            }),
          date: this.$moment(this.trainData.toTime.date)
            .subtract(7, "days")
            .add(dayNumber, "d")
            .format("YYYY-MM-DD"),
          number:
            this.$moment(day)
              .add(dayNumber, "d")
              .format("DD") === "01"
              ? this.$moment(day)
                  .add(dayNumber, "d")
                  .format("MM") +
                "-" +
                this.$moment(day)
                  .add(dayNumber, "d")
                  .format("DD")
              : this.$moment(day)
                  .add(dayNumber, "d")
                  .format("DD"),
          status:
            this.$moment(day)
              .add(dayNumber, "d")
              .format("YYYY-MM-DD") === this.$moment(+this.$moment()).format("YYYY-MM-DD")
              ? true
              : +this.$moment(day).add(dayNumber, "d") > +this.$moment(),
          is_searchType: this.$moment(
            this.$moment(this.trainData.toTime.date)
              .subtract(7, "days")
              .add(dayNumber, "d")
          ).isBefore(this.$moment().add(14, "d")),
        });
        dayNumber += 1;
      }
      this.$nextTick(() => {
        this.timeIndex = this.ticketTimeList[7].id;
      });

      this.timeIndex = "";
      this.activeTimeNumber = this.trainData.toTime.date;
    },

    // 返回日历选择
    backCalendar() {
      let data = {
        type: false,
        data: this.trainData.toTime.date,
      };
      uni.navigateTo({
        url: "/pages/dateSelect/dateSelect?ticketType=" + JSON.stringify(data) + '&searchType=1',
      });
    },

    // 选择日期
    clickBtn(val, status, otherStatus) {
        console.log(val, status ,otherStatus)
      if (status && otherStatus) {
        this.trainData.toTime.date = val.date;
        this.skeletonNumber = 6;
        this.ticketList = [];
        console.log(val);
        this.activeTimeNumber = val.date;
        this.getTrainData();
        this.getDateList();
      }
    },
  },
  onShow() {
    // 获取时间日期
    if (uni.getStorageSync("time")) {
      let timeData = JSON.parse(uni.getStorageSync("time"));
      this.trainData.toTime.date = timeData.date;
      uni.removeStorageSync("time");

      this.getTrainData();
      this.getDateList();
    }
  },
  onLoad(data) {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;

    this.trainData = JSON.parse(data.trainData);
    console.log("车次查询trainData", this.trainData);
    this.pageHeaderData = JSON.parse(JSON.stringify(this.trainData));

    this.getTrainData();
    this.getDateList();
    // 筛选 动车高铁
    this.checkboxStatus = data.checkboxStatus === "true" ? true : false;
  },
};
</script>

<style scoped lang="less">
.train_inquery {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .train_header {
    height: 144upx;
    background: rgba(0, 112, 226, 1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 20upx;
    .train_time_list {
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

      .train_time_btn {
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
  .train_content {
    flex: 1;
    background: #f2f4f6;
    overflow-y: auto;
    .train_list {
      background-color: #fff;
      box-shadow: 0px 12upx 18upx rgba(0, 0, 0, 0.04);
      border-radius: 20upx;
      padding: 26upx 20upx;
      margin: 20upx;
      .train_top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 30upx;
        .item_left {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          .item_left_section {
            margin-right: 56upx;
            .section_time {
              font-size: 36upx;
              font-weight: bold;
              color: #2a2a2a;
            }
            .section_where {
              font-size: 22upx;
              font-weight: 400;
              color: #333333;
              margin-top: 8upx;
            }
          }
          .item_left_join {
            position: relative;
            margin-right: 56upx;
            width: 113upx;
            .left_join_time {
              font-size: 22upx;
              font-weight: 400;
              color: #afb9c4;
              margin-bottom: 18upx;
              text-align: center;
            }
            .left_join_img {
              width: 112upx;
              height: 20upx;
              position: absolute;
              top: 24upx;
            }
          }
        }
        .item_right {
          display: inline-flex;
          align-items: baseline;
          justify-content: center;
          color: #ff0000;
          font-weight: bold;
          span {
            font-size: 24upx;
          }
          .right_character {
            font-size: 42upx;
            margin-left: 6upx;
          }
        }
      }
      .train_bottom {
        .train_bottom_notify {
          font-size: 22upx;
          font-weight: 400;
          color: rgba(251, 152, 38, 0.7);
        }
        .train_bottom_item {
          display: inline-flex;
          font-size: 22upx;
          font-weight: 400;
          color: #666666;
          .train_seat_value {
            margin-left: 10upx;
          }
          &:not(:last-child) {
            margin-right: 48upx;
          }
        }
      }
    }
    .train_fold {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      box-shadow: 0px 12upx 18upx rgba(0, 0, 0, 0.04);
      border-radius: 20upx;
      margin: 20upx;
      padding: 26upx 24upx;
      &.active {
        background-color: transparent;
        box-shadow: unset;
      }
      span {
        font-size: 28upx;
        font-weight: 400;
        color: #333333;
      }
      .train_action {
        font-size: 28upx;
        font-weight: 400;
        color: #0070e2;
        margin-left: 54upx;
        &::after {
          content: "";
          background: url("@/static/train_find.png") no-repeat center center;
          width: 20upx;
          height: 10upx;
          background-size: contain;
          display: inline-flex;
          margin-left: 12upx;
          vertical-align: middle;
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
  }
  .train_inquery_bottom {
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
