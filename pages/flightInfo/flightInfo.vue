<!--
 * @Description: 机票信息
 * @Author: wish.WuJunLong
 * @Date: 2020-06-23 10:58:46
 * @LastEditTime: 2020-08-24 13:39:17
 * @LastEditors: wish.WuJunLong
--> 
<template>
  <scroll-view :enable-back-to-top="true" class="flight_info">
    <yun-header
      :statusHeight="iStatusBarHeight"
      :headerAddress="ticketAddress"
      :headerBottom="Number(10)"
    ></yun-header>
    <flight-header :flightData="flightData"></flight-header>

    <view class="flight_cabin">
      <view :class="['cabin_header',{'isDisplay':cabinHeader.length > 1}]">
        <view
          :class="['cabin_header_box',{'is_active': current === index}]"
          @click="checkedHeader(index)"
          v-for="(item, index) in cabinHeader"
          :key="index"
        >
          {{item}}
          <view class="cabin_header_line"></view>
        </view>
      </view>

      <swiper class="cabin_content" @change="change" :current="current">
        <swiper-item v-for="(header, headerIndex) in cabinHeader" :key="headerIndex">
          <view class="cabin_content_item">
            <flight-item
              v-for="(item, index) in cabinList[header]"
              :key="index"
              :flightData="item"
              @openExpDialog="openExp"
              @jumpReservation="jumpReservationBtn"
            ></flight-item>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <uni-popup ref="flightExplanation" type="bottom">
      <view class="flight_explanation">
        <view class="title">
          <view class="close_btn" @click="closePopup"></view>
          <view class="explanation_header">
            <view
              @click="checkedExplanationBtn(0)"
              :class="['header_btn',{'is_active': popupCurrent === 0}]"
            >产品说明</view>
            <view
              @click="checkedExplanationBtn(1)"
              :class="['header_btn',{'is_active': popupCurrent === 1}]"
            >退改签</view>
            <view
              @click="checkedExplanationBtn(2)"
              :class="['header_btn',{'is_active': popupCurrent === 2}]"
            >行李额</view>
          </view>
        </view>
        <view class="flight_explanation_main">
          <swiper class="explanation_content" @change="popupChange" :current="popupCurrent">
            <swiper-item>
              <view class="popup_content_item">{{ruleInfos.back_msg}}</view>
            </swiper-item>
            <swiper-item>
              <view class="popup_content_item">经济舱</view>
            </swiper-item>
            <swiper-item>
              <view class="popup_content_item">公务头等舱</view>
            </swiper-item>
          </swiper>
        </view>
      </view>
    </uni-popup>

    <!-- 验价弹窗 -->
    <uni-popup ref="checkPricePopup" type="dialog">
      <view class="check_Price">
        <view class="box_title">预定价格变更</view>
        <view class="content_text">您的当前预定票价已变动至&yen;{{newPrice}}需要继续购买吗？</view>
        <view class="box_bottom">
          <view class="submit" @click="submitCheckPrice">确 定</view>
          <view @click="closeCheckPrice">取 消</view>
        </view>
      </view>
    </uni-popup>
  </scroll-view>
</template>

