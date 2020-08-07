<!--
 * @Description: 用户详细信息
 * @Author: wish.WuJunLong
 * @Date: 2020-08-03 15:05:48
 * @LastEditTime: 2020-08-03 16:15:31
 * @LastEditors: wish.WuJunLong
--> 
<template>
  <view class="user_details">
    <yun-header :statusHeight="iStatusBarHeight" :headerBottom="Number(10)" centerTitle="用户信息"></yun-header>

    <scroll-view :enable-back-to-top="true" :scroll-y="true" class="user_details_main">
      <view class="user_info box-shadow-style">
        <view class="detail_list">
          <view class="list_title">头像</view>

          <view class="list_message input-right-arrow">
            <view class="avatar">
              <image class="avatar_image" v-if="avatarUrl" :src="avatarUrl" mode="contain" />
              <image class="avatar_image" v-else src="@/static/avatar.png" mode="contain" />
              <button
                class="getUserButton"
                form-type="submit"
                open-type="getUserInfo"
                bindgetuserinfo="getUserInfo"
                @click="editAvatar()"
              ></button>
            </view>
          </view>
        </view>

        <view class="detail_list">
          <view class="list_title">登录名</view>

          <view class="list_message">{{userInfo.login_name}}</view>
        </view>

        <view class="detail_list">
          <view class="list_title">密码</view>

          <view class="list_message input-right-arrow" @click="jumpEditPassword()">*******</view>
        </view>
      </view>

      <view class="box-shadow-style">
        <view class="detail_list">
          <view class="list_title">分销商</view>

          <view class="list_message">{{userInfo.company_name}}</view>
        </view>

        <view class="detail_list">
          <view class="list_title">账号等级</view>

          <view class="list_message">{{userInfo.is_master === 1?'主账号':'子账号'}}</view>
        </view>

        <view class="detail_list">
          <view class="list_title">账号情况</view>

          <view class="list_message">
						<text v-if="userInfo.status === 1" class="normal">正常</text>
						<text v-else class="disable">禁用</text>
					</view>
        </view>
      </view>

      <view class="box-shadow-style">
        <view class="detail_list">
          <view class="list_title">联系人</view>

          <view class="list_message">{{userInfo.contact}}</view>
        </view>

        <view class="detail_list">
          <view class="list_title">联系电话</view>

          <view class="list_message">{{userInfo.phone}}</view>
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
      userInfo: {},
      avatarUrl: "",
    };
  },
  methods: {
    // 修改用户头像 调用微信头像
    editAvatar() {
      let that = this;
      uni.login({
        provider: "weixin",
        success: function (loginRes) {
          // 获取用户信息
          uni.getUserInfo({
            provider: "weixin",
            success: function (infoRes) {
              console.log(infoRes);
              that.avatarUrl = infoRes.userInfo.avatarUrl;
              uni.setStorageSync("avatarUrl", infoRes.userInfo.avatarUrl);
            },
          });
        },
      });
		},
		// 跳转登录密码页面
		jumpEditPassword(){
			uni.navigateTo({
					url: '/pages/userInfo/editPassword'
			});
		},
  },
  onLoad() {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.userInfo = uni.getStorageSync("userInfo");
		this.avatarUrl = uni.getStorageSync("avatarUrl");
		console.log(this.userInfo)
  },
};
</script>

<style lang="less" scoped>
.user_details {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: rgba(243, 245, 247, 1);
  .user_details_main {
    height: calc(100% - (88upx + var(--status-bar-height)));
    .box-shadow-style {
			padding: 0 20upx;
			&:not(:last-child){
				margin-bottom: 20upx;
			}
    }

    .detail_list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 100upx;
      &:not(:last-child) {
        border-bottom: 2upx solid #f1f3f5;
      }
      .list_title {
        font-size: 28upx;
        font-weight: bold;
        color: rgba(42, 42, 42, 1);
      }
      .list_message {
        font-size: 28upx;
        font-weight: 400;
        color: rgba(42, 42, 42, 1);
        .avatar {
          position: relative;
          width: 100upx;
          height: 100upx;
          background: rgba(0, 0, 0, 0);
          box-shadow: 0px 0px 10px rgba(0, 112, 226, 0.2);
          border-radius: 50%;
          overflow: hidden;
          margin: 22upx 24upx 22upx 0;
          .avatar_image {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
				}
				.normal{
					color: #5AB957;
				}
				.disable{
					color: #ff0000;
				}
        .getUserButton {
          width: 100%;
          height: 100%;
          display: block;
          position: absolute;
          opacity: 0;
          top: 0;
          left: 0;
        }
      }
    }
  }
}
</style>
