<!--
 * @Description: 钱包流水
 * @Author: wish.WuJunLong
 * @Date: 2020-08-03 17:22:34
 * @LastEditTime: 2020-10-30 14:51:02
 * @LastEditors: wish.WuJunLong
--> 
<template>
  <view class="wallet">
    <yun-header
      :statusHeight="iStatusBarHeight"
      :headerColor="true"
      centerTitle="钱包流水"
    ></yun-header>
    <scroll-view scroll-x="true" class="wallet_header">
      <view
        :class="['header_list', { active: headerActive === index }]"
        v-for="(item, index) in headerList"
        :key="index"
        @click="checkedWallet(item, index)"
        >{{ item }}</view
      >
    </scroll-view>

    <view class="filter_box">
      <view class="box_title">日期筛选</view>
      <view class="filter_message" @click="filterDialogBtn()">{{
        filterDate
      }}</view>
    </view>

    <view class="wallet_box">
      <view class="wallet_box_header">
        <view
          :class="['header_list', { active: walletPageIndex === index }]"
          v-for="(item, index) in walletHeaderList"
          :key="index"
          @click="checkedWalletSwiper(item, index)"
          >{{ item }}</view
        >
      </view>
      <swiper
        class="wallet_swiper"
        :current="walletPageIndex"
        @change="changeSwiper"
      >
        <swiper-item v-for="(v, i) in walletHeaderList" :key="i">
          <scroll-view
            :enable-back-to-top="true"
            scroll-y="true"
            class="swiper-item"
            @scrolltolower="nextPageData()"
          >
            <view
              class="item_list"
              v-for="(item, index) in i === 0
                ? walletTotal
                : i === 1
                ? walletIncome
                : i === 2
                ? walletExpenditure
                : []"
              :key="index"
              @click="jumpDetails(JSON.stringify(item))"
            >
              <view class="list_left">
                <view class="list_icon">
                  <image
                    v-if="item.trans_type === 2"
                    src="@/static/wallet_type_1.png"
                    mode="contain"
                  />
                  <image
                    v-if="item.trans_type === 5 || item.trans_type === 12"
                    src="@/static/wallet_type_2.png"
                    mode="contain"
                  />
                  <image
                    v-if="item.trans_type === 1"
                    src="@/static/wallet_type_3.png"
                    mode="contain"
                  />
                  <image
                    v-if="item.trans_type === 8 || item.trans_type === 9"
                    src="@/static/wallet_type_4.png"
                    mode="contain"
                  />
                  <image
                    v-if="item.trans_type === 4 || item.trans_type === 3"
                    src="@/static/wallet_type_6.png"
                    mode="contain"
                  />
                  <image
                    v-if="item.trans_type === 7"
                    src="@/static/wallet_type_7.png"
                    mode="contain"
                  />
                  <image
                    v-if="item.trans_type === 6"
                    src="@/static/wallet_type_5.png"
                    mode="contain"
                  />
                  <image
                    v-if="item.trans_type === 11"
                    src="@/static/wallet_type_9.png"
                    mode="contain"
                  />
                  <image
                    v-if="item.trans_type === 10"
                    src="@/static/wallet_type_8.png"
                    mode="contain"
                  />
                </view>
                <view class="list_message">
                  <view class="message_title">
                    {{
                      item.trans_type === 1
                        ? "钱包充值"
                        : item.trans_type === 2
                        ? "钱包消费"
                        : item.trans_type === 3
                        ? "短信充值"
                        : item.trans_type === 4
                        ? "短信消费"
                        : item.trans_type === 5
                        ? "信用额度调整"
                        : item.trans_type === 6
                        ? "冻结金额调整"
                        : item.trans_type === 7
                        ? "三方支付"
                        : item.trans_type === 8
                        ? "三方支付全退"
                        : item.trans_type === 9
                        ? "三方支付部分退"
                        : item.trans_type === 10
                        ? "提现"
                        : item.trans_type === 11
                        ? "流量充值"
                        : item.trans_type === 12
                        ? "预付款调整"
                        : ""
                    }}
                  </view>
                  <view class="message_item">{{ item.updated_at }}</view>
                </view>
              </view>
              <view class="list_right">
                {{
                  item.after_balance >
                  item.before_balance
                    ? "+"
                    : item.before_balance >
                      item.after_balance
                    ? "-"
                    : ""
                }}
                {{ Number(item.amount).toFixed(2) }}
              </view>
            </view>
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 筛选弹窗 -->
    <yun-selector
      ref="filterPopup"
      :dataList="groupList"
      :selectType="selectType"
      :dateType="dateType"
      @submitDialog="submitFilterBtn()"
    ></yun-selector>
  </view>
</template>

