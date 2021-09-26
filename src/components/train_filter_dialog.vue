<!--
 * @Description: 车次筛选弹窗
 * @Author: mzr
 * @Date: 2021-07-29 16:04:00
 * @LastEditTime: 2021-09-16 15:59:06
 * @LastEditors: mzr
-->
<template>
  <uni-popup class="train_Popup" ref="trainPopup" type="bottom">
    <view class="filter_main">
      <view class="filter_title">
        <view class="close_dialog" @click="closeFilterDialog">取消</view>
        <view class="close_filter" @click="closeFilterList">清空筛选</view>
        <view class="submit_filter" @click="submitFilterBtn">确定</view>
      </view>

      <view class="direct_flight">
        <text>只看有票</text>
        <yun-switch :value="ticketStatus" @switchStauts="ticketStatusSwitch"></yun-switch>
      </view>

      <view class="filter_content">
        <view class="content_name_list">
          <view
            :class="['list_name',{'acitce': activeFilterIndex === index}]"
            v-for="(item, index) in filterList.listName"
            :key="index"
            @click="openFilterList(index)"
          >{{item}}</view>
        </view>

        <view class="content_list" v-if=" activeFilterIndex === 0 ">
          <view
            :class="['takeoff_time_list',{active: trainTypeName === index}]"
            @click="active(item,index)"
            v-for="(item, index) in trainType"
            :key="index"
          >
            <view class="list_name">{{keyTitle?item[keyTitle]:item}}</view>
            <view class="list_click"></view>
          </view>
        </view> 

        <view class="content_list" v-if=" activeFilterIndex === 1 ">
          <view
            :class="['takeoff_time_list',{active: departureTimeName === index}]"
            @click="active(item,index)"
            v-for="(item, index) in departureTime"
            :key="index"
          >
            <view class="list_name">{{keyTitle?item[keyTitle]:item}}</view>
            <view class="list_click"></view>
          </view>
        </view> 

        <view class="content_list" v-if=" activeFilterIndex === 2 ">
          <view
            :class="['takeoff_time_list',{active: arriveTimeName === index}]"
            @click="active(item,index)"
            v-for="(item, index) in arriveTime"
            :key="index"
          >
            <view class="list_name">{{keyTitle?item[keyTitle]:item}}</view>
            <view class="list_click"></view>
          </view>
        </view> 

        <view class="content_list" v-if=" activeFilterIndex === 3 ">
          <view
            :class="['takeoff_time_list',{active: departureStationName === index}]"
            @click="active(item,index)"
            v-for="(item, index) in departureStation"
            :key="index"
          >
            <view class="list_name">{{keyTitle?item[keyTitle]:item}}</view>
            <view class="list_click"></view>
          </view>
        </view> 

        <view class="content_list" v-if=" activeFilterIndex === 4 ">
          <view
            :class="['takeoff_time_list',{active: arriveStationName === index}]"
            @click="active(item,index)"
            v-for="(item, index) in arriveStation"
            :key="index"
          >
            <view class="list_name">{{keyTitle?item[keyTitle]:item}}</view>
            <view class="list_click"></view>
          </view>
        </view> 

        <view class="content_list" v-if=" activeFilterIndex === 5 ">
          <view
            :class="['takeoff_time_list',{active: OriginateName === index}]"
            @click="active(item,index)"
            v-for="(item, index) in isOriginate"
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

    // 车型
    trainType: {
      type: Array,
      default: () => []
    },

    // 出发车站
    departureStation: {
      type:Array,
      default: () => []
    },

    // 到达车站
    arriveStation: {
      type:Array,
      default: () => []
    },

    // 出发时段
    departureTime: {
      type: Array,
      default: () => [
        "不限",
        "0-6点",
        "6-12点",
        "12-18点",
        "18-24点"
      ],
    },

    // 到达时段
    arriveTime: {
      type: Array,
      default: () => [
        "不限",
        "0-6点",
        "6-12点",
        "12-18点",
        "18-24点"
      ],
    },

    // 是否始发
    isOriginate: {
      type: Array,
      default:() => [
        "不限",
        "始发",
        "过路"
      ],
    },

    keyTitle: {
      // 显示数据键
      type: String,
      default: () => ''
    },

  },
  data() {
    return {

      filterDataList: [], // 筛选列表
      ticketStatus: false, // 只看有票

      filterList: {
        // 筛选列表名称
        listName: ["车型", "出发时段","到达时段","出发车站","到达车站","是否始发"],
      },

      activeFilterIndex: 0, // 默认筛选列表名称下标
      trainTypeName: 0, // 车型默认选择
      departureTimeName:0, // 出发时段默认选择
      arriveTimeName:0, // 到达时段默认选择
      departureStationName:0, // 出发车站默认选择
      arriveStationName:0, // 到达车站默认选择
      OriginateName:0, // 是否始发

      openFilterNumber: 0 // 打开筛选弹窗次数
    }
  },
  methods: {

    // 打开筛选 val 只看动车高铁
    openFilterDialog(val) {
      if(val !== null && this.openFilterNumber < 1){
        this.openFilterNumber += 1
        this.trainTypeName = val !== null?val:this.trainTypeName
      }
      this.$refs.trainPopup.open();
    },
    // 关闭弹出框
    closeFilterDialog() {
      this.$refs.trainPopup.close();
    },

    // 清空筛选
    closeFilterList() {
      this.filterDataList = [];
      this.trainTypeName = 0, 
      this.departureTimeName = 0, 
      this.arriveTimeName = 0, 
      this.departureStationName = 0, 
      this.arriveStationName = 0,
      this.ticketStatus = false,
      this.submitFilterBtn()
    },

    // 确认筛选数据
    submitFilterBtn() {
      this.$emit('trainFilterData',this.filterDataList,this.ticketStatus)
      this.closeFilterDialog()
    },

    // 只看有票开关
    ticketStatusSwitch(e) {
      this.ticketStatus = e
    },

    // 切换筛选盒子
    openFilterList(val) {
      this.activeFilterIndex = val;
    },

    // 筛选类型 选中状态 
    active(val,index) {

      this.trainTypeName =  this.activeFilterIndex === 0? index:this.trainTypeName
      this.departureTimeName = this.activeFilterIndex === 1? index:this.departureTimeName
      this.arriveTimeName = this.activeFilterIndex === 2? index:this.arriveTimeName
      this.departureStationName =  this.activeFilterIndex === 3? index :this.departureStationName
      this.arriveStationName = this.activeFilterIndex === 4? index :this.arriveStationName
      this.OriginateName = this.activeFilterIndex === 5? index:this.OriginateName
      this.filterDataList[this.activeFilterIndex] = val
      
    },

  }
}
</script>

<style lang="less" scoped>
.train_Popup {
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