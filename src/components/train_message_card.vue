<!--
 * @Description: 车次信息
 * @Author: mzr
 * @Date: 2021-08-06 17:28:11
 * @LastEditTime: 2021-09-23 09:46:25
 * @LastEditors: mzr
-->
<template>
    <view class="train_content_journey">
        <view class="journey_title" v-if="titleType">
            {{titleType === "refund" ? '车次信息'
                :titleType === "old" ? '原车次'
                    :titleType === "new" ? '新车次':''
            }}
            <view class="journey_title_choice" v-if="isChange" @click="relectTrain()">重选车次</view>
        </view>
        <view class="journey_card_top">
            <view class="card_top_item">
                <view class="top_item_date">{{trainObject.train?this.$moment(trainObject.train.departure_date).format("MM-DD"):'-'}}</view>
                <view class="top_item_date">{{trainObject.train?this.$moment(trainObject.train.departure_date).format("ddd"):'-'}}</view>
            </view>
            <view class="card_top_item">
                <view class="top_item_date">{{trainObject.train?this.$moment(trainObject.train.departure_date).add(trainObject.train.days,'d').format("MM-DD"):'-'}}</view>
                <view class="top_item_date">{{trainObject.train?this.$moment(trainObject.train.departure_date).add(trainObject.train.days,'d').format("ddd"):'-'}}</view>
            </view>
        </view>
        <view class="journey_card_bottom">
            <view class="bottom_left">
                <view class="left_time">{{trainObject.train.departure}}</view>
                <view class="left_arrive">{{trainObject.station.departure_name}}</view>
            </view>
            <view class="bottom_center">
                <view class="bottom_center_item">
                    {{`${trainObject.train?Math.floor(
        Number(trainObject.train.run_minute) / 60
      ):0}h${trainObject.train?Math.floor(Number(trainObject.train.run_minute) % 60):0}m`}}
                </view>
                <view class="bottom_center_stop" @click="openStopStation()">经停站</view>
                <image class="train_stop_image" src="@/static/train_stop.png" mode="contain" />
                <view class="bottom_center_item">{{trainObject.train.code}}</view>
            </view>
            <view class="bottom_right">
                <view class="left_time">{{trainObject.train.arrive}}</view>
                <view class="left_arrive">{{trainObject.station.arrive_name}}</view>
            </view>
        </view>
        <!-- 座位展示 -->
        <view class="line_content" v-if="isCabin">
            <view class="line_left">
                <view :class="['line_left_img',{'difference':(seatObject.code === '3' || seatObject.code === '4')}]"></view>
                <view class="seat_type">{{seatObject.name}}</view>
                <view class="seat_price" v-if="isPrice">
                    <span>&yen;</span>
                    <view class="price_value">{{seatObject.price}}</view>
                </view>
            </view>
            
            <view 
                v-if="noSeat"
                :class="['line_right',{active:acceptStatus}]" 
                @click="activeCheckbox()"
            >
                <view class="checkbox_title">接受无座</view>
                <view class="checkbox_input"></view>
            </view>

            <view class="rule_item" v-if="isRule">退改规则</view>
           
        </view>
        <!-- 经停站 -->
        <trainStop ref="trainStop" :trainStopList="siteData" :activeObject="activeStation"></trainStop>
    </view>
</template>

