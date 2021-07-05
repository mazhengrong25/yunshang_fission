<!--
 * @Description: 自定义状态栏 - 单程往返
 * @Author: wish.WuJunLong
 * @Date: 2020-06-29 10:06:00
 * @LastEditTime: 2021-07-05 14:48:56
 * @LastEditors: wish.WuJunLong
-->
<template>
  <view
    :class="['yun_header', { white: headerColor }]"
    :style="{
      paddingTop: statusHeight + 'px',
      marginBottom: headerBottom + 'px',
    }"
  >
    <view v-if="showReturn" class="back_box">
      <view class="go_back" @click="goBack"></view>
      <view v-if="showHome" class="go_home" @click="goHome"></view>
    </view>
    <view class="center_title" v-if="centerTitle">{{ centerTitle }}</view>
    <view class="title" v-else>
      <view class="title_left">
        {{
          headerAddress.to_type === "air"
            ? headerAddress.to.air_port_name
            : headerAddress.to_type === "hot" && headerAddress.to.city_name === "上海"
            ? headerAddress.to.city_name + headerAddress.to.air_port_name
            : headerAddress.to_type === "hot" && headerAddress.to.city_name === "北京"
            ? headerAddress.to.city_name + "首都"
            : headerAddress.to.city_name || '获取中'
        }}
      </view>
      <view class="title_icon" v-if="!statusType"></view>
      <view class="title_icon roundTripIcon" v-else></view>
      <view class="title_right">
        {{
          headerAddress.from_type === "air"
            ? headerAddress.from.air_port_name
            : headerAddress.from_type === "hot" && headerAddress.from.city_name === "上海"
            ? headerAddress.from.city_name + headerAddress.from.air_port_name
            : headerAddress.from_type === "hot" && headerAddress.from.city_name === "北京"
            ? headerAddress.from.city_name + "首都"
            : headerAddress.from.city_name || '获取中'
        }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    showReturn: {
      // 显示返回按钮
      type: Boolean,
      default: () => true,
    },
    centerTitle: {
      // 居中文字标题
      type: String,
      default: () => "",
    },
    statusType: {
      // 导航栏状态 flase单程 true往返
      type: Boolean,
      default: () => false,
    },
    headerAddress: {
      type: Object,
      default: () => {},
    },
    statusHeight: {
      // 导航栏默认高度
      type: Number,
      default: () => 25,
    },
    headerBottom: {
      // 导航栏下边距
      type: Number,
      default: () => 0,
    },
    headerColor: {
      type: Boolean,
      default: () => false,
    },
    showHome: {
      // 返回主页按钮
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      iStatusBarHeight: 0, // 状态栏高度
    };
  },
  methods: {
    // 返回上一页按钮 如果上一页不存在 则返回主页
    goBack() {
      let pages = getCurrentPages();
      if (pages.length <= 1) {
        uni.switchTab({
          url: "/pages/index/index",
        });
      } else {
        uni.navigateBack();
      }
    },
    // 返回主页
    goHome() {
      uni.showModal({
        title: "提示",
        content: "是否离开当前页面返回主页？",
        success: function(res) {
          if (res.confirm) {
            uni.switchTab({
              url: "/pages/index/index",
            });
          }
        },
      });
    },
  },
  mounted() {},
};
</script>

<style scoped lang="less">
.yun_header {
  background: rgba(0, 112, 226, 1);
  width: 100vw;
  height: 88upx;
  display: flex;
  align-items: center;
  padding-top: var(--status-bar-height);
  z-index: 999;
  &.white {
    background: #fff;
    .back_box {
      .go_back {
        background: url(@/static/go_back_white.png) no-repeat center center;
        background-size: 23upx 31upx;
      }
    }
    .title,
    .center_title {
      color: #000;
    }
  }
  .back_box {
    display: inline-flex;
    align-items: center;
    position: absolute;
    left: 20upx;
    .go_back {
      background: url(@/static/go_back.png) no-repeat center center;
      background-size: 23upx 31upx;
      width: 50upx;
      height: 50upx;
    }
    .go_home {
      background: url(@/static/back_home.png) no-repeat center center;
      background-size: 35rpx 35rpx;
      width: 50rpx;
      height: 50rpx;
      margin-left: 30rpx;
    }
  }

  .center_title {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36upx;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
    letter-spacing: 10upx;
    width: 100%;
  }
  .title {
    font-size: 36upx;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
    letter-spacing: 10upx;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    .title_icon {
      background: url(@/static/ticket_header_path.png) no-repeat center center;
      background-size: contain;
      width: 35upx;
      height: 20upx;
      margin: 0 25upx;
      &.roundTripIcon {
        background: url(@/static/ticket_header_roundTripIcon.png) no-repeat center center;
        background-size: contain;
      }
    }
  }
}
</style>
