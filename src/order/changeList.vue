<!--
 * @Author: mzr
 * @Date: 2020-11-18 11:51:20
 * @LastEditTime: 2020-12-04 09:26:07
 * @LastEditors: Please set LastEditors
 * @Description: 国内改签列表
 * @FilePath: \positiond:\tests\fission\yunshang_fission\src\order\changeList.vue
-->
<template>
  <view class="order_list">

    <yun-header :statusHeight="iStatusBarHeight" :centerTitle="orderHeaderTitle"></yun-header>

    <view class="order_header">
      <view
        :class="['header_list', { active: headerActive === index }]"
        v-for="(item, index) in changeList"
        :key="index"
        @click="checkedHeaderActive(index)"
        >{{ item }}</view>
    </view>
    
    <!-- 筛选条件 -->
    <view class="order_filter">
      <view 
      :class="['filter_list',{ active: orderFilterStatus },]" 
      @click="sorTime()">
        <view class="list_icon">
          <image
            v-if="orderFilterStatus"
            src="@/static/filter_apply_btn_active.png"
            mode="contain"
          />
          <image v-else src="@/static/filter_apply_btn.png" mode="contain" />
        </view>
        <view class="list_title">申请(早-晚)</view>
      </view>

      <view 
      :class="[
          'filter_list',
          { active: JSON.stringify(changeListFilter) !== '{}' },
      ]"  
      @click="goFilter('2')">
        <view class="list_icon">
          <image
            v-if="JSON.stringify(changeListFilter) !== '{}'"
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
      class="content"
      @scrolltolower="nextPageData()"
    >

        <view class="content_list"
        v-for="(item, index) in changeOrderList"
        :key="index"
        >
      
          <view class="list_item" @click.stop="jumpChangeDetails(item)">
            <view class="item_header">
              <view class="item_title">
                <view class="title">
                  {{ item.change_segments[0].departure_CN.city_name }} -
                  {{ item.change_segments[0].arrive_CN.city_name }}</view>
              </view>
              <view class="item_price">
                <text>&yen;</text>
                {{ item.ticket_price || "金额错误" }}
              </view>
            </view>
            <view class="item_info">
              <view class="info_left">
                <text>{{ item.change_segments[0].flight_no }}</text>
                <text>{{
                  $dateTool(item.change_segments[0].departure_time, "MM月DD日")
                }}</text>
                <!-- HH:mm 24制   hh:mm 12制 -->
                <text
                  >{{
                    $dateTool(item.change_segments[0].departure_time, "HH:mm")
                  }}起飞</text
                >
              </view>
              <view class="info_right">
                {{
                    
                    item.change_status === 1 
                    ? "申请中"
                    : item.change_status === 2
                    ? "待支付"
                    : item.change_status === 3
                    ? "待出票"
                    : item.change_status === 4
                    ? "已完成"
                    : ""
                }}
              </view>
            </view>

            <view class="item_time" v-if="item.change_status === 2">
              <view class="time_icon">
                <image src="@/static/remaining_time.png" mode="aspectFit" />
              </view>
              <view class="time_text">剩余支付时间：</view>
              <view class="time_number">
                {{
                  item.overdue_time
                }}分钟
              </view>
            </view>
            <view
              class="item_btn_box"
              v-if="item.change_status === 2">
              <view class="item_btn submit_btn"
              @click.stop="jumpOrderPay(item)"
              >去支付</view>
            </view>
          </view>
        </view>

        <!-- 缺省页 -->
        <default-page v-if="showDefault" defaultType="not_order"></default-page>

        <view class="no_data" v-if="!orderPageStatus && !showDefault ">
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

            orderHeaderTitle:"国内改签单",

            changeList:['全部','申请中','待支付','待出票','已完成'], //改签列表类别

            headerActive: 0, // 订单类别默认值 全部
            orderPageNumber: 1, // 当前订单页数
            orderPageStatus: true, // 是否允许加载下一页数据

            changeOrderList:[], //改签列表
            changeListFilter:{}, //筛选条件

            scrollTop: 0, // 列表滚动值
            oldScrollTop: 0,

            orderFilterStatus: false,
            showDefault: false, // 缺省页
        }

    },

    methods: {

        checkedHeaderActive(index) {

            this.headerActive = index;
            this.orderPageNumber = 1;
            this.changeOrderList = []; 
            this.getChangeList();
    
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

        // 待支付状态 去支付
        jumpOrderPay(val) {

          console.log(this.changeOrderList)
          let orderId = [val.order_no];
          let priceList = [val.need_pay_amount];
          let priceNumber = val.need_pay_amount;
          let flightData = {
            flightType: '单程',
            data: val.change_segments,
            cabinInfo: {},
          };
          let passengerList = []
          val.change_passengers.forEach(item =>{
            passengerList.push(item.ticket_passenger)
          })
          uni.navigateTo({
            url:
              "/flightReservation/orderPay?orderId=" +
              JSON.stringify(orderId) +
              "&flightData=" +
              JSON.stringify(flightData) +
              "&priceList=" +
              JSON.stringify(priceList) +
              "&price=" +
              priceNumber +
              "&passMessage=" +
              JSON.stringify(passengerList) +
              "&headerType=false" +
              "&type=false",        
          });
        },

        // 获取改签列表
        getChangeList() {

          this.orderPageStatus = true;

          let data = {
            pnr_code:this.changeListFilter.pnrNumber || "", //pnr
            change_status:this.headerActive === 0
                            ?""
                            : this.headerActive === 1
                            ?1
                            : this.headerActive === 2
                            ?2
                            : this.headerActive === 3
                            ?3
                            : this.headerActive, // 订单状态
            created_at:this.changeListFilter.Timestart || moment().subtract(3, "years").format("YYYY-MM-DD"), // 申请开始
            created_at_end:this.changeListFilter.Timend || moment().format("YYYY-MM-DD"), // 申请结束
            page:this.orderPageNumber, //   页数 
            order_no:this.changeListFilter.orderNumber || "", //订单号
            ticket_no:this.changeListFilter.ticketNumber || "", // 票号
            passenger_name:this.changeListFilter.passengerName || "", // 乘机人
            passenger_type:this.changeListFilter.passengerType || "",	// 乘客类型

            order_by: this.orderFilterStatus?'asc':'desc', // desc倒叙，asc升序
            order_by_field: "created_at",
          }


          orderApi.changeList(data).then((res) => { 
            if(res.result ===  10000){
              this.showDefault = false;
              if (this.orderPageStatus) {
                this.changeOrderList.push.apply(this.changeOrderList, res.data.data);
              } else {
                this.changeOrderList = res.data.data;
                this.orderPageStatus = true;
              }
              console.log('改签列表数据',this.changeOrderList)
              if (this.changeOrderList.length < 1) {
                this.showDefault = true;
              }
              if (this.orderPageNumber >= res.data.last_page) {
                this.orderPageStatus = false;
              }
            } else {
              this.showDefault = true;
              uni.showToast({
                title: res.msg,
                icon: "none",
              });
            }
            
          
          });


        },

        //时间排序
        sorTime() {
          this.orderFilterStatus = !this.orderFilterStatus;
          this.changeOrderList = []; //退票列表
          this.getChangeList();
          this.backScroll();

          console.log(this.orderFilterStatus);
        },

        // 跳转到详情页
        jumpChangeDetails(data) {

          uni.navigateTo({

            url: '/order/changeDetails?changeData=' + JSON.stringify(data),
          
          })

        },

        // 跳转到筛选页面
        goFilter(type) {

          uni.navigateTo({
            url:'/order/filter?type=' +
            type +
            "&changeData=" +
            JSON.stringify(this.changeListFilter),
          })

        },

        // 下一页数据
        nextPageData() {
          if (this.orderPageStatus) {
            this.orderPageNumber = this.orderPageNumber + 1;
            this.getChangeList();
          }
        },
    },

    onLoad(data) {
            this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    },

    onHide() {
      this.changeOrderList = [];
      this.orderPageStatus = false;
    },

    onShow() {
      

      if (uni.getStorageSync("orderListFilter")) {
        this.changeListFilter = JSON.parse(uni.getStorageSync("orderListFilter"));
        uni.removeStorageSync("orderListFilter");
        if (
          this.changeListFilter.change_status &&
          this.changeListFilter.change_status !== null
        ) {
          this.checkedHeaderActive(this.changeListFilter.change_status);
        } else {
          this.checkedHeaderActive(0);
        }
        console.log("改签筛选条件", this.changeListFilter);
      } else {
        this.headerActive = 0;
        this.getChangeList();
        this.backScroll();
      }
    },
    
}
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

