<!--
 * @Author: mzr
 * @Date: 2020-11-04 11:42:48
 * @LastEditTime: 2020-12-07 11:38:37
 * @LastEditors: wish.WuJunLong
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
                    <radio-group class="bottom_radio_list" @change="radioChange">
                        <label
                        class="radio"
                        v-for="(item, index) in radioItems"
                        :key="index"
                        >
                        <radio :color="'#0070E2'" :value="item.key" :checked="item.checked"></radio>
                        <text>{{ item.value }}</text>
                        </label>
                    </radio-group>
                </view>
            </view>
            <view class="message_item" @click="openPasssengerDialog" v-if="radioValue === '2'">
                <view class="message_title">乘机人</view>
                <view class="message_action input-right-arrow">{{passenger}}</view>
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
                    :maxlength="500"
                    placeholder-style="color:#DFDFDF" style="padding:10px"
                    @input="getContent" 
                    v-model="content" placeholder="请填写发送内容"/>
                    <view class="message_count">
                        <p>{{content.length}}</p>/500
                    </view>
                </view>
            </view>
            
            <button class="message_btn" @click="getSend()">立即发送</button>

            <!-- 选择乘机人 -->
            <flight-filter-dialog ref="passengerDialog" 
            @ticketFilterData="submitpasseengerBtn"
            :flightType="false" 
            :checkboxGroup="messageData.passenger_phone"
            keyTitle="PassengerName"
            ></flight-filter-dialog>

            <!-- 选择模板 -->
            <flight-filter-dialog ref="filterDialog" 
            @ticketFilterData="submitTemplateBtn"
            :flightType="false" 
            :checkboxGroup="typeGroup"
            keyTitle="model_name"
            ></flight-filter-dialog>
            
            <!-- 短信发送成功 -->
            <uni-popup ref="sendMessage" type="dialog">
                <view class="message_box">
                    <view class="message_icon" v-if="message_true">
                        <img src="@/static/message_right.png" />
                    </view>
                    <view class="message_icon" v-if="!message_true">
                        <img src="@/static/message_error.png" />
                    </view>
                    <view class="message_send">{{message_msg}}</view>
                    <view class="message_bottom" @click="backPage">知道了</view>
                </view>
            </uni-popup>
        </view>
    </view>
</template>

<script>
import orderApi from "@/api/order.js";
import moment from "moment";
import flightFilterDialog from "@/components/flight_filter_dialog.vue"; // 选择模板弹窗

moment.locale("zh-cn");
export default {
  components: {
    flightFilterDialog,
  },

  data() {
    return {
      iStatusBarHeight: 0,
      /* 单选框*/
      radioItems: [
        {
          value: "联系人",
          checked: true,
          key: 1,
        },
        {
          value: "乘机人",
          key: 2,
        },
      ],

      messageData : {}, // 发送短信数据

      passenger: '', // 乘机人名称

      radioValue: "", //单选选择值

      //  选择模块选择
      typeGroup: [],
      select: "", //模块选择

      content: "", // 输入内容

      phone: "", //手机号

      isTimer: "", // 发送类型

      send_timer: "", // 发送时间

      select_id: "", // 选择模板id

      message_true: false, // 提交状态
      message_msg: "", // 错误信息
    };
  },
  methods: {
    // 获取字符个数
    getContent() {
      console.log(this.content.length);
    },
    // 单选点击
    radioChange(e) {
      console.log(e.detail.value);
      this.radioValue = e.detail.value;
      if(e.detail.value === '2'){
          this.phone = ''
      }else {
        this.phone = this.messageData.ticketOrder.phone
      }
    },

    //  打开弹窗
    openTemplateDialog() {
      this.$refs.filterDialog.openFilterDialog();
    },

    // 关闭弹出框
    closeTemplateDialog() {
      this.$refs.filterDialog.closeFilterDialog();
    },


    // 打开乘机人选择框
    openPasssengerDialog(){
      this.$refs.passengerDialog.openFilterDialog();
    },
    // 选中乘机人
    submitpasseengerBtn(val){
      console.log(val)
      this.passenger = val.PassengerName
      this.phone = val.phone;
    },

    // 确认选择模块
    submitTemplateBtn(val) {
      console.log(val);
      this.select = val.model_name;
      this.content = val.msg;
      this.select_id = val.id;
    },

    // 获取选择模板
    getTemplateList() {
      orderApi.sendMessageSelect(this.order_no).then((res) => {
        console.log(res);
        this.messageData = res
        this.radioValue = res.user_type;
        this.phone = res.ticketOrder.phone;
        this.isTimer = res.is_timer;
        this.typeGroup = res.modelList;
      });
    },

    // 打开短信发送成功
    open() {
      this.$refs.sendMessage.open();
    },
    close() {
      this.$refs.sendMessage.close();
    },

    backPage() {
      this.$refs.sendMessage.close();
      if(this.message_true){
        uni.navigateBack();
      }
    },

    // 发送短信
    getSend() {
      if (!this.content || !this.select_id) {
        return uni.showToast({
          title: "请输入完整信息",
          icon: "none",
        });
      }
      let url = this.order_no;
      let data = {
        user_type: this.radioValue,
        phone: this.phone,
        is_timer: this.isTimer,
        send_timer: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        msg_model_id: this.select_id,
        msg_content: this.content,
      };
      console.log(data);
      orderApi.sendMessage(data, url).then((res) => {
        this.message_true = res.errorcode === 10000;
        this.message_msg = res.msg;
        this.open();
      });
    },
  },

  onLoad(data) {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    console.log("发送短信", data);
    this.order_no = data.orderId;
    console.log('订单号',this.order_no)
    console.log(this.order_no);

    this.getTemplateList();
  },
};
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
        flex: 1;
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
        height: 200px;
        padding-bottom: 40rpx;
        background: #f9f9f9;
        border: 1px solid #eaeaea;
        opacity: 1;
        border-radius: 10px;
        margin-top: 10px;
        position: relative;
        textarea {
          padding: 10px 10px 30px;
          width: 100% !important;
          height: 100% !important;
          box-sizing: border-box;
        }
      }
      .message_count {
        display: flex;
        justify-content: flex-end;
        font-size: 12px;
        font-weight: 400;
        color: #333333;
        padding: 10px 10px;
        position: absolute;
        width: 100%;
        bottom: 0;
        box-sizing: border-box;

        p {
          font-size: 12px;
          color: #dfdfdf;
        }
      }
    }
    .message_btn {
      display: flex;
      justify-content: center;
      width: 325px;
      height: 45px;
      background: linear-gradient(90deg, #0070e2 0%, #56c5ff 100%);
      box-shadow: 0px 3px 6px rgba(0, 112, 226, 0.3);
      opacity: 1;
      border-radius: 40px;
      color: #ffffff;
      font-weight: 400;
      font-size: 16px;
      letter-spacing: 4px;
    }
  }
}

.message_box {
  width: 540upx;
  background: #ffffff;
  border-radius: 20upx;
  display: flex;
  flex-direction: column;
  padding-top: 40upx;
  .message_icon {
    width: 90upx;
    height: 90upx;
    margin: 0 auto;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .message_send {
    margin-top: 22upx;
    text-align: center;
    font-size: 24upx;
    font-weight: 400;
    color: #0070e2;
    padding: 0 60rpx;
  }
  .message_bottom {
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