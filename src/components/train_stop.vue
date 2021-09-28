<!--
 * @Description: 火车票  ---  经停站
 * @Author: mzr
 * @Date: 2021-08-04 11:31:25
 * @LastEditTime: 2021-09-28 17:01:23
 * @LastEditors: wish.WuJunLong
-->
<template>
  <uni-popup class="train_stop_modal" ref="trainStop" type="bottom">
    <view class="stop_modal_box">
      <view class="modal_box_title">
        <view class="title_value">经停站</view>
        <view class="close_btn" @click="closeStopModal()"></view>
      </view>

      <view class="modal_box_content">
        <view class="content_title content_th">
          <view class="title_dot"></view>
          <view class="title_type" style="width: 200rpx">车站</view>
          <view class="title_type">到达</view>
          <view class="title_type">发车</view>
          <view class="title_type" style="text-align:right">停留</view>
        </view>
        <scroll-view class="content_scroll" scroll-y="true" scroll-with-animation="true">
          <view
            :class="[
              'content_title',
              {
                active:
                  item.station === activeObject.arrive_name ||
                  item.station === activeObject.departure_name,
              },
            ]"
            v-for="(item, index) in trainStopList"
            :key="index"
          >
            <view class="title_dot"></view>
            <view class="title_type" style="width: 200rpx">{{ item.station }}</view>
            <view class="title_type">{{ item.arrive }}</view>
            <view class="title_type">{{ item.start }}</view>
            <view class="title_type" style="text-align:right">{{ item.stop }}</view>
          </view>
        </scroll-view>
      </view>
    </view>
  </uni-popup>
</template>

<script>
export default {
  props: {
    // 经停车站数组
    trainStopList: {
      type: Array,
      default: () => [],
    },

    // 当前车站
    activeObject: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  methods: {
    // 打开筛选
    openStopModal() {
      this.$refs.trainStop.open();
    },
    // 关闭弹出框
    closeStopModal() {
      this.$refs.trainStop.close();
    },
  },
};
</script>

<style lang="less" scoped>
.train_stop_modal {
  .stop_modal_box {
    position: relative;
    z-index: 999;
    &::before {
      content: "";
      position: absolute;
      bottom: -120upx;
      width: 100%;
      height: 120upx;
      background-color: #fff;
    }
    .modal_box_title {
      background: #ffffff;
      border-radius: 80upx 80upx 0upx 0upx;
      border-bottom: 2upx solid #d9e1ea;
      padding: 42upx 28upx;
      display: flex;
      justify-content: center;
      align-items: center;
      .title_value {
        font-size: 36upx;
        font-weight: bold;
        color: #333333;
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
    .modal_box_content {
      background: #fff;
      padding: 40upx 0 40upx 40upx;

      .content_scroll {
        max-height: 32vh;
        overflow-y: auto;
        box-sizing: border-box;
      }
      .content_title {
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        font-size: 26upx;
        font-weight: 400;
        color: #999999;
        width: 100%;
        padding-right: 40rpx;
        box-sizing: border-box;
        &.active {
          color: #0070e2;
          .title_dot {
            background: #0070e2;
          }
        }
        &.content_th {
          margin-bottom: 30upx;
          .title_dot {
            opacity: 0;
            &::after {
              opacity: 0;
            }
          }
          font-size: 26upx;
          font-weight: 400;
          color: #333333;
        }
        &:not(:last-child) {
          .title_dot {
            &::after {
              content: "";
              display: inline-block;
              border-left: 2upx dotted #d9e1ea;
              height: 50upx;
              position: absolute;
              top: 14upx;
              left: 50%;
              margin-left: -1upx;
              z-index: 1;
            }
          }
        }
        .title_dot {
          width: 14upx;
          height: 14upx;
          background: #d9e1ea;
          border-radius: 50%;
          position: relative;
        }
        .title_type {
          min-width: 110upx;
          flex-shrink: 0;
        }
        &:not(:last-child) {
          margin-bottom: 30upx;
        }
      }
    }
  }
}
</style>
