<!--
 * @Description: 首页公告版块组件
 * @Author: wish.WuJunLong
 * @Date: 2020-06-15 18:03:52
 * @LastEditTime: 2021-11-12 11:27:24
 * @LastEditors: mzr
--> 
<template>
  <view class="modal_notice">
    <view class="notice_header" v-if="modelType">
      <view class="title">
        <image class="title_icon" src="@/static/notice.png" mode="contain" />最新公告
      </view>
      <view class="notice_more" @click="jumpNotice()">查看更多...</view>
    </view>

    <view class="notice_list">
      <view
        class="notice_box"
        v-for="(item, index) in noticeList"
        :key="index"
        @click="jumpNoticeDetails(item)"
      >
        <view class="notice_content">
          <view class="notice_title">
            <text class="title">{{$dateTool(item.created_at,'M月DD日')}}</text>
            <view class="time">{{$dateTool(item.created_at,'ddd')}}</view>
          </view>
          <view class="notice_text">{{item.title}}</view>
        </view>
        <image class="notice_btn" src="@/static/arrow.png" />
      </view>
    </view>
  </view>
</template>

<script>
import noticeApi from "@/api/notice"; // 公告api

export default {
  props: {
    modelType: {
      type: Boolean,
      default: () => false,
    },
    noticeList: {
      type: Array,
      default: () => [],
    },
    // 0  机票  1 火车票
    switchNotice: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {};
  },
  methods: {
    // 跳转更多公告页
    jumpNotice() {
      uni.navigateTo({
        url: "/pages/notice/notice?switchNotice="+this.switchNotice,
      });
    },

    // 跳转详情页
    jumpNoticeDetails(val) {
			console.log(val)
			let content = val.content
			delete val.content
			let data = val
      uni.navigateTo({
        url: "/pages/notice/noticeDetails?data="+JSON.stringify(data.id),
      });
		},
	},
};
</script>

<style scoped lang="less">
.modal_notice {
  .notice_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32upx 40upx 50upx;
    .title {
      font-size: 32upx;
      font-weight: bold;
      color: rgba(42, 42, 42, 1);
      display: inline-flex;
      align-items: center;
      .title_icon {
        width: 32upx;
        height: 32upx;
        object-fit: contain;
        margin-right: 12upx;
      }
    }
    .notice_more {
      font-size: 24upx;
      font-weight: 400;
      color: rgba(175, 185, 196, 1);
    }
  }
  .notice_list {
    padding: 0 50upx;
    .notice_box {
      border-bottom: 1px solid #f1f3f5;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 14upx;
      &:not(:first-child){
        margin-top: 50upx;
      }
      .notice_content {
        width: 90%;

        .notice_title {
          display: flex;
          align-items: center;
          margin-bottom: 14upx;
          .title {
            font-size: 28upx;
            font-weight: bold;
            line-height: 38upx;
            color: rgba(42, 42, 42, 1);
          }
          .time {
            padding: 2upx 8upx;
            background: rgba(175, 185, 196, 1);
            opacity: 0.61;
            font-size: 20upx;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            margin-left: 16upx;
          }
        }

        .notice_text {
          font-size: 24upx;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .notice_btn {
        width: 12upx;
        height: 20upx;
        object-fit: contain;
      }
    }
  }
}
</style>
