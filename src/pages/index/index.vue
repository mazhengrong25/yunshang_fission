<!--
 * @Description: 首页
 * @Author: wish.WuJunLong
 * @Date: 2020-06-15 13:53:03
 * @LastEditTime: 2021-09-29 13:55:39
 * @LastEditors: mzr
-->
<template>
  <view class="index">
    <yun-header
      :showReturn="false"
      :statusHeight="iStatusBarHeight"
      centerTitle="云上航空"
    ></yun-header>
    <view class="index_main">
      <view class="header_type">
        <view
          v-for="(item, index) in headerType"
          :key="index"
          :class="['type_title', { active: currentHeader === index }]"
          @click="switchTicketType(index)"
          ><view>{{ item }}</view></view
        >
      </view>

      <view class="header" v-show="currentHeader === 0">
        <model-swiper :swiperList="swiperList"></model-swiper>
        <view class="index_interval" style="margin-top: 50upx"></view>

        <view class="modal_tabs">
          <view class="swiper-tab">
            <view
              v-for="(item, index) in tabsList"
              :key="index"
              :class="['swiper-tab-item', { active: currentTab === index }]"
              @click="clickTab(index)"
              >{{ item }}</view
            >
          </view>

          <swiper
            class="tabs_main"
            :current="currentTab"
            duration="300"
            :style="{ height: swiperHeight + 'px' }"
            @change="swiperTab"
          >
            <swiper-item
              v-for="(item, index) in tabsList"
              :key="index"
              @touchmove.stop="stopTouchMove"
            >
              <view class="tabs_center">
                <ticket-input
                  :ticketType="item"
                  :addressForm="airMessage"
                  @checkTicked="checkTicked"
                  @closeFromBtn="closeFromBtn"
                ></ticket-input>
              </view>
            </swiper-item>
          </swiper>
        </view>
        <view class="child_box" v-if="currentTab !== 0 && currentTab !== 2">
          <view class="cabin">经济舱</view>

          <view class="passenger_message">
            <view class="child_message" @click="openChildMessageBtn"></view>
            <view class="passenger_message_main" @click="openPassengerNumber">
              <view class="passenger_list">
                <text>成人</text>
                <text class="number">{{ passengerForm.adultNumber }}</text>
              </view>
              <view class="passenger_list">
                <text>儿童</text>
                <text class="number">{{ passengerForm.childNumber }}</text>
              </view>
              <view class="passenger_list">
                <text>婴儿</text>
                <text class="number">{{ passengerForm.babyNumber }}</text>
              </view>
              <image
                class="open_number_more"
                src="@/static/number_more_btn.png"
                mode="contain"
              />
            </view>
          </view>
        </view>

        <view
          class="multi_pass_message"
          v-if="currentTab === 3"
          @click="openMultiPassProblem"
          >至少选择一个国际城市</view
        >

        <view class="submit_btn" @click="submitTicket"
          >{{ currentTrue ? "往返" : "" }}飞机票查询</view
        >
      </view>

      <view class="ticket_train" v-show="currentHeader === 1">
        <model-swiper :swiperList="trainSwiper"></model-swiper>

        <view class="train_space"></view>

        <view class="train_ticket_input">
          <ticket-input
            :ticketClassify="currentHeader"
            :addressForm="airMessage"
            @checkTicked="checkTicked"
            @closeFromBtn="closeFromBtn"
          ></ticket-input>
        </view>

        <view
          :class="['ticket_checkbox', { active: checkboxStatus }]"
          @click="activeCheckbox()"
        >
          <view class="checkbox_input"></view>
          <view class="checkbox_title">只看动车高铁</view>
        </view>

        <view class="submit_btn" @click="submitTrain">火车票查询</view>
      </view>
      <!-- 公告版块 -->
      <view class="notice">
        <model-notice :modelType="true" :noticeList="noticeList"></model-notice>
      </view>
    </view>

    <!-- 乘客数量选择弹窗 -->
    <uni-popup
      ref="childPopup"
      type="bottom"
      class="child_dialog"
      @change="childPopupStatus"
    >
      <view class="child_dialog_mian">
        <view class="title">
          <view class="close" @click="closeChildDialog">取消</view>
          <view class="submit" @click="submitChildDialog">确定</view>
        </view>
        <view class="dialog_main">
          <view class="child_main">
            <view class="number_name">成人</view>
            <view class="number_box">
              <view
                :class="[
                  'remove_number number_icon',
                  { active: passengerFormBack.adultNumber > 0 },
                ]"
                @click="editTicketNumber('remove', 'adult')"
              ></view>
              <view class="number">{{ passengerFormBack.adultNumber }}</view>
              <view
                class="add_number number_icon"
                @click="editTicketNumber('add', 'adult')"
              ></view>
            </view>
          </view>
          <view class="child_main">
            <view class="number_name">
              儿童
              <text class="number_name_message">（2-12岁）</text>
            </view>
            <view class="number_box">
              <view
                :class="[
                  'remove_number number_icon',
                  { active: passengerFormBack.childNumber > 0 },
                ]"
                @click="editTicketNumber('remove', 'child')"
              ></view>
              <view class="number">{{ passengerFormBack.childNumber }}</view>
              <view
                class="add_number number_icon"
                @click="editTicketNumber('add', 'child')"
              ></view>
            </view>
          </view>
          <view class="child_main">
            <view class="number_name">
              婴儿
              <text class="number_name_message">（小于2岁）</text>
            </view>
            <view class="number_box">
              <view
                :class="[
                  'remove_number number_icon',
                  { active: passengerFormBack.babyNumber > 0 },
                ]"
                @click="editTicketNumber('remove', 'baby')"
              ></view>
              <view class="number">{{ passengerFormBack.babyNumber }}</view>
              <view
                class="add_number number_icon"
                @click="editTicketNumber('add', 'baby')"
              ></view>
            </view>
          </view>
        </view>
      </view>
    </uni-popup>

    <!-- 儿婴票说明弹窗 -->
    <uni-popup
      ref="ticketExplanation"
      class="ticket_explanation"
      type="bottom"
      @change="childPopupStatus"
    >
      <view class="title">
        <view class="close_btn" @click="closePopup"></view>
        <view class="explanation_header">
          <view
            @click="checkedExplanationBtn(0)"
            :class="['header_btn', { is_active: popupCurrent === 0 }]"
            >儿童票</view
          >
          <view
            @click="checkedExplanationBtn(1)"
            :class="['header_btn', { is_active: popupCurrent === 1 }]"
            >婴儿票</view
          >
          <view
            @click="checkedExplanationBtn(2)"
            :class="['header_btn', { is_active: popupCurrent === 2 }]"
            >常见问题</view
          >
        </view>
      </view>
      <view class="flight_explanation_main">
        <swiper class="explanation_content" @change="popupChange" :current="popupCurrent">
          <swiper-item>
            <view class="popup_content_item">儿童票</view>
          </swiper-item>
          <swiper-item>
            <view class="popup_content_item">婴儿票</view>
          </swiper-item>
          <swiper-item>
            <view class="popup_content_item">常见问题</view>
          </swiper-item>
        </swiper>
      </view>
    </uni-popup>

    <!-- 国际城市说明弹窗 -->
    <uni-popup
      ref="messageDialog"
      type="center"
      :maskClick="false"
      @change="childPopupStatus"
    >
      <messageDialog @closeDialog="closeMessageDialog"></messageDialog>
    </uni-popup>

    <!-- #ifdef MP-WEIXIN -->
    <button class="share-btn" open-type="share">立即分享</button>
    <!-- #endif -->
  </view>
