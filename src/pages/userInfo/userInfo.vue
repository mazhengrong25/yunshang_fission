<!--
 * @Description: 
 * @Author: wish.WuJunLong
 * @Date: 2020-06-16 13:42:30
 * @LastEditTime: 2020-10-20 12:22:59
 * @LastEditors: wish.WuJunLong
--> 
<template>
  <view class="user_info">
    <yun-header :showReturn="false" :statusHeight="iStatusBarHeight" centerTitle="我的"></yun-header>
    <view class="header">
      <view class="version_number">v1.0.45</view>
      <view class="info_box">
        <view class="info_left">
          <view class="avatar">
            <image class="avatar_image" v-if="avatarUrl" :src="avatarUrl" mode="contain" />
            <image class="avatar_image" v-else src="@/static/avatar.png" mode="contain" />
          </view>
          <view class="left_message">
            <view class="user_name">{{userInfo.contact || '用户名获取中...'}}</view>
            <view class="user_type">{{userInfo.company_name || '公司名称获取中...'}}</view>
          </view>
        </view>
        <view class="info_right">
          <view class="info_btn" @click="jumpDetails()">用户信息</view>
        </view>
      </view>
    </view>
    <scroll-view :enable-back-to-top="true" :scroll-y="true" class="content">
      <view class="header_box box-shadow-style">
        <view class="wallet_box">
          <view class="wallet_info">
            <view class="wallet_title">钱包余额</view>
            <view class="wallet_number">
              <text class="wallet_symbol">&yen;</text>
              {{walletInfo.storage_money || '0.00'}}
            </view>
          </view>
          <view class="wallet_list">
            <view class="list_item wallet_info">
              <view class="wallet_title">授信额度</view>
              <view class="wallet_number">
                <text class="wallet_symbol">&yen;</text>
                {{walletInfo.credit_money || '0.00'}}
              </view>
            </view>

            <view class="list_item wallet_info">
              <view class="wallet_title">短信余额</view>
              <view class="wallet_number">
                <text class="wallet_symbol">&yen;</text>
                {{walletInfo.msg_money || '0.00'}}
                <text
                  class="wallet_unit"
                >({{(Number(walletInfo.msg_money) / Number(walletInfo.msg_price)) > 0? Math.floor(Number(walletInfo.msg_money) / Number(walletInfo.msg_price)): 0 }}条)</text>
              </view>
            </view>

            <!-- <view class="list_item wallet_info">
              <view class="wallet_title">国内IBE流量</view>
              <view class="wallet_number">
                {{walletInfo.ibe_search || 0}}
                <text class="wallet_unit">条</text>
              </view>
            </view>

            <view class="list_item wallet_info">
              <view class="wallet_title">国际IBE流量</view>
              <view class="wallet_number">
                {{0}}
                <text class="wallet_unit">条</text>
              </view>
            </view> -->
          </view>
        </view>
      </view>

      <view class="option_box">
        <view class="option_list">
          <view class="list_icon">
            <image src="@/static/user_order.png" mode="contain" />
          </view>
          <view class="list_message" @click="jumpOrder()">
            <view class="message_title">全部订单</view>
            <view class="message">国内订单/国际订单</view>
          </view>
        </view>

        <view class="option_list" @click="jumpWallet()">
          <view class="list_icon">
            <image src="@/static/user_wallet.png" mode="contain" />
          </view>
          <view class="list_message">
            <view class="message_title">钱包流水</view>
            <view class="message">资金动态一手掌握</view>
          </view>
        </view>

        <view class="option_list" @click="jumpPassengerManage()">
          <view class="list_icon">
            <image src="@/static/user_wallet.png" mode="contain" />
          </view>
          <view class="list_message">
            <view class="message_title">旅客管理</view>
            <view class="message">旅客信息轻松管理</view>
          </view>
        </view>

        <view class="option_list" @click="jumpService()">
          <view class="list_icon">
            <image src="@/static/user_service.png" mode="contain" />
          </view>
          <view class="list_message">
            <view class="message_title">客服服务</view>
            <view class="message">为您竭诚服务</view>
          </view>
        </view>
      </view>

      <view class="sign_out" @click="signOut()">退出登录</view>
    </scroll-view>
  </view>
</template>

