<!--
 * @Description: 乘机人列表
 * @Author: wish.WuJunLong
 * @Date: 2020-07-23 17:09:14
 * @LastEditTime: 2020-07-31 13:39:39
 * @LastEditors: wish.WuJunLong
--> 
<template>
  <view class="passenger">
    <yun-header :statusHeight="iStatusBarHeight" centerTitle="选择乘机人"></yun-header>
    <view class="header_box">
      <view class="add_passenger_btn" @click="jumpAddPassenger()">
        <image class="add_icon" src="@/static/add_passenger_btn.png" mode />
        <text>新增乘机人</text>
      </view>
    </view>

    <view class="passenger_main">
      <view class="mian_header">
        <view class="title">常用乘机人</view>
        <view class="filter" @click="openGroupSelect">
          <text>{{group?group + '分组': '筛选'}}</text>
          <image class="filter_icon" src="@/static/arrow_bule.png" mode="contain" />
        </view>
      </view>

      <scroll-view :scroll-y="true" class="mian_list">
        <view
          class="list_item"
          v-for="(item, index) in passengerList"
          :key="index"
          @click="checkedPassenger(item, index)"
        >
          <view class="checked">
            <radio :checked="item.checked" color="#0070E2" />
          </view>
          <view class="item_info">
            <view class="info_top">
              <view class="type">{{item.type}}</view>
              <view class="user_name">{{item.userName}}</view>
              <view class="position">{{item.position?item.position:'未分组'}}</view>
            </view>
            <view class="info_bottom">
              <view class="bottom_title">{{item.type === '成人'? '身份证': '出生证明'}}</view>
              <view class="card">{{item.idCard}}</view>
            </view>
          </view>

          <view class="edit_btn"></view>
        </view>
      </scroll-view>
    </view>

    <!-- 筛选弹窗 -->
    <yun-selector
      ref="groupPopup"
      :dataList="groupList"
      @submitDialog="groupPopupSelecctBtn()"
    ></yun-selector>

    <view class="submit_box">
      <button class="submit_btn" @click="returnBtn">确认</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      iStatusBarHeight: 0, // 状态栏高度

      group: "", // 分组筛选
      groupList: ["人事部", "产品部", "市场营销部", "IT部", "未分组"], // 分组列表

      passengerList: [
        // 乘机人列表
        {
          id: 1,
          type: "成人",
          userName: "白大飞",
          position: "销售部",
          idCard: "500123123412341234",
          checked: false,
        },
        {
          id: 2,
          type: "儿童",
          userName: "白小飞",
          position: "",
          idCard: "500123123412341234",
          checked: false,
        },
        {
          id: 3,
          type: "婴儿",
          userName: "白飞飞",
          position: "",
          idCard: "500123123412341234",
          checked: false,
        },
      ],
    };
  },
  methods: {
    // 跳转新增乘机人
    jumpAddPassenger() {
      uni.navigateTo({
        url: "/pages/flightReservation/addPassenger",
      });
    },

    // 打开分组弹窗
    openGroupSelect() {
      this.$refs.groupPopup.openDialog();
    },
    // 确认分组
    groupPopupSelecctBtn(e) {
      this.group = e;
    },

    // 选中乘机人
    checkedPassenger(data, index) {
      this.passengerList[index].checked = !this.passengerList[index].checked;
    },

    // 确认乘机人
    returnBtn() {},
  },
  onLoad() {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
  },
};
</script>

<style lang="less" scoped>
.passenger {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: rgba(243, 245, 247, 1);
  .header_box {
    height: 144upx;
    background: rgba(0, 112, 226, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    .add_passenger_btn {
      border: 2upx solid rgba(255, 255, 255, 1);
      width: 710upx;
      height: 90upx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 90upx;
      font-size: 26upx;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      letter-spacing: 6upx;
      .add_icon {
        width: 35upx;
        height: 35upx;
        margin-right: 12upx;
      }
    }
  }
  .passenger_main {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    .mian_header {
      padding: 0 40upx;
      margin: 40upx 0 30upx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        font-size: 30upx;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
      }
      .filter {
        font-size: 24upx;
        font-weight: bold;
        color: rgba(0, 112, 226, 1);
        .filter_icon {
          width: 16upx;
          height: 12upx;
          object-fit: contain;
          margin-left: 14upx;
        }
      }
    }
    .mian_list {
      overflow-y: auto;
      flex: 1;
      .list_item {
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 12upx 18upx rgba(0, 0, 0, 0.04);
        border-radius: 20upx;
        padding: 28upx 40upx 40upx 20upx;
        margin: 20upx 20upx 0;
        display: flex;
        align-items: center;

        .checked {
          margin-right: 26upx;
          radio {
            transform: scale(0.7);
          }
        }

        .item_info {
          .info_top {
            display: flex;
            align-items: center;
            margin-bottom: 32upx;
            .type {
              border: 2upx solid rgba(127, 183, 240, 1);
              border-radius: 20upx;
              font-size: 20upx;
              font-weight: 400;
              color: rgba(127, 183, 240, 1);
              padding: 2upx 20upx;
              margin-right: 16upx;
            }
            .user_name {
              font-size: 28upx;
              font-weight: bold;
              color: rgba(42, 42, 42, 1);
              margin-right: 16upx;
            }
            .position {
              font-size: 22upx;
              font-weight: 400;
              color: rgba(153, 153, 153, 1);
            }
          }
          .info_bottom {
            display: flex;
            .bottom_title {
              font-size: 26upx;
              font-weight: 400;
              color: rgba(42, 42, 42, 1);
              margin-right: 24upx;
            }
            .card {
              font-size: 26upx;
              font-weight: 400;
              color: rgba(42, 42, 42, 1);
            }
          }
        }
        .edit_btn {
          background: url(@/static/edit_icon.png) no-repeat center center;
          background-size: contain;
          width: 30upx;
          height: 30upx;
          margin-left: auto;
        }
      }
    }
  }
  .submit_box {
    background: rgba(255, 255, 255, 1);
    height: 100upx;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 24upx;
    padding-bottom: var(--status-bar-height);
    border-top: 2upx solid rgba(229, 229, 229, 1);
    .submit_btn {
      flex: 1;
      height: 90upx;
      margin: 0 50upx;
      background: linear-gradient(
        90deg,
        rgba(0, 112, 226, 1) 0%,
        rgba(86, 197, 255, 1) 100%
      );
      box-shadow: 0 6upx 12upx rgba(0, 112, 226, 0.3);
      border-radius: 80upx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32upx;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      letter-spacing: 10upx;
    }
  }
}
</style>
