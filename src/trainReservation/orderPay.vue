<!--
 * @Description: 火车票 --- 确认支付
 * @Author: mzr
 * @Date: 2021-08-18 14:25:36
 * @LastEditTime: 2021-09-27 16:40:24
 * @LastEditors: mzr
-->
<template>
    <view class="order_pay">
        <yun-header :statusHeight="iStatusBarHeight" centerTitle="确认支付" :showHome="true"></yun-header>

        <view class="order_price">
            <text>订单总价</text>
            <view>
                <text>&yen;</text>
                {{detailData.total_price || 0}}
            </view>
        </view>

        <scroll-view :enable-back-to-top="true" :scroll-y="true" class="order_pay_main">

            <!-- 车次信息 -->
            <view>

                <view class="train_message box-shadow-style">
                    <view class="journey_card_top">
                        <view class="card_top_item">
                            <view class="top_item_date">{{detailData.segments[0]?$moment(detailData.segments[0].departure_time).format("MM-DD"):'-'}}</view>
                            <view class="top_item_date">{{detailData.segments[0]?$moment(detailData.segments[0].departure_time).format("ddd"):'-'}}</view>

                        </view>
                        <view class="card_top_item">
                            <view class="top_item_date">{{detailData.segments[0]?$moment(detailData.segments[0].arrive_time).format("MM-DD"):'-'}}</view>
                            <view class="top_item_date">{{detailData.segments[0]?$moment(detailData.segments[0].arrive_time).format("ddd"):'-'}}</view>
                        </view>
                    </view>
                    <view class="journey_card_bottom">
                        <view class="bottom_left">
                            <view class="left_time">{{detailData.segments[0]?$moment(detailData.segments[0].departure_time).format("hh:mm"):'-'}}</view>
                            <view class="left_arrive">{{detailData.segments[0].from_city}}</view>
                        </view>
                        <view class="bottom_center">
                            <view class="bottom_center_item">
                                {{`${detailData?Math.floor(
                                    Number(detailData.segments[0].travel_time) / 60
                                         ):0}h${detailData.segments[0].travel_time?Math.floor(Number(detailData.segments[0].travel_time) % 60):0}m`}}
                            </view>
                            <view class="bottom_center_stop" @click="openStopStation()">经停站</view>
                            <image class="train_stop_image" src="@/static/train_stop.png" mode="contain" />
                            <view class="bottom_center_item">{{detailData.segments[0].train_number}}</view>
                        </view>
                        <view class="bottom_right">
                            <view class="left_time">{{detailData.segments[0]?$moment(detailData.segments[0].arrive_time).format("hh:mm"):'-'}}</view>
                            <view class="left_arrive">{{detailData.segments[0].to_city}}</view>
                        </view>
                    </view>
                   
                </view>
                <view class="journey_image"></view>
                <view class="passenger_message box-shadow-style">

                    <view class="passenger_list" v-for="(item, index) in detailData.passengers" :key="index">
                        <view class="passenger_type">
                            {{item.PassengerType === 'ADT' ?
                             '成人':item.PassengerType === 'CHD' ?
                              '儿童': ''}}票
                        </view>
                        <view class="passenger_item">
                            <view class="passenger_name">{{item.PassengerName}}</view>
                            <view class="insurance_icon" :style="{opacity:item.is_insurance === 1?'':'0'}"></view>
                        </view>
                        <view class="seat_type">{{item.seat}}</view>
                        <view class="seat_no">{{item.seat_info.replace("厢,0","")}}</view>
                    </view>

                </view>

            </view>

            <view class="order_message box-shadow-style">
                <view class="message_list">
                    <view class="list_title">订单编号</view>
                    <view class="list_text">{{detailData.order_no}}</view>
                </view>
                <view class="message_list">
                    <view class="list_title">收款方</view>
                    <view class="list_text">重庆云上航空票务股份有限公司</view>
                </view>
            </view>

            <view class="pay_type box-shadow-style">
                <view class="title">支付方式</view>
                <radio-group @change="radioChange">
                    <label class="type_group">
                        <view class="group_title">
                            <image src="@/static/pay_wallet.png" mode="contain" />钱包支付
                        </view>
                        <radio value="钱包" color="#0070E2" checked="true" />
                    </label>
                    <label class="type_group">
                        <view class="group_title">
                            <image src="@/static/pay_wx.png" mode="contain" />微信支付
                        </view>
                        <radio value="微信" color="#0070E2" />
                    </label>
                </radio-group>
            </view>

        </scroll-view>

        <view class="pay_bottom">
            <view class="bottom_tip">
                您的订单已提交，剩余支付时间
                <text>14:00</text>
            </view>
            <view class="bottom_submit">
                <button class="submit_pay" @click="jumpPay()">立即支付</button>
            </view>
        </view>

    </view>
