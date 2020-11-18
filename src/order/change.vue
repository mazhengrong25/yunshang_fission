<!--
 * @Author: mzr
 * @Date: 2020-11-18 09:42:34
 * @LastEditTime: 2020-11-18 16:24:08
 * @LastEditors: Please set LastEditors
 * @Description: 改签
 * @FilePath: \positiond:\tests\fission\yunshang_fission\src\order\change.vue
-->
<template>
    <view class="change">
        <yun-header :statusHeight="iStatusBarHeight" centerTitle="改签"></yun-header>
        <scroll-view :enable-back-to-top="true" :scroll-y="true" class="content">

            <!-- 改签信息 -->
            <refundTop :dataList="list" @voluntary="volRadio" @reason="reasonSel" topStatus="change"></refundTop>

            <!-- 乘机人 -->
            <view class="main_list passenger">
                <view class=main_list_first>
                    <view class="main_list_title">乘机人</view>   
                </view>
                <view class="passenger_list">
                    <view
                    :class="['list_item', { active: item.active }]"
                    v-for="(item, index) in changeDetail.ticket_passenger"
                    :key="index"
                    @click="checkedPassenger(item, index)" 
                    >
                    <view class="list_info">
                    <view class="info_type"
                        >{{
                        item.PassengerType === "ADT"
                            ? "成人"
                            : item.PassengerType === "CNN"
                            ? "儿童"
                            : item.PassengerType === "INF"
                            ? "婴儿"
                            : ""
                        }}票</view
                    >
                    <view class="info_name">{{ item.PassengerName }}</view>
                    <view class="is_insurance" v-if="Number(item.insurance_total) > 0"></view>
                    <view class="group_type">票号</view>
                    <view class="group_number">{{ item.ticket_no }}</view>
                    <view class="list_click"></view>
                    </view>
                    </view>
                </view>
            </view>

            <!-- 原航班 -->
            <view
                class="main_list filght_info"
                v-for="(item, index) in changeDetail.ticket_segments"
                :key="index"
            >
                <view class="main_list_title" style="margin-bottom:50rpx;">原航班</view>
                <view class="info_header">
                <view class="header_type">
                    {{
                    changeDetail.segment_type === 1
                        ? "单程"
                        : changeDetail.segment_type === 2
                        ? "往返"
                        : changeDetail.segment_type === 3
                        ? "多程"
                        : ""
                    }}</view
                >
                <view class="header_time">
                    {{ item.departure_time.substring(0, 10) }}
                    <text>{{ $dateTool(item.departure_time, "ddd") }}</text>
                </view>
                </view>
                <view class="info_message">
                <view class="message_box">
                    <view class="date">{{
                    item.departure_time.substring(11, 16)
                    }}</view>
                    <view class="address"
                    >{{ item.departure_CN.city_name
                    }}{{ item.departure_CN.air_port_name }}</view
                    >
                </view>

                <view class="message_center">
                    <view class="date">
                    {{ Math.floor(item.duration / 3600) }}h{{
                        Math.floor((item.duration / 60) % 60)
                    }}m
                    </view>
                    <view class="center_icon"></view>
                </view>

                <view class="message_box">
                    <view class="date">{{ item.arrive_time.substring(11, 16) }}</view>
                    <view class="address"
                    >{{ item.arrive_CN.city_name
                    }}{{ item.arrive_CN.air_port_name }}</view
                    >
                </view>
                </view>

                <view class="filght_message">
                <!-- 航班图标 -->
                <view class="message_icon">
                    <image
                    class="message_icon"
                    :src="'https://fxxcx.ystrip.cn/' + item.image"
                    mode="contain"
                    />
                </view>
                <view class="message_list">{{ item.airline_CN }}{{ item.flight_no }}</view>
                <view class="message_list">{{ item.model }}</view>
                </view>
            </view>

            <!-- 订单信息 -->
            <view class="main_list order_message">
                <view class="main_list_title">订单信息</view>
                <view class="message_list">
                <view class="list_item">
                    <view class="item_title">订单编号</view>
                    <view class="item_message">{{ changeDetail.order_no }}</view>
                </view>
                <view class="list_item">
                    <view class="item_title">PNR</view>
                    <view class="item_message">{{ changeDetail.pnr_code }}</view>
                </view>
                <view class="list_item">
                    <view class="item_title">YATP订单号</view>
                    <view class="item_message">{{ changeDetail.yatp_order_id }}</view>
                </view>
                <view class="list_item">
                    <view class="item_title">订票员</view>
                    <view class="item_message">{{ changeDetail.book_user }}</view>
                </view>
                <view class="list_item">
                    <view class="item_title">出票员</view>
                    <view class="item_message">{{ changeDetail.out_ticket_name }}</view>
                </view>
                <view class="list_item">
                    <view class="item_title">预定时间</view>
                    <view class="item_message">{{ changeDetail.created_at }}</view>
                </view>
                <view class="list_item" @click="openRemark">
                    <view class="item_title">备注</view>
                    <view v-if="remark" class="item_message">{{ changeDetail.remark }}</view>
                    <view v-else class="item_message input-right-arrow"></view>
                </view>
                </view>
            </view>

            <!-- 改签申请已提交成功 -->
            <uni-popup ref="changeMessage" type="dialog" :maskClick="false">
                <view class="refund_message_box">
                    
                    <view class="refund_message_icon" v-if="message_true">
                        <img src="@/static/message_error.png"></img>
                    </view>
                    <view class="refund_message_icon" v-else>
                        <img src="@/static/message_right.png"></img>
                    </view>
                    <view class="refund_message_send">{{message_msg}}</view>
                    <view class="refund_message_bottom" @click="backPage">知道了</view>
                </view>
            </uni-popup>

        </scroll-view>
        <!-- 提交申请按钮 -->
        <view class="filter_bottom">
            <view class="bottom_btn submit_btn" @click="submitChange">提交申请</view>
        </view>
    </view>
    
