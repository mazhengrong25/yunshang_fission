<!--
 * @Description: 
 * @Author: wish.WuJunLong
 * @Date: 2020-08-04 16:23:02
 * @LastEditTime: 2020-08-04 18:41:19
 * @LastEditors: wish.WuJunLong
-->
<!--
 * @Description: 订单列表页
 * @Author: wish.WuJunLong
 * @Date: 2020-08-04 16:23:02
 * @LastEditTime: 2020-08-04 18:27:23
 * @LastEditors: wish.WuJunLong
-->
<template>
  <view class="order_list">
    <yun-header :showReturn="false" :statusHeight="iStatusBarHeight" centerTitle="国内订单"></yun-header>
    <view class="order_header">
      <view
        :class="['header_list',{'active': headerActive === index}]"
        v-for="(item, index) in headerList"
        :key="index"
        @click="checkedHeaderActive(index)"
      >{{item}}</view>
    </view>

    <view class="order_filter">
      <view class="filter_list">
        <view class="list_icon">
          <image src="@/static/filter_time_active.png" mode="aspectFit" />
        </view>
        <view class="list_title">预定(早-晚)</view>
      </view>

      <view class="filter_list">
        <view class="list_icon">
          <image src="@/static/filter_setoff.png" mode="aspectFit" />
        </view>
        <view class="list_title">出发(早-晚)</view>
      </view>

      <view class="filter_list">
        <view class="list_icon">
          <image src="@/static/filter_btn_active.png" mode="aspectFit" />
        </view>
        <view class="list_title">筛选(早-晚)</view>
      </view>
    </view>

    <scroll-view :scroll-y="true" class="content">
      <!-- 国内机票盒子 -->
      <!-- <view class="content_list">
        <view class="list_tyle">{{item.routing_type === 1? '单程机票': item.routing_type === 2? '往返机票': item.routing_type === 3? '多程机票': ''}}</view>
        <view class="list_item" v-for="(oitem, oindex) in item.routes" :key="oindex">
          <view class="item_header">
            <view class="item_title">
              <view class="title_type" v-if="item.routes.length > 1">{{item.direction_type === 1?'去程':item.direction_type === 2?'回程':item.direction_type === 3?'第'+(oindex + 1)+'程':''}}</view>
              <view class="title">{{oitem.departure}} - {{otem.arrive}}</view>
            </view>
            <view class="item_perice">
              <text>&yen;</text>{{item.need_pay_amount}}
            </view>
          </view>
          <view class="item_info">
            <view class="info_left">
              <text>{{oitem.flight_no}}</text>
              <text>{{moment(oitem.departure_time).format("MM月DD日")}}</text>
              <text>{{moment(oitem.departure_time).format("hh:mm")}}起飞</text>
            </view>
            <view class="info_right">已预定</view>
          </view>

          <view class="item_time">
            <view class="time_icon">
              <image src="@/static/remaining_time.png" mode="aspectFit" />
            </view>
            <view class="time_text">剩余时间：</view>
            <view class="time_number">15分钟</view>
          </view>

          <view class="item_btn_box">
            <view class="item_btn close_btn">取消订单</view>
            <view class="item_btn submit_btn">去支付</view>
          </view>
        </view>
      </view>-->

      <!-- 国际机票盒子 -->
      <view class="content_list" v-for="(item, index) in orderList" :key="index">
        <view
          class="list_tyle"
        >{{item.routing_type === 1? '单程机票': item.routing_type === 2? '往返机票': item.routing_type === 3? '多程机票': ''}}</view>
        <view class="list_item" v-for="(oitem, oindex) in item.routes" :key="oindex">
          <view class="item_header">
            <view class="item_title">
              <view
                class="title_type"
                v-if="item.routes.length > 1"
              >{{oitem.direction_type === 1?'去程':oitem.direction_type === 2?'回程':item.direction_type === 3?'第'+(oindex + 1)+'程':''}}</view>
              <view class="title">{{oitem.departure}} - {{oitem.arrive}}</view>
            </view>
            <view class="item_perice">
              <text>&yen;</text>
              {{item.need_pay_amount}}
            </view>
          </view>
          <view class="item_info">
            <view class="info_left">
              <text>{{oindex === 0? oitem.inter_segments[0].flight_no: oindex === item.routes.length? oitem.inter_segments[item.routes.length].flight_no: ''}}</text>
              <text>{{$dateTool(oitem.departure_time,"MM月DD日")}}</text>
              <text>{{$dateTool(oitem.departure_time,"hh:mm")}}起飞</text>
            </view>
            <view class="info_right">
							{{item.status === 1? '已预订':
							item.status === 2? '待出票':
							item.status === 3? '已出票':
							item.status === 5? '已取消': ''}}
						</view>
          </view>

          <view class="item_time">
            <view class="time_icon">
              <image src="@/static/remaining_time.png" mode="aspectFit" />
            </view>
            <view class="time_text">剩余时间：</view>
            <view class="time_number">15分钟</view>
          </view>

          <view class="item_btn_box">
            <view class="item_btn close_btn">取消订单</view>
            <view class="item_btn submit_btn">去支付</view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import orderApi from "@/api/order.js";
export default {
  data() {
    return {
      iStatusBarHeight: 0,
      headerList: ["全部", "已预订", "待出票", "已出票", "已取消"], // 订单列表类别
      headerActive: 0, // 订单类别默认值 全部
      orderPageNumber: 1, // 当前订单页数
      orderList: [], // 订单列表数据
    };
  },
  methods: {
    checkedHeaderActive(index) {
      this.headerActive = index;
    },

    getOrderList() {
      let data = {
        status:
          this.headerActive === 0
            ? "-1"
            : this.headerActive === 4
            ? 5
            : this.headerActive,
        page: this.orderPageNumber,
      };
      orderApi.orderInterList().then((res) => {
        if (res.errorcode === 10000) {
          this.orderList = res.data.data;
          console.log(this.orderList);
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      });
    },
  },
  onLoad() {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.getOrderList();
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
      padding: 10upx 40upx;
      &:not(:last-child) {
        border-right: 2upx solid #eaeaea;
      }
      .list_icon {
        width: 30upx;
        height: 30upx;
        margin-right: 8upx;
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
      .list_item {
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 12upx 18upx rgba(0, 0, 0, 0.04);
        border-radius: 20upx;
        padding: 20upx 20upx 40upx;
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
            }
            .title {
              font-size: 34upx;
              font-weight: bold;
              color: rgba(42, 42, 42, 1);
            }
          }
          .item_perice {
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
