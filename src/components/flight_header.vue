<!--
 * @Description: 航班信息 - 头部信息
 * @Author: wish.WuJunLong
 * @Date: 2020-06-24 16:18:02
 * @LastEditTime: 2021-02-18 17:32:05
 * @LastEditors: wish.WuJunLong
-->
<template>
  <view class="fight_header">
    <view class="main_list_title" v-if="flightTitle === 'refund'">航班信息</view>
    <view class="main_list_title" v-if="flightTitle === 'change'">原航班</view>
    <view class="main_list_title" v-if="flightTitle === 'detail_new'">新航班</view>
    <!-- 改签后的新航班 -->
    <view class="main_list_title change_new_ticket" v-if="flightTitle === 'new'">
      <view>新航班</view>
      <view class="ticket_btn" @click="newTicket">重选航班</view>
    </view>
    <view class="fight_list">
      <view class="header_message">
        <view
          :class="['header_type', { round_trip_type: flightData.flightType === '返程' }]"
          >{{ flightData.flightType }}</view
        >
        <view class="header_time"
          >{{
            $dateTool(
              flightData.data[0][interType ? "depTime" : "departure_time"],
              "YYYY-MM-DD"
            )
          }}
          {{
            $dateTool(
              flightData.data[0][interType ? "depTime" : "departure_time"],
              "dddd"
            )
          }}</view
        >
      </view>

      <!-- 单程直飞 -->
      <view class="content_message" v-if="flightData.data.length <= 1">
        <view class="left_message address_message">
          <view class="time">{{
            $dateTool(
              flightData.data[0][interType ? "depTime" : "departure_time"],
              "HH:mm"
            )
          }}</view>
          <view class="address">
            {{
              flightData.data[0][interType ? "depAirport_CN" : "departure_CN"].province +
                flightData.data[0][interType ? "depAirport_CN" : "departure_CN"]
                  .air_port_name
            }}
            {{
              flightData.data[0][interType ? "depTerminal" : "departure_terminal"] || ""
            }}
          </view>
        </view>
        <view class="center_message">
          <view class="duration" v-if="interType">
            {{ Math.floor(flightData.data[0].duration / 60) }}h{{
              Math.floor(flightData.data[0].duration % 60)
            }}m
          </view>
          <view v-else class="duration">
            {{
              Math.floor(
                $timeDiff(
                  flightData.data[0].arrive_time,
                  flightData.data[0].departure_time,
                  "minutes"
                ) / 60
              )
            }}h{{
              Math.floor(
                $timeDiff(
                  flightData.data[0].arrive_time,
                  flightData.data[0].departure_time,
                  "minutes"
                ) % 60
              )
            }}m
          </view>
          <view class="arrow_icon"></view>
          <view
            class="arrow_stop"
            v-if="flightData.data[0].stopCount > 0"
            @click="openTicketStopMessage(true)"
            >经停</view
          >
        </view>
        <view class="right_message address_message">
          <view class="time">{{
            $dateTool(flightData.data[0][interType ? "arrTime" : "arrive_time"], "HH:mm")
          }}</view>
          <view class="address"
            >{{
              flightData.data[0][interType ? "arrAirport_CN" : "arrive_CN"].province +
                flightData.data[0][interType ? "arrAirport_CN" : "arrive_CN"]
                  .air_port_name
            }}
            {{ flightData.data[0][interType ? "arrTerminal" : "arrive_terminal"] || "" }}
          </view>
        </view>
      </view>

      <!-- 单程 中转 -->
      <view :class="['content_message transit', { fold: !filghtFold }]" v-else>
        <view
          class="flight_message"
          v-for="(item, index) in flightData.data"
          :key="index"
        >
          <view class="fly_message">
            <view class="fly_left">
              <view class="fly_time">{{
                $dateTool(item[interType ? "depTime" : "departure_time"], "HH:mm")
              }}</view>
              <view class="fly_date">
                <image
                  class="fly_date_icon"
                  src="@/static/filter_time.png"
                  mode="aspectFill"
                />
                {{
                  Math.floor(
                    $timeDiff(
                      item[interType ? "arrTime" : "arrive_time"],
                      item[interType ? "depTime" : "departure_time"],
                      "minutes"
                    ) / 60
                  )
                }}h{{
                  Math.floor(
                    $timeDiff(
                      item[interType ? "arrTime" : "arrive_time"],
                      item[interType ? "depTime" : "departure_time"],
                      "minutes"
                    ) % 60
                  )
                }}m
              </view>
              <view class="fly_time">{{
                $dateTool(item[interType ? "arrTime" : "arrive_time"], "HH:mm")
              }}</view>
            </view>
            <view class="fly_line"></view>
            <view class="fly_right">
              <view class="fly_air">
                {{
                  item[interType ? "depAirport_CN" : "departure_CN"].air_port +
                    " " +
                    item[interType ? "depAirport_CN" : "departure_CN"].city_name +
                    item[interType ? "depAirport_CN" : "departure_CN"].air_port_name +
                    (item[interType ? "depTerminal" : "departure_terminal"]
                      ? " / " + item[interType ? "depTerminal" : "departure_terminal"]
                      : "")
                }}
              </view>

              <view class="fly_info">
                <image
                  class="air_image"
                  v-if="item.image"
                  :src="'https://fxxcx.ystrip.cn' + item.image"
                  mode="aspectFill"
                />
                {{
                  item.airline_CN.air_name || item.airline_CN +
                    item[interType ? "flightNumber" : "flight_no"] +
                    " | " +
                    item[interType ? "aircraftCode" : "model"]
                }}
              </view>

              <view class="fly_air bottom_fly_ait">
                {{
                  item[interType ? "arrAirport_CN" : "arrive_CN"].air_port +
                    " " +
                    item[interType ? "arrAirport_CN" : "arrive_CN"].city_name +
                    item[interType ? "arrAirport_CN" : "arrive_CN"].air_port_name +
                    (item[interType ? "arrTerminal" : "arrive_terminal"]
                      ? " / " + item[interType ? "arrTerminal" : "arrive_terminal"]
                      : "")
                }}
              </view>
            </view>
          </view>
          <view class="transit_message" v-if="index === 0">
            转
            {{
              flightData.data[0][interType ? "arrAirport_CN" : "arrive_CN"].city_name +
                " 停留 "
            }}
            {{
              Math.floor(
                $timeDiff(
                  flightData.data[flightData.data.length - 1][
                    interType ? "depTime" : "departure_time"
                  ],
                  flightData.data[0][interType ? "arrTime" : "arrive_time"],
                  "minutes"
                ) / 60
              )
            }}h{{
              Math.floor(
                $timeDiff(
                  flightData.data[flightData.data.length - 1][
                    interType ? "depTime" : "departure_time"
                  ],
                  flightData.data[0][interType ? "arrTime" : "arrive_time"],
                  "minutes"
                ) % 60
              )
            }}m
          </view>
        </view>
      </view>
      <view class="bottom_message" v-if="flightData.data.length <= 1">
        <image
          class="bottom_message_icon"
          v-if="flightData.data[0].image"
          :src="'https://fxxcx.ystrip.cn' + flightData.data[0].image"
          mode="aspectFill"
        />
        {{
          flightData.data[0].airline_CN.air_name || flightData.data[0].airline_CN +
            flightData.data[0][interType ? "flightNumber" : "flight_no"]
        }}{{
          flightData.data[0][interType ? "aircraftCode" : "model"]
            ? " | " + flightData.data[0][interType ? "aircraftCode" : "model"]
            : ""
        }}
        {{ flightData.data[0].MealCode ? " | 有餐食" : "" }}
      </view>

      <view
        class="flight_reservation_box"
        v-if="!flightInfo && !roundTripType"
        @click="openHeadExp"
      >
        {{
          flightData.cabinInfo[interType ? "cabinDesc" : "cabin"]
            ? flightData.cabinInfo[interType ? "cabinCode" : "cabin"] +
              flightData.cabinInfo[interType ? "cabinDesc" : "cabin"] +
              " | "
            : ""
        }}退改签规则
        {{ flightData.cabinInfo.baggage ? " | " + flightData.cabinInfo.baggage : "" }}
        <view class="message_more_btn"></view>
      </view>
    </view>
    <view class="fight_list found_fight_list" v-if="roundTripType">
      <view class="header_message">
        <view class="header_type round_trip_type">{{
          roundTripFlightData.flightType
        }}</view>
        <view class="header_time"
          >{{ $dateTool(roundTripFlightData.data[0].depTime, "YYYY-MM-DD") }}
          {{ $dateTool(roundTripFlightData.data[0].depTime, "dddd") }}</view
        >
      </view>
      <view class="content_message" v-if="roundTripFlightData.data.length <= 1">
        <view class="left_message address_message">
          <view class="time">{{
            $dateTool(roundTripFlightData.data[0].depTime, "HH:mm")
          }}</view>
          <view class="address"
            >{{
              roundTripFlightData.data[0].depAirport_CN.province +
                roundTripFlightData.data[0].depAirport_CN.air_port_name
            }}
            {{
              roundTripFlightData.data[0][
                interType ? "depTerminal" : "departure_terminal"
              ]
            }}
          </view>
        </view>
        <view class="center_message">
          <view class="duration">
            {{ Math.floor(roundTripFlightData.data[0].duration / 60) }}h{{
              Math.floor(roundTripFlightData.data[0].duration % 60)
            }}m
          </view>
          <view class="arrow_icon"></view>
          <view
            class="arrow_stop"
            v-if="roundTripFlightData.data[0].stopCount > 0"
            @click="openTicketStopMessage(false)"
            >经停</view
          >
        </view>
        <view class="right_message address_message">
          <view class="time">{{
            $dateTool(roundTripFlightData.data[0].arrTime, "HH:mm")
          }}</view>
          <view class="address"
            >{{
              roundTripFlightData.data[0].arrAirport_CN.province +
                roundTripFlightData.data[0].arrAirport_CN.air_port_name
            }}
            {{
              roundTripFlightData.data[0][interType ? "arrTerminal" : "arrive_terminal"]
            }}
          </view>
        </view>
      </view>

      <!-- 往返 中转 -->
      <view :class="['content_message transit', { fold: !filghtFold }]" v-else>
        <view
          class="flight_message"
          v-for="(item, index) in roundTripFlightData.data"
          :key="index"
        >
          <view :class="['fly_message', { fold: !filghtFold }]">
            <view class="fly_left">
              <view class="fly_time">{{ $dateTool(item.depTime, "HH:mm") }}</view>
              <view class="fly_date">
                <image
                  class="fly_date_icon"
                  src="@/static/filter_time.png"
                  mode="aspectFill"
                />
                {{ Math.floor($timeDiff(item.arrTime, item.depTime, "minutes") / 60) }}h{{
                  Math.floor($timeDiff(item.arrTime, item.depTime, "minutes") % 60)
                }}m
              </view>
              <view class="fly_time">{{ $dateTool(item.arrTime, "HH:mm") }}</view>
            </view>
            <view class="fly_line"></view>
            <view class="fly_right">
              <view class="fly_air">
                {{
                  item[interType ? "depAirport_CN" : "departure_CN"].air_port +
                    " " +
                    item[interType ? "depAirport_CN" : "departure_CN"].city_name +
                    item[interType ? "depAirport_CN" : "departure_CN"].air_port_name +
                    (item[interType ? "depTerminal" : "departure_terminal"]
                      ? " / " + item[interType ? "depTerminal" : "departure_terminal"]
                      : "")
                }}
              </view>

              <view class="fly_info">
                <image
                  class="air_image"
                  v-if="item.image"
                  :src="'https://fxxcx.ystrip.cn' + item.image"
                  mode="aspectFill"
                />
                {{
                  item.airline_CN.air_name || item.airline_CN +
                    item[interType ? "flightNumber" : "flight_no"] +
                    " | " +
                    item[interType ? "aircraftCode" : "model"]
                }}
              </view>

              <view class="fly_air bottom_fly_ait">
                {{
                  item[interType ? "arrAirport_CN" : "arrive_CN"].air_port +
                    " " +
                    item[interType ? "arrAirport_CN" : "arrive_CN"].city_name +
                    item[interType ? "arrAirport_CN" : "arrive_CN"].air_port_name +
                    (item[interType ? "arrTerminal" : "arrive_terminal"]
                      ? " / " + item[interType ? "arrTerminal" : "arrive_terminal"]
                      : "")
                }}
              </view>
            </view>
          </view>
          <view class="transit_message" v-if="index === 0">
            转
            {{
              roundTripFlightData.data[flightData.data.length - 1][
                interType ? "arrAirport_CN" : "arrive_CN"
              ].city_name + " 停留 "
            }}
            {{
              Math.floor(
                $timeDiff(
                  roundTripFlightData.data[roundTripFlightData.data.length - 1][
                    interType ? "depTime" : "departure_time"
                  ],
                  roundTripFlightData.data[0][interType ? "arrTime" : "arrive_time"],
                  "minutes"
                ) / 60
              )
            }}h{{
              Math.floor(
                $timeDiff(
                  roundTripFlightData.data[roundTripFlightData.data.length - 1][
                    interType ? "depTime" : "departure_time"
                  ],
                  roundTripFlightData.data[0][interType ? "arrTime" : "arrive_time"],
                  "minutes"
                ) % 60
              )
            }}m
          </view>
        </view>
      </view>

      <view class="bottom_message" v-if="roundTripFlightData.data.length <= 1">
        <image
          class="bottom_message_icon"
          v-if="roundTripFlightData.data[0].image"
          :src="'https://fxxcx.ystrip.cn' + roundTripFlightData.data[0].image"
          mode="aspectFill"
        />

        {{
          roundTripFlightData.data[0].airline_CN.air_name || roundTripFlightData.data[0].airline_CN +
            roundTripFlightData.data[0][interType ? "flightNumber" : "flight_no"]
        }}{{
          roundTripFlightData.data[0][interType ? "aircraftCode" : "model"]
            ? " | " + roundTripFlightData.data[0][interType ? "aircraftCode" : "model"]
            : ""
        }}
        {{ roundTripFlightData.data[0].MealCode ? " | 有餐食" : "" }}
      </view>
      <view class="flight_reservation_box" v-if="!flightInfo" @click="openHeadExp()">
        {{
          flightData.cabinInfo[interType ? "cabinDesc" : "cabin"]
            ? flightData.cabinInfo[interType ? "cabinCode" : "cabin"] +
              flightData.cabinInfo[interType ? "cabinDesc" : "cabin_level"] +
              " | "
            : ""
        }}退改签规则
        {{ flightData.cabinInfo.baggage ? " | " + flightData.cabinInfo.baggage : "" }}
        <view class="message_more_btn"></view>
      </view>
      <view class="flight_reservation_box" v-if="!flightInfo" @click="openHeadExp('arr')">
        {{
          roundTripFlightData.cabinInfo.cabinDesc
            ? roundTripFlightData.cabinInfo.cabinCode +
              roundTripFlightData.cabinInfo.cabinDesc +
              " | "
            : ""
        }}退改签规则
        {{
          roundTripFlightData.cabinInfo.baggage
            ? " | " + roundTripFlightData.cabinInfo.baggage
            : ""
        }}
        <view class="message_more_btn"></view>
      </view>

      <!-- <view
        class="flight_reservation_box"
        v-else-if="!flightInfo && flightData.data.length > 1"
        v-for="(item, index) in flightData.data"
        :key="index"
      >
        3{{item.cabin?item.cabin+' | ': ''}}退改签规则 {{item.baggage?' | '+ item.baggage: ''}}
        <view class="message_more_btn"></view>
      </view> -->
    </view>

    <view
      @click="flodBtn"
      :class="['filght_fold', { unfold: filghtFold }]"
      v-if="flightData.data.length > 1 || roundTripFlightData.data.length > 1"
      >{{ filghtFold ? "收起详情" : "展开详情" }}</view
    >

    <uni-popup ref="stopMessagePopup" type="bottom">
      <view class="stop_message_popup">
        <view class="title">
          <text>经停信息</text>
          <view class="close_btn" @click="closeStopMessage"></view>
        </view>
        <view class="stop_message_main" v-if="stopMessageType">
          <view
            class="stop_message_list"
            v-for="(item, index) in stopMessage"
            :key="index"
          >
            <view class="list_message">经停机场：{{ item.air_port_name }}</view>
            <view class="list_message">到达时间：{{ item.departure_time }}</view>
            <view class="list_message">离开时间：{{ item.arrive_time }}</view>
            <view class="list_message">经停{{ item.stop_time }}分钟</view>
          </view>
        </view>
        <view class="stop_message_main" v-else>
          <view
            class="stop_message_list"
            v-for="(item, index) in roundStopMessage"
            :key="index"
          >
            <view class="list_message">经停机场：{{ item.air_port_name }}</view>
            <view class="list_message">到达时间：{{ item.departure_time }}</view>
            <view class="list_message">离开时间：{{ item.arrive_time }}</view>
            <view class="list_message">经停{{ item.stop_time }}分钟</view>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import ticket from "@/api/ticketInquiry.js";
