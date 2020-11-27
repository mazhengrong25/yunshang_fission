<!--
 * @Author: mzr
 * @Date: 2020-11-27 10:39:07
 * @LastEditTime: 2020-11-27 11:29:30
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
            @scroll="scroll"
            class="content"
            @scrolltolower="nextPageData()"
        >

            <view class="content_list">

                <!--改签类别 -->
                <view class="list_item_header">
                    <view class="list_tyle">{{
                        ''
                    }}</view>
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
        }

    },

    methods: {

    },

    onLoad(data){

         this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;

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
            background: rgba(123, 155, 193, 0.4);
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

        .multiple_trips_header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 92upx;
            padding: 0 20upx;
            border-bottom: 2upx solid rgba(241, 243, 245, 1);
            background: #fff;
            border-radius: 20upx 20upx 0 0;
            .header_title {
            font-size: 28upx;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
            }
            .header_price {
            font-size: 42upx;
            font-weight: bold;
            color: rgba(255, 0, 0, 1);
            text {
                font-size: 24upx;
                margin-right: 4upx;
            }
            }
        }
        .list_item {
            background: rgba(255, 255, 255, 1);
            box-shadow: 0 12upx 18upx rgba(0, 0, 0, 0.04);
            border-radius: 20upx;
            padding: 20upx 20upx 40upx;
            &:not(:last-child) {
            margin-bottom: 20upx;
            }
            &.multiple_trips_item {
            border-radius: 0;
            &:last-child {
                border-radius: 0 0 20upx 20upx;
                .item_header {
                .info_right {
                    display: none;
                }
                }
            }
            &:not(:last-child) {
                .item_time,
                .item_btn_box {
                display: none;
                }
            }
            }
            .item_header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16upx;
            .item_title {
                display: flex;
                align-items: center;
                .title_type {
                display: inline-flex;
                align-items: center;
                padding: 0 20upx;
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
                margin-right: 12upx;
                &.return_trip {
                    background: linear-gradient(
                    90deg,
                    rgba(155, 236, 153, 1) 0%,
                    rgba(133, 205, 131, 1) 100%
                    );
                }
                }
                .title {
                font-size: 34upx;
                font-weight: bold;
                color: rgba(42, 42, 42, 1);
                display: inline-flex;
                align-items: center;
                .title_tag {
                    width: 80upx;
                    height: 30upx;
                    background: linear-gradient(90deg, #9bec99 0%, #85cd83 100%);
                    border-radius: 10upx;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20upx;
                    font-weight: 400;
                    color: #ffffff;
                    margin-right: 12upx;
                    &.to {
                    background: linear-gradient(270deg, #0070e2 0%, #56c5ff 100%);
                    }
                }
                }
            }
            .item_price {
                font-size: 42upx;
                font-weight: bold;
                color: rgba(255, 0, 0, 1);
                text {
                font-size: 24upx;
                margin-right: 4upx;
                }
            }
            .info_right {
                font-size: 24upx;
                font-weight: 400;
                color: rgba(42, 42, 42, 1);
            }
            }
            .item_info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .info_left {
                font-size: 24upx;
                font-weight: 400;
                color: rgba(42, 42, 42, 1);
                text {
                display: inline-flex;
                align-items: center;
                &:first-child {
                    padding-left: 0;
                }
                &:not(:last-child) {
                    &::after {
                    content: "";
                    display: block;
                    width: 2upx;
                    height: 20upx;
                    background: rgba(211, 223, 236, 1);
                    margin: 0 8upx;
                    }
                }
                }
            }
            .info_right {
                font-size: 24upx;
                font-weight: 400;
                color: rgba(42, 42, 42, 1);
            }
            }

            //乘客姓名
            .passenger_item {
            display: flex;
            justify-content: flex-start;
            margin-top: 20upx;
            .item_title {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                color: rgba(42, 42, 42, 1);
                border: 2rpx solid #D9E1EA;
                border-radius: 20rpx;
                font-size: 22rpx;
                padding: 0 10upx;
                height: 30rpx; 
                color: #6E6E6E;
                min-width: 68upx;
                &:nth-child(n+5){
                display: none;
                }
                &:not(:last-child){
                margin-right: 10rpx;
                }
            }
            }

            .item_time {
            margin: 34upx 0;
            height: 64upx;
            background: rgba(243, 245, 247, 1);
            border-radius: 20upx;
            display: flex;
            align-items: center;
            padding: 0 20upx;
            font-size: 24upx;
            font-weight: bold;
            color: #2a2a2a;
            .time_icon {
                width: 24upx;
                height: 24upx;
                margin-right: 10upx;
                image {
                width: 100%;
                height: 100%;
                object-fit: contain;
                }
            }
            .time_number {
                color: #ff0000;
            }
            }
            .item_btn_box {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            .item_btn {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 170upx;
                height: 64upx;
                border: 2upx solid rgba(223, 223, 223, 1);
                border-radius: 50upx;
                font-size: 24upx;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
                margin-left: 20upx;
                &.submit_btn {
                background: rgba(0, 112, 226, 1);
                color: rgba(255, 255, 255, 1);
                border-color: rgba(0, 112, 226, 1);
                }
            }
            }
        }
        }

        .no_data {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 20upx;
        font-size: 28upx;
        font-weight: 400;
        color: rgba(175, 185, 196, 1);
        margin-bottom: 60upx;
        text {
            flex-shrink: 0;
            margin: 0 10upx;
        }
        &::after,
        &::before {
            content: "";
            display: block;
            border-bottom: 2upx dashed #d9e1ea;
            flex: 1;
        }
        }
    }
}

</style>
