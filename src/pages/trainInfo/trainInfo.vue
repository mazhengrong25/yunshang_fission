<!--
 * @Description: 火车票 --- 坐席
 * @Author: mzr
 * @Date: 2021-08-03 14:12:34
 * @LastEditTime: 2021-09-22 14:19:20
 * @LastEditors: mzr
-->
<template>
    <view class="train_seat">
        <yun-header :statusHeight="iStatusBarHeight" :headerAddress="pageHeaderData"></yun-header>
        <view class="train_background">
            <view class="train_content">
                <!-- 日历 选择-->
                <view class="content_date">
                    <view class="date_point_before" @click="selectDate('before')">前一天</view>
                    <view class="date_box" @click="jumpCalendar()">
                      <view class="box_day">{{trainMessage.train?this.$moment(trainMessage.train.departure_date).format('M月DD日'):'-'}}</view>
                      <view class="box_week">{{trainMessage.train?this.$moment(trainMessage.train.departure_date).format("ddd"):'-'}}</view>
                      <view class="box_calendar"></view>
                    </view>
                    <view class="date_point_after" @click="selectDate('after')">后一天</view>
                </view>
                <!-- 车次信息 -->
                <trainMessageCard :trainObject="trainMessage"></trainMessageCard>
                <!-- 座位列表 -->
                <view class="content_list_box">
                  <view class="train_content_list" v-for="(item,index) in trainMessage.seat" :key="index">
                      <view class="list_seat_type">{{item.name}}</view>
                      <view class="list_seat_price" @click="openSleeperPrice(item)">
                          <span>&yen;</span>
                          <view class="price_value">{{item.price}}</view>
                          <view class="seat_price_image" :style="{opacity:(item.X || item.Z)?'':'0'}">
                            <img src="@/static/train_seat_pull.png" />
                          </view>
                      </view>
                      <view class="train_content_item">
                          <view class="list_price_amount">{{item.number < 1 ? '无票': item.number > 15 ? '有票': item.number + "张"}}</view>
                          <button @click="submitBtn(item,trainChange)" :class="['list_button',{'disabled_button':item.number < 1}]" :disabled="item.number < 1">预定</button>
                      </view>
                  </view>
                </view>
                
            </view>
        </view>

        <!-- 卧铺价格 -->
        <trainSleeper ref="trainSleeper" :trainbunkList="sleeperList"></trainSleeper>
    </view>
</template>

<script>
import train from "@/api/trainInquiry.js"
import trainSleeper from '@/components/train_sleeper.vue' // 卧铺价格
import trainMessageCard from '@/components/train_message_card.vue' // 车次信息
export default {
    components: {
        trainSleeper,
        trainMessageCard
    },
    data() {
        return {
            iStatusBarHeight: 0, // 导航栏高度
            pageHeaderData:{}, // 导航栏名称

            trainMessage: {}, // 火车票信息
            sleeperList:[], // 卧铺信息
            trainChange:"", // 区别改签订单

            trainData:{}, // 查询传参
            trainCode:"", // 查询传参 车次
        }
    },
    methods: {
        // 预定
        submitBtn(val,e) {
           
            // 区别订单改签
            if(e) {
              // 存  车次信息和座位信息
              let data = {
                train: this.trainMessage,
                cabin: val
              }
              uni.setStorageSync('changeMessage',data)
              uni.navigateBack({
                delta: 2,
              })
             
            }else{

              uni.navigateTo({
                url:
                "/trainReservation/trainReservation?trainItem=" + 
                JSON.stringify(this.trainMessage) + 
                "&singleData=" +
                JSON.stringify(val) +
                "&pageHeaderData=" + 
                JSON.stringify(this.pageHeaderData)
              })
            }

        },

        // 打开卧铺价格
        openSleeperPrice(val) {
          let data = []

          for (const key in val) {
            if(typeof val[key] === 'object'){
              data.push(val[key])
            }
          }

          if(data.length < 1){
            return false
          }

          this.sleeperList = data
          this.$refs.trainSleeper.openSleeperModal();
        },

        // 跳转到日历
        jumpCalendar() {
          let data = {
            type:false,
            data: this.trainData.toTime.date
          }
          uni.navigateTo({
            url:"/pages/dateSelect/dateSelect?ticketType=" + JSON.stringify(data)
          })
        },

        // 获取车次信息
        getTrainData() {
            let data = {
                departure: this.trainData.to.city_name,
                arrive: this.trainData.from.city_name,
                ticket: "ADT",
                departure_date: this.trainData.toTime.date,
                code: this.trainCode
            }
            train.getTrainNumber(data).then((res) => {
                if (res.errorcode === 10000) {
                    
                    
                    res.data.forEach((item) => {
                        let newSeat = []
                        for (const key in item.seat) {
                            if (item.seat[key].number >= 0) {
                                newSeat.push(item.seat[key])
                            }
                        }

                        item.seat = newSeat
                        this.trainMessage = item

                    })
                }else {
                    uni.showToast({
                        title: res.msg,
                        icon: "none",
                        duration: 3000,
                    });
                }
            })
        },

        // 日期选择
        async selectDate(val) {
          this.trainData.toTime.date = val === 'before' ? this.$moment(this.trainData.toTime.date).subtract(1,'days').format("YYYY-MM-DD")
                    : val === 'after' ? this.$moment(this.trainData.toTime.date).add(1,'days').format("YYYY-MM-DD")
                      :this.trainData.toTime.date
          await this.getTrainData()
        }
    },

    onShow() {
      // 获取时间日期
      if (uni.getStorageSync("time")) {
        let timeData = JSON.parse(uni.getStorageSync("time"));
        this.trainData.toTime.date = timeData.date;
        uni.removeStorageSync("time");
        
        this.getTrainData();
      }
    },
    onLoad(data) {
        this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
        this.trainData = JSON.parse(data.trainData)
        this.trainCode = data.code

        this.getTrainData();
        // 页头
        this.pageHeaderData = JSON.parse(JSON.stringify(this.trainData))
        // 区别改签
        this.trainChange = this.trainData.isChange
    }
}
</script>

