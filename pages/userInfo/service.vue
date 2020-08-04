<!--
 * @Description: 客服服务
 * @Author: wish.WuJunLong
 * @Date: 2020-08-04 15:02:16
 * @LastEditTime: 2020-08-04 15:32:05
 * @LastEditors: wish.WuJunLong
-->
<template>
  <view class="service">
    <yun-header :statusHeight="iStatusBarHeight" :headerColor="true" centerTitle="详情"></yun-header>
    <view class="service_banner">
      <image src="@/static/service_banner.png" mode="aspectFit" />
    </view>
    <scroll-view :scroll-y="true" class="serive_center">
      <view class="serive_list">
        <view class="list_item">
          <view class="item_icon">
            <image src="@/static/service_1.png" mode="aspectFit" />
          </view>
          <view class="item_title">国内业务</view>
        </view>
				<view class="list_item">
          <view class="item_icon">
            <image src="@/static/service_2.png" mode="aspectFit" />
          </view>
          <view class="item_title">国内团队</view>
        </view>
				<view class="list_item">
          <view class="item_icon">
            <image src="@/static/service_3.png" mode="aspectFit" />
          </view>
          <view class="item_title">国际票务</view>
        </view>
				<view class="list_item">
          <view class="item_icon">
            <image src="@/static/service_4.png" mode="aspectFit" />
          </view>
          <view class="item_title">国际团队</view>
        </view>
				<view class="list_item">
          <view class="item_icon">
            <image src="@/static/service_5.png" mode="aspectFit" />
          </view>
          <view class="item_title">营销中心</view>
        </view>
				<view class="list_item">
          <view class="item_icon">
            <image src="@/static/service_6.png" mode="aspectFit" />
          </view>
          <view class="item_title">结算中心</view>
        </view>
				<view class="list_item">
          <view class="item_icon">
            <image src="@/static/service_7.png" mode="aspectFit" />
          </view>
          <view class="item_title">投诉中心</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
			iStatusBarHeight: 0,
    };
  },
  onLoad() {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
  },
};
</script>

<style lang="less" scoped>
.service {
  background: rgba(243, 245, 247, 1);
  display: flex;
  flex-direction: column;
  height: 100vh;
  .service_banner {
		width: 100vw;
		height: 300upx;
    image {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .serive_center {
		flex: 1;
		margin-top: 10upx;
		box-sizing: border-box;
    .serive_list {
      background: rgba(255, 255, 255, 1);
      display: flex;
			flex-wrap: wrap;
			justify-content: flex-start;
      .list_item {
				width: 33.3%;
				height: 260upx;
				flex-shrink: 0;
        border-right: 2upx solid #f1f3f5;
        border-bottom: 2upx solid #f1f3f5;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
				text-align: center;
				box-sizing: border-box;
				&:nth-child(3n){
					border-right-color: transparent;
				}
				&:last-child{
					border-bottom-color: transparent;
				}
        .item_icon {
          width: 86upx;
          height: 86upx;
          image {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }
        .item_title {
          margin-top: 20upx;
          font-size: 30upx;
          font-weight: 400;
          color: rgba(42, 42, 42, 1);
        }
      }
    }
  }
}
</style>
