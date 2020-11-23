<!--
 * @Description: 已出票订单退票页面
 * @Author: wish.WuJunLong
 * @Date: 2020-08-17 10:31:20
 * @LastEditTime: 2020-11-19 17:52:08
 * @LastEditors: wish.WuJunLong
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
      <refundTop :dataList="list" @voluntary="volRadio" @reason="reasonSel"></refundTop>
      <!-- 特别提醒 -->
      <!-- <view class="sep_list">
        <view class="list_icon">
          <image src="@/static/refund_warn.png" mode="aspectFit" />
        </view>
        <view class="list_title">国际退票特别提醒</view>
        <view class="list_right">
          <image src="../../static/refund_right.png" mode="aspectFit"></image>
        </view>
      </view> -->
      <!-- 航班信息 -->
      <flight-header
          v-if="flightData.data.length > 0"
          :flightData="flightData"
          :roundTripFlightData="roundTripFlightData"
          :roundTripType="roundTripType"
          :interType="false"
          @openHeadExpPopup="openHeadExpPopup"
      ></flight-header>

      <view v-else class="not_flight_data">
        <text></text>
        <text></text>
        <view></view>
      </view>
      <!-- 出行信息 -->
      <view class="main_list passenger">
        <view class=main_list_first>
          <view class="main_list_title">出行信息</view>   
          <!-- refundList.ticket_passenger.length === checkedPassengerlist.length -->
          <view @click="checkedAll()" :class="['checked_all_btn',{active: checkedAllStatus}]">
            <view class="main_content">全选</view>
            <view class="list_click" ></view>
          </view>
        </view>
        <view class="passenger_list">
          <view
            :class="['list_item', { active: item.active }]"
            v-for="(item, index) in refundList.ticket_passenger"
            :key="index"
            @click="checkedPassenger(item, index)" >
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
              <view class="is_insurance" v-if="Number(item.insurance_total) > 0"></view>
              <view class="group_type">票号</view>
              <view class="group_number">{{ item.ticket_no }}</view>
              <view class="list_click"></view>
            </view>
          </view>
        </view>

        <view class="contact">
          <view class="contact_list">
            <view class="list_title">联系人</view>
            <view class="list_message">{{ refundList.contact }}</view>
          </view>
          <view class="contact_list">
            <view class="list_title">联系电话</view>
            <view class="list_message">{{ refundList.phone }}</view>
          </view>
          <view class="contact_list">
            <view class="list_title">已购保险</view>
            <view class="list_message">{{ refundList.insurance_total }}元</view>
          </view>
        </view>
      </view>
      <!-- 退票信息 金额参考/备注 -->
      <view class="refund_top">
        <view class="top_message">退票信息</view>
        <view class="middle_message">
          <view class="message_first">退票金额参考</view>
          <view
            class="message_bottom input-right-arrow" @click="openExp">
            <text class="logo">&yen;</text>
			      <text class="total_price">{{ refundList.total_price }}</text>
          </view>
        </view>
        <view class="middle_message">
          <view class="message_first">退废票备注</view>
          <view
            class="message_bottom input-right-arrow" @click="openRemark">
            <text v-if="remark" class="group_message">{{ remark }}</text>
            <text v-else class="not_message"></text>
          </view>
        </view>
      </view>
      <!-- 订单信息 -->
      <view class="main_list order_message">
        <view class="main_list_title">订单信息</view>
        <view class="message_list">
          <view class="list_item">
            <view class="item_title">订单编号</view>
            <view class="item_message">{{ refundList.order_no }}</view>
          </view>
          <view class="list_item">
            <view class="item_title">PNR</view>
            <view class="item_message">{{ refundList.pnr_code }}</view>
          </view>
          <view class="list_item">
            <view class="item_title">YATP订单号</view>
            <view class="item_message">{{ refundList.yatp_order_id }}</view>
          </view>
          <view class="list_item">
            <view class="item_title">订票员</view>
            <view class="item_message">{{ refundList.book_user }}</view>
          </view>
          <view class="list_item">
            <view class="item_title">出票员</view>
            <view class="item_message">{{ refundList.out_ticket_name }}</view>
          </view>
          <view class="list_item">
            <view class="item_title">预定时间</view>
            <view class="item_message">{{ refundList.created_at }}</view>
          </view>
          <view class="list_item">
            <view class="item_title">备注</view>
            <view v-if="remark" class="item_message">{{ refundList.remark }}</view>
            <view v-else class="item_message">无</view>
          </view>
        </view>
      </view>

      
      <!-- 退改信息弹窗 -->
      <refund-amount ref="refundAmountRefer" :refundInfo="refundList"></refund-amount>

      <!-- 退票申请发送成功 -->
      <uni-popup ref="refundMessage" type="dialog" :maskClick="false">
          <view class="refund_message_box">
              
              <view class="refund_message_icon" v-if="message_true">
                  <img src="@/static/message_error.png" />
              </view>
              <view class="refund_message_icon" v-else>
                  <img src="@/static/message_right.png" />
              </view>
              <view class="refund_message_send">{{message_msg}}</view>
              <view class="refund_message_bottom" @click="backPage">知道了</view>
          </view>
      </uni-popup>
      
    </scroll-view>
    <!-- 提交申请按钮 -->
    <view class="filter_bottom">
      <view class="bottom_btn submit_btn"
      @click="submitRefund">提交申请</view>
    </view>
  </view>
