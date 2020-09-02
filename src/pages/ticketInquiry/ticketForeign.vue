<!--
 * @Description: 机票查询 - 国际航班
 * @Author: wish.WuJunLong
 * @Date: 2020-07-22 11:51:29
 * @LastEditTime: 2020-07-22 18:35:52
 * @LastEditors: wish.WuJunLong
--> 
<template>
  <view class="ticketForeign">
    <!-- 导航栏 -->
    <yun-header
      :statusHeight="iStatusBarHeight"
      :statusType="true"
      :headerAddress="ticketAddress"
    ></yun-header>
    <!-- 往返时间 -->
    <view class="header_time">
      <round-trip-header></round-trip-header>
    </view>

    <scroll-view :enable-back-to-top="true" class="flight_list" :scroll-y="true">
      <view
        @click="checkedFlight(item,index)"
        v-for="(item, index) in flightList"
        :key="index"
        v-bind:class="[{active: item.active},'flight_item']"
      >
        <view class="item_list">
          <view class="item_type">去</view>
          <view class="item_filght">
            <view class="filght_message">
              <view class="filght_box">
                <view class="time">{{item.topToTime}}</view>
                <view class="address">{{item.topToAddress}}</view>
              </view>
              <view class="fight_line">
                <view class="time">{{item.topToDate}}</view>
                <view class="line_img"></view>
                <view class="address">{{item.topToType}}</view>
              </view>
              <view class="filght_box">
                <view class="time">
                  {{item.topFromTime}}
                  <text class="date_time" v-if="item.topFromDate">+{{item.topFromDate}}天</text>
                </view>
                <view class="address">{{item.topFromAddress}}</view>
              </view>
            </view>

            <view class="airlines">
              <image class="airlines_logo" src="../../static/ticket_icon.png" mode="contain" />
              <text>{{item.topAir}}</text>
              <text class="airlines_type" v-if="item.topAirType">{{item.topAirType}}</text>
            </view>
          </view>
          <view class="item_price">
            <view class="price_number">
              <text>&yen;</text>
              {{item.price}}
            </view>
            <view class="extra_price">(境外&yen;{{item.extra}})</view>
            <view class="cabin_type">{{item.cabin}}</view>
          </view>
        </view>

        <view class="item_list">
          <view class="item_type">返</view>
          <view class="item_filght">
            <view class="filght_message">
              <view class="filght_box">
                <view class="time">{{item.btmToTime}}</view>
                <view class="address">{{item.btmToAddress}}</view>
              </view>
              <view class="fight_line">
                <view class="time">{{item.btmToDate}}</view>
                <view class="line_img"></view>
                <view class="address">{{item.btmToType}}</view>
              </view>
              <view class="filght_box">
                <view class="time">
                  {{item.btmFromTime}}
                  <text class="date_time" v-if="item.btmFromDate">+{{item.btmFromDate}}天</text>
                </view>
                <view class="address">{{item.btmFromAddress}}</view>
              </view>
            </view>

            <view class="airlines">
              <image class="airlines_logo" src="../../static/ticket_icon.png" mode="contain" />
              <text>{{item.btmAir}}</text>
              <text class="airlines_type" v-if="item.btmAirType">{{item.btmAirType}}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <uni-popup
      ref="voyageInfo"
      type="bottom"
      class="voyage_info"
      @change="changeVoyageInfo"
      :zIndex="Number(1)"
    >
      <view class="title">
        <text class="title_text">已选航班</text>
        <view class="close_btn" @click="closeVoyageInfo"></view>
      </view>
      <scroll-view :enable-back-to-top="true" class="voyage_info_main" :scroll-y="true">
        <view class="info_item">
          <view class="item_title">
            <view class="type">去程</view>
            <view class="time">
              <text>2020-06-10</text>
              <text>周三</text>
            </view>
          </view>

          <view class="voyage_box">
            <view class="vayage_box_item">
              <view class="left_time">
                <view class="time">08:00</view>
                <view class="date">2h50m</view>
                <view class="time">10:30</view>
              </view>
              <view class="item_line"></view>

              <view class="right_message">
                <view class="address">
                  <text>CKG</text>
                  <text>江北国际机场/T3</text>
                </view>

                <view class="filght_message">
                  <view class="info_message">
                    <image class="filght_icon" src="@/static/ticket_icon.png" mode="contain" />
                    <text>韩亚航空OZ354</text>
                    <text>空客A321(中)</text>
                  </view>
                  <view class="true_info_message">
                    <view class="true_info">
                      <image class="filght_icon" src="@/static/true_filght.png" mode="contain" />
                      <text>实际乘坐</text>
                    </view>
                    <image class="filght_icon" src="@/static/ticket_icon.png" mode="contain" />
                    <text>韩亚航空OZ354</text>
                    <text>空客A321(中)</text>
                  </view>
                </view>
                <view class="address">
                  <text>MFM</text>
                  <text>澳门国际机场</text>
                </view>
              </view>
            </view>

						<view class="transit_info">
							<text class="info_text">转 澳门 停留</text>
							<text class="info_time">1h15m</text>
							<view class="baggage_type true">行李直达</view>
						</view>

						<view class="vayage_box_item">
              <view class="left_time">
                <view class="time">11:45</view>
                <view class="date">3h25m</view>
                <view class="time">15:10</view>
              </view>
              <view class="item_line"></view>

              <view class="right_message">
                <view class="address">
                  <text>MFM</text>
                  <text>澳门国际机场</text>
                </view>

                <view class="filght_message">
                  <view class="info_message">
                    <image class="filght_icon" src="@/static/ticket_icon.png" mode="contain" />
                    <text>韩亚航空OZ354</text>
                    <text>空客A321(中)</text>
                  </view>
                  <view class="true_info_message" v-if="false">
                    <view class="true_info">
                      <image class="filght_icon" src="@/static/true_filght.png" mode="contain" />
                      <text>实际乘坐</text>
                    </view>
                    <image class="filght_icon" src="@/static/ticket_icon.png" mode="contain" />
                    <text>韩亚航空OZ354</text>
                    <text>空客A321(中)</text>
                  </view>
                </view>
                <view class="address">
                  <text>ICN</text>
                  <text>仁川国际机场/T2</text>
                </view>
              </view>
            </view>

          </view>
        </view>

				 <view class="info_item">
          <view class="item_title">
            <view class="type">返程</view>
            <view class="time">
              <text>2020-06-10</text>
              <text>周三</text>
            </view>
          </view>

          <view class="voyage_box">
            <view class="vayage_box_item">
              <view class="left_time">
                <view class="time">08:00</view>
                <view class="date">2h50m</view>
                <view class="time">10:30</view>
              </view>
              <view class="item_line"></view>

              <view class="right_message">
                <view class="address">
                  <text>CKG</text>
                  <text>江北国际机场/T3</text>
                </view>

                <view class="filght_message">
                  <view class="info_message">
                    <image class="filght_icon" src="@/static/ticket_icon.png" mode="contain" />
                    <text>韩亚航空OZ354</text>
                    <text>空客A321(中)</text>
                  </view>
                  <view class="true_info_message">
                    <view class="true_info">
                      <image class="filght_icon" src="@/static/true_filght.png" mode="contain" />
                      <text>实际乘坐</text>
                    </view>
                    <image class="filght_icon" src="@/static/ticket_icon.png" mode="contain" />
                    <text>韩亚航空OZ354</text>
                    <text>空客A321(中)</text>
                  </view>
                </view>
                <view class="address">
                  <text>MFM</text>
                  <text>澳门国际机场</text>
                </view>
              </view>
            </view>

						<view class="transit_info">
							<text class="info_text">转 澳门 停留</text>
							<text class="info_time">1h15m</text>
							<view class="baggage_type false">重新托运行李</view>
						</view>

						<view class="vayage_box_item">
              <view class="left_time">
                <view class="time">11:45</view>
                <view class="date">3h25m</view>
                <view class="time">15:10</view>
              </view>
              <view class="item_line"></view>

              <view class="right_message">
                <view class="address">
                  <text>MFM</text>
                  <text>澳门国际机场</text>
                </view>

                <view class="filght_message">
                  <view class="info_message">
                    <image class="filght_icon" src="@/static/ticket_icon.png" mode="contain" />
                    <text>韩亚航空OZ354</text>
                    <text>空客A321(中)</text>
                  </view>
                  <view class="true_info_message" v-if="false">
                    <view class="true_info">
                      <image class="filght_icon" src="@/static/true_filght.png" mode="contain" />
                      <text>实际乘坐</text>
                    </view>
                    <image class="filght_icon" src="@/static/ticket_icon.png" mode="contain" />
                    <text>韩亚航空OZ354</text>
                    <text>空客A321(中)</text>
                  </view>
                </view>
                <view class="address">
                  <text>ICN</text>
                  <text>仁川国际机场/T2</text>
                </view>
              </view>
            </view>

          </view>
        </view>
      </scroll-view>
    </uni-popup>

    <view class="filter">
      <flight-filter @openFilter="openFilter" :filterMini="true"></flight-filter>
    </view>

    <flight-filter-dialog ref="filterDialog" :directFlight="true"></flight-filter-dialog>

    <view class="bottom_bar">
      <view class="left_message">
        <view class="price_box">
          <text>&yen;</text>{{totalPrice}}
        </view>
        <view class="not_pass_message">往返总价</view>
      </view>
      <view class="right_message">
        <view
          :class="['flight_checked_btn',{isOpen: voyageInfoStatus}]"
          @click="openFlightInfo()"
        >已选航班</view>
        <view class="right_btn">下一步</view>
      </view>
    </view>
  </view>
