<!--
 * @Description: 日期选择页面
 * @Author: wish.WuJunLong
 * @Date: 2020-08-10 17:46:05
 * @LastEditTime: 2020-10-16 14:56:25
 * @LastEditors: wish.WuJunLong
-->
<template>
  <view class="date_select">
    <yun-header
      :statusHeight="iStatusBarHeight"
      centerTitle="选择日期"
    ></yun-header>

    <view class="round_trip_tab" v-if="roundTimeStatus">
      <view
        :class="['date_checked', { active: roundTripStatus === 'start' }]"
        @click="checkedDate('start')"
      >
        <view class="checked_title">去程日期</view>
        <view class="checked_time">{{ roundData.toTime.date || "—" }}</view>
      </view>
      <view
        :class="['date_checked', { active: roundTripStatus === 'end' }]"
        @click="checkedDate('end')"
      >
        <view class="checked_title">返程日期</view>
        <view class="checked_time">{{ roundData.fromTime.date || "—" }}</view>
      </view>
    </view>

    <view class="date_header">
      <view class="hader_list" v-for="item in weekCn" :key="item">{{
        item
      }}</view>
    </view>

    <scroll-view
      :enable-back-to-top="true"
      :scroll-y="true"
      @scrolltolower="nextDate"
      class="date_main"
    >
      <view class="date_list" v-for="(item, index) in dateList" :key="index">
        <view class="list_title">{{ item.title }}</view>

        <view class="list_item">
          <view
            class="item_box not_day"
            v-for="(oitem, oindex) in item.type"
            :key="oindex"
          ></view>
          <view
            @click="checkedDayBtn(item.title, oitem)"
            :class="[
              'item_box',
              { active: oitem.active },
              { is_before: oitem.status === false },
              { checked: oitem.checked },
              { to: oitem.toChecked },
              { from: oitem.fromChecked },
              { round_status: oitem.roundStatus },
              roundTripStatus,
            ]"
            v-for="(oitem, oindex) in item.data"
            :key="oindex"
          >
            <text class="round_text text_to" v-if="oitem.toChecked">
              {{oitem.toChecked?'去程':''}}
            </text>
            <text class="round_text text_from" v-if="oitem.fromChecked">
              {{oitem.fromChecked?'返程':''}}
            </text>
            {{  oitem.active?'今天':oitem.day }}
            <text
              class="lunar lunar_day"
              v-if="oitem.lunar.lunarDay !== '初一'"
              >{{ oitem.lunar.lunarDay }}</text
            >
            <text class="lunar lunar_month" v-else>{{
              oitem.lunar.lunarMonth
            }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import moment from "moment";
moment.locale("zh-cn");
export default {
  data() {
    return {
      iStatusBarHeight: 0,
      timeStatus: "", // 日期选择状态 start起飞时间 end到达时间
      weekCn: ["日", "一", "二", "三", "四", "五", "六"], // 中国周列表
      currentDateTitle: "", // 当前年月
      dateList: [],
      nextIndex: 0, // 获取下多少个月的时间

      dateList: [], // 日期数据

      checkedDay: {}, // 选中日期

      ftromCheckedDay: {}, // 往返选中日期

      roundTripStatus: "",

      ticketData: {}, // 已选日期数据

      roundData: {}, // 往返日期数据
      roundTimeStatus: false, // 往返状态

      checkedRoundTime: false,

      checkedToTime: "", // 已选择出发日期
    };
  },
  methods: {
    // 日期列表处理
    getDateList() {
      const lunar = require("@tony801015/chinese-lunar");

      let currentDate = moment().format("YYYY年MM月"); // 当前月份
      let nextDate = moment().add(this.nextIndex, "M").format("YYYY年MM月"); // 下一月份
      let nextDateNumber = moment().add(this.nextIndex, "M").daysInMonth(); // 下一月份天数
      let nextLastDateWeek = moment()
        .add(this.nextIndex, "M")
        .startOf("month")
        .format("d"); // 下月1号星期
      let nextList = [];

      console.log(lunar("2020", "01", "09").getJson());

      for (let i = 0; i < nextDateNumber; i++) {
        nextList.push({
          day: i + 1,
          time: moment().add(this.nextIndex, "M").format("YYYY-MM"),
          date:
            moment().add(this.nextIndex, "M").format("YYYY-MM") +
            "-" +
            (i + 1 < 10 ? "0" + (i + 1) : i + 1),
          status:
            currentDate === nextDate
              ? i + 1 > Number(moment().format("D"))
              : true,
          active:
            currentDate === nextDate
              ? i + 1 === Number(moment().format("D"))
              : false,
          checked:
            moment().add(this.nextIndex, "M").format("YYYY-MM") +
              "-" +
              (i + 1 < 10 ? "0" + (i + 1) : i + 1) ===
            this.ticketData.data,
          toChecked: this.roundTimeStatus
            ? moment().add(this.nextIndex, "M").format("YYYY-MM") +
                "-" +
                (i + 1 < 10 ? "0" + (i + 1) : i + 1) ===
              this.roundData.toTime.date
            : false,
          fromChecked: this.roundTimeStatus
            ? moment().add(this.nextIndex, "M").format("YYYY-MM") +
                "-" +
                (i + 1 < 10 ? "0" + (i + 1) : i + 1) ===
              this.roundData.fromTime.date
            : false,

          lunar: lunar(
            String(moment().add(this.nextIndex, "M").format("YYYY")),
            String(moment().add(this.nextIndex, "M").format("MM")),
            String(i + 1 < 10 ? "0" + (i + 1) : i + 1)
          ).getJson(), // 阴历
        });
      }
      this.dateList.push({
        title: nextDate,
        type: Number(nextLastDateWeek),
        data: nextList,
      });
      this.nextIndex = this.nextIndex + 1;

      console.log(this.dateList);

      if (this.checkedRoundTime) {
        this.getClickRoundStatus();
      } else {
        this.getRoundStatus();
      }
    },
    // 滚动底部加载下一月日历
    nextDate() {
      this.getDateList();
    },

    // 往返日期切换
    checkedDate(type) {
      this.roundTripStatus = type;
    },

    // 初始化往返状态中间值
    getRoundStatus() {
      if (this.roundTimeStatus) {
        this.dateList.forEach((item) => {
          item.data.forEach((oitem) => {
            if (
              moment(this.roundData.toTime.date).isBefore(oitem.date) &&
              moment(oitem.date).isBefore(this.roundData.fromTime.date)
            ) {
              oitem["roundStatus"] = true;
            }
          });
        });
      }
    },

    // 选中后往返状态中间值
    getClickRoundStatus() {
      if (this.roundTimeStatus) {
        this.dateList.forEach((item) => {
          item.data.forEach((oitem) => {
            if (
              moment(this.checkedDay.date).isBefore(oitem.date) &&
              moment(oitem.date).isBefore(this.ftromCheckedDay.date)
            ) {
              oitem["roundStatus"] = true;
            } else {
              delete oitem["roundStatus"];
            }
          });
        });
      }
    },

    // 点击日期
    checkedDayBtn(month, day) {
      console.log("时间点击", month, day);
      if (day.status) {
        if (
          this.timeStatus === "end" &&
          this.checkedToTime &&
          moment(day.date).isBefore(this.checkedToTime)
        ) {
          return uni.showToast({
            title:
              "已选返程： " + this.checkedToTime + " 低于去程时间，请重新选择",
            icon: "none",
            duration: 3000,
          });
        } else if (
          this.timeStatus === "start" &&
          this.checkedToTime &&
          moment(this.checkedToTime).isBefore(day.date)
        ) {
          return uni.showToast({
            title:
              "已选去程：" + this.checkedToTime + " 高于返程时间，请重新选择",
            icon: "none",
            duration: 3000,
          });
        }

        if (this.roundTimeStatus) {
          if (!this.roundTripStatus) {
            return uni.showToast({
              title: "请在上方选择卡中选择去程或返程",
              icon: "none",
              duration: 3000,
            });
          }

          this.checkedRoundTime = true;
          let start_time;
          let end_time;
          this.dateList.forEach((item) => {
            item.data.forEach((oitem) => {
              if (oitem.toChecked) {
                start_time = oitem.date;
                // start_time = moment(oitem.date).add(2, 'days').format('YYYY-MM-DD')
              }
              if (oitem.fromChecked) {
                end_time = oitem.date;
                // end_time = moment(oitem.date).subtract(2, 'days').format('YYYY-MM-DD')
              }
            });
          });
          console.log(
            moment(day.date).isBefore(end_time),
            start_time,
            end_time,
            day.date
          );
          if (
            this.roundTripStatus === "start" &&
            !moment(day.date).isBefore(end_time)
          ) {
            return uni.showToast({
              title: "请选择小于返程时间的日期",
              icon: "none",
              duration: 2000,
            });
          }
          if (
            this.roundTripStatus === "end" &&
            !moment(start_time).isBefore(day.date)
          ) {
            return uni.showToast({
              title: "请选择大于去程时间的日期",
              icon: "none",
              duration: 2000,
            });
          }

          if (this.roundTripStatus === "start") {
            this.dateList.forEach((item) => {
              if (item.title === month) {
                item.data.forEach((oitem) => {
                  oitem.toChecked = oitem.day === day.day;
                });
              } else {
                item.data.forEach((oitem) => {
                  oitem.toChecked = false;
                });
              }
            });

            this.dateList.forEach((item) => {
              item.data.forEach((oitem) => {
                if (oitem.toChecked) {
                  console.log(oitem);
                  let fromNow = moment(
                    moment(oitem.date).format("YYYY-MM-DD")
                  ).calendar(null, {
                    nextDay: "[明天]",
                    nextWeek: "ddd",
                    sameElse: "ddd",
                  });

                  this.checkedDay = {
                    type: "time",
                    status: "start",
                    date: moment(oitem.date).format("YYYY-MM-DD"),
                    month: moment(oitem.date).format("M月DD日"),
                    week: fromNow,
                  };
                }
                if (oitem.fromChecked) {
                  let fromNow = moment(
                    moment(oitem.date).format("YYYY-MM-DD")
                  ).calendar(null, {
                    nextDay: "[明天]",
                    nextWeek: "ddd",
                    sameElse: "ddd",
                  });

                  this.ftromCheckedDay = {
                    type: "time",
                    status: "end",
                    date: moment(oitem.date).format("YYYY-MM-DD"),
                    month: moment(oitem.date).format("M月DD日"),
                    week: fromNow,
                  };

                  console.log(this.checkedDay, this.ftromCheckedDay);
                  uni.setStorageSync("time", JSON.stringify(this.checkedDay));
                  uni.setStorageSync(
                    "roundTime",
                    JSON.stringify(this.ftromCheckedDay)
                  );
                }
              });
            });

            this.roundTripStatus = "end";
          } else if (this.roundTripStatus === "end") {
            this.dateList.forEach((item) => {
              if (item.title === month) {
                item.data.forEach((oitem) => {
                  oitem.fromChecked = oitem.day === day.day;
                });
              } else {
                item.data.forEach((oitem) => {
                  oitem.fromChecked = false;
                });
              }
            });

            this.dateList.forEach((item) => {
              item.data.forEach((oitem) => {
                if (oitem.toChecked) {
                  console.log(oitem);
                  let fromNow = moment(
                    moment(oitem.date).format("YYYY-MM-DD")
                  ).calendar(null, {
                    nextDay: "[明天]",
                    nextWeek: "ddd",
                    sameElse: "ddd",
                  });

                  this.checkedDay = {
                    type: "time",
                    status: "start",
                    date: moment(oitem.date).format("YYYY-MM-DD"),
                    month: moment(oitem.date).format("M月DD日"),
                    week: fromNow,
                  };
                }
                if (oitem.fromChecked) {
                  let fromNow = moment(
                    moment(oitem.date).format("YYYY-MM-DD")
                  ).calendar(null, {
                    nextDay: "[明天]",
                    nextWeek: "ddd",
                    sameElse: "ddd",
                  });

                  this.ftromCheckedDay = {
                    type: "time",
                    status: "end",
                    date: moment(oitem.date).format("YYYY-MM-DD"),
                    month: moment(oitem.date).format("M月DD日"),
                    week: fromNow,
                  };

                  console.log(this.checkedDay, this.ftromCheckedDay);
                  uni.setStorageSync("time", JSON.stringify(this.checkedDay));
                  uni.setStorageSync(
                    "roundTime",
                    JSON.stringify(this.ftromCheckedDay)
                  );
                  uni.navigateBack();
                }
              });
            });
          }
          this.getClickRoundStatus();
          // 往返时间
        } else {
          // 单程时间
          this.dateList.forEach((item) => {
            if (item.title === month) {
              item.data.forEach((oitem) => {
                oitem.checked = oitem.day === day.day;
              });
            } else {
              item.data.forEach((oitem) => {
                oitem.checked = false;
              });
            }
          });
          let fromNow = moment(moment(day.date).format("YYYY-MM-DD")).calendar(
            null,
            {
              nextDay: "[明天]",
              nextWeek: "ddd",
              sameElse: "ddd",
            }
          );

          this.checkedDay = {
            type: "time",
            status: this.timeStatus,
            date: moment(day.date).format("YYYY-MM-DD"),
            month: moment(day.date).format("M月DD日"),
            week: fromNow,
          };
          console.log(this.checkedDay);
          uni.setStorageSync("time", JSON.stringify(this.checkedDay));
          uni.navigateBack();
        }
      }
    },
  },
  onLoad(data) {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.timeStatus = data.type;

    // 组装单程日期更换
    this.ticketData = data.ticketType ? JSON.parse(data.ticketType) : {};

    this.checkedToTime = data.checkedToTime;

    console.log(data.roundDate);
    // 组装往返日期
    if (data.roundDate) {
      this.roundData = JSON.parse(data.roundDate);
      this.roundTripStatus =
        this.roundData.type !== "all" ? this.roundData.type : "";
      this.roundTimeStatus = true;
      console.log("往返数据", this.roundData);
    }

    if (this.dateList.length < 2) {
      for (let index = 0; index < 2; index++) {
        this.getDateList();
      }
    }

    this.getRoundStatus();
  },
};
</script>

<style lang="less" scoped>
.date_select {
  display: flex;
  flex-direction: column;
  height: 100vh;

  .round_trip_tab {
    display: flex;
    align-items: center;
    .date_checked {
      flex: 1;
      position: relative;
      height: 100upx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      &.active {
        &::after {
          content: "";
          width: 144upx;
          height: 4upx;
          background: #0070e2;
          display: block;
          bottom: 0;
          position: absolute;
        }
        .checked_time {
          color: #0070e2;
        }
      }
      .checked_title {
        font-size: 24upx;
        font-weight: bold;
        color: #2a2a2a;
      }
      .checked_time {
        font-size: 22upx;
        font-weight: bold;
        color: #2a2a2a;
        margin-top: 6upx;
      }
    }
  }

  .date_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70upx;
    background: rgba(244, 249, 255, 1);
    padding: 0 22upx;
    .hader_list {
      width: 82upx;
      text-align: center;
      font-size: 22upx;
      font-weight: 500;
      color: rgba(42, 42, 42, 1);
      &:first-child,
      &:last-child {
        color: #0070e2;
      }
    }
  }
  .date_main {
    flex: 1;
    overflow-y: auto;
    .date_list {
      margin-top: 42upx;
      .list_title {
        font-size: 32upx;
        font-weight: bold;
        color: rgba(42, 42, 42, 1);
        margin-bottom: 22upx;
        text-align: center;
      }
      .list_item {
        // display: grid;
        padding: 0 20upx;
        // grid-template-columns: repeat(7, 1fr);
        display: flex;
        flex-wrap: wrap;

        .item_box {
          width: 84upx;
          height: 86upx;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0 6upx 20upx rgba(0, 112, 226, 0.1);
          border-radius: 20upx;
          // margin-right: 20upx;
          margin-bottom: 28upx;
          font-size: 28upx;
          font-weight: 500;
          color: rgba(42, 42, 42, 1);
          border: 4upx solid transparent;
          position: relative;
          // flex: 7 0 auto;
          &:not(:nth-child(7n)) {
            margin-right: 10upx;
          }
          &.not_day {
            box-shadow: none;
          }
          &.active {
            position: relative;
            border: 4upx solid rgba(0, 112, 226, 0.2);
            font-size: 22upx;
            font-weight: 500;
            color: rgba(0, 112, 226, 1) !important;
          }
          &.is_before {
            box-shadow: none;
            color: rgba(218, 220, 223, 1);
          }
          &.checked {
            background: rgba(0, 112, 226, 1);
            color: rgba(255, 255, 255, 1);
          }
          &.round_status {
            background: #e4f1ff;
            box-shadow: none;
            border-radius: 0;
            position: relative;
            &::before {
              content: "";
              position: absolute;
              right: -13upx;
              top: -4upx;
              height: 95upx;
              width: 15upx;
              background: #e4f1ff;
            }
            &::after {
              content: "";
              position: absolute;
              left: -13upx;
              top: -4upx;
              height: 95upx;
              width: 15upx;
              background: #e4f1ff;
            }
          }
          &.to {
            background: #e4f1ff;
            box-shadow: none;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
            &::before{
              content: '';
              background: #e4f1ff;
              right: -13upx;
              height: 95upx;
              width: 15upx;
              position: absolute;
            }
            &.start {
              background: #0070e2;
              box-shadow: 0 6upx 20upx rgba(0, 112, 226, 0.1);
              color: #fff;
              border-radius: 20upx;
              .text_to {
                color: #fff;
              }
              &::before{
                display: none;
              }
            }
          }
          &.from {
             background: #e4f1ff;
            box-shadow: none;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            &::before{
              content: '';
              background: #e4f1ff;
              left: -13upx;
              height: 95upx;
              width: 15upx;
              position: absolute;
            }
            &.end {
              background: #0070e2;
              box-shadow: 0 6upx 20upx rgba(0, 112, 226, 0.1);
              color: #fff;
              border-radius: 20upx;
              .text_from {
                color: #fff;
              }
              &::before{
                display: none;
              }
            }
            // &.to {
            //   &::before {
            //     content: "去程返程";
            //   }
            // }
          }
          .round_text{
              font-size: 18upx;
              font-weight: 500;
              color: #2a2a2a;
            }
          .lunar {
            font-size: 10px;
            font-weight: 500;
            color: #afb9c4;
          }
        }
      }
    }
  }
}
</style>