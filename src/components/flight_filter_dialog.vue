<!--
 * @Description: 航班筛选弹窗
 * @Author: wish.WuJunLong
 * @Date: 2020-07-22 11:15:27
 * @LastEditTime: 2020-09-15 14:47:43
 * @LastEditors: wish.WuJunLong
--> 
<template>
  <uni-popup ref="filterPopup" type="bottom" class="filter_dialog">
    <view class="filter_main">
      <view class="filter_title">
        <view class="close_dialog" @click="closeFilterDialog">取消</view>
        <view v-if="flightType" class="close_filter" @click="closeFilterList">清空筛选</view>
        <view class="submit_filter" @click="submitFilterBtn">确定</view>
      </view>

      <view v-if="directFlight" class="direct_flight">
        <text>只看直飞</text>
        <yun-switch :value="directFlightStatus" @switchStauts="directFlightSwitch"></yun-switch>
      </view>

      <view class="filter_content">
        <view class="content_name_list" v-if="flightType">
          <view
            :class="['list_name',{'acitce': activeFilterIndex === index}]"
            v-for="(item, index) in filterList.listName"
            :key="index"
            @click="openFilterList(index)"
          >{{item}}</view>
        </view>

        <view class="content_list" v-if="activeFilterIndex === 0">
          <view
            :class="['takeoff_time_list',{active: takeoffTimeName === index}]"
            @click="takeoffTimeActive(item,index)"
            v-for="(item, index) in checkboxGroup"
            :key="index"
          >
            <view class="list_name">{{keyTitle?item[keyTitle]:item}}</view>
            <view class="list_click"></view>
          </view>
        </view>
        <view class="content_list" v-if="activeFilterIndex === 1">
          <view
            :class="['takeoff_time_list',{active: airlineName === index}]"
            @click="takeoffTimeActive(item,index)"
            v-for="(item, index) in airlines"
            :key="index"
          >
            <view class="list_name">{{keyTitle?item[keyTitle]:item}}</view>
            <view class="list_click"></view>
          </view>
        </view>
      </view>
    </view>
  </uni-popup>
</template>

<script>
export default {
  props: {
    directFlight: {
      // 只看直飞
      type: Boolean,
      default: () => false,
    },
    flightType: {
      // 筛选状态 true为航班信息筛选弹窗 false为多选框组弹窗
      type: Boolean,
      default: () => true
    },
    checkboxGroup: {
      // 多选框组数组
      type: Array,
      default: () => [
        // 起飞时间段选择列表
        "不限",
        "上午00:00-12:00",
        "中午12:00-14:00",
        "下午14:00-18:00",
        "晚上18:00-24:00",
      ],
    },
    airlines: {  // 航司列表
      type: Array,
      default: () => []
    },
    keyTitle: {
      // 显示数据键
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      filterDataList: [], // 筛选列表

      directFlightStatus: false, // 只看直飞开关

      filterList: {
        // 筛选列表名称
        listName: ["起飞时间段", "航空公司"],
      },

      activeFilterIndex: 0, // 默认筛选列表名称下标

      takeoffTimeName: 0, // 起飞时间段默认选择
      airlineName: 0, // 航司默认选择
    };
  },
  methods: {
    // 打开筛选
    openFilterDialog() {
      this.$refs.filterPopup.open();
    },
    // 关闭弹出框
    closeFilterDialog() {
      this.$refs.filterPopup.close();
    },

    // 只看直飞开关
    directFlightSwitch(e) {
      this.directFlightStatus = e;
    },

    // 清空筛选
    closeFilterList() {
      this.filterDataList = [];
      this.takeoffTimeName = 0;
      this.airlineName = 0
      this.submitFilterBtn()
    },

    // 切换筛选盒子
    openFilterList(val) {
      this.activeFilterIndex = val;
    },

    // 起飞时间段选择
    takeoffTimeActive(val, index) {
      this.takeoffTimeName = this.activeFilterIndex === 0? index:this.takeoffTimeName;
      this.airlineName = this.activeFilterIndex === 1? index: this.airlineName
      this.filterDataList[this.activeFilterIndex] = val;
    },

    // 确认筛选数据
    submitFilterBtn(){
      // console.log(this.filterDataList)
      this.$emit('ticketFilterData',this.flightType?this.filterDataList:this.checkboxGroup[this.takeoffTimeName])
      this.closeFilterDialog()
    },
  },
};
</script>

<style scoped lang="less">
.filter_dialog {
  .filter_main {
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
    .direct_flight {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 110upx;
      border-bottom: 2upx solid rgba(217, 225, 234, 1);
      margin: 0 20upx;
      padding: 0 0 0 20upx;
      font-size: 28upx;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      .direct_flight_switch {
        transform: scale(0.7);
      }
    }
    .filter_title {
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
      .close_filter {
        font-size: 28upx;
        font-weight: 500;
        color: rgba(175, 185, 196, 1);
        &.active {
          color: rgba(0, 112, 226, 1);
        }
      }
      .submit_filter {
        font-size: 28upx;
        font-weight: bold;
        color: rgba(0, 112, 226, 1);
      }
    }
    .filter_content {
      min-height: 600upx;
      display: flex;
      .content_name_list {
        width: 220upx;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        background: rgba(241, 243, 245, 1);
        .list_name {
          height: 100upx;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28upx;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          border-bottom: 2upx solid rgba(217, 225, 234, 1);
          &.acitce {
            background: rgba(255, 255, 255, 1);
          }
        }
      }
      .content_list {
        flex: 1;
        padding: 32upx 40upx 32upx 30upx;
        overflow-y: auto;
        .takeoff_time_list {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 56upx;
          &.active {
            .list_name {
              color: rgba(0, 112, 226, 1);
            }
            .list_click {
              background: url(@/static/selected_active.png) no-repeat;
              background-size: contain;
            }
          }
          .list_name {
            font-size: 28upx;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
          }
          .list_click {
            background: url(@/static/selected.png) no-repeat;
            background-size: contain;
            width: 40upx;
            height: 40upx;
          }
        }
      }
    }
  }
}
</style>
