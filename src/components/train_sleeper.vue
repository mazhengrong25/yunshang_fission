<!--
 * @Description: 火车票 --- 展示卧铺价格
 * @Author: mzr
 * @Date: 2021-08-05 10:12:41
 * @LastEditTime: 2021-08-05 15:32:54
 * @LastEditors: mzr
-->
<template>
    <uni-popup class="train_sleeper_modal" ref="trainSleeper" type="bottom">
        <view class="sleeper_modal_box">
            <view class="modal_box_title">
                <view class="title_value">卧铺价格</view>
                <view class="close_btn" @click="closeSleeperModal()"></view>
            </view>
            <view class="modal_box_content">
               <view class="box_content_warn">*卧铺价格仅供参考，实际以占座成功后价格为准</view>
               <view class="content_list_box">
                <view class="box_content_list" v-for="(item,index) in trainbunkList" :key="index">
                  <view class="list_title">{{item.name + '铺'}}</view>
                  <view class="list_price">
                    <span>&yen;</span>
                    <view class="price_value">{{item.price}}</view>
                  </view>
                </view>
               </view>
            </view>
        </view>
    </uni-popup>
</template>

<script>
export default {
  props: {
      // 铺位信息
      trainbunkList: {
          type: Array,
          default: () => []
      },

  },
  data() {
      return {

      }
  },
  methods: {
      // 打开筛选
      openSleeperModal() {
          this.$refs.trainSleeper.open();
      },
      // 关闭弹出框
      closeSleeperModal() {
          this.$refs.trainSleeper.close();
      },
  }
}
</script>

<style lang="less" scoped>
.train_sleeper_modal {
  .sleeper_modal_box {
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
       height: 40vh;
       background: #fff;
      .box_content_warn {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 245, 233, 1);
        font-size: 28upx;
        font-weight: 400;
        color: #FB9826;
        padding: 20upx;
      }
      .content_list_box {
        padding: 0upx 40upx;
        .box_content_list {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 40upx 0upx;
          font-size: 28upx;
          font-weight: 400;
          color: #333333;
          .list_price {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            .price_value {
              margin-left: 10upx;
            }
          }
          &:not(:last-child) {
            border-bottom: 1upx solid #F1F3F5;
          }
        }
      }
    }
  }
}
</style>