<script>
import train from "@/api/trainInquiry.js"
import trainStop from '@/components/train_stop.vue';
export default {
  components: {
    trainStop,
      
  },
  props: {
    // 车次信息
    trainObject: {
      type:Object,
      default: () => {}
    },
    // 是否显示座位
    isCabin: {
        type: Boolean,
        default: () => false
    },
    // 是否显示价格
    isPrice: {
        type: Boolean,
        default: () => false
    },
    // 座位信息
    seatObject: {
        type:Object,
        default: () => {}
    },
    // 接受无座
    noSeat:{
        type:Boolean,
        default: () => false
    },
    // 是否显示退改规则
    isRule:{
        type:Boolean,
        default: () => false 
    },
    // 标题 （退票改签）
    titleType: {
        type:String,
        default: () => ""
    },
    // 区别改签和详情  重选车次显示
    isChange:{
        type:Boolean,
        default:() => false
    }

  },
  data() {
    return {
      siteData: [], // 经停站列表
      activeStation:{}, // 传组件  当前车站信息

      acceptStatus: true, // 接受无座状态

    }
  },
  methods: {
    // 打开经停站
    openStopStation() {
          
        this.$refs.trainStop.openStopModal();
        this.getSiteData();
        this.activeStation = {
          departure_name : this.trainObject.station.departure_name,
          arrive_name: this.trainObject.station.arrive_name
        }
    },

    // 站点信息
    getSiteData() {
      let data = {
        departure:this.trainObject.station.departure_name,
        arrive:this.trainObject.station.arrive_name,
        ticket:"ADT",
        departure_date:this.$moment(this.trainObject.train.departure_date).format("YYYY-MM-DD"),
        code:this.trainObject.train.code,
        number:this.trainObject.train.number,
      }
      train.getTrainSite(data).then((res) => {
          console.log(res)
          if(res.errorcode === 10000) {
            this.siteData = res.data
          }else {
            uni.showToast({
                title: res.msg,
                icon: "none",
                duration: 3000,
            });
          }
      })
    },

    // 接受无座
    activeCheckbox() {
        this.acceptStatus = !this.acceptStatus

        this.$emit("getSeatStatus", this.acceptStatus);

    },

    // 重选车次
    relectTrain() {
        this.$emit("getRelectTrain");
    }
  }

}
</script>

<style scoped lang="less">
.train_content_journey {
  padding: 34upx 20upx 0upx;
  background: #ffffff;
  box-shadow: 0upx 12upx 18upx rgba(0, 0, 0, 0.04);
  border-radius: 20upx;
  .journey_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 32upx;
    font-weight: bold;
    color: #2A2A2A;
    margin-bottom: 48upx;
    .journey_title_choice {
        font-size: 28upx;
        font-weight: 400;
        color: #0070E2;
    }
  }
  .journey_card_top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20upx;
      .card_top_item {
          display: inline-flex;
          font-size: 24upx;
          font-weight: 400;
          color: #2a2a2a;
          .top_item_date {
              &:not(:last-child) {
                  margin-right: 10upx;
              }
          }
      }
  }
  .journey_card_bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 36upx;
      .bottom_left {
          .left_time {
              font-size: 48upx;
              font-weight: bold;
              color: #333333;
          }
          .left_arrive {
              font-size: 28upx;
              font-weight: 400;
              color: #2a2a2a;
          }
      }
      .bottom_center {
          position: relative;
          .bottom_center_item {
              height: 32upx;
              font-size: 22upx;
              font-weight: 400;
              color: #afb9c4;
              margin-bottom: 4upx;
              text-align: center;
          }
          .train_stop_image {
              width: 202upx;
              height: 40upx;
          }
          .bottom_center_stop {
              font-size: 22upx;
              font-weight: 400;
              color: #0070e2;
              position: absolute;
              right: 68upx;
              bottom: 46upx;
          }
      }
      .bottom_right {
          text-align: right;
          .left_time {
              font-size: 48upx;
              font-weight: bold;
              color: #333333;
          }
          .left_arrive {
              font-size: 28upx;
              font-weight: 400;
              color: #2a2a2a;
          }
      }
  }
  .line_content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1upx dotted #D9E1EA;
      padding: 30upx 0upx 28upx;
      .line_left {
        font-size: 30upx;
        font-weight: bold;
        color: #2A2A2A;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        .line_left_img {
            width: 36upx;
            height: 32upx;
            background: url("@/static/train_order_siting.png") no-repeat center center;
            background-size: contain;
            &.difference {
                
                background: url("@/static/train_order_lying.png") no-repeat center center;
                background-size: contain;
            }
        } 
        .seat_price {
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
        .seat_type {
            margin: 0upx 14upx 0upx;
        }
        .price_value {
            margin-left: 4upx;
        }
      }
      .line_right {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        &.active {
            .checkbox_input {
                background: url(@/static/selected_active.png) no-repeat;
                background-size: contain;
            }
        }
        .checkbox_input {
            width: 40upx;
            height: 40upx;
            background: url(@/static/selected.png) no-repeat;
            background-size: contain;
        }
        .checkbox_title {
            font-size: 28upx;
            font-weight: 400;
            color: #2A2A2A;
            margin-right: 20upx;
        }
      }
      .rule_item {
        font-size: 24upx;
        font-weight: 400;
        color: #AFB9C4;
        position: relative;
        &::before {
            content: "";
            width: 32upx;
            height: 34upx;
            right: 98upx;
            background: url("@/static/train_rule_grey.png");
            background-size: contain;
            position: absolute;
        }
      }
  }
}
</style>