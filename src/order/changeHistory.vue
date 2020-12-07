<!--
 * @Author: mzr
 * @Date: 2020-11-27 10:39:07
 * @LastEditTime: 2020-12-07 15:58:30
 * @LastEditors: Please set LastEditors
 * @Description: 历史改签航班
 * @FilePath: \positiond:\tests\Distribution\yunshang_fission\src\order\changeHistory.vue
-->
<template>
    <view class="change_history">
        <yun-header :statusHeight="iStatusBarHeight" centerTitle="历史改签航班"></yun-header>
        <scroll-view
            :scroll-y="true"
            :enable-back-to-top="true"
            :scroll-top="scrollTop"
            class="content"
        >
            <!-- 第一次改签 -->
            <view class="content_list">
                <!--改签类别 -->
                <view class="list_item_header">
                    <view class="list_tyle gray">第一次改签</view>
                </view>
                <!-- 航班信息 -->
                <view class="filght_message" v-if="historyFirst.change_segments">   
                    <view class="header_message">
                        <view class="header_type">单程</view>
                        <view class="header_time">
                            {{$dateTool(historyFirst.change_segments[0].departure_time,'YYYY-MM-DD')}}
                            {{$dateTool(historyFirst.change_segments[0].departure_time,'dddd')}}
                        </view>
                    </view>
                    <view class="content_message" >
                        <view class="left_message address_message">
                            <view class="time">
                                {{$dateTool(historyFirst.change_segments[0].departure_time,'HH:mm')}}
                            </view>
                            <view class="address">
                                {{historyFirst.change_segments[0].departure_CN.city_name}}{{
                                historyFirst.change_segments[0].departure_CN.air_port_name}}{{
                                historyFirst.change_segments[0].departure_terminal}}机场
                            </view>
                        </view>
                        <view class="center_message">
                            <view class="duration">
                                 {{Math.floor($timeDiff(historyFirst.change_segments[0].arrive_time,historyFirst.change_segments[0].departure_time, 'minutes') / 60)}}h{{
                                Math.floor($timeDiff(historyFirst.change_segments[0].arrive_time,historyFirst.change_segments[0].departure_time, 'minutes') % 60)}}m
                            </view>
                            <view class="arrow_icon"></view>
                        </view>
                        <view class="right_message address_message">
                            <view class="time">
                                {{$dateTool(historyFirst.change_segments[0].arrive_time,'HH:mm')}}
                            </view>
                            <view class="address">
                                {{historyFirst.change_segments[0].arrive_CN.city_name}}{{
                                historyFirst.change_segments[0].arrive_CN.air_port_name}}{{
                                historyFirst.change_segments[0].arrive_terminal}}机场
                            </view>
                        </view>
                    </view>
                    <view class="change_filght_message">
                        <!-- 航班图标 -->
                        <view class="message_icon">
                            <image
                                class="message_icon"
                                :src="'https://fxxcx.ystrip.cn' + historyFirst.change_segments[0].image"
                                mode="aspectFit"
                            />
                        </view>
                        <view class="message_list">
                            {{historyFirst.change_segments[0].airline_CN}}
                        </view>
                        <view class="message_list">{{ historyFirst.change_segments[0].flight_no }}</view?>
                            <view class="message_list">{{ historyFirst.change_segments[0].model }}</view>
                        </view>
                    </view>
                    <!-- 图片 -->
                    <view class="middle_image">
                        <image class="middle_icon" src="@/static/change_connect.png" mode="aspectFill" />
                    </view>
                    <!-- 乘客信息 -->
                    <view class="passenger_message">
                        <view
                        :class="['passenger_list', { active: passInfoChecket === index }]"
                        v-for="(item, index) in historyFirst.change_passengers" 
                        :key="index"
                        >
                            <view class="list_item">
                                <view class="list_info" @click="openPassInfo(index)">
                                    <view class="info_type">
                                        {{
                                            item.ticket_passenger.PassengerType === "ADT"
                                                ? "成人"
                                                : item.ticket_passenger.PassengerType === "CNN"
                                                ? "儿童"
                                                : item.ticket_passenger.PassengerType === "INF"
                                                ? "婴儿"
                                                : ""
                                        }}票
                                    </view>
                                    <view class="info_name">{{item.ticket_passenger.PassengerName}}</view>
                                    <view class="is_insurance">
                                        <image src="@/static/insurance_icon.png" mode="aspectFit" />
                                    </view>
                                    <view class="group_message">
                                        <view class="message_show">
                                            <view class="group_info">
                                                <view class="group_type">票号</view>
                                                <view class="group_number">{{item.ticket_passenger.ticket_no || ''}}</view>
                                            </view>
                                            <view class="price_arrow">
                                                <image src="@/static/unfold.png" mode="aspectFit" />
                                            </view>
                                        </view>
                                        <!-- 展开内容 -->
                                        <view class="list_main">                           
                                            <view class="list_item">
                                                <view class="item_title">{{
                                                    item.ticket_passenger.Credential === "0"
                                                    ? "身份证"
                                                    : item.ticket_passenger.Credential === "1"
                                                    ? "护照"
                                                    : item.ticket_passenger.Credential === "2"
                                                    ? "港澳通行证"
                                                    : item.ticket_passenger.Credential === "3"
                                                    ? "台胞证"
                                                    : item.ticket_passenger.Credential === "4"
                                                    ? "回乡证"
                                                    : item.ticket_passenger.Credential === "5"
                                                    ? "台湾通行证"
                                                    : item.ticket_passenger.Credential === "6"
                                                    ? "入台证"
                                                    : item.ticket_passenger.Credential === "7"
                                                    ? "国际海员证"
                                                    : item.ticket_passenger.Credential === "8"
                                                    ? "其它证件"
                                                    : ""
                                                }}</view>
                                                <view class="item_message">{{item.ticket_passenger.CredentialNo || ''}}</view>
                                            </view>
                                            <view class="list_item">
                                                <view class="item_title">手机号</view>
                                                <view class="item_message">{{item.ticket_passenger.phone || ''}}</view>
                                            </view>
                                        </view>
                                    </view>    
                                </view>    
                            </view>
                        </view>     
                    </view>
                </view>
            <!-- 原航班改签 -->
            <view class="content_list">
                <!--改签类别 -->
                <view class="list_item_header">
                    <view class="gray list_tyle">原航班</view>
                </view>
                <!-- 航班信息 单程固定-->
                <view class="filght_message" v-if="historyFirst.change_segments">
                    <view class="header_message">
                        <view class="header_type">单程</view>
                        <view class="header_time">
                            {{$dateTool(historyFromer.change_segments[0].departure_time,'YYYY-MM-DD')}}
                            {{$dateTool(historyFromer.change_segments[0].departure_time,'dddd')}}
                        </view>
                    </view>

                    <view class="content_message" >
                        <view class="left_message address_message">
                            <view class="time">
                                {{$dateTool(historyFromer.change_segments[0].departure_time,'HH:mm')}}
                            </view>
                            <view class="address">
                                {{historyFromer.change_segments[0].departure_CN.city_name}}{{
                                historyFromer.change_segments[0].departure_CN.air_port_name}}{{
                                historyFromer.change_segments[0].departure_terminal}}机场
                            </view>
                        </view>
                        <view class="center_message">
                            <view class="duration">
                                {{Math.floor($timeDiff(historyFromer.change_segments[0].arrive_time,historyFromer.change_segments[0].departure_time, 'minutes') / 60)}}h{{
                                Math.floor($timeDiff(historyFromer.change_segments[0].arrive_time,historyFromer.change_segments[0].departure_time, 'minutes') % 60)}}m
                            </view>
                            <view class="arrow_icon"></view>
                        </view>
                        <view class="right_message address_message">
                            <view class="time">
                                {{$dateTool(historyFromer.change_segments[0].arrive_time,'HH:mm')}}
                            </view>
                            <view class="address">
                                {{historyFromer.change_segments[0].arrive_CN.city_name}}{{
                                historyFromer.change_segments[0].arrive_CN.air_port_name}}{{
                                historyFromer.change_segments[0].arrive_terminal}}机场
                            </view>
                        </view>
                    </view>
                    <view class="change_filght_message">
                        <!-- 航班图标 -->
                        <view class="message_icon">
                        <image
                            class="message_icon"
                            :src="'https://fxxcx.ystrip.cn' + historyFromer.change_segments[0].image"
                            mode="aspectFit"
                        />
                        </view>
                         <view class="message_list">
                            {{historyFromer.change_segments[0].airline_CN}}
                        </view>
                        <view class="message_list">{{ historyFromer.change_segments[0].flight_no }}</view>
                        <view class="message_list">{{ historyFromer.change_segments[0].model }}</view>
                    </view>
                </view>
                <!-- 图片 -->
                <view class="middle_image">
                    <image class="middle_icon" src="@/static/change_connect.png" mode="aspectFill" />
                </view>
                <!-- 乘客信息 -->
                <view class="passenger_message">
                    <view
                        :class="['passenger_list', { active: passInfoChecket === index }]"
                        v-for="(item, index) in historyFromer.change_passengers" 
                        :key="index"
                    >
                        <view class="list_item">
                            <view class="list_info" @click="openPassInfo(index)">
                                <view class="info_type">
                                    {{
                                        item.ticket_passenger.PassengerType === "ADT"
                                            ? "成人"
                                            : item.ticket_passenger.PassengerType === "CNN"
                                            ? "儿童"
                                            : item.ticket_passenger.PassengerType === "INF"
                                            ? "婴儿"
                                            : ""
                                    }}票
                                </view>
                                <view class="info_name">{{item.ticket_passenger.PassengerName}}</view>
                                <view class="is_insurance"  v-if="Number(item.ticket_passenger.insurance_total) > 0">
                                    <image src="@/static/insurance_icon.png" mode="aspectFit" />
                                </view>
                                <view class="group_message">
                                    <view class="message_show">
                                        <view class="group_info">
                                            <view class="group_type">票号</view>
                                            <view class="group_number">{{item.ticket_no || ''}}</view>
                                        </view>
                                        <view class="price_arrow">
                                            <image src="@/static/unfold.png" mode="aspectFit" />
                                        </view>
                                    </view>
                                     <!-- 展开内容 -->
                                    <view class="list_main">
                                        <view class="list_item">
                                            <view class="item_title">{{
                                                item.ticket_passenger.Credential === "0"
                                                ? "身份证"
                                                : item.ticket_passenger.Credential === "1"
                                                ? "护照"
                                                : item.ticket_passenger.Credential === "2"
                                                ? "港澳通行证"
                                                : item.ticket_passenger.Credential === "3"
                                                ? "台胞证"
                                                : item.ticket_passenger.Credential === "4"
                                                ? "回乡证"
                                                : item.ticket_passenger.Credential === "5"
                                                ? "台湾通行证"
                                                : item.ticket_passenger.Credential === "6"
                                                ? "入台证"
                                                : item.ticket_passenger.Credential === "7"
                                                ? "国际海员证"
                                                : item.ticket_passenger.Credential === "8"
                                                ? "其它证件"
                                                : ""
                                            }}</view>
                                            <view class="item_message">{{item.ticket_passenger.CredentialNo || ''}}</view>
                                        </view>
                                        <view class="list_item">
                                            <view class="item_title">手机号</view>
                                            <view class="item_message">{{item.ticket_passenger.phone || ''}}</view>
                                        </view>
                                    </view>
                                </view>   
                            </view>   
                        </view>
                    </view>  
                </view>
            </view>
        </scroll-view>
    </view>   
