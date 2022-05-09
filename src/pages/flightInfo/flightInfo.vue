<!--
 * @Description: 机票信息
 * @Author: wish.WuJunLong
 * @Date: 2020-06-23 10:58:46
 * @LastEditTime: 2022-05-09 15:20:39
 * @LastEditors: mzr
-->
<template>
    <scroll-view :enable-back-to-top="true" class="flight_info">
        <yun-header :statusHeight="iStatusBarHeight" :headerAddress="airMessage" :headerBottom="Number(10)" :statusType="roundTripType"></yun-header>
        <view class="main_content">
            <flight-header v-if="showData" :flightData="flightData" :roundTripFlightData="roundTripFlightData" :roundTripType="roundTripType" @openStopMessage="openStopMessage"></flight-header>

            <view v-else class="not_flight_data">
                <text></text>
                <text></text>
                <view></view>
            </view>

            <view class="round_trip_message" v-if="roundTripType && roundTripCheckList.length > 0">
                <view class="flight_list">
                    <view class="list_item" v-for="(item, index) in roundTripCheckList" :key="index">
                        <view class="item_main" v-if="item.type">
                            <view :class="['item_type', { start: index === 0 }]">{{
                index === 0 ? "已选去程" : "已选返程"
              }}</view>
                            <view class="item_info">
                                <text class="info_title">舱位</text>
                                <text class="info_text">{{ item.cabin }}</text>
                            </view>
                            <view class="item_info">
                                <text class="info_title">票面价</text>
                                <text class="info_text">&yen;{{
                    index === 0
                      ? checkMultiRate
                        ? checkMultiRate
                        : checkPrice
                      : roundCheckMultiRate
                      ? roundCheckMultiRate
                      : checkRoundPrice
                  }}</text>
                            </view>
                        </view>
                    </view>
                </view>
                <button class="roundTrip_pay_order_btn" v-if="roundTripCheckList.length === 2 && roundTripCheckList[0]" @click="roundTripCheckedBtn()">
                    预定
                </button>
            </view>

            <view class="round_trip_checked" v-if="roundTripType">
                <button :class="['checked_btn', { active: roundTripBtnActive === 0 }]" @click="roundTripBtn(0)">
                    选择去程
                </button>
                <button :class="['checked_btn', { active: roundTripBtnActive === 1 }]" @click="roundTripBtn(1)">
                    选择返程
                </button>
            </view>
            <view class="flight_cabin" v-if="roundTripBtnActive === 0">
                <view :class="['cabin_header', { is_display: headerDiaplay }]">
                    <view :class="['cabin_header_box', { is_active: current === index }]" @click="checkedHeader(index)" v-for="(item, index) in cabinHeader" :key="index">
                        {{ item }}
                        <view class="cabin_header_line"></view>
                    </view>
                </view>

                <swiper class="cabin_content" @change="change" :current="current">
                    <swiper-item v-for="(header, headerIndex) in cabinHeader" :key="headerIndex">
                        <view class="cabin_content_item">
                            <flight-item v-for="(item, index) in cabinList[header]" :key="index" :flightData="item" :flightType="roundTripBtnActive" :roundTripType="roundTripType" :flightIndex="index" :flightHeader="header" @openExpDialog="openExpPupop" @jumpReservation="jumpReservationBtn" @getPriceData="getPriceData"></flight-item>
                            <view class="not_content_item" v-if="cabinList[header].length < 1">暂无舱位</view>
                        </view>
                    </swiper-item>
                </swiper>
            </view>

            <view class="flight_cabin" v-else>
                <view :class="['cabin_header', { is_display: depHeaderDiaplay }]">
                    <view :class="['cabin_header_box', { is_active: current === index }]" @click="checkedHeader(index)" v-for="(item, index) in depCabinHeader" :key="index">
                        {{ item }}
                        <view class="cabin_header_line"></view>
                    </view>
                </view>

                <swiper class="cabin_content" @change="change" :current="current">
                    <swiper-item v-for="(header, headerIndex) in depCabinHeader" :key="headerIndex">
                        <view class="cabin_content_item">
                            <flight-item v-for="(item, index) in depCabinList[header]" :key="index" :flightType="roundTripBtnActive" :roundTripType="roundTripType" :flightData="item" :flightIndex="index" :flightHeader="header" :type="true" @openExpDialog="openExpPupop" @jumpReservation="jumpReservationBtn" @getPriceData="getPriceData"></flight-item>
                            <view class="not_content_item" v-if="depCabinList[header].length < 1">暂无舱位</view>
                        </view>
                    </swiper-item>
                </swiper>
            </view>
        </view>

        <flight-explanation ref="flightExplanation" :ruleInfos="ruleInfos"></flight-explanation>

        <!-- 验价弹窗 -->
        <uni-popup ref="checkPricePopup" type="dialog">
            <view class="check_Price">
                <view class="box_title">预定价格变更</view>
                <view class="content_text">您的当前预定票价已变动至&yen;{{ newPrice }}需要继续购买吗？</view>
                <view class="box_bottom">
                    <view class="submit" @click="submitCheckPrice">确 定</view>
                    <view @click="closeCheckPrice">取 消</view>
                </view>
            </view>
        </uni-popup>

        <uni-popup ref="multiRatePopup" type="bottom">
            <view class="multi_rate_popup">
                <view class="title">
                    <text>价格选择</text>
                    <view class="close_btn" @click="closeMultiRate"></view>
                </view>
                <view class="multi_rate_tip">
                    如果选择低价可能不适用原政策，请以支付重选时政策为准！
                </view>
                <scroll-view class="multi_rate_scroll" scroll-y="true">
                    <view class="multi_rate_main">
                        <view class="main_table">
                            <!-- <view class="table_list">
                <view class="list_title">选择项</view>
                <view class="list_message">单项</view>
              </view>
              <view class="table_list">
                <view class="list_title">价格选择</view>
                <view class="list_message">{{roundTripBtnActive === 1?"返程":"去程"}}</view>
              </view> -->
                            <view class="table_price">
                                <view class="list_title">价格</view>
                                <view class="price_box">
                                    <view :class="[
                      'price_list',
                      {
                        active:
                          roundTripBtnActive === 1
                            ? roundCheckMultiRate === item.price
                            : checkMultiRate === item.price,
                      },
                    ]" @click="checkedMultiRate(item)" v-for="(item, index) in multiRateList" :key="index">
                                        <view class="price_text">{{ item.price }}/{{ item.tax }}/{{ item.reward }}/{{
                        item.settle_price
                      }}</view>
                                        <view class="price_checked"></view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </scroll-view>
                <view class="bottom_submit">
                    <button class="multi_rate_submit" @click="submitCheckPrice">
                        预定
                    </button>
                </view>
            </view>
        </uni-popup>
    </scroll-view>