<script>
import moment from "moment";
moment.locale("zh-cn");
import flightHeader from "@/components/flight_header.vue";
import flightItem from "@/components/flight_item.vue";
import ticket from "@/api/ticketInquiry.js";
export default {
  components: {
    flightHeader,
    flightItem,
  },
  data() {
    return {
      iStatusBarHeight: 0, // 导航栏高度
      airMessage: {}, // 原始数据
      ticketAddress: {
        // 导航栏地址
        to: "重庆",
        from: "北京",
      },
      flightData: {
        // 航班头部信息
        flightType: "", // 航程类型
        time: "", // 航程日期
        fromTime: "", // 出发时间
        fromAddress: "", // 出发机场
        duration: "", // 飞行时长
        toTime: "", // 到达时间
        toAddress: "", // 到达机场
        airline: "", // 航司
        model: "", // 机型
        food: "", // 餐饮
      },
      cabinHeader: [], // 舱位选择列表
      current: 0, // 轮播图下标
      cabinList: {},

      popupCurrent: 0, // 弹窗轮播下标

      ruleInfos: {}, // 退改签信息

      newPrice: '', // 验价新价格
    };
  },
  methods: {
    // 舱位等级选择
    checkedHeader(index) {
      this.current = index;
    },
    // 轮播切换
    change(e) {
      this.current = e.detail.current;
    },
    // 关闭产品说明弹窗
    closePopup() {
      this.$refs.flightExplanation.close();
    },

    // 打开退改签说明弹窗
    openExp(type, data) {
      console.log(data);
      this.ruleInfos = data;
      this.$refs.flightExplanation.open();
    },
    // 弹窗轮播标题切换
    checkedExplanationBtn(index) {
      this.popupCurrent = index;
    },
    // 弹窗轮播切换
    popupChange(e) {
      this.popupCurrent = e.detail.current;
    },

    // 跳转预定页面 - 先验价再跳转
    jumpReservationBtn(type, data) {
      this.airMessage["data"] = data;
      console.log(this.airMessage);
      let params = {
        sourceCode: "IBE",
        queryDate: this.airMessage.flightData.time,
        departure: this.airMessage.ticketAddress.departure,
        destination: this.airMessage.ticketAddress.arrival,
        systemMsg: "",
        segments: this.airMessage.airSegments,
        ItineraryInfo: this.airMessage.data.data,
        relatedKey: "11",
      };
      ticket.checkPrice(params).then((res) => {
        if (res.errorcode === 10000) {
          if (res.data.check_price_status) {
            uni.navigateTo({
              url:
                "/pages/flightReservation/flightReservation?key=" +
                res.data.keys + '&price='+res.data.price,
            });
          } else {
            this.newPrice = res.data.price;
            this.relatedKey = res.data.keys;
            this.$refs.checkPricePopup.open();
          }
        } else {
          uni.showToast({
            title: "验价失败，请稍后重试，" + res.msg,
            icon: "none",
          });
        }
      });
    },

    // 关闭验价弹窗
    closeCheckPrice() {
      this.$refs.checkPricePopup.close();
    },
    // 确认验价信息跳转预定页面
    submitCheckPrice() {
      this.closeCheckPrice();
      uni.navigateTo({
        url:
          "/pages/flightReservation/flightReservation?key=" + this.relatedKey  + '&price='+ this.newPrice,
      });
    },
  },
  onLoad(data) {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;

    // 组装航程头部信息
    let airData = JSON.parse(data.airData);
    console.log(airData);
    this.ticketAddress = {
      to: airData.to,
      from: airData.from,
      departure: airData.departure, // 起飞机场三字码
      arrival: airData.arrival, // 到达机场三字码
    };
    this.flightData = {
      flightType: "单程", // 航程类型
      time: moment(airData.QueryDate).format("YYYY-MM-DD"), // 航程日期
      week: moment(airData.QueryDate).format("ddd"),
      fromTime: moment(airData.segments[0].depTime).format("HH:mm"), // 出发时间
      fromAddress:
        airData.to +
        airData.segments[0].depAirportName +
        "机场" +
        airData.segments[0].depTerminal, // 出发机场
      duration: airData.segments[0].duration, // 飞行时长
      toTime: moment(airData.segments[0].arrTime).format("HH:mm"), // 到达时间
      toAddress:
        airData.from +
        airData.segments[0].arrAirportName +
        "机场" +
        airData.segments[0].arrTerminal, // 到达机场
      airIcon:  airData.segments[0][airData.segments[0].flightNumber.slice(0, 2)].image,
      airline:
        airData.segments[0][airData.segments[0].flightNumber.slice(0, 2)]
          .air_name + airData.segments[0].flightNumber, // 航司
      model: airData.segments[0].aircraftCode, // 机型
      food: airData.segments[0].hasMeal, // 餐饮
    };

    // 组装原始数据
    this.airMessage = {
      ticketAddress: this.ticketAddress,
      airSegments: airData.segments,
      flightData: this.flightData,
    };

    // 组装航班列表信息
    // this.cabinHeader
    let airDataName = Object.keys(airData.ItineraryInfos);

    // 组装经济舱/公务舱数据
    airDataName.forEach((item) => {
      if (item !== "NFD") {
        this.cabinHeader.push(item);
        this.cabinList[item] = [];
        this.cabinList[item].ruleInfos = {};
        let dataArr = airData.ItineraryInfos[item];
        dataArr.forEach((oitem) => {
          this.cabinList[item].push({
            type: item,
            // 舱位列表
            price:
              oitem.cabinPrices.ADT.price +
              oitem.cabinPrices.ADT.build +
              oitem.cabinPrices.ADT.tax, // 价格
            priceMessage: true, // 是否包含燃油
            reward: oitem.cabinPrices.ADT.rulePrice.reward, // 奖励金
            voteNumber: oitem.cabinInfo.cabinNum, // 剩余票数
            cabin: oitem.cabinInfo.cabinCode + oitem.cabinInfo.cabinDesc, // 舱位
            baggage: oitem.cabinInfo.baggage, // 行李额
            ruleInfos: oitem.ruleInfos, // 退改信息
            data: oitem,
          });
        });
      }
    });
  },
};
</script>

