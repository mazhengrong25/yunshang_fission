<template>
  <view>
    <uni-popup ref="flightExplanation" type="bottom">
      <view class="flight_explanation">
        <view class="title">
          <view class="close_btn" @click="closeExp"></view>
          <view class="explanation_header">
            <view
              @click="checkedExplanationBtn('info')"
              :class="['header_btn',{'is_active': popupCurrent === 'info'}]"
            >产品说明</view>
            <view
              @click="checkedExplanationBtn('retreat')"
              :class="['header_btn',{'is_active': popupCurrent === 'retreat'}]"
            >退改签</view>
            <view
              @click="checkedExplanationBtn('cabin')"
              :class="['header_btn',{'is_active': popupCurrent === 'cabin'}]"
            >行李额</view>
          </view>
        </view>

        <scroll-view
          class="flight_scroll"
          :scroll-into-view="popupCurrent"
          scroll-y="true"
          scroll-with-animation="true"
        >
          <view class="flight_explanation_main" v-if="showRule">
            <view id="info" class="main_box">
              <view class="main_title">航班信息</view>
              <view class="main_table">
                <view class="table_list">
                  <view class="list_title">起飞时间</view>
                  <view class="list_content">{{ruleInfos.filght.time}}</view>
                </view>
                <view class="table_list">
                  <view class="list_title">航班号</view>
                  <view class="list_content">{{ruleInfos.filght.code}}</view>
                </view>
                <view class="table_list">
                  <view class="list_title">行程</view>
                  <view class="list_content">{{ruleInfos.filght.address}}</view>
                </view>
                <view class="table_list">
                  <view class="list_title">舱位</view>
                  <view class="list_content">{{ruleInfos.filght.cabin}}</view>
                </view>
                <view class="table_list">
                  <view class="list_title">票面价</view>
                  <view
                    class="list_content"
                  >{{ruleInfos.filght.price !== 0? (ruleInfos.filght.price + '（元）'): '无运价'}}</view>
                </view>
              </view>
            </view>
            <view id="retreat" class="main_box">
              <view class="main_title">退票</view>
              <view class="main_table">
                <view
                  class="table_list"
                  v-for="(item, index) in ruleInfos.gauge.refund"
                  :key="index"
                >
                  <view class="list_title">{{Number(item.value)}}%</view>
                  <view class="list_content">{{item.title}}</view>
                </view>
              </view>
              <text class="not_message" v-if="ruleInfos.gauge.refund < 1">暂无数据</text>
              <view class="main_title" style="margin-top: 20rpx">改签</view>
              <view class="main_table">
                <view
                  class="table_list"
                  v-for="(item, index) in ruleInfos.gauge.change"
                  :key="index"
                >
                  <view class="list_title">{{Number(item.value)}}%</view>
                  <view class="list_content">{{item.title}}</view>
                </view>
              </view>
              <text class="not_message" v-if="ruleInfos.gauge.change < 1">暂无数据</text>
            </view>
            <view class="main_box">
              <view class="main_title">退改信息</view>
              <view class="main_message">{{ruleInfos.gauge.back_msg || '暂无数据'}}</view>
            </view>
            <view id="cabin" class="main_box">
              <view class="main_title">行李额</view>
              <view class="main_message">{{ruleInfos.filght.baggage || '暂无数据'}}</view>
            </view>
          </view>

          <view class="flight_explanation_main" v-else>
            <view id="info" class="main_box">
              <view class="main_title">航班信息</view>
              <view class="main_table">
                <view class="table_list">
                  <view class="list_title">起飞时间</view>
                  <view class="list_content">{{arrrRuleInfos.filght.time}}</view>
                </view>
                <view class="table_list">
                  <view class="list_title">航班号</view>
                  <view class="list_content">{{arrrRuleInfos.filght.code}}</view>
                </view>
                <view class="table_list">
                  <view class="list_title">行程</view>
                  <view class="list_content">{{arrrRuleInfos.filght.address}}</view>
                </view>
                <view class="table_list">
                  <view class="list_title">舱位</view>
                  <view class="list_content">{{arrrRuleInfos.filght.cabin}}</view>
                </view>
                <view class="table_list">
                  <view class="list_title">票面价</view>
                  <view
                    class="list_content"
                  >{{arrrRuleInfos.filght.price !== 0? (arrrRuleInfos.filght.price + '（元）'): '无运价'}}</view>
                </view>
              </view>
            </view>
            <view id="retreat" class="main_box">
              <view class="main_title">退票</view>
              <view class="main_table">
                <view
                  class="table_list"
                  v-for="(item, index) in arrrRuleInfos.gauge.refund"
                  :key="index"
                >
                  <view class="list_title">{{Number(item.value)}}%</view>
                  <view class="list_content">{{item.title}}</view>
                </view>
              </view>
              <text class="not_message" v-if="arrrRuleInfos.gauge.refund < 1">暂无数据</text>
              <view class="main_title" style="margin-top: 20rpx">改签</view>
              <view class="main_table">
                <view
                  class="table_list"
                  v-for="(item, index) in arrrRuleInfos.gauge.change"
                  :key="index"
                >
                  <view class="list_title">{{Number(item.value)}}%</view>
                  <view class="list_content">{{item.title}}</view>
                </view>
              </view>
              <text class="not_message" v-if="arrrRuleInfos.gauge.change < 1">暂无数据</text>
            </view>
            <view class="main_box">
              <view class="main_title">退改信息</view>
              <view class="main_message">{{arrrRuleInfos.gauge.back_msg || '暂无数据'}}</view>
            </view>
            <view id="cabin" class="main_box">
              <view class="main_title">行李额</view>
              <view class="main_message">{{arrrRuleInfos.filght.baggage || '暂无数据'}}</view>
            </view>
          </view>
        </scroll-view>
      </view>
    </uni-popup>
  </view>
