<!--
 * @Description: 新增乘机人
 * @Author: wish.WuJunLong
 * @Date: 2020-07-23 18:32:17
 * @LastEditTime: 2020-07-31 13:43:52
 * @LastEditors: wish.WuJunLong
--> 
<template>
  <view class="add_passenger">
    <yun-header :statusHeight="iStatusBarHeight" :headerBottom="Number(10)" centerTitle="新增乘机人"></yun-header>
    <scroll-view :enable-back-to-top="true" :scroll-y="true" class="pssenger_main">
      <view class="box-shadow-style">
        <view class="user_message_btn">
          <image class="user_message_btn_icon" src="@/static/add_passenger_icon.png" mode="contain" />
          <text>填写说明</text>
        </view>
        <view class="list_item">
          <view class="item_title">
            <text>中文姓名</text>
          </view>

          <input
            class="item_input"
            type="text"
            placeholder="与证件姓名一致"
            placeholder-class="input_placeholder"
            v-model="passenger.userName"
          />
        </view>
        <view class="list_item">
          <view class="item_title">
            <text>手机号码</text>
            <view class="phone_numbering" @click="openAreaCodeSelect()">{{areaCode}}</view>
          </view>

          <input
            class="item_input"
            type="number"
            placeholder="用于接收航变信息"
            v-model="passenger.telPhone"
            placeholder-class="input_placeholder"
          />
        </view>
      </view>

      <uni-swipe-action>
        <uni-swipe-action-item
          v-for="(item, index) in passenger.certificateList"
          :key="index"
          @click="onClick()"
          :disabled="passenger.certificateList.length <= 1"
        >
          <view class="box-shadow-style certificate">
            <view
              class="certificate_number"
              v-if="passenger.certificateList.length > 1"
            >{{index + 1}}</view>
            <view class="list_item">
              <view class="item_title">
                <text>证件类型</text>
              </view>
              <view class="id_card_type" @click="openSelector(index)">
                <text>{{item.idCardType}}</text>
              </view>
            </view>

            <view class="list_item">
              <view class="item_title">
                <text>证件号码</text>
              </view>

              <input
                class="item_input"
                type="number"
                placeholder="请保持与证件一致"
                v-model="item.cardId"
                placeholder-class="input_placeholder"
              />
            </view>

            <view
              class="add_card"
              v-if="passenger.certificateList.length === (index + 1)"
              @click="addCertificate()"
            >+ 添加证件</view>
          </view>
          <template v-slot:right>
            <view class="option_box">
              <view class="delete_btn" @click="removeCertificate(item, index)">
                <image class="delete_btn_icon" src="@/static/delete_btn.png" mode="contain" />
                <text>删除</text>
              </view>
            </view>
          </template>
        </uni-swipe-action-item>
      </uni-swipe-action>

      <view class="box-shadow-style">
        <view class="list_item">
          <view class="item_title">
            <text>乘机人分组</text>
          </view>
          <view class="openGroup" @click="openGroupSelect">
            <text v-if="group">{{group}}</text>
            <text v-else class="not_message">请选择分组</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 手机区号选择弹窗 -->
    <yun-selector ref="areaCodePopup" :dataList="areaCodeList" @submitDialog="areaCodeSelectBtn()"></yun-selector>
    <!-- 证件类型选择弹窗 -->
    <yun-selector
      ref="selectorPopup"
      :dataList="certificateTypeList"
      @submitDialog="certificateSelecctBtn()"
    ></yun-selector>

    <!-- 分组选择弹窗 -->
    <yun-selector
      ref="groupPopup"
      :dataList="groupList"
      :addGroup="true"
      @submitDialog="groupPopupSelecctBtn()"
    ></yun-selector>
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
      passenger: {
        // 乘机人信息
        userName: "", // 用户名
        telPhone: "", // 手机号
        certificateList: [
          // 证件类型数据
          {
            idCardType: "身份证", // 证件类型
            cardId: "", // 证件号码
          },
          {
            idCardType: "港澳通行证", // 证件类型
            cardId: "", // 证件号码
          },
        ],
      },

      certificateIndex: "", // 更改证件类型下标

      certificateTypeList: ["身份证", "港澳通行证", "护照"], //证件类型列表

      areaCode: "+86", // 手机区号
      areaCodeList: ["+86", "+01", "+02", "+03"], // 手机区号列表
      areaCodeIndex: 0, // 手机区号下标

      group: "", // 分组
      groupList: ["人事部", "产品部", "市场营销部", "IT部", "未分组"], // 分组列表
    };
  },
  methods: {
    // 打开手机区号选择弹窗
    openAreaCodeSelect() {
      this.$refs.areaCodePopup.openDialog();
    },
    // 选择手机区号
    areaCodeSelectBtn(e) {
      this.areaCode = e;
    },

    // 打开证件类型选择框
    openSelector(index) {
      this.certificateIndex = index;
      this.$refs.selectorPopup.openDialog();
    },
    // 确认证件类型
    certificateSelecctBtn(e) {
      console.log(e);
      this.passenger.certificateList[this.certificateIndex].idCardType = e;
    },

    // 打开分组弹窗
    openGroupSelect() {
      this.$refs.groupPopup.openDialog();
    },
    // 确认分组
    groupPopupSelecctBtn(e) {
      this.group = e;
    },

    // 添加证件
    addCertificate() {
      this.passenger.certificateList.push({
        idCardType: "身份证", // 证件类型
        cardId: "", // 证件号码
      });
    },

    // 删除证件
    removeCertificate(val, i) {
      console.log(val, i);
      this.passenger.certificateList.splice(i, 1);
    },
  },

  onLoad() {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
  },
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
    overflow-y: auto;
    padding-bottom: 20upx;
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
        border-bottom: 2upx solid #f1f3f5;
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
          font-size: 13px;
          font-weight: 400;
          color: rgba(42, 42, 42, 1);
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
      .id_card_type {
        font-size: 28upx;
        font-weight: 400;
        color: rgba(42, 42, 42, 1);
        display: inline-flex;
        align-items: center;
        &::after {
          content: "";
          background: url("@/static/arrow.png") no-repeat center center;
          background-size: contain;
          width: 12upx;
          height: 20upx;
          display: block;
          margin-left: 14upx;
        }
      }
      .item_input {
        flex: 1;
        font-size: 28upx;
        font-weight: 400;
        text-align: right;
      }

      .openGroup {
        font-size: 28upx;
        font-weight: 400;
        color: #333;
        display: inline-flex;
        align-items: center;
        .not_message {
          color: rgba(175, 185, 196, 1);
        }
        &::after {
          content: "";
          background: url("@/static/arrow.png") no-repeat center center;
          background-size: contain;
          width: 12upx;
          height: 20upx;
          display: block;
          margin-left: 14upx;
        }
      }
    }

    .certificate {
      position: relative;
      padding-top: 54upx;
      width: 100%;
      .certificate_number {
        position: absolute;
        left: 0;
        top: 0;
        width: 50upx;
        height: 36upx;
        background: rgba(0, 112, 226, 0.2);
        border-radius: 20upx 0 20upx 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 24upx;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
      }
      .add_card {
        text-align: center;
        font-size: 30upx;
        font-weight: bold;
        color: rgba(0, 112, 226, 1);
      }
    }
    .option_box {
      width: 180upx;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .delete_btn {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: 26upx;
        font-weight: 400;
        color: rgba(255, 0, 0, 1);
        .delete_btn_icon {
          width: 45upx;
          height: 45upx;
          object-fit: contain;
          margin-bottom: 8upx;
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
