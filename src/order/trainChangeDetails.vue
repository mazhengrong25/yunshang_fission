<!--
 * @Description: 火车票 --- 改签详情
 * @Author: mzr
 * @Date: 2021-09-03 09:47:50
 * @LastEditTime: 2021-09-26 12:07:10
 * @LastEditors: mzr
-->
<template>
  <view class="train_details">
    <yun-header
      :statusHeight="iStatusBarHeight"
      :centerTitle="orderHeaderTitle"
    ></yun-header>

    <view class="details_header">
      <view class="header_top">
        <view class="order_type">
         {{ detailData.status === 1
              ? "改签占座中,请稍后"
              : detailData.status === 2
              ? "待支付"
              : detailData.status === 3
              ? "出票中,请稍后"
              : detailData.status === 4
              ? "已出票"
              : detailData.status === 5
              ? "已取消"
              : detailData.status === 6
              ? "占座失败"
              : detailData.status === 7
              ? "出票失败"
              : ""}}
        </view>

        <view class="order_price" 
          v-if="detailData.status !== 1 || detailData.status !== 6"
          @click="openPriceDialog()"
        >
          <text class="price_text">改签费</text>
          <text class="price_sign">&yen;</text>
          <text>{{detailData.total_price || 0}}</text>
        </view>
      </view>

      <view class="remaining_time">
        <image class="time_icon" 
          v-if="detailData.status === 1 || detailData.status === 2" src="@/static/order_remaining_time.png" mode="aspectFit" />
        <text class="time_text">
          {{detailData.status === 3 ? '订单支付成功，出票中...' : 
              detailData.status === 6 ? '抱歉改签占座失败，若仍需改签请联系客服人员' :
                detailData.status === 2 ? `剩余支付时间：${ Math.floor(detailData.overdue_time / 60 % 60)}:${Math.floor(detailData.overdue_time % 60)}分钟`: 
                  detailData.status === 1 ? `预计在${ Math.floor(occupyTime / 60)}：${Math.floor(occupyTime %60)}分前完成占座`:''}}
        </text>
       </view>

      <view class="order_option">
        <view class="option_btn" v-if="detailData.status !== 1 || detailData.status !== 3" @click="getSend()">发送短信</view>
        <view class="option_btn" v-if="detailData.status === 2" @click="getCancel()">取消订单</view>
        <view class="option_btn" v-if="detailData.status === 4">退票</view>
        <view class="option_btn important_btn" v-if="detailData.status === 2" @click="jumpOrderPay()">去支付</view>
        <view class="option_btn important_btn" v-if="detailData.status === 4">预定返程</view>
      </view>
    </view>

    <view class="details_main">
      <scroll-view :enable-back-to-top="true" :scroll-y="true" class="content">
        <!-- 乘车人 -->
        <view class="main_list passenger">
         
          <view :class="['main_list_title',{'main_list_title_label':detailData.ticket_number}]">乘车人</view>
          <view class="passenger_right_label" v-if="detailData.ticket_number">取票号{{detailData.ticket_number}}</view>

          <view class="passenger_list">
            <view 
              :class="['list_item_title', { active: passInfoChecket === index }]"
              v-for="(item,index) in detailData.passengers" :key="index">

              <view class="list_info" @click="openPassInfo(index)">
                <view class="info_type">{{item.PassengerType === "ADT" ? '成人':item.PassengerType === "CHD" ? "儿童":""}}票</view>
                <view class="info_name">{{item.PassengerName}}</view>
                <view class="is_insurance" v-if="item.is_insurance === 1"></view>
                <view class="group_info" v-if="item.seat_info">
                  <view class="group_type">{{item.old_ticket_no?'旧':'新'}}座位号</view>
                  <view class="group_number">
                    {{ item.seat_info.replace("厢,0","") }}
                  </view>
                </view>
                <view class="price_arrow">
                  <image src="@/static/unfold.png" mode="aspectFit" />
                </view>
              </view>
              <!-- 展开内容 -->
              <view class="list_main">
                <view v-if="item.PassengerType === 'CHD'">
                  <view class="list_item">
                    <view class="item_title_old light_color">旧座位号</view>
                    <view class="item_message_old light_color">{{item.seat_info.replace("厢,0","")}}</view>
                  </view>
                  <view class="list_item">
                    <view class="item_title_old light_color">旧票号</view>
                    <view class="item_message_old light_color">{{item.old_ticket_no?item.old_ticket_no:item.ticket_no}}</view>
                  </view>
                  <view class="list_item">
                    <view class="list_item_add">
                      用
                      <view style="color:#666;">【{{item.PassengerName}}】</view>
                        证件取票，身高低于1.5米
                    </view>
                  </view>
                </view>

                <view class="list_item" v-else>
                  <view class="item_title_old">{{item.old_ticket_no?'旧':'新'}}票号</view>
                  <view class="item_message_old">{{item.old_ticket_no?item.old_ticket_no:item.ticket_no}}</view>
                </view>

              </view>  

            </view>
          </view>

          <view class="contact">
            <view class="contact_list">
              <view class="list_title">联系人</view>
              <view class="list_message">{{detailData.contact}}</view>
            </view>
            <view class="contact_list">
              <view class="list_title">联系电话</view>
              <view class="list_message">{{detailData.phone}}</view>
            </view>
            <view class="contact_list">
              <view class="list_title">已购保险</view>
              <view class="list_message"></view>
            </view>
          </view>
        </view>
        <!-- 新车次 -->
        <view class="train_class">
          <trainMessageCard 
            :trainObject="trainData" 
            :isCabin="true" 
            :seatObject="singleData" 
            :isRule="true"
            titleType="new"></trainMessageCard>  
        </view>
        <!-- 原车次 -->
         <view class="train_class" v-if="detailData.train_order.segments.length > 0">
          <trainMessageCard 
            :trainObject="trainData" 
            :isCabin="true" 
            :seatObject="singleData" 
            :isRule="true"
            titleType="old"></trainMessageCard>  
        </view>
        <!-- 订单信息 -->
        <view class="main_list order_message">
          <view class="main_list_title">订单信息</view>
          <view class="message_list">
            <view class="list_item">
              <view class="item_title">订单编号</view>
              <view class="item_message">{{detailData.change_no}}</view>
            </view>
            <view class="list_item">
              <view class="item_title">申请人</view>
              <view class="item_message">{{detailData.admin_name ? detailData.admin_name :""}}</view>
            </view>
            <view class="list_item">
              <view class="item_title">申请时间</view>
              <view class="item_message">{{detailData.created_at ? detailData.created_at :''}}</view>	
            </view>
            <view class="list_item" v-if="detailData.status === 3 || detailData.status === 4">
              <view class="item_title">支付时间</view>
              <view class="item_message">{{detailData.pay_time ? detailData.pay_time : ""}}</view>	
            </view>
            <view class="list_item" @click="openRemark()">
              <view class="item_title">备注</view>
              <view v-if="trainChangeDetail" class="item_message">{{trainChangeDetail}}</view>
              <view v-else class="item_message input-right-arrow"></view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 取消订单弹窗 -->
    <yun-config
      ref="yunConfig"
      @submitConfig="getCancelSubmit"
      title="温馨提示"
      content="您是否要取消此订单"
      submitIndex="right"
    ></yun-config>

    <!-- 改签金额 -->
    <changeAmount
      ref="trainChangeAmount"
      :refundInfo="trainSingleData"
      :trainSort="true"
    ></changeAmount>
  </view>
