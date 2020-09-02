<!--
 * @Description: 报销凭证 - 添加邮件地址
 * @Author: wish.WuJunLong
 * @Date: 2020-07-23 13:49:45
 * @LastEditTime: 2020-07-23 14:34:56
 * @LastEditors: wish.WuJunLong
--> 
<template>
  <view class="mail_address">
    <view class="mail_address_content">
      <view class="mail_address_box box-shadow-style">
        <view class="list_item">
          <view class="item_title">收货人</view>
          <input class="item_input" type="text" placeholder="请输入姓名" 
            placeholder-class="input_placeholder" :value="mailAddress.userName" />
        </view>
        <view class="list_item">
          <view class="item_title">
            <text>手机号码</text>
            <picker
              class="phone_numbering"
              @change="bindPickerChange"
              :value="areaCodeIndex"
              :range="areaCode"
              mode="selector"
            >
              <view class="phone_numbering_input">{{areaCode[areaCodeIndex]}}</view>
            </picker>
          </view>
          <input
            placeholder-class="input_placeholder"
            class="item_input"
            type="number"
            placeholder="请输入手机号码"
            :value="mailAddress.telphone"
          />
        </view>
        <view class="list_item">
          <view class="item_title">邮政编码</view>
          <input class="item_input" type="number" 
            placeholder-class="input_placeholder" placeholder="请输入邮政编码" :value="mailAddress.code" />
        </view>
        <view class="list_item">
          <view class="item_title">所在地区</view>
          <input
            placeholder-class="input_placeholder"
            class="item_input"
            type="number"
            placeholder="请选择所在地区"
            :value="mailAddress.address"
          />
        </view>
        <view class="list_item textarea">
          <view class="item_title">详细地址：</view>
          <textarea class="item_input" placeholder="请输入详细地址" :value="mailAddress.address"></textarea>
        </view>
      </view>
    </view>
    <view class="submit_box">
      <view class="submit_btn" @click="returnBtn">确认</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      mailAddress: {},
      areaCode: ["+86", "+01", "+02", "+03"], // 手机区号
      areaCodeIndex: 0 // 手机区号下标
    };
  },
  methods: {
    // 选择手机区号
    bindPickerChange: function(e) {
      console.log("picker发送选择改变，携带值为", e.target.value);
      this.areaCodeIndex = e.target.value;
		},
		
		// 提交数据并返回上一页
		returnBtn(){
			uni.navigateBack({
					delta: 1
			});
		},
  }
};
</script>

<style lang="less" scoped>
.mail_address {
  background: rgba(243, 245, 247, 1);
  display: flex;
  flex-direction: column;
  height: 100vh;
  .mail_address_content {
    flex: 1;
    padding-top: 20upx;
    .mail_address_box {
      .list_item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 28upx 0 32upx;
        &:not(:last-child) {
          border-bottom: 2upx solid rgba(241, 243, 245, 1);
        }
        .item_title {
          font-size: 28upx;
          font-weight: bold;
          color: rgba(42, 42, 42, 1);
          margin-right: 40upx;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          .phone_numbering {
            display: inline-flex;
            align-items: center;
            margin-left: 20upx;
            .phone_numbering_input {
              font-size: 13px;
              font-weight: 400;
              color: rgba(42, 42, 42, 1);
            }
            &::after {
              content: "";
              background: url(@/static/arrow.png) no-repeat center center;
              background-size: contain;
              display: inline-block;
              width: 12upx;
              height: 21upx;
              transform: rotate(90deg);
              margin-left: 14upx;
            }
          }
        }
        .item_input {
          flex: 1;
          text-align: right;
          font-size: 28upx;
          font-weight: 400;
          color: rgba(42, 42, 42, 1);
          &::placeholder {
            color: rgba(175, 185, 196, 1);
          }
        }
        &.textarea {
          height: auto;
          align-items: flex-start;
          padding-bottom: 0;
          .item_title {
            margin-right: 0;
          }
          .item_input {
            text-align: left;
            height: 138upx;
          }
        }
      }
    }
  }

  .submit_box {
    background: rgba(255, 255, 255, 1);
    height: 100upx;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 24upx;
    padding-bottom: var(--status-bar-height);
    border-top: 2upx solid rgba(229, 229, 229, 1);
    .submit_btn {
      flex: 1;
      height: 90upx;
      margin: 0 50upx;
      background: linear-gradient(
        90deg,
        rgba(0, 112, 226, 1) 0%,
        rgba(86, 197, 255, 1) 100%
      );
      box-shadow: 0 6upx 12upx rgba(0, 112, 226, 0.3);
      border-radius: 80upx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32upx;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      letter-spacing: 10upx;
    }
  }
}
</style>
