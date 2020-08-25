<!--
 * @Description: 机票查询 - 单程
 * @Author: wish.WuJunLong
 * @Date: 2020-06-18 17:56:32
 * @LastEditTime: 2020-08-25 12:02:37
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

    <scroll-view :enable-back-to-top="true" :scroll-y="true" class="ticket_content">
      <view
        class="ticket_list"
        v-for="(item, index) in ticketList"
        :key="index"
        @click="jumpFlightInfo(item)"
      >
        <view class="ticket_left">
          <view class="ticket_message">
            <view class="ticket_start ticket_time">
              <view class="ticket_date">{{$dateTool(item.segments[0].depTime,'HH:mm')}}</view>
              <view
                class="ticket_address"
              >{{item.segments[0].depAirportName}}{{item.segments[0].depTerminal !== '--'? item.segments[0].depTerminal: ''}}</view>
            </view>
            <view class="ticket_arrow">
              <view>{{Number(item.segments[0].duration.split(":")[0])}}h{{Number(item.segments[0].duration.split(":")[1])}}m</view>
              <view class="ticket_type" v-if="ticketType !== '国内'">{{item.voyageType}}</view>
            </view>
            <view class="ticket_end ticket_time">
              <view class="ticket_date">
                {{$dateTool(item.segments[0].arrTime,'HH:mm')}}
                <text class="more_time" v-if="item.moreTime">+{{item.moreTime}}天</text>
              </view>
              <view
                class="ticket_address"
              >{{item.segments[0].arrAirportName}}{{item.segments[0].arrTerminal !== '--' ?item.segments[0].arrTerminal : ''}}</view>
            </view>
          </view>

          <view class="ticket_details">
            <image
              class="ticket_details_icon"
              :src="'http://192.168.0.187:8092/'+ item.segments[0][item.segments[0].flightNumber.slice(0,2)].image"
              mode="contain"
            />
            {{item.segments[0][item.segments[0].flightNumber.slice(0,2)].air_name}}{{item.segments[0].flightNumber}} | {{item.segments[0].aircraftCode}}
          </view>
        </view>

        <view class="ticket_right">
          <view class="ticket_price">
            <text class="currency">&yen;</text>
            <view
              v-if="item.ItineraryInfos['经济舱'][0].cabinPrices.ADT.rulePrice.price"
            >{{item.ItineraryInfos['经济舱'][0].cabinPrices.ADT.rulePrice.price}}</view>
            <view v-else class="not_price"></view>
          </view>
          <view class="overseas" v-if="item.overseas">(境外&yen;{{item.overseas}})</view>
          <view class="ticket_cabin">{{item.ItineraryInfos['经济舱'][0].cabinInfo.cabinDesc}}</view>
          <view v-if="item.reward" class="ticket_reward">奖励金 &yen;{{item.reward}}</view>
        </view>
      </view>
    </scroll-view>

    <view class="footer_box">
      <flight-filter @openFilter="openFilter" @filterType="listFilter"></flight-filter>
    </view>

    <flight-filter-dialog ref="filterDialog"></flight-filter-dialog>
  </view>
</template>

