<!--
 * @Description: 机票预订信息
 * @Author: wish.WuJunLong
 * @Date: 2020-06-24 17:19:07
 * @LastEditTime: 2020-09-30 16:48:26
 * @LastEditors: mazhengrong
--> 
<template>
  <view class="flight_reservation">
    <yun-header
      :statusHeight="iStatusBarHeight"
      :headerBottom="Number(10)"
      :headerAddress="headerAddress"
    ></yun-header>
    <scroll-view
      :enable-back-to-top="true"
      :scroll-y="true"
      class="flight_reservation_main"
    >
      <flight-header
        v-if="showData"
        :flightInfo="false"
        :flightData="flightData"
        :roundTripType="roundTripType"
        :roundTripFlightData="flightRoundData"
        @openHeadExpPopup="openHeadExpPopup"
      ></flight-header>

      <view v-else class="not_flight_data">
        <text></text>
        <text></text>
        <view></view>
      </view>

      <view class="passenger_box box-shadow-style">
        <view class="passenger_title">
          <view class="title_text">
            <text v-if="passengerList.length < 1">乘机人</text>
            <text v-else
              >已选 {{ passengerNumber.adt ? passengerNumber.adt + "成人" : ""
              }}{{
                passengerNumber.chd ? "，" + passengerNumber.chd + "儿童" : ""
              }}{{
                passengerNumber.inf ? "，" + passengerNumber.inf + "婴儿" : ""
              }}</text
            >
          </view>
          <view class="add_passenger_btn" @click="jumpPassengerPage"
            >添加乘机人</view
          >
        </view>

        <!-- <uni-swipe-action class="passenger_main" v-if="passengerList.length > 0">
          <uni-swipe-action-item class="main_list" v-for="(item, index) in passengerList" :key="index">
            
          </uni-swipe-action-item>
        </uni-swipe-action>-->

        <uni-swipe-action
          class="passenger_main"
          v-if="passengerList.length > 0"
        >
          <uni-swipe-action-item
            :class="['main_list', { show: item.show }]"
            v-for="(item, index) in passengerList"
            :key="index"
          >
            <view class="remove_btn" @click="removePassenger(item)"></view>
            <view class="list_message">
              <view class="message_info">
                <view class="info_left">
                  <view class="type">{{ item.type }}票</view>
                  <view class="user_name">{{
                    item.name || item.en_first_name + "/" + item.en_last_name
                  }}</view>
                  <view class="position">{{
                    item.group ? item.group : "未分组"
                  }}</view>
                </view>
                <view class="edit_btn" @click="flightEdit(item, index)"></view>
              </view>

              <view class="message_info">
                <view class="bottom_left">
                  <view class="bottom_title">{{ item.cert_type }}</view>
                  <view class="card">{{ item.cert_no }}</view>
                </view>
                <view class="insurance_box">
                  <yun-switch
                    :value="item.is_insure"
                    text="保险"
                    @switchStauts="passInsSwitch()"
                    :index="index"
                  ></yun-switch>
                </view>
              </view>
            </view>
            <template v-slot:right>
              <view class="option_box">
                <view class="delete_btn" @click="removePassenger(item)">
                  <image
                    class="delete_btn_icon"
                    src="@/static/delete_btn.png"
                    mode="contain"
                  />
                  <text>删除</text>
                </view>
              </view>
            </template>
          </uni-swipe-action-item>

          <view class="add_child_btn" @click="jumpAddPassenger()">
            <image
              class="add_child_btn_icon"
              src="@/static/add_icon.png"
              mode="contain"
            />
            <text>添加儿童/婴儿</text>
          </view>
        </uni-swipe-action>
      </view>

      <view class="order_passenger_message box-shadow-style">
        <view class="title_text title_required">订单联系人信息</view>

        <view class="order_passenger_form">
          <view class="form_item">
            <view class="form_item_title">联系人</view>
            <input
              class="form_item_input"
              type="text"
              placeholder="请填写姓名"
              placeholder-style="fontSize: 28upx;fontWeight:400;color:rgba(175,185,196,1);"
              v-model="orderPassenger.name"
            />
          </view>
          <view class="form_item">
            <view class="form_item_title">手机号</view>
            <!--
            <picker
              class="phone_numbering"
              @change="bindPickerChange"
              :value="areaCodeIndex"
              :range="areaCode"
              mode="selector"
            >
              <view class="phone_numbering_input">{{areaCode[areaCodeIndex]}}</view>
            </picker>
            -->
            <input
              class="form_item_input"
              type="number"
              placeholder="用于接收订单通知"
              placeholder-style="fontSize: 28upx;fontWeight:400;color:rgba(175,185,196,1);"
              v-model="orderPassenger.phone"
            />
          </view>
          <view class="form_item">
            <view class="form_item_title">邮箱</view>
            <input
              class="form_item_input"
              type="text"
              placeholder="用于接收订单邮件"
              placeholder-style="fontSize: 28upx;fontWeight:400;color:rgba(175,185,196,1);"
              v-model="orderPassenger.email"
            />
          </view>
        </view>
      </view>

      <view class="insurance_list box-shadow-style">
        <view class="title_text">
          <image
            class="title_icon"
            src="@/static/insurance.png"
            mode="aspectFill"
          />购买保险
        </view>
        <view class="insurance_box">
          <view
            class="insurance_box_item"
            v-for="(item, index) in insuranceList.slice(0, moreInsurance)"
            :key="index"
            @click="changeInsurance(insuranceList[index])"
          >
            <view class="item_name">
              {{ item.insure_desc }}(保额{{
                (Number(item.amount) / 10000).toFixed(0)
              }}万)
              <text :class="['item_icon', { true: item.type }]"></text>
            </view>
            <view class="item_check">
              <view class="item_price">
                <text
                  >&yen; {{ Number(item.default_dis_price).toFixed(0) }}</text
                >/份
              </view>
              <view
                :class="[
                  'item_icon',
                  { is_active: insuranceActive.id === item.id },
                ]"
              ></view>
            </view>
          </view>
          <view
            v-if="insuranceList.length > 4"
            @click="showMoreInsurance()"
            :class="['more_btn', { open: moreInsurance === 4 }]"
            >{{ moreInsurance === 4 ? "展开全部" : "收起全部" }}</view
          >
        </view>
      </view>

      <view class="reward_list box-shadow-style">
        <view class="title_text">
          <image
            class="title_icon"
            src="@/static/reward.png"
            mode="aspectFill"
          />本单奖励
        </view>
        <view class="reward_box">
          <view class="reward_list">
            <view class="list_name">奖励金</view>

            <view class="list_price">&yen; {{ priceInfo.reward }}</view>
          </view>
          <!-- <view class="reward_list">
            <view class="list_name">返点</view>

            <view class="list_price">&yen; 5</view>
          </view>-->
        </view>
      </view>

      <!-- 
        <view class="reimbursement box-shadow-style">
          <view class="item_list">
            <view class="list_title">报销凭证</view>
            <yun-switch :value="reimbursement" @switchStauts="reimbursementSwitch"></yun-switch>
          </view>

          <view class="flase_reim" v-if="!reimbursement">您未选择报销凭证，订单出票后可在详情页内申请</view>
          <view class="true_reim" v-else>
            <view class="reim_title">邮寄地址</view>

            <view class="reim_box" @click="jumpAddMailAddress">
              <view class="not_reim">请填写邮件地址</view>
              <view class="reim_message">
                <view class="message_list">
                  <text>马某某</text><text>1321241234</text>
                </view>
                <view class="message_list">重庆市渝中区长江一路69号云上航空4楼</view>
              </view>
            </view>
          </view>
        </view>
      -->

      <view class="disclaimer">
        免责声明：下单表示已阅读并同意遵守退改签规则
        <text
          @click="
            openStatementWeb('https://fxxcx.ystrip.cn/show/contentStatement')
          "
          >《关于规范互联网机票销售行为的通知》</text
        >
        <text v-if="statement.title"
          @click="
            openStatementWeb(
              'https://fxxcx.ystrip.cn/air_file/' +
                statement.code +
                '/' +
                statement.code +
                '.html'
            )
          "
          >《{{ statement.title }}》</text
        >
        <text
          @click="
            openStatementWeb('https://fxxcx.ystrip.cn/show/dccontentStatement')
          "
          >《锂电池航空运输规范》</text
        >
      </view>
    </scroll-view>

    <view class="bottom_bar">
      <view class="left_message">
        <view class="not_pass_message" v-if="passengerList.length < 1"
          >请先添加乘机人</view
        >
        <view class="pass_message" v-else @click="openOrderInfo()">
          <text>合计：&yen;</text>
          {{ priceInfo.totalPrice }}
        </view>
      </view>
      <button
        :disabled="!trueSubmitOrder"
        :class="['right_btn', { is_true: trueSubmitOrder }]"
        type="default"
        @click="submitOrder()"
      >
        去支付
      </button>
    </view>

    <!-- 航班退改信息 -->
    <flight-explanation
      ref="flightExplanation"
      :ruleInfos="ruleInfos"
      :arrrRuleInfos="arrrRuleInfos"
    ></flight-explanation>

    <!-- 金额明细弹窗 -->
    <uni-popup ref="priceInfoDialog" type="bottom">
      <view class="price_info">
        <view class="title">
          金额明细
          <view class="close_btn" @click="closePriceInfo()"></view>
        </view>

        <view class="info_content">
          <view class="info_list">
            <view class="list_tag" v-if="roundTripType">去</view>
            <view class="list_title">成人票价</view>
            <view class="list_message">
              <text>&yen; {{ priceInfo.adtPrice }}</text>
              <text>×{{ passengerNumber.adt }}人</text>
            </view>
          </view>
          <view class="info_list" v-if="roundTripType">
            <view class="list_tag is_back">返</view>
            <view class="list_title">成人票价</view>
            <view class="list_message">
              <text>&yen; {{ priceInfo.roundAdtPrice }}</text>
              <text>×{{ passengerNumber.adt }}人</text>
            </view>
          </view>
          <view class="info_list" v-if="passengerNumber.chd > 0">
            <view class="list_tag" v-if="roundTripType">去</view>
            <view class="list_title">儿童票价</view>
            <view class="list_message">
              <text>&yen; {{ priceInfo.chdPrice }}</text>
              <text>×{{ passengerNumber.chd }}人</text>
            </view>
          </view>
          <view
            class="info_list"
            v-if="passengerNumber.chd > 0 && roundTripType"
          >
            <view class="list_tag is_back">返</view>
            <view class="list_title">儿童票价</view>
            <view class="list_message">
              <text>&yen; {{ priceInfo.chdPrice }}</text>
              <text>×{{ passengerNumber.chd }}人</text>
            </view>
          </view>
          <view class="info_list" v-if="passengerNumber.inf > 0">
            <view class="list_tag" v-if="roundTripType">去</view>
            <view class="list_title">婴儿票价</view>
            <view class="list_message">
              <text>&yen; {{ priceInfo.infPrice }}</text>
              <text>×{{ passengerNumber.inf }}人</text>
            </view>
          </view>
          <view
            class="info_list"
            v-if="passengerNumber.inf > 0 && roundTripType"
          >
            <view class="list_tag is_back">返</view>
            <view class="list_title">婴儿票价</view>
            <view class="list_message">
              <text>&yen; {{ priceInfo.infPrice }}</text>
              <text>×{{ passengerNumber.inf }}人</text>
            </view>
          </view>
          <view class="info_list">
            <view class="list_tag" v-if="roundTripType">去</view>
            <view class="list_title">机建+燃油</view>
            <view class="list_message">
              <text>&yen; {{ priceInfo.buildPrice }}</text>
              <text>×{{ passengerNumber.adt }}人</text>
            </view>
          </view>
          <view class="info_list" v-if="roundTripType">
            <view class="list_tag is_back">返</view>
            <view class="list_title">机建+燃油</view>
            <view class="list_message">
              <text>&yen; {{ priceInfo.roundBuildPrice }}</text>
              <text>×{{ passengerNumber.adt }}人</text>
            </view>
          </view>
          <view class="info_list" v-if="passengerNumber.ins > 0">
            <view class="list_title">保险</view>
            <view class="list_message" v-if="!roundTripType">
              <text
                >&yen; {{ priceInfo.insPrice ? priceInfo.insPrice : 0 }}</text
              >
              <text
                >×{{ passengerNumber.ins ? passengerNumber.ins : 0 }}份</text
              >
            </view>
            <view class="list_message" v-else>
              <text
                >&yen; {{ priceInfo.insPrice ? priceInfo.insPrice : 0 }}</text
              >
              <text
                >×{{
                  passengerNumber.ins ? passengerNumber.ins * 2 : 0
                }}份</text
              >
            </view>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import flightHeader from "@/components/flight_header.vue"; // 航程信息