<script>
import userInfo from "@/api/getUserInfo.js";
import moment from "moment";
moment.locale("zh-cn");
export default {
  data() {
    return {
      iStatusBarHeight: 0,
      userInfo: {},
      walletInfo: {},
      avatarUrl: "", // 用户微信头像
    };
  },
  methods: {
    // 跳转用户详细信息页面
    jumpDetails() {
      uni.navigateTo({
        url: "/userInfo/userDetails",
      });
    },

    // 获取用户信息
    getUserInfo() {
      this.userInfo = uni.getStorageSync('userInfo');
      this.getWallet();
    },

    // 获取钱包详情
    getWallet() {
      let data = {
        dis_id: this.userInfo.dis_id,
      };
      userInfo.getWallet(data).then((res) => {
        if (res.result === 10000) {
          this.walletInfo = res.data;
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      });
    },

    // 跳转订单页面
    jumpOrder(){
      uni.switchTab({
         url: '/pages/order/order'
      });
    },

    // 跳转钱包流水
    jumpWallet() {
      uni.navigateTo({
        url: "/userInfo/wallet",
      });
    },

    // 跳转旅客管理
    jumpPassengerManage() {
      uni.navigateTo({
        url: "/flightReservation/passengerList?type=userInfo",
      });
    },

    // 跳转客服服务
    jumpService() {
      uni.navigateTo({
        url: "/userInfo/service",
      });
    },

    // 退出登录
    signOut() {
      userInfo.signOut().then((res) => {});
      uni.clearStorageSync();
      uni.reLaunch({
        url: "/pages/login/login",
      });
    },
  },
  created() {
    this.getUserInfo();
  },
  onLoad() {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
  },
  onShow() {
    this.avatarUrl = uni.getStorageSync("avatarUrl");
  },
};
</script>

<style scoped lang="less">
.user_info {
  background: rgba(243, 245, 247, 1);
  height: 100vh;
  display: flex;
  flex-direction: column;
  .header {
    position: relative;
    padding-top: 26upx;
    .version_number{
      position: absolute;
      right: 25upx;
      top: 0;
      font-size: 18upx;
      color: #cecece;
    }
    &::before {
      content: "";
      display: block;
      width: 100%;
      height: 200upx;
      background: rgba(0, 112, 226, 1);
      position: absolute;
      top: 0;
      z-index: 0;
    }
    .info_box {
      height: 174upx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      margin: 0 20upx;
      padding: 0 20upx 0 40upx;
      background: rgba(255, 255, 255, 1);
      border-radius: 20upx 20upx 0 0;

      .info_left {
        display: flex;
        align-items: center;
        .avatar {
          width: 100upx;
          height: 100upx;
          background: rgba(0, 0, 0, 0);
          box-shadow: 0px 0px 10px rgba(0, 112, 226, 0.2);
          border-radius: 50%;
          overflow: hidden;
          margin-right: 30upx;
          .avatar_image {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }
        .left_message {
          .user_name {
            font-size: 32upx;
            font-weight: bold;
            color: rgba(51, 51, 51, 1);
          }
          .user_type {
            margin-top: 8upx;
            font-size: 28upx;
            font-weight: 400;
            color: rgba(175, 185, 196, 1);
          }
        }
      }
      .info_right {
        .info_btn {
          background: linear-gradient(
            90deg,
            rgba(0, 112, 226, 1) 0%,
            rgba(86, 197, 255, 1) 100%
          );
          box-shadow: 0 6upx 12upx rgba(0, 112, 226, 0.3);
          border-radius: 80upx;
          height: 60upx;
          padding: 0 28upx;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 28upx;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
        }
      }
    }
  }
  .content {
    height: calc(100% - 200upx - (88upx + var(--status-bar-height)));
    flex: 1;
    overflow-y: auto;
    .header_box {
      box-shadow: none;
      padding: 40upx 20upx 8upx 60upx;
      margin: 0 0 30upx;
      border-radius: 0;

      .wallet_box {
        .wallet_info {
          margin-bottom: 44upx;
          .wallet_title {
            font-size: 28upx;
            font-weight: 400;
            color: rgba(175, 185, 196, 1);
            margin-bottom: 8upx;
          }
          .wallet_number {
            font-size: 56upx;
            font-weight: 800;
            color: rgba(51, 51, 51, 1);
            .wallet_symbol {
              font-size: 40upx;
              font-weight: 800;
              color: rgba(51, 51, 51, 1);
            }
            .wallet_unit {
              font-size: 28upx;
              font-weight: 400;
              color: rgba(51, 51, 51, 1);
              margin-left: 8upx;
            }
          }
        }
        .wallet_list {
          display: flex;
          flex-wrap: wrap;
          .list_item {
            width: 50%;
            margin-bottom: 50upx;
            .wallet_number {
              font-size: 40upx;
              font-weight: bold;
              .wallet_symbol {
                font-size: 28upx;
              }
            }
          }
        }
      }
    }

    .option_box {
      padding: 52upx 20upx 62upx 60upx;
      background: #fff;
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 30upx;
      .option_list {
        width: 50%;
        display: flex;
        align-items: flex-start;
        &:first-child,
        &:nth-child(2) {
          margin-bottom: 80upx;
        }
        .list_icon {
          width: 40upx;
          height: 40upx;
          margin-right: 24upx;
          margin-top: 10upx;
          image {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }
        .list_message {
          .message_title {
            font-size: 32upx;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            margin-bottom: 10upx;
          }
          .message {
            font-size: 26upx;
            font-weight: 400;
            color: rgba(175, 185, 196, 1);
          }
        }
      }
    }

    .sign_out {
      height: 100upx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      font-size: 28upx;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      margin-bottom: 30upx;
    }
  }
}
</style>
