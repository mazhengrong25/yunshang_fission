<!--
 * @Description: 订单筛选页面
 * @Author: wish.WuJunLong
 * @Date: 2020-08-17 10:31:20
 * @LastEditTime: 2020-09-09 18:27:07
 * @LastEditors: mazhengrong
-->
<template>
  <view class="filter">
    <yun-header :statusHeight="iStatusBarHeight" centerTitle="筛选"></yun-header>

    <scroll-view :enable-back-to-top="true" :scroll-y="true" class="filter_main">
      <view class="list_item">
        <view class="item_title">日期条件</view>
        <view class="item_content item_checkbox">
          <view
            :class="['checkbox_item',{'active': item.active}]"
            v-for="item in dateFilter"
            :key="item"
            @click="activeDate(item)"
          >{{item.name}}</view>
        </view>
      </view>
      <view class="list_item">
        <view class="item_title">订单状态</view>
        <view class="item_content item_checkbox">
          <view
            :class="['checkbox_item',{'active': item.active}]"
            v-for="item in orderStatus"
            :key="item"
            @click="activeOrderStatus(item)"
          >{{item.name}}</view>
        </view>
      </view>

      <view class="list_item">
        <view class="item_title">时间范围</view>
        <view class="item_content item_dialog">
          <view
            :class="['dialog_view',{input_placeholder: !timeLimit.start}]"
            @click="openlimitdaySelector('start')"
          >{{timeLimit.start?timeLimit.start:'预定日始'}}</view>
          <view class="dialog_line">—</view>
          <view
            :class="['dialog_view',{input_placeholder: !timeLimit.end}]"
            @click="openlimitdaySelector('end')"
          >{{timeLimit.end?timeLimit.end:'预定日止'}}</view>
        </view>
      </view>

      <view class="list_item">
        <view class="item_title">城市选择</view>
        <view class="item_content item_dialog">
          <view
            :class="['dialog_view',{input_placeholder: !citySelect.start}]"
            @click="whereToBtn()"
          >{{citySelect.start?citySelect.start:'出发城市'}}</view>
          <view class="dialog_line">—</view>
          <view
            :class="['dialog_view',{input_placeholder: !citySelect.end}]"
            @click="whereFromBtn()"
          >{{citySelect.end?citySelect.end:'到达城市'}}</view>
        </view>
      </view>

      <view class="list_item list_input">
        <view class="item_title">PNR</view>
        <input
          type="text"
          class="item_input"
          v-model="pnr"
          placeholder="请填写PNR"
          placeholder-class="input_placeholder"
        />
      </view>
      <view class="list_item list_input">
        <view class="item_title">订单号</view>
        <input
          type="text"
          class="item_input"
          v-model="orderNumber"
          placeholder="请填写订单号"
          placeholder-class="input_placeholder"
        />
      </view>
      <view class="list_item list_input">
        <view class="item_title">航班号</view>
        <input
          type="text"
          class="item_input"
          v-model="flightNumber"
          placeholder="请填写航班号"
          placeholder-class="input_placeholder"
        />
      </view>
      <view class="list_item list_input">
        <view class="item_title">订票员</view>
        <view class="item_input input-right-arrow" @click="openGroupSelect">请选择</view>
      </view>
    </scroll-view>

    <!-- 选择日期 -->
    <yun-selector ref="limitdayPopup" selectType="date" @submitDialog="limitdaySelecctBtn()"></yun-selector>
    <!-- 订票员选择 -->
    <!-- <yun-selector
      ref="groupPopup"
      :dataList="groupList"
      :dataItem="'group_name'"
      @submitDialog="groupPopupSelecctBtn()"
    ></yun-selector> -->
    <flight-filter-dialog ref="filterDialog" 
    @ticketFilterData="ticketFilter"
    :flightType="false" 
    :checkboxGroup="nameGroup"
    ></flight-filter-dialog>
    <!-- 按钮组 -->
    <view class="filter_bottom">
      <view class="bottom_btn reset_btn" @click="resetBtn">重置</view>

      <view class="bottom_btn submit_btn" @click="yesBtn">确定</view>
    </view>
  </view>
</template>