</template>

<script>
import { parse } from 'querystring';
import refundTop from "@/components/refund_top.vue"; //改签信息
export default {

    components: {
        refundTop,
    },

    data() {
        return {
            iStatusBarHeight: 0,

            changeDetail:[], // 存放从订单详情返回过来的航班信息

            checkedPassengerlist: [], // 选中乘客列表

            message_true: false, // 提交状态
            message_msg: "", // 错误信息
        }
    },

    methods:{

        // 跳转备注页面
        openRemark() {
            uni.navigateTo({
                url:'/order/addRemark',
            })
        },

        // 选择联系人
        checkedPassenger(val, index) {

        console.log(val, index)
        // 判断当前数据是否有active属性，如果有，就赋值为相反状态
            this.$set(this.refundList.ticket_passenger[index],"active",!val.active);
        
        // 判断当前数据active状态
            if (this.refundList.ticket_passenger[index].active) {
        //   如果为true就push进选中列表
            this.checkedPassengerlist.push(val.id);
            } else {
        //   如果为false就从选中列表删除
            this.checkedPassengerlist.splice(this.checkedPassengerlist.findIndex(item => item === val.id),1)
            }
            this.checkedAllStatus = this.checkedPassengerlist.length === this.refundList.ticket_passenger.length

            this.$forceUpdate()

            console.log(this.checkedPassengerlist);
            // this.checkedPassengerList
        },
        
        // 提交申请
        submitChange() {

        },

        // 打开改签成功弹窗
        open() {

            this.$refs.changeMessage.open();
        },
        close() {

            this.$refs.changeMessage.close();
        },

        backPage() {
            
            this.$refs.changeMessage.close();
            if(this.message_true){
                console.log('返回上一页')
                uni.navigateBack();
            }
        },

        onLoad(data){

            this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
            this.changeDetail = JSON.parse(data.changeData)
        }
    }
    
}
</script>

