<!--
 * @Description: 机票查询
 * @Author: wish.WuJunLong
 * @Date: 2020-06-18 17:56:32
 * @LastEditTime: 2020-08-11 11:20:09
 * @LastEditors: wish.WuJunLong
--> 

<template>
  <view class="ticket_inquiry">
    <yun-header :statusHeight="iStatusBarHeight" :headerAddress="ticketAddress"></yun-header>

    <view class="ticket_header">
      <view class="ticket_time_list">
        <view
          :class="['ticket_time_btn',{'active': item.number === activeTimeNumber}]"
          @click="clickBtn(item)"
          v-for="(item, index) in ticketTimeList"
          :key="index"
        >
          <view class="time_day">{{item.day}}</view>
          <view class="time_number">{{item.number}}</view>
          <!-- <view class="time_price">&yen; {{item.price}}</view> -->
        </view>
      </view>
      <view class="calendar_btn" @click="backCalendar">
        <image class="calendar_btn_icon" src="@/static/flight_time.png" mode="contain" />日历
      </view>
    </view>

    <view class="ticket_content">
      <view class="ticket_box">
        <view
          class="ticket_list"
          v-for="(item, index) in ticketList"
          :key="index"
          @click="jumpFlightInfo(item)"
        >
          <view class="ticket_left">
            <view class="ticket_message">
              <view class="ticket_start ticket_time">
                <view class="ticket_date">{{item.startTime}}</view>
                <view class="ticket_address">{{item.startAddress}}</view>
              </view>
              <view class="ticket_arrow">
                <view>{{item.voyageTime}}</view>
                <view class="ticket_type" v-if="ticketType !== '国内'">{{item.voyageType}}</view>
              </view>
              <view class="ticket_end ticket_time">
                <view class="ticket_date">
                  {{item.endTime}}
                  <text class="more_time" v-if="item.moreTime">+{{item.moreTime}}天</text>
                </view>
                <view class="ticket_address">{{item.endAddress}}</view>
              </view>
            </view>

            <view class="ticket_details">
              <image class="ticket_details_icon" src="@/static/dhlogo@2x.png" mode="contain" />
              {{item.airline}} | {{item.model}}
            </view>
          </view>

          <view class="ticket_right">
            <view class="ticket_price">
              <text class="currency">&yen;</text>
              {{item.price}}
            </view>
            <view class="overseas" v-if="item.overseas">(境外&yen;{{item.overseas}})</view>
            <view class="ticket_cabin">{{item.cabin}}</view>
            <view v-if="item.reward" class="ticket_reward">奖励金 &yen;{{item.reward}}</view>
          </view>
        </view>
      </view>
    </view>

    <view class="footer_box">
      <flight-filter @openFilter="openFilter"></flight-filter>
    </view>

    <flight-filter-dialog ref="filterDialog"></flight-filter-dialog>
  </view>
</template>