export default {
  props: {
    flightInfo: {
      // 航班信息状态 true 航班信息、 false 预定页面
      type: Boolean,
      default: () => true,
    },
    interType: {
      // true false 国内订单详情
      type: Boolean,
      default: () => true,
    },
    flightData: {
      // 航班信息数据
      type: Object,
      default: () => {},
    },
    roundTripFlightData: {
      // 返程数据
      type: Object,
      default: () => {},
    },
    roundTripType: {
      // 是否往返
      type: Boolean,
      default: () => false,
    },
    flightTitle: {
      //区别国内  退票   改签
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      filghtFold: false, // 往返中转航班折叠状态

      stopMessage: [], // 经停信息
      roundStopMessage: [], // 返程经停信息

      stopMessageType: null,
    };
  },
  mounted() {
    this.$forceUpdate();

    console.log("航班信息头部", this.flightData, this.roundTripFlightData);

    if (this.flightData.data[0].stopCount > 0) {
      let data = {
        start_time:
          this.flightData.data[0].depTime || this.flightData.data[0].departure_time,
        flight_no:
          this.flightData.data[0].flightNumber || this.flightData.data[0].flight_no,
      };
      this.getStopMessage(data);
    }

    if (this.roundTripFlightData && JSON.stringify(this.roundTripFlightData) !== "{}") {
      if (this.roundTripFlightData.data[0].stopCount > 0) {
        let roundData = {
          start_time:
            this.roundTripFlightData.data[0].depTime ||
            this.roundTripFlightData.data[0].departure_time,
          flight_no:
            this.roundTripFlightData.data[0].flightNumber ||
            this.roundTripFlightData.data[0].flight_no,
        };
        this.getStopMessage(roundData, true);
      }
    }
  },

  methods: {
    // 关闭经停信息弹窗
    closeStopMessage() {
      this.$refs.stopMessagePopup.close();
    },
    // 获取经停信息
    getStopMessage(data, type) {
      ticket.stopMessage(data).then((res) => {
        if (res.code === 1) {
          if (type) {
            this.roundStopMessage = res.msg;
          } else {
            this.stopMessage = res.msg;
          }
        }
      });
    },

    openHeadExp(val) {
      // 打开航班详情弹窗
      console.log("打开弹窗");
      this.$emit("openHeadExpPopup", val);
    },

    flodBtn() {
      // 往返中转折叠航班详情
      this.filghtFold = !this.filghtFold;
    },

    // 改签页面 - 重选航班
    newTicket() {
      this.$emit("changeNewTicket");
    },

    // 打开经停弹窗
    openTicketStopMessage(type) {
      this.stopMessageType = type;
      this.$refs.stopMessagePopup.open();
    },
  },
};
</script>

