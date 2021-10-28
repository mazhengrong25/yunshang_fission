<!--
 * @Description: 账号登陆 --- 新增账号
 * @Author: mzr
 * @Date: 2021-10-20 15:55:17
 * @LastEditTime: 2021-10-28 11:01:28
 * @LastEditors: wish.WuJunLong
-->
<template>
  <view class="addAccount">
    <yun-header :statusHeight="iStatusBarHeight" centerTitle="新增账号"></yun-header>
     <view class="contact_item_list">
        <view class="contact_item">
          <view class="item_title">12306账号</view>
          <view class="list_input">
            <input
              placeholder="12306用户名/手机号/邮箱"
              type="text"
              v-model="accountPassenger.name"
              placeholder-style="fontSize: 28upx;fontWeight:400;color: #AFB9C4;text-align:right"
            />
          </view>
        </view>
        <view class="contact_item">
          <view class="item_title">密码</view>
          <view class="list_input">
            <input
              placeholder="12306密码"
              placeholder-style="fontSize: 28upx;fontWeight:400;color: #AFB9C4;text-align:right"
              type="text"
              password="true"
              v-model="accountPassenger.psw"
            />
          </view>
        </view>
      </view>
      <!-- 错误提示 -->
      <view class="error_point" v-if="errorHint">
        <view class="error_icon"></view>
        <view class="error_text">{{errorHint}}</view>
      </view>
      <view class="content_action">
        <button class="action_button" @click="addAccount()">确认</button>
        <!-- <view class="action_text" @click="goRegister">注册12306账号</view> -->
      </view>
      <!-- 账号验证 -->
      <accountVerify
        ref="trainAccountVerify"
        :phone="accountPassenger.name"
        :accountMessageCode="accountMessageCode"
        @changeCode="changeCode"
        @openVerify="openVerify"
      ></accountVerify>
  </view>
</template>

<script>
import train from "@/api/trainInquiry.js"
import accountVerify from '../components/account_verify.vue'
export default {
  components: { accountVerify },
  data() {
    return {
      iStatusBarHeight: 0, // 状态栏高度
      // 账号信息
      accountPassenger:{
        name:"", //账号
        psw:"", //密码
      },

      errorHint:"", // 错误信息
      accountMessageCode:"", // 验证码
    }
  },
  methods:{
    // 新增账号
    addAccount() {
      let data = {
        account: {
          name:this.accountPassenger.name,
          psw:this.accountPassenger.psw
        }
      }
      train.getAddAccount(data).then((res) => {
        if(res.errorcode === 10000) {
          uni.showToast({
            title:res.msg,
            icon:'success'	
          })
          uni.navigateBack()
        }else {
          this.errorHint = res.msg
          if(this.errorHint.indexOf('12306') != -1) {

              this.$refs.trainAccountVerify.openExp();
          }
        }
      })
    },
    // 跳转到注册12306账号
    goRegister() {
      let url = "https://kyfw.12306.cn/otn/regist/init"
      uni.navigateTo({
        url:"/flightReservation/webView?url=" + url
      })
    },
    // 短信验证码输入值
    changeCode(val) {
      this.accountMessageCode = val
    },
    // 验证验证码
    openVerify() {
      if(this.accountMessageCode === "") {
        return false
      }else {

        let data = {
          account: {
            name:this.accountPassenger.name,
            psw:this.accountPassenger.psw,
            code:this.accountMessageCode,
            type:"2"
          }
        }
        train.getMessVerify(data).then((res) => {
          if(res.errorcode === 10000) {
            uni.showToast({
              title:res.msg,
              icon:'none',
              duration:3000,
            })
            this.$refs.trainAccountVerify.closeExp();
            this.addAccount();
          }else {
            uni.showModal({
              title: res.msg,
              icon: "none",
              duration: 3000,
            })
          }
        })
      }
    }
  },
  onLoad(data) {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;

  }
}
</script>

<style lang="less" scoped>
.addAccount {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: rgba(243, 245, 247, 1);
  .contact_item_list {
    display: flex;
    flex-direction: column;
    background: #FFFFFF;
    box-shadow: 0upx 12upx 18upx rgba(0, 0, 0, 0.04);
    border-radius: 20upx;
    margin: 20upx;
    .contact_item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 28upx;
      color: #2a2a2a;
      padding: 44upx 0upx;
      margin: 0upx 20upx;
      .item_title {
        font-weight: bold;
      }
      .list_input {
        text-align: right;
        flex:1;
      }
      &:not(:last-child) {
        border-bottom: 1upx solid #f1f3f5;
      }
    }
  }
  .error_point {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-right: 28upx;
    .error_icon {
      width: 24upx;
      height: 24upx;
      background: url(@/static/verify_error.png) no-repeat center center;
      background-size: contain;
      margin-right: 12upx;
    }
    .error_text {
      font-size: 24upx;
      font-weight: 400;
      color: #FF0000;
    }
  }
  .content_action {
    .action_button {
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
      margin: 140upx 50upx 40upx;
    }
    .action_text {
      font-size: 26upx;
      font-weight: 400;
      color: #0070E2;
      text-align: center;
    }
  }
}
</style>