</template>

<script>
import orderApi from "@/api/order.js";
import moment from "moment";
moment.locale("zh-cn");
import refundTop from "@/components/refund_top.vue"; //退票信息
import RefundAmount from "@/components/refund_amount_refer.vue"; //退票金额参考
import flightHeader from "@/components/flight_header.vue"; // 航程信息
export default {
  components: {
    refundTop,
    RefundAmount,
    flightHeader
  },
  data() {
    return {
      iStatusBarHeight: 0,

      checkedPassengerlist: [], // 选中乘客列表

      refundList: {
        data: []
      }, // 退票详情列表

      remark:'', // 备注

      radioValue: 1, //单选选择

      group:'', //退票理由

      message_true: false, // 提交状态
      message_msg: "", // 错误信息

      checkedAllStatus: false, // 全选状态

      flightData: {},

      roundTripType: false, // 是否往返

    };
  },
  methods: {
    
    // 单选框
    volRadio(val) {
      this.radioValue = val
      console.log('退票是否自愿',this.radioValue)
    },

    // 退票理由
    reasonSel(val) {
      this.group = val
      console.log('理由',this.group)
    },

    // 打开退票成功弹窗
    open() {
      this.$refs.refundMessage.open();
    },
    close() {
      this.$refs.refundMessage.close();
    },

    backPage() {
      console.log(this.message_true)
      this.$refs.refundMessage.close();
      if(this.message_true){
        console.log('返回上一页')
        uni.navigateBack();
      }
    },

    // 提交申请
    submitRefund() {
      
      if(this.checkedPassengerlist.length < 1){
        return uni.showToast({
          title: "请选择退票人员信息",
          icon: "none",
        });
      } 
      console.log(this.radioValue)
 
      if((String(this.radioValue) === '2' && !this.group) || !this.remark) {

        return uni.showToast({
          title: (String(this.radioValue) === '2' && !this.group)?"请选择退票理由":!this.remark?"请输入备注信息":"请完善退票信息",
          icon: "none",
        });
      }
 
      let params = {
        is_abandon:1,                //类型：Number  必有字段  备注：1：退票 2：废票
        contact:this.refundList.contact,                //类型：String  必有字段  备注：联系人
        is_voluntary:this.radioValue,                //类型：Number  必有字段  备注：是否自愿 1：是 2：否
        keep_seat:1,                //类型：Number  必有字段  备注：委托平台取消座位 1：是 0：否
        reason:this.group,                //类型：String  必有字段  备注：退票理由
        remark:this.remark,                //类型：String  必有字段  备注：备注
        phone:this.refundList.phone                //类型：Number  必有字段  备注：联系手机


      };

      let passenger_ids = this.checkedPassengerlist;
      let segment_ids = this.refundList.ticket_segments;

      let data = {
        params: params,
        passenger_ids: passenger_ids,
        segment_ids: segment_ids
      }
      
      console.log(data)
      orderApi.refundSubmit(data).then((res) =>{
          
          this.message_true = res.status === '1';
          this.message_msg = res.msg;
          this.open();
          console.log(res)
      })
    },

    // 打开退改签说明弹窗
    openExp() {

      this.$refs.refundAmountRefer.openExp();
    },

    // 关闭产品说明弹窗
    closeExp() {
      this.$refs.refundAmountRefer.closeExp();
    },

    // 跳转备注页面
    openRemark() {
        uni.navigateTo({
            url:'/order/addRemark?remark='+this.remark,
        })
    },

    // 选择联系人
    checkedPassenger(val, index) {

      console.log(val, index)
      // 判断当前数据是否有active属性，如果有，就赋值为相反状态
        this.$set(this.refundList.ticket_passenger[index],"active",!val.active);
    
      // 判断当前数据active状态
        if (this.refundList.ticket_passenger[index].active) {
      //   如果为true就push进选中列表
          this.checkedPassengerlist.push(val.id);
        } else {
      //   如果为false就从选中列表删除
          this.checkedPassengerlist.splice(this.checkedPassengerlist.findIndex(item => item === val.id),1)
        }
        this.checkedAllStatus = this.checkedPassengerlist.length === this.refundList.ticket_passenger.length

        this.$forceUpdate()

        console.log(this.checkedPassengerlist);
        // this.checkedPassengerList
    },

    // 全选联系人
    checkedAll() {
      
		// 判断选中的乘客人数是否和数据携带全部人数相同
      if (this.refundList.ticket_passenger.length === this.checkedPassengerlist.length) {
        //   如果相同 清空选中列表 并且遍历乘客数组 将状态全部赋值为false
            this.checkedAllStatus = false
            this.checkedPassengerlist = [];
            this.refundList.ticket_passenger.forEach((item) => {
              item.active = false;
            });
      } else {
        //   如果不相同 遍历乘客列表 全部赋值为 true ，并将乘客列表数组赋值给选中乘客列表
            this.checkedPassengerlist = [];
            this.refundList.ticket_passenger.forEach((item, index) => {
              item.active = true;
              this.checkedPassengerlist.push(item.id)
            }); 
            this.checkedAllStatus = true
      }
        this.$forceUpdate();
	    console.log(this.refundList.ticket_passenger,this.checkedPassengerlist);
    },
  },
  onShow(){

    // 退票信息   退费票备注内容
    if(uni.getStorageSync('remark_key')){
      this.remark = uni.getStorageSync('remark_key')
      uni.removeStorageSync('remark_key')
    }
  },
  onLoad(data) {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    console.log('退票信息',data)
    this.refundList = JSON.parse(data.refundData)
    console.log(this.refundList)

    // 组装航程信息

    this.type
              ? this.type === "0"
                ? "去程"
                : "返程"
              : "单程",
    this.flightData = {
      flightType: this.refundList.segment_type
      ?this.refundList.segment_type === '1'
      ?"去程"
      :"返程"
      :"单程",
      data: this.refundList.ticket_segments || [], // 单程信息
      cabinInfo: this.refundList.ticket_segments || [], //退票规则
    };
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
        padding-top: 24rpx;
        flex: 1;
        justify-content: flex-end;
      }
      .checked_all_btn {
        display: flex;
        &.active{
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

  .not_flight_data {
        border-radius: 20rpx;
        background: #ffffff;
        box-shadow: 0 12rpx 18rpx rgba(0, 0, 0, 0.04);
        padding: 30rpx 20rpx 22rpx;
        margin: 0 20rpx 20rpx;
        height: 144upx;
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: hidden;
        &::before {
          content: "";
          display: block;
          width: 44upx;
          height: 200%;
          position: absolute;
          top: -30%;
          transform: rotate(30deg);
          background: #fff;
          left: -30%;
          animation: skeleton 3s infinite;
          -webkit-animation: skeleton 3s infinite;
        }
        @keyframes skeleton {
          from {
            left: -30%;
          }
          to {
            left: 120%;
          }
        }
        text {
          display: block;
          width: 80%;
          height: 28upx;
          background: #e5e9f2;
          margin-bottom: 10upx;
        }
        view {
          width: 80%;
          height: 40upx;
          margin: auto auto 0;
          background: #e5e9f2;
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
        
        margin-top: 15rpx;
        margin-right: 4rpx;
        color: rgba(255, 0, 0, 1);
        font-weight: bold;
      }
      .message_bottom {
        font-size: 28upx;
        color: rgba(42, 42, 42, 1);
        display: inline-flex;
        justify-content: flex-end;
        flex: 1;
        min-height: 40upx;
        .group_message {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: right;
          max-width: 40vw;
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

.refund_message_box {
  width: 540upx;
  background: #ffffff;
  border-radius: 20upx;
  display: flex;
  flex-direction: column;
  padding-top: 40upx;
  .refund_message_icon {
    width: 90upx;
    height: 90upx;
    margin: 0 auto;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .refund_message_send {
    margin-top: 22upx;
    text-align: center;
    font-size: 24upx;
    font-weight: 400;
    color: #0070e2;
    padding: 0 60rpx;
  }
  .refund_message_bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90upx;
    border-top: 2upx solid #eaeaea;
    margin-top: 40upx;
    font-size: 28upx;
    font-weight: 400;
    color: #333333;
  }
}
</style>
