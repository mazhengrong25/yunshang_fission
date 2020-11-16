<!--
 * @Author: mzr
 * @Date: 2020-11-09 14:11:33
 * @LastEditTime: 2020-11-16 09:57:28
 * @LastEditors: Please set LastEditors
 * @Description: 客服服务列表
 * @FilePath: \positiond:\tests\fission\yunshang_fission\src\userInfo\serviceDetails.vue
-->
<template>
    <view class="list">

        <yun-header :statusHeight="iStatusBarHeight" :headerColor="true" centerTitle="分销国内"></yun-header>
        
        <scroll-view
            :scroll-y="true"
            @scroll="scroll"
            :enable-back-to-top="true"
            class="content"
        >
        
        <view class="content_list"
        v-for="(item, index) in detailList"
        :key="index">

            <view class="list_item">

                <view class="item_info">
                    <view class="info_top">
                        <view class="title">{{item.username}}</view>
                        <view class="time">{{item.work_time}}</view>
                    </view>
                    <view class="info_bottom">
                        <view class="type">电话：</view>
                        <view class="phone">{{item.tel}}</view>
                    </view>
                </view>

                <view class="edit_btn" @click="jumpPhoneCall(item)">
                    
                    <image src="@/static/call_icon.png" mode="contain" />
                    
                </view>
            </view>

        </view>

        </scroll-view>
    </view>
</template>

<script>
export default {
    data() {
        return {

            iStatusBarHeight: 0,
            detailList:[], // 列表
            serviceType:'', // 服务类型
            oldScrollTop:0,
          
        };
    },
    methods: {

        scroll(e) {
           
            this.oldScrollTop = e.detail.scrollTop
        },

        // 拨打电话
        jumpPhoneCall(val) {
            console.log(val)
            uni.makePhoneCall({
                phoneNumber: val.tel, //仅为示例
                
            });
        }

    },
    onLoad(data) {

        this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
        this.serviceType = data.type;
        this.detailList = JSON.parse(data.list);
        console.log('服务类型',this.serviceType)
        console.log('list',this.detailList)

    },
}
</script>

<style lang="less" scoped>
.list {
    
    background: rgba(243, 245, 247, 1);
    display: flex;
    flex-direction: column;
    height: 100vh;

    .content {

        flex: 1;
        box-sizing: border-box;
        overflow-y: auto;

        .content_list {

            .list_item {
                background: rgba(255, 255, 255, 1);
                box-shadow: 0 12upx 18upx rgba(0, 0, 0, 0.04);
                border-radius: 20upx;
                padding: 28upx 40upx 40upx 20upx;
                margin: 20rpx 20upx 20upx;
                display: flex;
                align-items: center;

                .item_info {
                    .info_top {
                        display: flex;
                        align-items: center;
                        margin-bottom: 32upx;
                        .title {
                            font-size: 32upx;
                            font-weight: bold;
                            color: rgba(42, 42, 42, 1);
                            margin-right: 16upx;
                        }
                        .time {
                            font-size: 28upx;
                            font-weight: 400;
                            color:rgba(175, 185, 196, 1);
                        }
                    }
                    .info_bottom {
                        display: flex;
                        .type {
                            font-size: 28upx;
                            font-weight: 400;
                            color: rgba(51, 51, 51, 1);
                            margin-right: 12upx;
                        }
                        .phone {
                            font-size: 28upx;
                            font-weight: bold;
                            color: rgba(51, 51, 51, 1);
                        }
                    }
                }
                .edit_btn {
    
                    width: 80upx;
                    height: 80upx;
                    margin-left: auto;
                    border-radius: 50%;
                    background:rgba(0, 112, 226, 0.08);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    image {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                    }

                }
            }

        }
    }
}
</style>