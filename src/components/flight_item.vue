<!--
 * @Description: 航班信息 - 航班价格
 * @Author: wish.WuJunLong
 * @Date: 2020-06-24 16:32:24
 * @LastEditTime: 2020-10-19 13:48:39
 * @LastEditors: wish.WuJunLong
--> 
<template>
  <view class="item_box">
    <view class="item_box_header">
      <view class="box_header_left">
        <view class="left_prcie">
          <text
            class="unit"
            v-if="!isNaN(flightData.data.cabinPrices.ADT.rulePrice.price)"
            >&yen;</text
          >
          <text
            v-if="Number(flightData.data.cabinPrices.ADT.rulePrice.price) !== 0"
            >{{ flightData.data.cabinPrices.ADT.rulePrice.price }}</text
          >
          <text
            class="total"
            v-if="Number(flightData.data.cabinPrices.ADT.rulePrice.price) !== 0"
          >
            {{
              flightData.data.cabinPrices.ADT.build +
              flightData.data.cabinPrices.ADT.rulePrice.price
            }}(含税)
          </text>
          <text class="not_price" v-else>待获取</text>
          <!-- <view class="price_message" v-if="flightData.priceMessage">（含机建燃油）</view> -->
        </view>
        <view class="left_reward" v-if="flightData.reward > 0"
          >奖励金 &yen;{{ flightData.reward }}</view
        >
      </view>
      <view class="box_header_right">
        <button
          v-if="Number(flightData.data.cabinPrices.ADT.rulePrice.price) !== 0"
          :disabled="
            flightData.active ||
            flightData.data.cabinPrices.ADT.rulePrice.price === '无运价'
          "
          :class="[
            'header_right_btn',
            {
              active:
                flightData.active ||
                flightData.data.cabinPrices.ADT.rulePrice.price === '无运价',
            },
          ]"
          @click="jumpReservation"
        >
          {{
            !roundTripType ? "预定" : flightType === 0 ? "选为去程" : "选为返程"
          }}
        </button>
        <button v-else class="get_price" @click="getPriceBtn">立即获取</button>
        <view
          class="header_right_voteNumber"
          v-if="flightData.voteNumber !== 'A'"
          >{{ flightData.voteNumber }}张</view
        >
      </view>
    </view>

    <view class="item_box_bottom">
      <view class="bottom_message" @click="openFlightPopop">
        {{ flightData.cabin }} | 退改签规则
        {{ flightData.baggage ? " | " + flightData.baggage : "" }}
        <view class="message_more_btn"></view>
      </view>
      <!-- <view class="bottom_ticket_info">
				30分钟内出票 | 提供发票
      </view>-->
    </view>
  </view>
</template>

<script>
export default {
  props: {
    flightData: {
      type: Object,
      default: () => {},
    },
    roundTripType: {
      // 是否往返 true开启往返
      type: Boolean,
      default: () => false,
    },
    flightType: {
      // 往返状态 0 去程， 1返程
      type: Number,
      default: () => null,
    },
    flightIndex: {
      // 数据下标
      type: Number,
      default: () => null,
    },
    flightHeader: {
      // 数据类型头
      type: String,
      default: () => "",
    },
    type: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {};
  },
  methods: {
    // 打开说明弹窗
    openFlightPopop() {
      this.$emit("openExpDialog", this.flightData);
      // this.$parent.$refs.flightExplanation.open()
    },

    // 获取运价信息
    getPriceBtn() {
      this.$emit(
        "getPriceData",
        this.flightData,
        this.flightHeader,
        this.flightIndex,
        this.type
      );
    },

    // 跳转预定页面
    jumpReservation() {
      this.$emit(
        "jumpReservation",
        this.flightData,
        this.flightHeader,
        this.flightIndex,
        this.type
      );
    },
  },
};
</script>

<style scoped lang="less">
.item_box {
  padding: 22upx 30upx 20upx 28upx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 12upx 18upx rgba(0, 0, 0, 0.04);
  border-radius: 20upx;
  margin-bottom: 20upx;

  &:first-child {
    border-radius: 0 0 20upx 20upx;
  }

  .item_box_header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgba(241, 243, 245, 1);
    padding-bottom: 20upx;
    margin-bottom: 22upx;

    .box_header_left {
      .left_prcie {
        display: flex;
        align-items: baseline;
        font-size: 48upx;
        font-weight: bold;
        color: rgba(255, 0, 0, 1);

        .unit {
          font-size: 28upx;
          margin-right: 6upx;
        }
        .total {
          font-size: 20upx;
          font-weight: 400;
          color: #000;
          margin-left: 15upx;
        }
        .not_price {
          font-size: 40upx;
        }

        .price_message {
          font-size: 20upx;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
        }
      }

      .left_reward {
        background: rgba(255, 0, 0, 0.1);
        font-size: 18upx;
        font-weight: 400;
        color: rgba(255, 0, 0, 1);
        padding: 4upx 12upx;
        display: inline;
      }
    }

    .box_header_right {
      position: relative;

      .header_right_btn {
        background: linear-gradient(
          90deg,
          rgba(0, 112, 226, 1) 0%,
          rgba(86, 197, 255, 1) 100%
        );
        box-shadow: 0 6upx 12upx rgba(0, 112, 226, 0.3);
        border-radius: 90upx;
        font-size: 32upx;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        // letter-spacing:20px;
        padding: 18upx 46upx;
        line-height: unset;

        &.active {
          opacity: 0.4;
        }
      }
      .get_price {
        background: linear-gradient(
          90deg,
          rgba(255, 165, 0, 1) 0%,
          rgba(255, 165, 0, 0.6) 100%
        );
        box-shadow: 0 6upx 12upx rgba(255, 165, 0, 0.3);
        border-radius: 90upx;
        font-size: 32upx;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        // letter-spacing:20px;
        padding: 18rpx 14rpx;
        line-height: unset;
      }

      .header_right_voteNumber {
        font-size: 22upx;
        font-weight: 400;
        color: rgba(255, 0, 0, 1);
        text-align: center;
        width: 100%;
      }
    }
  }

  .item_box_bottom {
    .bottom_message {
      font-size: 24upx;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      display: inline-flex;
      align-items: center;
      margin-bottom: 12upx;

      .message_more_btn {
        background: url(@/static/arrow_more.png) no-repeat;
        background-size: contain;
        width: 8upx;
        height: 14upx;
        margin-left: 18upx;
      }
    }

    .bottom_ticket_info {
      font-size: 22upx;
      font-weight: 400;
      color: rgba(175, 185, 196, 1);
    }
  }
}
</style>
