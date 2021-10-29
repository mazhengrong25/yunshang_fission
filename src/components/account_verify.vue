<!--
 * @Description: 托管模式 --- 账号验证
 * @Author: mzr
 * @Date: 2021-10-21 11:43:16
 * @LastEditTime: 2021-10-29 17:28:46
 * @LastEditors: mzr
-->
<template>
  <uni-popup ref="accountVerify" type="bottom" class="account_verify">
    <view class="flight_explanation">
      <view class="title">
        <view class="close_btn" @click="closeExp"></view>
        <view class="explanation_header">账号验证</view>
      </view>
      <view class="flight_scroll">
          <view class="verify_image"></view>
          <view class="hint_text">账号核验错误</view>
          <view class="add_text">
            该账号需进行短信核验，请您用手机尾号为
            <span>{{phone.slice(-4)}}</span>
            发送短信<span>{{code?code:'666'}}</span>至<span>12306</span>
            </view>
            <view class="receive_input" v-if="!code">
              <input 
                password="true"
                placeholder="短信验证码"
                placeholder-style="fontSize:26upx; fontWeight:400;color:#95A1AE;"
                v-model="accountMessageCode"
                @input="changeCode"
              />
            </view>
      </view>
      <view class="filter_bottom">
        <view class="bottom_btn reset_btn" @click="closeExp">取消</view>
        <button class="bottom_btn submit_btn" @click="getVerify">已验证，刷新</button>
      </view>
    </view>
  </uni-popup>
</template>

<script>
export default {
  props: {
    phone : {
      type:String,
      default:() => ""
    },
    // 乘车人手机核验验证码
    code : {
      type:String,
      default:() => ""
    },
  },
  data() {
    return {
      accountMessageCode:"", // 验证码
    };
  },
  
  methods: {

    // 打开账号验证
    openExp() {
      this.$refs.accountVerify.open();
    },
    // 关闭账号验证
    closeExp() {
      this.$refs.accountVerify.close();
    },

    // 短信验证
    getVerify() {
      this.$emit('openVerify')
    },

    // 输入验证码
    changeCode() {
      this.$emit('changeCode',this.accountMessageCode)
    }

  },
};
</script>
<style lang="less" scoped>
.account_verify {
  .flight_explanation {
    height: 65vh;
    background: rgba(255, 255, 255, 1);
    border-radius: 80upx 80upx 0 0;
    .title {
      height: 60px;
      border-bottom: 2upx solid rgba(217, 225, 234, 1);
      display: flex;
      align-items: flex-end;
      .explanation_header {
        display: flex;
        justify-content: center;
        width: 100%;
        padding: 120rpx 0 30rpx;
        font-size: 18px;
        font-weight: bold;
        line-height: 22px;
        color: #333333;
        opacity: 1;
  
        .header_btn {
          font-size: 30upx;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          &::after {
            content: "";
            width: 60upx;
            height: 8upx;
            background: rgba(0, 112, 226, 1);
            opacity: 0;
            border-radius: 4upx;
            margin-top: 32upx;
            transition: opacity 0.3s;
          }
          &.is_active {
            &::after {
              opacity: 1;
            }
            color: rgba(0, 112, 226, 1);
          }
        }
      }
  
      .close_btn {
        position: absolute;
        background: url(@/static/popup_close.png) no-repeat;
        background-size: contain;
        width: 30upx;
        height: 30upx;
        top: 54upx;
        right: 44upx;
      }
    }
    .flight_scroll {
      font-size: 28upx;
      color: #2A2A2A;
      margin: 92upx 76upx;
      text-align: center;
      .verify_image {
        width: 90upx;
        height: 90upx;
        background: url("@/static/train_warn.png")
            no-repeat center center;
        background-size: contain;
        margin: 0 auto;
      }
      .hint_text {
        font-weight: bold;
        margin: 22upx 0upx 104upx;
      }
      .add_text {
        font-weight: 400;
        text-align: left;
        margin-bottom: 30upx;
        span {
          display: inline-flex;
          font-weight: bold;
        }
      }
      .receive_input {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #f1f3f5;
        padding: 20upx;
        margin-bottom: 30upx;
      }
    }
    .filter_bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: fixed;
          border-top: 2upx solid rgba(229, 229, 229, 1);
          bottom: 0;
          left: 0;
          width: 100vw;
          height: calc(144upx + var(--status-bar-height));
          padding: 26upx 20upx;
          padding-bottom: calc(26upx + var(--status-bar-height));
          box-sizing: border-box;
          background: #fff;
          z-index: 1;
          .bottom_btn {
              width: 320upx;
              height: 90upx;
              border: 2upx solid transparent;
              border-radius: 80upx;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 32upx;
              font-weight: 400;
              margin: 0;
              letter-spacing: 10upx;
              &.reset_btn {
                  border-color: rgba(0, 112, 226, 1);
                  color: rgba(0, 112, 226, 1);
              }
              &.submit_btn {
                  background: linear-gradient(
                      90deg,
                      rgba(0, 112, 226, 1) 0%,
                      rgba(86, 197, 255, 1) 100%
                  );
                  box-shadow: 0 6upx 12upx rgba(0, 112, 226, 0.3);
                  color: rgba(255, 255, 255, 1);
              }
              &.disabled {
                  opacity: 0.4;
              }
          }
    }
  }
}

</style>