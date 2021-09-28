<!--
 * @Description: 火车票 --- 改签订单
 * @Author: mzr
 * @Date: 2021-08-27 10:08:44
 * @LastEditTime: 2021-09-26 13:41:03
 * @LastEditors: mzr
-->
<template>
    <view class="train_change">
        <yun-header :statusHeight="iStatusBarHeight" :centerTitle="orderHeaderTitle"></yun-header>

        <view class="order_header">
            <view :class="['header_list', { active: headerActive === index }]" v-for="(item, index) in headerList" :key="index" @click="checkedHeaderActive(index)">{{ item }}</view>
        </view>

        <view class="order_filter">
            <view :class="['filter_list', { active: applyTimeStatus }]" @click="sorTime()">
                <view class="list_icon">
                    <image v-if="applyTimeStatus" src="@/static/filter_apply_btn_active.png" mode="contain" />
                    <image v-else src="@/static/filter_apply_btn.png" mode="contain" />
                </view>
                <view class="list_title">申请(早-晚)</view>
            </view>

            <view 
              :class="[
                'filter_list',
                { active: JSON.stringify(this.changeListFilter) !== '{}' },
              ]"
              @click="goFilter('2')">
                <view class="list_icon">
                    <image
                      v-if="JSON.stringify(this.changeListFilter) !== '{}'"
                      src="@/static/filter_btn_active.png"
                      mode="contain"
                    />
                    <image v-else src="@/static/filter_btn.png" mode="contain" />
                </view>
                <view class="list_title">筛选</view>
            </view>
        </view>

        <scroll-view :scroll-y="true" :enable-back-to-top="true" :scroll-top="scrollTop" @scroll="scroll" class="content">
          
          <view
            class="content_list"
            v-for="(item, index) in changeList"
            :key="index"
          >
            <view class="list_item" @click="jumpChangeDetails(item)">
              <view class="item_header">
                <view class="item_title">
                  <view class="title">{{ item.segments[0].from_city || '' }} - {{ item.segments[0].to_city || ''}}</view>
                </view>
                <view class="item_price" v-if="item.status === 2">
                  <text>&yen;</text>
                  {{item.total_price}}
                </view>
                <view class="info_right" v-else>
                  <text :style="{color:(item.status === 6)?'#FF0000':''}">
                    {{
                      item.status === 1
                        ? "占座中"
                        : item.status === 2
                        ? "待支付"
                        : item.status === 3
                        ? "出票中"
                        : item.status === 4
                        ? "已出票"
                        : item.status === 5
                        ? "已取消"
                        : item.status === 6
                        ? "占座失败"
                        : item.status === 7
                        ? "出票失败"
                        : ""
                    }}
                  </text>
                </view>
              </view>
              <view class="item_info">
                <view class="info_left">
                  <text class="left_title">乘车人</text>
                  <view class="left_message">
                    <text
                      class="message_passenger"
                      v-for="(oitem, oindex) in item.passengers"
                      :key="oindex"
                      >{{ oitem.PassengerType === 'ADT' ? oitem.PassengerName:`+${item.chdNumber}儿童` }}</text
                    >
                  </view>
                </view>
                <view class="info_right"></view>
              </view>

              <view class="item_time" v-if="item.status === 2">
                  <view class="time_icon">
                      <image src="@/static/remaining_time.png" mode="aspectFit" />
                  </view>
                  <view class="time_text">剩余支付时间：</view>
                  <view class="time_number">{{Math.floor(item.overdue_time / 60 % 60)}}分钟</view>
              </view>
              <view class="item_btn_box" v-if="item.status === 2">
                  <view class="item_btn close_btn" @click.stop="getCancel(item)">取消订单</view>
                  <view class="item_btn submit_btn" @click.stop="jumpOrderPay(item)">去支付</view>
              </view>

            </view>
          </view>

          <!-- 缺省页 -->
          <default-page v-if="showDefault" defaultType="not_order"></default-page>

        </scroll-view>

    </view>
</template>