</template>
<script>
export default {
  props: {
    ruleInfos: {
      type: Object,
      default:() => ({})
    },
    arrrRuleInfos: {
      type: Object,
      default:() => ({})
    },
  },
  data() {
    return {
      popupCurrent: "info",
      showRule: true,
    };
  },
  created() {
    console.log("初始值", this.ruleInfos);
  },
  methods: {
    checkedExplanationBtn(val) {
      this.popupCurrent = val;
    },
    // 打开退改签说明弹窗
    openExp() {
      this.showRule = true
      this.popupCurrent = "info";
      this.$refs.flightExplanation.open();
    },
    // 打开返程退改签
    openArrExp(){
      this.showRule = false
      this.popupCurrent = "info";
      this.$refs.flightExplanation.open();
    },
    // 关闭产品说明弹窗
    closeExp() {
      this.$refs.flightExplanation.close();
    },
  },
};
</script>
<style lang="less" scoped>
.flight_explanation {
  position: relative;
  &::before {
    content: "";
    position: absolute;
    bottom: -120upx;
    width: 100%;
    height: 120upx;
    background-color: #fff;
  }
  .title {
    height: 140upx;
    background: rgba(255, 255, 255, 1);
    border-radius: 80upx 80upx 0 0;
    position: relative;
    border-bottom: 2upx solid rgba(217, 225, 234, 1);
    display: flex;
    align-items: flex-end;
    .explanation_header {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding: 0 120upx 0 90upx;

      .header_btn {
        font-size: 30upx;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        &::after {
          content: "";
          width: 60upx;
          height: 8upx;
          background: rgba(0, 112, 226, 1);
          opacity: 0;
          border-radius: 4upx;
          margin-top: 32upx;
          transition: opacity 0.3s;
        }
        &.is_active {
          &::after {
            opacity: 1;
          }
          color: rgba(0, 112, 226, 1);
        }
      }
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
  .flight_scroll {
    overflow-y: auto;
    box-sizing: border-box;
    height: 60vh;
    width: 100%;
    background: rgba(255, 255, 255, 1);
  }
  .flight_explanation_main {
    margin: 0 20upx;
    .main_box {
      padding-top: 24upx;
      &:last-child {
        padding-bottom: 60upx;
      }
      .main_title {
        font-size: 30upx;
        font-weight: bold;
        color: #333333;
        margin-bottom: 20upx;
      }
      .main_table {
        .table_list {
          display: flex;
          align-items: center;
          height: 80upx;
          border: 2upx solid #f1f3f5;
          margin-top: -2upx;

          .list_title {
            width: 140upx;
            line-height: 80upx;
            background: #f9f9f9;
            padding-left: 22upx;
            border-right: 2upx solid #f1f3f5;
            font-size: 24upx;
            font-weight: 500;
            color: #333333;
            flex-shrink: 0;
          }
          .list_content {
            height: 100%;
            padding-left: 22upx;
            display: inline-flex;
            align-items: center;
            font-size: 24upx;
            font-weight: 500;
            color: #999999;
          }
        }
      }
      .not_message{
        font-size: 24upx;
        font-weight: 500;
        color: #999999;
      }
      .main_message {
        font-size: 24upx;
        font-weight: 500;
        color: #999999;
      }
    }
  }
}
</style>