<!--
 * @Description: 修改密码
 * @Author: wish.WuJunLong
 * @Date: 2020-08-03 16:10:38
 * @LastEditTime: 2020-08-03 18:48:44
 * @LastEditors: wish.WuJunLong
--> 
<template>
  <view class="edit_password">
    <yun-header :statusHeight="iStatusBarHeight" :headerColor="true" centerTitle="修改密码"></yun-header>
    <view class="main">
      <view class="main_list">
        <view class="list_title">旧密码</view>

        <view class="list_input">
          <input type="text" placeholder="请输入旧密码" v-model="oldPassword" />
        </view>
      </view>

      <view class="main_list">
        <view class="list_title">新密码</view>

        <view class="list_input">
          <input type="text" placeholder="请输入新密码" v-model="newPassword" />
        </view>
      </view>

      <view class="main_list">
        <view class="list_title">确认密码</view>

        <view class="list_input">
          <input type="text" placeholder="请再次输入新密码" v-model="confirmPassword" />
        </view>
      </view>
      <view class="message">密码必须至少6个字符</view>
      <view class="submit_btn" @click="submitBtn()">确认</view>
    </view>

    <uni-popup
      ref="editPasswordDialog"
      :maskClick="false"
      type="bottom"
      class="edit_password_dialog"
    >
      <view class="dialog_main">
        <view class="main_title">修改成功</view>
        <view class="mian_icon">
          <image src="@/static/edit_password.png" mode="contain" />
        </view>
        <view class="message">密码修改成功，完成后将重新登录</view>
        <view class="jump_login_btn" @click="jumpLogin()">完成</view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import userInfo from "@/api/getUserInfo.js";
export default {
  data() {
    return {
      iStatusBarHeight: 0,
      oldPassword: "", // 旧密码
      newPassword: "", // 新密码
      confirmPassword: "", // 确认新密码
    };
  },
  methods: {
    // 提交修改密码
    submitBtn() {
      if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
        return wx.showToast({
          title: "请填写密码",
          icon: "none",
          mask: true,
        });
      }
      if (
        this.oldPassword.length < 6 ||
        this.newPassword.length < 6 ||
        this.confirmPassword.length < 6
      ) {
        return wx.showToast({
          title: "密码长度不足六位，请检查密码格式",
          icon: "none",
          mask: true,
        });
      }
      if (this.oldPassword !== uni.getStorageSync("loginInfo").password) {
        return wx.showToast({
          title: "密码错误",
          icon: "none",
          mask: true,
        });
      }
      if (this.newPassword === this.confirmPassword) {
        wx.showToast({
          title: "",
          icon: "loading",
          mask: true,
        });

        let data = {
          account_id: uni.getStorageSync("userInfo").id,
          password: this.confirmPassword,
        };
        userInfo.editPassword(data).then((res) => {
          console.log(res);
          if (res.result === 10000) {
            this.$refs.editPasswordDialog.open();
          } else {
            uni.showToast({
              title: res.msg,
              icon: "none",
              mask: true,
            });
          }
        });
      } else {
        wx.showToast({
          title: "新密码与确认密码不相同，请检查输入是否正确",
          icon: "none"
        });
      }
    },

    // 跳转登录页
    jumpLogin() {
      uni.reLaunch({
        url: "/pages/login/login",
      });
      uni.clearStorageSync();
    },
  },
  onLoad() {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
  },
};
</script>

<style lang="less" scoped>
.edit_password {
  .main {
    padding: 40upx;
    .main_list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100upx;
      border-bottom: 2upx solid #eaeaea;
      .list_title {
        font-size: 28upx;
        font-weight: bold;
        color: rgba(42, 42, 42, 1);
      }
      .list_input {
        text-align: right;
      }
    }
    .message {
      font-size: 28upx;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      margin: 30upx 0 60upx;
    }
    .submit_btn {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 90upx;
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
      letter-spacing: 10upx;
    }
  }
}
.edit_password_dialog {
  .dialog_main {
    background: rgba(255, 255, 255, 1);
    border-radius: 80upx 80upx 0 0;
    text-align: center;
    padding: 94upx 50upx 50upx;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      bottom: -120upx;
      left: 0;
      width: 100%;
      height: 120upx;
      background-color: #fff;
      display: block;
    }
    .main_title {
      font-size: 36upx;
      font-weight: bold;
      color: rgba(42, 42, 42, 1);
      letter-spacing: 10upx;
      margin-bottom: 26upx;
    }
    .mian_icon {
      width: 140upx;
      height: 140upx;
      margin: 0 auto 44upx;
      image {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    .message {
      font-size: 28upx;
      font-weight: 400;
      color: rgba(0, 112, 226, 1);
      margin-bottom: 62upx;
    }
    .jump_login_btn {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 90upx;
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
    }
  }
}
</style>