<script>
import orderApi from "@/api/order.js";
export default {
    data() {
      return {
        iStatusBarHeight: 0,
        oldScrollTop: 0,
        orderHeaderTitle: "火车票改签订单",
        headerList: ["全部", "待支付", "改签占座中", "已出票","已取消"], // 订单列表类别
        headerActive: 0,

        changeList:[], // 改签列表
        changeListFilter:{}, // 筛选条件

        showDefault: false, // 报错页面
        applyTimeStatus: false, // 申请时间状态
       
      }
    },
    methods: {
        // 滚动
        scroll(e) {
            this.oldScrollTop = e.detail.scrollTop;
        },

        checkedHeaderActive(index) {
            this.headerActive = index
            this.getTrainChangeList();
        },

        // 时间排序
        sorTime() {
          this.applyTimeStatus = !this.applyTimeStatus
          this.changeList.sort(this.applySort("created_at"));
        },

        // 申请时间排序
        applySort(t) {
          return (m, n) => {
            var a = new Date(m[t]).getTime();
            var b = new Date(n[t]).getTime();
            return a - b;
          };
        },

        //跳转到筛选页面
        goFilter(val) {
            uni.navigateTo({
                url:
                  "/order/trainFilter?type=" +  
                  val + 
                  "&changeData=" +
                  JSON.stringify(this.changeListFilter),
            });
        },

        // 获取火车票列表
        getTrainChangeList() {
          let data = {
        
            status : this.headerActive === 0 ?
                        []:
                        this.headerActive === 1 ?
                          [2]:
                          this.headerActive === 2 ?
                            [1]:
                            this.headerActive === 3 ?
                              [4]:
                              this.headerActive === 4 ?
                                [5]:
                                [],
            order_no: this.changeListFilter.order_no || "", // 订单号
            train_date_start: this.changeListFilter.train_date_start || this.$moment().subtract(3,"days").format("YYYY-MM-DD"), // 开始时间
            train_date_end: this.changeListFilter.train_date_end || this.$moment().format("YYYY-MM-DD"), // 结束时间
            PassengerName: this.changeListFilter.PassengerName, // 乘车人
            ticket_number: this.changeListFilter.ticket_number, // 取票号

          }
          orderApi.trainChangeList(data).then((res) => {
            console.log(res)
            if (res.code === 0) {
                
              this.changeList = res.data.data;
              this.showDefault = false;

              // 缺省状态
              this.showDefault = this.changeList.length < 1;
              
              // 儿童个数
              this.changeList.forEach((item) => {
                  let chdNumber = 0
                  item.passengers.forEach(oitem => {
                      if (oitem.PassengerType === "CHD") {
                          chdNumber += 1
                      }
                  })
                  item['chdNumber'] = chdNumber
              })
            } else {
                this.showDefault = true;
                uni.showToast({
                    title: res.msg,
                    icon: "none",
                    duration: 3000,
                })
            }
              
          })
        },

        // 跳转到详情
        jumpChangeDetails(data) {
            uni.navigateTo({
                url:
                    "/order/trainChangeDetails?change_no=" +
                    data.change_no
            });
        },

        // 待支付  取消订单
        getCancel(e) {
          uni.navigateTo({
              url: "/order/trainChangeDetails?change_no=" + e.change_no,
          });
        },

        // 待支付  去支付
        jumpOrderPay(val) {
          uni.navigateTo({
              url: "/trainReservation/orderPay?orderNo=" + 
              val.change_no +
              "&detailItem=" +
              JSON.stringify(val)
          });
        }

       
    },
    onLoad() {
        this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    },
    onShow() {
      this.changeListFilter = uni.getStorageSync("trainFilter")
        ? JSON.parse(uni.getStorageSync("trainFilter"))
        : {};
      if(JSON.stringify(this.changeListFilter) !== "{}") {
        //改签状态筛选
        if (this.changeListFilter.status !== null) {
          this.checkedHeaderActive(Number(this.changeListFilter.status));
        } else {
          this.checkedHeaderActive([0]);
        }
        console.log('改签筛选',this.changeListFilter)
      }else {
        this.headerActive = 0;
        this.getTrainChangeList();
      }
    }
   
}
</script>

