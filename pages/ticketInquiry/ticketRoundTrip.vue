<!--
 * @Description: 机票查询 - 国内往返
 * @Author: wish.WuJunLong
 * @Date: 2020-07-20 16:32:48
 * @LastEditTime: 2020-07-22 14:59:38
 * @LastEditors: wish.WuJunLong
--> 
<template>
  <view class="ticketRoundTrip">
    <!-- 导航栏 -->
    <voyage-header
      :statusHeight="iStatusBarHeight"
      :statusType="true"
      :headerAddress="ticketAddress"
    ></voyage-header>
    <!-- 往返时间 -->
    <view class="header_time">
      <round-trip-header></round-trip-header>
    </view>
    <!-- 航班列表 -->
    <scroll-view class="flight_list" :scroll-y="true">
      <view
        v-for="(item, index) in flightList"
        :key="index"
        @click="checkedFlight(item,index)"
        v-bind:class="[{toActive: item.toActive},{fromActive: item.fromActive},'flight_box']"
      >
        <view class="box_top">
          <view class="top_time start_time">
            <view class="time">{{item.toTime}}</view>
            <view class="address">{{item.toAddress}}</view>
          </view>
          <view class="flight_line">
            <view class="time">{{item.time}}</view>
            <view class="line_icon"></view>
          </view>
          <view class="top_time end_time">
            <view class="time">{{item.fromTime}}</view>
            <view class="address">{{item.fromAddress}}</view>
          </view>
        </view>
        <view class="total_price_message">
          <text v-if="!item.premium && item.totalPrice">往返总价</text>
        </view>
        <view class="flight_bottom">
          <view class="airlines">
            <image class="airlines_icon" src="@/static/ticket_icon.png" mode="contain" />
            {{item.airlines}}
          </view>
          <view class="price">
            <view class="price_mini" v-if="item.premium && !item.totalPrice">补</view>
            <view class="price_mini">&yen;</view>
            <text>{{item.totalPrice}}</text>
            <text>{{item.premium}}</text>
            <view class="price_mini" v-if="!item.premium && item.totalPrice">起</view>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="filter">
			<flight-filter @openFilter="openFilter" :filterMini="true"></flight-filter>
		</view>

    
		<flight-filter-dialog ref="filterDialog"></flight-filter-dialog>

    <view class="bottom_bar">
      <view class="left_message">
        <view class="price_box">
          <text>&yen;</text>695
        </view>
        <view class="not_pass_message">往返总价</view>
      </view>
      <view class="right_btn">下一步</view>
    </view>
  </view>
</template>