<script>
import userInfo from "@/api/getUserInfo.js";
import moment from "moment";
export default {
  data() {
    return {
      iStatusBarHeight: 0,
      headerList: ["总流水", "当月流水", "季度流水", "半年流水", "全年流水"],
      headerActive: 0, // 流水选择

      walletHeaderList: ["全部", "收入", "支出"], // 流水类型标题
      walletPageIndex: 0, // 流水类型

      walletTotal: [], // 全部流水列表
      walletIncome: [], // 收入流水列表
      walletExpenditure: [], // 支出流水列表
      currentPage: 1, // 当前列表页数

      isFilter: false,
      startTime: "", // 筛选开始时间
      endTime: "", // 筛选结束时间
      filterDate: "", // 筛选日期
      selectType: "date", // 筛选类型
      dateType: 3, // 筛选 3年月日 2年月 1年
      groupList: [], // 分组列表
    };
  },
  methods: {
    // 流水切换
    checkedWallet(val, index) {
      this.headerActive = index;
      if (this.headerActive === 0) {
        this.isFilter = false;
        this.startTime = "";
        this.endTime = "";
        this.filterDate = moment().format("YYYY年MM月DD日");
        this.selectType = "date";
        this.dateType = 3;
        this.getWalletData();
      } else if (this.headerActive === 1) {
        this.filterDate = moment().format("YYYY年MM月");
        this.selectType = "date";
        this.dateType = 2;
        let data = {
          year: moment().format("YYYY"),
          month: moment().format("MM"),
        };
        console.log(data);
        this.submitFilterBtn(data);
      } else if (this.headerActive === 2) {
        this.filterDate = moment().format("第Q季度");
        this.selectType = "text";
        this.groupList = ["第1季度", "第2季度", "第3季度", "第4季度"];
        this.submitFilterBtn(this.filterDate);
      } else if (this.headerActive === 3) {
        this.filterDate = moment().format("Q") > 2 ? "下半年" : "上半年";
        this.selectType = "text";
        this.groupList = ["上半年", "下半年"];
        this.submitFilterBtn(this.filterDate);
      } else if (this.headerActive === 4) {
        this.filterDate = moment().format("YYYY年");
        this.selectType = "date";
        this.dateType = 1;
        let data = {
          year: moment().format("YYYY"),
        };
        this.submitFilterBtn(data);
      }
    },

    // 流水类型切换
    checkedWalletSwiper(val, index) {
      this.walletPageIndex = index;
    },
    changeSwiper(e) {
      this.walletPageIndex = e.detail.current;
    },

    // 打开筛选弹窗
    filterDialogBtn() {
      this.$refs.filterPopup.openDialog();
    },
    // 确认筛选类型
    submitFilterBtn(e) {
      this.isFilter = true;
      let time;
      this.currentPage = 1;
      if (this.headerActive === 0) {
        time = e.year + "-" + e.month + "-" + e.day;
        this.filterDate = e.year + "年" + e.month + "月" + e.day + "日";
        this.startTime = time;
        this.endTime = time;
      } else if (this.headerActive === 1) {
        time = e.year + "-" + e.month;
        this.filterDate = e.year + "年" + e.month + "月";
        this.startTime = time + "-1";
        this.endTime = time + "-" + moment(time).daysInMonth();
      } else if (this.headerActive === 2) {
        if (e === "第1季度") {
          this.startTime = moment().format("YYYY") + "-1-1";
          this.endTime =
            moment().format("YYYY") +
            "-3-" +
            moment(moment().format("YYYY") + "-3", "YYYY-MM").daysInMonth();
        } else if (e === "第2季度") {
          this.startTime = moment().format("YYYY") + "-4-1";
          this.endTime =
            moment().format("YYYY") +
            "-6-" +
            moment(moment().format("YYYY") + "-6", "YYYY-MM").daysInMonth();
        } else if (e === "第3季度") {
          this.startTime = moment().format("YYYY") + "-7-1";
          this.endTime =
            moment().format("YYYY") +
            "-9-" +
            moment(moment().format("YYYY") + "-9", "YYYY-MM").daysInMonth();
        } else if (e === "第4季度") {
          this.startTime = moment().format("YYYY") + "-8-1";
          this.endTime =
            moment().format("YYYY") +
            "-12-" +
            moment(moment().format("YYYY") + "-12", "YYYY-MM").daysInMonth();
        }
        this.filterDate = e;
      } else if (this.headerActive === 3) {
        if (e === "上半年") {
          this.startTime = moment().format("YYYY") + "-1-1";
          this.endTime =
            moment().format("YYYY") +
            "-6-" +
            moment(moment().format("YYYY") + "-6", "YYYY-MM").daysInMonth();
        } else if (e === "上半年") {
          this.startTime = moment().format("YYYY") + "-7-1";
          this.endTime =
            moment().format("YYYY") +
            "-12-" +
            moment(moment().format("YYYY") + "-12", "YYYY-MM").daysInMonth();
        }
        this.filterDate = e;
      } else if (this.headerActive === 4) {
        this.startTime = e.year + "-1-1";
        this.endTime =
          e.year +
          "-12-" +
          moment(e.year + "-12")
            .format("YYYY-MM")
            .daysInMonth();

        this.filterDate = e.year + "年";
      }
      this.walletTotal = [];
      this.getWalletData(this.startTime, this.endTime);
      console.log(e);
    },

    // 获取流水数据
    getWalletData() {
      let data = {
        dis_id: uni.getStorageSync("userInfo").dis_id,
        page: this.currentPage,
        start_time: this.startTime || "",
        end_time: this.endTime || "",
      };
      userInfo.getWalletList(data).then((res) => {
        if (res.result === 10000) {
          if (res.data.data.length > 0) {
            if (this.walletTotal.length > 0) {
              this.walletTotal.push.apply(this.walletTotal, res.data.data);
            } else {
              this.walletTotal = res.data.data;
            }
            this.currentPage = res.data.current_page + 1;

            if (this.currentPage < 3) {
              this.getWalletData();
            }
            this.walletIncome = [];
            this.walletExpenditure = [];
            this.walletTotal.forEach((item) => {
              item.after_balance = Number(item.after_balance)
              item.before_balance = Number(item.before_balance)
              if (item.after_balance > item.before_balance) {
                this.walletIncome.push(item);
              }
              if (item.after_balance < item.before_balance) {
                this.walletExpenditure.push(item);
              }
            });
          } else {
            uni.showToast({
              title: "到底啦",
              icon: "none",
            });
          }
        }
      });
    },
    // 加载下一页数据
    nextPageData() {
      this.getWalletData();
    },

    // 跳转钱包流水详情
    jumpDetails(val) {
      console.log(JSON.parse(val));
      // let data = {
      //   data: JSON.parse(val)
      // }
      uni.navigateTo({
        url: "/userInfo/walletDetails?data= " + val,
      });
    },
  },
  created() {
    this.getWalletData();
    this.filterDate = moment().format("YYYY年MM月DD日");
  },
  onLoad() {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
  },
};
</script>