<script>
import ticket from "@/api/ticketInquiry.js";
import flightFilter from "@/components/flight_filter.vue"; // 航班筛选
import flightFilterDialog from "@/components/flight_filter_dialog.vue"; // 航班筛选弹窗
export default {
  components: {
    flightFilter,
    flightFilterDialog,
  },
  data() {
    return {
      iStatusBarHeight: 0, // 导航栏高度
      ticketType: "国内", // 机票查询默认值
      ticketAddress: {
        // 导航栏地址
        to: "重庆",
        from: "北京",
      },

      ticketTimeList: [
        {
          // 日期选择列表
          day: "今天",
          number: "17",
          price: 475,
        },
        {
          day: "明天",
          number: "04-18",
          price: 475,
        },
        {
          day: "后天",
          number: "19",
          price: 475,
        },
        {
          day: "周一",
          number: "20",
          price: 475,
        },
        {
          day: "周二",
          number: "21",
          price: 475,
        },
        {
          day: "周三",
          number: "22",
          price: 475,
        },
      ],
      activeTimeNumber: "04-18", // 日期选择

      ticketList: [
        {
          startTime: "08:00",
          startAddress: "江北T3",
          voyageTime: "2h30m",
          endTime: "10:30",
          endAddress: "大兴",
          price: "390",
          cabin: "经济舱",
          reward: "20",
          airline: "南航CZ2801",
          model: "空客A320(中)",
        },
        {
          startTime: "08:00",
          startAddress: "江北T3",
          voyageTime: "2h30m",
          voyageType: "转 香港",
          moreTime: 1,
          overseas: 4088,
          endTime: "10:30",
          endAddress: "大兴",
          price: "280",
          cabin: "经济舱4.8折",
          reward: "",
          airline: "南航CZ2801",
          model: "空客A320(中)",
        },
        {
          startTime: "09:00",
          startAddress: "江北T3",
          voyageTime: "2h45m",
          endTime: "11:45",
          endAddress: "首都T3",
          price: "300",
          cabin: "经济舱",
          reward: "",
          airline: "南航CZ2801",
          model: "空客A320(中)",
        },
        {
          startTime: "08:00",
          startAddress: "江北T3",
          voyageTime: "2h30m",
          endTime: "10:30",
          endAddress: "大兴",
          price: "390",
          cabin: "经济舱",
          reward: "",
          airline: "南航CZ2801",
          model: "空客A320(中)",
        },
        {
          startTime: "08:00",
          startAddress: "江北T3",
          voyageTime: "2h30m",
          endTime: "10:30",
          endAddress: "大兴",
          price: "390",
          cabin: "经济舱",
          reward: "20",
          airline: "南航CZ2801",
          model: "空客A320(中)",
        },
        {
          startTime: "08:00",
          startAddress: "江北T3",
          voyageTime: "2h30m",
          endTime: "10:30",
          endAddress: "大兴",
          price: "390",
          cabin: "经济舱",
          reward: "",
          airline: "南航CZ2801",
          model: "空客A320(中)",
        },
      ],
    };
  },
  methods: {
    // 获取航班信息
    getTicketData() {
      let data = {
        departure: "PEK", // 起飞机场三字码
        arrival: "CKG", // 到达机场三字码
        departureTime: "2020-09-06", // 起飞时间
        airline: "", // 航司二字码
      };
      ticket.getTicket(data).then((res) => {
        console.log(res);
        if(res.errorcode === 10000){
          this.ticketList = res.data.IBE
        }else{
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      });
      console.log(this.ticketList)
    },

    // 选择日期
    clickBtn(val) {
      console.log(val);
      this.activeTimeNumber = val.number;
    },

    // 返回日历选择
    backCalendar() {},

    // 打开筛选
    openFilter() {
      this.$refs.filterDialog.openFilterDialog();
    },
    // 关闭弹出框
    closeFilterDialog() {
      this.$refs.filterDialog.closeFilterDialog();
    },

    // 跳转航程信息
    jumpFlightInfo(data) {
      uni.navigateTo({
        url: "/pages/flightInfo/flightInfo",
      });
    },
  },
  onLoad(data) {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.ticketType = data.type;
    console.log(data);
    this.getTicketData();
  },
};
</script>

<style scoped lang="less">
.ticket_inquiry {
  display: flex;
  flex-direction: column;
  height: 100vh;
  .header_topbar {
    background: rgba(0, 112, 226, 1);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    position: relative;
    padding: 0 20upx 20upx;
    height: var(--status-bar-height);
    .go_back {
      position: absolute;
      left: 20upx;
      width: 40upx;
      height: 40upx;
    }
    .title {
      font-size: 36upx;
      font-weight: bold;
      letter-spacing: 8upx;
      color: rgba(255, 255, 255, 1);
      display: flex;
      align-items: center;
      .title_icon {
        width: 35upx;
        height: 8upx;
        margin: 0 28upx;
      }
    }
  }

  .header {
    width: 100%;
    height: 88upx;
    background: rgba(0, 112, 226, 1);
  }
  .ticket_header {
    height: 144upx;
    background: rgba(0, 112, 226, 1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 20upx;
    .ticket_time_list {
      display: flex;
      align-items: center;
      text-align: center;
      flex: 1;
      overflow-x: auto;
      height: 100%;
      .ticket_time_btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 130upx;
        height: 104upx;
        background: rgba(30, 139, 249, 0.9);
        border-radius: 20upx;
        margin-right: 20upx;
        color: rgba(255, 255, 255, 1);
        &.active {
          background: rgba(255, 255, 255, 1);
          color: rgba(42, 42, 42, 1);
          .time_price {
            color: rgba(255, 0, 0, 1);
          }
        }
        .time_day {
          font-size: 18upx;
          font-weight: 400;
          letter-spacing: 5upx;
        }
        .time_number {
          font-size: 34upx;
          font-weight: bold;
          line-height: 40upx;
        }
        .time_price {
          font-size: 20upx;
          font-weight: 500;
        }
      }
    }
    .calendar_btn {
      width: 120upx;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 22upx;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      .calendar_btn_icon {
        width: 40upx;
        height: 40upx;
        margin-bottom: 6upx;
      }
    }
  }

  .ticket_content {
    background: rgba(242, 244, 246, 1);
    padding: 20upx;
    flex: 1;
    overflow-y: auto;
    .ticket_box {
      .ticket_list {
        display: flex;
        justify-content: space-between;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 12upx 18upx rgba(0, 0, 0, 0.04);
        border-radius: 20upx;
        padding: 26upx 20upx;
        &:not(:last-child) {
          margin-bottom: 20upx;
        }
        .ticket_left {
          width: 60%;
          .ticket_message {
            display: flex;
            justify-content: space-between;
            margin-bottom: 34upx;
            .ticket_time {
              .ticket_date {
                font-size: 36upx;
                font-weight: bold;
                color: rgba(42, 42, 42, 1);
                margin-bottom: 6upx;
                position: relative;
                .more_time {
                  position: absolute;
                  font-size: 18upx;
                  font-weight: 400;
                  color: rgba(42, 42, 42, 1);
                  top: 0;
                  right: -1;
                  width: 60upx;
                }
              }
              .ticket_address {
                font-size: 22upx;
                font-weight: 400;
                color: rgba(42, 42, 42, 1);
              }
            }
            .ticket_arrow {
              font-size: 22upx;
              font-weight: 400;
              color: rgba(175, 185, 196, 1);
              position: relative;
              padding-top: 10upx;
              .ticket_type {
                margin-top: 14upx;
              }

              &::before {
                content: "";
                position: absolute;
                background: url(@/static/ticket_path.png) no-repeat;
                background-size: contain;
                width: 113upx;
                height: 21upx;
                top: 32upx;
                left: -6upx;
              }
            }
          }

          .ticket_details {
            font-size: 20upx;
            font-weight: 400;
            color: rgba(175, 185, 196, 1);
            .ticket_details_icon {
              width: 22upx;
              height: 16upx;
              margin-right: 8upx;
            }
          }
        }

        .ticket_right {
          text-align: right;
          .ticket_price {
            font-size: 42upx;
            font-weight: bold;
            color: rgba(255, 0, 0, 1);
            margin-bottom: 2upx;
            .currency {
              font-size: 24upx;
            }
          }
          .overseas {
            font-size: 20upx;
            font-weight: 400;
            color: rgba(0, 112, 226, 1);
          }
          .ticket_cabin {
            font-size: 22upx;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
            margin-bottom: 2upx;
          }
          .ticket_reward {
            background: rgba(255, 0, 0, 0.1);
            font-size: 18upx;
            font-weight: 400;
            color: rgba(255, 0, 0, 1);
            padding: 2upx 12upx;
            display: inline-flex;
            align-items: center;
          }
        }
      }
    }
  }

  .footer_box {
    height: 100upx;
    width: 100vw;
    border-top: 2upx solid rgba(229, 229, 229, 1);
    background-color: #fff;
    padding-bottom: var(--status-bar-height);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
