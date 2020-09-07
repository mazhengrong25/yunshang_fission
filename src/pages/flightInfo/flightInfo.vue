<!--
 * @Description: 机票信息
 * @Author: wish.WuJunLong
 * @Date: 2020-06-23 10:58:46
 * @LastEditTime: 2020-09-07 14:53:02
 * @LastEditors: wish.WuJunLong
--> 
<template>
  <scroll-view :enable-back-to-top="true" class="flight_info">
    <yun-header
      :statusHeight="iStatusBarHeight"
      :headerAddress="ticketAddress"
      :headerBottom="Number(10)"
      :statusType="roundTripType"
    ></yun-header>
    <view class="main_content">
      <flight-header
        :flightData="flightData"
        :roundTripFlightData="roundTripFlightData"
        :roundTripType="roundTripType"
      ></flight-header>

      <view class="round_trip_message" v-if="roundTripType && roundTripCheckList.length > 0">
        <view class="flight_list">
          <view class="list_item" v-for="(item, index) in roundTripCheckList" :key="index">
            <view class="item_main" v-if="item.type">
              <view :class="['item_type',{'start': index === 0}]">{{index === 0?'已选去程':'已选返程'}}</view>
              <view class="item_info">
                <text class="info_title">舱位</text>
                <text class="info_text">{{item.type}}</text>
              </view>
              <view class="item_info">
                <text class="info_title">票面价</text>
                <text class="info_text">&yen;{{index === 0?checkPrice:checkRoundPrice}}</text>
              </view>
            </view>
          </view>
        </view>
        <button
          class="roundTrip_pay_order_btn"
          v-if="roundTripCheckList.length === 2"
          @click="roundTripCheckedBtn()"
        >预定</button>
      </view>

      <view class="round_trip_checked" v-if="roundTripType">
        <button
          :class="['checked_btn',{active: roundTripBtnActive === 0}]"
          @click="roundTripBtn(0)"
        >选择去程</button>
        <button
          :class="['checked_btn',{active: roundTripBtnActive === 1}]"
          @click="roundTripBtn(1)"
        >选择返程</button>
      </view>
      <view class="flight_cabin" v-if="roundTripBtnActive === 0">
        <view :class="['cabin_header',{'is_display': headerDiaplay}]">
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
                :flightType="roundTripBtnActive"
                :roundTripType="roundTripType"
                @openExpDialog="openExp"
                @jumpReservation="jumpReservationBtn"
              ></flight-item>
            </view>
          </swiper-item>
        </swiper>
      </view>

      <view class="flight_cabin" v-else>
        <view :class="['cabin_header',{'is_display': depHeaderDiaplay}]">
          <view
            :class="['cabin_header_box',{'is_active': current === index}]"
            @click="checkedHeader(index)"
            v-for="(item, index) in depCabinHeader"
            :key="index"
          >
            {{item}}
            <view class="cabin_header_line"></view>
          </view>
        </view>

        <swiper class="cabin_content" @change="change" :current="current">
          <swiper-item v-for="(header, headerIndex) in depCabinHeader" :key="headerIndex">
            <view class="cabin_content_item">
              <flight-item
                v-for="(item, index) in depCabinList[header]"
                :key="index"
                :flightType="roundTripBtnActive"
                :roundTripType="roundTripType"
                :flightData="item"
                @openExpDialog="openExp"
                @jumpReservation="jumpReservationBtn"
              ></flight-item>
            </view>
          </swiper-item>
        </swiper>
      </view>
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
      depMessage: {}, // 返程原始数据
      roundTripType: false, // 是否往返

      ticketAddress: {
        // 导航栏地址
        to: "重庆",
        from: "北京",
      },
      fileKey: "", // av 查询key
      roundTripFileKey: "", // 返程av查询key

      roundTripCheckList: [], // 选中往返列表

      airActiveInfo: {}, // 去程预定
      depActiveInfo: {}, // 返程预定

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

      roundTripFlightData: {
        // 返程数据
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
      roundTripBtnActive: 0, // 舱位选择默认值

      cabinHeader: [], // 舱位选择列表
      current: 0, // 轮播图下标
      cabinList: {},
      headerDiaplay: false, // 舱位头部样式状态
      depHeaderDiaplay: false, // 返程舱位状态

      depCabinHeader: [], // 返程切换头部
      depCabinList: {}, // 返程数据

      popupCurrent: 0, // 弹窗轮播下标

      ruleInfos: {}, // 退改签信息

      newPrice: "", // 验价新价格

      checkPrice: null, // 去程验价价格
      checkPriceKey: "", // 去程验价key

      checkRoundPrice: null, // 返程验价价格
      checkRoundPriceKey: "", // 返程验价key
    };
  },
  methods: {
    // 往返 - 往返舱位选择
    roundTripBtn(type) {
      this.roundTripBtnActive = type;
    },

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

    // 处理往返选中列表
    getRoundTrip() {
      if (this.roundTripType && this.roundTripBtnActive === 0) {
        // this.cabinHeader.forEach(item =>{
        //   this.cabinList[item].forEach((oitem,oindex) =>{
        //     this.$set(this.cabinList[item][oindex],"active",false);
        //   })
        // })
        this.cabinList[this.airActiveInfo.type].forEach((item, index) => {
          if (
            item.cabin === this.airActiveInfo.cabin &&
            item.data.cabinPrices.ADT.price === this.airActiveInfo.price
          ) {
            // this.$set(this.cabinList[this.airActiveInfo.type][index],"active",true);
            this.roundTripCheckList[this.roundTripBtnActive] = item;
          }
        });
      } else if (this.roundTripType && this.roundTripBtnActive === 1) {
        // this.depCabinHeader.forEach(item =>{
        //   this.depCabinList[item].forEach((oitem,oindex) =>{
        //     this.$set(this.depCabinList[item][oindex],"active",false);
        //   })
        // })
        this.depCabinList[this.depActiveInfo.type].forEach((item, index) => {
          if (
            item.cabin === this.depActiveInfo.cabin &&
            item.data.cabinPrices.ADT.price === this.depActiveInfo.price
          ) {
            // this.$set(this.depCabinList[this.depActiveInfo.type][index],"active",true);
            this.roundTripCheckList[this.roundTripBtnActive] = item;
          }
        });
      }

      console.log("往返选中列表", this.roundTripCheckList);
      this.$forceUpdate();
    },

    // 跳转预定页面 - 先验价再跳转
    jumpReservationBtn(type, data) {
      console.log(type, data);
      let params;
      if (this.roundTripBtnActive === 0) {
        // 去程验价数据组装
        this.airActiveInfo = {
          cabin: data.cabin,
          price: data.data.cabinPrices.ADT.price,
          type: data.type,
        };
        this.airMessage["data"] = data;
        params = {
          sourceCode: "IBE",
          file_key: this.fileKey,
          queryDate: this.airMessage.flightData.time,
          departure: this.airMessage.ticketAddress.departure,
          destination: this.airMessage.ticketAddress.arrival,
          systemMsg: "",
          segments: this.airMessage.airSegments,
          ItineraryInfo: this.airMessage.data.data,
          relatedKey: "11",
        };
      } else {
        // 返程验价数据组装
        this.depActiveInfo = {
          cabin: data.cabin,
          price: data.data.cabinPrices.ADT.price,
          type: data.type,
        };
        this.depMessage["data"] = data;
        params = {
          sourceCode: "IBE",
          file_key: this.roundTripFileKey,
          queryDate: this.depMessage.flightData.time,
          departure: this.depMessage.ticketAddress.departure,
          destination: this.depMessage.ticketAddress.arrival,
          systemMsg: "",
          segments: this.depMessage.airSegments,
          ItineraryInfo: this.depMessage.data.data,
          relatedKey: "11",
        };
      }

      ticket.checkPrice(params).then((res) => {
        if (res.errorcode === 10000) {
          if (res.data.check_price_status) {
            // 价格没有修改 直接进行操作
            if (!this.roundTripType) {
              this.checkPrice = res.data.price; // 获取验价价格
              this.checkPriceKey = res.data.keys; // 获取验价key
              // 单程验价
              uni.navigateTo({
                url:
                  "/pages/flightReservation/flightReservation?key=" +
                  res.data.keys +
                  "&price=" +
                  res.data.price,
              });
            } else {
              // 往返验价
              if (this.roundTripBtnActive === 0) {
                this.checkPrice = res.data.price; // 获取验价价格
                this.checkPriceKey = res.data.keys; // 获取验价key
              } else {
                this.checkRoundPrice = res.data.price; // 获取验价价格
                this.checkRoundPriceKey = res.data.keys; // 获取验价key
              }
              console.log("往返验价");
              this.getRoundTrip();
            }
          } else {
            // 价格有修改 弹出提示框
            this.newPrice = res.data.price;
            this.relatedKey = res.data.keys;
            if (this.roundTripType) {
              if (this.roundTripBtnActive === 0) {
                this.checkPrice = res.data.price; // 获取验价价格
                this.checkPriceKey = res.data.keys; // 获取验价key
              } else {
                this.checkRoundPrice = res.data.price; // 获取验价价格
                this.checkRoundPriceKey = res.data.keys; // 获取验价key
              }
              console.log("往返验价");
            }

            this.$refs.checkPricePopup.open();
          }
        } else {
          uni.showToast({
            title: res.data,
            icon: "none",
            duration: 3000,
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
      if (!this.roundTripType) {
        // 单程验价
        this.closeCheckPrice();
        uni.navigateTo({
          url:
            "/pages/flightReservation/flightReservation?key=" +
            this.relatedKey +
            "&price=" +
            this.newPrice,
        });
      } else {
        // 往返验价
        console.log("往返验价");
        this.getRoundTrip();
        // this.airActiveInfo = {
        //   cabin: data.cabin,
        //   price: data.data.cabinPrices.ADT.price,
        //   type: data.type
        // }
        this.closeCheckPrice();
      }
    },

    // 往返预定跳转
    roundTripCheckedBtn() {
      uni.navigateTo({
        url:
          "/pages/flightReservation/flightReservation?type=" +
          this.roundTripType +
          "&key=" +
          this.checkPriceKey +
          "&price=" +
          this.checkPrice +
          "&roundKey=" +
          this.checkRoundPriceKey +
          "&roundPrice=" +
          this.checkRoundPrice,
      });
    },
  },
  onLoad(data) {
    console.log(data);
    this.roundTripType = JSON.parse(data.pageType);
    console.log(this.roundTripType);
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    // 组装单程航班数据
    if (!this.roundTripType) {
      // 获取fileKey
      this.fileKey = data.fileKey;

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
          airData.segments[0].depAirport_CN.air_port_name +
          "机场" +
          airData.segments[0].depTerminal, // 出发机场
        duration: airData.segments[0].duration, // 飞行时长
        toTime: moment(airData.segments[0].arrTime).format("HH:mm"), // 到达时间
        toAddress:
          airData.from +
          airData.segments[0].arrAirport_CN.air_port_name +
          "机场" +
          airData.segments[0].arrTerminal, // 到达机场
        airIcon: "https://fxxcx.ystrip.cn/" + airData.segments[0].image,
        airline:
          airData.segments[0].airline_CN + airData.segments[0].flightNumber, // 航司
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
      let airDataName = Object.keys(airData.ItineraryInfos);
      // 组装经济舱/公务舱数据
      airDataName.forEach((item, index) => {
        let headerNumber = index;
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
      this.headerDiaplay = this.cabinHeader.length !== 2
    } else {
      let airData = JSON.parse(data.roundTripData).start;
      let depData = JSON.parse(data.roundTripData).end;
      let ticketData = JSON.parse(data.roundTripData).ticketMessage;
      console.log(airData, depData, ticketData);

      this.fileKey = JSON.parse(data.roundTripKey).start;

      this.roundTripFileKey = JSON.parse(data.roundTripKey).end;

      this.ticketAddress = {
        to: ticketData.to,
        from: ticketData.from,
        departure: ticketData.departure, // 起飞机场三字码
        arrival: ticketData.arrival, // 到达机场三字码
      };

      // 组装去程信息
      this.flightData = {
        flightType: "去程", // 航程类型
        time: ticketData.departureTime, // 航程日期
        week: moment(ticketData.departureTime).format("ddd"),
        fromTime: moment(airData.segments[0].depTime).format("HH:mm"), // 出发时间
        fromAddress:
          ticketData.to +
          airData.segments[0].depAirport_CN.air_port_name +
          "机场" +
          airData.segments[0].depTerminal, // 出发机场
        duration: airData.segments[0].duration, // 飞行时长
        toTime: moment(airData.segments[0].arrTime).format("HH:mm"), // 到达时间
        toAddress:
          ticketData.from +
          airData.segments[0].arrAirport_CN.air_port_name +
          "机场" +
          airData.segments[0].arrTerminal, // 到达机场
        airIcon: "https://fxxcx.ystrip.cn/" + airData.segments[0].image,
        airline:
          airData.segments[0].airline_CN + airData.segments[0].flightNumber, // 航司
        model: airData.segments[0].aircraftCode, // 机型
        food: airData.segments[0].MealCode, // 餐饮
      };

      // 组装返程信息
      this.roundTripFlightData = {
        flightType: "返程", // 航程类型
        time: ticketData.arrTime, // 航程日期
        week: moment(ticketData.arrTime).format("ddd"),
        fromTime: moment(depData.segments[0].depTime).format("HH:mm"), // 出发时间
        fromAddress:
          ticketData.from +
          depData.segments[0].depAirport_CN.air_port_name +
          "机场" +
          depData.segments[0].depTerminal, // 出发机场
        duration: depData.segments[0].duration, // 飞行时长
        toTime: moment(depData.segments[0].arrTime).format("HH:mm"), // 到达时间
        toAddress:
          ticketData.to +
          depData.segments[0].arrAirport_CN.air_port_name +
          "机场" +
          depData.segments[0].arrTerminal, // 到达机场
        airIcon: "https://fxxcx.ystrip.cn/" + depData.segments[0].image,
        airline:
          depData.segments[0].airline_CN + depData.segments[0].flightNumber, // 航司
        model: depData.segments[0].aircraftCode, // 机型
        food: depData.segments[0].MealCode, // 餐饮
      };

      // 组装去程原始数据
      this.airMessage = {
        ticketAddress: this.ticketAddress,
        airSegments: airData.segments,
        flightData: this.flightData,
      };

      // 组装返程原始数据
      this.depMessage = {
        ticketAddress: {
          to: ticketData.from,
          from: ticketData.to,
          departure: ticketData.arrival, // 起飞机场三字码
          arrival: ticketData.departure,
        },
        airSegments: depData.segments,
        flightData: this.roundTripFlightData,
      };

      // 组装去程航班列表信息
      let airDataName = Object.keys(airData.ItineraryInfos);
      // 组装去程经济舱/公务舱数据
      airDataName.forEach((item, index) => {
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

      this.headerDiaplay = this.cabinHeader.length !== 2

      // 组装返程航班列表信息
      let depDataName = Object.keys(depData.ItineraryInfos);
      // 组装去程经济舱/公务舱数据
      depDataName.forEach((item, index) => {
        if (item !== "NFD") {
          this.depCabinHeader.push(item);
          this.depCabinList[item] = [];
          this.depCabinList[item].ruleInfos = {};
          let depDataArr = depData.ItineraryInfos[item];
          depDataArr.forEach((oitem) => {
            this.depCabinList[item].push({
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

      this.depHeaderDiaplay = this.depCabinHeader.length !== 2
    }
  },
};
</script>

<style scoped lang="less">
.flight_info {
  background: rgba(243, 245, 247, 1);
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
  .main_content {
    overflow-y: auto;
    height: calc(100vh - 88upx - var(--status-bar-height));

    .round_trip_message {
      display: flex;
      align-items: center;
      padding: 0 20upx;
      margin-bottom: 35upx;
      .flight_list {
        .list_item {
          &:not(:last-child) {
            margin-bottom: 20upx;
          }
          .item_main {
            display: flex;
            align-items: center;
          }
          .item_type {
            width: 108upx;
            height: 44upx;
            background: #c2efc1;
            border-radius: 10upx;
            margin-right: 16upx;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 22upx;
            font-weight: 400;
            color: #5ab957;
            &.start {
              color: #0070e2;
              background: #bfdfff;
            }
          }
          .item_info {
            display: inline-flex;
            &:not(:last-child) {
              margin-right: 30upx;
            }
            .info_title {
              font-size: 24upx;
              font-weight: 400;
              color: #afb9c4;
              margin-right: 8upx;
            }
            .info_text {
              font-size: 26upx;
              font-weight: 400;
              color: #333333;
            }
          }
        }
      }
      .roundTrip_pay_order_btn {
        padding: 0;
        margin: 0 0 0 auto;
        width: 160upx;
        height: 80upx;
        background: linear-gradient(90deg, #fb9826 0%, #ffca61 100%);
        box-shadow: 0 6upx 12upx rgba(255, 202, 97, 0.3);
        border-radius: 90upx;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 32upx;
        font-weight: 400;
        color: #ffffff;
        letter-spacing: 4upx;
      }
    }
  }

  .round_trip_checked {
    display: flex;
    align-items: center;
    margin: 10upx 20upx 30upx;
    .checked_btn {
      flex: 1;
      height: 80upx;
      border: 2upx solid #afb9c4;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 28upx;
      font-weight: bold;
      color: #666666;
      background-color: transparent;
      margin: 0;
      &.active {
        border-color: #0070e2;
        line-height: 22upx;
        color: #0070e2;
        &:first-child {
          border-right: 2upx solid #0070e2;
        }
        &:last-child {
          border-left: 2upx solid #0070e2;
        }
      }
      &:first-child {
        border-radius: 20upx 0 0 20upx;
        border-right: unset;
      }
      &:last-child {
        border-radius: 0 20upx 20upx 0;
        border-left: unset;
      }
    }
  }

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
      &.is_display {
        justify-content: space-between;
        .cabin_header_box {
          &:not(:last-child) {
            margin-right: 0 !important;
          }
        }
      }

      .cabin_header_box {
        font-size: 30upx;
        font-weight: 400;
        color: rgba(123, 155, 193, 1);
        height: 90upx;
        line-height: 90upx;
        position: relative;
        white-space: nowrap;
        text-overflow: ellipsis;
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