</template>

<script>
import roundTripHeader from "@/components/roundTrip_header.vue"; // 往返日期状态栏
import flightFilter from "@/components/flight_filter.vue"; // 航班筛选
import flightFilterDialog from "@/components/flight_filter_dialog.vue"; // 航班筛选弹窗
export default {
  components: {
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
        from: "首尔"
      },

      flightList: [
        // 航班列表
        {
          topToTime: "12:30", // 去程出发时间
          topToAddress: "江北T3", // 去程出发地址
          topToDate: "3h30m", // 去程航行时间
          topToType: "直飞", // 去程航线类型
          topFromTime: "17:00", // 去程到达时间
          topFromDate: "", // 去程跨天时长
          topFromAddress: "仁川T2", // 去程到达地址
          topAir: "韩亚航空OZ354", // 去程航司
          topAirType: "空客A321(中)", // 去程机型
          price: "4142", // 价格
          extra: "4088", // 境外价格
          cabin: "经济舱", // 舱位类型
          btmToTime: "08:10", // 返程出发时间
          btmToAddress: "江北T3", // 返程出发地址
          btmToDate: "6h05m", // 返程航行时间
          btmToType: "转 香港", // 返程航线类型
          btmFromTime: "22:40", // 返程到达时间
          btmFromDate: "1", // 跨天时长
          btmFromAddress: "仁川T2", // 返程到达地址
          btmAir: "香港航空", // 返程航司
          btmAirType: "", // 返程机型
          active: false
        },
        {
          topToTime: "12:30", // 去程出发时间
          topToAddress: "江北T3", // 去程出发地址
          topToDate: "3h30m", // 去程航行时间
          topToType: "直飞", // 去程航线类型
          topFromTime: "17:00", // 去程到达时间
          topFromDate: "", // 去程跨天时长
          topFromAddress: "仁川T2", // 去程到达地址
          topAir: "韩亚航空OZ354", // 去程航司
          topAirType: "空客A321(中)", // 去程机型
          price: "3182", // 价格
          extra: "4088", // 境外价格
          cabin: "经济舱", // 舱位类型
          btmToTime: "08:10", // 返程出发时间
          btmToAddress: "江北T3", // 返程出发地址
          btmToDate: "6h05m", // 返程航行时间
          btmToType: "转 香港", // 返程航线类型
          btmFromTime: "22:40", // 返程到达时间
          btmFromDate: "1", // 跨天时长
          btmFromAddress: "仁川T2", // 返程到达地址
          btmAir: "香港航空", // 返程航司
          btmAirType: "", // 返程机型
          active: false
        },
        {
          topToTime: "12:30", // 去程出发时间
          topToAddress: "江北T3", // 去程出发地址
          topToDate: "3h30m", // 去程航行时间
          topToType: "直飞", // 去程航线类型
          topFromTime: "17:00", // 去程到达时间
          topFromDate: "", // 去程跨天时长
          topFromAddress: "仁川T2", // 去程到达地址
          topAir: "韩亚航空OZ354", // 去程航司
          topAirType: "空客A321(中)", // 去程机型
          price: "4312", // 价格
          extra: "4088", // 境外价格
          cabin: "经济舱", // 舱位类型
          btmToTime: "08:10", // 返程出发时间
          btmToAddress: "江北T3", // 返程出发地址
          btmToDate: "6h05m", // 返程航行时间
          btmToType: "转 香港", // 返程航线类型
          btmFromTime: "22:40", // 返程到达时间
          btmFromDate: "1", // 跨天时长
          btmFromAddress: "仁川T2", // 返程到达地址
          btmAir: "香港航空", // 返程航司
          btmAirType: "", // 返程机型
          active: false
        },
        {
          topToTime: "12:30", // 去程出发时间
          topToAddress: "江北T3", // 去程出发地址
          topToDate: "3h30m", // 去程航行时间
          topToType: "直飞", // 去程航线类型
          topFromTime: "17:00", // 去程到达时间
          topFromDate: "", // 去程跨天时长
          topFromAddress: "仁川T2", // 去程到达地址
          topAir: "韩亚航空OZ354", // 去程航司
          topAirType: "空客A321(中)", // 去程机型
          price: "6182", // 价格
          extra: "4088", // 境外价格
          cabin: "经济舱", // 舱位类型
          btmToTime: "08:10", // 返程出发时间
          btmToAddress: "江北T3", // 返程出发地址
          btmToDate: "6h05m", // 返程航行时间
          btmToType: "转 香港", // 返程航线类型
          btmFromTime: "22:40", // 返程到达时间
          btmFromDate: "1", // 跨天时长
          btmFromAddress: "仁川T2", // 返程到达地址
          btmAir: "香港航空", // 返程航司
          btmAirType: "", // 返程机型
          active: false
        }
			],
			
			totalPrice: 0, // 总价

      voyageInfoStatus: false // 航班详情状态
    };
  },
  methods: {
    // 选中航程
    checkedFlight(data, dataIndex) {
      this.flightList.forEach((item, index) => {
        if (dataIndex === index) {
					item.active = true
					this.totalPrice = data.price
        } else {
					item.active = false; 
        }
      });
    },

    // 打开航班详情
    openFlightInfo() {
      if (this.$refs.voyageInfo.showPopup) {
        this.closeVoyageInfo();
      } else {
        this.$refs.voyageInfo.open();
      }
    },
    changeVoyageInfo(e) {
      if (e.show) {
        this.$refs.voyageInfo.maskClass.bottom = "100rpx";
        this.$refs.voyageInfo.transClass.bottom = "100rpx";
        this.$refs.voyageInfo.transClass.zIndex = 1;
        this.voyageInfoStatus = true;
      } else {
        this.voyageInfoStatus = false;
      }
    },
    // 关闭航班详情
    closeVoyageInfo() {
      this.$refs.voyageInfo.close();
    },

    // 打开筛选
    openFilter() {
      this.$refs.filterDialog.openFilterDialog();
    },
    // 关闭弹出框
    closeFilterDialog() {
      this.$refs.filterDialog.closeFilterDialog();
    }
  },
  onLoad() {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
  }
};
</script>

