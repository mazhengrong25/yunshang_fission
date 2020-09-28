<!--
 * @Description: 订单列表页
 * @Author: wish.WuJunLong
 * @Date: 2020-08-04 16:23:02
<<<<<<< HEAD
 * @LastEditTime: 2020-09-28 16:00:33
 * @LastEditors: mazhengrong
=======
 * @LastEditTime: 2020-09-28 16:00:20
 * @LastEditors: wish.WuJunLong
>>>>>>> 4223b00e98077d7df0c5c196c79de01a0633daa2
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
      <view class="filter_list" @click="sorTime('create')">
        <view class="list_icon">
          <image src="@/static/filter_time_active.png" mode="contain" />
        </view>
        <view class="list_title">预定(早-晚)</view>
      </view>

      <view class="filter_list" @click="sorTime('depart')">
        <view class="list_icon">
          <image src="@/static/filter_setoff.png" mode="contain" />
        </view>
        <view class="list_title">出发(早-晚)</view>
      </view>

      <view class="filter_list" @click="goFilter('0')">
        <view class="list_icon">
          <image src="@/static/filter_btn_active.png" mode="contain" />
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
      @scrolltolower="nextPageData()"
    >
      <!-- 国内机票盒子 -->
      <view
        class="content_list"
        v-for="(item, index) in innerList"
        :key="index"
      >
        <!--单程  往返  多程 -->
        <view class="list_item_header">
          <view class="list_tyle">{{
            item.segment_type === 1 && !item.is_round_last
              ? "单程机票"
              : item.ticket_round_order_id > 0
              ? "往返机票"
              : ""
          }}</view>
          <view class="scheduled_time">{{$dateTool(item.created_at,'YYYY-MM-DD HH:mm')}}</view>
        </view>
        <view
          @click.stop="
            jumpOrderDetails(item.ticket_segments[0], 0, item.is_round_last)
          "
          class="list_item"
        >
          <view class="item_header">
            <view class="item_title">
              <view class="title">
                <text class="title_tag to" v-if="item.is_round_last">去程</text>

                {{ item.ticket_segments[0].departure_CN.city_name }} -
                {{
                  item.ticket_segments[item.ticket_segments.length - 1]
                    .arrive_CN.city_name
                }}</view
              >
            </view>
            <view class="item_price">
              <text>&yen;</text>
              {{ item.total_price || "金额错误" }}
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
              <text>{{ item.ticket_segments[0].flight_no }}</text>
              <text>{{
                $dateTool(item.ticket_segments[0].departure_time, "MM月DD日")
              }}</text>
              <!-- HH:mm 24制   hh:mm 12制 -->
              <text
                >{{
                  $dateTool(item.ticket_segments[0].departure_time, "HH:mm")
                }}起飞</text
              >
            </view>
            <view class="info_right" v-if="item.segment_type === 1">
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

          <view
            class="item_time"
            v-if="
              item.pay_status === 1 &&
              $timeBefore(new Date(item.created_at).getTime() + 30 * 60 * 1000)
            "
          >
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
          <view
            class="item_btn_box"
            v-if="
              item.pay_status === 1 &&
              $timeBefore(new Date(item.created_at).getTime() + 30 * 60 * 1000)
            "
          >
            <view class="item_btn close_btn" @click.stop="removeOrder(item, 0)"
              >取消订单</view
            >
            <view
              class="item_btn submit_btn"
              @click.stop="jumpPayOrder(item, 0)"
              >去支付</view
            >
          </view>
        </view>

        <!-- 返程数据 -->

        <view
          v-if="item.from_ticket_segments"
          @click.stop="
            jumpOrderDetails(
              item.from_ticket_segments[0],
              1,
              item.is_round_last
            )
          "
          class="list_item"
        >
          <view class="item_header">
            <view class="item_title">
              <view class="title">
                <text class="title_tag">返程</text>

                {{ item.from_ticket_segments[0].departure_CN.city_name }} -
                {{
                  item.from_ticket_segments[
                    item.from_ticket_segments.length - 1
                  ].arrive_CN.city_name
                }}</view
              >
            </view>
            <view class="item_price">
              <text>&yen;</text>
              {{ item.from_total_price || "金额错误" }}
            </view>
            <view class="info_right" v-if="item.segment_type !== 1">
              {{
                item.from_status !== 0 &&
                item.from_status !== 5 &&
                item.from_pay_status === 1
                  ? "已预订"
                  : item.from_status === 1
                  ? "待出票"
                  : item.from_status === 3
                  ? "已出票"
                  : item.from_status === 5
                  ? "已取消"
                  : ""
              }}
            </view>
          </view>
          <view class="item_info">
            <view class="info_left">
              <text>{{ item.from_ticket_segments[0].flight_no }}</text>
              <text>{{
                $dateTool(
                  item.from_ticket_segments[0].departure_time,
                  "MM月DD日"
                )
              }}</text>
              <!-- HH:mm 24制   hh:mm 12制 -->
              <text
                >{{
                  $dateTool(
                    item.from_ticket_segments[0].departure_time,
                    "HH:mm"
                  )
                }}起飞</text
              >
            </view>
            <view class="info_right" v-if="item.segment_type === 1">
              {{
                item.from_status !== 0 &&
                item.from_status !== 5 &&
                item.from_pay_status === 1
                  ? "已预订"
                  : item.from_status === 1
                  ? "待出票"
                  : item.from_status === 3
                  ? "已出票"
                  : item.from_status === 5
                  ? "已取消"
                  : ""
              }}
            </view>
          </view>

          <view
            class="item_time"
            v-if="
              item.from_pay_status === 1 &&
              $timeDiff(
                new Date(item.from_created_at).getTime() + 30 * 60 * 1000,
                new Date(),
                'minutes'
              ) > 0
            "
          >
            <view class="time_icon">
              <image src="@/static/remaining_time.png" mode="aspectFit" />
            </view>
            <view class="time_text">剩余支付时间：</view>
            <view class="time_number"
              >{{
                $timeDiff(
                  new Date(item.from_created_at).getTime() + 30 * 60 * 1000,
                  new Date(),
                  "minutes"
                )
              }}分钟</view
            >
          </view>
          <view
            class="item_btn_box"
            v-if="
              item.from_pay_status === 1 &&
              $timeDiff(
                new Date(item.from_created_at).getTime() + 30 * 60 * 1000,
                new Date(),
                'minutes'
              ) > 0
            "
          >
            <view class="item_btn close_btn" @click.stop="removeOrder(item, 1)"
              >取消订单</view
            >
            <view
              class="item_btn submit_btn"
              @click.stop="jumpPayOrder(item, 1)"
              >去支付</view
            >
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

          <view
            class="item_time"
            v-if="
              item.pay_status === 1 &&
              $timeDiff(
                new Date(item.created_at).getTime() + 30 * 60 * 1000,
                new Date(),
                'minutes'
              ) > 0
            "
          >
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

          <view
            class="item_btn_box"
            v-if="
              item.pay_status === 1 &&
              $timeDiff(
                new Date(item.created_at).getTime() + 30 * 60 * 1000,
                new Date(),
                'minutes'
              ) > 0
            "
          >
            <view class="item_btn close_btn">取消订单</view>
            <view class="item_btn submit_btn">去支付</view>
          </view>
        </view>
      </view>

      <!-- 缺省页 -->
      <default-page v-if="showDefault" defaultType="not_order"></default-page>

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

      showDefault: false, // 报错页面

      scrollTop: 0, // 航班列表滚动值
      oldScrollTop: 0,
    };
  },
  methods: {
    checkedHeaderActive(index) {
      this.headerActive = index;
      this.orderPageNumber = 1;
      this.orderList = []; //国外
      this.innerList = []; //国内
      if (JSON.stringify(this.orderListFilter) !== "{}") {
        this.getOrderList();
      }
    },

    // 取消订单
    removeOrder(data, index) {
      let orderNo = index === 0 ? data.order_no : data.from_order_no;
      uni.navigateTo({
        url:
          "/pages/order/orderinterDetails?orderNo=" +
          orderNo +
          "&cancel=cancel",
      });
    },

    // 去支付
    jumpPayOrder(val, index) {
      console.log(val);
      let orderId = [index === 0 ? val.order_no : val.from_order_no];
      let flightData = {
        flightType: val.is_round_last
          ? index === 0
            ? "去程"
            : "返程"
          : "单程",
        data: index === 0 ? val.ticket_segments : val.from_ticket_segments,
        cabinInfo: {},
      };
      let priceList = [
        index === 0 ? val.need_pay_amount : val.from_need_pay_amount,
      ];
      let priceNumber =
        index === 0 ? val.need_pay_amount : val.from_need_pay_amount;

      uni.navigateTo({
        url:
          "/pages/flightReservation/orderPay?orderId=" +
          JSON.stringify(orderId) +
          "&flightData=" +
          JSON.stringify(flightData) +
          "&priceList=" +
          JSON.stringify(priceList) +
          "&price=" +
          priceNumber +
          "&headerType=false" +
          "&type=false",
      });
    },

    //跳转到筛选页面
    goFilter(type) {
      uni.navigateTo({
        url: "/pages/order/filter?type=" + type,
      });
      this.orderList = [];
      this.innerList = [];
      this.getOrderList();
    
    },
    //获取国内外列表
    getOrderList() {
      this.backScroll();
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
            this.showDefault = false;
            if (this.orderList.length > 0) {
              this.orderList.push.apply(this.orderList, res.data.data);
            } else {
              this.orderList = res.data.data;
            }
            if (this.orderList.length < 1) {
              this.showDefault = true;
            }
            if (this.orderPageNumber >= res.data.last_page) {
              this.orderPageStatus = false;
            }
          } else {
            this.showDefault = true;
          }
        });
      } else if (this.orderListType === "0") {
        // 国内
        let data = {
          page: this.orderPageNumber,
          created_at: moment().subtract(3, "days").format("YYYY-MM-DD"),
        };
        orderApi.orderList(data).then((res) => {
          if (res.result === 10000) {
            this.showDefault = false;
            if (this.innerList.length > 0) {
              this.innerList.push.apply(this.innerList, res.data.data);
            } else {
              this.innerList = res.data.data;
            }
            this.innerList.forEach((item, index) => {
              if (item.is_round_last) {
                this.innerList.forEach((oitem, oindex) => {
                  if (
                    oitem.is_round_first &&
                    oitem.relevant_order_no === item.order_no
                  ) {
                    item["from_created_at"] = oitem.created_at;
                    item["from_pay_status"] = oitem.pay_status;
                    item["from_total_price"] = oitem.total_price;
                    item["from_order_no"] = oitem.order_no;
                    item["from_need_pay_amount"] = oitem.need_pay_amount;
                    item["from_ticket_segments"] = oitem.ticket_segments;

                    //剩余支付时间
                    item["from_status"] =
                      !this.$timeBefore(
                        new Date(oitem.created_at).getTime() + 30 * 60 * 1000
                      ) &&
                      oitem.pay_status === 1 &&
                      oitem.status === 1
                        ? 5
                        : oitem.status;
                  }
                });
              }

              //剩余支付时间
              item.status =
                !this.$timeBefore(
                  new Date(item.created_at).getTime() + 30 * 60 * 1000
                ) &&
                item.pay_status === 1 &&
                item.status === 1
                  ? 5
                  : item.status;
            });

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
              );
            }
            if (this.orderPageNumber >= res.data.last_page) {
              this.orderPageStatus = false;
            }

            this.innerList = this.innerList.filter(
              ({ is_round_first }) => !is_round_first
            );
            // this.innerList.splice(
            //   this.innerList.findIndex((item) => item.is_round_first === true),
            //   1
            // );

            this.showDefault = this.innerList.length < 1;
            console.log("缺省状态", this.showDefault, this.innerList);
          } else {
            this.showDefault = true;
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
    },

    // 跳转订单详情
    jumpOrderDetails(data, index, type) {
      console.log("详情", data);
      if (this.orderListType === "3") {
        uni.navigateTo({
          url:
            "/pages/order/orderDetails?orderData=" +
            JSON.stringify(data) +
            "&type=" +
            this.orderListType,
        });
      } else if (this.orderListType === "0") {
        // 国内
        uni.navigateTo({
          url:
            "/pages/order/orderinterDetails?orderNo=" +
            data.order_no +
            "&type=" +
            this.orderListType +
            "&roundType=" +
            (type ? index : ""),
        });
      }
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
      console.log(val);

      if (val === "create") {
        this.innerList.sort(this.createSort("created_at"));
      } else if (val === "depart") {
        this.innerList.sort(this.departSort("departure_time"));
      }
      this.backScroll();
    },

    // 航班信息滚动
    scroll(e) {
      this.oldScrollTop = e.detail.scrollTop;
    },

    // 航班信息返回顶部
    backScroll() {
      this.scrollTop = this.oldScrollTop;
      this.$nextTick(() => {
        this.scrollTop = 0;
      });
    },
  },
  onLoad(data) {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.orderListType = data.type;
    console.log(this.orderListType);
    console.log(data);
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
  },
  onHide() {
    this.orderList = [];
    this.innerList = [];
  },
  onShow() {
    // this.getOrderList();
    this.orderListFilter = uni.getStorageSync("orderListFilter");
    if (this.orderListFilter) {
      this.orderListFilter = JSON.parse(this.orderListFilter);
      //pnr筛选
      if (this.orderListFilter.pnr) {
        this.innerList = this.innerList.filter(
          (item) => item.pnr_code === this.orderListFilter.pnr
        );
      }
      //订单编号筛选
      if (this.orderListFilter.orderNumber) {
        this.innerList = this.innerList.filter(
          (item) => item.order_no === this.orderListFilter.orderNumber
        );
      }

      //航班号筛选
      if (this.orderListFilter.flightNumber) {
        this.innerList = this.innerList.filter(
          (item) =>
            item.ticket_segments[0].flight_no ===
            this.orderListFilter.flightNumber
        );
      }

      //订票员  选择框
      if (this.orderListFilter.booker) {
        this.innerList = this.innerList.filter(
          (item) => item.book_user === this.created_at.booker
        );
      }

      //出发城市筛选
      if (this.orderListFilter.Citystart) {
        this.innerList = this.innerList.filter(
          (item) =>
            item.ticket_segments[0].departure_CN.city_name ===
            this.orderListFilter.Citystart
        );
      }

      //到达城市筛选
      if (this.orderListFilter.Cityend) {
        this.innerList = this.innerList.filter(
          (item) =>
            item.ticket_segments[0].arrive_CN.city_name ===
            this.orderListFilter.Cityend
        );
      }

      //日始时间筛选
      if (this.orderListFilter.Timestart) {
        this.innerList = this.innerList.filter(
          (item) =>
            moment(item.ticket_segments[0].departure_time).format(
              "YYYY-MM-DD"
            ) === this.orderListFilter.Timestart
        );
      }

      //日止时间筛选
      if (this.orderListFilter.Timend) {
        this.innerList = this.innerList.filter(
          (item) =>
            moment(item.ticket_segments[0].departure_time).format(
              "YYYY-MM-DD"
            ) === this.orderListFilter.Timend
        );
      }

      //日期条件排序
      if (this.orderListFilter.date !== null) {
        this.sorTime(this.orderListFilter.date);
      }

      //订单状态筛选
      if (this.orderListFilter.status !== null) {
        this.checkedHeaderActive(this.orderListFilter.status);
      }

      console.log("订单列表筛选", this.innerList);

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