<script>
import voyageHeader from "@/components/voyage_header.vue"; // 自定义状态栏
import roundTripHeader from "@/components/roundTrip_header.vue"; // 往返日期状态栏
import flightFilter from "@/components/flight_filter.vue"; // 航班筛选
import flightFilterDialog from "@/components/flight_filter_dialog.vue"; // 航班筛选弹窗
export default {
  components: {
    voyageHeader,
    roundTripHeader,
    flightFilter,
    flightFilterDialog
  },
  data() {
    return {
      iStatusBarHeight: 0, // 导航栏高度
      ticketAddress: {
        // 导航栏地址
        to: "重庆",
        from: "上海"
      },

      flightList: [
        // 航班信息
        {
					id: 1,
          toTime: "08:00", // 出发时间
          toAddress: "江北T3", // 出发地址
          time: "2h30m", // 时长
          fromTime: "10:30", // 到达时间
          fromAddress: "大兴", // 到达地址
          airlines: "南航CZ2801", // 航司
          totalPrice: "665", // 总价
          premium: "",
          toActive: false
        },
        {
					id: 2,
          toTime: "08:00", // 出发时间
          tiAddress: "江北T3", // 出发地址
          time: "2h30m", // 时长
          fromTime: "10:30", // 到达时间
          fromAddress: "大兴", // 到达地址
          airlines: "南航CZ2801", // 航司
          totalPrice: "", // 总价
          premium: "20"
        },
        {
					id: 3,
          toTime: "08:00", // 出发时间
          tiAddress: "江北T3", // 出发地址
          time: "2h30m", // 时长
          fromTime: "10:30", // 到达时间
          fromAddress: "大兴", // 到达地址
          airlines: "南航CZ2801", // 航司
          totalPrice: "", // 总价
          premium: "20"
        },
        {
					id: 4,
          toTime: "08:00", // 出发时间
          tiAddress: "江北T3", // 出发地址
          time: "2h30m", // 时长
          fromTime: "10:30", // 到达时间
          fromAddress: "大兴", // 到达地址
          airlines: "南航CZ2801", // 航司
          totalPrice: "", // 总价
          premium: "20"
        },
        {
					id: 5,
          toTime: "08:00", // 出发时间
          tiAddress: "江北T3", // 出发地址
          time: "2h30m", // 时长
          fromTime: "10:30", // 到达时间
          fromAddress: "大兴", // 到达地址
          airlines: "南航CZ2801", // 航司
          totalPrice: "", // 总价
          premium: "20"
        },
        {
					id: 5,
          toTime: "08:00", // 出发时间
          tiAddress: "江北T3", // 出发地址
          time: "2h30m", // 时长
          fromTime: "10:30", // 到达时间
          fromAddress: "大兴", // 到达地址
          airlines: "南航CZ2801", // 航司
          totalPrice: "", // 总价
          premium: "20"
        },
        {
					id: 5,
          toTime: "08:00", // 出发时间
          tiAddress: "江北T3", // 出发地址
          time: "2h30m", // 时长
          fromTime: "10:30", // 到达时间
          fromAddress: "大兴", // 到达地址
          airlines: "南航CZ2801", // 航司
          totalPrice: "", // 总价
          premium: "20"
        },
        {
					id: 5,
          toTime: "08:00", // 出发时间
          tiAddress: "江北T3", // 出发地址
          time: "2h30m", // 时长
          fromTime: "10:30", // 到达时间
          fromAddress: "大兴", // 到达地址
          airlines: "南航CZ2801", // 航司
          totalPrice: "", // 总价
          premium: "20"
        },
        {
					id: 5,
          toTime: "08:00", // 出发时间
          tiAddress: "江北T3", // 出发地址
          time: "2h30m", // 时长
          fromTime: "10:30", // 到达时间
          fromAddress: "大兴", // 到达地址
          airlines: "南航CZ2801", // 航司
          totalPrice: "", // 总价
          premium: "20"
        },
        {
					id: 5,
          toTime: "08:00", // 出发时间
          tiAddress: "江北T3", // 出发地址
          time: "2h30m", // 时长
          fromTime: "10:30", // 到达时间
          fromAddress: "大兴", // 到达地址
          airlines: "南航CZ2801", // 航司
          totalPrice: "", // 总价
          premium: "20"
        },
        {
					id: 5,
          toTime: "08:00", // 出发时间
          tiAddress: "江北T3", // 出发地址
          time: "2h30m", // 时长
          fromTime: "10:30", // 到达时间
          fromAddress: "大兴", // 到达地址
          airlines: "南航CZ2801", // 航司
          totalPrice: "", // 总价
          premium: "20"
        },
        {
					id: 5,
          toTime: "08:00", // 出发时间
          tiAddress: "江北T3", // 出发地址
          time: "2h30m", // 时长
          fromTime: "10:30", // 到达时间
          fromAddress: "大兴", // 到达地址
          airlines: "南航CZ2801", // 航司
          totalPrice: "", // 总价
          premium: "20"
        },
        {
					id: 5,
          toTime: "08:00", // 出发时间
          tiAddress: "江北T3", // 出发地址
          time: "2h30m", // 时长
          fromTime: "10:30", // 到达时间
          fromAddress: "大兴", // 到达地址
          airlines: "南航CZ2801", // 航司
          totalPrice: "", // 总价
          premium: "20"
        },
        {
					id: 5,
          toTime: "08:00", // 出发时间
          tiAddress: "江北T3", // 出发地址
          time: "2h30m", // 时长
          fromTime: "10:30", // 到达时间
          fromAddress: "大兴", // 到达地址
          airlines: "南航CZ2801", // 航司
          totalPrice: "", // 总价
          premium: "20"
        },
        {
					id: 5,
          toTime: "08:00", // 出发时间
          tiAddress: "江北T3", // 出发地址
          time: "2h30m", // 时长
          fromTime: "10:30", // 到达时间
          fromAddress: "大兴", // 到达地址
          airlines: "南航CZ2801", // 航司
          totalPrice: "", // 总价
          premium: "20"
        },
        {
					id: 5,
          toTime: "08:00", // 出发时间
          tiAddress: "江北T3", // 出发地址
          time: "2h30m", // 时长
          fromTime: "10:30", // 到达时间
          fromAddress: "大兴", // 到达地址
          airlines: "南航CZ2801", // 航司
          totalPrice: "", // 总价
          premium: "20"
        },
        {
					id: 5,
          toTime: "08:00", // 出发时间
          tiAddress: "江北T3", // 出发地址
          time: "2h30m", // 时长
          fromTime: "10:30", // 到达时间
          fromAddress: "大兴", // 到达地址
          airlines: "南航CZ2801", // 航司
          totalPrice: "", // 总价
          premium: "20"
        },
        {
					id: 5,
          toTime: "08:00", // 出发时间
          tiAddress: "江北T3", // 出发地址
          time: "2h30m", // 时长
          fromTime: "10:30", // 到达时间
          fromAddress: "大兴", // 到达地址
          airlines: "南航CZ2801", // 航司
          totalPrice: "", // 总价
          premium: "20"
        }
      ],

      checketFlightList: [], // 选中航程

    };
  },
  methods: {
    // 选择航班
    checkedFlight(val, index) {

			// this.checketFlightList.push(val)
			// this.flightList[index].toActive = true;

      if (this.checketFlightList.length < 1) {
        if (this.flightList[index].toActive) {
					this.flightList[index].toActive = false;
					this.checketFlightList.splice(this.checketFlightList.findIndex(item => item.id === id),1)
        } else {
					this.flightList[index].toActive = true;
					this.checketFlightList.push(val)
        }
			}else if(this.checketFlightList.length < 2){
				if (this.flightList[index].fromActive) {
					this.flightList[index].fromActive = false;
					this.checketFlightList.splice(this.checketFlightList.findIndex(item => item.id === id),1)
        } else {
					this.flightList[index].fromActive = true;
					this.checketFlightList.push(val)
        }
			}
			console.log(this.checketFlightList)
    },


    // 打开筛选
    openFilter() {
      this.$refs.filterDialog.openFilterDialog()
    },
    // 关闭弹出框
    closeFilterDialog() {
      this.$refs.filterDialog.closeFilterDialog()
    },

  },
  onLoad() {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
  }
};
</script>

