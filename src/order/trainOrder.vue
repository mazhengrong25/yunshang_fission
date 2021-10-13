<!--
 * @Description: 火车票订单
 * @Author: mzr
 * @Date: 2021-08-20 09:56:10
 * @LastEditTime: 2021-10-13 10:14:50
 * @LastEditors: wish.WuJunLong
-->
<template>
  <view class="train_order">
    <yun-header
      :statusHeight="iStatusBarHeight"
      :centerTitle="orderHeaderTitle"
    ></yun-header>

    <view class="order_header">
      <view
        :class="['header_list', { active: headerActive === index }]"
        v-for="(item, index) in headerList"
        :key="index"
        @click="checkedHeaderActive(index)"
        >{{ item }}</view
      >
    </view>

    <view class="order_filter">
      <view
        :class="['filter_list', { active: sortType === 'reserve' }]"
        @click="sorTime('reserve')"
      >
        <view class="list_icon">
          <image
            v-if="sortType === 'reserve'"
            src="@/static/filter_time_active.png"
            mode="contain"
          />
          <image v-else src="@/static/filter_time.png" mode="contain" />
        </view>
        <view class="list_title">预定(早-晚)</view>
      </view>

      <view
        :class="['filter_list', { active: sortType === 'depart' }]"
        @click="sorTime('depart')"
      >
        <view class="list_icon">
          <image
            v-if="sortType === 'depart'"
            src="@/static/filter_setoff_active.png"
            mode="contain"
          />
          <image v-else src="@/static/filter_setoff.png" mode="contain" />
        </view>
        <view class="list_title">出发(早-晚)</view>
      </view>

      <view
        :class="[
          'filter_list',
          { active: JSON.stringify(this.orderListFilter) !== '{}' },
        ]"
        @click="goFilter('0')"
      >
        <view class="list_icon">
          <image
            v-if="JSON.stringify(this.orderListFilter) !== '{}'"
            src="@/static/filter_btn_active.png"
            mode="contain"
          />
          <image v-else src="@/static/filter_btn.png" mode="contain" />
        </view>
        <view class="list_title">筛选</view>
      </view>
    </view>

    <scroll-view
      :scroll-y="true"
      :enable-back-to-top="true"
      :scroll-top="scrollTop"
      @scroll="scroll"
      class="content"
    >
      <view
        class="content_list"
        v-if="item.segments.length > 0"
        v-for="(item, index) in trainList"
        :key="index"
      >
        <view class="list_item" @click="jumpTrainDetails(item)">
          <view class="item_header">
            <view class="item_title">
              <view class="title">
                {{ item.segments[0].from_city }} - {{ item.segments[0].to_city }}</view
              >
            </view>
            <view class="item_price">
              <text>&yen;</text>
              {{ item.total_price }}
            </view>
          </view>
          <view class="item_info">
            <view class="info_left">
              <text>{{ item.segments[0].train_number }}</text>
              <text>{{
                item.segments[0].departure_time
                  ? $moment(item.segments[0].departure_time).format("MM月DD日")
                  : "-"
              }}</text>
              <text
                >{{
                  item.segments[0].departure_time
                    ? $moment(item.segments[0].departure_time).format("HH:mm")
                    : "-"
                }}发车</text
              >
            </view>
            <view class="info_right">
              {{
                item.status === 1
                  ? "占座中"
                  : item.status === 2
                  ? "待支付"
                  : item.status === 3
                  ? "待出票"
                  : item.status === 4 &&
                    item.refund_orders.length < 1 &&
                    item.change_orders.length < 1
                  ? "已出票"
                  : item.status === 4 && item.refund_orders.length > 0
                  ? "已退票"
                  : item.status === 4 && item.change_orders.length > 0
                  ? "已改签"
                  : item.status === 5
                  ? "已取消"
                  : item.status === 6
                  ? "占座失败"
                  : item.status === 7
                  ? "出票失败"
                  : ""
              }}
            </view>
          </view>

          <!-- 乘客姓名 -->
          <view class="passenger_item">
            <view
              class="item_title"
              v-for="(oitem, oindex) in item.passengers"
              :key="oindex"
            >
              <text v-if="oitem.PassengerType === 'CHD'">+{{ item.chdNumber }}儿童</text>
              <text v-else>{{ oitem.PassengerName }}</text>
            </view>
          </view>

          <view class="item_time" v-if="item.status === 2">
            <view class="time_icon">
              <image src="@/static/remaining_time.png" mode="aspectFit" />
            </view>
            <view class="time_text">剩余支付时间：</view>
            <view class="time_number"
              >{{ Math.floor((item.overdue_time / 60) % 60) }}分钟</view
            >
          </view>
          <view class="item_btn_box" v-if="item.status === 2">
            <view class="item_btn close_btn" @click.stop="getCancel(item)">取消订单</view>
            <view class="item_btn submit_btn" @click.stop="jumpOrderPay(item)"
              >去支付</view
            >
          </view>
        </view>
      </view>

      <!-- 缺省页 -->
      <default-page v-if="showDefault" defaultType="not_order"></default-page>
    </scroll-view>
  </view>
