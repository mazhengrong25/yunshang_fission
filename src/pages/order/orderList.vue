<!--
 * @Description: 订单列表页
 * @Author: wish.WuJunLong
 * @Date: 2020-08-04 16:23:02
 * @LastEditTime: 2020-09-10 18:31:29
 * @LastEditors: mazhengrong
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
        v-for="(item, index) in headerList"
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
        <view class="list_title" @click="sorTime('create')">预定(早-晚)</view>
      </view>

      <view class="filter_list">
        <view class="list_icon">
          <image src="@/static/filter_setoff.png" mode="contain" />
        </view>
        <view class="list_title" @click="sorTime('depart')">出发(早-晚)</view>
      </view>

      <view class="filter_list">
        <view class="list_icon">
          <image src="@/static/filter_btn_active.png" mode="contain" />
        </view>
        <view class="list_title" @click="goFilter()">筛选</view>
      </view>
    </view>

    <scroll-view
      :scroll-y="true"
      :enable-back-to-top="true"
      class="content"
      @scrolltolower="nextPageData()"
    >
      <!-- 国内机票盒子 -->
      <view
        class="content_list"
        v-for="(item, index) in innerList"
        :key="index"
      >
        <!--单程  往返  多程 -->
        <view class="list_tyle">{{
          item.segment_type === 1
            ? "单程机票"
            : item.ticket_round_order_id > 0
            ? "往返机票"
            : ""
        }}</view>
        <view
          @click.stop="jumpOrderDetails(item)"
          class="list_item"
          v-for="(oitem, oindex) in item.ticket_segments"
          :key="oindex"
        >
          <view class="item_header">
            <view class="item_title">
              <!-- 去程 返程 -->
              <view>
                <!-- {{
                  oitem.direction_type === 1
                    ? "去程"
                    : oitem.direction_type === 2
                    ? "回程"
                    : item.direction_type === 3
                    ? "第" + (oindex + 1) + "程"
                    : ""
                }} -->
                </view>
              <view class="title">{{ oitem.departure_msg.city_name}} - {{ oitem.arrive_msg.city_name }}</view>
            </view>
            <view class="item_price">
              <text>&yen;</text>
              {{ item.ticket_price || "金额错误" }}
            </view>
            <view class="info_right" v-if="item.segment_type !== 1">
              {{
                 item.status !== 0 && item.status !== 5 && item.pay_status === 1
                  ? "已预订"
                  : item.status === 1
                  ? "待出票"
                  : item.status === 3
                  ? "已出票"
                  : item.status === 5
                  ? "已取消"
                  : ""
              }}
            </view>
          </view>
          <view class="item_info">
            <view class="info_left">
              <text>{{ oitem.flight_no }}</text>
              <text>{{ $dateTool(oitem.departure_time, "MM月DD日") }}</text>
              <text>{{ $dateTool(oitem.departure_time, "hh:mm") }}起飞</text>
            </view>
            <view class="info_right" v-if="item.segment_type === 1">
              {{
                item.status !== 0 && item.status !== 5 && item.pay_status === 1
                  ? "已预订"
                  : item.status === 1
                  ? "待出票"
                  : item.status === 3
                  ? "已出票"
                  : item.status === 5 && item.pay_status === 1
                  ? "已取消"
                  : ""
              }}
            </view>
          </view>

          <view class="item_time" v-if="item.pay_status === 1">
            <view class="time_icon">
              <image src="@/static/remaining_time.png" mode="aspectFit" />
            </view>
            <view class="time_text">剩余支付时间：</view>
            <view class="time_number"
              >{{
                $timeDiff(
                  new Date(item.created_at).getTime() + 30 * 60 * 1000,
                  new Date(),
                  "minutes"
                )
              }}分钟</view
            >
          </view>

          <view class="item_btn_box" v-if="item.pay_status === 1">
            <view class="item_btn close_btn" @click.stop="removeOrder(item)">取消订单</view>
            <view class="item_btn submit_btn">去支付</view>
          </view>
        </view>
      </view>

      <!-- 国际机票盒子 -->
      <view
        class="content_list"
        v-for="(item, index) in orderList"
        :key="index"
        @click="jumpOrderDetails(item)"
      >
        <view class="list_tyle">{{
          item.routing_type === 1
            ? "单程机票"
            : item.routing_type === 2
            ? "往返机票"
            : item.routing_type === 3
            ? "多程机票"
            : ""
        }}</view>
        <view class="multiple_trips_header" v-if="item.routing_type !== 1">
          <view class="header_title">{{
            item.routing_type === 2
              ? "往返总价"
              : item.routing_type === 3
              ? "多程总价"
              : ""
          }}</view>
          <view class="header_price">
            <text>&yen;</text>
            {{ item.need_pay_amount || "金额错误" }}
          </view>
        </view>
        <view
          :class="[
            'list_item',
            { multiple_trips_item: item.routing_type !== 1 },
          ]"
          v-for="(oitem, oindex) in item.routes"
          :key="oindex"
        >
          <view class="item_header">
            <view class="item_title">
              <view
                :class="[
                  'title_type',
                  { return_trip: oitem.direction_type === 2 },
                ]"
                v-if="item.routes.length > 1"
                >{{
                  oitem.direction_type === 1
                    ? "去程"
                    : oitem.direction_type === 2
                    ? "返程"
                    : item.direction_type === 3
                    ? "第" + (oindex + 1) + "程"
                    : ""
                }}</view
              >
              <view class="title"
                >{{ oitem.departure }} - {{ oitem.arrive }}</view
              >
            </view>
            <view class="item_price" v-if="item.routing_type === 1">
              <text>&yen;</text>
              {{ item.need_pay_amount || "金额错误" }}
            </view>
            <view class="info_right" v-if="item.routing_type !== 1">
              {{
                item.status === 1
                  ? "已预订"
                  : item.status === 2
                  ? "待出票"
                  : item.status === 3
                  ? "已出票"
                  : item.status === 5
                  ? "已取消"
                  : ""
              }}
            </view>
          </view>
          <view class="item_info">
            <view class="info_left">
              <text>{{ oitem.inter_segments[0].flight_no }}</text>
              <text>{{ $dateTool(oitem.departure_time, "MM月DD日") }}</text>
              <text>{{ $dateTool(oitem.departure_time, "hh:mm") }}起飞</text>
            </view>
            <view class="info_right" v-if="item.routing_type === 1">
              {{
                item.status === 1
                  ? "已预订"
                  : item.status === 2
                  ? "待出票"
                  : item.status === 3
                  ? "已出票"
                  : item.status === 5
                  ? "已取消"
                  : ""
              }}
            </view>
          </view>

          <view class="item_time" v-if="item.pay_status === 1">
            <view class="time_icon">
              <image src="@/static/remaining_time.png" mode="aspectFit" />
            </view>
            <view class="time_text">剩余支付时间：</view>
            <view class="time_number"
              >{{
                $timeDiff(
                  new Date(item.created_at).getTime() + 30 * 60 * 1000,
                  new Date(),
                  "minutes"
                )
              }}分钟</view
            >
          </view>

          <view class="item_btn_box" v-if="item.pay_status === 1">
            <view class="item_btn close_btn">取消订单</view>
            <view class="item_btn submit_btn">去支付</view>
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
      headerList: ["全部", "已预订", "待出票", "已出票", "已取消"], // 订单列表类别
      headerActive: 0, // 订单类别默认值 全部
      orderPageNumber: 1, // 当前订单页数
      orderPageStatus: true, // 是否允许加载下一页数据
      orderList: [], // 订单列表数据

      orderListType: "", // 订单列表页 类型
      orderHeaderTitle: "", // 订单列表页头部标题
      innerList: [], //国内列表

      orderListFilter: {}, // 筛选条件
    };
  },
  methods: {
   
    checkedHeaderActive(index) {
      this.headerActive = index;
      this.orderPageNumber = 1;
      this.orderList = [];  //国外
      this.innerList = [];  //国内
      if(JSON.stringify(this.orderListFilter) !== '{}'){
        this.getOrderList();
      }
    },

    // 取消订单
    removeOrder(data){
      console.log(data.order_no)
      console.log('取消订单')
      let newData = {
        order_no: data.order_no
      }
      orderApi.cancleInterRefund(newData)
        .then(res =>{
          console.log(res)
        })
    },

    //跳转到筛选页面
    goFilter() {
      uni.navigateTo({
        url: "/pages/order/filter",
      });
      this.getOrderList()
    },
    //获取国内外列表
    getOrderList() {
      this.orderPageStatus = true;
      if (this.orderListType === "3") {
        let data = {
          status:
            this.headerActive === 0
              ? "-1"
              : this.headerActive === 4
              ? 5
              : this.headerActive,
          page: this.orderPageNumber,
        };
        orderApi.orderInterList(data).then((res) => {
          if (res.errorcode === 10000) {
            if (this.orderList.length > 0) {
              this.orderList.push.apply(this.orderList, res.data.data);
            } else {
              this.orderList = res.data.data;
            }
              // this.orderList.filter(item => fi)
            if (this.orderPageNumber >= res.data.last_page) {
              this.orderPageStatus = false;
            }
          } else {
            uni.showToast({
              title: "res.msg",
              icon: "none",
            });
          }
        });
      } else if (this.orderListType === "0") {
        // 国内
        let data = {
          page: this.orderPageNumber,
          created_at: moment()
            .subtract(3, "days")
            .format("YYYY-MM-DD"),
        };
        orderApi.orderList(data).then((res) => {
          console.log(res);
          if (res.result === 10000) {
            if (this.innerList.length > 0) {
              this.innerList.push.apply(this.innerList, res.data.data);
            } else {
              this.innerList = res.data.data;
            }
            this.innerList.forEach(item =>{ //剩余支付时间
              item.status = this.$timeDiff(
                  new Date(item.created_at).getTime() + 30 * 60 * 1000,
                  new Date(),
                  "minutes"
                ) > 0? item.status: 5
            })
            console.log(this.innerList)
            if (this.headerActive !== 0 && this.headerActive !== 1) {
              let activeIndex =
                this.headerActive === 2
                  ? 1 // 待出票
                  : this.headerActive === 3
                  ? 3 // 已出票
                  : this.headerActive === 4 
                  ? 5
                  : 0; // 已取消
              this.innerList = this.innerList.filter(
                (item) => item.status === activeIndex && item.pay_status !== 1
              );
            }
            //判断是否为已预订
            if (this.headerActive === 1) {
              this.innerList = this.innerList.filter(
                (item) =>
                  item.status !== 0 &&
                  item.status !== 5 &&
                  item.pay_status === 1 
              )
             
            }

            if (this.orderPageNumber >= res.data.last_page) {
              this.orderPageStatus = false;
            }
          } else {
            uni.showToast({
              title: "res.msg",
              icon: "none",
            });
          }
        });
      }
    },
    // 下一页数据
    nextPageData() {
      if (this.orderPageStatus) {
        this.orderPageNumber = this.orderPageNumber + 1;
        this.getOrderList();
      } 
      // else {
      //   uni.showToast({
      //     title: "到底啦",
      //     icon: "none",
      //   });
      // }
    },

    // 跳转国际订单详情
    jumpOrderDetails(data) {
      if (this.orderListType === "3") {
        uni.navigateTo({
          url:
            "/pages/order/orderDetails?orderData=" +
            JSON.stringify(data) +
            "&type=" +
            this.orderListType,
        });
      } else if (this.orderListType === "0") {
        uni.navigateTo({
          url:
            "/pages/order/orderinterDetails?listData=" +
            JSON.stringify(data) +
            "&type=" +
            this.orderListType,
        });
      }
    },

     // 起飞时间排序
    departSort(d) {

        return (m, n) => {
        var a = new Date(m.ticket_segments[0][d]).getTime();
        var b = new Date(n.ticket_segments[0][d]).getTime();
        return a -b;   
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
        this.innerList.sort(this.createSort("created_at"));
      } else if (val === "depart") {
        this.innerList.sort(this.departSort("departure_time"));
      }
    },
  },
  onLoad(data) {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.orderListType = data.type;
    this.orderHeaderTitle =
      this.orderListType === "0"
        ? "国内订单"
        : this.orderListType === "1"
        ? "国内退票订单"
        : this.orderListType === "2"
        ? "国内改签订单"
        : this.orderListType === "3"
        ? "国际订单"
        : this.orderListType === "4"
        ? "国际退票订单"
        : this.orderListType === "5"
        ? "国际改签订单"
        : "";
    console.log("orderHeaderTitle", this.orderHeaderTitle);
    this.getOrderList();
  },
  onShow(){
    this.orderListFilter = uni.getStorageSync('orderListFilter')
    if(this.orderListFilter){
      this.orderListFilter = JSON.parse(this.orderListFilter)
      //pnr筛选
      if(this.orderListFilter.pnr){ 
        this.innerList = this.innerList.filter(item =>item.pnr_code === this.orderListFilter.pnr)
      }
      //订单编号筛选
      if(this.orderListFilter.orderNumber){ 
        this.innerList = this.innerList.filter(item =>item.order_no === this.orderListFilter.orderNumber)
      }

      //航班号筛选
      if(this.orderListFilter.flightNumber){
        this.innerList = this.innerList.filter(item =>item.ticket_segments[0].flight_no === this.orderListFilter.flightNumber)
      }

      //订票员  选择框
      if(this.orderListFilter.booker){
        this.innerList = this.innerList.filter(item =>item.book_user === this.created_at.booker)
      }

      //出发城市筛选  
      if(this.orderListFilter.Citystart){
        this.innerList = this.innerList.filter(item =>item.ticket_segments[0].departure_msg.province === this.orderListFilter.Citystart)
      }

      //到达城市筛选  
      if(this.orderListFilter.Cityend){
        this.innerList = this.innerList.filter(item =>item.ticket_segments[0].arrive_msg.province === this.orderListFilter.Cityend)
      }

      //日始时间筛选
      if(this.orderListFilter.Timestart){
        this.innerList = this.innerList.filter(item => moment(item.ticket_segments[0].departure_time).format("YYYY-MM-DD") === this.orderListFilter.Timestart)
      }

       //日止时间筛选
      if(this.orderListFilter.Timend){
        this.innerList = this.innerList.filter(item => moment(item.ticket_segments[0].departure_time).format("YYYY-MM-DD") === this.orderListFilter.Timend)
      }
    
      //预定日期排序
      if(this.orderListFilter.date !== null){
        this.sorTime(this.orderListFilter.date)
      }
      
      //订单状态筛选
      if(this.orderListFilter.status !== null){

        this.checkedHeaderActive(this.orderListFilter.status)
      }


      uni.removeStorageSync('orderListFilter')
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