</template>

<script>
export default {

    data() {

        return{

            iStatusBarHeight: 0,
            scrollTop: 0, // 列表滚动值

            changeHistoryList:{}, //列表数据 原航班和第一次改签
            historyFirst:{}, // 第一次改签
            historyFromer:{}, //原航班

            passInfoChecket: null, //乘客信息展开值
        }

    },

    methods: {

        // 展开乘客信息详情
        openPassInfo(i) {
            this.passInfoChecket = this.passInfoChecket === i ? null : i;
            this.$forceUpdate();
        },

    },

    onLoad(data){

        this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
        this.changeHistoryList = JSON.parse(data.changeData);
        this.historyFirst = this.changeHistoryList.newDetails
        this.historyFromer =  this.changeHistoryList.oldDetails


        console.log('多次改签',this.changeHistoryList)
        console.log('第一次改签',this.historyFirst)
        console.log('原航班',this.historyFromer)
         

    }
    
}
</script>

<style lang="less" scoped>
.change_history {
    background: rgba(243, 245, 247, 1);
    height: 100vh;
    display: flex;
    flex-direction: column;

    .content {
        flex: 1;
        box-sizing: border-box;
        overflow-y: auto;

        .content_list {

            margin: 0 20upx 40upx;
            &:first-child {
                margin-top: 40upx;
            }
            .list_item_header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20upx;
                .list_tyle {
                display: inline-flex;
                align-items: center;
                padding: 0 32upx;
                height: 50upx;
                background: rgba(255, 0, 0, 0.4);
                border-radius: 26upx;
                font-size: 24upx;
                font-weight: 400;
                color: rgba(255, 255, 255, 1);
                &.gray {
                    background: rgba(123, 155, 193, 0.4);
                }
                }
                .list_style {
                    background: rgba(123, 155, 193, 0.4);
                    display: inline-flex;
                    align-items: center;
                    padding: 0 32upx;
                    height: 50upx;
                    border-radius: 26upx;
                    font-size: 24upx;
                    font-weight: 400;
                    color: rgba(255, 255, 255, 1);
                }
                .scheduled_time {
                font-size: 24upx;
                color: gray;
                }
            } 

            .filght_message {

                background: rgba(255, 255, 255, 1);
                box-shadow: 0 12upx 18upx rgba(0, 0, 0, 0.04);
                border-radius: 20upx 20upx 0upx 0upx;  
                padding: 46upx 20upx 14upx;

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

                .change_filght_message {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .message_icon {
                    width: 24upx;
                    height: 24upx;
                    object-fit: contain;
                    margin-right: 6upx;
                    display: flex;
                    }
                    .message_list {
                    font-size: 22upx;
                    font-weight: 400;
                    color: rgba(175, 185, 196, 1);
                    display: inline-flex;
                    align-items: center;
                    &:not(:last-child) {
                        &::after {
                        content: "";
                        display: block;
                        width: 2upx;
                        height: 20upx;
                        background: rgba(217, 225, 234, 1);
                        margin: 0 8upx;
                        }
                    }
                    }
                }
            }

            .middle_image {
                height: 48rpx;
                .middle_icon {
                    width: 100%;
                    height: 48upx;
                    object-fit: contain;
                }

            }

            .passenger_message {

                background: rgba(255, 255, 255, 1);
                box-shadow: 0 12upx 18upx rgba(0, 0, 0, 0.04);
                border-radius: 0upx 0upx 20upx 20upx;
                padding: 20upx 20upx 40upx;

                .passenger_list {
                    margin-top: 32upx;
                    &.active {
                    .list_info {
                        .price_arrow {
                        transform: rotate(180deg);
                        }
                    }
                    .list_item {
                        .list_main {
                        animation: openMain 0.4s forwards;
                        height: auto;
                        // padding-bottom: 24rpx;
                        // border-bottom: 2rpx solid #f1f3f5;
                        // margin-bottom: 32rpx;
                        margin-top: 28upx;
                        }
                    }
                    }
                    .list_item {
                    &:not(:last-child) {
                        margin-bottom: 24upx;
                    }

                    .list_info {
                        display: flex;
                        align-items: flex-start;

                        .group_message{
                            margin-left: 28upx;
                            .message_show{
                                display: inline-flex;
                                align-items: center;
                                width: 100%;
                            }
                        }





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
                        flex-shrink: 0;
                        }
                        .info_name {
                        font-size: 28upx;
                        font-weight: bold;
                        color: rgba(42, 42, 42, 1);
                        margin-right: 8upx;
                        flex-shrink: 0;
                        }
                        .is_insurance {
                        width: 30upx;
                        height: 30upx;
                        margin-right: 8upx;
                        display: flex;
                        flex-shrink: 0;
                        image {
                            width: 100%;
                            height: 100%;
                            object-fit: contain;
                        }
                        }
                        .group_info {
                        display: inline-flex;
                        justify-content: center;
                        align-items: center;

                        .group_type {
                            font-size: 28upx;
                            font-weight: 400;
                            color: #333333;
                            margin-right: 10px;
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
                        height: 0;
                        animation: closeMain 0.4s forwards;
                        .list_item {
                        display: flex;
                        align-items: center;
                        .item_title {
                            font-size: 28upx;
                            font-weight: 400;
                            color: #666666;
                        }
                        .item_message {
                            font-size: 28upx;
                            font-weight: 400;
                            color: #666666;
                            margin-left: 10upx;
                        }
                        .item_title_old {
                            font-size: 28upx;
                            font-weight: 400;
                            color: #afb9c4;
                        }
                        .item_message_old {
                            font-size: 28upx;
                            font-weight: 400;
                            color: #afb9c4;
                            margin-left: 10upx;
                        }
                        }
                    }
                    .list_message {
                        display: flex;
                        align-items: center;
                        .message_title {
                        font-size: 28upx;
                        font-weight: 400;
                        color: rgba(42, 42, 42, 1);
                        width: 114upx;
                        }
                        .message_number {
                        font-size: 28upx;
                        font-weight: bold;
                        color: rgba(42, 42, 42, 1);
                        }
                    }
                    .ticket_no {
                        margin-top: 20upx;
                        display: flex;
                        align-items: center;
                        font-size: 28upx;
                        color: rgba(42, 42, 42, 1);
                        font-weight: bold;
                        .ticket_no_title {
                        width: 114upx;
                        font-weight: 400;
                        }
                    }
                    }
                }

            }
        }
 
    }
}

</style>
