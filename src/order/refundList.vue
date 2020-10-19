<!--
 * @Description: 国内退票列表
 * @Author: mazhengrong
 * @Date: 2020-09-17 11:57:29
 * @LastEditTime: 2020-10-19 15:47:12
 * @LastEditors: wish.WuJunLong
-->
<template>
  <view class="order_list">
    <yun-header
      :statusHeight="iStatusBarHeight"
      :centerTitle="orderHeaderTitle"
    ></yun-header>

    <view class="order_header">
      <view
        :class="['header_list', { active: headerActive === index }]"
        v-for="(item, index) in refundList"
        :key="index"
        @click="checkedHeaderActive(index)"
        >{{ item }}</view
      >
    </view>

    <view class="order_filter">
      <view class="filter_list">
        <view class="list_icon">
          <image src="@/static/filter_time_active.png" mode="contain" />
        </view>
        <view class="list_title" @click="sorTime('create')">申请(早-晚)</view>
      </view>

      <view class="filter_list">
        <view class="list_icon">
          <image src="@/static/filter_btn_active.png" mode="contain" />
        </view>
        <view class="list_title" @click="goFilter('1')">筛选</view>
      </view>
    </view>

    <scroll-view
      :scroll-y="true"
      :enable-back-to-top="true"
      class="content"
      @scrolltolower="nextPageData()"
    >
      <view
        class="content_list"
        v-for="(item, index) in refundOrderList"
        :key="index"
        @click="jumpOrderDetails(item)"
      >
        <view class="list_item">
          <view class="item_header">
            <view
              class="item_title"
              v-for="(oitem, oindex) in item.ticket_segments"
              :key="oindex"
            >
              <view class="title"
                >{{ oitem.arrive_CN.city_name }} -
                {{ oitem.departure_CN.city_name }}</view
              >
            </view>
            <view class="info_right">
              <text
                >{{
                  item.order_status === 1
                    ? "申请中"
                    : item.order_status === 2
                    ? "成功"
                    : item.order_status === 3
                    ? "已取消"
                    : ""
                }}
              </text>
            </view>
          </view>
          <view class="item_info">
            <view class="info_left">
              <text class="left_title">乘机人</text>
              <view class="left_message">
                <text
                  class="message_passenger"
                  v-for="(oitem, oindex) in item.ticket_refund_passenger"
                  :key="oindex"
                  >{{ oitem.ticket_passenger.PassengerName }}</text
                >
              </view>
            </view>
            <view class="info_right"> </view>
          </view>
        </view>
      </view>

      <view class="no_data" v-if="!orderPageStatus">
        <text>到底啦</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import orderApi from "@/api/order.js";