import flightExplanation from "@/components/flight_explanation.vue"; // 航班退改信息
import insurance from "@/api/insurance.js";
import ticket from "@/api/ticketInquiry.js";
import moment from "moment";
moment.locale("zh-cn");
export default {
  components: {
    flightHeader,
    flightExplanation,
  },
  data() {
    return {
      iStatusBarHeight: 0, // 状态栏高度

      roundTripType: false, // 是否往返

      relatedKey: "", // 关联key
      price: null, // 单程价格
      roundRelatedKey: "", // 往返key
      roundPrice: null, // 往返价格

      showData: false, // 数据加载

      headerAddress: {},

      ruleInfos: {
        // 退改签信息
        gauge: {
          refund: [],
          change: [],
        },
      },

      arrrRuleInfos: {
        // 返程退改签信息
        gauge: {
          refund: [],
          change: [],
        },
      },

      disMessage: {}, // 分销商信息

      flightData: {
        // 单程航班信息
        flightType: "", // 航程类型
        time: "", // 航程日期
        week: "", // 航程星期
        fromTime: "", // 出发时间
        fromAddress: "", // 出发机场
        duration: "", // 飞行时长
        toTime: "", // 到达时间
        toAddress: "", // 到达机场
        airIcon: "", // 航司图片
        airline: "", // 航司
        model: "", // 机型
        food: "", // 餐饮
        cabin: "", // 舱位信息
        baggage: "", // 行李额
      },
      flightRoundData: {
        // 往返航班信息
        flightType: "", // 航程类型
        time: "", // 航程日期
        week: "", // 航程星期
        fromTime: "", // 出发时间
        fromAddress: "", // 出发机场
        duration: "", // 飞行时长
        toTime: "", // 到达时间
        toAddress: "", // 到达机场
        airIcon: "", // 航司图片
        airline: "", // 航司
        model: "", // 机型
        food: "", // 餐饮
        cabin: "", // 舱位信息
        baggage: "", // 行李额
      },

      passengerList: [], // 乘机人列表
      passengerNumber: {
        adt: 0,
        inf: 0,
        cnd: 0,
      }, // 乘机人数量

      showRemove: "none", // 自动展开

      orderPassenger: {
        // 订单联系人信息
        name: "", // 联系人
        phone: "", // 手机号
        email: "",
      },
      insuranceList: [], // 保险列表
      moreInsurance: 4, // 保险默认显示条数
      insuranceActive: {}, // 选择保险

      areaCode: ["+86", "+01", "+02", "+03"], // 手机区号
      areaCodeIndex: 0, // 手机区号下标

      reimbursement: false, // 报销凭证开关

      priceInfo: {
        // 金额数据
        totalPrice: 0, // 总价
        adtPrice: 0, // 成人票价
        chdPrice: 0, // 儿童票价
        infPrice: 0, // 婴儿票价
        buildPrice: 0, // 机建燃油费
        insPrice: 0, // 保险票价
        buildPrice: 0, // 机建燃油费
        reward: 0, // 奖励金额
      },

      statement: {}, // 免责声明

      trueSubmitOrder: false, // 去支付按钮

      showStatementWeb: false, // 外部链接

      chdinf_msg: {}, // 航司儿童婴儿携带数量
    };
  },
  methods: {
    // 单程预定
    getData() {
      let data = {
        price: this.price,
      };
      ticket
        .getTicketInfo(this.relatedKey, data)
        .then((res) => {
          if (res.errorcode === 10000) {
            let segmentMessage = res.data.segments; // 航班信息
            this.flightData = {
              // 组装航班信息
              flightType: "单程", // 航程类型
              data: segmentMessage,
              cabinInfo: res.data.cabinInfo, // 舱位信息
            };

            console.log("航程信息", res.data);

            // 组装航班信息
            let filghtMessage = {
              time: moment(segmentMessage[0].depTime).format(
                "YYYY-MM-DD HH:mm:ss"
              ), // 起飞时间
              code: segmentMessage[0].flightNumber, // 航班号
              address:
                segmentMessage[0].depAirport_CN.city_name +
                " " +
                segmentMessage[0].depAirport_CN.city_code +
                " - " +
                segmentMessage[segmentMessage.length - 1].arrAirport_CN
                  .city_name +
                " " +
                segmentMessage[segmentMessage.length - 1].arrAirport_CN
                  .city_code, // 行程
              cabin: res.data.cabinInfo.cabinDesc, // 舱位
              price: res.data.adtPrice.rulePrice.price, // 票面价
              baggage: res.data.cabinInfo.baggage,
            };

            // 组装退改信息
            let gaugeMessage = res.data.ruleInfos;

            this.ruleInfos = {
              filght: filghtMessage,
              gauge: gaugeMessage,
            };

            this.orderPassenger = {
              name: res.data.dis_msg.contact,
              phone: res.data.dis_msg.phone.mobile[0],
            };

            // 组装分销商数据
            this.disMessage = res.data.dis_msg;

            let insurance_list = res.data.insurance_list; // 组装保险信息
            insurance_list.forEach((item) => {
              item["is_insure"] = false;
              item["type"] = item.insure_desc.indexOf("电子") === -1;
              item.insure_desc = item.insure_desc.slice(
                0,
                item.insure_desc.indexOf("元") + 1
              );
            });
            this.insuranceList = insurance_list;

            this.priceInfo = {
              // 组装金额数据
              totalPrice: 0, // 总价
              adtPrice: res.data.adtPrice.settle_price, // 成人票价
              chdPrice: res.data.chdPrice.price, // 儿童票价
              infPrice: res.data.infPrice.price, // 婴儿票价
              buildPrice: Number(res.data.adtPrice.build), // 机建燃油费
              reward: res.data.adtPrice.rulePrice.reward, // 奖励金额
            };

            this.oldReward = res.data.adtPrice.rulePrice.reward;

            this.statement = {
              // 组装免责声明
              title: res.data.air_line.title,
              url: res.data.air_line.url,
              code: res.data.air_line.code,
            };

            this.chdinf_msg = res.data.chdinf_msg; // 航司儿童婴儿携带数量组装

            this.showData = true;
          } else {
            uni.showToast({
              title: res.data || "数据获取错误，请稍后再试",
              icon: "none",
              mask: true,
              duration: 3000,
            });
            setTimeout(() => {
              uni.navigateBack();
            }, 3000);
          }
        })
        .catch(() => {
          uni.showToast({
            title: "接口数据错误，请联系客服处理",
            icon: "none",
            mask: true,
            duration: 3000,
          });
        });
    },

    // 往返预定
    getRoundData() {
      let data = {
        dep_price: this.price,
        arr_price: this.roundPrice,
      };
      ticket
        .getRoundTicketInfo(this.relatedKey, this.roundRelatedKey, data)
        .then((res) => {
          if (res.errorcode === 10000) {
            let segmentMessage = res.data.depSegment; // 去程航班信息
            let segmentRoundMessage = res.data.arrSegment; // 返程航班信息

            // 组装联系人信息
            this.orderPassenger = {
              name: res.data.dis_msg.contact,
              phone: res.data.dis_msg.phone,
            };

            this.flightData = {
              // 组装航班信息
              flightType: "去程", // 航程类型
              data: segmentMessage,
              cabinInfo: res.data.depCabinInfo, // 舱位信息
            };

            this.flightRoundData = {
              // 组装航班信息
              flightType: "返程", // 航程类型
              data: segmentRoundMessage,
              cabinInfo: res.data.arrCabinInfo, // 舱位信息
            };

            // 组装去程航班信息
            let filghtMessage = {
              time: moment(segmentMessage[0].depTime).format(
                "YYYY-MM-DD HH:mm:ss"
              ), // 起飞时间
              code: segmentMessage[0].flightNumber, // 航班号
              address:
                segmentMessage[0].depAirport_CN.city_name +
                " " +
                segmentMessage[0].depAirport_CN.city_code +
                " - " +
                segmentMessage[segmentMessage.length - 1].arrAirport_CN
                  .city_name +
                " " +
                segmentMessage[segmentMessage.length - 1].arrAirport_CN
                  .city_code, // 行程
              cabin: res.data.depCabinInfo.cabinDesc, // 舱位
              price: res.data.depAdtPrice.rulePrice.price, // 票面价
              baggage: res.data.depCabinInfo.baggage,
            };

            // 组装去程退改信息
            let gaugeMessage = res.data.arrCabinInfo;

            this.ruleInfos = {
              filght: filghtMessage,
              gauge: gaugeMessage,
            };

            // 组装返程航班信息
            let arrFilghtMessage = {
              time: moment(segmentRoundMessage[0].depTime).format(
                "YYYY-MM-DD HH:mm:ss"
              ), // 起飞时间
              code: segmentRoundMessage[0].flightNumber, // 航班号
              address:
                segmentRoundMessage[0].depAirport_CN.city_name +
                " " +
                segmentRoundMessage[0].depAirport_CN.city_code +
                " - " +
                segmentRoundMessage[segmentRoundMessage.length - 1]
                  .arrAirport_CN.city_name +
                " " +
                segmentRoundMessage[segmentRoundMessage.length - 1]
                  .arrAirport_CN.city_code, // 行程
              cabin: res.data.arrCabinInfo.cabinDesc, // 舱位
              price: res.data.arrAdtPrice.rulePrice.price, // 票面价
              baggage: res.data.arrCabinInfo.baggage,
            };

            // 组装返程退改信息
            let arrGaugeMessage = res.data.arrCabinInfo;

            this.arrrRuleInfos = {
              filght: arrFilghtMessage,
              gauge: arrGaugeMessage,
            };

            // 组装分销商数据
            this.disMessage = res.data.dis_msg;

            let insurance_list = res.data.insurance_list; // 组装保险信息
            insurance_list.forEach((item) => {
              item["is_insure"] = false;
              item["type"] = item.insure_desc.indexOf("电子") === -1;
              item.insure_desc = item.insure_desc.slice(
                0,
                item.insure_desc.indexOf("元") + 1
              );
            });
            this.insuranceList = insurance_list;

            this.priceInfo = {
              // 组装金额数据
              totalPrice: 0, // 总价
              adtPrice: res.data.depAdtPrice.settle_price, // 成人票价
              chdPrice: res.data.depChdPrice.price, // 儿童票价
              infPrice: res.data.depInfPrice.price, // 婴儿票价
              buildPrice: Number(res.data.depAdtPrice.build), // 机建燃油费
              reward: res.data.depAdtPrice.rulePrice.reward, // 奖励金额

              roundAdtPrice: res.data.arrAdtPrice.settle_price, // 返程成人票价
              roundChdPrice: res.data.arrChdPrice.price, // 返程儿童票价
              roundInfPrice: res.data.arrInfPrice.price, // 返程婴儿票价
              roundBuildPrice: Number(res.data.arrAdtPrice.build), // 返程机建燃油费
              roundReward: res.data.arrAdtPrice.rulePrice.reward, // 返程奖励金额
            };

            this.oldReward = res.data.depAdtPrice.rulePrice.reward;
            this.oldRoundReward = res.data.arrAdtPrice.rulePrice.reward;

            this.statement = {
              // 组装免责声明
              title: res.data.air_line.title,
              url: res.data.air_line.url,
            };

            this.chdinf_msg = res.data.departure_chdinf_msg; // 航司儿童婴儿携带数量组装
            this.round_chdinf_msg = res.data.arrive_chdinf_msg; // 航司儿童婴儿携带数量组装

            this.showData = true;
          } else {
            uni.showToast({
              title: res.data || "数据获取错误，请稍后再试",
              icon: "none",
              mask: true,
              duration: 3000,
            });
            setTimeout(() => {
              uni.navigateBack();

              uni.setStorageSync("errorFlightData", "又他妈报错了");
            }, 3000);
          }
        })
        .catch(() => {
          uni.showToast({
            title: "接口数据错误，请联系客服处理",
            icon: "none",
            mask: true,
            duration: 3000,
          });
        });
    },

    // 保险选择
    changeInsurance(val) {
      console.log(val);
      if (this.passengerList.filter((u) => u.is_insure === true).length < 1) {
        return uni.showToast({
          title: "请打开需购买保险乘客的开关",
          duration: 2000,
          icon: "none",
        });
      }
      this.insuranceActive = val.id !== this.insuranceActive.id ? val : "";
      this.priceInfo.insPrice = this.insuranceActive.default_dis_price
        ? Number(this.insuranceActive.default_dis_price)
        : 0;
      this.getTotalPrice();
    },

    // 选择手机区号
    bindPickerChange(e) {
      console.log("picker发送选择改变，携带值为", e.target.value);
      this.areaCodeIndex = e.target.value;
    },

    // 报销凭证
    reimbursementSwitch(e) {
      this.reimbursement = e;
    },

    // 跳转报销凭证 添加邮件地址
    jumpAddMailAddress() {
      uni.navigateTo({
        url: "/flightReservation/mailAddress",
      });
    },

    // 添加乘机人按钮
    jumpPassengerPage() {
      uni.navigateTo({
        url:
          "/flightReservation/passengerList?chdinfNumber=" +
          JSON.stringify(this.chdinf_msg) +
          "&editPassengerList=" +
          JSON.stringify(this.passengerList),
      });
    },

    // 展开删除按钮
    openDelete(data, index) {
      // console.log(this.$refs.mainListItem[index]);
      this.$set(this.passengerList[index], "show", true);
      console.log(this.passengerList);
      this.$forceUpdate();
      // this.passengerList[index].show = true;
      // this.$refs.mainListItem[index].autoClose = false;
      // this.$refs.mainListItem[index].show = "right";
    },

    // 移除乘机人
    removePassenger(data) {
      this.passengerList.splice(
        this.passengerList.findIndex((item) => item.id === data.id),
        1
      );
      this.passengerNumber = {
        adt: this.passengerList.filter((u) => u.type === "成人").length, // 成人数量
        chd: this.passengerList.filter((u) => u.type === "儿童").length, // 儿童数量
        inf: this.passengerList.filter((u) => u.type === "婴儿").length, // 婴儿数量
      };

      this.getTotalPrice();
    },

    // 修改乘机人
    flightEdit(data, index) {
      uni.navigateTo({
        url:
          "/flightReservation/addPassenger?type=edit&data=" +
          JSON.stringify(data) +
          "&status=true",
      });
      console.log(data, index);
    },

    // 添加儿童按钮
    jumpAddPassenger() {
      uni.navigateTo({ url: "/flightReservation/addPassenger" });
    },

    // 获取保险列表
    getPassInsData() {
      insurance.insuranceList().then((res) => {
        if (res.errorcode === 10000) {
          this.insuranceList = res.data;
          this.insuranceList.forEach((item) => {
            item["is_insure"] = false;
            item["type"] = item.insure_desc.indexOf("电子") === -1;
            item.insure_desc = item.insure_desc.slice(
              0,
              item.insure_desc.indexOf("元") + 1
            );
          });
          console.log(this.insuranceList);
        } else {
          uni.showToast({
            title: "保险列表获取失败，" + res.msg,
            icon: "none",
          });
        }
      });
    },

    // 展开保险列表
    showMoreInsurance() {
      this.moreInsurance =
        this.moreInsurance === 4 ? this.insuranceList.length : 4;
    },

    // 乘机人保险开关
    passInsSwitch(e, index) {
      this.$set(this.passengerList[index], "is_insure", e);
      this.passengerNumber.ins =
        this.passengerList.filter((u) => u.is_insure === true).length > 0
          ? this.passengerList.filter((u) => u.is_insure === true).length
          : 0;
      this.getTotalPrice();
      // this.passengerList[index].is_insure = JSON.parse(JSON.stringify(e));
      if (this.passengerList.filter((u) => u.is_insure === true).length < 1) {
        this.insuranceActive = {};
      }
    },

    // 打开运输总条件弹窗
    openUrlDialog(val) {
      console.log(val);
    },

    // 打开免责声明 外部链接
    openStatementWeb(url) {
      console.log(url);
      uni.navigateTo({
        url: "/flightReservation/webView?url=" + url,
      });
    },

    // 打开免责声明弹窗
    openDiscDialog(type) {
      if (type) {
      } else {
        uni.navigateTo({
          url: "/flightReservation/restrictedNotice",
        });
      }
    },

    // 打开航班退改信息弹窗
    openHeadExpPopup(val) {
      if (val === "arr") {
        this.$refs.flightExplanation.openArrExp();
      } else {
        this.$refs.flightExplanation.openExp();
      }
    },
    // 关闭航班退改信息弹窗
    closePopup() {
      this.$refs.flightExplanation.closeExp();
    },

    // 打开金额明细弹窗
    openOrderInfo() {
      this.$refs.priceInfoDialog.open();
    },

    // 计算金额总价
    getTotalPrice() {
      console.log(
        "奖励金计算",
        this.priceInfo.reward,
        this.passengerNumber.adt
      );
      let totalPrice;
      if (this.roundTripType) {
        // 组装往返金额
        totalPrice =
          Number(this.passengerNumber.adt) * Number(this.priceInfo.buildPrice) +
          Number(this.passengerNumber.adt) *
            Number(this.priceInfo.roundBuildPrice) +
          Number(this.passengerNumber.adt) * Number(this.priceInfo.adtPrice) +
          Number(this.passengerNumber.adt) *
            Number(this.priceInfo.roundAdtPrice) +
          Number(this.passengerNumber.chd) * Number(this.priceInfo.chdPrice) +
          Number(this.passengerNumber.chd) *
            Number(this.priceInfo.roundChdPrice) +
          Number(this.passengerNumber.inf) * Number(this.priceInfo.infPrice) +
          Number(this.passengerNumber.inf) *
            Number(this.priceInfo.roundInfPrice) +
          Number(this.passengerNumber.ins || 0) *
            Number(this.priceInfo.insPrice || 0) *
            2;
        // 计算奖励金额
        if (this.passengerNumber.adt > 0) {
          this.$set(
            this.priceInfo,
            "reward",
            this.oldReward * this.passengerNumber.adt +
              this.oldRoundReward * this.passengerNumber.adt
          );
        }
      } else {
        // 组装单程金额
        totalPrice =
          Number(this.passengerNumber.adt) * Number(this.priceInfo.buildPrice) +
          Number(this.passengerNumber.adt) * Number(this.priceInfo.adtPrice) +
          Number(this.passengerNumber.chd) * Number(this.priceInfo.chdPrice) +
          Number(this.passengerNumber.inf) * Number(this.priceInfo.infPrice) +
          Number(this.passengerNumber.ins || 0) *
            Number(this.priceInfo.insPrice || 0);
        // 计算奖励金额
        if (this.passengerNumber.adt > 0) {
          this.$set(
            this.priceInfo,
            "reward",
            this.oldReward * this.passengerNumber.adt
          );
        }
      }
      // 组装金额数据
      this.$set(this.priceInfo, "totalPrice", totalPrice);

      this.trueSubmitOrder = this.passengerList.length > 0; // 判断去支付按钮是否禁用
      this.$forceUpdate();
    },
    // 关闭金额明细弹窗
    closePriceInfo() {
      this.$refs.priceInfoDialog.close();
    },

    // 去支付按钮
    submitOrder() {
      if (!this.orderPassenger.name || !this.orderPassenger.phone) {
        return uni.showToast({
          title:
            !this.orderPassenger.name || !this.orderPassenger.phone
              ? "请输入联系人信息"
              : "请完善下单信息",
          icon: "none",
        });
      }
      if (this.orderPassenger.email) {
        if (!this.$isEmail(this.orderPassenger.email)) {
          return uni.showToast({
            title: "邮箱格式不正确",
            icon: "none",
          });
        }
      }

      if (this.flightData.data.length > 1 && !this.orderPassenger.email) {
        return uni.showToast({
          title: "请填写邮箱",
          icon: "none",
        });
      }
      // 处理乘客数据
      let passengerList = JSON.parse(JSON.stringify(this.passengerList));
      let passengerData = [];
      passengerList.forEach((item) => {
        // 组装乘客数据
        passengerData.push({
          PassengerName: item.name
            ? item.name
            : item.en_first_name + "/" + item.en_last_name, // 乘客名称
          PassengerType:
            item.type === "成人"
              ? "ADT"
              : item.type === "儿童"
              ? "CHD"
              : item.type === "婴儿"
              ? "INF"
              : "", // 乘客类型 ADT：成人 CHD：儿童 INF：婴儿
          Credential:
            item.cert_type === "身份证"
              ? 0
              : item.cert_type === "护照"
              ? 1
              : item.cert_type === "港澳通行证"
              ? 2
              : item.cert_type === "其他证件"
              ? 8
              : "", // 证件类型 0：身份证 1：护照 2：港澳通行证 3：其它证件
          CredentialNo: item.cert_no, // 证件号
          Birthday: item.birthday, // 出生日期
          Phone: item.phone, // 手机号
          IsInsure: item.is_insure ? 1 : 0, // 购买保险 0：否 1：是
          Gender: item.sex === 1 ? "M" : "F", // 性别 M: 男 F: 女
        });
      });
      if (this.roundTripType) {
        // 往返
        let passengerName = []; // 乘客姓名
        let passengerType = []; // 乘客类型
        let credential = [];
        let credentialNo = [];
        let birthday = [];
        let phone = [];
        let isInsure = [];
        passengerData.forEach((item) => {
          passengerName.push(item.PassengerName);
          passengerType.push(item.PassengerType);
          credential.push(item.Credential);
          credentialNo.push(item.CredentialNo);
          birthday.push(item.Birthday);
          phone.push(item.Phone);
          isInsure.push(item.IsInsure);
        });

        let data = {
          PassengerName: passengerName,
          PassengerType: passengerType,
          Credential: credential,
          CredentialNo: credentialNo,
          Birthday: birthday,
          Phone: phone,
          insurance_id: this.insuranceActive.id || 0, // 保险id
          name: this.orderPassenger.name,
          phone: this.orderPassenger.phone,
          email: this.orderPassenger.email || "",
          flight_no: this.flightData.data[0].flightNumber,
          IsInsure: isInsure,
        };

        console.log(data);
        // let data = {
        //   passengers: passengerData, // 乘客数据
        //   arr_keys: this.relatedKey, // 去程key
        //   dep_keys: this.roundRelatedKey, // 返程key
        //   insurance_id: this.insuranceActive.id || 0, // 保险id
        //   contacts: this.orderPassenger, // 联系人信息
        // };
        ticket
          .createRoundOrder(this.relatedKey, this.roundRelatedKey, data, this.price, this.roundPrice)
          .then((res) => {
            console.log(res);
            if (res.errorcode === 10000) {
              let orderId = [];
              let priceList = [];
              let priceNumber = 0;
              res.data.forEach((item) => {
                orderId.push(item.order_no);
                priceList.push(item.need_pay_amount);
                priceNumber += item.need_pay_amount;
              });

              uni.navigateTo({
                url:
                  "/flightReservation/orderPay?orderId=" +
                  JSON.stringify(orderId) +
                  "&flightData=" +
                  JSON.stringify(this.flightData) +
                  "&flightRoundData=" +
                  JSON.stringify(this.flightRoundData) +
                  "&priceList=" +
                  JSON.stringify(priceList) +
                  "&price=" +
                  priceNumber +
                  "&type=true",
              });
              console.log(res.data, this.flightData);
            } else {
              this.trueSubmitOrder = false;
              uni.showToast({
                title: res.msg || "接口数据错误，请联系客服处理",
                icon: "none",
                duration: 3000,
              });
            }
          })
          .catch((err) => {
            this.trueSubmitOrder = false;
            console.log('接口报错了');
            uni.showToast({
              title: "接口数据错误，请联系客服处理",
              duration: 3000,
              icon: "none",
            });
          });
      } else {
        // 单程下单
        let passengerName = []; // 乘客姓名
        let passengerType = []; // 乘客类型
        let credential = [];
        let credentialNo = [];
        let birthday = [];
        let phone = [];
        let isInsure = [];
        passengerData.forEach((item) => {
          passengerName.push(item.PassengerName);
          passengerType.push(item.PassengerType);
          credential.push(item.Credential);
          credentialNo.push(item.CredentialNo);
          birthday.push(item.Birthday);
          phone.push(item.Phone);
          isInsure.push(item.IsInsure);
        });

        let data = {
          PassengerName: passengerName,
          PassengerType: passengerType,
          Credential: credential,
          CredentialNo: credentialNo,
          Birthday: birthday,
          Phone: phone,
          insurance_id: this.insuranceActive.id || 0, // 保险id
          name: this.orderPassenger.name,
          phone: this.orderPassenger.phone,
          email: this.orderPassenger.email || "",
          flight_no: this.flightData.data[0].flightNumber,
          IsInsure: isInsure,
        };
        console.log(this.relatedKey, JSON.stringify(data));
        ticket
          .createOrder(this.relatedKey, data, this.price)
          .then((res) => {
            if (res.errorcode === 10000) {
              let orderId = [];
              let priceList = [];
              let priceNumber = 0;
              res.data.forEach((item) => {
                orderId.push(item.order_no);
                priceList.push(item.need_pay_amount);
                priceNumber += item.need_pay_amount;
              });

              console.log(orderId, this.flightData, priceList, priceNumber);

              uni.navigateTo({
                url:
                  "/flightReservation/orderPay?orderId=" +
                  JSON.stringify(orderId) +
                  "&flightData=" +
                  JSON.stringify(this.flightData) +
                  "&priceList=" +
                  JSON.stringify(priceList) +
                  "&price=" +
                  priceNumber +
                  "&type=false",
              });
              console.log(res.data, this.flightData);
            } else {
              this.trueSubmitOrder = false;
              uni.showToast({
                title: res.data || "接口数据错误，请联系客服处理",
                icon: "none",
                duration: 3000,
              });
            }
          })
          .catch(() => {
            this.trueSubmitOrder = false;
            uni.showToast({
              title: "接口数据错误，请联系客服处理",
              duration: 3000,
              icon: "none",
            });
          });
      }
    },
  },
  onShow() {
    // 获取乘客列表
    let passenger = uni.getStorageSync("passengerList");
    if (passenger) {
      this.passengerList = JSON.parse(passenger)
      // this.passengerList.forEach((item) => (item.show = false));
      this.passengerNumber = {
        adt: this.passengerList.filter((u) => u.type === "成人").length, // 成人数量
        chd: this.passengerList.filter((u) => u.type === "儿童").length, // 儿童数量
        inf: this.passengerList.filter((u) => u.type === "婴儿").length, // 婴儿数量
      };

      this.getTotalPrice();
      uni.removeStorageSync("passengerList");
    }

    let editPassenger = uni.getStorageSync("editPassengerList");
    if (editPassenger) {
      editPassenger = JSON.parse(editPassenger);
      this.passengerList.forEach((item, index) => {
        if (item.id === editPassenger.id) {
          this.passengerList[index] = editPassenger;
        }
      });
      uni.removeStorageSync("editPassengerList");
      this.$forceUpdate();
      console.log(editPassenger);
      console.log(this.passengerList);
    }
  },
  onLoad(data) {
    console.log(data);
    // this.getPassInsData();
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.headerAddress = data.airMessage ? JSON.parse(data.airMessage) : {};

    console.log("头部信息", this.headerAddress);

    this.roundTripType = data.type ? JSON.parse(data.type) : false;

    if (this.roundTripType) {
      // 获取往返key和价格
      this.relatedKey = data.key;
      this.price = data.price;
      this.roundRelatedKey = data.roundKey;
      this.roundPrice = data.roundPrice;
      this.getRoundData();
    } else {
      // 获取单程key和价格
      this.relatedKey = data.key;
      this.price = data.price;
      this.getData();
    }
  },
};
</script>

