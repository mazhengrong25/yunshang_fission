<!--
 * @Description: 钱包充值页面
 * @Author: wish.WuJunLong
 * @Date: 2021-03-16 11:36:56
 * @LastEditTime: 2021-06-23 09:30:18
 * @LastEditors: wish.WuJunLong
-->
<template>
  <view class="walletRecharge">
    <yun-header :statusHeight="iStatusBarHeight" centerTitle="充值"></yun-header>
    <view class="wallet_message">
      <view class="prcie">{{ `&yen; ${walletInfo.storage_money || 0}` }}</view>
      <view>当前余额</view>
    </view>

    <view class="wallet_recharge">
      <view class="recharge_box">
        <view class="box_title">
          <view class="title">充值金额</view>
          <view class="info">单位元：例如100</view>
        </view>

        <view class="recharge_input">
          <view class="input_int">
            &yen;
          </view>
          <view class="input_box">
            <input type="number" v-model="price" />
          </view>
        </view>
        <view class="recharge_info">
          *单笔充值金额不得小于1.00
        </view>
      </view>
    </view>

    <button class="submit_btn" :disabled="!price" @click="submitBtn">立即充值</button>

    <view class="page_info">
      <view class="info_title">温馨提示：</view>
      <view class="info_message">充值为即时到账，充值后可查看当前余额</view>
    </view>
  </view>
</template>

<script>
import userInfo from "@/api/getUserInfo.js";
import ticket from "@/api/ticketInquiry.js";
import Base64 from "@/utils/base64.js";
export default {
  data() {
    return {
      iStatusBarHeight: 0,
      userId: "",
      walletInfo: {},
      price: null,

      orderId: "",
    };
  },
  onLoad(option) {
    console.log(option);
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.userId = option.id;
  },

  mounted() {
    this.getWalletInfo();
  },

  methods: {
    // 获取钱包详情
    getWalletInfo() {
      console.log('充值成功')
      let data = {
        dis_id: this.userId,
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

    // 提交充值
    async submitBtn() {
      let data = {
        amount: this.price,
      };

      let _that = this

      await wx.login({
        success(wxcode) {
          if (wxcode.code) {
            console.log('获取用户code',wxcode.code);
            uni.setStorageSync("userCode", wxcode.code);
          } else {
            console.log("登录失败！" + wxcode.errMsg);
          }
        },
      });

      await userInfo.rechargeWallet(data).then((res) => {
        console.log('获取支付订单号')

        if (res.status === "success") {
          _that.orderId = res.order_no ? Base64.decode(res.order_no) : "";

          let newdata = {
            pay_type: "5",
            code: uni.getStorageSync("userCode"),
          };

          

          ticket
            .payOrder(uni.arrayBufferToBase64(new Buffer(_that.orderId)), newdata)
            .then((ores) => {
              console.log('开始支付')
              let wxData = JSON.parse(ores.data.pay_url);
              wx.requestPayment({
                timeStamp: wxData.timestamp,
                nonceStr: wxData.noncestr,
                package: wxData.package,
                signType: wxData.signType,
                paySign: wxData.sign,
                success: function() {
                  uni.showToast({
                    title: "充值成功",
                    icon: "none",
                    mask: true,
                  });
                  _that.getWalletInfo();
                  _that.price = "";
                },
                fail: function() {
                  uni.showToast({
                    title: "已取消支付",
                    icon: "none",
                  });
                },
                complete: function() {},
              });
            });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.walletRecharge {
  .wallet_message {
    height: 248upx;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 28upx;
    font-weight: 400;
    color: #afb9c4;
    .prcie {
      font-size: 48upx;
      font-weight: 800;
      color: #333333;
      margin-bottom: 14upx;
    }
  }
  .wallet_recharge {
    padding: 40upx 30upx;
    background: #f3f5f7;
    margin-bottom: 80upx;
    .recharge_box {
      background: #ffffff;
      box-shadow: 0px 0px 12upx #d9e1ea;
      border-radius: 20upx;
      padding: 46upx 40upx 30upx;
      .box_title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 46upx;
        .title {
          font-size: 36upx;
          font-weight: 400;
          color: #333333;
        }
        .info {
          font-size: 28upx;
          font-weight: 400;
          color: #afb9c4;
        }
      }
      .recharge_input {
        display: flex;
        align-items: center;
        font-size: 60upx;
        font-weight: bold;
        color: #333333;
        padding-bottom: 24upx;
        border-bottom: 2upx solid #f1f3f5;
        margin-bottom: 24upx;
        .input_box {
          margin-left: 20upx;
          input {
            height: 80upx;
            font-size: 60upx;
          }
        }
      }
      .recharge_info {
        font-size: 28upx;
        font-weight: 400;
        color: #fb9826;
      }
    }
  }

  .submit_btn {
    width: 650upx;
    height: 90upx;
    background: linear-gradient(90deg, #0070e2 0%, #56c5ff 100%);
    box-shadow: 0px 6upx 12upx rgba(0, 112, 226, 0.3);
    border-radius: 80upx;
    margin: 0 auto;
    font-size: 32upx;
    font-weight: 400;
    line-height: 90upx;
    color: #ffffff;
    letter-spacing: 10upx;
    text-align: center;
  }
  .submit_btn[disabled]:not([type]) {
    opacity: 0.3;
  }

  .page_info {
    text-align: center;
    margin-top: 20%;
    .info_title {
      font-size: 32upx;
      font-weight: 400;
      color: #333333;
      margin-bottom: 24upx;
    }
    .info_message {
      font-size: 28upx;
      font-weight: 400;
      color: #afb9c4;
    }
  }
}
</style>
