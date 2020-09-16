<!--
 * @Description: 已出票订单退票页面
 * @Author: wish.WuJunLong
 * @Date: 2020-08-17 10:31:20
 * @LastEditTime: 2020-09-16 18:26:24
 * @LastEditors: mazhengrong
-->
<template>
  <view class="refund">
    <yun-header
      :statusHeight="iStatusBarHeight"
      centerTitle="退票"
    ></yun-header>
    <!-- 正文 -->
    <scroll-view :enable-back-to-top="true" :scroll-y="true" class="content">
      <!-- 退票信息 -->
      <refundTop :dataList="list" @submitBtn="submit"></refundTop>
      <!-- 特别提醒 -->
      <view class="sep_list">
        <view class="list_icon">
          <image src="@/static/refund_warn.png" mode="aspectFit" />
        </view>
        <view class="list_title">国际退票特别提醒</view>
        <view class="list_right">
          <image src="../../static/refund_right.png" mode="aspectFit"></image>
        </view>
      </view>
      <!-- 航班信息 -->
      <view
        class="main_list filght_info"
        v-for="(item, index) in orderDetails.ticket_segments"
        :key="index"
      >
        <view class="main_list_title">航班信息</view>
        <view class="info_header">
          <view class="header_type">
            {{
              orderDetails.segment_type === 1
                ? "单程"
                : orderDetails.segment_type === 2
                ? "往返"
                : orderDetails.segment_type === 3
                ? "多程"
                : ""
            }}</view
          >
          <view class="header_time">
            {{ item.departure_time.substring(0, 10) }}
            <text>{{ $dateTool(item.departure_time, "ddd") }}</text>
          </view>
        </view>
        <view class="info_message">
          <view class="message_box">
            <view class="date">{{
              item.departure_time.substring(11, 16)
            }}</view>
            <view class="address"
              >{{ item.departure_CN.city_name
              }}{{ item.departure_CN.air_port_name }}</view
            >
          </view>

          <view class="message_center">
            <view class="date">
              {{ Math.floor(item.duration / 3600) }}h{{
                Math.floor((item.duration / 60) % 60)
              }}m
            </view>
            <view class="center_icon"></view>
            <view class="type">直飞</view>
          </view>

          <view class="message_box">
            <view class="date">{{ item.arrive_time.substring(11, 16) }}</view>
            <view class="address"
              >{{ item.arrive_CN.city_name
              }}{{ item.arrive_CN.air_port_name }}</view
            >
          </view>
        </view>

        <view class="filght_message">
          <!-- 航班图标 -->
          <view class="message_icon">
            <image
              class="message_icon"
              :src="'https://fxxcx.ystrip.cn/' + item.image"
              mode="contain"
            />
          </view>
          <view class="message_list">{{ item.flight_no }}</view>
          <view class="message_list">{{ item.model }}</view>
          <view class="message_list">有早餐</view>
        </view>

        <view class="filght_bottom">
          <view class="bottom_list">
            {{ item.cabin
            }}{{
              item.cabin_level === "ECONOMY"
                ? "经济舱"
                : item.cabin_level === "FIRST"
                ? "头等舱"
                : item.cabin_level === "BUSINESS"
                ? "公务舱"
                : ""
            }}</view
          >
          <view class="bottom_list">退改签规则</view>
          <view class="bottom_list">每人托运2件，每件23KG</view>
        </view>
      </view>
      <!-- 出行信息 -->
      <view class="main_list passenger">
        <view :class="['main_list_first', { active }]">
          <view class="main_list_title">出行信息</view>
          <view class="main_content" @click="checkedAll()">全选</view>
          <view class="list_click"></view>
        </view>
        <view class="passenger_list">
          <view
            :class="['list_item', { active: item.active }]"
            v-for="(item, index) in orderDetails.ticket_passenger"
            :key="index"
            @click="checkedPassenger(item, index)"
          >
            <view class="list_info">
              <view class="info_type"
                >{{
                  item.PassengerType === "ADT"
                    ? "成人"
                    : item.PassengerType === "CNN"
                    ? "儿童"
                    : item.PassengerType === "INF"
                    ? "婴儿"
                    : ""
                }}票</view
              >
              <view class="info_name">{{ item.PassengerName }}</view>
              <view class="is_insurance" v-if="item.insure_count > 0"></view>
              <view class="group_type">票号</view>
              <view class="group_number">{{ item.ticket_no }}</view>
              <view class="list_click"></view>
            </view>
          </view>
        </view>

        <view class="contact">
          <view class="contact_list">
            <view class="list_title">联系人</view>
            <view class="list_message">{{ orderDetails.out_ticket_name }}</view>
          </view>
          <view class="contact_list">
            <view class="list_title">联系电话</view>
            <view class="list_message">{{ orderDetails.phone }}</view>
          </view>
          <view class="contact_list">
            <view class="list_title">已购保险</view>
            <view class="list_message">{{ orderDetails.insurance_total }}元</view>
          </view>
        </view>
      </view>
      <!-- 退票信息 金额参考/备注 -->
      <view class="refund_top">
        <view class="top_message">退票信息</view>
        <view class="middle_message">
          <view class="message_first">退票金额参考</view>
          <view
            class="message_bottom input-right-arrow"
            @click="openGroupSelect">
            <!-- <text v-if="group" class="group_message">{{ orderDetails.total_price }}</text> -->
            <text class="logo">&yen;</text>
			<text class="total_price">{{ orderDetails.total_price }}</text>
          </view>
        </view>
        <view class="middle_message">
          <view class="message_first">退废票备注</view>
          <view
            class="message_bottom input-right-arrow"
            @click="openGroupSelect">
            <text v-if="group" class="group_message">{{ group }}</text>
            <text v-else class="not_message">点开添加备注后显示在这...</text>
          </view>
        </view>
      </view>
      <!-- 订单信息 -->
      <view class="main_list order_message">
        <view class="main_list_title">订单信息</view>
        <view class="message_list">
          <view class="list_item">
            <view class="item_title">订单编号</view>
            <view class="item_message">{{ orderDetails.order_no }}</view>
          </view>
          <view class="list_item">
            <view class="item_title">PNR</view>
            <view class="item_message">{{ orderDetails.pnr_code }}</view>
          </view>
          <view class="list_item">
            <view class="item_title">订票员</view>
            <view class="item_message">{{ orderDetails.book_user }}</view>
          </view>
          <view class="list_item">
            <view class="item_title">预定时间</view>
            <view class="item_message">{{ orderDetails.created_at }}</view>
            <!-- 时间 -->
          </view>
          <view class="list_item">
            <view class="item_title">备注</view>
            <view class="item_message input-right-arrow">无</view>
          </view>
        </view>
      </view>
    </scroll-view>
    <!-- 提交申请按钮 -->
    <view class="filter_bottom">
      <view class="bottom_btn submit_btn">提交申请</view>
    </view>
  </view>