<style scoped lang="less">
.fight_header {
  border-radius: 20upx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 12upx 18upx rgba(0, 0, 0, 0.04);
  padding: 30upx 20upx 22upx;
  margin: 0 20upx 20upx;
  position: relative;
  z-index: 9;
  .main_list_title {
    font-size: 32upx;
    font-weight: bold;
    color: rgba(42, 42, 42, 1);
    margin-bottom: 24rpx;
    // padding-top: 24rpx;
    flex: 1;
    justify-content: flex-end;
    &.change_new_ticket {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .ticket_btn {
        font-size: 28upx;
        font-weight: 400;
        color: #0070e2;
      }
    }
  }
  .fight_list {
    // &:nth-child(2) {
    //   margin-top: 30upx;
    //   padding-top: 30upx;
    //   // border-top: 2upx dashed #d9e1ea;
    // }
    &.found_fight_list {
      margin-top: 30upx;
      .flight_reservation_box {
        border: unset;
        margin-top: 18upx;
        padding-top: 0;
        justify-content: flex-start;
        padding-left: 6upx;
        &::before {
          content: "";
          display: inline-flex;
          width: 24upx;
          height: 24upx;
          border-radius: 50%;
          align-items: center;
          justify-content: center;
          margin-right: 12upx;
          font-size: 16upx;
          font-weight: 400;
          color: #ffffff;
        }
        &:nth-last-child(2) {
          padding-top: 28upx;
          margin-top: 20upx;
          border-top: 2upx solid #d9e1ea;
          &::before {
            content: "去";
            background: #bfdfff;
          }
        }
        &:last-child {
          &::before {
            content: "返";
            background: #c2efc1;
          }
        }
      }
    }
  }

  .header_message {
    display: flex;
    align-items: center;
    margin-bottom: 20upx;

    .header_type {
      display: inline-flex;
      padding: 2upx 20upx;
      background: linear-gradient(
        270deg,
        rgba(0, 112, 226, 1) 0%,
        rgba(86, 197, 255, 1) 100%
      );
      border-radius: 10upx;
      font-size: 20upx;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      margin-right: 20upx;
      &.round_trip_type {
        background: linear-gradient(90deg, #9bec99 0%, #85cd83 100%);
      }
    }

    .header_time {
      font-size: 24upx;
      font-weight: 400;
      color: rgba(42, 42, 42, 1);
    }
  }

  .content_message {
    display: flex;
    justify-content: space-between;
    margin-bottom: 26upx;
    &.transit {
      flex-direction: column;
      padding-left: 20upx;
      &.fold {
        position: relative;
        &::before {
          content: "";
          display: block;
          position: absolute;
          width: 2upx;
          left: 118upx;
          top: 33upx;
          height: 85upx;
          border-left: 2upx dashed #f1f3f5;
        }
        .flight_message {
          .fly_message {
            height: 35upx;
            .fly_left {
              .fly_date {
                display: none;
              }
            }
            .fly_line {
              background: transparent;
              &::after {
                opacity: 0;
              }
            }
          }

          &:last-child {
            .fly_message {
              .fly_left {
                .fly_date {
                  display: none;
                }
                .fly_time:not(:last-child) {
                  display: none;
                }
              }
              .fly_right {
                .fly_info {
                  display: none;
                }
                .fly_air:not(:last-child) {
                  display: none;
                }
              }
            }
          }
        }
      }
      .flight_message {
        .fly_message {
          display: flex;
          align-items: center;
          height: 140upx;
          overflow: hidden;
          transition: all 0.3s;
        }
        .fly_left {
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: space-between;
          margin-right: 10upx;
          width: 80rpx;
          .fly_time {
            font-size: 28upx;
            font-weight: bold;
            color: #2a2a2a;
          }
          .fly_date {
            font-size: 18upx;
            font-weight: 400;
            color: #afb9c4;
            display: inline-flex;
            align-items: center;
            .fly_date_icon {
              width: 16upx;
              height: 16upx;
              margin-right: 4upx;
            }
          }
        }
        .fly_line {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          width: 4upx;
          height: calc(100% - 12upx);
          background: #d9e1ea;
          margin: 0 10upx;
          transition: all 0.3s;
          &::before,
          &::after {
            content: "";
            transition: all 0.3s;
            display: flex;
            flex-shrink: 0;
            width: 18upx;
            height: 18upx;
            border: 4upx solid #d9e1ea;
            border-radius: 50%;
            background: #fff;
          }
        }
        .fly_right {
          height: 100%;
          display: flex;
          flex-direction: column;
          margin-left: 10upx;
          .fly_air {
            font-size: 28upx;
            font-weight: bold;
            color: #2a2a2a;
            &.bottom_fly_ait {
              margin-top: auto;
            }
          }
          .fly_info {
            display: flex;
            align-items: center;
            font-size: 20upx;
            font-weight: 400;
            color: #afb9c4;
            margin-top: 4upx;
            .air_image {
              width: 20upx;
              height: 20upx;
              object-fit: contain;
              margin-right: 12upx;
            }
          }
        }
      }
      .transit_message {
        display: inline-flex;
        align-items: center;
        padding: 4upx 24upx;
        background: #f1f3f5;
        border-radius: 18upx;
        font-size: 20upx;
        font-weight: 400;
        color: #afb9c4;
        margin: 20upx 0 20upx 116upx;
      }
    }

    .address_message {
      .time {
        font-size: 36upx;
        font-weight: bold;
        color: rgba(42, 42, 42, 1);
        margin-bottom: 8upx;
      }

      .address {
        font-size: 24upx;
        font-weight: 400;
        color: rgba(42, 42, 42, 1);
      }

      &.right_message {
        text-align: right;
      }
    }

    .center_message {
      font-size: 22upx;
      font-weight: 400;
      color: rgba(175, 185, 196, 1);
      position: relative;

      .arrow_icon {
        background: url(@/static/ticket_path.png) no-repeat;
        background-size: contain;
        width: 113upx;
        height: 21upx;
        position: absolute;
        top: 22upx;
        left: -6upx;
      }
      .arrow_stop {
        font-size: 20upx;
        font-weight: 400;
        color: orange;
        padding: 2upx 9upx 2upx 15upx;
        display: inline-flex;
        border: 2upx solid #ffa500;
        margin-top: 20upx;
        align-items: center;
        &::after {
          content: "";
          background: url("@/static/ticket_stop_arrow.png") no-repeat center center;
          width: 20upx;
          height: 20upx;
          background-size: contain;
          margin-left: 8upx;
        }
      }
    }
  }

  .bottom_message {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20upx;
    font-weight: 400;
    color: rgba(175, 185, 196, 1);

    .bottom_message_icon {
      display: inline-flex;
      width: 22upx;
      height: 16upx;
      margin-right: 8upx;
    }
  }

  .flight_reservation_box {
    border-top: 1px dashed rgba(217, 225, 234, 1);
    margin-top: 24upx;
    padding-top: 22upx;
    font-size: 24upx;
    font-weight: 400;
    color: #666;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    .message_more_btn {
      background: url(@/static/arrow.png) no-repeat;
      background-size: contain;
      width: 8upx;
      height: 14upx;
      margin-left: 18upx;
      display: inline-flex;
    }
  }

  .filght_fold {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24upx;
    font-weight: 400;
    color: #afb9c4;
    margin-top: 20upx;
    &.unfold {
      &::after {
        transform: rotate(180deg);
      }
    }
    &::after {
      content: "";
      transition: all 0.3s;
      display: block;
      background: url("@/static/unfold.png") no-repeat;
      background-size: contain;
      width: 20upx;
      height: 12upx;
      margin-left: 10upx;
    }
  }
  .stop_message_popup {
    position: relative;
    &::before {
      content: "";
      position: absolute;
      bottom: -120upx;
      width: 100%;
      height: 120upx;
      background-color: #fff;
    }
    .title {
      height: 110upx;
      background: rgba(255, 255, 255, 1);
      border-radius: 80upx 80upx 0 0;
      position: relative;
      border-bottom: 2upx solid rgba(217, 225, 234, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30upx;
      font-weight: bold;
      color: #333333;
      .close_btn {
        position: absolute;
        background: url(@/static/popup_close.png) no-repeat;
        background-size: contain;
        width: 30upx;
        height: 30upx;
        top: 45upx;
        right: 55upx;
      }
    }
    .stop_message_main {
      padding: 46upx 40upx var(--status-bar-height);
      height: 100%;
      box-sizing: border-box;
      width: 100%;
      background: rgba(255, 255, 255, 1);
      .stop_message_list {
        &:not(:last-child) {
          margin-bottom: 10upx;
          padding-bottom: 10upx;
          border-bottom: 2upx solid rgba(217, 225, 234, 1);
        }
        .list_message {
          font-size: 30upx;
          &:not(:last-child) {
            margin-bottom: 15upx;
          }
        }
      }
    }
  }
}
</style>