<script>
// import flightFilterDialog from "@/components/flight_filter_dialog.vue"; // 航班筛选弹窗
export default {
   components: {
    // flightFilterDialog,
  },
  data() {
    return {
      iStatusBarHeight: 0,

      dateFilter: [
        // 日期条件筛选列表
        {
          name: "预定日期",
          active: false,
        },
        {
          name: "起飞时间",
          active: false,
        },
        {
          name: "出票日期",
          active: false,
        },
      ],
      orderStatus: [
        // 订单状态筛选列表
        {
          name: "已预订",
          active: false,
        },
        {
          name: "待出票",
          active: false,
        },
        {
          name: "已出票",
          active: false,
        },
        {
          name: "已取消",
          active: false,
        },
      ],
      timeLimit: {
        // 时间范围
        start: "",
        end: "",
      },
      citySelect: {
        // 城市选择
        start: "",
        end: "",
      },

      airMessage: {
      to: {},
      from: {},
      toTime: {},
    },

    nameGroup: [
       //订票员选择
        "马冬梅",
        "欧阳娜娜",
        "Lisa",
        "GD",
    ],

    pnr: "", // pnr
    orderNumber: "", // 订单号
    flightNumber: "", // 航班号
    // booker: "", // 订票员

    dateType: '', // 日期选择类型
    };
  },
  methods: {
    // 日期条件选择
    activeDate(val) {
      this.dateFilter.forEach((item) => {
        if (item.name === val.name) {
          item.active = !val.active;
        } else {
          item.active = false;
        }
      });
    },
    // 订单状态选择
    activeOrderStatus(val) {
      this.orderStatus.forEach((item) => {
        if (item.name === val.name) {
          item.active = !val.active;
        } else {
          item.active = false;
        }
      });
    },

    // 重置筛选
    resetBtn() {
      this.dateFilter.forEach((item) => (item.active = false));
      this.orderStatus.forEach((item) => (item.active = false));
      this.timeLimit.start = "";
      this.timeLimit.end = "";
      this.citySelect.start = "";
      this.citySelect.end = "";
      this.pnr = "";
      this.orderNumber = "";
      this.flightNumber = "";
      // this.booker = "";
    },

    // 确定筛选
    yesBtn() {
      // 判断pnr 订票号 航班号 出发时间 结束时间
        if (
        !this.pnr ||
        !this.orderNumber ||
        !this.flightNumber ||
        !this.timeLimit.start ||
        !this.timeLimit.end 
      ) {
        return uni.showToast({
          title: "请将信息填写完整",
          icon: "none",
        });
      }

    },

    // 打开时间范围日期选择框
    openlimitdaySelector(type) {
      this.dateType = type
      this.$refs.limitdayPopup.openDialog();
    },

    // 确认时间范围
    limitdaySelecctBtn(e) {
      console.log(e);
      let start = e.year + "-" + e.month +"-" + e.day 
      this.$set(this.timeLimit,this.dateType,start)
    },

    //城市选择  出发城市
    whereToBtn() {
      //  跳转到城市选择页面
       uni.navigateTo({
        url: "/pages/citySelect/citySelect?type=to",
      });
    },

    //城市选择  到达城市
    whereFromBtn() {
      //  跳转到城市选择页面
       uni.navigateTo({
        url: "/pages/citySelect/citySelect?type=from",
      });
    },

    // 打开筛选
    openFilterDialog() {
      this.$refs.filterDialog.open();
    },
    // 关闭弹出框
    closeFilterDialog() {
      this.$refs.filterDialog.close();
    },

  },
  onLoad() {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
  },

  onShow() {
  // 获取城市信息
  if (uni.getStorageSync("city")) {
    let cityData = JSON.parse(uni.getStorageSync("city"));
    console.log(JSON.parse(uni.getStorageSync("city")))
    if (cityData.status === "to") {
      this.citySelect.start =
        cityData.type === "city"
          ? cityData.data.city_name
          : cityData.data.air_port_name;
          this.airMessage["to"] = cityData.data;
          this.airMessage["to_type"] = cityData.type;
    } else if (cityData.status === "from") {
      this.citySelect.end =
        cityData.type === "city"
          ? cityData.data.city_name
          : cityData.data.air_port_name;
          this.airMessage["from"] = cityData.data;
          this.airMessage["from_type"] = cityData.type;
    }
    console.log(this.airMessage);
    uni.removeStorageSync("city");
  }
},
};
</script>

<style lang="less" scoped>
.filter {
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  .filter_main {
    height: calc(100% - (270upx + var(--status-bar-height)));
    overflow-y: auto;
    box-sizing: border-box;
    .list_item {
      margin: 0 20upx 50upx;
      &:first-child {
        margin-top: 50upx;
      }
      &.list_input {
        display: flex;
        justify-content: space-between;
        padding-bottom: 26upx;
        border-bottom: 2upx solid rgba(241, 243, 245, 1);
        margin-bottom: 34upx;
        .item_input {
          text-align: right;
          margin-left: 50upx;
          font-size: 28upx;
          color: rgba(175, 185, 196, 1);
        }
      }
    }
    .item_title {
      font-size: 28upx;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
    }
    .item_checkbox {
      display: flex;
      align-items: center;
      margin-top: 30upx;
      .checkbox_item {
        width: 156upx;
        height: 70upx;
        background: rgba(241, 243, 245, 1);
        border-radius: 10upx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24upx;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        &.active {
          background: rgba(0, 112, 226, 0.6);
          color: rgba(255, 255, 255, 1);
        }
        &:not(:last-child) {
          margin-right: 28upx;
        }
      }
    }
    .item_dialog {
      display: flex;
      align-items: center;
      margin-top: 30upx;
      .dialog_view {
        width: 280upx;
        height: 70upx;
        background: rgba(241, 243, 245, 1);
        border-radius: 36upx;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 20upx;
        box-sizing: border-box;
        font-size: 28upx;
        font-weight: 400;
      }
      .dialog_line {
        font-size: 28upx;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        margin: 0 40upx;
      }
    }
  }

  .filter_bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    border-top: 2upx solid rgba(229, 229, 229, 1);
    bottom: 0;
    left: 0;
    width: 100vw;
    height: calc(144upx + var(--status-bar-height));
    padding: 26upx 20upx;
    padding-bottom: calc(26upx + var(--status-bar-height));
    box-sizing: border-box;
    background: #fff;
    z-index: 1;
    .bottom_btn {
      width: 320upx;
      height: 90upx;
      border: 2upx solid transparent;
      border-radius: 80upx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32upx;
      font-weight: 400;
      &.reset_btn {
        border-color: rgba(0, 112, 226, 1);
        color: rgba(0, 112, 226, 1);
      }
      &.submit_btn {
        background: linear-gradient(
          90deg,
          rgba(0, 112, 226, 1) 0%,
          rgba(86, 197, 255, 1) 100%
        );
        box-shadow: 0 6upx 12upx rgba(0, 112, 226, 0.3);
        color: rgba(255, 255, 255, 1);
      }
    }
  }
}
</style>
