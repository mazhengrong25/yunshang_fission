<!--
 * @Description: 火车票(已出票) --- 退票 
 * @Author: mzr
 * @Date: 2021-08-30 13:45:01
 * @LastEditTime: 2021-09-27 16:40:25
 * @LastEditors: mzr
-->
<template>
  <view class="train_refund">
    <yun-header
      :statusHeight="iStatusBarHeight"
      :centerTitle="orderHeaderTitle"
    ></yun-header>

    <scroll-view :enable-back-to-top="true" :scroll-y="true" class="content">
      <!-- 车次信息 -->
      <view class="train_class">
        <trainMessageCard :trainObject="passTrainItem" :isCabin="true" :seatObject="passTrainSingle" :isRule="true" titleType="refund"></trainMessageCard>  
      </view>
      <!-- 出行信息 -->
      <view class="main_list passenger">
        <view class="main_list_first">
          <view class="main_list_title">出行信息</view>
          <view
            @click="checkedAll()"
            :class="['checked_all_btn', { active: checkedAllStatus }]"
          >
            <view class="main_content">全选</view>
            <view class="list_click"></view>
          </view>
        </view>
        <view class="passenger_list">
          <view
            :class="['list_item', { active: item.active }]"
            v-for="(item, index) in passValueObject.passengers"
            :key="index"
            @click="checkedPassenger(item, index)"
          >
            <view class="list_info">
              <view class="info_message">
                <view class="info_type"
                  >{{
                    item.PassengerType === "ADT"
                      ? "成人"
                      : item.PassengerType === "CHD"
                      ? "儿童"
                      : ""
                  }}票</view
                >
                <view class="info_name">{{ item.PassengerName }}</view>
                <view
                  class="is_insurance"
                  :style="{opacity:Number(item.is_insurance) === 1?'':'0'}"
                ></view>
                <view class="group_type">座位号</view>
                <view class="group_number">{{ item.seat_info.replace("厢,","") }}</view>
              </view>
              <view class="list_click"></view>
            </view>
            <view class="list_other">
              <view class="other_title">票号</view>
              <view class="other_value">{{item.ticket_no}}</view>
            </view>
          </view>
        </view>

        <view class="contact">
          <view class="contact_list">
            <view class="list_title">联系人</view>
            <view class="list_message">{{ passValueObject.contact }}</view>
          </view>
          <view class="contact_list">
            <view class="list_title">联系电话</view>
            <view class="list_message">{{ passValueObject.phone }}</view>
          </view>
          <view class="contact_list">
            <view class="list_title">已购保险</view>
            <view class="list_message">{{ passValueObject.insurance_price }}元</view>
          </view>
        </view>
      </view>
      <!-- 订单信息 -->
      <view class="main_list order_message">
        <view class="main_list_title">订单信息</view>
        <view class="message_list">
          <view class="list_item">
            <view class="item_title">订单编号</view>
            <view class="item_message">{{ passValueObject.order_no }}</view>
          </view>
          <view class="list_item">
            <view class="item_title">订票员</view>
            <view class="item_message">{{ passValueObject.book_user }}</view>
          </view>
          <view class="list_item">
            <view class="item_title">预定时间</view>
            <view class="item_message">{{ passValueObject.created_at }}</view>
          </view>
          <view class="list_item" @click="openRemark()">
            <view class="item_title">备注</view>
            <view v-if="trainRefundRemark" class="item_message">{{trainRefundRemark}}</view>
            <view v-else class="item_message input-right-arrow"></view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 提交申请按钮 -->
    <view class="filter_bottom">
      <view class="bottom_btn submit_btn" @click="submitRefund">提交申请</view>
    </view>
    <!-- 退票信息弹窗 -->
    <trainConfirmRefund
      ref="trainConfirmRefund"
      :trainObject="passValueObject"
      :passengerArray="checkedPassengerlist"
      @confirmRefund="getRefund"
    ></trainConfirmRefund>
  </view>
</template>

