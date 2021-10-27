<!--
 * @Description: 退票单  --- 详情
 * @Author: mzr
 * @Date: 2021-08-30 11:08:34
 * @LastEditTime: 2021-10-27 17:10:03
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
              ? "退票中"
              : detailData.status === 2
              ? "已退票"
              : detailData.status === 5
              ? "退票失败"
              : detailData.status === 3
              ? "已取消"
              : ""}}
        </view>

        <view class="order_price" 
          v-if="detailData.status === 2"
          @click="openPriceDialog()"
        >
          <text class="price_text">退票金额</text>
          <text class="price_sign">&yen;</text>
          <text>{{detailData.refund_total || 0}}</text>
        </view>
      </view>

      <view class="remaining_time">
        <text class="time_text">
          {{detailData.status === 1 ? '您的申请已提交，等待后台审核' : 
              detailData.status === 2 ? '您的订单已成功退款' :
                detailData.status === 5 ? '抱歉退票失败，若仍需退票请联系客服人员':''}}
        </text>
       </view>

      <view class="order_option">
        <view class="option_btn" v-if="detailData.status === 2 || detailData.status === 5" @click="getSend()">发送短信</view>
        <view class="option_btn important_btn" v-if="detailData.status === 2" @click="againReserve">重新预定</view>
      </view>
    </view>

    <view class="details_main">
      <scroll-view :enable-back-to-top="true" :scroll-y="true" class="content">
        <!-- 车次信息 -->
        <view class="train_class">
          <trainMessageCard :trainObject="trainData" :isCabin="true" :seatObject="singleData" :isRule="true"></trainMessageCard>  
        </view>
        <!-- 出行信息 -->
        <view class="main_list passenger">
         
          <view class="main_list_title">出行信息</view>
          <view class="passenger_list">
            <view 
              :class="['list_item_title', { active: passInfoChecket === index }]"
              v-for="(item,index) in detailData.passengers" :key="index">

              <view class="list_info" @click="openPassInfo(index)">
                <view class="info_type">{{item.PassengerType === "ADT" ? '成人':item.PassengerType === "CHD" ? "儿童":""}}票</view>
                <view class="info_name">{{item.PassengerName}}</view>
                <view class="is_insurance" :style="{opacity:item.is_insurance === 1?'':'0'}"></view>
                <view class="group_info" v-if="item.seat_info">
                  <view class="group_type">座位号</view>
                  <view class="group_number">
                    {{ item.seat_info.replace("厢,","") }}
                  </view>
                </view>
                <view class="price_arrow">
                  <image src="@/static/unfold.png" mode="aspectFit" />
                </view>
              </view>
              <!-- 展开内容 -->
              <view class="list_main">

                <view class="list_item">
                  <view class="item_title_old">票号</view>
                  <view class="item_message_old">{{item.ticket_no}}</view>
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
        <!-- 订单信息 -->
        <view class="main_list order_message">
          <view class="main_list_title">订单信息</view>
          <view class="message_list">
            <view class="list_item">
              <view class="item_title">订单编号</view>
              <view class="item_message">{{detailData.refund_no}}</view>
            </view>
            <view class="list_item">
              <view class="item_title">申请人</view>
              <view class="item_message">{{detailData.admin_name ? detailData.admin_name :""}}</view>
            </view>
            <view class="list_item">
              <view class="item_title">申请时间</view>
              <view class="item_message">{{detailData.created_at ? detailData.created_at :''}}</view>	
            </view>
            <view class="list_item" v-if="detailData.status === 2">
              <view class="item_title">退款时间</view>
              <view class="item_message">{{detailData.refund_time ? detailData.refund_time : ""}}</view>	
            </view>
            <view class="list_item" @click="openRemark()">
              <view class="item_title">备注</view>
              <view v-if="trainRefundDetail" class="item_message">{{trainRefundDetail}}</view>
              <view v-else class="item_message input-right-arrow"></view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    <!-- 退票金额 -->
    <refundAmount
      ref="trainRefundAmount"
      :refundInfo="trainSingleData"
      :trainSort="'refund'"
    ></refundAmount>

  </view>