</template>

<script>
import orderApi from "@/api/order.js";
import trainMessageCard from '@/components/train_message_card.vue' // 车次信息
import changeAmount from '@/components/refund_amount_refer.vue'; // 改签金额

export default {
  components: {
    trainMessageCard,
    changeAmount
  },
  data() {
    return {
      change_no:"", 
      iStatusBarHeight:0,
      orderHeaderTitle:"改签单详情",

      detailData:{}, // 详情数据 原车次
      newDetailData:{}, // 详情  新车次
      // 组件 车次信息
      trainData:{},
      singleData:{},

      passInfoChecket: null, // 乘客信息展开值
      priceInfoChecket: null, // 订单总价展开值
      trainChangeDetail:"", // 备注内容

      // 改签金额对话框
      trainSingleData:{}, 

      // 改签占座剩余时间
      occupyTime:0
    }
  },
  methods:{

    // 展开乘车信息详情
    openPassInfo(i) {
      this.passInfoChecket = this.passInfoChecket === i ? null : i;
      this.$forceUpdate();
    },

    // 展开订单总价信息
    openPriceInfo(i) {
      this.priceInfoChecket = this.priceInfoChecket === i ? null : i;
    },

    // 获取详情数据
    getTrainDetail(val) { 
      orderApi.trainChangeDetail(val).then((res) => {
        console.log(res)
        if(res.errorcode === 10000) {
          // 原车次
          this.detailData = res.data
          this.getTrainMessage(this.detailData)
          // 新车次
          this.newDetailData = res.data.train_order
          this.getTrainMessage(this.newDetailData)
          // 改签占座中
          if(this.detailData.status === 1){
            this.occupyTime = 60
            let timer = setInterval(() => {
              this.occupyTime--
              if(this.occupyTime < 1){
                clearInterval(timer)
              }
            },1000)
            // 跳转到支付页面
            uni.navigateTo({
              url:"/trainReservation/orderPay?detailItem=" +
              JSON.stringify(this.detailData)
            })
          }
        }else {
          uni.showToast({
            title:res.msg,
            icon:"none",
            duration:3000,
          })
        }
      })
    },

    // 组装车次数据
    getTrainMessage(val){
      console.log(val)
      this.trainData = {
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
      this.singleData = {
        code: val.segments[0].seat_level,
        name: val.segments[0].seat
      }
    },

    // 跳转备注页面
    openRemark() {
      uni.navigateTo({
        url: "/order/addRemark?remark=" + this.trainChangeDetail,
      });
    },

    // 打开取消订单弹窗
    getCancel() {
      this.$refs.yunConfig.openConfigPopup();
    },

    //取消订单提交
    getCancelSubmit() {
      let data = {
        channel:this.newDetailData.channel,                //类型：String  必有字段  备注：无
        source:this.newDetailData.source,                //类型：String  必有字段  备注：无
        order: {                //类型：Object  必有字段  备注：无
            order_no:this.newDetailData.order_no,                //类型：String  必有字段  备注：改签订单号
            out_trade_no:this.detailData.out_trade_no                //类型：String  必有字段  备注：正常单第三方订单号
        }
      }
      orderApi.trainChangeCancel(data).then((res) => {
          if(res.errorcode === 10000) {
              this.getTrainDetail(data.order.order_no)
          }else {
            uni.showToast({
              title: res.msg,
              icon: "none",
            });
          }
      })
    },

     // 去支付
    jumpOrderPay() {
      uni.navigateTo({
          url: "/trainReservation/orderPay?orderNo=" + 
          this.newDetailData.order_no +
          "&detailItem=" +
          JSON.stringify(this.newDetailData)
      });
    },

    // 打开改签金额对话框
    openPriceDialog() {
      let passengerList = []
      this.detailData.passengers.forEach(item => {
        passengerList.push({
            insurance_total:item.insurance_price, // 保险
            service_price:item.service_price, // 服务费
            total_price:item.total_price, // 总金额
            PassengerName:item.PassengerName, // 姓名
            ticket_price:item.ticket_price, // 销售价 票面价
        })
      })
      this.trainSingleData = {
        checkedTotal:this.detailData.total_price, // 订单总价
        passengerList: passengerList,
      }
      this.$refs.trainChangeAmount.openExp();
    },
    
    // 关闭退票金额对话框
    closeExp() {
      this.$refs.trainChangeAmount.closeExp();
    },

    // 发送短信
    getSend() {
      uni.navigateTo({
        url: "/order/sendMessage?orderId=" + this.detailData.change_no,
      });
    }
  },

  onShow() {
    // 备注内容
    if (uni.getStorageSync("remark_key")) {
      this.trainChangeDetail = uni.getStorageSync("remark_key");
      uni.removeStorageSync("remark_key");
    }
  },
  
  onLoad(data) {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.change_no = data.change_no  
    this.getTrainDetail(this.change_no)
    
  }
}
</script>

<style lang="less" scoped>
.train_details {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: rgba(243, 245, 247, 1);
  .details_header {
    background: rgba(0, 112, 226, 1);
    padding: 40upx 20upx 30upx;
    .header_top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 22upx;
      .order_type {
        font-size: 40upx;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
      }
      .order_price {
        display: inline-flex;
        align-items: baseline;
        font-size: 40upx;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        &::after {
          content: "";
          background: url(@/static/arrow_white.png) no-repeat center center;
          background-size: contain;
          width: 12upx;
          height: 21upx;
          display: block;
          margin-left: 14upx;
        }
        .price_text {
          font-size: 24upx;
          font-weight: 400;
          margin-right: 6upx;
          margin-top: 10upx;
        }
        .price_sign {
          padding: 0upx 12upx 0upx 16upx;
          font-size: 24upx;
          font-weight: 400;
        }

      }
    }
    .remaining_time {
      display: flex;
      align-items: center;
      margin-bottom: 32upx;
      .time_icon {
        width: 24upx;
        height: 24upx;
        object-fit: contain;
        margin-right: 10upx;
      }
      .time_text {
        font-size: 24upx;
        font-weight: 400;
        color: rgba(255, 255, 255, .8);
      }
    }
    .order_option {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .option_btn {
        width: 150upx;
        height: 56upx;
        border: 2upx solid rgba(255, 255, 255, 0.3);
        border-radius: 50upx;
        font-size: 24upx;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 32upx;
        &.important_btn {
          border-color: #fff;
          background: #fff;
          color: rgba(0, 112, 226, 1);
        }
      }
    }
  }
  .details_main {
    position: relative;
    flex: 1;
    display: flex;
    height: 100%;
    overflow-y: hidden;
    &::after {
      content: "";
      display: block;
      background: #0070e2;
      width: 100%;
      height: 90upx;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
    }
    .content {
      flex: 1;
      height: 100%;
      overflow-y: auto;
      position: relative;
      z-index: 1;
      .main_list {
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 12upx 18upx rgba(0, 0, 0, 0.04);
        border-radius: 20upx;
        margin: 0 20upx 20upx;
        padding: 24upx 20upx 20upx;
        .main_list_title {
          font-size: 32upx;
          font-weight: bold;
          color: rgba(42, 42, 42, 1);
        }
        &.passenger {
          // 取票号
          .main_list_title_label {
            font-size: 32upx;
            font-weight: bold;
            color: rgba(42, 42, 42, 1);
            position: absolute;
          }
          .passenger_right_label {
            position: relative;
            left: 61%;
            top: -23upx;
            width: 32%;
            height: 52upx;
            font-size: 24upx;
            font-weight: 400;
            color: #0070e2;
            background-color: rgba(0, 112, 226, 0.1);
            border-radius: 0upx 20upx 0upx 20upx;
            padding: 12upx 26upx 0upx 42upx; 
          } 
          .passenger_list {
            margin-top: 46upx;
            .list_item_title {
              margin-bottom: 40upx;
              overflow: hidden;
              &.active {
                .list_info {
                  .price_arrow {
                    transform: rotate(180deg);
                  }
                }
                .list_main {
                  height: auto;
                }
              }
              .list_info {
                display: flex;
                align-items: center;
                margin-bottom: 34upx;
                .info_type {
                  width: 100upx;
                  height: 30upx;
                  border: 2upx solid rgba(127, 183, 240, 1);
                  border-radius: 20upx;
                  margin-right: 12upx;
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
                  margin-right: 8upx;
                }
                .is_insurance {
                  background: url(@/static/insurance_icon.png) no-repeat center
                    center;
                  background-size: contain;
                  width: 25upx;
                  height: 30upx;
                }
                .group_info {
                  display: flex;
                  justify-content: center;
                  align-items: center;

                  .group_type {
                    margin-left: 28upx;
                    font-size: 28upx;
                    font-weight: 400;
                    color: #333333;
                    margin: 0upx 42upx;
                  }
                  .group_number {
                    font-weight: bold;
                    font-size: 14px;
                    color: #2a2a2a;
                  }
                }
                .price_arrow {
                  transition: all 0.3s;
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  width: 22upx;
                  height: 12upx;
                  margin-left: auto;
                  image {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                  }
                }
              }
              .list_main {
                overflow: hidden;
                padding-left: 17%;
                height: 0;
                .list_item {
                  display: flex;
                  .list_item_add {
                    display: inline-flex;
                    .item_title {
                      font-size: 28upx;
                      font-weight: 400;
                      color: #666666;
                      width: 84upx;
                    }
                    .item_message {
                      font-size: 28upx;
                      font-weight: bold;
                      color: #2A2A2A;
                      margin-left: 22upx;
                    }

                  }
                  .item_title_old {
                    font-size: 28upx;
                    font-weight: 400;
                    color: #333333;
                    width: 84upx;
                    &.light_color {
                      color:#AFB9C4;
                    }
                  }
                  .item_message_old {
                    font-size: 28upx;
                    font-weight: bold;
                    color: #2A2A2A;
                    margin-left: 22upx;
                    &.light_color {
                      color:#AFB9C4;
                    }
                  }
                  &:not(:last-child) {
                    margin-bottom: 28upx;
                  }
                }
              }
            }
          }
          .contact {
            padding-top: 30upx;
            border-top: 2upx solid #F1F3F5;
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
            border-top: 2upx solid #f1f3f5;
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
              color: rgba(51, 51, 51, 1);
            }
          }
        }
        &.order_message {
          .message_list {
            margin-top: 40upx;
            .list_item {
              display: flex;
              align-items: center;
              margin-bottom: 28upx;
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
      .train_class {
        margin: 0upx 20upx 20upx;
      }
    }
  } 
}
</style>