<!--
 * @Author: mzr
 * @Date: 2020-11-18 09:42:34
 * @LastEditTime: 2020-12-09 16:55:24
 * @LastEditors: Please set LastEditors
 * @Description: 改签
 * @FilePath: \positiond:\tests\fission\yunshang_fission\src\order\change.vue
-->
<template>
    <view class="change">
        <yun-header :statusHeight="iStatusBarHeight" centerTitle="改签"></yun-header>
        <scroll-view :enable-back-to-top="true" :scroll-y="true" class="content">

            <!-- 改签信息 -->
            <refundTop 
            :dataList="list" 
            @voluntary="volRadio" 
            @cause="causeSel"
            @change="typeRadio" 
            :valueType="valueType"
            :volunType='radioValue'
            :changeReason='cause'
            topStatus="change"
            
            ></refundTop>

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
            <flight-header
                v-if="flightData.data.length > 0"
                :flightData="flightData"
                :roundTripFlightData="roundTripFlightData"
                :roundTripType="roundTripType"
                :interType="false"
                flightTitle="change"
            ></flight-header>

            <view v-else class="not_flight_data">
                <text></text>
                <text></text>
                <view></view>
            </view>

            <!-- 新航班 -->
            <flight-header
                v-if="flightNewData.data.length > 0"
                :flightData="flightNewData"
                :interType="true"
                flightTitle="new"
                @changeNewTicket="queryFlightData"
            ></flight-header>
            
            <view class="main_list newflight" v-else>
                <view class=main_list_first>
                    <view class="main_list_title">新航班</view>   
                </view>
                <view class="flight_list">
                    <view class="list_item">
                        <view class="list_info">
                            <view class="list_connect"
                            @click.stop="openDataSelect()">
                                <view class="info_type">
                                    <image class="info_img" src="@/static/from_time.png" mode="aspectFill" />
                                </view>
                                <view v-if="changeDate" class="info_name_not">{{ changeDate.date }}</view>
                                <view v-else class="info_name">改签日期</view>
                            </view>
                            <view class="info_query" @click.stop="queryFlightData()">搜索航班</view>
                        </view>
                    </view>
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
                    <view v-if="changeRemark" class="item_message">{{ changeRemark }}</view>
                    <view v-else class="item_message input-right-arrow"></view>
                </view>
                </view>
            </view>

            <!-- 改签申请已提交成功 -->
            <uni-popup ref="changeMessage" type="dialog" :maskClick="false">
                <view class="refund_message_box">
                    
                    <view class="refund_message_icon" v-if="message_true">
                        <img src="@/static/message_right.png"></img>
                    </view>
                    <view class="refund_message_icon" v-else>
                        <img src="@/static/message_error.png"></img>
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
import orderApi from "@/api/order.js";
import ticket from "@/api/ticketInquiry.js";
import { parse } from 'querystring';
import refundTop from "@/components/refund_top.vue"; //改签信息
import flightHeader from "@/components/flight_header.vue"; // 航程信息
import moment from "moment";
moment.locale("zh-cn");
export default {

    components: {
        refundTop,
        flightHeader
    },

    data() {
        return {
            iStatusBarHeight: 0,

            changeDetail:{

                data: []
            }, // 存放从订单详情返回过来的航班信息

            checkedPassengerlist: [], // 选中乘客列表

            message_true: false, // 提交状态
            message_msg: "", // 错误信息

            changeRemark:"", //备注

            radioValue:"1", //单项框 是否自愿
            valueType:"3", //单选框 改签类型

            cause:"", //改签原因

            flightData:{}, //原航班
            flightNewData:{}, //新航班

            changeDate:'', //改签日期

            // 航班信息
            flightMessage: {
                to: {
                    city_code: "CKG",
                    city_name: "重庆",
                    province: "重庆",
                },
                from: {
                    city_code: "CKG",
                    city_name: "重庆",
                    province: "重庆",
                }
            },

            changeTicketAddress: {}, // 改签航班信息
            newTicketPrice: '', // 改签新航班金额
        }
    },

    methods:{

        // 单选框 是否自愿
        volRadio(val) {

            this.radioValue = val 
            console.log('改签是否自愿',typeof(this.radioValue))
        },

        // 单选框  改签类型
        typeRadio(val) {

            this.valueType = val;
            console.log('改签类型',this.valueType)
        },

        // 改签原因
        causeSel(val) {
            this.cause = val
            console.log('改签原因',this.cause)
        },

        // 跳转备注页面
        openRemark() {
            uni.navigateTo({
                url:'/order/addRemark?changeRemark='+this.changeRemark,
            })
        },

        // 跳转到选择日期页面
        openDataSelect() {
            uni.navigateTo({
                url:'/pages/dateSelect/dateSelect'
            })
        },

        // 选择乘机人
        checkedPassenger(val, index) {
            
        // 判断当前数据是否有active属性，如果有，就赋值为相反状态
            this.$set(this.changeDetail.ticket_passenger[index],"active",!val.active);
        
        // 判断当前数据active状态
            if (this.changeDetail.ticket_passenger[index].active) {
        //   如果为true就push进选中列表
            this.checkedPassengerlist.push(val.id);
            } else {
        //   如果为false就从选中列表删除
            this.checkedPassengerlist.splice(this.checkedPassengerlist.findIndex(item => item === val.id),1)
            }
            this.checkedAllStatus = this.checkedPassengerlist.length === this.changeDetail.ticket_passenger.length

            this.$forceUpdate()
        },
        
        // 提交申请
        submitChange() {

            if(this.checkedPassengerlist.length < 1){
                return uni.showToast({
                    title: "请选择乘机人信息",
                    icon: "none",
                });
            } 

            if(!this.cause && this.radioValue === '2') {
                return uni.showToast({
                    title: "请选择改签原因",
                    icon: "none",
                });
            }
            let params  = {
                "change_type": Number(this.valueType),      
                "reason": this.cause,               
                "contact": this.changeDetail.contact,             
                "phone":this.changeDetail.phone,          
                "order_no":this.changeDetail.order_no
            }

            let segments = []
            this.changeTicketAddress.segments.forEach(item =>{
                segments.push({
                    "flight_data": item.depTime,                //类型：String  必有字段  备注：起飞日期
                    "departure":item.depAirport,                //类型：String  必有字段  备注：起飞机场
                    "arrival":item.arrAirport,                //类型：String  必有字段  备注：到达机场
                    "flight_no":item.flightNumber,                //类型：String  必有字段  备注：航班号
                    "time":item.departureTime,                //类型：String  必有字段  备注：起飞时间
                    "model":item.aircraft_code,                //类型：String  必有字段  备注：机型
                    "cabin":this.changeTicketAddress.cabinInfo.cabinCode,                //类型：String  必有字段  备注：舱位
                    "price": Number(this.newTicketPrice),                //类型：Number  必有字段  备注：票价
                    "arr_time":item.arrTime,                //类型：String  必有字段  备注：到达时间
                    "policy_id":this.changeTicketAddress.cabinInfo.policyData.id,                //类型：String  必有字段  备注：政策ID
                    "flight_time":item.duration,                //类型：String  必有字段  备注：飞行时间
                    "departure_term":item.depTerminal,                //类型：String  必有字段  备注：出发航站楼
                    "arrival_term":item.arrTerminal,                //类型：String  必有字段  备注：到达航站楼
                    "cabin_level_key": this.changeTicketAddress.cabinInfo.cabinDesc,                //类型：String  必有字段  备注：舱位等级
                    "keys":"",                //类型：String  必有字段  备注：无
                    "old_segment_id":this.changeDetail.ticket_segments[0].id               //类型：Number  必有字段  备注：旧航段ID
                })
            })
       
            let data = {    
                params: params,
                passenger_ids: this.checkedPassengerlist,
                segments: segments
            }
            orderApi.changeSubmit(data).then((res => {
                this.message_true = res.data.status === 1;
                if(res.result === 10000) {
                     this.message_msg = res.data.msg;
                }
                this.open();
                console.log(res)
            }))
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
                // 返回到订单详情页面
                uni.navigateBack({
                    delta:4
                });
            }
        },

        // 搜索航班点击
        queryFlightData() {
            if(this.changeDate) {
                console.log('搜索提交',JSON.stringify(this.flightMessage))
                let newData = {
                    time: this.changeDate, // 改签日期
                    changeType: this.valueType,  // 改签类型
                    changeStatus: this.radioValue,  // 是否自愿
                    changeCause: this.cause, // 改签原因
                    passengerList: this.checkedPassengerlist
                }
                this.flightMessage['toTime'] = this.changeDate
                uni.setStorageSync('changeMessage', JSON.stringify(newData))
                uni.setStorageSync('changeTicket', JSON.stringify(this.changeDetail))
                uni.navigateTo({
                    url: '/ticketInquiry/ticketInquiry?data=' + JSON.stringify(this.flightMessage),
                });
            }else if(!this.changeDate) {
                uni.showToast({
                    title: "请先选择改签日期",
                    icon: "none",
                    duration: 3000,
                })
            }  
        },

        // 获取新航班信息
        getNewAddress(key,price){
            this.newTicketPrice = price
            let newData = {
                price: price,
            };
            ticket.getTicketInfo(key, newData)
            .then((res) => {
                console.log(res)
                if(res.errorcode === 10000){
                    this.changeTicketAddress =res.data
                    // 组装新航班信息
                    this.flightNewData = { 
                        flightType:'单程',
                        data: res.data.segments, //单程信息
                    }
                } 
                console.log('新航班',this.changeTicketAddress)
            })
        },

    },

    onShow(){

        // 改签   改签备注内容
        if(uni.getStorageSync('remark_key')){
        this.changeRemark = uni.getStorageSync('remark_key')
        uni.removeStorageSync('remark_key')
        }
        
        // 新航班 时间处理
        if (uni.getStorageSync("time")) {
            let timeData = JSON.parse(uni.getStorageSync("time"));
            console.log("时间", timeData);
            this.changeDate = timeData
            this.$forceUpdate();
            console.log("时间返回", this.changeDate);
            uni.removeStorageSync("time")
        }
    
    },

    onLoad(data){
        console.log(data)
        this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
        this.changeDetail = JSON.parse(data.changeData)
        if(data.key){
            let changeMessage = JSON.parse(uni.getStorageSync('changeMessage'))
            
            // 组装改签页面原始信息
            this.changeDate = changeMessage.time
                this.valueType = changeMessage.changeType
                this.radioValue  = changeMessage.changeStatus
                this.cause  = changeMessage.changeCause
            
            this.checkedPassengerlist = changeMessage.passengerList
            // 组装选中乘机人列表状态
            this.changeDetail.ticket_passenger.forEach(item =>{
                changeMessage.passengerList.forEach(oitem =>{
                    item.active = item.id === oitem
                })
            })

            this.getNewAddress(data.key,data.price)
            
        }
        console.log('改签',this.changeDetail)

        // 组装 搜索航班信息
        this.flightMessage = {

            from: {
                city_code: this.changeDetail.ticket_segments[0].arrive_CN.city_code,
                city_name:  this.changeDetail.ticket_segments[0].arrive_CN.city_name,
                province: this.changeDetail.ticket_segments[0].arrive_CN.province,
            },
            to: {
                city_code: this.changeDetail.ticket_segments[0].departure_CN.city_code,
                city_name: this.changeDetail.ticket_segments[0].departure_CN.city_name,
                province: this.changeDetail.ticket_segments[0].departure_CN.province,
            },
        }

        // 组装航程信息
        this.flightData = {

            flightType: (this.changeDetail.ticket_segments.length) === 2
                ? Number(this.changeDetail.ticket_segments[1].segment_num) === 2
                    ? "往返"
                    : "单程"
                : "单程",   
            data: this.changeDetail.ticket_segments || [], // 单程信息
            cabinInfo: this.changeDetail.ticket_segments || [], //退票规则
        };

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
            // padding-top: 24rpx;
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
            // margin-top: 46upx;
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
                // padding-bottom: 32upx;
                // border-bottom: 2upx solid rgba(241, 243, 245, 1);
                // margin-bottom: 30upx;
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
        &.newflight {

            .flight_list {
                .list_item {
                    .list_info {
                        display: flex;
                        align-items: center;
                        margin-bottom: 10upx;
                        justify-content: space-between;
                        .list_connect {
                            display: flex;
                            justify-content: center;
                            align-items: center;
    
                            .info_type {
                                display: inline-flex;
                                width: 30upx;
                                height: 30upx;
                                margin-right: 12rpx;
                                .info_img {
                                    width: 100%;
                                    height: 100%;
                                    object-fit: contain;
                                }
                            }
                            .info_name {
                                font-size: 32upx;
                                font-weight: 400;
                                color: rgba(175, 185, 196, 1);
                            }
                            .info_name_not {
                                font-size: 32upx;
                                font-weight: 400;
                                color:rgba(51, 51, 51, 1);
                            }
                        }
                        .info_query {
                            width: 170upx;
                            height: 64upx; 
                            border: 1px solid #0070E2;
                            border-radius: 90upx;
                            font-size: 28upx;
                            font-weight: 400;
                            color:rgba(0, 112, 226, 1);
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            margin-top: -55rpx;
                        }
                    }
                }
            }

        }
    }

    .not_flight_data {
        border-radius: 20rpx;
        background: #ffffff;
        box-shadow: 0 12rpx 18rpx rgba(0, 0, 0, 0.04);
        padding: 30rpx 20rpx 22rpx;
        margin: 0 20rpx 20rpx;
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

.refund_message_box {
  width: 540upx;
  background: #ffffff;
  border-radius: 20upx;
  display: flex;
  flex-direction: column;
  padding-top: 40upx;
  .refund_message_icon {
    width: 90upx;
    height: 90upx;
    margin: 0 auto;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .refund_message_send {
    margin-top: 22upx;
    text-align: center;
    font-size: 24upx;
    font-weight: 400;
    color: #0070e2;
    padding: 0 60rpx;
  }
  .refund_message_bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90upx;
    border-top: 2upx solid #eaeaea;
    margin-top: 40upx;
    font-size: 28upx;
    font-weight: 400;
    color: #333333;
  }
}

</style>