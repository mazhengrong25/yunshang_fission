<!--
 * @Description: 火车票 --- 核验
 * @Author: mzr
 * @Date: 2021-09-09 11:42:30
 * @LastEditTime: 2021-09-14 14:58:00
 * @LastEditors: mzr
-->
<template>
  <view class="verify_content">
    <yun-header :statusHeight="iStatusBarHeight" centerTitle="选择乘车人"></yun-header>
    <view class="verify_background">
      <view class="content_title">乘车人联系方式待核验</view>
      <view class="content_tip">铁路局规定，乘车人手机号核验通过后才可购票</view>
      <view class="verify_background_sign"></view>
      <view class="item_box" v-if="!verifyStatus">
          <view class="box_title">请按照以下方式进行手机核验</view>
          <view class="box_content">
            <view class="box_content_title">
              请通知<view class="content_title_sign">【{{passengerData.passengerName}}】</view>，
              <view class="box_content_title box_inline" v-if="offlineStatus">
                携带有效的身份证件前往各个铁路车站进行线下人工核验
              </view>
              <view class="box_content_title box_inline" v-else>
                使用手机号<view class="content_title_sign">{{passengerData.phone}}</view>在30分钟内短信发送以下核验码到12306
              </view>

            </view>
            <view v-if="!offlineStatus">
              <view class="box_content_title verify_name">核验码：</view>
              <view class="verify_item">
                <view class="item_value">{{seconds === null ? '核验码获取中' : seconds > 0 ? verifyCode: '核验码已过期'}}</view>
                <view class="item_button" @click="refreshCode()">刷新验证码</view>
              </view>
            </view>
          </view>
      </view>
      <view class="item_box">
        <view class="box_title">核验状态</view>
        <view class="item_status">
          <view :class="['item_icon',{success:verifyStatus}]"></view>
          <view :style="{color:verifyStatus?'#5AB957':''}">{{verifyStatus?'核验成功':`${statusText}`}}</view>
        </view>
      </view>
      <!-- 按钮 -->
      <view class="bottom_time" v-if="seconds !== null || verifyStatus"><view class="bottom_time_sign">{{seconds || 0}}s</view>后验证码失效</view>
      <view class="verify_bottom">
        <button class="verify_button" @click="goBack()" v-if="verifyStatus || offlineStatus">确认</button>
        <button class="verify_button" @click="statusRefresh()" v-else>已发送核验码，刷新结果</button>
      </view>
    </view>
  </view>
</template>
 
<script>
import passenger from "@/api/passenger.js"
export default {
  data() {
    return {
      iStatusBarHeight:0,
      passengerData:{}, // 乘客信息

      seconds: null, // 时间
      statusText:"", // 核验状态
      verifyCode:"", // 验证码

      verifyStatus:false, // 核验刷新状态
      offlineStatus:false, // 线下核验
    }
  },
  methods: {
    // 乘客核验
   getVerify() {
     
     let data = {
        channel:"Di",                //类型：String  必有字段  备注：渠道
        source:"YunKu",                //类型：String  必有字段  备注：来源
        passenger:  [                //类型：Array  必有字段  备注：无
            {                //类型：Object  必有字段  备注：无
              name:this.passengerData.passengerName,                //类型：String  必有字段  备注：姓名
              card_no:this.passengerData.cert_no,                //类型：String  必有字段  备注：证件号
              card_type:1,                //类型：String  必有字段  备注：证件类型
              card_name:"中国居民身份证",                //类型：String  必有字段  备注：证件名字
              phone:this.passengerData.phone,                //类型：String  必有字段  备注：无
              ticket_type:1               //类型：String  必有字段  备注：票类型
            }
        ]
     }
     passenger.verifyPassenger(data).then((res) => {
       if(res.errorcode === 10001) {

          this.statusText = res.data.status
          this.verifyCode = res.data.captcha

          // 证件格式出错
          if(JSON.stringify(res.data) === '[]'){
            uni.showToast({
              icon: 'none',
              title: res.msg,
              duration:3000,
            })
            return setTimeout(()=>{uni.navigateBack()},2500)
            
          }
          // 线下核验
          if(res.data.status === "待核验" && res.data.status_code === 0) {
            this.offlineStatus = true
          }else {
            this.seconds = 60
            let timer = setInterval(() => {
              this.seconds--
              if(this.seconds < 1){
                clearInterval(timer)
              }
            },1000)
          }
       }else {
         this.verifyStatus = true
       }
       
     })
   },

  //  刷新验证码
  refreshCode() {
    this.seconds = null
    this.getVerify();
  },

  // 状态刷新
  statusRefresh(val)  {
    console.log(val)
    let data = {
      channel:"Di",                //类型：String  必有字段  备注：渠道
      source:"YunKu",                //类型：String  必有字段  备注：来源
      passenger:  [                //类型：Array  必有字段  备注：无
          {                //类型：Object  必有字段  备注：无
            name:this.passengerData.passengerName,                //类型：String  必有字段  备注：姓名
            card_no:this.passengerData.cert_no,                //类型：String  必有字段  备注：证件号
            phone:this.passengerData.phone,                //类型：String  必有字段  备注：无
          }
      ]
    }
    passenger.verifyRefresh(data).then((res) => {
      if(res.errorcode === 10000) {
        this.verifyStatus = true
      }else {
        uni.showToast({
          title:res.msg,
          icon:"none",
          duration:3000,
        })
      }
    })
  },

  // 点击确认  返回到乘车人列表
  goBack() {
    uni.navigateBack({
      delta:1,
    })
  }

  },
  onLoad(data){
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.passengerData = JSON.parse(data.passengerData)
    this.getVerify();
  }
};
</script>

