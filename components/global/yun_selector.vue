<!--
 * @Description: 弹窗选择器
 * @Author: wish.WuJunLong
 * @Date: 2020-07-29 17:14:32
 * @LastEditTime: 2020-07-31 11:54:41
 * @LastEditors: wish.WuJunLong
--> 
<template>
  <uni-popup ref="selectorPopup" type="bottom" class="yun_selector">
    <view class="main">
      <view class="title">
        <view class="close_dialog" @click="closeDialog">取消</view>
        <view class="title_btn" v-if="addGroup" @click="addGroupBtn">
					<image class="title_btn_icon" src="@/static/add_group_icon.png" mode="contain" />
					新增分组
					</view>
        <view class="submit_btn" @click="submitBtn">确定</view>
      </view>

      <view class="content">
        <picker-view
          :indicator-style="indicatorStyle"
          :value="index"
          class="content_view"
          @change="bindChange"
        >
          <picker-view-column>
            <view class="item" v-for="(item,index) in dataList" :key="index">{{item}}</view>
          </picker-view-column>
        </picker-view>
      </view>
    </view>
  </uni-popup>
</template>

<script>
export default {
	props: {
		dataList: {  // 选择器数组
			type: Array,
			default: () => []
		},
		addGroup: {
			type: Boolean,
			default: () => false
		},
	},
  data() {
    return {
			activeIndex: 0,
			pickDataIndex: 0,
      indicatorStyle: `height: ${Math.round(
        uni.getSystemInfoSync().screenWidth / (750 / 100)
      )}px;`,
    };
  },
  methods: {
    bindChange(e) {
			this.pickDataIndex = e.detail.value
    },
    // 打开弹窗
    openDialog() {
      this.$refs.selectorPopup.open();
		},
		// 打开新增分组
		addGroupBtn(){

		},
    // 关闭弹出框
    closeDialog() {
      this.$refs.selectorPopup.close();
		},
		// 确定按钮
		submitBtn(){
			console.log(this.dataList[this.pickDataIndex])
			this.$refs.selectorPopup.close();
			this.$emit('submitDialog', this.dataList[this.pickDataIndex])
		},
  },
};
</script>

<style lang="less" scoped>
.yun_selector {
  .main {
    background: rgba(255, 255, 255, 1);
    border-radius: 80upx 80upx 0 0;
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
      padding: 50upx 40upx 30upx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2upx solid rgba(217, 225, 234, 1);
      .close_dialog {
        font-size: 28upx;
        font-weight: bold;
        color: rgba(102, 102, 102, 1);
      }
      .title_btn {
        width: 220upx;
        height: 60upx;
        border: 2upx solid rgba(0, 112, 226, 1);
        border-radius: 30upx;
        font-size: 28upx;
        font-weight: 400;
				color: rgba(0, 112, 226, 1);
				display: flex;
				align-items: center;
				justify-content: center;
				.title_btn_icon{
					width: 22upx;
					height: 22upx;
					margin-right: 10upx;
				}
      }
      .submit_btn {
        font-size: 28upx;
        font-weight: bold;
        color: rgba(0, 112, 226, 1);
      }
    }
    .content {
      min-height: 560upx;
      width: 100%;
      display: flex;
      align-items: center;
      .content_view {
        width: 100%;
        height: 500upx;
        .item {
          text-align: center;
          width: 100%;
          height: 100upx !important;
          line-height: 100upx;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 40upx;
        }
      }
    }
  }
}
</style>