<script>
import orderApi from "@/api/order.js";
import trainMessageCard from '@/components/train_message_card.vue'; // 车次信息
import trainConfirmRefund from '@/components/train_confirm_dialog.vue'; // 确认退票
export default {
  components: {
    trainMessageCard,
    trainConfirmRefund
  },
  data() {
    return {
      iStatusBarHeight:0,
      orderHeaderTitle:"退票",

      passValueObject:{}, //
      passTrainItem:{}, // 组装车次信息
      passTrainSingle:{}, // 组装车次信息 座位

      checkedPassengerlist: [], // 选中乘客列表
      checkedAllStatus: false, // 全选状态

      trainRefundRemark:"", // 备注内容
      orderType:"", // 区分正常单改签单

    }
  },
  methods:{

    // 选择乘车人
    checkedPassenger(val,index) {
      // 判断当前数据是否有active属性，如果有，就赋值为相反状态
      this.$set(this.passValueObject.passengers[index], "active", !val.active);

      // 判断当前数据active状态
      if (this.passValueObject.passengers[index].active) {
        //   如果为true就push进选中列表
        this.checkedPassengerlist.push(val);
      } else {
        //   如果为false就从选中列表删除
        this.checkedPassengerlist.splice(
          this.checkedPassengerlist.findIndex((item) => item === val.id),
          1
        );
      }
      this.checkedAllStatus =
        this.checkedPassengerlist.length ===
        this.passValueObject.passengers.length;
        console.log('选中乘客',this.checkedPassengerlist)
    },

    // 全选乘车人
    checkedAll() {
      // 判断选中的乘客人数是否和数据携带全部人数相同
      if (
        this.passValueObject.passengers.length ===
        this.checkedPassengerlist.length
      ) {
        //   如果相同 清空选中列表 并且遍历乘客数组 将状态全部赋值为false
        this.checkedAllStatus = false;
        this.checkedPassengerlist = [];
        this.passValueObject.passengers.forEach((item) => {
          item.active = false;
        });
      } else {
        //   如果不相同 遍历乘客列表 全部赋值为 true ，并将乘客列表数组赋值给选中乘客列表
        this.checkedPassengerlist = [];
        this.passValueObject.passengers.forEach((item, index) => {
          item.active = true;
          this.checkedPassengerlist.push(item);
        });
        this.checkedAllStatus = true;
      }
    },

    // 跳转到备注页面
    openRemark() {
      uni.navigateTo({
        url: "/order/addRemark?remark=" + this.trainRefundRemark,
      });
    },
    // 提交申请
    submitRefund() {
      if (this.checkedPassengerlist.length < 1) {
        return uni.showToast({
          title: "请选择退票人员",
          icon: "none",
        });
      }
      this.$refs.trainConfirmRefund.openPop();
    },

    // 确认退票
    getRefund() {
      let passenger = []
      let passengerId = []
      this.checkedPassengerlist.forEach(item => {
        passenger.push({                //类型：Object  必有字段  备注：无
                name:item.PassengerName,                //类型：String  必有字段  备注：姓名
                card_no:item.CredentialNo,                //类型：String  必有字段  备注：证件号
                card_type:item.Credential,                //类型：String  必有字段  备注：证件类型
                remark:"",                //类型：String  可有字段  备注：备注
                ticket_no:item.ticket_no                //类型：String  必有字段  备注：票号
        })
        passengerId.push(item.id)

      })
      let data = {
        channel:"Di",                //类型：String  必有字段  备注：渠道
        source:"YunKu",                //类型：String  必有字段  备注：数据源
        order_no:this.passValueObject.order_no,                //类型：String  必有字段  备注：订单号
        order: {                //类型：Object  必有字段  备注：订单信息
            order_no:this.passValueObject.order_no,                //类型：String  必有字段  备注：订单号
            out_trade_no:this.passValueObject.out_trade_no,                //类型：String  必有字段  备注：第三方订单号
            ticket_number:this.passValueObject.ticket_number               //类型：String  必有字段  备注：电子出票号
        },
        ticket: passenger,
        passenger_ids:passengerId,
        is_voluntary:1,
        is_change:this.passValueObject.is_change
      }
      orderApi.trainOrderRefund(data).then((res) => {
        console.log(data)
        if(res.errorcode === 10000) {
          let refund_no = res.data.refund_no
          this.$refs.trainConfirmRefund.closePop();
          uni.redirectTo({
              url: '/order/trainRefundDetails?refund_no=' +
              refund_no
          });
          
        }else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      })
    },

    // 获取详情 e 区分正常单和改签单
    getRefundDetail(val,e) {
      if(e === 'change') {

        orderApi.trainChangeDetail(val).then((res) => {
          if(res.errorcode === 10000) {

            this.passValueObject = res.data.train_order
            this.getTrainMessage(this.passValueObject)
          }else {
            uni.showToast({
              title:res.msg,
              icon:"none",
              duration:3000,
            })
          }
          
        })
      }else {
        orderApi.trainOrderDetail(val).then((res) => {
          if(res.errorcode === 10000) {

            this.passValueObject = res.data
            this.getTrainMessage(this.passValueObject)
          }else {
            uni.showToast({
              title:res.msg,
              icon:"none",
              duration:3000,
            })
          }
          
        })
      }
    }, 

    // 组装数据
    getTrainMessage(val) {
       this.passTrainItem = {
        train: {
          departure_date: val.segments[0].departure_time,
          days: this.$moment(this.$moment(val.segments[0].arrive_time).format('YYYY-MM-DD')).diff(this.$moment(this.$moment(val.segments[0].departure_time).format('YYYY-MM-DD')),"days"),
          departure: this.$moment(val.segments[0].departure_time).format("HH:mm"),
          arrive: this.$moment(val.segments[0].arrive_time).format("HH:mm"),
          code: val.segments[0].train_number,
          number: val.segments[0].train_code,
          run_minute: this.$moment(this.$moment(val.segments[0].arrive_time).format('YYYY-MM-DD HH:mm:ss')).diff(this.$moment(this.$moment(val.segments[0].departure_time).format('YYYY-MM-DD HH:mm:ss')),"minutes")
        },
        station: {
          departure_name: val.segments[0].from_city,
          arrive_name: val.segments[0].to_city,
        }
      }
      this.passTrainSingle = {
        code: val.segments[0].seat_level,
        name: val.segments[0].seat
      }
    }
  },

  onShow() {
    // 备注内容
    if (uni.getStorageSync("remark_key")) {
      this.trainRefundRemark = uni.getStorageSync("remark_key");
      uni.removeStorageSync("remark_key");
    }
  },

  onLoad(data) {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    // orderType 区分正常单 改签单 
    this.orderType = data.orderType
    this.getRefundDetail(data.order_no,data.orderType)
  }
}
</script>