</template>

<script>
import orderApi from "@/api/order.js";
import trainMessageCard from '@/components/train_message_card.vue' // 车次信息
import refundAmount from '@/components/refund_amount_refer.vue';

export default {
  components: {
    trainMessageCard,
    refundAmount
  },
  data() {
    return {
      order_no:"", // 订单号 
      iStatusBarHeight:0,
      orderHeaderTitle:"退票单详情",

      detailData:{}, // 详情数据

      // 组件 车次信息
      trainData:{},
      singleData:{},

      passInfoChecket: null, // 乘客信息展开值
      priceInfoChecket: null, // 订单总价展开值
      trainRefundDetail:"", // 备注内容

      // 退票金额对话框
      trainSingleData:{}, 

      reserveData:{}, // 装重新预定数据
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
      orderApi.trainRefundDetail(val).then((res) => {
        console.log(res)
        if(res.errorcode === 10000) {
          this.detailData = res.data
          this.getTrainMessage(this.detailData)
          this.reserveData = res.data.train_order
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
        url: "/order/addRemark?remark=" + this.trainRefundDetail,
      });
    },

    // 打开退票金额对话框
    openPriceDialog() {
      let passengerList = []
      this.detailData.passengers.forEach(item => {
        passengerList.push({
            total_price:item.refund_total, // 总金额
            PassengerName:item.PassengerName, // 姓名
            ticket_price:item.total_price, // 结算价
            refund_price:item.refund_money, // 退票费
        })
      })
      this.trainSingleData = {
        checkedTotal:this.detailData.total_price, // 订单总价
        passengerList: passengerList,
      }
      this.$refs.trainRefundAmount.openExp();
    },
    
    // 关闭退票金额对话框
    closeExp() {
      this.$refs.trainRefundAmount.closeExp();
    },

    // 发送短信
    getSend() {
      uni.navigateTo({
        url: "/order/sendMessage?orderId=" + this.detailData.order_no,
      });
    },

    // 重新预定
    againReserve() {
      if (this.$moment(this.detailData.train_date).isAfter(this.$moment())) {
        // 当前订单时间 大于今天时间 =》 直接跳转列表
        let data = {
          to: {
              city_code: this.reserveData.from_station_code,
              city_name: this.reserveData.from_station,
              country_code: "CN",
              province: this.reserveData.from_station,
          },
          from: {
              city_code: this.reserveData.to_station_code,
              city_name: this.reserveData.to_station,
              country_code: "CN",
              province: this.reserveData.to_station,
          },
          toTime: {
              date: this.$moment(this.detailData.train_date).format("YYYY-MM-DD"),

          },
          normalOrder:true
        }
        uni.navigateTo({
            url: '/trainInquiry/trainInquiry?trainData=' +
                JSON.stringify(data) +
                "&checkboxStatus=false"
        });

      } else {
          // 如果当前订单时间小于 当前日期 =》 跳转日期
          let data = {
              type: false,
              data: this.detailData.train_date,
          };
          uni.navigateTo({
              url: "/pages/dateSelect/dateSelect?ticketType=" + JSON.stringify(data),
          });

      }
    }
  },

  onShow() {
    // 重新预定
    if (uni.getStorageSync('time')) {
      let time = JSON.parse(uni.getStorageSync("time"))
      let data = {
          toTime: {
              date: time.date,
          }
      }
      uni.navigateTo({
          url: '/trainInquiry/trainInquiry?trainData=' +
              JSON.stringify(data) +
              "&checkboxStatus=false"
      });
      uni.removeStorageSync('time')
    }
    // 备注内容
    if (uni.getStorageSync("remark_key")) {
      this.trainRefundDetail = uni.getStorageSync("remark_key");
      uni.removeStorageSync("remark_key");
    }
  },
  
  onLoad(data) {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.order_no = data.refund_no  // 订单号
    this.getTrainDetail(this.order_no)
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
                  min-width: 90upx;
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
                  }
                  .item_message_old {
                    font-size: 28upx;
                    font-weight: bold;
                    color: #2A2A2A;
                    margin-left: 22upx;

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