<style lang="less" scoped>
.verify_content {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: RGBA(243, 245, 247, 1);
    .verify_background {
      height: 45%;
      background: linear-gradient(180deg, #0070E2 0%, rgba(0, 112, 226, 0) 100%);
      display: flex;
      flex-direction: column;
      padding: 30upx 20upx;
      .content_title {
        font-size: 36upx;
        font-weight: bold;
        color: #FFFFFF;
      }
      .content_tip {
        font-size: 24upx;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.8);
        margin: 14upx 0upx 40upx;
      }
      .verify_background_sign {
        width: 252upx;
        height: 252upx;
        background: url("/static/verify_background.png") no-repeat center center;
        background-size: contain;
        position: absolute;
        top: 136upx;
        right: 8upx;
      }
      .item_box {
        background: #FFFFFF;
        box-shadow: 0upx 12upx 18upx rgba(0, 0, 0, 0.04);
        border-radius: 20upx;
        padding: 38upx 30upx;
        position: relative;
        margin-bottom: 36upx;
        .box_title {
          font-size: 32upx;
          font-weight: bold;
          color: #2A2A2A;
        }
        .box_content {
          background: linear-gradient(180deg, rgba(0, 112, 226, 0.1) 0%, rgba(0, 112, 226, 0) 100%);
          box-shadow: 0upx 12upx 18upx rgba(0, 0, 0, 0.04);
          border-radius: 20upx;
          margin-top: 38upx;
          padding: 44upx 30upx;
          .box_content_title {
            font-size: 28upx;
            font-weight: 400;
            color: #2A2A2A;
            line-height: 50upx;
            .content_title_sign {
              display: inline-block;
              font-weight: bold;
            }
            &.verify_name {
              color: #333333;
              margin: 37upx 0upx 18upx;
            }
            &.box_inline {
              display: inline;
            }
          }
          .verify_item {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            .item_value {
              min-width: 160upx;
              padding: 0 20upx;
              height: 60upx;
              background: #FFFFFF;
              box-shadow: 0upx 0upx 20upx rgba(217, 225, 234, 0.3);
              border-radius: 10upx;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-size: 32upx;
              font-weight: bold;
              color: #FB9826;
            }
            .item_button {
              font-size: 28upx;
              font-weight: 400;
              color: #0070E2;
              margin-left: 40upx;
              letter-spacing: 4upx;
            }
          }
        }
        .item_status {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          font-size: 28upx;
          font-weight: 400;
          color: #FF0000;
          letter-spacing: 4upx;
          margin-top: 30upx;
          .item_icon {
            width: 28upx;
            height: 28upx;
            background: url('@/static/verify_error.png') no-repeat center center;
            background-size: contain;
            margin-right: 10upx;
            &.success {
              background: url('@/static/verify_success.png') no-repeat center center;
              background-size: contain;
            }
          }
         
        }
      }
      .bottom_time {
        font-size: 24upx;
        font-weight: 400;
        color: #2A2A2A;
        text-align: center;
        margin-bottom:30upx;
        .bottom_time_sign {
          display: inline-block;
          color: #0070E2;
          margin-right: 10upx;
        }
      }
      .verify_bottom {
        .verify_button {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 90upx;
          margin: 0upx 30upx;
          background: linear-gradient(90deg, #0070E2 0%, #56C5FF 100%);
          box-shadow: 0upx 6upx 12upx rgba(0, 112, 226, 0.3);
          border-radius: 80upx;
          font-size: 32upx;
          font-weight: 400;
          color: #FFFFFF;
          letter-spacing: 4upx;
        }
      }
    }
}
</style>