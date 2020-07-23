<!--
 * @Description: 新增乘机人
 * @Author: wish.WuJunLong
 * @Date: 2020-07-23 18:32:17
 * @LastEditTime: 2020-07-23 18:53:14
 * @LastEditors: wish.WuJunLong
--> 
<template>
  <view class="add_passenger">
    <yun-header :statusHeight="iStatusBarHeight" :headerBottom="Number(10)" centerTitle="新增乘机人"></yun-header>
    <view class="pssenger_main">
      <view class="box-shadow-style">
        <view class="user_message_btn">
          <image class="user_message_btn_icon" src="@/static/add_passenger_icon.png" mode="contain" />
          <text>填写说明</text>
        </view>
        <view class="list_item">
          <view class="item_title">
            <text>中文姓名</text>
          </view>

          <input class="item_input" type="text" placeholder="与证件姓名一致" v-model="passenger.userName" />
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
            class="item_input"
            type="number"
            placeholder="用于接收航变信息"
            v-model="passenger.userName"
          />
        </view>
      </view>

      <view class="box-shadow-style">
        <view class="list_item">
          <view class="item_title">
            <text>证件类型</text>
          </view>

          <input class="item_input" type="text" placeholder="与证件姓名一致" v-model="passenger.userName" />
        </view>

        <view class="list_item">
          <view class="item_title">
            <text>证件号码</text>
          </view>

          <input
            class="item_input"
            type="number"
            placeholder="请保持与证件一致"
            v-model="passenger.userName"
          />
        </view>

        <view class="add_card">+ 添加证件</view>
      </view>

      <view class="box-shadow-style">
        <view class="list_item">
          <view class="item_title">
            <text>证件类型</text>
          </view>
          <view>请选择分组</view>
        </view>
      </view>
    </view>
    <view class="submit_box">
      <button class="submit_btn" @click="returnBtn">保存</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      iStatusBarHeight: 0, // 状态栏高度

      areaCode: ["+86", "+01", "+02", "+03"], // 手机区号
      areaCodeIndex: 0 // 手机区号下标
    };
  },
  methods: {
    // 选择手机区号
    bindPickerChange: function(e) {
      console.log("picker发送选择改变，携带值为", e.target.value);
      this.areaCodeIndex = e.target.value;
    }
  },

  onLoad() {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
  }
};
</script>

<style lang="less" scoped>
.add_passenger {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: rgba(243, 245, 247, 1);
  .pssenger_main {
    flex: 1;
    .box-shadow-style {
      &:not(:last-child) {
        margin-bottom: 20upx;
      }
    }

    .user_message_btn {
      font-size: 20upx;
      font-weight: 400;
      color: rgba(42, 42, 42, 1);
      margin-bottom: 52upx;
      display: flex;
      align-items: center;
      .user_message_btn_icon {
        width: 20upx;
        height: 20upx;
        object-fit: contain;
        margin-right: 6upx;
      }
    }
    .list_item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      &:not(:last-child) {
        padding-bottom: 12upx;
        margin-bottom: 28upx;
        border-bottom: 2upx solid #d9e1ea;
      }
      .item_title {
        font-size: 28upx;
        font-weight: bold;
        color: rgba(42, 42, 42, 1);
        flex-shrink: 0;
        margin-right: 20upx;
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
        font-size: 28upx;
        font-weight: 400;
        text-align: right;
        &::placeholder {
          color: rgba(175, 185, 196, 1);
        }
      }
    }

    .add_card {
      text-align: center;
      font-size: 30upx;
      font-weight: bold;
      color: rgba(0, 112, 226, 1);
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
