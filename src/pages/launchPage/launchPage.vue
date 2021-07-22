<!--
 * @Description: 小程序启动页
 * @Author: wish.WuJunLong
 * @Date: 2021-07-21 17:58:21
 * @LastEditTime: 2021-07-22 09:30:16
 * @LastEditors: wish.WuJunLong
-->

<template>
  <div class="launch_page">
    <div class="launch_logo">
      <div class="launch_loading"></div>
      <image
        class="launch_loading_img"
        src="@/static/launch_logo_2.png"
        mode="aspectFit"
      ></image>
    </div>

    <div class="launch_line"></div>

    <div class="launch_name">云上航空</div>

    <div class="launch_message">正在进入分销系统</div>
  </div>
</template>

<script>
import userInfo from "@/api/getUserInfo.js";

export default {
  data() {
    return {};
  },

  methods: {
    getUserInfo() {
      userInfo.getUserInfo().then((res) => {
        if (res) {
          uni.reLaunch({
            url: "/pages/index/index",
          });
        }
      });
    },
  },

  onShow() {
    setTimeout(() => {
      this.getUserInfo();
    }, 3000);
  },
};
</script>

<style lang="less" scoped>
.launch_page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;

  .launch_logo {
    width: 400upx;
    height: 400upx;
    position: relative;
    .launch_loading {
      display: inline-block;
      border: 5upx solid rgba(#0070e2, 0.1);
      border-left-color: #0070e2;
      border-radius: 50%;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: donut-spin 2s linear infinite;
    }
    .launch_loading_img {
      position: absolute;
      width: 80%;
      height: 80%;
      top: 10%;
      left: 10%;
    }
  }

  @keyframes donut-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .launch_line {
    height: 4upx;
    background: rgba(#0070e2, 0.1);
    width: 40%;
    margin-top: 10vh;
    opacity: 0;
    animation: show-line 3s linear forwards;
  }
  @keyframes show-line {
    20% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }

  .launch_name {
    margin-top: 50upx;
    font-size: 40upx;
    font-weight: 800;
    color: #333333;
    text-align: center;
    letter-spacing: 10upx;
    opacity: 0;
    animation: show-name 3s linear forwards;
  }
  @keyframes show-name {
    50% {
      opacity: 0;
    }
    80% {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }

  .launch_message {
    position: absolute;
    bottom: 5vh;
    text-shadow: 0 4upx white;
    font-size: 24upx;
    font-weight: bold;
    color: #b8bec5;
    text-align: center;
    letter-spacing: 2upx;
  }
}
</style>