</template>

<script>
import orderApi from "@/api/order.js";
export default {
  data() {
    return {
      iStatusBarHeight: 0,
      oldScrollTop: 0,
      orderHeaderTitle: "火车票订单",
      headerList: ["全部", "待支付", "出票中", "已出票", "已取消"], // 订单列表类别
      headerActive: 0,

      sortType: "", // 时间排序类别
      trainObject: {},
      trainList: [], // 数组列表
      orderListFilter: {}, // 筛选条件

      showDefault: false, // 报错页面
    };
  },
  methods: {
    // 滚动
    scroll(e) {
      this.oldScrollTop = e.detail.scrollTop;
    },

    checkedHeaderActive(index) {
      this.headerActive = index;
      this.getTrainList();
    },

    // 出行时间排序
    departSort(d) {
      this.sortType = "depart";
      return (m, n) => {
        var a = new Date(m.segments[0][d]).getTime();
        var b = new Date(n.segments[0][d]).getTime();
        return a - b;
      };
    },

    // 预定时间排序
    reserveSort(t) {
      console.log(t);
      this.sortType = "reserve";
      return (m, n) => {
        var a = new Date(m[t]).getTime();
        var b = new Date(n[t]).getTime();
        return a - b;
      };
    },

    // 时间排序
    sorTime(val) {
      console.log("排序类别", val);

      if (val === "reserve") {
        this.trainList.sort(this.reserveSort("created_at"));
      } else if (val === "depart") {
        this.trainList.sort(this.departSort("departure_time"));
      }
    },

    //跳转到筛选页面
    goFilter(val) {
      uni.navigateTo({
        url:
          "/order/trainFilter?type=" +
          val +
          "&trainData=" +
          JSON.stringify(this.orderListFilter),
      });
    },

    // 获取火车票列表
    getTrainList() {
      let data = {
        status:
          this.headerActive === 0
            ? ""
            : this.headerActive === 1
            ? 2
            : this.headerActive === 2
            ? 3
            : this.headerActive === 3
            ? 4
            : this.headerActive === 4
            ? 5
            : this.headerActive,
        order_no: this.orderListFilter.orderNumber || "", // 订单号
        train_date_start: this.orderListFilter.timeStart || "", // 预定开始
        // train_date_start:"2021-08-27",
        train_date_end: this.orderListFilter.timeEnd || "", // 预定结束
        passenger: this.orderListFilter.passengerName || "", // 乘车人
        ticket_number: this.orderListFilter.ticket_number || "", // 取票号
        train_number: this.orderListFilter.trainNumber || "", // 车次
      };

      // 筛选 城市选择
      if (this.orderListFilter.cityStart) {
        data["from_station"] = this.orderListFilter.cityStart.data.city_name;
      }
      if (this.orderListFilter.cityEnd) {
        data["to_station"] = this.orderListFilter.cityEnd.data.city_name;
      }
      orderApi.trainOrderList(data).then((res) => {
        console.log(res);
        if (res.code === 0) {
          this.trainObject = res.data;
          this.trainList = res.data.data;

          // 儿童个数
          this.trainList.forEach((item) => {
            let chdNumber = 0;
            item.passengers.forEach((oitem) => {
              if (oitem.PassengerType === "CHD") {
                chdNumber += 1;
              }
            });
            item["chdNumber"] = chdNumber;
          });

          // 筛选条件 日期条件
          if (this.orderListFilter.dateStatus !== null) {
            this.sorTime(this.orderListFilter.dateStatus);
          }

          // 缺省状态
          this.showDefault = this.trainList.length < 1;
        } else {
          this.showDefault = true;
          uni.showToast({
            title: res.msg,
            icon: "none",
            duration: 3000,
          });
        }
      });
    },

    // 跳转到详情
    jumpTrainDetails(data) {
      console.log(data);
      uni.navigateTo({
        url: "/order/trainOrderDetails?orderNo=" + data.order_no,
      });
    },

    // 待支付  取消订单
    getCancel(e) {
      console.log("取消订单", e.order_no);
      uni.navigateTo({
        url: "/order/trainOrderDetails?orderNo=" + e.order_no,
      });
    },

    // 待支付  去支付
    jumpOrderPay(val) {
      console.log("去支付跳转", val);
      uni.navigateTo({
        url:
          "/trainReservation/orderPay?orderNo=" +
          val.order_no +
          "&detailItem=" +
          JSON.stringify(val),
      });
    },
  },
  onLoad() {},
  onShow() {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.orderListFilter = uni.getStorageSync("trainFilter")
      ? JSON.parse(uni.getStorageSync("trainFilter"))
      : {};
    if (JSON.stringify(this.orderListFilter) !== "{}") {
      //订单状态筛选
      if (this.orderListFilter.status !== "") {
        this.checkedHeaderActive(Number(this.orderListFilter.status));
      } else {
        this.checkedHeaderActive(0);
      }
      console.log("火车票列表筛选", this.orderListFilter);
    } else {
      this.headerActive = 0;
      this.sortType = "";
    }
    this.getTrainList();
  },
};
</script>