</template>

<script>
import moment from "moment";
moment.locale("zh-cn");
import flightHeader from "@/components/flight_header.vue"; // 航程信息
import flightItem from "@/components/flight_item.vue"; // 舱位信息
import flightExplanation from "@/components/flight_explanation.vue"; // 航班退改信息
import ticket from "@/api/ticketInquiry.js";
export default {
    components: {
        flightHeader,
        flightItem,
        flightExplanation,
    },
    data() {
        return {
            iStatusBarHeight: 0, // 导航栏高度
            airMessage: {}, // 原始数据
            depMessage: {}, // 返程原始数据
            roundTripType: false, // 是否往返

            ticketAddress: {
                // 导航栏地址
                to: "",
                from: "",
            },
            fileKey: "", // av 查询key
            roundTripFileKey: "", // 返程av查询key

            segmentsKey: "",

            segmentsMessage: {}, // 航班数据
            roundSegmentsMessage: {}, // 返程航班数据

            roundTripCheckList: [], // 选中往返列表

            airActiveInfo: {}, // 去程预定
            depActiveInfo: {}, // 返程预定

            flightData: {
                // 航班头部信息
                flightType: "", // 航程类型
                data: [
                    {
                        // 航班数据
                        depTime: "",
                        depAirport_CN: "",
                        arrTerminal: "",
                        depTerminal: "",
                        duration: "",
                        arrTime: "",
                        airline_CN: "",
                        flightNumber: "",
                        aircraftCode: "",
                        hasMeal: "",
                    },
                ],
            },

            roundTripFlightData: {
                // 返程数据
                flightType: "", // 航程类型
                data: [
                    {
                        // 航班数据
                        depTime: "",
                        depAirport_CN: "",
                        arrTerminal: "",
                        depTerminal: "",
                        duration: "",
                        arrTime: "",
                        airline_CN: "",
                        flightNumber: "",
                        aircraftCode: "",
                        hasMeal: "",
                    },
                ],
            },
            roundTripBtnActive: 0, // 舱位选择默认值

            cabinHeader: [], // 舱位选择列表
            current: 0, // 轮播图下标
            cabinList: {},
            headerDiaplay: false, // 舱位头部样式状态
            depHeaderDiaplay: false, // 返程舱位状态

            depCabinHeader: [], // 返程切换头部
            depCabinList: {}, // 返程数据

            ruleInfos: {
                // 退改签信息
                gauge: {
                    refund: [],
                    change: [],
                },
            },

            newPrice: "", // 验价新价格

            checkPrice: null, // 去程验价价格
            checkPriceKey: "", // 去程验价key

            checkRoundPrice: null, // 返程验价价格
            checkRoundPriceKey: "", // 返程验价key

            airGuestInfo: {}, // 客规信息
            depGuestInfo: {}, // 返程客规

            showData: false, // 数据加载

            checkMultiRate: "", // 多运价选择
            roundCheckMultiRate: "", // 返程多运价选择
            multiRateList: [], // 多运价列表

            checkBuild: "", // 多运价机建费
            roundCheckBuild: "", // 返程机建费


            sourceCodeType: '', // 查询数据类型
        };
    },
    methods: {
        // 获取航班详情
        getDetailsData(val) {
            let data;
            if (val) {
                data = {
                    only_cabin: 1,
                    file_key: this.roundTripFileKey,
                    segments_key: this.roundSegmentsMessage.segments_key,
                    departure: this.roundSegmentsMessage.segments[0].depAirport,
                    destination: this.roundSegmentsMessage.segments[0].arrAirport,
                    departureTime: moment(this.airMessage.fromTime.date).format("YYYY-MM-DD"),
                };
            } else {
                data = {
                    only_cabin: 1,
                    file_key: this.fileKey,
                    segments_key: this.segmentsMessage.segments_key,
                    departure: this.segmentsMessage.segments[0].depAirport,
                    destination: this.segmentsMessage.segments[0].arrAirport,
                    departureTime: moment(this.airMessage.toTime.date).format("YYYY-MM-DD"),
                };
            }

            ticket.getTicket(data).then((res) => {
                if (res.errorcode === 10000) {
                    // 组装航班列表信息
                    let airData = res.data.IBE.list[0];
                    this.sourceCodeType = airData.sourceCode
                    let airDataName = Object.keys(airData.ItineraryInfos);
                    // 组装经济舱/公务舱数据
                    airDataName.forEach((item, index) => {
                        let headerNumber = index;
                        if (item !== "NFD") {
                            if (val) {
                                this.depCabinHeader.push(item);
                                this.depCabinList[item] = [];
                                this.depCabinList[item].ruleInfos = {};
                                let dataArr = airData.ItineraryInfos[item];
                                dataArr.forEach((oitem) => {
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
                                        cabinCode: oitem.cabinInfo.cabinCode,
                                        cabin: oitem.cabinInfo.cabinCode + oitem.cabinInfo.cabinDesc, // 舱位
                                        baggage: oitem.cabinInfo.baggage, // 行李额
                                        ruleInfos: oitem.ruleInfos, // 退改信息
                                        data: oitem,
                                    });
                                });
                            } else {
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
                                        cabinCode: oitem.cabinInfo.cabinCode,
                                        cabin: oitem.cabinInfo.cabinCode + oitem.cabinInfo.cabinDesc, // 舱位
                                        baggage: oitem.cabinInfo.baggage, // 行李额
                                        ruleInfos: oitem.ruleInfos, // 退改信息
                                        data: oitem,
                                    });
                                });

                                console.log("舱位列表", this.cabinList);
                            }
                        }
                    });
                    this.depHeaderDiaplay = this.depCabinHeader.length > 2;
                    this.headerDiaplay = this.cabinHeader.length > 2;
                    this.showData = true;
                } else {
                    uni.showToast({
                        title: res.data,
                        duration: 3000,
                        icon: "none",
                        mask: true,
                    });
                    setTimeout(() => {
                        uni.switchTab({
                            url: "/pages/index/index",
                        });
                    }, 3000);
                }
            });
        },

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
            this.$refs.flightExplanation.closeExp();
        },

        // 组装退改信息
        getGaugeInfo(data) {
            console.log("组装", data);
            // 组装航班数据
            let filghtMessage = {
                time: moment(this.segmentsMessage.segments[0].depTime).format("YYYY-MM-DD HH:mm:ss"), // 起飞时间
                code: this.segmentsMessage.segments[0].flightNumber, // 航班号
                address:
                    this.segmentsMessage.segments[0].depAirport_CN.city_name +
                    " " +
                    this.segmentsMessage.segments[0].depAirport_CN.city_code +
                    " - " +
                    this.segmentsMessage.segments[this.segmentsMessage.segments.length - 1].arrAirport_CN
                        .city_name +
                    " " +
                    this.segmentsMessage.segments[this.segmentsMessage.segments.length - 1].arrAirport_CN
                        .city_code, // 行程
                cabin: data.cabin, // 舱位
                price: data.data.cabinPrices.ADT.rulePrice.price, // 票面价
                baggage: data.baggage,
            };

            // 组装退改信息
            let gaugeMessage = data.ruleInfos;

            this.ruleInfos = {
                filght: filghtMessage,
                gauge: gaugeMessage,
            };
        },

        // 打开退改签说明弹窗
        openExpPupop(data) {
            console.log(data);
            this.getGaugeInfo(data);

            console.log("完整信息", this.ruleInfos);
            this.$refs.flightExplanation.openExp();
        },

        // 处理往返选中列表
        getRoundTrip() {
            if (this.roundTripType && this.roundTripBtnActive === 0) {
                this.cabinList[this.airActiveInfo.type].forEach((item, index) => {
                    if (
                        item.cabin === this.airActiveInfo.cabin &&
                        item.data.cabinPrices.ADT.price === this.airActiveInfo.price
                    ) {
                        console.log("获取价格完成后选中", this.airActiveInfo, item, this.cabinList);
                        this.roundTripCheckList[this.roundTripBtnActive] = item;
                    }
                });
            } else if (this.roundTripType && this.roundTripBtnActive === 1) {
                this.depCabinList[this.depActiveInfo.type].forEach((item, index) => {
                    if (
                        item.cabin === this.depActiveInfo.cabin &&
                        item.data.cabinPrices.ADT.price === this.depActiveInfo.price
                    ) {
                        console.log("获取价格完成后选中", item);
                        this.roundTripCheckList[this.roundTripBtnActive] = item;
                    }
                });
            }

            console.log("往返选中列表", this.roundTripCheckList);
            this.$forceUpdate();
        },

        // 获取价格信息 - 验价
        getPriceData(data, header, index, type) {
            console.log(data, header, index, type);
            console.log("验价", this.segmentsMessage, this.roundSegmentsMessage);
            this.getGaugeInfo(data);
            let params;
            if (type) {
                // 往返验价
                this.depActiveInfo = {
                    cabin: data.cabin,
                    price: data.data.cabinPrices.ADT.price,
                    type: data.type,
                };
                this.roundSegmentsMessage["data"] = data;
                params = {
                    sourceCode: "IBE",
                    file_key: this.roundTripFileKey,
                    queryDate: this.roundSegmentsMessage.queryDate,
                    departure: this.roundSegmentsMessage.segments[0].departure,
                    destination: this.roundSegmentsMessage.segments[
                        this.roundSegmentsMessage.segments.length - 1
                    ].destination,
                    systemMsg: "",
                    segments: this.roundSegmentsMessage.segments,
                    ItineraryInfo: data.data,
                    relatedKey: "11",
                    itinerarys: this.roundSegmentsMessage.itinerarys
                };
            } else {
                // 单程验价
                this.airActiveInfo = {
                    cabin: data.cabin,
                    price: data.data.cabinPrices.ADT.price,
                    type: data.type,
                };
                params = {
                    sourceCode: this.sourceCodeType,
                    file_key: this.fileKey,
                    queryDate: this.segmentsMessage.segments[0].depTime,
                    departure: this.segmentsMessage.segments[0].depAirport,
                    destination: this.segmentsMessage.segments[
                        this.segmentsMessage.segments.length - 1
                    ].arrAirport,
                    systemMsg: "",
                    segments: this.segmentsMessage.segments,
                    ItineraryInfo: data.data,
                    relatedKey: "11",
                    itinerarys: this.segmentsMessage.itinerarys
                };
            }

            console.log(params)

            ticket
                .checkPrice(params)
                .then((res) => {
                    if (res.errorcode === 10000) {
                        if (type) {
                            this.$set(
                                this.depCabinList[header][index].data.cabinPrices.ADT.rulePrice,
                                "price",
                                res.data.price
                            );
                            this.$set(
                                this.depCabinList[header][index].data.cabinPrices.ADT.rulePrice,
                                "type",
                                true
                            );
                            this.$set(
                                this.depCabinList[header][index].data.cabinPrices.ADT.rulePrice,
                                "key",
                                res.data.keys
                            );
                        } else {
                            this.$set(
                                this.cabinList[header][index].data.cabinPrices.ADT.rulePrice,
                                "price",
                                res.data.price
                            );
                            this.$set(
                                this.cabinList[header][index].data.cabinPrices.ADT.rulePrice,
                                "type",
                                true
                            );
                            this.$set(
                                this.cabinList[header][index].data.cabinPrices.ADT.rulePrice,
                                "key",
                                res.data.keys
                            );
                        }
                        this.$forceUpdate();
                    } else {
                        if (type) {
                            this.$set(
                                this.depCabinList[header][index].data.cabinPrices.ADT.rulePrice,
                                "price",
                                "无运价"
                            );
                        } else {
                            this.$set(
                                this.cabinList[header][index].data.cabinPrices.ADT.rulePrice,
                                "price",
                                "无运价"
                            );
                        }
                        uni.showToast({
                            title: res.data.msg || res.data.Message || "获取失败，请稍后再试",
                            icon: "none",
                            duration: 3000,
                        });
                    }
                    console.log(this.cabinList);

                    this.$forceUpdate();
                })
                .catch(() => {
                    this.$set(
                        this.cabinList[header][index].data.cabinPrices.ADT.rulePrice,
                        "price",
                        "无运价"
                    );
                    this.$forceUpdate();
                    uni.showToast({
                        title: "获取失败，请稍后再试",
                        icon: "none",
                        duration: 3000,
                    });
                });
        },

        // 跳转预定页面 - 先验价再跳转
        jumpReservationBtn(data, header, index, type) {
            console.log(data, header, index, type);
            this.getGaugeInfo(data);
            let params;
            if (this.roundTripBtnActive === 0) {

                // 去程验价数据组装
                this.airActiveInfo = {
                    cabin: data.cabin,
                    price: data.data.cabinPrices.ADT.price,
                    type: data.type,
                };
                data.data.productType = data.data.productType === "FD" ? "SD" : data.data.productType;
                params = {
                    sourceCode: this.sourceCodeType,
                    file_key: this.fileKey,
                    queryDate: this.segmentsMessage.queryDate,
                    // departure: this.segmentsMessage.segments[0].departure,
                    // destination: this.segmentsMessage.segments[
                    //   this.segmentsMessage.segments.length - 1
                    // ].destination,
                    departure: this.segmentsMessage.departure,
                    destination: this.segmentsMessage.destination,
                    systemMsg: "",
                    segments: this.segmentsMessage.segments,
                    ItineraryInfo: data.data,
                    relatedKey: "11",
                    itinerarys: this.segmentsMessage.itinerarys
                };
            } else {
                // 返程验价数据组装
                this.depActiveInfo = {
                    cabin: data.cabin,
                    price: data.data.cabinPrices.ADT.price,
                    type: data.type,
                };
                params = {
                    sourceCode: this.sourceCodeType,
                    file_key: this.roundTripFileKey,
                    queryDate: this.roundSegmentsMessage.queryDate,
                    // departure: this.roundSegmentsMessage.segments[0].departure,
                    // destination: this.roundSegmentsMessage.segments[
                    //   this.roundSegmentsMessage.segments.length - 1
                    // ].destination,
                    departure: this.segmentsMessage.departure,
                    destination: this.segmentsMessage.destination,
                    systemMsg: "",
                    segments: this.roundSegmentsMessage.segments,
                    ItineraryInfo: data.data,
                    relatedKey: "11",
                    itinerarys: this.roundSegmentsMessage.itinerarys
                };
            }
            // if (data.data.cabinPrices.ADT.rulePrice.type) {
            //   if (!this.roundTripType) {
            //     // 单程验价
            //     uni.navigateTo({
            //       url:
            //         "/flightReservation/flightReservation?key=" +
            //         data.data.cabinPrices.ADT.rulePrice.key +
            //         "&airMessage=" +
            //         JSON.stringify(this.airMessage) +
            //         "&price=" +
            //         data.data.cabinPrices.ADT.rulePrice.price +
            //         "&data=" +
            //         JSON.stringify(this.ticketAddress),
            //     });
            //   } else {
            //     console.log(data, header, index, type);
            //     // 往返验价
            //     if (this.roundTripBtnActive === 0) {
            //       this.checkPrice = data.data.cabinPrices.ADT.rulePrice.price; // 获取验价价格
            //       this.checkPriceKey = data.data.cabinPrices.ADT.rulePrice.key; // 获取验价key
            //     } else {
            //       this.checkRoundPrice = data.data.cabinPrices.ADT.rulePrice.price; // 获取验价价格
            //       this.checkRoundPriceKey = data.data.cabinPrices.ADT.rulePrice.key; // 获取验价key
            //     }
            //     this.getRoundTrip();
            //   }
            // } else {
            ticket.checkPrice(params).then((res) => {
                if (res.errorcode === 10000) {
                    this.getGaugeInfo(data);
                    if (!res.data.check_price_status && res.data.is_sd_list) {
                        // 价格有修改 弹出提示框
                        this.newPrice = res.data.price;
                        this.relatedKey = res.data.keys;
                        this.checkPriceData = {
                            header: header,
                            index: index,
                            // type: type,
                            price: res.data.price,
                            keys: res.data.keys,
                        };

                        let newSdList = res.data.sd_list;
                        this.multiRateList = res.data.sd_list;

                        let hash = {};
                        this.multiRateList = newSdList.reduce((item, next) => {
                            hash[next.price] ? "" : (hash[next.price] = true && item.push(next));
                            return item;
                        }, []);

                        this.checkMultiRate = data.data.cabinPrices.ADT.price;

                        this.openMultiRate();

                        this.$forceUpdate();

                        // this.$refs.checkPricePopup.open();
                    } else {
                        // 价格没有修改 直接进行操作
                        if (!this.roundTripType) {
                            this.checkPrice = res.data.price; // 获取验价价格
                            this.checkPriceKey = res.data.keys; // 获取验价key
                            if (type) {
                                this.$set(
                                    this.depCabinList[header][index].data.cabinPrices.ADT.rulePrice,
                                    "price",
                                    res.data.price
                                );
                                this.$set(
                                    this.depCabinList[header][index].data.cabinPrices.ADT.rulePrice,
                                    "key",
                                    res.data.keys
                                );
                            } else {
                                this.$set(
                                    this.cabinList[header][index].data.cabinPrices.ADT.rulePrice,
                                    "price",
                                    res.data.price
                                );
                                this.$set(
                                    this.cabinList[header][index].data.cabinPrices.ADT.rulePrice,
                                    "key",
                                    res.data.keys
                                );
                            }

                            // 判断是否改签页面跳入
                            if (uni.getStorageSync("changeTicket")) {
                                uni.navigateTo({
                                    url:
                                        "/order/change?key=" +
                                        res.data.keys +
                                        "&price=" +
                                        res.data.price +
                                        "&roundKey=" +
                                        this.checkRoundPriceKey +
                                        "&roundPrice=" +
                                        this.checkRoundPrice +
                                        "&changeData=" +
                                        uni.getStorageSync("changeTicket"),
                                });
                                return;
                            }

                            // 单程验价
                            uni.navigateTo({
                                url:
                                    "/flightReservation/flightReservation?key=" +
                                    res.data.keys +
                                    "&airMessage=" +
                                    JSON.stringify(this.airMessage) +
                                    "&price=" +
                                    res.data.price +
                                    "&data=" +
                                    JSON.stringify(this.ticketAddress),
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
                            if (this.roundTripBtnActive === 0) {
                                this.roundTripBtn(1);
                            }
                        }
                    }
                } else {
                    uni.showToast({
                        title: res.msg ? res.msg + res.data.Message : '数据获取错误，请联系管理员处理',
                        icon: "none",
                        duration: 3000,
                    });
                }
            });
            // }
        },

        // 打开多运价弹窗
        openMultiRate() {
            this.$refs.multiRatePopup.open();
        },

        // 关闭多运价弹窗
        closeMultiRate() {
            this.$refs.multiRatePopup.close();
        },

        // 选择多运价
        checkedMultiRate(val) {
            console.log(val);
            if (this.roundTripBtnActive !== 0) {
                this.$nextTick(() => {
                    this.roundCheckMultiRate = val.price;
                    this.roundCheckBuild = val.tax;
                });
            } else {
                this.$nextTick(() => {
                    this.checkMultiRate = val.price;
                    this.checkBuild = val.tax;
                });
            }
            this.$forceUpdate();
        },

        // 关闭验价弹窗
        closeCheckPrice() {
            this.$refs.checkPricePopup.close();

            if (this.roundTripType) {
                if (this.roundTripBtnActive === 0) {
                    this.checkPrice = this.checkPriceData.price; // 获取验价价格
                    this.checkPriceKey = this.checkPriceData.keys; // 获取验价key
                    this.roundTripBtn(1);
                } else {
                    this.checkRoundPrice = this.checkPriceData.price; // 获取验价价格
                    this.checkRoundPriceKey = this.checkPriceData.keys; // 获取验价key
                }
                this.$forceUpdate();
                console.log("往返验价");
            }

            if (this.checkPriceData.type) {
                this.$set(
                    this.depCabinList[this.checkPriceData.header][this.checkPriceData.index].data
                        .cabinPrices.ADT.rulePrice,
                    "price",
                    this.checkPriceData.price
                );
                this.$set(
                    this.depCabinList[this.checkPriceData.header][this.checkPriceData.index].data
                        .cabinPrices.ADT.rulePrice,
                    "type",
                    true
                );
                this.$set(
                    this.depCabinList[this.checkPriceData.header][this.checkPriceData.index].data
                        .cabinPrices.ADT.rulePrice,
                    "key",
                    this.checkPriceData.keys
                );
            } else {
                this.$set(
                    this.cabinList[this.checkPriceData.header][this.checkPriceData.index].data
                        .cabinPrices.ADT.rulePrice,
                    "price",
                    this.checkPriceData.price
                );
                this.$set(
                    this.cabinList[this.checkPriceData.header][this.checkPriceData.index].data
                        .cabinPrices.ADT.rulePrice,
                    "type",
                    true
                );
                this.$set(
                    this.cabinList[this.checkPriceData.header][this.checkPriceData.index].data
                        .cabinPrices.ADT.rulePrice,
                    "key",
                    this.checkPriceData.keys
                );
            }

            this.$forceUpdate();
        },
        // 确认验价信息跳转预定页面
        submitCheckPrice() {
            console.log(
                this.checkPriceData,
                this.cabinList[this.checkPriceData.header][this.checkPriceData.index]
            );

            this.closeMultiRate();

            if (this.roundTripType) {
                if (this.roundTripBtnActive === 0) {
                    this.checkPrice = this.checkMultiRate
                        ? this.checkMultiRate
                        : this.checkPriceData.price; // 获取验价价格
                    this.checkPriceKey = this.checkPriceData.keys; // 获取验价key
                    this.checkPriceData.price = this.checkMultiRate;
                } else {
                    this.checkRoundPrice = this.roundCheckMultiRate
                        ? this.roundCheckMultiRate
                        : this.checkPriceData.price; // 获取验价价格
                    this.checkRoundPriceKey = this.checkPriceData.keys; // 获取验价key
                }
                this.$forceUpdate();
                console.log("往返验价");
            }

            if (this.checkPriceData.type) {
                this.$set(
                    this.depCabinList[this.checkPriceData.header][this.checkPriceData.index].data
                        .cabinPrices.ADT.rulePrice,
                    "price",
                    this.roundCheckMultiRate ? this.roundCheckMultiRate : this.checkPriceData.price
                );
                // this.$set(
                //   this.depCabinList[this.checkPriceData.header][
                //     this.checkPriceData.index
                //   ].data.cabinPrices.ADT.rulePrice,
                //   "type",
                //   true
                // );
                this.$set(
                    this.depCabinList[this.checkPriceData.header][this.checkPriceData.index].data
                        .cabinPrices.ADT,
                    "build",
                    this.roundCheckBuild
                );
                this.$set(
                    this.depCabinList[this.checkPriceData.header][this.checkPriceData.index].data
                        .cabinPrices.ADT.rulePrice,
                    "key",
                    this.checkPriceData.keys
                );
            } else {
                this.$set(
                    this.cabinList[this.checkPriceData.header][this.checkPriceData.index].data
                        .cabinPrices.ADT.rulePrice,
                    "price",
                    this.checkMultiRate ? this.checkMultiRate : this.checkPriceData.price
                );
                this.$set(
                    this.cabinList[this.checkPriceData.header][this.checkPriceData.index].data
                        .cabinPrices.ADT,
                    "build",
                    this.checkBuild
                );
                // this.$set(
                //   this.cabinList[this.checkPriceData.header][this.checkPriceData.index]
                //     .data.cabinPrices.ADT.rulePrice,
                //   "type",
                //   true
                // );
                this.$set(
                    this.cabinList[this.checkPriceData.header][this.checkPriceData.index].data
                        .cabinPrices.ADT.rulePrice,
                    "key",
                    this.checkPriceData.keys
                );
            }

            this.$forceUpdate();

            if (!this.roundTripType) {
                // 单程验价
                // this.closeCheckPrice();

                // 判断是否改签页面跳入
                if (uni.getStorageSync("changeTicket")) {
                    uni.navigateTo({
                        url:
                            "/order/change?key=" +
                            res.data.keys +
                            "&price=" +
                            res.data.price +
                            "&roundKey=" +
                            this.checkRoundPriceKey +
                            "&roundPrice=" +
                            this.checkRoundPrice +
                            "&changeData=" +
                            uni.getStorageSync("changeTicket"),
                    });
                    return;
                }

                uni.navigateTo({
                    url:
                        "/flightReservation/flightReservation?key=" +
                        this.relatedKey +
                        "&airMessage=" +
                        JSON.stringify(this.airMessage) +
                        "&price=" +
                        this.checkMultiRate +
                        "&data=" +
                        JSON.stringify(this.ticketAddress),
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
            // 判断是否改签页面跳入
            if (uni.getStorageSync("changeTicket")) {
                uni.navigateTo({
                    url:
                        "/order/change?key=" +
                        res.data.keys +
                        "&price=" +
                        res.data.price +
                        "&roundKey=" +
                        this.checkRoundPriceKey +
                        "&roundPrice=" +
                        this.checkRoundPrice +
                        "&changeData=" +
                        uni.getStorageSync("changeTicket"),
                });
                return;
            }

            uni.navigateTo({
                url:
                    "/flightReservation/flightReservation?type=" +
                    this.roundTripType +
                    "&airMessage=" +
                    JSON.stringify(this.airMessage) +
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
    onShow() {
        let error = uni.getStorageSync("errorFlightData");
        if (error) {
            uni.removeStorageSync("errorFlightData");
            this.roundTripBtn(0);
            this.airActiveInfo = {}; // 去程预定
            this.depActiveInfo = {}; // 返程预定
            this.checkRoundPrice = null;
            this.checkRoundPriceKey = "";
            this.roundTripCheckList = [];
            this.checkPrice = null;
            this.checkPriceKey = "";
        }

        // 获取航班详情
        if (this.roundTripType) {
            this.getDetailsData();
            this.getDetailsData(true);
        } else {
            this.getDetailsData();
        }
    },
    onHide() {
        this.cabinList = {};
        this.depCabinList = {};
        this.cabinHeader = [];
        this.depCabinHeader = [];
        this.current = 0;
    },
    onLoad(data) {
        this.roundTripType = data.pageType ? JSON.parse(data.pageType) : false;
        this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
        console.log("航班信息", data.airMessage);

        if (!data.airMessage) {
            return uni.showModal({
                title: "错误提示",
                content: "数据获取失败，请稍后重试",
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        uni.navigateBack();
                    }
                },
            });
        }

        this.airMessage = data.airMessage ? JSON.parse(data.airMessage) : {};

        if (this.roundTripType) {
            console.log(JSON.parse(data.roundTripData));
            this.fileKey = JSON.parse(data.roundTripKey).start;
            this.roundTripFileKey = JSON.parse(data.roundTripKey).end;
            // 组装往返数据
            this.segmentsMessage = JSON.parse(data.roundTripData).start;
            this.roundSegmentsMessage = JSON.parse(data.roundTripData).end;

            this.flightData = {
                flightType: "去程", // 航程类型
                data: JSON.parse(data.roundTripData).start.segments, // 原始数据
            };
            this.roundTripFlightData = {
                flightType: "返程", // 航程类型
                data: JSON.parse(data.roundTripData).end.segments, // 原始数据
            };
            console.log("舱位信息航班详情", this.flightData, this.roundTripFlightData);
            console.log(
                "航班数据",
                this.airMessage,
                this.segmentsMessage,
                this.roundSegmentsMessage
            );
        } else {
            // 组装单程数据
            this.segmentsMessage = JSON.parse(data.airData);
            this.fileKey = data.fileKey;
            console.log("航班数据", this.airMessage);
            console.log("舱位信息", this.segmentsMessage);

            // 组装航程信息
            this.flightData = {
                flightType: "单程", // 航程类型
                data: this.segmentsMessage.segments, // 原始数据
            };
            console.log("舱位信息航班详情", this.flightData);
        }

        // 获取航司退改信息
        // this.getGaugeMessage();
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

        .not_flight_data {
            border-radius: 20upx;
            background: #ffffff;
            box-shadow: 0 12upx 18upx rgba(0, 0, 0, 0.04);
            padding: 30upx 20upx 22upx;
            margin: 0 20upx 20upx;
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
                justify-content: space-around;
                padding: 0;
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
                .not_content_item {
                    width: 100%;
                    height: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: darkgray;
                }
            }
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

    .multi_rate_popup {
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
                top: 54upx;
                right: 44upx;
            }
        }
        .multi_rate_tip {
            font-size: 28upx;
            font-weight: 400;
            color: #fb9826;
            background: RGBA(255, 245, 233, 1);
            padding: 20upx 40upx;
        }
        .multi_rate_scroll {
            overflow-y: auto;
            box-sizing: border-box;
            flex: 1;
            max-height: 50vh;
            width: 100%;
            background: rgba(255, 255, 255, 1);
            .multi_rate_main {
                margin: 46upx 40upx;
                height: 100%;
                box-sizing: border-box;
                .main_table {
                    // margin: 0 80upx;
                    border: 2upx solid #f1f3f5;
                    .table_list {
                        display: flex;
                        align-items: flex-start;
                        &:not(:last-child) {
                            border-bottom: 2upx solid #f1f3f5;
                        }
                        .list_title {
                            width: 140upx;
                            min-height: 80upx;
                            background: #f9f9f9;
                            display: inline-flex;
                            align-items: center;
                            font-size: 24upx;
                            font-weight: 500;
                            color: #333333;
                            flex-shrink: 0;
                            padding-left: 22upx;
                            box-sizing: border-box;
                        }
                        .list_message {
                            flex: 1;
                            display: flex;
                            align-items: center;
                            border-left: 2upx solid #f1f3f5;
                            min-height: 80upx;
                            font-size: 24upx;
                            font-weight: 500;
                            color: #999999;
                            padding: 0 22upx;
                        }
                    }
                    .table_price {
                        position: relative;
                        padding-left: 142upx;
                        .list_title {
                            position: absolute;
                            left: 0;
                            top: 0;
                            height: 100%;
                            width: 142upx;
                            border-right: 2upx solid #f1f3f5;
                            background: #f9f9f9;
                            display: inline-flex;
                            align-items: center;
                            font-size: 24upx;
                            font-weight: 500;
                            color: #333333;
                            flex-shrink: 0;
                            padding-left: 22upx;
                            box-sizing: border-box;
                        }
                        .price_box {
                            padding: 24upx 22upx;
                            .price_list {
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                                &:not(:last-child) {
                                    margin-bottom: 50upx;
                                }
                                &.active {
                                    .price_text {
                                        color: #0070e2;
                                    }
                                    .price_checked {
                                        background: url("@/static/selected_active.png")
                                            no-repeat center center;
                                        background-size: contain;
                                    }
                                }
                                .price_text {
                                    font-size: 28upx;
                                    font-weight: 400;
                                    color: #333333;
                                }
                                .price_checked {
                                    background: url("@/static/selected.png")
                                        no-repeat center center;
                                    background-size: contain;
                                    width: 40upx;
                                    height: 40upx;
                                }
                            }
                        }
                    }
                }
            }
        }
        .bottom_submit {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 90upx;
            background: #fff;
            padding-top: 20upx;
            padding-bottom: 80upx;
            .multi_rate_submit {
                font-size: 32upx;
                font-weight: 400;
                color: #ffffff;
                letter-spacing: 5upx;
                width: calc(100% - 100upx);
                height: 100%;
                background: linear-gradient(90deg, #0070e2 0%, #56c5ff 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 6upx 12upx rgba(0, 112, 226, 0.3);
                border-radius: 80upx;
            }
        }
    }
}
</style>