<style scoped lang="less">
.flight_reservation {
  background: rgba(243, 245, 247, 1);
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  .flight_reservation_main {
    flex: 1;
    height: calc(100% - 400rpx);
    .not_flight_data {
      border-radius: 20rpx;
      background: #ffffff;
      box-shadow: 0 12rpx 18rpx rgba(0, 0, 0, 0.04);
      padding: 30rpx 20rpx 22rpx;
      margin: 0 20rpx 20rpx;
      height: 144upx;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      &::before {
        content: "";
        display: block;
        width: 44upx;
        height: 200%;
        position: absolute;
        top: -30%;
        transform: rotate(30deg);
        background: #fff;
        left: -30%;
        animation: skeleton 3s infinite;
        -webkit-animation: skeleton 3s infinite;
      }
      @keyframes skeleton {
        from {
          left: -30%;
        }
        to {
          left: 120%;
        }
      }
      text {
        display: block;
        width: 80%;
        height: 28upx;
        background: #e5e9f2;
        margin-bottom: 10upx;
      }
      view {
        width: 80%;
        height: 40upx;
        margin: auto auto 0;
        background: #e5e9f2;
      }
    }
  }

  .box-shadow-style {
    margin-top: 26upx;
  }

  .passenger_box {
    padding: 24upx 20upx;

    .passenger_title {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .add_passenger_btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 50upx;
        border: 2upx solid rgba(0, 112, 226, 1);
        border-radius: 30upx;
        font-size: 24upx;
        font-weight: 400;
        color: rgba(0, 112, 226, 1);
        padding: 0 20upx;
      }
    }
    .passenger_main {
      width: 100%;
      .main_list {
        display: flex;
        align-items: center;
        width: 100%;
        position: relative;
        box-sizing: border-box;
        /deep/.uni-swipe {
          width: 100%;
        }

        &:first-child {
          margin-top: 44upx;
        }
        &:not(:nth-last-child(2)) {
          margin-bottom: 40upx;
        }
        .remove_btn {
          background: url(@/static/number_remove_btn.png) no-repeat center
            center;
          background-size: contain;
          width: 36upx;
          height: 36upx;
          flex-shrink: 0;
          margin-right: 16upx;
          margin-top: 40upx;
        }
        .list_message {
          flex: 1;
          border-bottom: 2upx solid rgba(241, 243, 245, 1);
          .message_info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 32upx;
            .info_left {
              display: flex;
              align-items: center;
              .type {
                border: 2upx solid rgba(127, 183, 240, 1);
                border-radius: 20upx;
                font-size: 20upx;
                font-weight: 400;
                color: rgba(127, 183, 240, 1);
                padding: 2upx 20upx;
                margin-right: 16upx;
              }
              .user_name {
                font-size: 28upx;
                font-weight: bold;
                color: rgba(42, 42, 42, 1);
                margin-right: 16upx;
              }
              .position {
                font-size: 22upx;
                font-weight: 400;
                color: rgba(153, 153, 153, 1);
              }
            }
            .edit_btn {
              background: url(@/static/edit_icon.png) no-repeat center center;
              background-size: contain;
              width: 30upx;
              height: 30upx;
            }
            .bottom_left {
              display: flex;
              align-items: center;
              .bottom_title {
                font-size: 28upx;
                font-weight: 400;
                color: rgba(42, 42, 42, 1);
                margin-right: 32upx;
              }
              .card {
                font-size: 28upx;
                font-weight: bold;
                color: rgba(42, 42, 42, 1);
              }
            }
          }
        }
        .option_box {
          width: 180upx;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          .delete_btn {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            font-size: 26upx;
            font-weight: 400;
            color: rgba(255, 0, 0, 1);
            .delete_btn_icon {
              width: 45upx;
              height: 45upx;
              object-fit: contain;
              margin-bottom: 8upx;
            }
          }
        }
      }
      .add_child_btn {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30upx;
        font-weight: bold;
        color: rgba(0, 112, 226, 1);
        margin-top: 24upx;
        .add_child_btn_icon {
          width: 30upx;
          height: 30upx;
          object-fit: contain;
          margin-right: 12upx;
        }
      }
    }
  }

  .order_passenger_message {
    padding: 24upx 20upx 0;

    .order_passenger_form {
      margin-top: 12upx;

      .form_item {
        display: flex;
        align-items: center;
        padding: 24upx 0 34upx;

        &:not(:last-child) {
          border-bottom: 2upx solid rgba(241, 243, 245, 1);
        }

        .form_item_title {
          font-size: 26upx;
          font-weight: 400;
          color: rgba(42, 42, 42, 1);
          margin-right: 30upx;
          width: 85upx;
        }

        .phone_numbering {
          display: inline-flex;
          align-items: center;
          margin-right: 20upx;
          .phone_numbering_input {
            font-size: 13px;
            font-weight: 400;
            color: rgba(42, 42, 42, 1);
          }
          &::after {
            content: "";
            background: url(@/static/arrow.png) no-repeat center center;
            background-size: contain;
            display: inline-block;
            width: 12upx;
            height: 21upx;
            transform: rotate(90deg);
            margin-left: 14upx;
          }
        }

        .form_item_input {
          padding-left: 10upx;
        }

        .input_style {
          font-size: 28upx;
          font-weight: 400;
          color: rgba(175, 185, 196, 1);
        }
      }
    }
  }

  .insurance_list {
    .title_text {
      margin-bottom: 40upx;
    }

    .insurance_box {
      .insurance_box_item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 30upx 0;

        &:first-child {
          padding-top: 0;
        }

        &:last-child {
          padding-bottom: 0;
        }

        &:not(:last-child) {
          border-bottom: 2upx solid rgba(241, 243, 245, 1);
        }

        .item_name {
          font-size: 28upx;
          font-weight: 400;
          color: rgba(42, 42, 42, 1);
          display: inline-flex;
          align-items: center;
          .item_icon {
            display: block;
            width: 47upx;
            height: 33upx;
            background: url(@/static/insurance_type_1.png) no-repeat center
              center;
            background-size: contain;
            margin-left: 10upx;
            &.true {
              background: url(@/static/insurance_type_2.png) no-repeat center
                center;
              background-size: contain;
            }
          }
        }

        .item_check {
          display: inline-flex;
          align-items: center;

          .item_price {
            display: inline-flex;
            align-items: center;
            font-size: 28upx;
            font-weight: 400;
            color: #afb9c4;

            text {
              color: #0070e2;
            }
          }

          .item_icon {
            background: url(@/static/selected.png) no-repeat;
            background-size: contain;
            width: 40upx;
            height: 40upx;
            margin-left: 12upx;

            &.is_active {
              background: url(@/static/selected_active.png) no-repeat;
              background-size: contain;
            }
          }
        }
      }
      .more_btn {
        font-size: 24upx;
        font-weight: 400;
        color: rgba(175, 185, 196, 1);
        margin-top: 30upx;
        display: flex;
        align-items: center;
        justify-content: center;
        &.open {
          &::after {
            transform: rotate(-270deg);
          }
        }
        &::after {
          content: "";
          background: url(@/static/arrow.png) no-repeat center center;
          background-size: contain;
          width: 12upx;
          height: 20upx;
          transform: rotate(-90deg);
          display: block;
          margin-left: 10upx;
        }
      }
    }
  }

  .reward_list {
    .title_text {
      margin-bottom: 40upx;
    }

    .reward_box {
      .reward_list {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 30upx 0;
        font-size: 28upx;
        font-weight: 400;
        color: rgba(42, 42, 42, 1);

        &:first-child {
          padding-top: 0;
        }

        &:last-child {
          padding-bottom: 0;
        }

        &:not(:last-child) {
          border-bottom: 2upx solid rgba(241, 243, 245, 1);
        }
      }
    }
  }

  .reimbursement {
    .item_list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 30upx;
      padding-bottom: 30upx;
      border-bottom: 2upx solid rgba(241, 243, 245, 1);
      .list_title {
        font-size: 28upx;
        font-weight: bold;
        color: rgba(42, 42, 42, 1);
      }
    }
    .flase_reim {
      font-size: 24upx;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
    }
    .true_reim {
      display: flex;
      align-items: center;
      font-size: 28upx;
      font-weight: 400;
      .reim_title {
        margin-right: 20upx;
        color: rgba(153, 153, 153, 1);
      }
      .reim_box {
        flex: 1;
        position: relative;
        display: flex;
        flex-direction: column;
        &::after {
          content: "";
          display: inline-block;
          background: url(@/static/arrow.png) no-repeat center center;
          background-size: contain;
          width: 10upx;
          height: 19upx;
          position: absolute;
          right: 0;
          top: 50%;
          margin-top: -10upx;
        }
        .not_reim {
          color: rgba(175, 185, 196, 1);
          text-align: right;
          padding-right: 20rpx;
          flex: 1;
        }
        .reim_message {
          width: 350upx;
        }
      }
    }
  }

  .disclaimer {
    margin: 40upx 20upx 20upx;
    font-size: 24upx;
    font-weight: 400;
    color: rgba(42, 42, 42, 1);
    line-height: 36upx;

    text {
      color: #0070e2;
    }
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
      .not_pass_message {
        font-size: 28upx;
        font-weight: 400;
        color: rgba(42, 42, 42, 1);
      }
      .pass_message {
        font-size: 40upx;
        font-weight: bold;
        color: rgba(0, 112, 226, 1);
        text {
          font-size: 28upx;
          font-weight: 400;
          margin-right: 6upx;
        }
        &::after {
          content: "";
          display: inline-block;
          background: url(@/static/flight_checked_btn.png) no-repeat center
            center;
          background-size: contain;
          width: 16upx;
          height: 12upx;
          margin-left: 16upx;
          padding-bottom: 20upx;
        }
      }
    }

    .right_btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 260upx;
      height: 90upx;
      margin: 0;
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
      opacity: 0.4;
      border-radius: 80upx;
      &.is_true {
        opacity: 1;
      }
    }
  }

  .price_info {
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
      align-items: center;
      justify-content: center;
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

    .info_content {
      background: #fff;
      padding: 40upx;
      .info_list {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 40upx;
        .list_tag {
          width: 24upx;
          height: 24upx;
          background: #bfdfff;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 16upx;
          font-weight: 400;
          color: #ffffff;
          margin-right: 14upx;
          &.is_back {
            background: #c2efc1;
          }
        }
        .list_title {
          font-size: 28upx;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
          margin-right: auto;
        }
        .list_message {
          font-size: 28upx;
          font-weight: 500;
          text {
            display: inline-flex;
            &:first-child {
              color: rgba(255, 0, 0, 1);
            }
            &:last-child {
              margin-left: 20upx;
              color: rgba(153, 153, 153, 1);
            }
          }
        }
      }
    }
  }
}
</style>