</template>

<script>
import modelSwiper from "@/components/model_swiper.vue"; // 轮播图
import modelNotice from "@/components/modal_notice.vue"; // 公告版块
import ticketInput from "@/components/ticket_input.vue"; // 航程选择

import messageDialog from "@/components/message_dialog.vue"; // 信息弹窗内容

import noticeApi from "@/api/notice"; // 公告api

import userInfo from "@/api/getUserInfo.js";

import moment from "moment";
moment.locale("zh-cn");
export default {
  components: {
    modelSwiper,
    modelNotice,
    ticketInput,
    messageDialog,
  },
  data() {
    return {
      iStatusBarHeight: 0,

      headerType: ["机票", "火车票"],
      currentHeader: 0, // 头部切换默认值

      checkboxStatus: true, // 火车票 选中动车高铁默认值

      checkTickedType: false, // 切换往返地

      // banner 列表  火车票
      trainSwiper: [
        {
          path: require("@/static/train_header_swiper.png"),
          title: "携手合作，互融互联",
          url: "#",
          swiper_type: true,
        },
        {
          path: require("@/static/train_header_swiper.png"),
          title: "携手合作，互融互联",
          url: "#",
          swiper_type: true,
        },
      ],

      currentTab: 0, // tab默认值
      tabsList: ["国内", "国际", "往返", "多程"], // tab切换内容
      swiperHeight: 0, // tab切换swiper高度

      addressForm: {
        // 航程信息
        to: "重庆", // 出发地
        from: "北京", // 到达地
        multi_pass_to: "西安", // 多程出发地
        multi_pass_from: "武汉", // 多程到达地
        toTime: "", // 出发时间
        toDay: "明天",
        toDate: "",
        fromTime: "", // 到达时间
        fromDay: "周三", // 到达日期
        fromDate: "",
      },

      passengerForm: {
        adultNumber: 0, // 成年人数量
        childNumber: 0, // 儿童数量
        babyNumber: 0, // 婴儿数量
      },

      passengerFormBack: {}, // 乘客信息

      popupCurrent: 0, // 弹窗轮播下标
      airMessage: {
        to: {
          city_code: "CKG",
          city_name: "重庆",
          country_code: "CN",
          province: "重庆",
        },
        from: {
          city_code: "BJS",
          city_name: "北京",
          country_code: "CN",
          province: "北京",
        },
        toTime: {
          date: moment()
            .add(1, "d")
            .format("YYYY-MM-DD"),
          month: moment()
            .add(1, "d")
            .format("M月DD日"),
          status: "start",
          type: "time",
          week: moment()
            .add(1, "d")
            .format("ddd"),
        },
        fromTime: {},
        to_type: "",
        from_type: "",
      },

      noticeList: [], // 公告列表

      currentTrue: false, // 是否往返
    };
  },
  methods: {
    // 切换页面显示
    switchTicketType(val) {
      this.currentHeader = val;
    },

    // 选中
    activeCheckbox() {
      this.checkboxStatus = !this.checkboxStatus;
    },

    // 乘机人数弹窗导航栏状态
    childPopupStatus(e) {
      if (e.show) {
        uni.hideTabBar({
          animation: true,
        });
      } else {
        setTimeout(() => {
          uni.showTabBar({
            animation: true,
          });
        }, 200);
      }
    },

    // 禁止滑动切换
    stopTouchMove() {
      return false;
    },

    //滑动切换
    swiperTab(e) {
      this.currentTab = e.detail.current;
      this.setSwiperHeight();
    },

    //点击切换
    clickTab(index) {
      if (index === 1 || index === 3) {
        return uni.showToast({
          title: "功能开发中,敬请期待",
          icon: "none",
        });
      }

      if (index === 0) {
        this.closeFromBtn();
      }

      this.currentTrue = index === 2;

      if (this.currentTab === index) {
        return false;
      } else {
        this.currentTab = index;
      }
    },

    // 切换往返地址
    checkTicked(data) {
      this.checkTickedType = !this.checkTickedType;

      console.log(this.airMessage);
      let to = this.airMessage.to;
      let from = this.airMessage.from;
      let toType = this.airMessage.to_type ? this.airMessage.to_type : "";
      let fromType = this.airMessage.from_type ? this.airMessage.from_type : "";
      this.$set(this.airMessage, "to", from);
      this.$set(this.airMessage, "from", to);

      this.airMessage["to_type"] = fromType ? fromType : "";
      this.airMessage["from_type"] = toType ? toType : "";
      // this.$set(this.airMessage,'to_type',from_type)
      // this.$set(this.airMessage,'from_type',to_type)
      console.log(this.airMessage);
      this.$forceUpdate();
    },
    // 清除返程信息
    closeFromBtn() {
      this.airMessage.fromTime = {};
      this.currentTab = 0;
      this.currentTrue = false;
    },

    // 火车票跳转
    submitTrain() {
      uni.navigateTo({
        url:
          "/trainInquiry/trainInquiry?trainData=" +
          JSON.stringify(this.airMessage) +
          "&checkboxStatus=" +
          this.checkboxStatus,
      });
    },

    // 获取公告列表
    getNoticeList() {
      noticeApi.getNotice().then((res) => {
        if (res.errorcode === 10000) {
          // this.noticeList = res.data.data
          res.data.data.forEach((item, index) => {
            if (index < 5) {
              this.noticeList.push(item);
            }
          });
          console.log("首页", this.noticeList);
        }
      });
    },
    // 获取当前swiper-item高度
    setSwiperHeight() {
      let query = uni.createSelectorQuery().in(this);
      query.selectAll(".tabs_center").boundingClientRect();
      query.exec((res) => {
        this.swiperHeight = res[0][this.currentTab].height;
      });
    },

    // 儿婴票说明
    openChildMessageBtn() {
      this.$refs.ticketExplanation.open();
    },

    // 关闭儿婴票说明
    closePopup() {
      this.$refs.ticketExplanation.close();
    },
    // 弹窗轮播标题切换
    checkedExplanationBtn(index) {
      this.popupCurrent = index;
    },
    // 弹窗轮播切换
    popupChange(e) {
      this.popupCurrent = e.detail.current;
    },

    // 打开乘客数量弹窗
    openPassengerNumber() {
      console.log("打开乘机人数选择");
      this.$refs.childPopup.open();
      this.passengerFormBack = JSON.parse(JSON.stringify(this.passengerForm));
    },

    // 关闭乘机人数弹窗
    closeChildDialog() {
      this.$refs.childPopup.close();
    },
    // 修改乘机人数
    editTicketNumber(status, type) {
      if (status === "add") {
        this.passengerFormBack[type + "Number"] =
          this.passengerFormBack[type + "Number"] + 1;
      } else {
        if (this.passengerFormBack[type + "Number"] > 0) {
          this.passengerFormBack[type + "Number"] =
            this.passengerFormBack[type + "Number"] - 1;
        }
      }
    },
    // 提交乘机人数数据
    submitChildDialog() {
      this.passengerForm = this.passengerFormBack;
      this.$refs.childPopup.close();
    },

    // 打开选择国际城市提示
    openMultiPassProblem() {
      this.$refs.messageDialog.open();
    },
    // 关闭选择国际城市提示
    closeMessageDialog() {
      this.$refs.messageDialog.close();
    },

    // 提交按钮
    submitTicket() {
      if (this.currentTab === 2 && !this.airMessage.fromTime.date) {
        return uni.showToast({
          title: "请选择返程时间",
          icon: "none",
          duration: 1000,
        });
      }

      console.log("提交", JSON.stringify(this.airMessage));
      this.airMessage["type"] = this.currentTab;

      uni.removeStorageSync("changeMessage");
      uni.removeStorageSync("changeTicket");

      let jumpUrl;
      if (this.currentTab === 0 && JSON.stringify(this.airMessage.fromTime) === "{}") {
        jumpUrl = "/ticketInquiry/ticketInquiry";
      } else if (this.currentTab === 2 && this.airMessage.fromTime) {
        jumpUrl = "/ticketInquiry/ticketRoundTrip";
      }
      uni.navigateTo({
        url: jumpUrl + "?data=" + JSON.stringify(this.airMessage),
      });
    },

    // 获取公告列表
    getNoticeList() {
      noticeApi.getNotice().then((res) => {
        if (res.errorcode === 10000) {
          // this.noticeList = res.data.data
          res.data.data.forEach((item, index) => {
            if (index < 5) {
              this.noticeList.push(item);
            }
          });
          console.log("首页", this.noticeList);
        }
      });
    },

    // 获取banner列表
    getBannerList() {
      let data = {
        type: "100",
      };
      userInfo.getAdvertisement(data).then((res) => {
        if (res.errorcode === 10000) {
          this.swiperList = res.data;
                    console.log('ad',this.swiperList)
        }
      });
    },

    getUserInfo() {
      userInfo.getUserInfo().then((res) => {
        console.log(res);
        uni.setStorageSync("userInfo", res);
      });
    },
  },
  onLoad() {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.setSwiperHeight();

    this.getUserInfo();

    this.getNoticeList();

    this.getBannerList(); // 获取banner
  },
  onShareAppMessage(res) {
    return {
      title: "云上航空机票分销",
      path: "/pages/index/index",
    };
  },
  onShow() {
    // 获取城市信息
    if (uni.getStorageSync("city")) {
      let cityData = JSON.parse(uni.getStorageSync("city"));
      console.log('首页城市地址',cityData);
      if (cityData.status === "to") {
        this.airMessage.to = cityData.data;
        if (cityData.type === "hot") {
          this.airMessage.to = cityData.data;
        }
        this.airMessage["to_type"] = cityData.type;
      } else if (cityData.status === "from") {
        this.airMessage.from = cityData.data;
        if (cityData.type === "hot") {
          this.airMessage.from = cityData.data;
        }
        this.airMessage["from_type"] = cityData.type;
      }
      uni.removeStorageSync("city");
    }
    // 获取时间日期
    if (uni.getStorageSync("time")) {
      let timeData = JSON.parse(uni.getStorageSync("time"));
      console.log("时间", timeData);
      if (timeData.status === "start") {
        this.airMessage["toTime"] = timeData;
      } else if (timeData.status === "end") {
        this.currentTab = 2;
        this.currentTrue = true;
        this.airMessage["fromTime"] = timeData;
      }

      this.$forceUpdate();

      console.log("时间返回", timeData);
      uni.removeStorageSync("time");
    }
    wx.login({
      success(res) {
        if (res.code) {
          console.log(res.code);
          uni.setStorageSync("userCode", res.code);
        } else {
          console.log("登录失败！" + res.errMsg);
        }
      },
    });
  },
};
</script>