<style scoped lang="less">
.ticketRoundTrip {
  background: rgba(243, 245, 247, 1);
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  .header_time {
    background: rgba(0, 112, 226, 1);
    padding: 20upx;
  }
  .flight_list {
    flex: 1;
    width: auto;
    overflow-y: auto;
    .flight_box {
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 12upx 18upx rgba(0, 0, 0, 0.04);
      padding: 28upx 16upx 16upx;
      display: inline-flex;
      flex-direction: column;
      width: 42%;
      margin-bottom: 4upx;
			position: relative;
			border: 2upx solid transparent;
			overflow: hidden;
      &:first-child,
      &:nth-child(2) {
        border-radius: 20upx 20upx 0 0;
        margin-top: 20upx;
      }
      &:nth-child(even) {
        margin-right: 20upx;
      }
      &:nth-child(odd) {
        margin-left: 20upx;
      }
      &:not(:nth-child(2n)) {
        margin-right: 7upx;
      }
      &:last-child,
      &:nth-last-child(2) {
        margin-bottom: 140upx;
      }
      &.toActive {
				border:2upx solid rgba(0,112,226,1);
        &::before {
          content: "已选去程";
          position: absolute;
          top: 0;
          left: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 4upx 16upx 4upx 10upx;
          border-radius: 0 0 20upx 0;
          font-size: 16upx;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          background: rgba(0, 112, 226, 1);
        }
			}
			&.fromActive{
				border:2upx solid rgba(133,205,131,1);
				&::before {
          content: "已选返程";
          position: absolute;
          top: 0;
          left: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 4upx 16upx 4upx 10upx;
          border-radius: 0 0 20upx 0;
          font-size: 16upx;
          font-weight: 400;
					color: rgba(255, 255, 255, 1);
					background:rgba(133,205,131,1);
        }
			}
      .box_top {
        display: flex;
        align-items: flex-start;
        margin-bottom: 18upx;
        .top_time {
          .time {
            font-size: 34upx;
            font-weight: bold;
            color: rgba(42, 42, 42, 1);
            margin-bottom: 4upx;
          }
          .address {
            font-size: 22upx;
            font-weight: 400;
            color: rgba(42, 42, 42, 1);
          }
        }
        .flight_line {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          font-size: 22upx;
          font-weight: 400;
          color: rgba(175, 185, 196, 1);
          margin: 0 28upx;
          .line_icon {
            background: url(@/static/ticket_path.png) no-repeat center
              center;
            background-size: contain;
            width: 80upx;
            height: 14upx;
          }
        }
      }
      .total_price_message {
        font-size: 10px;
        font-weight: 400;
        color: rgba(175, 185, 196, 1);
        text-align: right;
        margin-bottom: 6upx;
        height: 28upx;
      }
      .flight_bottom {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        .airlines {
          font-size: 20upx;
          font-weight: 400;
          color: rgba(175, 185, 196, 1);
          display: inline-flex;
          align-items: center;
          .airlines_icon {
            width: 20upx;
            height: 14upx;
            object-fit: contain;
            margin-right: 12upx;
          }
        }
        .price {
          display: inline-flex;
          align-items: baseline;
          font-size: 36upx;
          font-weight: bold;
          color: rgba(255, 0, 0, 1);
          .price_mini {
            font-size: 22upx;
            margin: 0 3upx;
          }
        }
      }
    }
  }

  .filter{
    position: fixed;
    width: calc(100% - 40upx);
    bottom: calc( 156upx + var(--status-bar-height) );
    left: 20upx;
    height: 80upx;
    border-radius: 50upx;
    box-shadow:0 0 12upx rgba(0,0,0,0.16);
    background:rgba(255,255,255,1);
    display: flex;
    align-items: center;
    justify-content: center;
  }


  .bottom_bar {
    background: rgba(255, 255, 255, 1);
    height: 100upx;
    width: calc(100% - 60upx);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24upx 20upx var(--status-bar-height) 40upx;
    border-top: 2upx solid rgba(229, 229, 229, 1);

    .left_message {
      .price_box {
        font-size: 48upx;
        font-weight: bold;
        color: rgba(0, 112, 226, 1);
        text {
          font-size: 28upx;
          margin-right: 6upx;
        }
      }
      .not_pass_message {
        font-size: 20upx;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
      }
    }

    .right_btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 260upx;
      height: 90upx;
      background: linear-gradient(
        90deg,
        rgba(0, 112, 226, 1) 0%,
        rgba(86, 197, 255, 1) 100%
      );
      box-shadow: 0 6upx 12upx rgba(0, 112, 226, 0.3);
      font-size: 32upx;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      letter-spacing: 10upx;
      border-radius: 80upx;
    }
  }
}
</style>