</template>

<script>
import train from "@/api/trainInquiry.js";
export default {
    data() {
        return {
            iStatusBarHeight: 0, // 导航栏高度
            detailData:{}, // 
        }
    },
    methods: {
        // 预定 占座 获取数据
        getData(val) {
            train.getTrainDetail(val).then((res) => {
                console.log('确认支付', res)
                if (res.errorcode === 10000) {
                    this.detailData = res.data
                }else {
                  uni.showToast({
                    title: res.msg,
                    icon: "none",
                  });
                }

            })
        },
    },
    onLoad(data) {
        this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
        this.getData(data.orderNo);
        // 正常单，改签单传值 
        this.detailData = data.detailItem ? JSON.parse(data.detailItem) : {};
    }
}
</script>

<style lang="less" scoped>
.order_pay {
    background: rgba(243, 245, 247, 1);
    height: 100vh;
    display: flex;
    flex-direction: column;
    .order_price {
        display: flex;
        // flex: 1;
        align-items: baseline;
        padding: 32upx 20upx;
        color: rgba(255, 255, 255, 1);
        box-sizing: border-box;
        background-color: #0070e2;
        > text {
            font-size: 12px;
            font-weight: 400;
            margin-right: 20upx;
        }
        > view {
            font-size: 48upx;
            font-weight: bold;
            text {
                font-size: 24upx;
                font-weight: 400;
                margin-right: 5upx;
            }
        }
    }

    .order_pay_main {
        flex: 1;
        height: 100%;
        overflow-y: auto;
        position: relative;
        &::before {
            content: "";
            background: linear-gradient(
                180deg,
                #0070e2 0%,
                rgba(0, 112, 226, 0) 100%
            );
            position: absolute;
            left: 0;
            top: 0;
            z-index: 0;
            width: 100vw;
            height: 300upx;
            display: block;
        }
    }
    .train_message {
        padding: 34upx 20upx 0upx;
        background: #ffffff;
        box-shadow: 0upx 12upx 18upx rgba(0, 0, 0, 0.04);
        border-radius: 20upx 20upx 0upx 0upx;
        .journey_card_top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20upx;
            .card_top_item {
                display: inline-flex;
                font-size: 24upx;
                font-weight: 400;
                color: #2a2a2a;
                .top_item_date {
                    &:not(:last-child) {
                        margin-right: 10upx;
                    }
                }
            }
        }
        .journey_card_bottom {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 36upx;
            .bottom_left {
                .left_time {
                    font-size: 48upx;
                    font-weight: bold;
                    color: #333333;
                }
                .left_arrive {
                    font-size: 28upx;
                    font-weight: 400;
                    color: #2a2a2a;
                }
            }
            .bottom_center {
                position: relative;
                .bottom_center_item {
                    font-size: 22upx;
                    font-weight: 400;
                    color: #afb9c4;
                    margin-bottom: 4upx;
                    text-align: center;
                }
                .train_stop_image {
                    width: 202upx;
                    height: 40upx;
                }
                .bottom_center_stop {
                    font-size: 22upx;
                    font-weight: 400;
                    color: #0070e2;
                    position: absolute;
                    right: 68upx;
                    bottom: 46upx;
                }
            }
            .bottom_right {
                text-align: right;
                .left_time {
                    font-size: 48upx;
                    font-weight: bold;
                    color: #333333;
                }
                .left_arrive {
                    font-size: 28upx;
                    font-weight: 400;
                    color: #2a2a2a;
                }
            }
        }
    }
    .journey_image {
        height: 52upx;
        background: url("@/static/change_connect.png") no-repeat center center;
        background-size: cover;
        margin: -1upx 15upx;
    }
    .passenger_message {
        border-radius: 0upx 0upx 20upx 20upx;
        padding: 24upx;
        margin-top: -1upx;
        margin-bottom: 20upx;
        .passenger_list {
            display: flex;
            justify-content: start;
            align-items: center;
            .passenger_type {
                display: inline-flex;
                justify-content: center;
                align-items: center;
                border: 2upx solid #7fb7f0;
                border-radius: 20upx;
                font-size: 20upx;
                font-weight: 400;
                color: #7fb7f0;
                height: 30upx;
                padding: 0upx 22upx;
                margin-right: 16upx;
            }
            .passenger_item {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                .passenger_name {
                    font-size: 28upx;
                    font-weight: bold;
                    color: #2a2a2a;
                    margin-right: 6upx;
                }
                .insurance_icon {
                    width: 24upx;
                    height: 30upx;
                    background: url("/static/insurance_icon.png") no-repeat
                        center;
                    background-size: contain;
                }
            }
            .seat_type {
                font-size: 28upx;
                font-weight: 400;
                color: #333333;
                margin: 0upx 44upx;
            }
            .seat_no {
                font-size: 28upx;
                font-weight: bold;
                color: #2a2a2a;
            }
            &:not(:last-child) {
              margin-bottom: 62upx;
            }
        }
    }

    .order_message {
        .message_list {
            display: flex;
            align-items: center;
            justify-content: space-between;
            &:not(:last-child) {
                border-bottom: 2upx solid rgba(241, 243, 245, 1);
                padding-bottom: 30upx;
                margin-bottom: 30upx;
            }
            .list_title {
                font-size: 24upx;
                font-weight: 400;
                color: rgba(153, 153, 153, 1);
                display: inline-flex;
                align-items: center;
                .title_tag {
                    width: 80upx;
                    height: 30upx;
                    border: 1px solid rgba(127, 183, 240, 1);
                    border-radius: 20upx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-left: 10upx;
                    font-size: 20upx;
                    font-weight: 400;
                    color: rgba(127, 183, 240, 1);
                }
            }
            .list_text {
                font-size: 24upx;
                font-weight: 400;
                color: rgba(42, 42, 42, 1);
                text-align: right;
            }
        }
    }
    .pay_type {
        margin-top: 20upx;
        margin-bottom: 40upx;
        .title {
            font-size: 32upx;
            font-weight: bold;
            color: rgba(51, 51, 51, 1);
            margin-bottom: 30upx;
        }
        .type_group {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: 30upx;
            &:first-child {
                border-bottom: 2upx solid #f1f3f5;
                padding-bottom: 30upx;
            }
            .group_title {
                display: flex;
                align-items: center;
                font-size: 28upx;
                font-weight: 400;
                color: rgba(42, 42, 42, 1);
                image {
                    width: 60upx;
                    height: 60upx;
                    object-fit: contain;
                    margin-right: 20upx;
                }
            }
        }
    }
    .pay_bottom {
        padding-bottom: var(--status-bar-height);
        background: rgba(255, 255, 255, 1);
        .bottom_tip {
            height: 80upx;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(251, 152, 38, 0.1);
            font-size: 24upx;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            text {
                font-size: 28upx;
                font-weight: bold;
                color: rgba(251, 152, 38, 1);
                margin-left: 16upx;
            }
        }
        .bottom_submit {
            height: 144upx;
            display: flex;
            align-items: center;
            justify-content: center;
            border-top: 2upx solid #e5e5e5;
            .submit_pay {
                width: 650upx;
                height: 90upx;
                margin: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(
                    90deg,
                    rgba(0, 112, 226, 1) 0%,
                    rgba(86, 197, 255, 1) 100%
                );
                box-shadow: 0 6upx 12upx rgba(0, 112, 226, 0.3);
                border-radius: 80upx;
                font-size: 32upx;
                font-weight: 400;
                color: rgba(255, 255, 255, 1);
                letter-spacing: 5upx;
                &.is_disabled {
                    opacity: 0.4;
                }
            }
        }
    }
}
</style>