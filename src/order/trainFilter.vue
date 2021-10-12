<!--
 * @Description: 火车票 --- 筛选
 * @Author: mzr
 * @Date: 2021-08-26 10:50:46
 * @LastEditTime: 2021-09-30 15:38:32
 * @LastEditors: mzr
-->
<template>
  <view class="train_filter">
    <yun-header
      :statusHeight="iStatusBarHeight"
      centerTitle="筛选"
    ></yun-header>

    <scroll-view
      :enable-back-to-top="true"
      :scroll-y="true"
      class="filter_main"
    >
      <view class="list_item" v-if="filterType === '0'">
        <view class="item_title">日期条件</view>
        <view class="item_content item_checkbox">
          <view
            :class="['checkbox_item', { active: item.active }]"
            v-for="item in trainDateFilter"
            :key="item"
            @click="activeDate(item)"
            >{{ item.name }}</view
          >
        </view>
      </view>
   
      <view class="list_item" v-if="filterType === '0'">
        <view class="item_title">订单状态</view>
        <view class="item_content item_checkbox">
          <view
            :class="['checkbox_item', { active: item.active }]"
            v-for="item in trainOrderStatus"
            :key="item"
            @click="activeOrderStatus(item)"
            >{{ item.name }}</view
          >
        </view>
      </view>

      <view class="list_item" v-if="filterType === '1'">
        <view class="item_title">退票状态</view>
        <view class="item_content item_checkbox">
          <view
            :class="['checkbox_item', { active: item.active }]"
            v-for="item in refundOrderStatus"
            :key="item"
            @click="activeRefundStatus(item)"
            >{{ item.name }}</view
          >
        </view>
      </view>

      <view class="list_item" v-if="filterType === '2'">
        <view class="item_title">改签状态</view>
        <view class="item_content item_checkbox">
          <view
            :class="['checkbox_item', { active: item.active }]"
            v-for="item in changeOrderStatus"
            :key="item"
            @click="activeChangeStatus(item)"
            >{{ item.name }}</view
          >
        </view>
      </view>

      <view class="list_item">
        <view class="item_title">{{filterType === '0'?'时间范围':'申请时间'}}</view>
        <view class="item_content item_dialog">
          <view
            v-if="filterType ==='0'"
            :class="['dialog_view', { input_placeholder: !timeLimit.start }]"
            @click="openlimitdaySelector('start')"
            >{{ timeLimit.start ? timeLimit.start : "预定日始" }}</view
          >
          <view
            v-if="filterType ==='1'"
            :class="['dialog_view', { input_placeholder: !refundTime.start }]"
            @click="openlimitdaySelector('start')"
            >{{ refundTime.start ? refundTime.start : "申请日始" }}</view
          >
          <view
            v-if="filterType ==='2'"
            :class="['dialog_view', { input_placeholder: !changeTime.start }]"
            @click="openlimitdaySelector('start')"
            >{{ changeTime.start ? changeTime.start : "申请日始" }}</view
          >
          <view class="dialog_line">—</view>
          <view
            v-if="filterType ==='0'"
            :class="['dialog_view', { input_placeholder: !timeLimit.end }]"
            @click="openlimitdaySelector('end')"
            >{{ timeLimit.end ? timeLimit.end : "预定日止" }}</view
          >
          <view
            v-if="filterType ==='1'"
            :class="['dialog_view', { input_placeholder: !refundTime.end }]"
            @click="openlimitdaySelector('end')"
            >{{ refundTime.end ? refundTime.end : "申请日止" }}</view
          >
          <view
            v-if="filterType ==='2'"
            :class="['dialog_view', { input_placeholder: !changeTime.end }]"
            @click="openlimitdaySelector('end')"
            >{{ changeTime.end ? changeTime.end : "申请日止" }}</view
          >
        </view>
      </view>

      <view class="list_item" v-if="filterType === '0'">
        <view class="item_title">城市选择</view>
        <view class="item_content item_dialog">
          <view
            :class="['dialog_view', { input_placeholder: !citySelect.start }]"
            @click="whereFromBtn()"
            >{{citySelect.start.data.city_name || '出发城市'}}</view
          >
          <view class="dialog_line">—</view>
          <view
            :class="['dialog_view', { input_placeholder: !citySelect.end }]"
            @click="whereToBtn()"
            >{{citySelect.end.data.city_name || '到达城市'}}</view
          >
        </view>
      </view>

      <!-- 间隔 -->
      <view class="space" v-if="filterType === '1'|| filterType === '2'"></view>

      <view class="list_item list_input">
        <view class="item_title">乘车人</view>
        <input
          type="text"
          class="item_input"
          v-model="passengerName"
          placeholder="输入乘车人姓名"
          placeholder-class="input_placeholder"
        />
      </view>

      <view class="list_item list_input">
        <view class="item_title">订单号</view>
        <input
          type="text"
          class="item_input"
          v-model="orderNumber"
          placeholder="请填写订单号"
          placeholder-class="input_placeholder"
        />
      </view>

      <view class="list_item list_input" v-if="filterType === '0'">
        <view class="item_title">车次</view>
        <input
          type="text"
          class="item_input"
          v-model="trainNumber"
          placeholder="请填写车次号"
          placeholder-class="input_placeholder"
        />
      </view>

      <view class="list_item list_input">
        <view class="item_title">取票号</view>
        <input
          type="text"
          class="item_input"
          v-model="getTicketNumber"
          placeholder="请填写取票号"
          placeholder-class="input_placeholder"
        />
      </view>
    
    </scroll-view>

    <!-- 选择日期 -->
    <yun-selector
      ref="limitdayPopup"
      selectType="date"
      @submitDialog="limitdaySelecctBtn()"
    ></yun-selector>

    <!-- 按钮组 -->
    <view class="filter_bottom">
      <view class="bottom_btn reset_btn" @click="resetBtn">重置</view>

      <button
        :class="['bottom_btn submit_btn', { disabled: submitBtnStatus }]"
        :disabled="submitBtnStatus"
        @click="yesBtn"
      >
        确定
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {

      iStatusBarHeight:0,
      
      filterType:"", // 筛选区分 正常单(0)  退票(1)  改签(2)  
      trainDateFilter:[
        // 火车票日期条件筛选
        {
          name: "预定日期",
          active: false,
        },
        {
          name: "出行日期",
          active: false,
        },
      ],

      trainOrderStatus:[
        // 火车票订单状态
         {
          name: "待支付",
          id: 1,
          active: false,
        },
        {
          name: "待出票",
          id: 2,
          active: false,
        },
        {
          name: "已出票",
          id: 3,
          active: false,
        },
        {
          name: "已取消",
          id: 4,
          active: false,
        },
      ],

      refundOrderStatus:[
        // 火车票退票状态
         {
          name: "退票中",
          id: 1,
          active: false,
        },
        {
          name: "已退票",
          id: 2,
          active: false,
        },
        {
          name: "退票失败",
          id: 3,
          active: false,
        }
      ],

      changeOrderStatus:[
        // 火车票改签状态
         {
          name: "待支付",
          id: 1,
          active: false,
        },
        {
          name: "改签占座中",
          id: 2,
          active: false,
        },
        {
          name: "已出票",
          id: 3,
          active: false,
        },
        {
          name: "已取消",
          id: 4,
          active: false,
        }
      ],

      dateType: "", // 日期选择类型
      timeLimit: {
        // 时间范围
        start: "",
        end: "",
      },
      refundTime:{
        // 退票时间范围
        start: "",
        end: "",
      },
      changeTime:{
        // 改签时间范围
        start: "",
        end: "",
      },

      citySelect: {
        // 城市选择
        start: "",
        end: "",
      },

      trainMessage: {
        to: {},
        from: {},
        toTime: {},
      },
      
      // 正常单
      dateStatus: null, //  日期状态
      orderStatus: null, // 订单状态

      passengerName:"", // 乘车人
      orderNumber:"", // 订单号
      trainNumber:"", // 车次

      // 退票
      refundStatus:null, // 退票状态
      getTicketNumber:"", // 取票号

      // 改签
      changeStatus:null, // 改签状态
    }
  },
  methods: {

    // 条件选择
    activeDate(val) {
     
        // 日期选择
        this.trainDateFilter.forEach((item) => {
          if (item.name === val.name) {
            item.active = !val.active;
            this.dateStatus = item.active
              ? item.name === "预定日期"
                ? "reserve"
                : item.name === "出行日期"
                ? "depart"
                : ""
              : null;
          } else {
            item.active = false;
          }
        });
    },

    // 订单状态
    activeOrderStatus(val) {
      this.trainOrderStatus.forEach((item) => {
        if (item.name === val.name) {
          item.active = !val.active;
          this.orderStatus = item.active ? val.id : null;
        } else {
          item.active = false;
        }
      });
    },

    // 退票状态
    activeRefundStatus(val) {
      this.refundOrderStatus.forEach((item) => {
        if (item.name === val.name) {
          item.active = !val.active;
          this.refundStatus = item.active ? val.id : null;
        } else {
          item.active = false;
        }
      });
    },

    // 改签状态
    activeChangeStatus(val) {
      this.changeOrderStatus.forEach((item) => {
        if (item.name === val.name) {
          item.active = !val.active;
          this.changeStatus = item.active ? val.id : null;
        } else {
          item.active = false;
        }
      });
    },

    // 打开时间范围日期选择框
    openlimitdaySelector(type) {
      this.dateType = type;
      this.$refs.limitdayPopup.openDialog();
    },

    // 确认时间范围
    limitdaySelecctBtn(e) {
      console.log(e);
      let start =
        e.year +
        "-" +
        (e.month < 10 ? "0" + e.month : e.month) +
        "-" +
        (e.day < 10 ? "0" + e.day : e.day);

      if (this.dateType === "end" && this.timeLimit.start) {
        if (
          new Date(start).getTime() < new Date(this.timeLimit.start).getTime()
        ) {
          return uni.showToast({
            title: "请选择大于起始时间",
            icon: "none",
          });
        }
      } else if (this.dateType === "start" && this.timeLimit.end) {
        if (
          new Date(start).getTime() > new Date(this.timeLimit.end).getTime()
        ) {
          return uni.showToast({
            title: "请选择小于结束时间",
            icon: "none",
          });
        }
      }else if (this.dateType === "end" && this.refundTime.start) {
        if (
          new Date(start).getTime() > new Date(this.refundTime.start).getTime()
        ) {
          return uni.showToast({
            title: "请选择大于起始时间",
            icon: "none",
          });
        }
      }else if (this.dateType === "start" && this.refundTime.end) {
        if (
          new Date(start).getTime() > new Date(this.refundTime.end).getTime()
        ) {
          return uni.showToast({
            title: "请选择小于结束时间",
            icon: "none",
          });
        }
      }else if (this.dateType === "end" && this.changeTime.start) {
        if (
          new Date(start).getTime() > new Date(this.changeTime.start).getTime()
        ) {
          return uni.showToast({
            title: "请选择大于起始时间",
            icon: "none",
          });
        }
      }else if (this.dateType === "start" && this.changeTime.end) {
        if (
          new Date(start).getTime() > new Date(this.changeTime.end).getTime()
        ) {
          return uni.showToast({
            title: "请选择小于结束时间",
            icon: "none",
          });
        }
      }


      this.$set(this.timeLimit,this.dateType,start)
      this.$set(this.refundTime,this.dateType,start)
      this.$set(this.changeTime,this.dateType,start)

      
    },

    //城市选择  到达城市
    whereToBtn() {
      //  跳转到城市选择页面
      uni.navigateTo({
        url: "/pages/trainCitySelect/trainCitySelect?type=to",
      });
    },

    //城市选择  出发城市
    whereFromBtn() {
      //  跳转到城市选择页面
      uni.navigateTo({
        url: "/pages/trainCitySelect/trainCitySelect?type=from",
      });
    },

    // 确定按钮
    yesBtn() {
      let data

      if(this.filterType === "0") {

        data = {
          passengerName : this.passengerName,
          orderNumber : this.orderNumber,
          trainNumber : this.trainNumber,
          timeStart : this.timeLimit.start,
          timeEnd : this.timeLimit.end,
          dateStatus : this.dateStatus,
          status : this.orderStatus,
          cityStart : this.citySelect.start,
          cityEnd : this.citySelect.end,
          ticket_number:this.getTicketNumber, // 取票号
        };
      }else if (this.filterType === "1") {
        data = {
          status:this.refundStatus, // 退票状态
          refund_no:this.orderNumber, // 订单号
          start_date:this.refundTime.start, // 开始时间
          end_date:this.refundTime.end, // 结束时间
          PassengerName:this.passengerName, // 乘车人
          ticket_number:this.getTicketNumber, // 取票号
        }
      }else if (this.filterType === "2") {
        data = {
          status:this.changeStatus, // 改签状态
          order_no:this.orderNumber, // 订单号
          train_date_start:this.changeTime.start, // 开始时间
          train_date_end:this.changeTime.end, // 结束时间
          // PassengerName:this.passengerName, // 乘车人
          ticket_number:this.getTicketNumber, // 取票号
        }
      }

      
      uni.setStorageSync('trainFilter',JSON.stringify(data));
      uni.navigateBack();
    },

    // 重置筛选
    resetBtn() {
      // 正常单
      // this.trainDateFilter.forEach((item) => (item.active = false));
      // this.trainOrderStatus.forEach((item) => (item.active = false));
      // this.passengerName = "",
      // this.orderNumber = "",
      // this.ticketNumber = "",
      // this.trainNumber = "",
      // this.timeLimit.start = "",
      // this.timeLimit.end = "",
      // this.citySelect.start = "",
      // this.citySelect.end = "",

      // 退票
      this.refundOrderStatus.forEach((item) => (item.active = false));
      this.getTicketNumber = "",
      this.refundTime.start = "",
      this.refundTime.end = "",

      // 改签
      this.changeOrderStatus.forEach((item) => (item.active = false));
      this.changeTime.start = "",
      this.changeTime.end = "",

      uni.removeStorageSync('trainFilter');

      uni.navigateBack();
    },
    
    
  },
  onLoad(data) {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.filterType = data.type; // 筛选类别
    console.log(data)
    // 正常单
    if(this.filterType === "0") {
      let trainData = JSON.parse(data.trainData)
      this.passengerName = trainData.passengerName,
      this.orderNumber = trainData.orderNumber,
      this.trainNumber = trainData.trainNumber,
      this.timeLimit.start = trainData.timeStart,
      this.timeLimit.end = trainData.timeEnd,
      this.dateStatus = trainData.dateStatus,
      this.orderStatus = trainData.status,
      this.citySelect.start = trainData.cityStart,
      this.citySelect.end = trainData.cityEnd,
      this.getTicketNumber = trainData.ticket_number; // 取票号
      // 日期条件
      this.trainDateFilter[0].active = trainData.dateStatus === "reserve";
      this.trainDateFilter[1].active = trainData.dateStatus === "depart";

      // 订单状态
      this.trainOrderStatus.forEach((item) =>(item.active = item.id === trainData.status))

    }
    // 退票单
    if(this.filterType === "1") {
      let refundData = JSON.parse(data.refundData);
      this.refundStatus = refundData.status; // 退票状态
      this.orderNumber = refundData.refund_no; // 订单号
      this.refundTime.start = refundData.start_date; // 开始时间
      this.refundTime.end = refundData.end_date; // 结束时间
      this.passengerName = refundData.PassengerName; // 乘车人
      this.getTicketNumber = refundData.ticket_number; // 取票号

      // 退票状态
      this.refundOrderStatus.forEach((item) =>(item.active = item.id === refundData.status))
      
    }
    // 改签单
    if(this.filterType === "2") {
      let changeData = JSON.parse(data.changeData);
      this.changeStatus = changeData.status; // 改签状态
      this.orderNumber = changeData.order_no; // 订单号
      this.changeTime.start = changeData.train_date_start; // 开始时间
      this.changeTime.end = changeData.train_date_end; // 结束时间
      this.passengerName = changeData.PassengerName; // 乘车人
      this.getTicketNumber = changeData.ticket_number; // 取票号

      // 改签状态
      this.changeOrderStatus.forEach((item) =>(item.active = item.id === changeData.status))

    }
  },

  onShow() {
    // 获取城市信息
    if (uni.getStorageSync("city")) {
      let cityData = JSON.parse(uni.getStorageSync("city"));
      console.log('火车筛选城市',JSON.parse(uni.getStorageSync("city")))
      if (cityData.status === "from") {
        this.citySelect.start = cityData;
        // this.trainMessage["to"] = cityData.data;
        // this.trainMessage["to_type"] = cityData.type;
      } else if (cityData.status === "to") {
        this.citySelect.end = cityData;
        // this.trainMessage["from"] = cityData.data;
        // this.trainMessage["from_type"] = cityData.type;
      }
      uni.removeStorageSync("city");
    }
  },
}
</script>