<style lang="less" scoped>
.train_order {
  background: rgba(243, 245, 247, 1);
  height: 100vh;
  display: flex;
  flex-direction: column;
  .order_header {
    height: 88upx;
    background: rgba(0, 112, 226, 1);
    box-shadow: 10upx 30upx 54upx rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    .header_list {
      padding: 0 24upx;
      font-size: 28upx;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.5);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding-bottom: 8upx;
      &::after {
        content: "";
        display: block;
        width: 100%;
        height: 6upx;
        background: rgba(255, 255, 255, 1);
        border-radius: 4upx;
        margin-top: 8upx;
        opacity: 0;
      }
      &.active {
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        &::after {
          opacity: 1;
        }
      }
    }
  }
  .order_filter {
    height: 40px;
    background: rgba(255, 255, 255, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    .filter_list {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      padding: 10upx 40upx;
      &.active {
        .list_title {
          color: #0070e2;
        }
      }
      &:not(:last-child) {
        border-right: 2upx solid #eaeaea;
      }
      .list_icon {
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
      .list_title {
        font-size: 22upx;
        font-weight: 400;
        color: #959da7;
      }
    }
  }
  .content {
    flex: 1;
    box-sizing: border-box;
    overflow-y: auto;
    .content_list {
      margin: 0 20upx 40upx;
      &:first-child {
        margin-top: 40upx;
      }
      .list_item_header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20upx;
        .list_tyle {
          display: inline-flex;
          align-items: center;
          padding: 0 32upx;
          height: 50upx;
          background: rgba(123, 155, 193, 0.4);
          border-radius: 26upx;
          font-size: 24upx;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
        }
        .scheduled_time {
          font-size: 24upx;
          color: gray;
        }
      }

      .multiple_trips_header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 92upx;
        padding: 0 20upx;
        border-bottom: 2upx solid rgba(241, 243, 245, 1);
        background: #fff;
        border-radius: 20upx 20upx 0 0;
        .header_title {
          font-size: 28upx;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
        }
        .header_price {
          font-size: 42upx;
          font-weight: bold;
          color: rgba(255, 0, 0, 1);
          text {
            font-size: 24upx;
            margin-right: 4upx;
          }
        }
      }
      .list_item {
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 12upx 18upx rgba(0, 0, 0, 0.04);
        border-radius: 20upx;
        padding: 20upx 20upx 40upx;
        &:not(:last-child) {
          margin-bottom: 20upx;
        }
        &.multiple_trips_item {
          border-radius: 0;
          &:last-child {
            border-radius: 0 0 20upx 20upx;
            .item_header {
              .info_right {
                display: none;
              }
            }
          }
          &:not(:last-child) {
            .item_time,
            .item_btn_box {
              display: none;
            }
          }
        }
        .item_header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16upx;
          .item_title {
            display: flex;
            align-items: center;
            .title_type {
              display: inline-flex;
              align-items: center;
              padding: 0 20upx;
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
              margin-right: 12upx;
              &.return_trip {
                background: linear-gradient(
                  90deg,
                  rgba(155, 236, 153, 1) 0%,
                  rgba(133, 205, 131, 1) 100%
                );
              }
            }
            .title {
              font-size: 34upx;
              font-weight: bold;
              color: rgba(42, 42, 42, 1);
              display: inline-flex;
              align-items: center;
              .title_tag {
                width: 80upx;
                height: 30upx;
                background: linear-gradient(90deg, #9bec99 0%, #85cd83 100%);
                border-radius: 10upx;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 20upx;
                font-weight: 400;
                color: #ffffff;
                margin-right: 12upx;
                &.to {
                  background: linear-gradient(270deg, #0070e2 0%, #56c5ff 100%);
                }
              }
            }
          }
          .item_price {
            font-size: 42upx;
            font-weight: bold;
            color: rgba(255, 0, 0, 1);
            text {
              font-size: 24upx;
              margin-right: 4upx;
            }
          }
        }
        .item_info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .info_left {
            font-size: 24upx;
            font-weight: 400;
            color: rgba(42, 42, 42, 1);
            text {
              display: inline-flex;
              align-items: center;
              &:first-child {
                padding-left: 0;
              }
              &:not(:last-child) {
                &::after {
                  content: "";
                  display: block;
                  width: 2upx;
                  height: 20upx;
                  background: rgba(211, 223, 236, 1);
                  margin: 0 8upx;
                }
              }
            }
          }
          .info_right {
            font-size: 24upx;
            font-weight: 400;
            color: rgba(42, 42, 42, 1);
          }
        }

        //乘客姓名
        .passenger_item {
          display: flex;
          justify-content: flex-start;
          margin-top: 20upx;
          .item_title {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: rgba(42, 42, 42, 1);
            border: 2rpx solid #d9e1ea;
            border-radius: 20rpx;
            font-size: 22rpx;
            padding: 0 10upx;
            height: 30rpx;
            color: #6e6e6e;
            min-width: 68upx;
            &:nth-child(n + 5) {
              display: none;
            }
            &:not(:last-child) {
              margin-right: 10rpx;
            }
          }
        }

        .item_time {
          margin: 34upx 0;
          height: 64upx;
          background: rgba(243, 245, 247, 1);
          border-radius: 20upx;
          display: flex;
          align-items: center;
          padding: 0 20upx;
          font-size: 24upx;
          font-weight: bold;
          color: #2a2a2a;
          .time_icon {
            width: 24upx;
            height: 24upx;
            margin-right: 10upx;
            image {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          }
          .time_number {
            color: #ff0000;
          }
        }
        .item_btn_box {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          .item_btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 170upx;
            height: 64upx;
            border: 2upx solid rgba(223, 223, 223, 1);
            border-radius: 50upx;
            font-size: 24upx;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            margin-left: 20upx;
            &.submit_btn {
              background: rgba(0, 112, 226, 1);
              color: rgba(255, 255, 255, 1);
              border-color: rgba(0, 112, 226, 1);
            }
          }
        }
      }
    }
  }
}
</style>