<style scoped lang="less">
.train_seat {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: RGBA(243, 245, 247, 1);
    .train_background {
        height: 600upx;
        background: linear-gradient(
            180deg,
            #0070e2 0%,
            rgba(0, 112, 226, 0) 100%
        );
        .train_content {
            margin: 20upx;
            .content_date {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 20upx;
              .date_point_before {
                font-size: 24upx;
                font-weight: 400;
                color: rgba(255, 255, 255, .7);
                margin-left: 26upx;
                position: relative;
                &::after {
                  content: '';
                  top: 11upx;
                  right: 86upx;
                  width: 8upx;
                  height: 12upx;
                  position: absolute;
                  background: url("@/static/train_direction_right.png") no-repeat center center;
                  transform: rotate(180deg);
                  background-size:contain ;
                }
              }
              .date_box {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background: rgba(255, 255, 255, .2);
                border: 1px solid rgba(104, 170, 238, 1);
                border-radius: 20upx;
                height: 70upx;
                &:not(:last-child) {
                  padding: 0upx 30upx;
                }
                .box_day {
                  font-size: 28upx;
                  font-weight: bold;
                  color: #FFFFFF;
                }
                .box_week {
                  font-size: 22upx;
                  font-weight: 400;
                  color: #FFFFFF;
                  margin: 0upx 30upx;
                }
                .box_calendar {
                  width: 32upx;
                  height: 32upx;
                  background: url("@/static/train_calendar.png") no-repeat center center;
                  background-size:contain ;
                  margin-right: 13upx;
                  position: relative;
                  &::after {
                    content: '';
                    top: 11upx;
                    left: 48upx;
                    width: 8upx;
                    height: 12upx;
                    position: absolute;
                    background: url("@/static/train_direction_right.png") no-repeat center center;
                    background-size:contain ;
                  }
                }
              }
              .date_point_after {
                font-size: 24upx;
                font-weight: 400;
                color: rgba(255, 255, 255,1);
                margin-right: 26upx;
                position: relative;
                &::after {
                  content: '';
                  top: 11upx;
                  left: 86upx;
                  width: 8upx;
                  height: 12upx;
                  position: absolute;
                  background: url("@/static/active_train_direction_right.png") no-repeat center center;
                  background-size:contain ;
                }
              }
            }
            .content_list_box {
              padding: 0upx 28upx;
              background: #ffffff;
              box-shadow: 0upx 12upx 18upx rgba(0, 0, 0, 0.04);
              border-radius: 20upx;
              margin-top: 20upx;
              .train_content_list {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding: 34upx 0upx 36upx;
                  .list_seat_type {
                      font-size: 32upx;
                      font-weight: bold;
                      color: #2a2a2a;
                  }
                  .list_seat_price {
                      display: flex;
                      align-items: flex-start;
                      justify-content: center;
                      span {
                          font-size: 32upx;
                          font-weight: 400;
                          color: #2a2a2a;
                      }
                      .price_value {
                          font-size: 32upx;
                          font-weight: 400;
                          color: #2a2a2a;
                          margin: 0upx 12upx 0upx;
                      }
                      .seat_price_image {
                          width: 20upx;
                          height: 12upx;
                          img {
                            width: 100%;
                            height: 100%;
                            object-fit: contain;
                          }
                      }
                  }
                  .train_content_item {
                      display: inline-flex;
                      align-items: center;
                      justify-content: center;
                      .list_price_amount {
                          font-size: 32upx;
                          font-weight: 400;
                          color: #2a2a2a;
                          margin-right: 24upx;
                      }
                      .list_button {
                          width: 80px;
                          height: 35px;
                          background: linear-gradient(
                              90deg,
                              #fb9826 0%,
                              #ffca61 100%
                          );
                          box-shadow: 0upx 6upx 12upx rgba(251, 152, 38, 0.3);
                          border-radius: 90upx;
                          color: #fff;
                          font-size: 32upx;
                          display: inline-flex;
                          justify-content: center;
                          align-items: center;
                          letter-spacing: 10upx;
                          &.disabled_button {
                              background: #afb9c4;
                              box-shadow: 0upx 6upx 12upx
                                  rgba(175, 185, 196, 0.3);
                          }
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