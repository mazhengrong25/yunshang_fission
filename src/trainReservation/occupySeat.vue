<!--
 * @Description: 火车票 --- 占座
 * @Author: mzr
 * @Date: 2021-08-17 08:58:59
 * @LastEditTime: 2021-09-24 15:01:09
 * @LastEditors: mzr
-->
<template>
    <view class="occupy_seat">
        <yun-header :statusHeight="iStatusBarHeight" centerTitle="火车票占座"></yun-header>
        <view class="occupy_background">
            <!-- 占座状态-->
            <view class="occupy_modal">
                <view class="occupy_success" v-if="count !== null">
                    <view class="success_text">占座中，请稍后...</view>
                    <view class="success_process">
                        <view class="process_item">
                            <p :style="{right: (100 - processNumber) + '%'}">
                                <image class="occupy_icon" src="@/static/train_occupy_img.png" mode="contain" />
                            </p>
                        </view>
                        <view class="remaining_number_box" :style="{width: processNumber + '%'}">
                            <p class="remaining_number">
                                <span>{{processNumber.toFixed(0)}}%</span>
                            </p>
                        </view>
                    </view>
                </view>
                <view class="occupy_fail" v-else>
                    <view class="fail_img"></view>
                    <view class="fail_text">占座失败</view>
                    <view class="fail_add">{{failMessage}}</view>
                </view>
            </view>
            <!-- 车次信息 -->
            <trainMessageCard :trainObject="trainData" :isCabin="true" :seatObject="singleData" :isPrice="false"></trainMessageCard>
            <!-- 操作 -->
            <view class="occupy_button">
                <view class="occupy_success" v-if="count !== null">
                    <view class="success_remain">
                        <view class="remain_text">预计剩余时间</view>

                        <view class="remain_value">
                            {{  Math.floor(count / 60)}} 分
                            {{  Math.floor(count % 60)}} 秒</view>
                    </view>
                    <button class="success_detail" @click="jumpOrderDetail">订单详情</button>
                </view>
                <view class="occupy_fail" v-else>
                    <button class="order_detail" @click="jumpOrderDetail">订单详情</button>
                    <button class="order_relection" @click="jumpTrainInquiry">重选车次</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
let timer
let getOrderStatus

import train from "@/api/trainInquiry.js";
import trainMessageCard from '@/components/train_message_card.vue' // 车次信息
export default {
    components: {
        trainMessageCard
    },
    data() {
        return {
            orderNO: "", // 订单号
            trainData: {}, // 车次信息
            singleData: {}, // 座位信息

            iStatusBarHeight: 0, // 导航栏高度

            count: 0,
            orderStatus: "",
            failMessage: "", // 占座失败原因
            processNumber: 0, // 


            orderSeatStatus: false, // 占座状态
        }
    },
    methods: {

        getData(val, type) {
            train.getTrainDetail(val, type).then((res) => {
                if (res.errorcode === 10000) {
                    // 占座成功
                    if (res.data.status === 2) {
                        this.orderSeatStatus = true

                    }
                    // 占座失败
                    if (res.data.status === 6) {
                        this.count = 0
                        clearInterval(getOrderStatus)
                        clearInterval(timer)
                        this.failMessage = res.data.status_remark
                    }
                }
            })
        },

        // 跳转到车次查询
        jumpTrainInquiry() {
            // 组装车次查询信息
            let data = {
                to : {
                    city_name: this.trainData.station.arrive_name
                },
                from : {
                    city_name: this.trainData.station.departure_name
                },
                toTime: {
                    date: this.$moment(this.trainData.train.departure_date).format("YYYY-MM-DD")
                }
            }   
            uni.reLaunch({
                url:"/trainInquiry/trainInquiry?trainData=" +
                JSON.stringify(data)
            })
        },

        // 跳转到订单详情
        jumpOrderDetail() {
            uni.reLaunch({
                url:"/order/trainOrderDetails?orderNO=" + 
                this.orderNO
            })
        }

    },
    onLoad(data) {
        this.orderNO = data.orderNO
        this.trainData = JSON.parse(data.trainInfo)
        this.singleData = JSON.parse(data.seatInfo)
        this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;

        let number = Math.floor(Math.random() * 100) + 30
        // let number =  30

        this.count = number


        getOrderStatus = setInterval(() => {
            this.getData(this.orderNO, true)
            if (this.orderSeatStatus) {
                clearInterval(getOrderStatus)
                clearInterval(timer)
                this.processNumber = 100
                this.count = 0


                setTimeout(() => {
                  // 跳转确认支付
                  uni.reLaunch({
                    url:"/trainReservation/orderPay?orderNO=" +
                    this.orderNO
                  })
                },1500)
            }
        }, 3000)


        timer = setInterval(() => {
            this.count--
            this.processNumber = ((number - this.count) / number) *
                99
            if (this.count < 1) {
                clearInterval(timer)
            }

        }, 1000)



    },
    onHide() {
        clearInterval(timer)
        clearInterval(getOrderStatus)
    },
    onUnload() {
        clearInterval(timer)
        clearInterval(getOrderStatus)
    }
}
</script>