<style scoped lang="less">
.flight_info {
  background: rgba(243, 245, 247, 1);
  display: flex;
  flex-direction: column;
  height: 100vh;

  .flight_cabin {
    flex: 1;
    display: flex;
    flex-direction: column;

    .cabin_header {
      display: flex;
      align-items: center;
      background: rgba(223, 238, 254, 1);
      border-radius: 20upx 20upx 0 0;
      padding: 0 60upx;
      margin: 0 20upx;
      &.isDisplay {
        justify-content: space-between;
        .cabin_header_box {
          margin-right: 0;
        }
      }

      .cabin_header_box {
        font-size: 30upx;
        font-weight: 400;
        color: rgba(123, 155, 193, 1);
        height: 90upx;
        line-height: 90upx;
        position: relative;
        &:not(:last-child) {
          margin-right: 160upx;
        }

        &.is_active {
          font-weight: bold;
          color: rgba(51, 51, 51, 1);

          .cabin_header_line {
            position: absolute;
            bottom: 0;
            left: 0;
            display: flex;
            align-items: center;
            opacity: 1;
            width: 100%;

            &::before {
              content: "";
              width: 12upx;
              height: 6upx;
              background: rgba(30, 139, 249, 1);
              border-radius: 6upx;
              margin-right: 4upx;
            }

            &::after {
              content: "";
              flex: 1;
              height: 6upx;
              background: rgba(30, 139, 249, 1);
              border-radius: 6upx;
            }
          }
        }

        .cabin_header_line {
          opacity: 0;
          transition: opacity 0.3s;
        }
      }
    }

    .cabin_content {
      flex: 1;
      height: calc(100vh - 505upx);

      .cabin_content_item {
        overflow-y: auto;
        height: 100%;
        padding: 0 20upx;
        flex: 1;
      }
    }
  }

  .flight_explanation {
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
      height: 140upx;
      background: rgba(255, 255, 255, 1);
      border-radius: 80upx 80upx 0 0;
      position: relative;
      border-bottom: 2upx solid rgba(217, 225, 234, 1);
      display: flex;
      align-items: flex-end;
      .explanation_header {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 0 120upx 0 90upx;

        .header_btn {
          font-size: 30upx;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          &::after {
            content: "";
            width: 60upx;
            height: 8upx;
            background: rgba(0, 112, 226, 1);
            opacity: 0;
            border-radius: 4upx;
            margin-top: 32upx;
            transition: opacity 0.3s;
          }
          &.is_active {
            &::after {
              opacity: 1;
            }
            color: rgba(0, 112, 226, 1);
          }
        }
      }

      .close_btn {
        position: absolute;
        background: url(@/static/popup_close.png) no-repeat;
        background-size: contain;
        width: 30upx;
        height: 30upx;
        top: 54upx;
        right: 44upx;
      }
    }
    .flight_explanation_main {
      background: rgba(255, 255, 255, 1);
      padding: 20upx 20upx 60upx;
    }
  }

  .check_Price {
    width: 540upx;
    height: 330upx;
    background: rgba(255, 255, 255, 1);
    border-radius: 20upx;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding-top: 36upx;
    .box_title {
      font-size: 36upx;
      font-weight: bold;
      color: rgba(42, 42, 42, 1);
      text-align: center;
      margin-bottom: 32upx;
    }
    .content_text {
      font-size: 26upx;
      font-weight: 400;
      color: rgba(42, 42, 42, 1);
      padding: 0 30upx;
      letter-spacing: 4upx;
      line-height: 45upx;
    }
    .box_bottom {
      margin-top: auto;
      display: flex;
      align-items: center;
      height: 90upx;
      view {
        flex: 1;
        background: rgba(0, 112, 226, 0.1);
        font-size: 28upx;
        font-weight: 400;
        color: rgba(0, 112, 226, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        &.submit {
          background: rgba(0, 112, 226, 1);
          color: rgba(255, 255, 255, 1);
        }
      }
    }
  }
}
</style>