</template>

<script>
import orderApi from "@/api/order.js";
import moment from "../../moment";
moment.locale("zh-cn");
import refundTop from "@/components/refund_top.vue"; //退票信息
export default {
  components: {
    refundTop,
  },
  data() {
    return {
      iStatusBarHeight: 0,

      orderDetails: {}, // 订单详情

      checkedPassengerlist: [], // 选中乘客列表
    };
  },
  methods: {
    // 是否自愿点击
    submit(val) {
      console.log(val);
    },

    // 选择联系人
    checkedPassenger(val, index) {
		console.log(val, index)
		// 判断当前数据是否有active属性，如果有，就赋值为相反状态
      this.$set(this.orderDetails.ticket_passenger[index],"active",!val.active);
	
		// 判断当前数据active状态
      if (this.orderDetails.ticket_passenger[index].active) {
		//   如果为true就push进选中列表
        this.checkedPassengerlist.push(val);
      } else {
		//   如果为false就从选中列表删除
		  this.checkedPassengerlist.splice(this.checkedPassengerlist.findIndex(item => item.id === val.id),1)
      }

      console.log(this.checkedPassengerlist);
      // this.checkedPassengerList
    },

    // 全选联系人
    checkedAll() {
		// 判断选中的乘客人数是否和数据携带全部人数相同
      if (this.orderDetails.ticket_passenger.length === this.checkedPassengerlist.length) {
		//   如果相同 清空选中列表 并且遍历乘客数组 将状态全部赋值为false
        this.checkedPassengerlist = [];
        this.orderDetails.ticket_passenger.forEach((item) => {
          item.active = false;
        });
      } else {
		//   如果不相同 遍历乘客列表 全部赋值为 true ，并将乘客列表数组赋值给选中乘客列表
		  this.orderDetails.ticket_passenger.forEach((item) => {
          item.active = true;
		});
		// 双向绑定   splice
		this.checkedPassengerlist = JSON.parse(JSON.stringify(this.orderDetails.ticket_passenger)) 
        
      }
	console.log(this.checkedPassengerlist)
      this.$forceUpdate();
    },
  },
  onLoad(data) {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    let refundData = JSON.parse(data.refundData);
    console.log("refund", refundData);
    this.orderDetails = refundData;
  },
};
</script>