import moment from "moment";
moment.locale("zh-cn");
export default {
  data() {
    return {
      iStatusBarHeight: 0,
      refundList: ["全部", "申请中", "成功", "已取消"], // 退票列表类别
      headerActive: 0, // 订单类别默认值 全部
      orderPageNumber: 1, // 当前订单页数
      orderPageStatus: true, // 是否允许加载下一页数据
      orderList: [], // 订单列表数据

      orderHeaderTitle: "国内退票单", // 订单列表页头部标题
      refundOrderList: [], //国内退票列表
      orderListFilter: {}, // 筛选条件
    };
  },
  methods: {
    checkedHeaderActive(index) {
      this.headerActive = index;
      this.orderPageNumber = 1;
      this.refundOrderList = [];
      if (JSON.stringify(this.orderListFilter) !== "{}") {
        this.getOrderList();
      }
    },

    //跳转到筛选页面
    goFilter(type) {
      uni.navigateTo({
        url: "/order/filter?type=" + type,
      });
      this.getOrderList();
    },
    //获取国内退票列表
    getOrderList() {
      this.orderPageStatus = true;
      let data = {
        dis_id: uni.getStorageSync("userInfo").dis_id,
        start_date: moment()
          .subtract(7, "days")
          .format("YYYY-MM-DD"),
        end_date: moment().format("YYYY-MM-DD"),
        order_status:
          this.headerActive === 0
            ? ""
            : this.headerActive === 1
            ? "1"
            : this.headerActive === 2
            ? "2"
            : this.headerActive,
      };
      orderApi.orderRefundList(data).then((res) => {
        console.log(res);
        if (res.result === 10000) {
          if (this.refundOrderList.length > 0) {
            this.refundOrderList.push.apply(
              this.refundOrderList,
              res.data.data
            );
          } else {
            this.refundOrderList = res.data.data;
          }
        } else {
          //     uni.showToast({
          // 	    title: res.msg,
          // 	    icon: "none",
          // });
        }
      });
    },
    // 下一页数据
    nextPageData() {
      if (this.orderPageStatus) {
        this.orderPageNumber = this.orderPageNumber + 1;
        this.getOrderList();
      }
    },

    // 跳转订单详情
    jumpOrderDetails(data) {
      uni.navigateTo({
        url: "/order/refundDetails?refundData=" + JSON.stringify(data),
      });
    },

    // 起飞时间排序
    departSort(d) {
      return (m, n) => {
        var a = new Date(m.ticket_segments[0][d]).getTime();
        var b = new Date(n.ticket_segments[0][d]).getTime();
        return a - b;
      };
    },

    // 预定时间排序
    createSort(t) {
      return (m, n) => {
        var a = new Date(m[t]).getTime();
        var b = new Date(n[t]).getTime();
        return a - b;
      };
    },

    //时间排序
    sorTime(val) {
      if (val === "create") {
        this.refundOrderList.sort(this.createSort("created_at"));
      } else if (val === "depart") {
        this.refundOrderList.sort(this.departSort("departure_time"));
      }
    },
  },
  onLoad(data) {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.getOrderList();
  },
  onShow() {
    this.orderListFilter = uni.getStorageSync("orderListFilter");
    if (this.orderListFilter) {
      this.orderListFilter = JSON.parse(this.orderListFilter);
      //pnr筛选
      if (this.orderListFilter.pnr) {
        this.refundOrderList = this.refundOrderList.filter(
          (item) => item.pnr_code === this.orderListFilter.pnr
        );
      }
      //订单编号筛选
      if (this.orderListFilter.orderNumber) {
        this.refundOrderList = this.refundOrderList.filter(
          (item) => item.order_no === this.orderListFilter.orderNumber
        );
      }

      //航班号筛选
      if (this.orderListFilter.flightNumber) {
        this.refundOrderList = this.refundOrderList.filter(
          (item) =>
            item.ticket_segments[0].flight_no ===
            this.orderListFilter.flightNumber
        );
      }

      //订票员  选择框
      if (this.orderListFilter.booker) {
        this.refundOrderList = this.refundOrderList.filter(
          (item) => item.book_user === this.created_at.booker
        );
      }

      //出发城市筛选
      if (this.orderListFilter.Citystart) {
        this.refundOrderList = this.refundOrderList.filter(
          (item) =>
            item.ticket_segments[0].departure_msg.province ===
            this.orderListFilter.Citystart
        );
      }

      //到达城市筛选
      if (this.orderListFilter.Cityend) {
        this.refundOrderList = this.refundOrderList.filter(
          (item) =>
            item.ticket_segments[0].arrive_msg.province ===
            this.orderListFilter.Cityend
        );
      }

      //日始时间筛选
      if (this.orderListFilter.Timestart) {
        this.refundOrderList = this.refundOrderList.filter(
          (item) =>
            moment(item.ticket_segments[0].departure_time).format(
              "YYYY-MM-DD"
            ) === this.orderListFilter.Timestart
        );
      }

      //日止时间筛选
      if (this.orderListFilter.Timend) {
        this.refundOrderList = this.refundOrderList.filter(
          (item) =>
            moment(item.ticket_segments[0].departure_time).format(
              "YYYY-MM-DD"
            ) === this.orderListFilter.Timend
        );
      }

      //预定日期排序
      if (this.orderListFilter.date !== null) {
        this.sorTime(this.orderListFilter.date);
      }

      //订单状态筛选
      if (this.orderListFilter.status !== null) {
        this.checkedHeaderActive(this.orderListFilter.status);
      }

      uni.removeStorageSync("orderListFilter");
    }
  },
};
</script>

<style lang="less" scoped>
.order_list {
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
        color: rgba(51, 51, 51, 1);
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
        margin-bottom: 20upx;
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
          .info_right {
            font-size: 24upx;
            font-weight: 400;
            color: rgba(42, 42, 42, 1);
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
            display: flex;
            align-items: center;
            .left_title {
              margin-right: 20upx;
              flex-shrink: 0;
            }
            .left_message {
              color: rgba(175, 185, 196, 1);
              width: 50%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              .message_passenger {
                &:not(:last-child) {
                  &::after {
                    content: "/";
                  }
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

    .no_data {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 20upx;
      font-size: 28upx;
      font-weight: 400;
      color: rgba(175, 185, 196, 1);
      margin-bottom: 60upx;
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
}
</style>
