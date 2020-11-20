<!--
 * @Description: 航班信息 - 头部信息
 * @Author: wish.WuJunLong
 * @Date: 2020-06-24 16:18:02
 * @LastEditTime: 2020-11-20 11:56:23
 * @LastEditors: Please set LastEditors
--> 
<template>
  <view class="fight_header">
    <view class="main_list_title" v-if="flightTitle === 'refund'">航班信息</view>
    <view class="main_list_title" v-if="flightTitle === 'change'">原航班</view>
    <view class="fight_list">
      <view class="header_message">
        <view :class="['header_type', {'round_trip_type': flightData.flightType === '返程'}]">{{flightData.flightType}}</view>
        <view
          class="header_time"
        >{{$dateTool(flightData.data[0][interType?'depTime':'departure_time'],'YYYY-MM-DD')}}
         {{$dateTool(flightData.data[0][interType?'depTime':'departure_time'],'dddd')}}</view>
      </view>

      <!-- 单程直飞 -->
      <view class="content_message" v-if="flightData.data.length <= 1">
        <view class="left_message address_message">
          <view class="time">{{$dateTool(flightData.data[0][interType?'depTime':'departure_time'],'HH:mm')}}</view>
          <view
            class="address"
          >
          {{flightData.data[0][interType?'depAirport_CN':'departure_CN'].province + flightData.data[0][interType?'depAirport_CN':'departure_CN'].air_port_name}}
          {{flightData.data[0][interType?'depTerminal':'departure_terminal'] || ''}}
          </view>
        </view>
        <view class="center_message">
          <view class="duration" v-if="interType">
            {{ Math.floor(flightData.data[0].duration / 60) }}h{{
            Math.floor(flightData.data[0].duration % 60)
            }}m
          </view>
          <view v-else class="duration">
            {{ Math.floor($timeDiff(flightData.data[0].arrive_time,flightData.data[0].departure_time, 'minutes') / 60) }}h{{
            Math.floor($timeDiff(flightData.data[0].arrive_time,flightData.data[0].departure_time, 'minutes') % 60)
            }}m
          </view>
          <view class="arrow_icon"></view>
        </view>
        <view class="right_message address_message">
          <view class="time">{{$dateTool(flightData.data[0][interType?'arrTime':'arrive_time'],'HH:mm')}}</view>
          <view
            class="address"
          >{{flightData.data[0][interType?'arrAirport_CN':'arrive_CN'].province + flightData.data[0][interType?'arrAirport_CN':'arrive_CN'].air_port_name}}
          {{flightData.data[0][interType?'arrTerminal':'arrive_terminal'] || ''}}
          </view>
          
        </view>
      </view>

      <!-- 单程 中转 -->
      <view :class="['content_message transit',{fold: !filghtFold}]" v-else>
        <view class="flight_message" v-for="(item, index) in flightData.data" :key="index">
          <view class="fly_message">
            <view class="fly_left">
              <view class="fly_time">{{$dateTool(item[interType?'depTime':'departure_time'],'HH:mm')}}</view>
              <view class="fly_date">
                <image class="fly_date_icon" src="@/static/filter_time.png" mode="aspectFill" />
                {{Math.floor($timeDiff(item[interType?'arrTime':'arrive_time'],item[interType?'depTime':'departure_time'], 'minutes') / 60)}}h{{Math.floor($timeDiff(item[interType?'arrTime':'arrive_time'],item[interType?'depTime':'departure_time'], 'minutes') % 60)}}m
              </view>
              <view class="fly_time">{{$dateTool(item[interType?'arrTime':'arrive_time'],'HH:mm')}}</view>
            </view>
            <view class="fly_line"></view>
            <view class="fly_right">
              <view class="fly_air">
                {{item[interType?'depAirport_CN':'departure_CN'].air_port + ' ' +
                item[interType?'depAirport_CN':'departure_CN'].city_name +
                item[interType?'depAirport_CN':'departure_CN'].air_port_name + 
                (item[interType?'depTerminal':'departure_terminal']?' / '+ item[interType?'depTerminal':'departure_terminal']: '')}}
                
              </view>

              <view class="fly_info">
                <image
                  class="air_image"
                  v-if="item.image"
                  :src="'https://fxxcx.ystrip.cn' + item.image"
                  mode="aspectFill"
                />
                {{item.airline_CN + item[interType?'flightNumber':'flight_no'] + ' | ' + item[interType?'aircraftCode':'model']}}
              </view>

              <view class="fly_air bottom_fly_ait">
                {{item[interType?'arrAirport_CN':'arrive_CN'].air_port + ' ' +
                item[interType?'arrAirport_CN':'arrive_CN'].city_name +
                item[interType?'arrAirport_CN':'arrive_CN'].air_port_name + 
                (item[interType?'arrTerminal':'arrive_terminal']?' / '+ item[interType?'arrTerminal':'arrive_terminal']: '')}}
                
              </view>
            </view>
          </view>
          <view class="transit_message" v-if="index === 0">  
            转
            {{flightData.data[0][interType?'arrAirport_CN':'arrive_CN'].city_name +
            ' 停留 '}}
            {{Math.floor($timeDiff(flightData.data[flightData.data.length - 1][interType?'depTime':'departure_time'],flightData.data[0][interType?'arrTime':'arrive_time'], 'minutes') / 60)}}h{{Math.floor($timeDiff(flightData.data[flightData.data.length - 1][interType?'depTime':'departure_time'],flightData.data[0][interType?'arrTime':'arrive_time'], 'minutes') % 60)}}m
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
        {{flightData.data[0].airline_CN + flightData.data[0][interType?'flightNumber':'flight_no']}}{{flightData.data[0][interType?'aircraftCode':'model']?' | '+ flightData.data[0][interType?'aircraftCode':'model']: ''}} {{flightData.data[0].MealCode? ' | 有餐食': ''}}
      </view>

      <view
        class="flight_reservation_box"
        v-if="!flightInfo && !roundTripType"
        @click="openHeadExp">
            {{flightData.cabinInfo[interType?'cabinDesc':'cabin']? flightData.cabinInfo[interType?'cabinCode':'cabin'] + 
            flightData.cabinInfo[interType?'cabinDesc':'cabin']+' | ': ''}}退改签规则 {{flightData.cabinInfo.baggage?' | '+ flightData.cabinInfo.baggage: ''}}
        <view class="message_more_btn"></view>
      </view>
    </view>
    <view class="fight_list found_fight_list" v-if="roundTripType">
      <view class="header_message">
        <view class="header_type round_trip_type">{{roundTripFlightData.flightType}}</view>
        <view
          class="header_time"
        >{{$dateTool(roundTripFlightData.data[0].depTime,'YYYY-MM-DD')}} {{$dateTool(roundTripFlightData.data[0].depTime,'dddd')}}</view>
      </view>
      <view class="content_message" v-if="roundTripFlightData.data.length <= 1">
        <view class="left_message address_message">
          <view class="time">{{$dateTool(roundTripFlightData.data[0].depTime,'HH:mm')}}</view>
          <view
            class="address"
          >{{roundTripFlightData.data[0].depAirport_CN.province + roundTripFlightData.data[0].depAirport_CN.air_port_name}}
          {{roundTripFlightData.data[0][interType?'depTerminal':'departure_terminal']}}
          </view>
        </view>
        <view class="center_message">
          <view class="duration">
            {{ Math.floor(roundTripFlightData.data[0].duration / 60) }}h{{
            Math.floor(roundTripFlightData.data[0].duration % 60)
            }}m
          </view>
          <view class="arrow_icon"></view>
        </view>
        <view class="right_message address_message">
          <view class="time">{{$dateTool(roundTripFlightData.data[0].arrTime,'HH:mm')}}</view>
          <view
            class="address"
          >{{roundTripFlightData.data[0].arrAirport_CN.province + roundTripFlightData.data[0].arrAirport_CN.air_port_name}}
          {{roundTripFlightData.data[0][interType?'arrTerminal':'arrive_terminal']}}
          </view>
        </view>
      </view>

      <!-- 往返 中转 -->
      <view :class="['content_message transit',{fold: !filghtFold}]" v-else>
        <view class="flight_message" v-for="(item, index) in roundTripFlightData.data" :key="index">
          <view :class="['fly_message',{fold: !filghtFold}]">
            <view class="fly_left">
              <view class="fly_time">{{$dateTool(item.depTime,'HH:mm')}}</view>
              <view class="fly_date">
                <image class="fly_date_icon" src="@/static/filter_time.png" mode="aspectFill" />
                {{Math.floor($timeDiff(item.arrTime,item.depTime, 'minutes') / 60)}}h{{Math.floor($timeDiff(item.arrTime,item.depTime, 'minutes') % 60)}}m
              </view>
              <view class="fly_time">{{$dateTool(item.arrTime,'HH:mm')}}</view>
            </view>
            <view class="fly_line"></view>
            <view class="fly_right">
               <view class="fly_air">
                {{item[interType?'depAirport_CN':'departure_CN'].air_port + ' ' +
                item[interType?'depAirport_CN':'departure_CN'].city_name +
                item[interType?'depAirport_CN':'departure_CN'].air_port_name + 
                (item[interType?'depTerminal':'departure_terminal']?' / '+ item[interType?'depTerminal':'departure_terminal']: '')}}
                
              </view>

              <view class="fly_info">
                <image
                  class="air_image"
                  v-if="item.image"
                  :src="'https://fxxcx.ystrip.cn' + item.image"
                  mode="aspectFill"
                />
                {{item.airline_CN + item[interType?'flightNumber':'flight_no'] + ' | ' + item[interType?'aircraftCode':'model']}}
              </view>

              <view class="fly_air bottom_fly_ait">
                {{item[interType?'arrAirport_CN':'arrive_CN'].air_port + ' ' +
                item[interType?'arrAirport_CN':'arrive_CN'].city_name +
                item[interType?'arrAirport_CN':'arrive_CN'].air_port_name + 
                (item[interType?'arrTerminal':'arrive_terminal']?' / '+ item[interType?'arrTerminal':'arrive_terminal']: '')}}
                
              </view>
            </view>
          </view>
          <view class="transit_message" v-if="index === 0">  
            转
            {{roundTripFlightData.data[flightData.data.length - 1][interType?'arrAirport_CN':'arrive_CN'].city_name +
            ' 停留 '}}
            {{Math.floor($timeDiff(roundTripFlightData.data[roundTripFlightData.data.length - 1][interType?'depTime':'departure_time'],roundTripFlightData.data[0][interType?'arrTime':'arrive_time'], 'minutes') / 60)}}h{{Math.floor($timeDiff(roundTripFlightData.data[roundTripFlightData.data.length - 1][interType?'depTime':'departure_time'],roundTripFlightData.data[0][interType?'arrTime':'arrive_time'], 'minutes') % 60)}}m
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

        {{roundTripFlightData.data[0].airline_CN + roundTripFlightData.data[0][interType?'flightNumber':'flight_no']}}{{roundTripFlightData.data[0][interType?'aircraftCode':'model']?' | '+ roundTripFlightData.data[0][interType?'aircraftCode':'model']: ''}} {{roundTripFlightData.data[0].MealCode? ' | 有餐食': ''}}
      </view>
      <view class="flight_reservation_box" v-if="!flightInfo" @click="openHeadExp()">
        {{flightData.cabinInfo[interType?'cabinDesc':'cabin']? flightData.cabinInfo[interType?'cabinCode':'cabin'] + 
        flightData.cabinInfo[interType?'cabinDesc':'cabin_level']+' | ': ''}}退改签规则 {{flightData.cabinInfo.baggage?' | '+ flightData.cabinInfo.baggage: ''}}
        <view class="message_more_btn"></view>
      </view>
      <view class="flight_reservation_box" v-if="!flightInfo" @click="openHeadExp('arr')">
        {{roundTripFlightData.cabinInfo.cabinDesc? roundTripFlightData.cabinInfo.cabinCode + roundTripFlightData.cabinInfo.cabinDesc+' | ': ''}}退改签规则 {{roundTripFlightData.cabinInfo.baggage?' | '+ roundTripFlightData.cabinInfo.baggage: ''}}
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
      :class="['filght_fold',{'unfold': filghtFold}]"
      v-if="flightData.data.length > 1 || roundTripFlightData.data.length > 1"
    >{{filghtFold?'收起详情':'展开详情'}}</view>
  </view>
</template>

<script>
export default {
  props: {
    flightInfo: {
      // 航班信息状态 true 航班信息、 false 预定页面
      type: Boolean,
      default: () => true,
    },
    interType: {
      // type false 国内订单详情
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
    flightTitle: {  //区别国内  退票   改签
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      filghtFold: false, // 往返中转航班折叠状态
    };
  },
  mounted(){
    this.$forceUpdate()
    console.log('航班信息头部',this.flightData,this.roundTripFlightData)
  },
  onLoad(){
    this.console.log(this.flightTitle)
  },
  methods: {
    openHeadExp(val) {
      // 打开航班详情弹窗
      console.log("打开弹窗");
      this.$emit("openHeadExpPopup",val);
    },

    flodBtn() {
      // 往返中转折叠航班详情
      this.filghtFold = !this.filghtFold;
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
    color:#666;
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
}
</style>