<style lang="less" scoped>
.wallet {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: rgba(243, 245, 247, 1);
  .wallet_header {
    width: 100vw;
    height: 160upx;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    white-space: nowrap;
    overflow-x: auto;
    background: #fff;
    .header_list {
      padding: 0 28upx;
      height: 60upx;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 6upx 12upx rgba(217, 225, 234, 1);
      border-radius: 80upx;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 28upx;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      margin-top: 50upx;
      margin-bottom: 50upx;
      &:first-child {
        margin-left: 20upx;
      }
      &:last-child {
        margin-right: 20upx;
      }
      &:not(:last-child) {
        margin-right: 30upx;
      }
      &.active {
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
  .filter_box {
    padding: 26upx 0 36upx 20upx;
    .box_title {
      font-size: 28upx;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      margin-bottom: 14upx;
    }
    .filter_message {
      font-size: 32upx;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      display: inline-flex;
      align-items: center;
      &::after {
        content: "";
        background: url(@/static/filter_arrow.png) no-repeat center center;
        background-size: contain;
        height: 12upx;
        width: 21upx;
        display: inline-block;
        margin-left: 16upx;
      }
    }
  }
  .wallet_box {
    flex: 1;
    background: #fff;
    display: flex;
    flex-direction: column;
    padding: 50upx 0 0;
    .wallet_box_header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding: 0 40upx;
      margin-bottom: 30upx;
      .header_list {
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 32upx;
        font-weight: bold;
        color: rgba(153, 153, 153, 1);
        &::after {
          content: "";
          width: 70upx;
          height: 10upx;
          background: rgba(30, 139, 249, 1);
          border-radius: 6upx;
          opacity: 0;
          margin-top: 4upx;
        }
        &.active {
          font-size: 40upx;
          color: rgba(42, 42, 42, 1);
          &::after {
            opacity: 1;
          }
        }
      }
    }
    .wallet_swiper {
      flex: 1;
      .swiper-item {
        height: 100%;
        .item_list {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 160upx;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0 4upx 20upx rgba(217, 225, 234, 0.6);
          border-radius: 20upx;
          margin: 0 20upx 20upx;
          padding: 0 20upx 0 6upx;
          .list_left {
            display: inline-flex;
            align-items: center;
            .list_icon {
              width: 110upx;
              height: 110upx;
              overflow: hidden;
              margin-right: 4upx;
              image {
                width: 100%;
                height: 100%;
                object-fit: contain;
              }
            }
            .list_message {
              .message_title {
                font-size: 32upx;
                font-weight: bold;
                color: rgba(51, 51, 51, 1);
                margin-bottom: 2upx;
              }
              .message_item {
                font-size: 24upx;
                font-weight: 400;
                color: rgba(153, 153, 153, 1);
              }
            }
          }
          .list_right {
            font-size: 40upx;
            font-weight: bold;
            color: rgba(51, 51, 51, 1);
          }
        }
      }
    }
  }
}
</style>