<style lang="less" scoped>
.refund {
  background: rgba(243, 245, 247, 1);
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  .content {
    flex: 1;
    overflow-y: auto;
    //  padding-bottom: calc(144upx + var(--status-bar-height));
  }

  .sep_list {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: start;
    box-sizing: border-box;
    overflow-y: auto;
    border-radius: 10upx;
    width: 710upx;
    height: 60upx;
    background-color: RGBA(244, 236, 226, 1);
    z-index: 1;
    margin-left: 23upx;
    padding: 0 20rpx;
    .list_icon {
      width: 24upx;
      height: 24upx;
      display: inline-flex;
      margin-right: 10upx;
      image {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    .list_right {
      width: 24upx;
      height: 24upx;
      margin-left: auto;
      display: inline-flex;
      image {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    .list_title {
      font-size: 24upx;
      font-weight: 400;
      color: rgba(251, 152, 38, 1);
    }
  }
  .main_list {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 12upx 18upx rgba(0, 0, 0, 0.04);
    border-radius: 20upx;
    margin: 20upx 20upx 20upx;
    padding: 24upx 20upx 20upx;
    font-weight: bold;
    .main_list_first {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .main_list_title {
        font-size: 32upx;
        font-weight: bold;
        color: rgba(42, 42, 42, 1);
        margin-bottom: 24rpx;
        padding-top: 24rpx;
        flex: 1;
        justify-content: flex-end;
      }
      &.active {
        .list_click {
          background: url(@/static/selected_active.png) no-repeat;
          background-size: contain;
        }
      }
      .main_content {
        font-size: 14px;
        font-weight: 400;
        color: rgba(175, 185, 196, 1);
        margin-right: 5px;
      }
      .list_click {
        background: url(@/static/selected.png) no-repeat;
        background-size: contain;
        width: 40upx;
        height: 40upx;
      }
    }
    &.filght_info {
      .info_header {
        display: flex;
        align-items: center;
        margin-bottom: 20upx;
        .header_type {
          width: 80upx;
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
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-right: 12upx;
        }
        .header_time {
          font-size: 24upx;
          font-weight: 400;
          color: rgba(42, 42, 42, 1);
          text {
            margin-left: 12upx;
          }
        }
      }
      .info_message {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 26upx;
        .message_box {
          .date {
            font-size: 36upx;
            font-weight: bold;
            color: rgba(42, 42, 42, 1);
            margin-bottom: 4upx;
          }
          .address {
            font-size: 24upx;
            font-weight: 400;
            color: rgba(42, 42, 42, 1);
          }
        }
        .message_center {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          .date {
            font-size: 22upx;
            font-weight: 400;
            color: rgba(175, 185, 196, 1);
          }
          .center_icon {
            width: 112upx;
            height: 20upx;
            background: url(@/static/ticket_path.png) no-repeat center center;
            background-size: contain;
            display: block;
          }
          .type {
            font-size: 22upx;
            font-weight: 400;
            color: rgba(175, 185, 196, 1);
          }
        }
      }
      .filght_message {
        display: flex;
        align-items: center;
        justify-content: center;
        .message_icon {
          width: 24upx;
          height: 24upx;
          object-fit: contain;
          margin-right: 6upx;
          display: flex;
        }
        .message_list {
          font-size: 22upx;
          font-weight: 400;
          color: rgba(175, 185, 196, 1);
          display: inline-flex;
          align-items: center;
          &:not(:last-child) {
            &::after {
              content: "";
              display: block;
              width: 2upx;
              height: 20upx;
              background: rgba(217, 225, 234, 1);
              margin: 0 8upx;
            }
          }
        }
      }
      .filght_bottom {
        display: flex;
        align-items: center;
        border-top: 2upx dashed rgba(217, 225, 234, 1);
        margin-top: 20upx;
        padding-top: 20upx;
        justify-content: center;
        .bottom_list {
          font-size: 24upx;
          font-weight: 400;
          color: rgba(175, 185, 196, 1);
          display: inline-flex;
          align-items: center;
          &:not(:last-child) {
            &::after {
              content: "";
              display: block;
              width: 2upx;
              height: 20upx;
              background: rgba(217, 225, 234, 1);
              margin: 0 8upx;
            }
          }
        }
      }
    }
    &.passenger {
      .passenger_list {
        margin-top: 46upx;
        .list_item {
          &.active {
            .list_info {
              .list_click {
                background: url(@/static/selected_active.png) no-repeat;
                background-size: contain;
              }
            }
          }
          &:not(:last-child) {
            margin-bottom: 60upx;
          }
          &:last-child {
            padding-bottom: 32upx;
            border-bottom: 2upx solid rgba(241, 243, 245, 1);
            margin-bottom: 30upx;
          }
          .list_info {
            display: flex;
            align-items: center;
            margin-bottom: 34upx;
            justify-content: space-between;
            .info_type {
              width: 100upx;
              height: 30upx;
              border: 2upx solid rgba(127, 183, 240, 1);
              border-radius: 20upx;
              font-size: 20upx;
              font-weight: 400;
              color: rgba(127, 183, 240, 1);
              display: inline-flex;
              align-items: center;
              justify-content: center;
            }
            .info_name {
              font-size: 28upx;
              font-weight: bold;
              color: rgba(42, 42, 42, 1);
            }
            .is_insurance {
              background: url(@/static/insurance_icon.png) no-repeat center
                center;
              background-size: contain;
              width: 25upx;
              height: 30upx;
            }
            .group_type {
              margin-left: 28upx;
              font-size: 28upx;
              font-weight: 400;
              color: #333333;
              margin-right: -12px;
            }
            .group_number {
              font-weight: bold;
              font-size: 14px;
              color: #2a2a2a;
            }
            .list_click {
              background: url(@/static/selected.png) no-repeat;
              background-size: contain;
              width: 40upx;
              height: 40upx;
            }
          }
          .list_message {
            display: flex;
            align-items: center;
            .message_title {
              font-size: 28upx;
              font-weight: 400;
              color: rgba(42, 42, 42, 1);
              margin-right: 32upx;
            }
            .message_number {
              font-size: 28upx;
              font-weight: bold;
              color: rgba(42, 42, 42, 1);
            }
          }
        }
      }
      .contact {
        .contact_list {
          display: flex;
          align-items: center;
          &:not(:last-child) {
            margin-bottom: 36upx;
          }
          .list_title {
            font-size: 28upx;
            font-weight: 400;
            color: rgba(102, 102, 102, 1);
            width: 132upx;
          }
          .list_message {
            font-size: 28upx;
            font-weight: bold;
            color: rgba(42, 42, 42, 1);
          }
        }
      }
    }
    &.certificate {
      .certificate_message {
        margin-top: 32upx;
        // border-top: 2upx solid #f1f3f5;
        padding-top: 34upx;
        display: flex;
        align-items: center;
        .message_title {
          font-size: 28upx;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          margin-right: 40upx;
        }
        .message_text {
          font-size: 28upx;
          font-weight: 400;
          color: rgba(42, 42, 42, 1);
        }
      }
    }
    &.order_message {
      .message_list {
        margin-top: 40upx;
        .list_item {
          display: flex;
          align-items: center;
          &:not(:last-child) {
            margin-bottom: 30upx;
          }
          .item_title {
            font-size: 24upx;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
            width: 100upx;
          }
          .item_message {
            flex: 1;
            text-align: right;
            font-size: 24upx;
            font-weight: 400;
            color: rgba(42, 42, 42, 1);
          }
        }
      }
    }
  }

  .refund_top {
    border-radius: 20upx;
    background: rgba(255, 255, 255, 1);
    margin: 20upx 20upx 20upx;
    padding: 24upx 20upx 20upx;

    .top_message {
      display: flex;
      align-items: center;
      margin-bottom: 24upx;
      padding-top: 24upx;
      color: rgba(42, 42, 42, 1);
      font-size: 32upx;
      font-weight: Bold;
    }
    .middle_message {
      display: flex;
      align-items: center;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      height: 100upx;
      &:not(:last-child) {
        border-bottom: 2upx solid #f1f3f5;
      }
      &:first-child {
        padding-bottom: 34upx;
      }
      .message_first {
        font-size: 28upx;
        display: flex;
        justify-content: start;
        margin-right: 26upx;
        line-height: 17px;
        margin-right: 40upx;
      }
      .message_bottom_radio {
        font-size: 28upx;
        flex: 1;
        display: flex;
        justify-content: space-between;
        .bottom_radio_list {
          flex: 1;
          display: flex;
          justify-content: flex-start;
          .radio:first-child {
            margin-right: 100upx;
          }
        }
	  }
	  .logo {
		  margin-top: 10rpx;
	  }
      .message_bottom {
        font-size: 28upx;
        color: rgba(42, 42, 42, 1);
        width: 240px;
        display: inline-flex;
        justify-content: flex-end;
        flex: 1;
        .group_message {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: right;
		}
		.total_price {
			color: rgba(255, 0, 0, 1);
			font-size: 21px;
			font-weight: bold;
		}
      }
    }
  }
  .filter_bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    //   position: fixed;
    border-top: 2upx solid rgba(229, 229, 229, 1);
    bottom: 0;
    left: 0;
    width: 100vw;
    height: calc(144upx + var(--status-bar-height));
    //   padding: 90upx 45upx;
    padding-bottom: var(--status-bar-height);
    box-sizing: border-box;
    background: #fff;
    z-index: 1;
    .bottom_btn {
      width: 650upx;
      height: 90upx;
      border: 2upx solid transparent;
      border-radius: 80upx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32upx;
      font-weight: 400;
      &.submit_btn {
        background: linear-gradient(
          90deg,
          rgba(0, 112, 226, 1) 0%,
          rgba(86, 197, 255, 1) 100%
        );
        box-shadow: 0 6upx 12upx rgba(0, 112, 226, 0.3);
        color: rgba(255, 255, 255, 1);
        letter-spacing: 8upx;
      }
    }
  }
}
</style>
