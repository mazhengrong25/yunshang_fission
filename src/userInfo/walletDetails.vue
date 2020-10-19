<!--
 * @Description: 流水详情页面
 * @Author: wish.WuJunLong
 * @Date: 2020-08-04 13:48:46
 * @LastEditTime: 2020-09-21 17:15:43
 * @LastEditors: wish.WuJunLong
-->
<template>
  <view class="wallet_details">
    <yun-header :statusHeight="iStatusBarHeight" :headerColor="true" centerTitle="详情"></yun-header>
    <scroll-view :enable-back-to-top="true" :scroll-y="true" class="details_view">
      <view class="details_header">
        <view class="header_icon">
          <image
            v-if="walletData.after_balance < walletData.before_balance"
            src="@/static/wallet_type_1.png"
            mode="contain"
          />
          <image v-if="false" src="@/static/wallet_type_2.png" mode="contain" />
          <image
            v-if="walletData.trans_type === 1 || walletData.trans_type === 3 || walletData.trans_type === 11"
            src="@/static/wallet_type_3.png"
            mode="contain"
          />
          <image
            v-if="walletData.trans_type === 8 || walletData.trans_type === 9"
            src="@/static/wallet_type_4.png"
            mode="contain"
          />
        </view>
        <view class="header_type">
          {{walletData.trans_type === 1? '钱包充值':
          walletData.trans_type === 2? '钱包消费':
          walletData.trans_type === 3? '短信充值':
          walletData.trans_type === 4? '短信消费':
          walletData.trans_type === 5? '信用额度调整':
          walletData.trans_type === 6? '冻结金额调整':
          walletData.trans_type === 7? '三方支付':
          walletData.trans_type === 8? '三方支付全退':
          walletData.trans_type === 9? '三方支付部分退':
          walletData.trans_type === 10? '提现':
          walletData.trans_type === 11? '流量充值':
          walletData.trans_type === 12? '预付款调整': ""}}
        </view>
        <view class="header_peice">
          {{walletData.after_balance > walletData.before_balance? '+': walletData.after_balance < walletData.before_balance? '-': ''}}
          {{Number(walletData.amount).toFixed(2)}}
        </view>
      </view>

      <view class="details_box">
        <view class="box_list">
          <view class="list_title">流水编号</view>
          <view class="list_message">{{walletData.id}}</view>
        </view>
        <view class="box_list">
          <view class="list_title">订单编号</view>
          <view class="list_message">{{walletData.order_no}}</view>
        </view>
        <view class="box_list">
          <view class="list_title">订单类型</view>
          <view class="list_message">
            {{walletData.order_type === 1? '国内正常单':
            walletData.order_type === 2? '国际正常单':
            walletData.order_type === 3? '国内退票单':
            walletData.order_type === 4? '国际退票单':
            walletData.order_type === 5? '国内改签单':
            walletData.order_type === 6? '国际改签单':
            walletData.order_type === 7? '短信':
            walletData.order_type === 8? '流量':
            walletData.order_type === 9? '保险单':
            walletData.order_type === 10? '现金充值':
            walletData.order_type === 11? '余额冻结':
            walletData.order_type === 12? '余额提现':
            walletData.order_type === 13? '国内反冲':
            walletData.order_type === 14? '国际反冲': ""}}
          </view>
        </view>
        <view class="box_list">
          <view class="list_title">支付方式</view>
          <view
            class="list_message"
          >{{payType === 1? '预存款': payType === 2? '授信支付':payType === 3? '易宝在线支付':''}}</view>
        </view>
        <view class="box_list">
          <view class="list_title">支付时间</view>
          <view class="list_message">{{walletData.created_at}}</view>
        </view>
        <view class="box_list">
          <view class="list_title">操作员</view>
          <view class="list_message">{{walletData.userinfo.contact}}</view>
        </view>
        <view class="box_list">
          <view class="list_title">员工工号</view>
          <view class="list_message">{{walletData.userinfo.create_user_id}}</view>
        </view>
        <view class="box_list">
          <view class="list_title">备注</view>
          <view class="list_message">{{walletData.remark}}</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import userInfo from "@/api/getUserInfo.js";
export default {
  data() {
    return {
      iStatusBarHeight: 0,
      walletData: {}, // 流水详情
      payType: "", // 支付方式
    };
  },
  methods: {
    // 获取订单支付方式
    getOrderType(val) {
      console.log(val[0]);
      let data = {
        order_no: val,
      };
      if (Number(val[0]) >= 6) {
        userInfo.getOrderInterPay(data).then((res) => {
          if (res.result === 10000) {
            this.payType = res.data.order_msg.pay_type;
          } else {
            uni.showToast({
              title: res.msg,
              icon: "none",
            });
          }
        }).catch(() =>{
         setTimeout(() =>{
            uni.showToast({
              title: '获取数据错误，请稍后再试',
              icon: "none",
            });
          },200)
        });
      } else if (Number(val[0]) <= 6) {
        userInfo.getOrderPay(data).then((res) => {
          if (res.result === 10000) {
            this.payType = res.data.order_msg.pay_type;
          } else {
            uni.showToast({
              title: res.msg,
              icon: "none",
            });
          }
        }).catch(() =>{
          setTimeout(() =>{
            uni.showToast({
              title: '获取数据错误，请稍后再试',
              icon: "none",
            });
          },200)
        });
      }
    },
  },
  onLoad(data) {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.walletData = JSON.parse(data.data);

    this.getOrderType(this.walletData.order_no);
    console.log(this.walletData);
  },
};
</script>

<style lang="less" scoped>
.wallet_details {
  display: flex;
  flex-direction: column;
  .details_view {
    flex: 1;
    height: calc(100vh - (88upx + var(--status-bar-height)));
    overflow-y: auto;
  }
  .details_header {
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    margin-bottom: 60upx;
    margin-top: 52upx;
    .header_icon {
      width: 130upx;
      height: 130upx;
      margin: 0 auto;
      image {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    .header_type {
      font-size: 32upx;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      margin-bottom: 20upx;
    }
    .header_peice {
      font-size: 48upx;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
    }
  }
  .details_box {
    width: calc(100% - 40upx);
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 4upx 20upx rgba(217, 225, 234, 1);
    border-radius: 20upx;
    padding: 40upx 20upx 60upx 32upx;
    margin: 0 20upx 30upx;
    box-sizing: border-box;

    .box_list {
      display: flex;
      align-items: flex-start;
      .list_title {
        width: 152upx;
        font-size: 28upx;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        flex-shrink: 0;
      }
      .list_message {
        font-size: 28upx;
        font-weight: 400;
        color: rgba(42, 42, 42, 1);
        white-space: pre-wrap;
        word-break: break-all;
      }
      &:not(:last-child) {
        margin-bottom: 40upx;
      }
    }
  }
}
</style>
