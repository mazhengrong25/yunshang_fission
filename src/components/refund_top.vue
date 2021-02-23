<template>
  <view class="refund_top">
    <!-- 改签 -->
    <view v-if="topStatus === 'change'">
      <view class="top_message">改签信息</view>

      <view class="middle_message">
        <view class="message_first">改签类型</view>
        <view class="message_bottom_radio">
          <radio-group class="bottom_radio_list" @change="changeRadio">
            <label class="radio" v-for="(item, index) in changeType" :key="index">
              <radio :color="'#0070E2'" :checked="item.checked" :value="item.key" />
              <text>{{ item.value }}</text>
            </label>
          </radio-group>
        </view>
      </view>

      <view class="middle_message">
        <view class="message_first">是否自愿</view>
        <view class="message_bottom_radio">
          <radio-group class="bottom_radio_list" @change="radioChange">
            <label class="radio" v-for="(item, index) in radioItems" :key="index">
              <radio :color="'#0070E2'" :checked="item.checked" :value="item.key" />
              <text>{{ item.voluntary }}</text>
            </label>
          </radio-group>
        </view>
      </view>

      <view :class="['middle_message message_box', { is_show: radioValue === '1' }]">
        <view class="message_first">改签原因</view>
        <view class="message_bottom input-right-arrow" @click="openGroupChange">
          <text v-if="changeGroup" class="group_message">{{ changeGroup }}</text>
          <text v-else class="not_message">请选择</text>
        </view>
      </view>
    </view>
    <!-- 退票 -->
    <view v-else>
      <view class="top_message">退票信息</view>

      <view class="middle_message">
        <view class="message_first">是否自愿</view>
        <view class="message_bottom_radio">
          <radio-group class="bottom_radio_list" @change="radioChange">
            <label class="radio" v-for="(item, index) in radioItems" :key="index">
              <radio :color="'#0070E2'" :checked="item.checked" :value="item.key" />
              <text>{{ item.value }}</text>
            </label>
          </radio-group>
        </view>
      </view>

      <view :class="['middle_message message_box', { is_show: radioValue === '1' }]">
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
    <!-- 改签原因选择 -->
    <yun-selector
      ref="changeGroupPopup"
      :dataList="causeGroup"
      @submitDialog="changeGroupPopupSelecctBtn()"
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
    topStatus: {
      //区别退票和改签
      type: String,
      default: () => "",
    },
    valueType: {
      // 改签类型默认值
      type: String,
      default: () => "",
    },
    volunType: {
      // 改签是否自愿默认值
      type: String,
      default: () => "",
    },
    changeReason: {
      // 改签原因
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      /* 单选框 自愿与非自愿*/
      radioItems: [
        {
          voluntary: "自愿",
          value: "是",
          checked: true,
          key: 1,
        },
        {
          voluntary: "非自愿",
          value: "否",
          checked: false,
          key: 2,
        },
      ],

      // 改签类型
      changeType: [
        {
          value: "改期",
          key: 3,
          checked: true,
        },
        {
          value: "升舱",
          checked: false,
          key: 4,
        },
      ],
      radioValue: "1", //单选选择值
      radio_value: "", // 改签选择值

      // 理由
      group: "",
      changeGroup: "", // 原因

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

      // 原因选择
      causeGroup: [
        "【自愿】旅客自愿改签",
        "【改名】乘客姓名错误修改",
        "【非自愿】非自愿改签",
      ],
    };
  },
  methods: {
    // 单选点击
    radioChange(e) {
      this.radioValue = e.detail.value;
      console.log("是否自愿", this.radioValue);
      this.$emit("voluntary", this.radioValue);
      this.$forceUpdate();
    },

    // 改签选择
    changeRadio(e) {
      this.radio_value = e.detail.value;
      this.$emit("change", this.radio_value);
    },

    // 打开理由选择弹窗
    openGroupSelect() {
      this.$refs.groupPopup.openDialog();
    },

    //打开改签理由选择弹窗
    openGroupChange() {
      this.$refs.changeGroupPopup.openDialog();
    },

    // 确认理由
    groupPopupSelecctBtn(e) {
      console.log(e);
      this.group = e;
      this.$emit("reason", this.group);
    },

    // 确认原因
    changeGroupPopupSelecctBtn(e) {
      console.log("原因", e);
      this.changeGroup = e;
      this.$emit("cause", this.changeGroup);
    },
  },
  mounted() {
    console.log("组件状态", this.valueType, this.volunType, this.changeReason);
    // 改签类型
    if (this.valueType) {
      this.changeType.forEach((item) => {
        item.checked = this.valueType === String(item.key);
      });
    }
    // 是否自愿
    if (this.volunType) {
      this.radioItems.forEach((item) => {
        item.checked = this.volunType === String(item.key);
      });
      this.radioValue = this.volunType;
    }
    // 改签原因
    if (this.changeReason) {
      this.changeGroup = this.changeReason;
    }
  },
};
</script>

<style lang="less" scoped>
.refund_top {
  border-radius: 20upx;
  background: rgba(255, 255, 255, 1);
  margin: 20upx 20upx 20upx;
  padding: 24upx 20upx 0;

  .top_message {
    display: flex;
    align-items: center;
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
    padding: 30upx 0;
    &.message_box {
      border-top: 2upx solid #f1f3f5;
    }
    &.is_show {
      display: none;
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
      .group_message {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: right;
      }
      .not_message {
        // margin-right: 20px;
      }
    }
  }
}
</style>