<style scoped lang="less">
.occupy_seat {
    height: 100vh;
    display: flex;
    flex-direction: column;
    .occupy_background {
        height: 600upx;
        background: linear-gradient(
            180deg,
            #0070e2 0%,
            rgba(0, 112, 226, 0) 100%
        );
        padding: 20upx;
        .occupy_modal {
            .occupy_fail {
                color: #ffffff;
                text-align: center;
                .fail_img {
                    width: 100upx;
                    height: 100upx;
                    display: inline-block;
                    background: url(@/static/train_occupy_fail.png) no-repeat
                        center center;
                    background-size: contain;
                    margin: 38upx 0upx 26upx;
                }
                .fail_text {
                    font-size: 40upx;
                    font-weight: bold;
                }
                .fail_add {
                    font-size: 28upx;
                    font-weight: 400;
                    margin: 16upx 0upx 44upx;
                }
            }
            .occupy_success {
                .success_text {
                    font-size: 40upx;
                    font-weight: bold;
                    color: #ffffff;
                    margin: 52upx 0upx 30upx;
                }
                .success_process {
                    position: relative;
                    margin-bottom: 30upx;
                    .process_item {
                        background: #ffffff;
                        border-radius: 32upx;
                        height: 50upx;
                        overflow: hidden;
                        p {
                            transition: all 0.3s;
                            position: relative;
                            transition: all 0.3s;
                            background-color: #fb9826;
                            height: 50upx;
                            width: calc(100% - 120upx);
                            right: 100%;
                            border-radius: 32upx 0upx 0upx 32upx;
                            .occupy_icon {
                                width: 160upx;
                                height: 50upx;
                                position: absolute;
                                right: -120upx;
                            }
                        }
                    }
                    .remaining_number_box {
                        transition: all 0.3s;
                        width: 0;
                        text-align: right;
                        // padding-left: 66upx;
                        // box-sizing: border-box;
                        .remaining_number {
                            font-size: 36upx;
                            height: 54upx;
                            font-weight: bold;
                            color: #fff;
                            border-radius: 10upx;
                            background-color: rgba(255, 255, 255, 0.1);
                            width: 120upx;
                            display: inline-flex;
                            justify-content: center;
                            align-items: center;
                            margin: 16upx 0upx 0;
                            position: relative;
                            &::after {
                                content: "";
                                width: 0;
                                height: 0;
                                border: 12upx solid transparent;
                                border-bottom: 14upx solid
                                    rgba(255, 255, 255, 0.1);
                                position: absolute;
                                bottom: 54upx;
                                left: 50%;
                                margin-left: -6upx;
                            }
                        }
                    }
                }
            }
        }
        .occupy_button {
            .occupy_fail {
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 32upx;
                font-weight: 400;
                margin-top: 102upx;
                letter-spacing: 10upx;
                .order_detail {
                    width: 320upx;
                    height: 90upx;
                    color: #0070e2;
                    border: 2upx solid #0070e2;
                    border-radius: 80upx;
                    background-color: unset;
                }
                .order_relection {
                    width: 320upx;
                    height: 90upx;
                    color: #ffffff;
                    background: linear-gradient(
                        90deg,
                        #0070e2 0%,
                        #56c5ff 100%
                    );
                    box-shadow: 0upx 6upx 12upx rgba(0, 112, 226, 0.3);
                    border-radius: 80upx;
                }
            }
            .occupy_success {
                display: flex;
                flex-direction: column;
                .success_remain {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 26upx;
                    font-weight: 400;
                    margin: 66upx 0upx 44upx;
                    .remain_text {
                        color: #333333;
                        margin-right: 16upx;
                    }
                    .remain_value {
                        color: #0070e2;
                    }
                }
                .success_detail {
                    display: inline-flex;
                    justify-content: center;
                    align-items: center;
                    width: 650upx;
                    height: 90upx;
                    font-size: 32upx;
                    font-weight: 400;
                    color: #ffffff;
                    letter-spacing: 10upx;
                    background: linear-gradient(
                        90deg,
                        #0070e2 0%,
                        #56c5ff 100%
                    );
                    box-shadow: 0upx 6upx 12upx rgba(0, 112, 226, 0.3);
                    border-radius: 80upx;
                }
            }
        }
    }
}
</style>