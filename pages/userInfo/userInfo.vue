<!--
 * @Description: 
 * @Author: wish.WuJunLong
 * @Date: 2020-06-16 13:42:30
 * @LastEditTime: 2020-07-31 15:55:59
 * @LastEditors: wish.WuJunLong
--> 
<template>
  <view class="user_info">
    <view class="header">
      <view class="header_box box-shadow-style">
        <view class="info_box">
          <view class="info_left">
            <view class="avatar">
              <image class="avatar_image" src="@/static/avatar.png" mode="contain" />
            </view>
            <view class="left_message">
              <view class="user_name">LISA</view>
              <view class="user_type">分销国际测试</view>
            </view>
          </view>
          <view class="info_right">
            <view class="info_btn">用户信息</view>
          </view>
        </view>

        <view class="wallet_box">
          <view class="wallet_info">
            <view class="wallet_title">钱包余额</view>
            <view class="wallet_number">
              <text class="wallet_symbol">&yen;</text>8000000.00
            </view>
          </view>
        </view>



				
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style scoped lang="less">
.user_info {
  .header {
    position: relative;
    padding-top: 26upx;
    &::before {
      content: "";
      display: block;
      width: 100%;
      height: 200upx;
      background: rgba(0, 112, 226, 1);
      position: absolute;
      top: 0;
      z-index: 0;
    }
    .header_box {
      position: relative;
      border-radius: 20upx;
      box-shadow: none;

      .info_box {
        height: 174upx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .info_left {
          display: flex;
          align-items: center;
          .avatar {
            width: 100upx;
            height: 100upx;
            background: rgba(0, 0, 0, 0);
            box-shadow: 0px 0px 10px rgba(0, 112, 226, 0.2);
            border-radius: 50%;
            overflow: hidden;
            margin-right: 30upx;
            .avatar_image {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          }
          .left_message {
            .user_name {
              font-size: 32upx;
              font-weight: bold;
              color: rgba(51, 51, 51, 1);
            }
            .user_type {
              margin-top: 8upx;
              font-size: 28upx;
              font-weight: 400;
              color: rgba(175, 185, 196, 1);
            }
          }
        }
        .info_right {
          .info_btn {
            background: linear-gradient(
              90deg,
              rgba(0, 112, 226, 1) 0%,
              rgba(86, 197, 255, 1) 100%
            );
            box-shadow: 0 6upx 12upx rgba(0, 112, 226, 0.3);
            border-radius: 80upx;
            height: 60upx;
            padding: 0 28upx;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 28upx;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
          }
        }
      }
    }
  }
}
</style>
