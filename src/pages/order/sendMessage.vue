<!--
 * @Author: mzr
 * @Date: 2020-11-04 11:42:48
 * @LastEditTime: 2020-11-04 18:42:49
 * @LastEditors: Please set LastEditors
 * @Description: 发送短信
 * @FilePath: \positiond:\tests\fission\yunshang_fission\src\pages\order\sendMessage.vue
-->

<template>
    <view class="message">
        <yun-header :statusHeight="iStatusBarHeight"  :headerColor="true" centerTitle="发送短信"></yun-header>
        <view class="message_content">
            <view class="message_item">
                <view class="message_title">发送对象</view>
                <view class="message_action">
                    <radio-group class="bottom_radio_list" @click="radioChange(item)">
                        <label
                        class="radio"
                        v-for="(item, index) in radioItems"
                        :key="index"
                        >
                        <radio :color="'#0070E2'" :checked="item.checked"></radio>
                        <text>{{ item.value }}</text>
                        </label>
                    </radio-group>
                </view>
            </view>
            <view class="message_item">
                <view class="message_title">手机号</view>
                <view class="message_action">
                    <input type="number" v-model="phone"/>
                </view>
            </view>
            <view class="message_item" @click="openTemplateDialog">
                <view class="message_title">选择模板</view>
                <view class="message_action input-right-arrow">{{select}}</view>
            </view>
            <view class="content_item">
                <view class="message_title">发送内容</view>
                <view class="message_action">
                    <textarea 
                    placeholder-style="color:#DFDFDF" style="padding:10px"
                    @input="getContent" 
                    v-model="content" placeholder="请填写发送内容"/>
                    <view class="message_count">
                        <p>{{content.length}}</p>/100
                    </view>
                </view>
            </view>
            
            <button class="message_btn" @click="open" @click.stop="getSend()">立即发送</button>

            <!-- 选择模板 -->
            <flight-filter-dialog ref="filterDialog" 
            @ticketFilterData="submitTemplateBtn"
            :flightType="false" 
            :checkboxGroup="typeGroup"
            ></flight-filter-dialog>
            
            <!-- 短信发送成功 -->
            <uni-popup ref="popup" type="dialog">
                <view class="message_box">
                    <view class="message_icon"><img src="@/static/message_right.png"></img></view>
                    <view class="message_send">短信已成功发送</view>
                    <view class="message_bottom" @click="close">知道了</view>
                </view>
            </uni-popup>
        </view>
    </view>
</template>

<script>
import orderApi from "@/api/order.js";
import flightFilterDialog from "@/components/flight_filter_dialog.vue"; // 选择模板弹窗
export default {
    components: {

        flightFilterDialog,
    },

    data() {
        
        return{
            iStatusBarHeight: 0,
            /* 单选框*/
            radioItems: [
                {
                    value: "联系人",
                    checked: "true",
                },
                {
                    value: "乘机人",
                },
            ],

            //  选择模块选择
            typeGroup: [
               
                "预定成功模板",
                "支付成功待出票模板",
                "已出票模板",
                "已出票模板",
            ],
            select:'', //模块选择

            content: '', // 输入内容

            phone: '', //手机号

       
        }
    },
    methods: {

        // 获取字符个数
        getContent(){
            console.log(this.content.length)
        },
        // 单选点击
        radioChange(e) {
            
            this.radioItems[checked] = e
            console.log(e)
        },

        //  打开弹窗
        openTemplateDialog() {
            this.$refs.filterDialog.openFilterDialog();
        },
      
        // 关闭弹出框
        closeTemplateDialog() {
            this.$refs.filterDialog.closeFilterDialog();
        },

        // 确认选择模块
        submitTemplateBtn(val) {
            console.log(val)
            this.select = val;
        },

        // 打开短信发送成功
        open() {
             this.$refs.popup.open()
        },
        close() {
             this.$refs.popup.close()
        },


        // 发送短信
        getSend() {
            let data = {

            }
            // orderApi.sendMessage(data).then((res) => {

            // })
        }

    },

    onLoad(data) {
        this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
        console.log(data)
    }
    
}
</script>

<style lang="less" scoped>
.message {
    display: flex;
    height: 100vh;
    background: rgba(243, 245, 247, 1);
    flex-direction: column; 
    .message_content {
       
        height: 100%;
        background-color: rgba(255, 255, 255, 1);
        padding-top: 40px;
        .message_item {
            display: flex;
            margin: 30px 10px;
            align-items: center;
            // justify-content: space-around;
            .message_title {
            
                font-size: 14px;
                font-weight: 400;
                line-height: 17px;
                color: #999999;
                width: 132upx;
                margin-right: 30px;
            }
            .message_action {

               
                font-size: 14px;
                font-weight: 400;
                line-height: 17px;
                color: #333333;
                flex:1;       
                .bottom_radio_list {
                    flex: 1;
                    display: flex;
                    justify-content: flex-start;
                    .radio:first-child {
                        margin-right: 30upx;
                    }
                }
            }
        }
        .content_item {
            // display: flex;
            margin: 30px 10px;
            // flex-direction: ;
            .message_title {
            
                font-size: 14px;
                font-weight: 400;
                line-height: 17px;
                color: #999999;
                width: 132upx;
                margin-right: 30px;
            }
            .message_action {
                width: 355px;
                height: 230px;
                background: #F9F9F9;
                border: 1px solid #EAEAEA;
                opacity: 1;
                border-radius: 10px;
                margin-top: 10px;
            }
            .message_count {
                display: flex;
                justify-content: flex-end;  
                font-size: 12px;           
                font-weight: 400;
                color: #333333;
                padding: 10px 10px;
               
                p {
                    
                    font-size: 12px;
                    color: #DFDFDF;
                }
            }
        }
        .message_btn {
            display: flex;
            justify-content: center;
            width: 325px;
            height: 45px;
            background: linear-gradient(90deg, #0070E2 0%, #56C5FF 100%);
            box-shadow: 0px 3px 6px rgba(0, 112, 226, 0.3);
            opacity: 1;
            border-radius: 40px;
            color: #FFFFFF;
            font-weight: 400;
            font-size: 16px;
            letter-spacing: 4px;
        }
    
    }

}

.message_box {
    width: 540upx;
    background: #FFFFFF;
    border-radius: 20upx;
    display: flex;
    flex-direction: column;
    padding-top: 40upx;
    .message_icon {
        width: 90upx;
        height: 90upx;
        margin: 0 auto;
        img{
            width:100%;
            height:100%;
            object-fit: contain;
        }
    }
    .message_send {
        margin-top: 22upx;
        text-align: center;
        font-size: 24upx;
        font-weight: 400;
        color: #0070E2;
    }
    .message_bottom {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 90upx;
        border-top: 2upx solid #EAEAEA;
        margin-top: 40upx;
font-size: 28upx;
font-weight: 400;
color: #333333;
    }
    
}
</style>