<style lang="less" scoped>
.share-btn {
  position: absolute;
  opacity: 0;
}
.index {
  background: #f3f5f7;
  display: flex;
  flex-direction: column;
  height: 100vh;
  .index_main {
    flex: 1;
    overflow-y: auto;
  }

  .header_type {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 70upx;
    background-color: #fff;
    padding: 20upx 0;
    .type_title {
      font-size: 36upx;
      font-weight: 400;
      color: #333333;
      flex: 1;
      height: 70upx;
      line-height: 90upx;
      view {
        display: inline-block;
        position: relative;
      }
      &:first-child {
        padding-right: 87upx;
        text-align: right;
      }
      &:last-child {
        padding-left: 87upx;
        text-align: left;
      }
      &.active {
        font-size: 40upx;
        font-weight: 800;
        color: #333333;
        view {
          &::after {
            content: "";
            display: inline-block;
            width: 80upx;
            height: 12upx;
            background: linear-gradient(90deg, #fb9826 0%, #ffca61 100%);
            border-radius: 6upx;
            position: absolute;
            left: 50%;
            margin-left: -40upx;
            bottom: 0;
          }
        }
      }
    }
  }

  .header {
    padding: 20upx;
    background: #fff;
    .modal_tabs {
      .swiper-tab {
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 48upx;

        .swiper-tab-item {
          width: 160upx;
          height: 50upx;
          border: 2upx solid rgba(0, 112, 226, 1);
          opacity: 0.51;
          border-radius: 25upx;
          color: #434343;
          font-size: 28upx;
          font-weight: 400;
          color: rgba(0, 112, 226, 1);
          display: inline-flex;
          align-items: center;
          justify-content: center;

          &:not(:last-child) {
            margin-right: 20upx;
          }

          &.active {
            background: rgba(0, 112, 226, 1);
            border: 2upx solid rgba(0, 112, 226, 1);
            color: #fff;
            opacity: 1;
          }
        }
      }

      swiper {
        height: 328upx;
      }

      .tabs_main {
        transition: all 0.3s;
        // min-height: 75upx;
        // height: 328upx !important;
        .tabs_center {
          padding: 0 30upx;
        }
      }
    }

    .child_box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 50upx;
      padding: 0 30upx;

      .cabin {
        font-size: 28upx;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
      }

      .passenger_message {
        display: inline-flex;
        align-items: center;
        .child_message {
          background: url("@/static/waring_icon.png") no-repeat center center;
          background-size: contain;
          width: 30upx;
          height: 30upx;
          margin-right: 14upx;
        }
        .passenger_message_main {
          display: inline-flex;
          align-items: center;
          .passenger_list {
            display: inline-flex;
            align-items: center;
            font-size: 28upx;
            font-weight: 500;
            color: rgba(153, 153, 153, 1);
            &:not(:first-child) {
              margin-left: 26upx;
            }
            .number {
              font-size: 30upx;
              font-weight: bold;
              color: rgba(42, 42, 42, 1);
              margin-left: 8upx;
            }
          }
          .open_number_more {
            margin-left: 12upx;
            width: 16upx;
            height: 12upx;
            object-fit: contain;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }

    .multi_pass_message {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-size: 12px;
      font-weight: 400;
      color: rgba(0, 112, 226, 0.6);
      margin-top: 34upx;
      text-align: right;
      padding: 0 30upx;
      &::after {
        content: "";
        background: url(@/static/problem_icon.png) no-repeat center center;
        display: block;
        background-size: contain;
        width: 30upx;
        height: 30upx;
        margin-left: 12upx;
      }
    }

    .submit_btn {
      width: 650upx;
      height: 90upx;
      background: rgba(0, 112, 226, 1);
      box-shadow: 0 6upx 12upx rgba(0, 112, 226, 0.3);
      border-radius: 80upx;
      margin: 50upx auto 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32upx;
      font-weight: 400;
      line-height: 38upx;
      color: rgba(255, 255, 255, 1);
      letter-spacing: 6upx;
    }
  }

  .ticket_train {
    background-color: #fff;
    padding: 20upx;
    .train_space {
      height: 40upx;
    }
    .train_ticket_input {
      padding: 30upx;
    }
    .ticket_checkbox {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-left: 30upx;
      margin-top: 10upx;
      &.active {
        .checkbox_input {
          background: url(@/static/selected_active.png) no-repeat;
          background-size: contain;
        }
      }
      .checkbox_input {
        width: 36upx;
        height: 36upx;
        background: url(@/static/selected.png) no-repeat;
        background-size: contain;
      }
      .checkbox_title {
        font-size: 28upx;
        font-weight: 400;
        line-height: 28upx;
        color: #2a2a2a;
        margin-left: 12upx;
      }
    }
    .submit_btn {
      width: 650upx;
      height: 90upx;
      background: rgba(0, 112, 226, 1);
      box-shadow: 0 6upx 12upx rgba(0, 112, 226, 0.3);
      border-radius: 80upx;
      margin: 50upx auto 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32upx;
      font-weight: 400;
      line-height: 38upx;
      color: rgba(255, 255, 255, 1);
      letter-spacing: 6upx;
    }
  }

  .notice {
    margin-top: 30upx;
    background: #fff;
  }

  .ticket_explanation {
    .title {
      height: 140upx;
      background: rgba(255, 255, 255, 1);
      border-radius: 80upx 80upx 0 0;
      position: relative;
      border-bottom: 2upx solid rgba(217, 225, 234, 1);
      display: flex;
      align-items: flex-end;
      .explanation_header {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 0 120upx 0 90upx;

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
    .flight_explanation_main {
      background: rgba(255, 255, 255, 1);
      padding: 20upx 20upx 60upx;
    }
  }

  .child_dialog {
    .child_dialog_mian {
      background: #fff;
      border-radius: 80upx 80upx 0 0;
      position: relative;
      &::before {
        content: "";
        position: absolute;
        bottom: -120upx;
        width: 100%;
        height: 120upx;
        background-color: #fff;
        display: block;
      }
      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 120upx;
        border-bottom: 2upx solid rgba(217, 225, 234, 1);
        padding: 0 40upx;
        font-size: 28upx;
        font-weight: bold;
        .close {
          color: rgba(102, 102, 102, 1);
        }
        .submit {
          color: rgba(0, 112, 226, 1);
        }
      }
      .dialog_main {
        padding: 66upx 40upx;
        .child_main {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 30upx;
          border-bottom: 2upx solid rgba(241, 243, 245, 1);
          &:not(:first-child) {
            margin-top: 66upx;
          }
          .number_name {
            font-size: 30upx;
            font-weight: bold;
            color: rgba(51, 51, 51, 1);
            .number_name_message {
              font-size: 30upx;
              font-weight: 400;
              color: rgba(175, 185, 196, 1);
            }
          }
          .number_box {
            display: inline-flex;
            align-items: center;

            .number {
              font-size: 28upx;
              font-weight: 500;
              color: rgba(42, 42, 42, 1);
              margin: 0 10upx;
              min-width: 40upx;
              text-align: center;
            }

            .number_icon {
              width: 40upx;
              height: 40upx;

              &.remove_number {
                background: url(@/static/number_remove_btn.png) no-repeat;
                background-size: contain;
                &.active {
                  background: url(@/static/number_remove_btn_active.png) no-repeat;
                  background-size: contain;
                }
              }
              &.add_number {
                background: url(@/static/number_add_btn.png);
                background-size: contain;
              }
            }
          }
        }
      }
    }
  }
}
</style>
