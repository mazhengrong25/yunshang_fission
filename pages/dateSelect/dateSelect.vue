<!--
 * @Description: 日期选择页面
 * @Author: wish.WuJunLong
 * @Date: 2020-08-10 17:46:05
 * @LastEditTime: 2020-08-25 16:55:57
 * @LastEditors: wish.WuJunLong
-->
<template>
  <view class="date_select">
    <yun-header :statusHeight="iStatusBarHeight" centerTitle="选择日期"></yun-header>
    <view class="date_header">
      <view class="hader_list" v-for="item in weekCn" :key="item">{{item}}</view>
    </view>

    <scroll-view
      :enable-back-to-top="true"
      :scroll-y="true"
      @scrolltolower="nextDate"
      class="date_main"
    >
      <view class="date_list" v-for="(item, index) in dateList" :key="index">
        <view class="list_title">{{item.title}}</view>

        <view class="list_item">
          <view class="item_box not_day" v-for="(oitem, oindex) in item.type" :key="oindex"></view>
          <view
            @click="checkedDayBtn(item.title,oitem)"
            :class="['item_box',{'active': oitem.active},{'is_before': oitem.status === false},{checked: oitem.checked}]"
            v-for="(oitem, oindex) in item.data"
            :key="oindex"
          >{{oitem.day}}</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import moment from "moment";
moment.locale('zh-cn');
export default {
  data() {
    return {
			iStatusBarHeight: 0,
			timeStatus: '', // 日期选择状态 start起飞时间 end到达时间
      weekCn: ["日", "一", "二", "三", "四", "五", "六"], // 中国周列表
      currentDateTitle: "", // 当前年月
      dateList: [],
      nextIndex: 0, // 获取下多少个月的时间

      dateList: [], // 日期数据

      checkedDay: {}, // 选中日期
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
          status:
            currentDate === nextDate
              ? i + 1 > Number(moment().format("D"))
              : true,
          active:
            currentDate === nextDate
              ? i + 1 === Number(moment().format("D"))
              : false,
          checked: false,
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
    // 点击日期
    checkedDayBtn(month, day) {
      console.log(month, day);
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
				let fromNow = moment(moment(day.time + "-" + day.day).format("YYYY-MM-DD")).calendar(null,{
					nextDay: '[明天]',
					nextWeek: 'ddd',
					sameElse: 'ddd'
				})
				
        this.checkedDay = {
					type: 'time',
					status: this.timeStatus,
          date: moment(day.time + "-" + day.day).format("YYYY-MM-DD"),
          month: moment(day.time + "-" + day.day).format("M月DD日"),
					week: fromNow,
				};
				console.log(this.checkedDay)
        uni.setStorageSync("time", JSON.stringify(this.checkedDay));
        uni.switchTab({
          url: "/pages/index/index",
        });
      }
    },
  },
  onLoad(data) {
		this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
		this.timeStatus = data.type
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
        display: grid;
        padding: 0 20upx;
        grid-template-columns: repeat(7, 1fr);

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
          flex: 7 0 auto;
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
        }
      }
    }
  }
}
</style>