<style lang="less" scoped>
.train_filter {
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  .filter_main {
    height: calc(100% - (270upx + var(--status-bar-height)));
    overflow-y: auto;
    box-sizing: border-box;
    .space {height: 100upx;}
    .list_item {
      margin: 0 20upx 50upx;
      &:first-child {
        margin-top: 50upx;
      }
      &.list_input {
        display: flex;
        justify-content: space-between;
        padding-bottom: 26upx;
        border-bottom: 2upx solid rgba(241, 243, 245, 1);
        margin-bottom: 34upx;
        .item_input {
          text-align: right;
          margin-left: 50upx;
          font-size: 28upx;
          color: rgba(175, 185, 196, 1);
        }
      }
    }
    .item_title {
      font-size: 28upx;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
    }
    .item_checkbox {
      display: flex;
      align-items: center;
      margin-top: 30upx;
      .checkbox_item {
        width: 156upx;
        height: 70upx;
        background: rgba(241, 243, 245, 1);
        border-radius: 10upx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24upx;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        &.active {
          background: rgba(0, 112, 226, 0.6);
          color: rgba(255, 255, 255, 1);
        }
        &:not(:last-child) {
          margin-right: 28upx;
        }
      }
    }
    .item_dialog {
      display: flex;
      align-items: center;
      margin-top: 30upx;
      .dialog_view {
        width: 280upx;
        height: 70upx;
        background: rgba(241, 243, 245, 1);
        border-radius: 36upx;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 20upx;
        box-sizing: border-box;
        font-size: 28upx;
        font-weight: 400;
      }
      .dialog_line {
        font-size: 28upx;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        margin: 0 40upx;
      }
    }
  }
  .filter_bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    border-top: 2upx solid rgba(229, 229, 229, 1);
    bottom: 0;
    left: 0;
    width: 100vw;
    height: calc(144upx + var(--status-bar-height));
    padding: 26upx 20upx;
    padding-bottom: calc(26upx + var(--status-bar-height));
    box-sizing: border-box;
    background: #fff;
    z-index: 1;
    .bottom_btn {
      width: 320upx;
      height: 90upx;
      border: 2upx solid transparent;
      border-radius: 80upx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32upx;
      font-weight: 400;
      margin: 0;

      &.reset_btn {
        border-color: rgba(0, 112, 226, 1);
        color: rgba(0, 112, 226, 1);
      }
      &.submit_btn {
        background: linear-gradient(
          90deg,
          rgba(0, 112, 226, 1) 0%,
          rgba(86, 197, 255, 1) 100%
        );
        box-shadow: 0 6upx 12upx rgba(0, 112, 226, 0.3);
        color: rgba(255, 255, 255, 1);
      }
      &.disabled {
        opacity: 0.4;
      }
    }
  }
}
</style>