<style lang="less" scoped>
.train_change {
    background: rgba(243, 245, 247, 1);
    height: 100vh;
    display: flex;
    flex-direction: column;
    .order_header {
        height: 88upx;
        background: rgba(0, 112, 226, 1);
        box-shadow: 10upx 30upx 54upx rgba(0, 0, 0, 0.05);
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        .header_list {
            padding: 0 24upx;
            font-size: 28upx;
            font-weight: 400;
            color: rgba(255, 255, 255, 0.5);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            padding-bottom: 8upx;
            &::after {
                content: "";
                display: block;
                width: 100%;
                height: 6upx;
                background: rgba(255, 255, 255, 1);
                border-radius: 4upx;
                margin-top: 8upx;
                opacity: 0;
            }
            &.active {
                font-weight: bold;
                color: rgba(255, 255, 255, 1);
                &::after {
                    opacity: 1;
                }
            }
        }
    }
    .order_filter {
        height: 40px;
        background: rgba(255, 255, 255, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        .filter_list {
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 1;
            padding: 10upx 40upx;
            &.active {
                .list_title {
                    color: #0070e2;
                }
            }
            &:not(:last-child) {
                border-right: 2upx solid #eaeaea;
            }
            .list_icon {
                width: 30upx;
                height: 30upx;
                margin-right: 8upx;
                display: flex;
                image {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
            }
            .list_title {
                font-size: 22upx;
                font-weight: 400;
                color: #959da7;
            }
        }
    }
    .content {
        flex: 1;
        box-sizing: border-box;
        overflow-y: auto;
        .content_list {
            margin: 0 20upx 40upx;
            &:first-child {
              margin-top: 40upx;
            }
            .list_tyle {
              display: inline-flex;
              align-items: center;
              padding: 0 32upx;
              height: 50upx;
              background: rgba(123, 155, 193, 0.4);
              border-radius: 26upx;
              font-size: 24upx;
              font-weight: 400;
              color: rgba(255, 255, 255, 1);
              margin-bottom: 20upx;
            }
            .multiple_trips_header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              height: 92upx;
              padding: 0 20upx;
              border-bottom: 2upx solid rgba(241, 243, 245, 1);
              background: #fff;
              border-radius: 20upx 20upx 0 0;
              .header_title {
                font-size: 28upx;
                font-weight: 400;
                color: rgba(153, 153, 153, 1);
              }
              .header_price {
                font-size: 42upx;
                font-weight: bold;
                color: rgba(255, 0, 0, 1);
                text {
                  font-size: 24upx;
                  margin-right: 4upx;
                }
              }
            }
            .list_item {
              background: rgba(255, 255, 255, 1);
              box-shadow: 0 12upx 18upx rgba(0, 0, 0, 0.04);
              border-radius: 20upx;
              padding: 20upx 20upx 40upx;
              &.multiple_trips_item {
                border-radius: 0;
                &:last-child {
                  border-radius: 0 0 20upx 20upx;
                  .item_header {
                    .info_right {
                      display: none;
                    }
                  }
                }
                &:not(:last-child) {
                  .item_time,
                  .item_btn_box {
                    display: none;
                  }
                }
              }
              .item_header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 16upx;
                .item_title {
                  display: flex;
                  align-items: center;
                  .title_type {
                    display: inline-flex;
                    align-items: center;
                    padding: 0 20upx;
                    height: 30upx;
                    background: linear-gradient(
                      270deg,
                      rgba(0, 112, 226, 1) 0%,
                      rgba(86, 197, 255, 1) 100%
                    );
                    border-radius: 10upx;
                    font-size: 20upx;
                    font-weight: 400;
                    color: rgba(255, 255, 255, 1);
                    margin-right: 12upx;
                    &.return_trip {
                      background: linear-gradient(
                        90deg,
                        rgba(155, 236, 153, 1) 0%,
                        rgba(133, 205, 131, 1) 100%
                      );
                    }
                  }
                  .title {
                    font-size: 34upx;
                    font-weight: bold;
                    color: rgba(42, 42, 42, 1);
                  }
                }
                .item_price {
                  font-size: 42upx;
                  font-weight: bold;
                  color: rgba(255, 0, 0, 1);
                  text {
                    font-size: 24upx;
                    margin-right: 4upx;
                  }
                }
                .info_right {
                  font-size: 24upx;
                  font-weight: 400;
                  color: rgba(42, 42, 42, 1);
                }
              }
              .item_info {
                display: flex;
                align-items: center;
                justify-content: space-between;
                .info_left {
                  font-size: 24upx;
                  font-weight: 400;
                  color: rgba(42, 42, 42, 1);
                  display: flex;
                  align-items: center;
                  flex: 1;
                  .left_title {
                    margin-right: 20upx;
                    flex-shrink: 0;
                  }
                  .left_message {
                    color: rgba(175, 185, 196, 1);
                    width: 300upx;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    .message_passenger {
                      &:not(:last-child) {
                        &::after {
                          content: "/";
                        }
                      }
                    }
                  }
                }
                .info_right {
                  font-size: 24upx;
                  font-weight: 400;
                  color: rgba(42, 42, 42, 1);
                  flex-shrink: 0;
                }
              }
              .item_time {
                margin: 34upx 0;
                height: 64upx;
                background: rgba(243, 245, 247, 1);
                border-radius: 20upx;
                display: flex;
                align-items: center;
                padding: 0 20upx;
                font-size: 24upx;
                font-weight: bold;
                color: #2a2a2a;
                .time_icon {
                  width: 24upx;
                  height: 24upx;
                  margin-right: 10upx;
                  image {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                  }
                }
                .time_number {
                  color: #ff0000;
                }
              }
              .item_btn_box {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                .item_btn {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 170upx;
                  height: 64upx;
                  border: 2upx solid rgba(223, 223, 223, 1);
                  border-radius: 50upx;
                  font-size: 24upx;
                  font-weight: 400;
                  color: rgba(51, 51, 51, 1);
                  margin-left: 20upx;
                  &.submit_btn {
                    background: rgba(0, 112, 226, 1);
                    color: rgba(255, 255, 255, 1);
                    border-color: rgba(0, 112, 226, 1);
                  }
                }
              }
            }
        }
    }
}
</style>