<!--
 * @Description: 日期选择页面
 * @Author: wish.WuJunLong
 * @Date: 2020-08-10 17:46:05
 * @LastEditTime: 2020-09-27 18:33:55
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
              { from: oitem.fromChecked},
              roundTripStatus
            ]"
            v-for="(oitem, oindex) in item.data"
            :key="oindex"
            >{{ oitem.day }}</view
          >
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

      roundTripStatus: '',

      ticketData: {}, // 已选日期数据

      roundData: {}, // 往返日期数据
      roundTimeStatus: {}, // 往返状态
    };
  },
  methods: {
    // 日期列表处理
    getDateList() {
      let currentDate = moment().format("YYYY年MM月"); // 当前月份
      let nextDate = moment().add(this.nextIndex, "M").format("YYYY年MM月"); // 下一月份
      let nextDateNumber = moment().add(this.nextIndex, "M").daysInMonth(); // 下一月份天数
      let nextLastDateWeek = moment()
        .add(this.nextIndex, "M")
        .startOf("month")
        .format("d"); // 下月1号星期
      let nextList = [];
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
          toChecked:
            moment().add(this.nextIndex, "M").format("YYYY-MM") +
              "-" +
              (i + 1 < 10 ? "0" + (i + 1) : i + 1) ===
            this.roundData.toTime.date,
            fromChecked:
            moment().add(this.nextIndex, "M").format("YYYY-MM") +
              "-" +
              (i + 1 < 10 ? "0" + (i + 1) : i + 1) ===
            this.roundData.fromTime.date,
        });
      }
      this.dateList.push({
        title: nextDate,
        type: Number(nextLastDateWeek),
        data: nextList,
      });
      this.nextIndex = this.nextIndex + 1;
    },
    // 滚动底部加载下一月日历
    nextDate() {
      this.getDateList();
    },

    // 往返日期切换
    checkedDate(type) {
      this.roundTripStatus = type;
    },

    // 点击日期
    checkedDayBtn(month, day) {
      console.log("时间点击", month, day);
      if (day.status) {
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
    },
  },
  onLoad(data) {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.timeStatus = data.type;

    // 组装单程日期更换
    this.ticketData = data.ticketType ? JSON.parse(data.ticketType) : {};

    console.log(data.roundDate);
    // 组装往返日期
    if(data.roundDate){
      this.roundData = JSON.parse(data.roundDate)
      this.roundTripStatus = this.roundData.type !== 'all'?this.roundData.type: ''
      this.roundTimeStatus = true;
      console.log("往返数据", this.roundData);
    }

    

    

    if (data.status) {
      this.roundTripStatus = {
        status: true,
        startTime: data.startTime,
        endTime: data.endTime,
        type: data.type,
      };
    }
    if (this.dateList.length < 2) {
      for (let index = 0; index < 2; index++) {
        this.getDateList();
      }
    }
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
            color: transparent !important;
            position: relative;
            border: 4upx solid rgba(0, 112, 226, 0.2);
            &::before {
              content: "今天";
              position: absolute;
              font-size: 22upx;
              font-weight: 500;
              color: rgba(0, 112, 226, 1);
            }
          }
          &.is_before {
            box-shadow: none;
            color: rgba(218, 220, 223, 1);
          }
          &.checked {
            background: rgba(0, 112, 226, 1);
            color: rgba(255, 255, 255, 1);
          }
          &.to {
            background: #E4F1FF;
            box-shadow: none;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
            &.start {       
              background: #0070E2;
              box-shadow: 0 6upx 20upx rgba(0, 112, 226, 0.1);
              color: #fff;
              &::before{
                color: #fff;
              }
            }
            &::before {
              content: "去程";
              position: absolute;
              font-size: 18upx;
              font-weight: 500;
              color: #2a2a2a;
              top: 0
            }
          }
          &.from {
            background: #E4F1FF;
            box-shadow: none; 
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            &.end {       
              background: #0070E2;
              box-shadow: 0 6upx 20upx rgba(0, 112, 226, 0.1);
              color: #fff;
              &::before{
                color: #fff;
              }
            }
            &::before {
              content: "返程";
              position: absolute;
              font-size: 18upx;
              font-weight: 500;
              color: #2a2a2a;
              top: 0
            }
          }
        }
      }
    }
  }
}
</style>