<style lang="less" scoped>
.train_refund {
  background: rgba(243, 245, 247, 1);
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  .content {
    flex: 1;
    overflow-y: auto;
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
      &.active {
        .main_content {
          .list_click {
            background: url(@/static/selected_active.png) no-repeat;
            background-size: contain;
          }
        }
      }

      .main_list_title {
        font-size: 32upx;
        font-weight: bold;
        color: rgba(42, 42, 42, 1);
        margin-bottom: 24rpx;
        flex: 1;
        justify-content: flex-end;
      }
      .checked_all_btn {
        display: flex;
        &.active {
          .list_click {
            background: url(@/static/selected_active.png) no-repeat;
            background-size: contain;
          }
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
    &.passenger {
      .passenger_list {
        margin-top: 20upx;
        border-bottom: 2upx solid rgba(241, 243, 245, 1);
        margin-bottom: 30upx;
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
            margin-bottom: 30upx;
          }
          .list_info {
            display: flex;
            align-items: center;
            margin-bottom: 34upx;
            justify-content: space-between;
            .info_message {
              display: flex;
              align-items: center;
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
                margin-right: 16upx;
              }
              .info_name {
                font-size: 28upx;
                font-weight: bold;
                color: rgba(42, 42, 42, 1);
                min-width: 82upx;
              }
              .is_insurance {
                background: url(@/static/insurance_icon.png) no-repeat center
                  center;
                background-size: contain;
                width: 25upx;
                height: 30upx;
                margin-left: 8upx;
              }
              .group_type {
                font-size: 28upx;
                font-weight: 400;
                color: #333333;
                margin: 0upx 42upx;
              }
              .group_number {
                font-weight: bold;
                font-size: 28upx;
                color: #2a2a2a;
              }
            }

            .list_click {
              background: url(@/static/selected.png) no-repeat;
              background-size: contain;
              width: 40upx;
              height: 40upx;
            }
          }
          .list_other {
            display: flex;
            font-size: 28upx;
            padding-left: 18%;
            .other_title {
              font-weight: 400;
              color: #333333;
            }
            .other_value {
              font-weight: bold;
              color: #2A2A2A;
              margin-left: 50upx;
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
            width: 133upx;
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
  .train_class {
    margin: 20upx 20upx 20upx;
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