<script>
import moment from "moment";
moment.locale("zh-cn");
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
        departure: "", // 起飞机场三字码
        arrival: "",
      },

      ticketTimeList: [],
      activeTimeNumber: "04-18", // 日期选择
      ticketList: [],
      ticketListData: [
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
      ],
    };
  },
  methods: {
    // 获取航班信息
    getTicketData(data) {
      this.ticketList = [];
      ticket.getTicket(data).then((res) => {
        console.log(res); 
        if (res.errorcode === 10000) {
          // res.data.IBE.forEach((item) => {
          //   item["nfd"] = {};
          // });
          this.ticketList = res.data.IBE;
          console.log(this.ticketList);
          if (this.ticketList.length < 1) {
            uni.showToast({
              title: "当日暂无航班信息，请切换其他日期",
              icon: "none",
            });
          }
          // this.getNfdData();
        } else {
          uni.showToast({
            title: "查询航班失败，" + res.msg,
            icon: "none",
            mask: true,
          });
          setTimeout(() => {
            uni.switchTab({
              url: "/pages/index/index",
            });
          }, 1000);
        }
      });
      console.log(this.ticketList);
    },

    // 获取票价舱位信息
    getNfdData() {
      this.ticketList.forEach((item, index) => {
        let dataList = {
          // sourceCode: 'IBE',
          QueryDate: item.QueryDate,
          Departure: item.Departure,
          Destination: item.Destination,
          SystemMsg: item.SystemMsg,
          segments: item.segments,
          // relatedKey: '',
          cabins: item.ItineraryInfos.NFD.cabinInfo,
        };
        ticket.getNfd(dataList).then((res) => {
          this.$nextTick(() => {
            item["nfd"] = res;
            res.ItineraryInfos[0].cabinPrices.ADT.rulePrice.price;
          });
        });
      });
    },

    // 选择日期
    clickBtn(val) {
      console.log(val);
      this.activeTimeNumber = val.number;
      let airMessage = {
        departure: this.ticketData.to.city_code, // 起飞机场三字码
        arrival: this.ticketData.from.city_code, // 到达机场三字码
        departureTime: val.date, // 起飞时间
        airline: "", // 航司二字码
      };
      this.getTicketData(airMessage);
    },
    // 时间列表处理
    getDateList() {
      let day = moment(this.ticketData.toTime.date).format("YYYY-MM-DD");
      let dayNumber = 0;
      for (let index = 0; index < 7; index++) {
        this.ticketTimeList.push({
          day: moment(day).add(dayNumber, "d").calendar(null, {
            sameDay: "今天",
            nextDay: "明天",
            nextWeek: "ddd",
            sameElse: "dddd",
          }),
          date: moment(this.ticketData.toTime.date)
            .add(dayNumber, "d")
            .format("YYYY-MM-DD"),
          number:
            moment(day).add(dayNumber, "d").format("DD") === "01"
              ? moment(day).add(dayNumber, "d").format("MM") +
                "-" +
                moment(day).add(dayNumber, "d").format("DD")
              : moment(day).add(dayNumber, "d").format("DD"),
        });
        dayNumber += 1;
      }
      this.activeTimeNumber = this.ticketTimeList[0].number;
    },

    // 返回日历选择
    backCalendar() {
      uni.navigateTo({
        url: "/pages/dateSelect/dateSelect",
      });
    },

    // 列表筛选
    listFilter(val) {
      if (val === "price") {
      }
      console.log(val);
    },

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
      console.log(data);
      data["to"] = this.ticketData.to.city_name;
      data["from"] = this.ticketData.from.city_name;
      (data["departure"] = this.ticketData.to.city_code), // 起飞机场三字码
        (data["arrival"] = this.ticketData.from.city_code), // 到达机场三字码
        uni.navigateTo({
          url: "/pages/flightInfo/flightInfo?airData=" + JSON.stringify(data),
        });
    },
  },
  onLoad(data) {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.ticketData = JSON.parse(data.data);
    /**
      this.ticketData = {
        from: {
          air_port: "SYX",
          air_port_ename: "Phoenix International Airport",
          air_port_name: "凤凰国际机场",
          chan_chird: "东亚",
          chau: "亚洲",
          city_code: "BJS",
          city_ename: "SANYA",
          city_name: "三亚",
          city_pinyin: "sanya",
          country: "中国",
          country_code: "CN",
          id: 1963,
          province: "海南",
          province_pinyin: "hainan",
          province_py: "hn",
        },

        to: {
          air_port: "CKG",
          air_port_ename: "Jiangbei International Airport",
          air_port_name: "江北国际机场",
          chan_chird: "东亚",
          chau: "亚洲",
          city_code: "CKG",
          city_ename: "CHONGQING",
          city_name: "重庆",
          city_pinyin: "",
          country: "中国",
          country_code: "CN",
          id: 1353,
          province: "重庆",
          province_pinyin: "chongqing",
          province_py: "cq",
        },

        toTime: {
          date: "2020-08-31",
          month: "8月31日",
          status: "start",
          type: "time",
          week: "周一",
        },
      };
    */
    console.log(this.ticketData);
    // 组装数据
    this.ticketAddress = {
      to: this.ticketData.to.city_name,
      from: this.ticketData.from.city_name,
      departure: this.ticketData.to.city_code, // 起飞机场三字码
      arrival: this.ticketData.from.city_code, // 到达机场三字码
    };
    let airMessage = {
      departure: this.ticketData.to.city_code, // 起飞机场三字码
      arrival: this.ticketData.from.city_code, // 到达机场三字码
      departureTime: this.ticketData.toTime.date, // 起飞时间
      airline: "", // 航司二字码
    };
    this.getTicketData(airMessage);

    this.getDateList(); // 时间处理
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
    flex: 1;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 20upx 0;
    .ticket_list {
      display: flex;
      justify-content: space-between;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 12upx 18upx rgba(0, 0, 0, 0.04);
      border-radius: 20upx;
      padding: 26upx 20upx;
      margin: 0 20upx;
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
          display: flex;
          align-items: baseline;
          .currency {
            font-size: 24upx;
            margin-right: 6upx;
          }
        }
        .not_price {
          height: 40upx;
          width: 120upx;
          background-color: #f1f3f5;
          display: inline-block;
          position: relative;
          overflow: hidden;
          &::before {
            width: 20upx;
            height: 200%;
            content: "";
            display: block;
            background-color: #fff;
            position: absolute;
            top: -50%;
            left: 60upx;
            transform: rotate(30deg);
            animation: skeleton 1.5s infinite;
          }
          @keyframes skeleton {
            from {
              left: -50upx;
            }
            to {
              left: 120%;
            }
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