<style scoped lang="less">
.ticketForeign {
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

    .flight_item {
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 12upx 18upx rgba(0, 0, 0, 0.04);
      border-radius: 20upx;
      margin: 20upx;
      display: flex;
      flex-direction: column;
      padding: 48upx 26upx 24upx 16upx;
      overflow: hidden;
      border: 2upx solid transparent;
      position: relative;
      &:last-child {
        margin-bottom: 140upx;
      }
      &.active {
        border-color: rgba(30, 139, 249, 1);
        &::before {
          content: "已选往返";
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
      .item_list {
        display: flex;
        &:first-child {
          padding-bottom: 26upx;
          margin-bottom: 26upx;
          border-bottom: 2upx dashed rgba(217, 225, 234, 1);
          .item_type {
            background: rgba(191, 223, 255, 1);
          }
        }
        .item_type {
          width: 30upx;
          height: 30upx;
          border-radius: 4upx;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(194, 239, 193, 1);
          font-size: 20upx;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          margin-right: 12upx;
          flex-shrink: 0;
          margin-top: 10upx;
        }
        .item_filght {
          display: inline-flex;
          flex-direction: column;
          .filght_message {
            display: flex;
            .filght_box {
              .time {
                font-size: 36upx;
                font-weight: bold;
                color: rgba(42, 42, 42, 1);
                margin-bottom: 6upx;
                display: inline-flex;
                .date_time {
                  font-size: 18upx;
                  font-weight: 400;
                  color: rgba(42, 42, 42, 1);
                  margin-left: 4upx;
                }
              }
              .address {
                font-size: 22upx;
                font-weight: 400;
                color: rgba(42, 42, 42, 1);
              }
            }
            .fight_line {
              text-align: center;
              margin: 0 52upx;
              .time {
                font-size: 22upx;
                font-weight: 400;
                color: rgba(175, 185, 196, 1);
              }
              .line_img {
                background: url(../../static/ticket_path.png) no-repeat center
                  center;
                background-size: contain;
                width: 112upx;
                height: 20upx;
              }
              .address {
                font-size: 22upx;
                font-weight: 400;
                color: rgba(175, 185, 196, 1);
              }
            }
          }
          .airlines {
            font-size: 20upx;
            font-weight: 400;
            color: rgba(175, 185, 196, 1);
            margin-top: 36upx;
            .airlines_logo {
              width: 20upx;
              height: 20upx;
              object-fit: contain;
              margin-right: 8upx;
            }
            .airlines_type {
              &::before {
                display: inline-flex;
                content: "|";
                margin: 0 10upx;
                color: rgba(211, 223, 236, 1);
              }
            }
          }
        }
        .item_price {
          margin-left: auto;
          text-align: right;
          .price_number {
            font-size: 42upx;
            font-weight: bold;
            color: rgba(255, 0, 0, 1);
            vertical-align: middle;
            text {
              font-size: 24upx;
            }
          }
          .extra_price {
            font-size: 20upx;
            font-weight: 400;
            color: rgba(0, 112, 226, 1);
            margin-bottom: 6upx;
          }
          .cabin_type {
            font-size: 22upx;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
          }
        }
      }
    }
  }

  .voyage_info {
    z-index: 10;
    /deep/.uni-transition {
      bottom: calc(100upx + var(--status-bar-height));
    }

    .title {
      height: 120upx;
      background: rgba(255, 255, 255, 1);
      border-radius: 80upx 80upx 0 0;
      position: relative;
      border-bottom: 2upx solid rgba(217, 225, 234, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      .title_text {
        font-size: 36upx;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
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
    .voyage_info_main {
			overflow-y: auto;
      background: rgba(255, 255, 255, 1);
			padding: 20upx 20upx 60upx;
			max-height: 75vh;
      .info_item {
				&:first-child{
						margin-bottom: 44upx;
					}
        .item_title {
          display: flex;
          align-items: center;
          margin-bottom: 20upx;
          .type {
            background: linear-gradient(
              270deg,
              rgba(0, 112, 226, 1) 0%,
              rgba(86, 197, 255, 1) 100%
            );
            border-radius: 10upx;
            padding: 4upx 20upx;
            font-size: 20upx;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            margin-right: 28upx;
          }
          .time {
            font-size: 24upx;
            font-weight: 400;
            color: rgba(42, 42, 42, 1);
            text {
              margin-right: 24upx;
            }
          }
        }

        .voyage_box {
					margin-left: 22upx;
          .vayage_box_item {
						display: flex;
						min-height: 170upx;
            .left_time {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              .time {
                font-size: 28upx;
                font-weight: bold;
                color: rgba(42, 42, 42, 1);
              }
              .date {
                font-size: 18upx;
                font-weight: 400;
								color: rgba(175, 185, 196, 1);
								display: inline-flex;
								align-items: center;
                &::before {
									content: "";
									display: block;
                  background: url(@/static/filter_time.png) no-repeat center
                    center;
                  background-size: contain;
                  width: 16upx;
                  height: 16upx;
                  margin-right: 4upx;
                }
              }
            }
            .item_line {
              width: 2upx;
              background-color: rgba(217, 225, 234, 1);
              display: flex;
							flex-direction: column;
							align-items: center;
							justify-content: space-between;
							position: relative;
							margin: 8upx 20upx;
              &::after,
              &::before {
                content: "";
                width: 18upx;
                height: 18upx;
                border: 4upx solid rgba(217, 225, 234, 1);
								border-radius: 50%;
								background-color: #fff;
              }

            }
            .right_message {
							display: flex;
							flex-direction: column;
              .address {
                font-size: 28upx;
                font-weight: bold;
								color: rgba(42, 42, 42, 1);
								&:last-child{
									margin-top: auto;
								}
                text {
                  margin-right: 10upx;
                }
							}
							.filght_message {
              font-size: 20upx;
              font-weight: 400;
							color: rgba(175, 185, 196, 1);
							margin: 6upx 0 16upx;
							.info_message{
								margin-bottom: 4upx;
							}
							.info_message,
							.true_info_message,
							.true_info{
								display: flex;
								align-items: center;
							}
							.true_info{
								margin-right: 12upx;
							}
              .filght_icon {
                width: 20upx;
                height: 20upx;
                object-fit: contain;
                margin-right: 10upx;
              }
            }
            }
            
					}
					.transit_info{
						display: inline-flex;
						align-items: center;
						height: 40upx;
						background:rgba(241,243,245,1);
						border-radius: 20upx;
						padding: 0 24upx;
						font-size: 20upx;
						font-weight:400;
						margin: 14upx 0 14upx 95upx;
						.info_text{
							color: #AFB9C4;
						}
						.info_time{
							color: #333;
							margin-left: 6upx;
						}
						.baggage_type{
							margin-left: 22upx;
							padding-left: 22upx;
							border-left: 2upx solid rgba(217,225,234,1);
							&.true{
								color: rgba(0,112,226,1);
							}
							&.false{
								color:rgba(251,152,38,1);
							}
							&::after{
								content: '';
								display: inline-block;
								background: url(@/static/arrow.png) no-repeat center center;
								background-size: contain;
								width: 10upx;
								height: 16upx;
								margin-left: 16upx;
							}
						}
					}
        }
      }
    }
  }

  .filter {
    position: fixed;
    width: calc(100% - 40upx);
    bottom: calc(156upx + var(--status-bar-height));
    left: 20upx;
    height: 80upx;
    border-radius: 50upx;
    box-shadow: 0 0 12upx rgba(0, 0, 0, 0.16);
    background: rgba(255, 255, 255, 1);
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
    position: relative;
    z-index: 98;

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
    .right_message {
      display: flex;
      align-items: center;
      .flight_checked_btn {
        font-size: 24upx;
        font-weight: 400;
        color: rgba(175, 185, 196, 1);
        display: inline-flex;
        align-items: center;
        margin-right: 20upx;
        &.isOpen {
          &::after {
            transform: rotate(180deg);
          }
        }
        &::after {
          content: "";
          margin-left: 8upx;
          background: url(@/static/flight_checked_btn.png) no-repeat center
            center;
          background-size: contain;
          width: 16upx;
          height: 12upx;
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
}
</style>