<style lang="less" scoped>
.change{
    
    background: rgba(243, 245, 247, 1);
    height: 100vh;
    position: relative;
    display: flex;
    flex-direction: column;
    .content {
        
        flex: 1;
        overflow-y: auto;
    }

    .main_list {
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 12upx 18upx rgba(0, 0, 0, 0.04);
        border-radius: 20upx;
        margin: 20upx 20upx 20upx;
        padding: 24upx 20upx 20upx;
        font-weight: bold;
        .main_list_first {
        display: flex;
        align-items: center;
        justify-content: space-between;
        &.active {
            .main_content {
            .list_click {
            background: url(@/static/selected_active.png) no-repeat;
            background-size: contain;
            }
            }
        }

        .main_list_title {
            font-size: 32upx;
            font-weight: bold;
            color: rgba(42, 42, 42, 1);
            margin-bottom: 24rpx;
            padding-top: 24rpx;
            flex: 1;
            justify-content: flex-end;
        }
        .checked_all_btn {
            display: flex;
            &.active{
            .list_click {
                    background: url(@/static/selected_active.png) no-repeat;
                    background-size: contain;
                }
            }
            
        }
        .main_content {
            font-size: 14px;
            font-weight: 400;
            color: rgba(175, 185, 196, 1);
            margin-right: 5px;
        }
        .list_click {
            background: url(@/static/selected.png) no-repeat;
            background-size: contain;
            width: 40upx;
            height: 40upx;
        }
        }
        &.filght_info {
        .info_header {
            display: flex;
            align-items: center;
            margin-bottom: 20upx;
            .header_type {
            width: 80upx;
            height: 30upx;
            background: linear-gradient(
                270deg,
                rgba(0, 112, 226, 1) 0%,
                rgba(86, 197, 255, 1) 100%
            );
            border-radius: 10upx;
            font-size: 20upx;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-right: 12upx;
            }
            .header_time {
            font-size: 24upx;
            font-weight: 400;
            color: rgba(42, 42, 42, 1);
            text {
                margin-left: 12upx;
            }
            }
        }
        .info_message {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 26upx;
            .message_box {
            .date {
                font-size: 36upx;
                font-weight: bold;
                color: rgba(42, 42, 42, 1);
                margin-bottom: 4upx;
            }
            .address {
                font-size: 24upx;
                font-weight: 400;
                color: rgba(42, 42, 42, 1);
            }
            }
            .message_center {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            .date {
                font-size: 22upx;
                font-weight: 400;
                color: rgba(175, 185, 196, 1);
            }
            .center_icon {
                width: 112upx;
                height: 20upx;
                background: url(@/static/ticket_path.png) no-repeat center center;
                background-size: contain;
                display: block;
            }
            .type {
                font-size: 22upx;
                font-weight: 400;
                color: rgba(175, 185, 196, 1);
            }
            }
        }
        .filght_message {
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
        .filght_bottom {
            display: flex;
            align-items: center;
            border-top: 2upx dashed rgba(217, 225, 234, 1);
            margin-top: 20upx;
            padding-top: 20upx;
            justify-content: center;
            .bottom_list {
            font-size: 24upx;
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
        &.passenger {
        .passenger_list {
            margin-top: 46upx;
            .list_item {
            &.active {
                .list_info {
                .list_click {
                    background: url(@/static/selected_active.png) no-repeat;
                    background-size: contain;
                }
                }
            }
            &:not(:last-child) {
                margin-bottom: 60upx;
            }
            &:last-child {
                padding-bottom: 32upx;
                // border-bottom: 2upx solid rgba(241, 243, 245, 1);
                margin-bottom: 30upx;
            }
            .list_info {
                display: flex;
                align-items: center;
                margin-bottom: 34upx;
                justify-content: space-between;
                .info_type {
                width: 100upx;
                height: 30upx;
                border: 2upx solid rgba(127, 183, 240, 1);
                border-radius: 20upx;
                font-size: 20upx;
                font-weight: 400;
                color: rgba(127, 183, 240, 1);
                display: inline-flex;
                align-items: center;
                justify-content: center;
                }
                .info_name {
                font-size: 28upx;
                font-weight: bold;
                color: rgba(42, 42, 42, 1);
                }
                .is_insurance {
                background: url(@/static/insurance_icon.png) no-repeat center
                    center;
                background-size: contain;
                width: 25upx;
                height: 30upx;
                }
                .group_type {
                margin-left: 28upx;
                font-size: 28upx;
                font-weight: 400;
                color: #333333;
                margin-right: -12px;
                }
                .group_number {
                font-weight: bold;
                font-size: 14px;
                color: #2a2a2a;
                }
                .list_click {
                background: url(@/static/selected.png) no-repeat;
                background-size: contain;
                width: 40upx;
                height: 40upx;
                }
            }
            .list_message {
                display: flex;
                align-items: center;
                .message_title {
                font-size: 28upx;
                font-weight: 400;
                color: rgba(42, 42, 42, 1);
                margin-right: 32upx;
                }
                .message_number {
                font-size: 28upx;
                font-weight: bold;
                color: rgba(42, 42, 42, 1);
                }
            }
            }
        }
        .contact {
            .contact_list {
            display: flex;
            align-items: center;
            &:not(:last-child) {
                margin-bottom: 36upx;
            }
            .list_title {
                font-size: 28upx;
                font-weight: 400;
                color: rgba(102, 102, 102, 1);
                width: 132upx;
            }
            .list_message {
                font-size: 28upx;
                font-weight: bold;
                color: rgba(42, 42, 42, 1);
            }
            }
        }
        }
        &.certificate {
        .certificate_message {
            margin-top: 32upx;
            // border-top: 2upx solid #f1f3f5;
            padding-top: 34upx;
            display: flex;
            align-items: center;
            .message_title {
            font-size: 28upx;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
            margin-right: 40upx;
            }
            .message_text {
            font-size: 28upx;
            font-weight: 400;
            color: rgba(42, 42, 42, 1);
            }
        }
        }
        &.order_message {
        .message_list {
            margin-top: 40upx;
            .list_item {
            display: flex;
            align-items: center;
            &:not(:last-child) {
                margin-bottom: 30upx;
            }
            .item_title {
                font-size: 24upx;
                font-weight: 400;
                color: rgba(153, 153, 153, 1);
                width: 133upx;
            }
            .item_message {
                flex: 1;
                text-align: right;
                font-size: 24upx;
                font-weight: 400;
                color: rgba(42, 42, 42, 1);
            }
            }
        }
        }
    }

    .filter_bottom {
        display: flex;
        align-items: center;
        justify-content: center;
        //   position: fixed;
        border-top: 2upx solid rgba(229, 229, 229, 1);
        bottom: 0;
        left: 0;
        width: 100vw;
        height: calc(144upx + var(--status-bar-height));
        //   padding: 90upx 45upx;
        padding-bottom: var(--status-bar-height);
        box-sizing: border-box;
        background: #fff;
        z-index: 1;
        .bottom_btn {
            width: 650upx;
            height: 90upx;
            border: 2upx solid transparent;
            border-radius: 80upx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32upx;
            font-weight: 400;
            &.submit_btn {
                background: linear-gradient(
                90deg,
                rgba(0, 112, 226, 1) 0%,
                rgba(86, 197, 255, 1) 100%
                );
                box-shadow: 0 6upx 12upx rgba(0, 112, 226, 0.3);
                color: rgba(255, 255, 255, 1);
                letter-spacing: 8upx;
            }
        }
    }
}

</style>