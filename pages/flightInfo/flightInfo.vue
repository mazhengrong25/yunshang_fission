<!--
 * @Description: 机票信息
 * @Author: wish.WuJunLong
 * @Date: 2020-06-23 10:58:46
 * @LastEditTime: 2020-07-30 11:39:34
 * @LastEditors: wish.WuJunLong
--> 
<template>
  <scroll-view :enable-back-to-top="true" class="flight_info">
    <yun-header
      :statusHeight="iStatusBarHeight"
      :headerAddress="ticketAddress"
      :headerBottom="Number(10)"
    ></yun-header>
    <flight-header :flightData="flightData"></flight-header>

    <view class="flight_cabin">
      <view class="cabin_header">
        <view
          :class="['cabin_header_box',{'is_active': current === index}]"
          @click="checkedHeader(index)"
          v-for="(item, index) in cabinHeader"
          :key="index"
        >
          {{item}}
          <view class="cabin_header_line"></view>
        </view>
      </view>

      <swiper class="cabin_content" @change="change" :current="current">
        <swiper-item>
          <view class="cabin_content_item">
            <flight-item v-for="(item, index) in cabinList" :key="index" :flightData="item"></flight-item>
          </view>
        </swiper-item>
        <swiper-item>
          <view class="cabin_content_item">经济舱</view>
        </swiper-item>
        <swiper-item>
          <view class="cabin_content_item">公务头等舱</view>
        </swiper-item>
      </swiper>
    </view>

    <uni-popup ref="flightExplanation" type="bottom">
      <view class="flight_explanation">
        <view class="title">
          <view class="close_btn" @click="closePopup"></view>
          <view class="explanation_header">
            <view
              @click="checkedExplanationBtn(0)"
              :class="['header_btn',{'is_active': popupCurrent === 0}]"
            >产品说明</view>
            <view
              @click="checkedExplanationBtn(1)"
              :class="['header_btn',{'is_active': popupCurrent === 1}]"
            >退改签</view>
            <view
              @click="checkedExplanationBtn(2)"
              :class="['header_btn',{'is_active': popupCurrent === 2}]"
            >行李额</view>
          </view>
        </view>
        <view class="flight_explanation_main">
          <swiper class="explanation_content" @change="popupChange" :current="popupCurrent">
            <swiper-item>
              <view class="popup_content_item">航班信息</view>
            </swiper-item>
            <swiper-item>
              <view class="popup_content_item">经济舱</view>
            </swiper-item>
            <swiper-item>
              <view class="popup_content_item">公务头等舱</view>
            </swiper-item>
          </swiper>
        </view>
      </view>
    </uni-popup>
  </scroll-view>
</template>

<script>
import flightHeader from "@/components/flight_header.vue";
import flightItem from "@/components/flight_item.vue";
export default {
  components: {
    flightHeader,
    flightItem,
  },
  data() {
    return {
      iStatusBarHeight: 0, // 导航栏高度
      ticketAddress: {
        // 导航栏地址
        to: "重庆",
        from: "北京",
      },
      flightData: {
        // 航班头部信息
        flightType: "单程", // 航程类型
        time: "2020-4-18 周六", // 航程日期
        fromTime: "08:00", // 出发时间
        fromAddress: "重庆江北机场T3", // 出发机场
        duration: "2h30m", // 飞行时长
        toTime: "10:32", // 到达时间
        toAddress: "北京首都机场T3", // 到达机场
        airline: "南航", // 航司
        model: "空客A320(中)", // 机型
        food: "有早餐", // 餐饮
      },
      cabinHeader: ["特价", "经济舱", "公务/头等舱"], // 舱位选择列表
      current: 0, // 轮播图下标
      cabinList: [
        {
          // 舱位列表
          price: 695, // 价格
          priceMessage: true, // 是否包含燃油
          reward: 15, // 奖励金
          voteNumber: 8, // 剩余票数
        },
        {
          // 舱位列表
          price: 732, // 价格
          priceMessage: false, // 是否包含燃油
          reward: 0, // 奖励金
          voteNumber: 12, // 剩余票数
        },
        {
          // 舱位列表
          price: 732, // 价格
          priceMessage: false, // 是否包含燃油
          reward: 0, // 奖励金
          voteNumber: 12, // 剩余票数
        },
        {
          // 舱位列表
          price: 732, // 价格
          priceMessage: false, // 是否包含燃油
          reward: 0, // 奖励金
          voteNumber: 12, // 剩余票数
        },
        {
          // 舱位列表
          price: 732, // 价格
          priceMessage: false, // 是否包含燃油
          reward: 0, // 奖励金
          voteNumber: 12, // 剩余票数
        },
        {
          // 舱位列表
          price: 732, // 价格
          priceMessage: false, // 是否包含燃油
          reward: 0, // 奖励金
          voteNumber: 12, // 剩余票数
        },
        {
          // 舱位列表
          price: 732, // 价格
          priceMessage: false, // 是否包含燃油
          reward: 0, // 奖励金
          voteNumber: 12, // 剩余票数
        },
      ],

      popupCurrent: 0, // 弹窗轮播下标
    };
  },
  methods: {
    // 舱位等级选择
    checkedHeader(index) {
      this.current = index;
    },
    // 轮播切换
    change(e) {
      this.current = e.detail.current;
    },
    // 关闭产品说明弹窗
    closePopup() {
      this.$refs.flightExplanation.close();
    },

    // 弹窗轮播标题切换
    checkedExplanationBtn(index) {
      this.popupCurrent = index;
    },
    // 弹窗轮播切换
    popupChange(e) {
      this.popupCurrent = e.detail.current;
    },
  },
  onLoad() {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
  },
};
</script>

<style scoped lang="less">
.flight_info {
  background: rgba(243, 245, 247, 1);
  display: flex;
  flex-direction: column;
  height: 100vh;

  .flight_cabin {
    flex: 1;
    display: flex;
    flex-direction: column;

    .cabin_header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(223, 238, 254, 1);
      border-radius: 20upx 20upx 0 0;
      padding: 0 60upx;
      margin: 0 20upx;

      .cabin_header_box {
        font-size: 30upx;
        font-weight: 400;
        color: rgba(123, 155, 193, 1);
        height: 90upx;
        line-height: 90upx;
        position: relative;

        &.is_active {
          font-weight: bold;
          color: rgba(51, 51, 51, 1);

          .cabin_header_line {
            position: absolute;
            bottom: 0;
            left: 0;
            display: flex;
            align-items: center;
            opacity: 1;
            width: 100%;

            &::before {
              content: "";
              width: 12upx;
              height: 6upx;
              background: rgba(30, 139, 249, 1);
              border-radius: 6upx;
              margin-right: 4upx;
            }

            &::after {
              content: "";
              flex: 1;
              height: 6upx;
              background: rgba(30, 139, 249, 1);
              border-radius: 6upx;
            }
          }
        }

        .cabin_header_line {
          opacity: 0;
          transition: opacity 0.3s;
        }
      }
    }

    .cabin_content {
      flex: 1;
      height: calc(100vh - 555upx);

      .cabin_content_item {
        overflow-y: auto;
        height: 100%;
        padding: 0 20upx;
        flex: 1;
      }
    }
  }

  .flight_explanation {
    position: relative;
    &::before {
      content: "";
      position: absolute;
      bottom: -120upx;
      width: 100%;
      height: 120upx;
      background-color: #fff;
    }
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
}
</style>
