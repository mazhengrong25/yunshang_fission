<template>
  <view class="refund_top">
    <view>
      <view class="top_message">退票信息</view>
      <view class="middle_message">
        <view class="message_first">是否自愿</view>
        <view class="message_bottom_radio">
          <radio-group class="bottom_radio_list" @click="radioChange(item)">
            <label
              class="radio"
              v-for="(item, index) in radioItems"
              :key="index"
            >
              <radio :color="'#0070E2'" :checked="item.checked"></radio>
              <text>{{ item.value }}</text>
            </label>
          </radio-group>
        </view>
      </view>
      <view class="middle_message">
        <view class="message_first">退票理由</view>
        <view class="message_bottom input-right-arrow" @click="openGroupSelect">
          <text v-if="group" class="group_message">{{ group }}</text>
          <text v-else class="not_message">请选择</text>
        </view>
      </view>
    </view>
    <!-- 退票理由选择 -->
    <yun-selector
      ref="groupPopup"
      :dataList="reasonGroup"
      @submitDialog="groupPopupSelecctBtn()"
    ></yun-selector>
  </view>
</template>

<script>
export default {
  components: {},
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
    dataList: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      /* 单选框*/
      radioItems: [
        {
          value: "是",
          checked: "true",
        },
        {
          value: "否",
        },
      ],

      // 理由   之前是{} 出现bug
      group: "",

      // 理由选择
      reasonGroup: [
        "因航班取消延误，申请全退",
        "其他退票原因",
        "升舱换开，申请全退",
        "名字错换开重开，申请全退",
        "客人因无法乘机，申请全退",
        "其他退票理由",
        "供应商没有出票，申请全退",
        "申请退回票款差价",
        "重构客票，以提交航司审核为准",
        "重复支付，申请全退",
        "客票不退，请供应商退回多收票款",
        "供应商没有出票，已支付，申请全退",
        "航空公司会员客户，申请全退",
        "前段航班变动，导致后段无法乘坐，申请全退",
        "特殊订票退票，已提供相关证明，申请全退",
        "备降",
        "扫描过期票",
        "过期退票",
        "关爱计划退票",
        "过期客票私自退，未告知客人",
      ],
    };
  },
  methods: {
   
    // 单选点击
    radioChange(e) {
        console.log(e)
        this.radioItems[checked] = e
    },
    // 打开理由选择弹窗
    openGroupSelect() {
      this.$refs.groupPopup.openDialog();
    },

    // 确认理由
    groupPopupSelecctBtn(e) {
      console.log(e);
      this.group = e;
    },
  },
};
</script>

<style lang="less" scoped>
.refund_top {
  border-radius: 20upx;
  background: rgba(255, 255, 255, 1);
  margin: 20upx 20upx 20upx;
  padding: 24upx 20upx 20upx;

  .top_message {
    display: flex;
    align-items: center;
    margin-bottom: 24upx;
    padding-top: 24upx;
    color: rgba(42, 42, 42, 1);
    font-size: 32upx;
    font-weight: Bold;
  }
  .middle_message {

    display: flex;
    align-items: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    height: 100upx;
    &:not(:last-child) {
      border-bottom: 2upx solid #f1f3f5;
    }
    &:first-child {
      padding-bottom: 34upx;
    }
    .message_first {
      font-size: 28upx;
      color: rgba(153, 153, 153, 1);
      display: flex;
      justify-content: start;
      margin-right: 26upx;
      line-height: 17px;
      margin-right: 40upx;
    }
    .message_bottom_radio {
      font-size: 28upx;
      flex: 1;
      display: flex;
      justify-content: space-between;
      .bottom_radio_list {
        flex: 1;
        display: flex;
        justify-content: flex-start;
        .radio:first-child {
          margin-right: 100upx;
        }
      }
    }
    .message_bottom {
      font-size: 28upx;
      color: rgba(42, 42, 42, 1);
      width: 240px;
      display: inline-flex;
      justify-content: flex-end;
      flex: 1;
      .group_message{
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: right;
      }
      .not_message{

        // margin-right: 20px;
      }
    }
  }
}
</style>
