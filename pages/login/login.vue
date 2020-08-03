<!--
 * @Description: 登录页
 * @Author: wish.WuJunLong
 * @Date: 2020-07-23 14:41:20
 * @LastEditTime: 2020-08-03 15:52:57
 * @LastEditors: wish.WuJunLong
--> 
<template>
  <view class="login">
    <yun-header :showReturn="false" :statusHeight="iStatusBarHeight" centerTitle="云上航空"></yun-header>
    <view class="login_banner">
      <view class="banner">
        <image class="banner_img" src="@/static/login_banner.png" mode="contain" />
      </view>
    </view>
    <view class="login_main">
      <image class="ligin_icon" src="@/static/login_icon.png" mode="contain" />
      <view class="login_message">
        <text>欢迎登录!</text>
        <text>云上机票分销平台</text>
      </view>
      <view class="login_form">
        <view class="form_list">
          <view class="form_title">
            <image class="form_title_icon" src="@/static/login_username.png" mode="contain" />
            <text>用户名</text>
          </view>
          <input
            class="form_input"
            type="text"
            placeholder="请输入用户名"
            v-model="userName"
            placeholder-class="input_placeholder"
          />
        </view>
        <view class="form_list">
          <view class="form_title">
            <image class="form_title_icon" src="@/static/login_password.png" mode="contain" />
            <text>密码</text>
          </view>
          <input
            class="form_input"
            type="password"
            placeholder="请输入密码"
            v-model="password"
            placeholder-class="input_placeholder"
          />
        </view>
      </view>
      <view class="login_submit" @click="loginBtn">登录</view>
    </view>
  </view>
</template>

<script>
import login from "@/api/login.js";
export default {
  data() {
    return {
      iStatusBarHeight: 0, // 状态栏高度
      userName: "",
      password: "",
    };
  },
  methods: {
    loginBtn() {
      console.log('点击登录')
      if (this.userName && this.password) {
        let data = {
          login_name: this.userName,
          password: this.password,
        };
        login.pwdLogin(data).then((res) => {
          console.log(res);
          if (res.errorcode === 10000) {
            wx.showToast({
              title: "登录成功",
              icon: "succes",
              mask: true,
            });

            let loginInfo = {
              account: this.userName,
              password: this.password,
              token: res.data.access_token,
              loginTime: new Date(
                new Date().getTime() + (res.data.expires_in * 1000)
              ),
            };

            uni.setStorageSync("loginInfo", loginInfo);

            setTimeout(() => {
              uni.switchTab({
                url: "/pages/index/index",
              });
            }, 500);
          } else {
            wx.showToast({
              title: res.msg,
              icon: "none",
              duration: 2000,
              mask: true,
            });
          }
        });
      } else {
        wx.showToast({
          title: "请填写完整登录信息",
          icon: "none",
          mask: true,
        });
      }
    },
  },
  onLoad() {
    let that = this;
    uni.getStorageSync({
      key: "loginInfo",
      success(e) {
        if (e.data) {
          (that.userName = e.data.account), (that.password = e.data.password);
        }
      },
    });
    that.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
  },
};
</script>

<style lang="less" scoped>
.login {
  overflow: hidden;
  height: 100vh;
  .login_banner {
    position: relative;
    height: 280upx;
    width: 100vw;

    .banner {
      position: absolute;
      z-index: -1;
      top: 0;
      left: 0;
      height: 460upx;
      width: 100%;
      box-shadow: 10upx 0 0 rgba(0, 112, 226, 1);
      background: linear-gradient(
        180deg,
        rgba(0, 112, 226, 1) 0%,
        rgba(255, 255, 255, 1) 100%
      );
      .banner_img {
        width: 100%;
        height: 324upx;
        object-fit: contain;
      }
    }
  }
  .login_main {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 20upx;
    margin: 0 20upx;
    padding: 36upx 30upx 0 45upx;
    .ligin_icon {
      width: 187upx;
      height: 73upx;
      margin-left: auto;
      display: block;
    }
    .login_message {
      font-size: 48upx;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      margin-bottom: 95upx;
      text {
        display: block;
        &:first-child {
          margin-bottom: 28upx;
        }
        &:last-child {
          font-size: 44upx;
        }
      }
    }
    .login_form {
      margin-bottom: 6vh;
      .form_list {
        padding-bottom: 28upx;
        border-bottom: 2upx solid rgba(241, 243, 245, 1);
        &:not(:last-child) {
          margin-bottom: 60upx;
        }
        .form_title {
          font-size: 30upx;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
          margin-bottom: 24upx;
          display: flex;
          align-items: center;
          .form_title_icon {
            width: 32upx;
            height: 32upx;
            margin-right: 16upx;
          }
        }
        .form_input {
          font-size: 34upx;
          font-weight: 400;
          &::placeholder {
            color: rgba(175, 185, 196, 1);
          }
        }
      }
    }
    .login_submit {
      height: 45px;
      background: linear-gradient(
        90deg,
        rgba(0, 112, 226, 1) 0%,
        rgba(86, 197, 255, 1) 100%
      );
      box-shadow: 0 6upx 12upx rgba(0, 112, 226, 0.3);
      border-radius: 80upx;
      font-size: 32upx;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      letter-spacing: 8upx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
