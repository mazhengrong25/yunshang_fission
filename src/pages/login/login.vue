<!--
 * @Description: 登录页
 * @Author: wish.WuJunLong
 * @Date: 2020-07-23 14:41:20
 * @LastEditTime: 2021-02-24 18:22:56
 * @LastEditors: wish.WuJunLong
-->
<template>
  <view class="login">
    <yun-header
      :showReturn="false"
      :statusHeight="iStatusBarHeight"
      centerTitle="云上航空"
    ></yun-header>
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
            <image
              class="form_title_icon"
              src="@/static/login_username.png"
              mode="contain"
            />
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
            <image
              class="form_title_icon"
              src="@/static/login_password.png"
              mode="contain"
            />
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
      <view class="scan_submit" @click="scanCodeBtn">
        <image class="scan_icon" src="@/static/scan_code_btn.png" mode="contain" />

        扫码登录</view
      >
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
    // 登录按钮
    loginBtn() {
      console.log("点击登录");
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
              // account: this.userName,
              // password: this.password,
              token: res.data.access_token,
              loginTime: new Date(new Date().getTime() + 3600 * 1000),
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

    // 扫码登录
    scanCodeBtn() {
      uni.scanCode({
        onlyFromCamera: false,
        success: (res) => {
          wx.showLoading({
            title: "加载中",
          });

          console.log(res);
          let data = {
            access_token: res.result,
          };
          login.scanCodeLogin(data).then((res) => {
            console.log(res);
            if (res.errorcode === 10000) {
              wx.hideLoading();
              wx.showToast({
                title: "登录成功",
                icon: "succes",
                mask: true,
              });

              let loginInfo = {
                // account: this.userName,
                // password: this.password,
                token: res.data.access_token,
                loginTime: new Date(new Date().getTime() + 3600 * 1000),
              };

              uni.setStorageSync("loginInfo", loginInfo);

              setTimeout(() => {
                uni.switchTab({
                  url: "/pages/index/index",
                });
              }, 500);
            } else {
              wx.showToast({
                title: "二维码已过期，请重新扫码",
                icon: "none",
                duration: 2000,
                mask: true,
              });
            }
          });
        },
      });
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
  display: flex;
  flex-direction: column;
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
    padding: 36upx 30upx 10upx 45upx;
    overflow: auto;
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
      margin-bottom: 60upx;
      text {
        display: block;
        &:first-child {
          margin-bottom: 12upx;
        }
        &:last-child {
          font-size: 44upx;
        }
      }
    }
    .login_form {
      margin-bottom: 4vh;
      .form_list {
        padding-bottom: 28upx;
        border-bottom: 2upx solid rgba(241, 243, 245, 1);
        &:not(:last-child) {
          margin-bottom: 50upx;
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
    .scan_submit {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 90upx;
      border: 1px solid #afb9c4;
      border-radius: 80upx;
      margin-top: 20upx;
      text-align: center;
      margin-top: 32upx;
      font-size: 32upx;
      font-weight: 400;
      color: #333333;
      .scan_icon {
        width: 30upx;
        height: 30upx;
        object-fit: contain;
        margin-right: 18upx;
      }
    }
  }
}
</style>
