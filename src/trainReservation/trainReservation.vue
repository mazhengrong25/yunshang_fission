<!--
 * @Description: 火车票  --- 预定
 * @Author: mzr
 * @Date: 2021-08-06 16:05:04
 * @LastEditTime: 2021-10-26 14:57:28
 * @LastEditors: mzr
-->
<template>
  <view class="train_reservation">
    <yun-header
      :statusHeight="iStatusBarHeight"
      :headerAddress="pageHeaderData"
    ></yun-header>
    <view class="reservation_background">
      <scroll-view
        :enable-back-to-top="true"
        :scroll-y="true"
        class="reservation_content"
        lower-threshold="100"
      >
        <view class="cancel_rules">退改规则</view>
        <!-- 车次信息 -->
        <view class="train_box">
          <trainMessageCard
            :trainObject="trainData"
            :isCabin="true"
            :seatObject="singleData"
            :noSeat="!isNOSeat()"
            @getSeatStatus="getSeatStatus"
            :isPrice="true"
          ></trainMessageCard>
        </view>
        <!-- 乘车人 -->
        <view class="passenger_box common_style">
          <view class="passenger_top">
            <view class="passenger_title">
              <text v-if="passengerList.length < 1 || changeSubmitStatus">乘车人</text>
              <text v-else
                >已选{{ passengerNumber.adt ? passengerNumber.adt + "成人" : ""
                }}{{
                  passengerNumber.chd ? "，" + passengerNumber.chd + "儿童" : ""
                }}</text
              >
            </view>
            <view
              class="passenger_button"
              @click="jumpPassenger()"
              v-if="!changeSubmitStatus"
              >添加乘车人</view
            >
          </view>

          <uni-swipe-action class="passenger_main" v-if="passengerList.length > 0">
            <uni-swipe-action-item
              :class="['main_list', { show: item.show }]"
              v-for="(item, index) in passengerList"
              :key="index"
            >
              <view
                class="remove_btn"
                @click="removePassenger(item)"
                v-if="!changeSubmitStatus"
              ></view>
              <view class="list_message">
                <view class="message_info_item">
                  <view class="message_info">
                    <view class="info_left">
                      <view class="type">{{ item.type }}票</view>
                      <view class="user_name">{{
                        item.name || item.en_first_name + "/" + item.en_last_name
                      }}</view>
                    </view>
                  </view>
                  <view class="message_info">
                    <view class="bottom_left">
                      <view class="bottom_title">
                        <view v-if="item.type === '儿童'" class="title_child"
                          >用<view style="color: #FB9826">{{ item.name }}</view
                          >证件取票，身高低于1.5米</view
                        >
                        <view v-else>{{ item.cert_type }}</view>
                      </view>
                      <view class="card">{{
                        item.type === "儿童" ? "" : `${item.cert_no}`
                      }}</view>
                      <view
                        class="child_explain"
                        v-if="item.type === '儿童' && !changeSubmitStatus"
                        @click="openChildDialog()"
                        >儿童票说明</view
                      >
                    </view>
                  </view>
                </view>
                <view
                  class="edit_btn"
                  v-if="item.type !== '儿童' && !changeSubmitStatus"
                ></view>
                <view class="insurance_box" v-if="changeSubmitStatus">
                  <yun-switch
                    text="保险"
                    @switchStauts="passInsSwitch()"
                    :trainValue="item.is_insure"
                    :index="index"
                    :disabled="insuranceList.length < 1"
                  ></yun-switch>
                </view>
              </view>

              <template v-slot:right>
                <view class="option_box">
                  <view class="delete_btn" @click="removePassenger(item, e)">
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

            <view
              class="add_child_btn"
              @click="openAdultDialog(passengerList)"
              v-if="!changeSubmitStatus"
            >
              <image
                class="add_child_btn_icon"
                src="@/static/add_icon.png"
                mode="contain"
              />
              <text>添加儿童</text>
              <view class="add_child_btn_message">(用成人证件)</view>
            </view>
          </uni-swipe-action>
        </view>
        <!-- 购买保险 -->
        <view class="insurance_box_content common_style" v-if="changeSubmitStatus">
          <view class="title_text">
            <view class="title_icon"></view>
            <text>购买保险</text>
          </view>
          <view class="insurance_box" v-if="insuranceList.length > 0">
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
                  <text>&yen; {{ Number(item.default_dis_price).toFixed(0) }}</text
                  >/份
                </view>
                <view
                  :class="['item_icon', { is_active: insuranceActive.id === item.id }]"
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
          <view class="insurance_box_no" v-else>暂无保险</view>
        </view>
        <!-- 选座服务 -->
        <view
          class="selection_service common_style"
          v-if="!isShowSeat() && !changeSubmitStatus && passengerList.length > 0"
        >
          <view class="selection_top">
            <view class="top_title">选座服务</view>
            <view
              class="top_action"
              v-if="
                trainData.train &&
                  (trainData.train.type === 'G' ||
                    trainData.train.type === 'D' ||
                    trainData.train.type === 'C') &&
                  !isShowSeat()
              "
            >
              可选座位：
              <view
                :class="[
                  'top_action_first',
                  { active: this.getSeatNumber() === passengerList.length },
                ]"
                >{{ this.getSeatNumber() }}/</view
              >
              <text>{{ passengerList.length }}</text>
            </view>
          </view>

          <!-- 座位 -->
          <view
            :class="this.getSeatNumber() === passengerList.length ? 'notSeat' : ''"
            v-if="
              trainData.train &&
                (trainData.train.type === 'G' ||
                  trainData.train.type === 'D' ||
                  trainData.train.type === 'C')
            "
          >
            <view class="selection_siting">
              <view class="seat_describe">靠窗</view>
              <view class="seat_item">
                <view
                  :class="[
                    'seat_single',
                    String(checkedCabinList).indexOf('1A') > -1 ? ' active' : '',
                  ]"
                  @click="checkedCabin('1A')"
                >
                  <view class="seat_number">A</view>
                </view>

                <view
                  :class="[
                    'seat_single',
                    String(checkedCabinList).indexOf('1B') > -1 ? ' active' : '',
                  ]"
                  @click="checkedCabin('1B')"
                >
                  <view class="seat_number">B</view>
                </view>
                <view
                  :class="[
                    'seat_single',
                    String(checkedCabinList).indexOf('1C') > -1 ? ' active' : '',
                  ]"
                  @click="checkedCabin('1C')"
                >
                  <view class="seat_number">C</view>
                </view>
              </view>
              <view class="seat_describe">过道</view>
              <view class="seat_item">
                <view
                  :class="[
                    'seat_single',
                    String(checkedCabinList).indexOf('1D') > -1 ? ' active' : '',
                  ]"
                  @click="checkedCabin('1D')"
                >
                  <view class="seat_number">D</view>
                </view>
                <view
                  :class="[
                    'seat_single',
                    String(checkedCabinList).indexOf('1F') > -1 ? ' active' : '',
                  ]"
                  @click="checkedCabin('1F')"
                >
                  <view class="seat_number">F</view>
                </view>
              </view>
              <view class="seat_describe">靠窗</view>
            </view>

            <view class="selection_siting" v-if="passengerList.length > 1">
              <view class="seat_describe">靠窗</view>
              <view class="seat_item">
                <view
                  :class="[
                    'seat_single',
                    String(checkedCabinList).indexOf('2A') > -1 ? ' active' : '',
                  ]"
                  @click="checkedCabin('2A')"
                >
                  <view class="seat_number">A</view>
                </view>

                <view
                  :class="[
                    'seat_single',
                    String(checkedCabinList).indexOf('2B') > -1 ? ' active' : '',
                  ]"
                  @click="checkedCabin('2B')"
                >
                  <view class="seat_number">B</view>
                </view>
                <view
                  :class="[
                    'seat_single',
                    String(checkedCabinList).indexOf('2C') > -1 ? ' active' : '',
                  ]"
                  @click="checkedCabin('2C')"
                >
                  <view class="seat_number">C</view>
                </view>
              </view>
              <view class="seat_describe">过道</view>
              <view class="seat_item">
                <view
                  :class="[
                    'seat_single',
                    String(checkedCabinList).indexOf('2D') > -1 ? ' active' : '',
                  ]"
                  @click="checkedCabin('2D')"
                >
                  <view class="seat_number">D</view>
                </view>
                <view
                  :class="[
                    'seat_single',
                    String(checkedCabinList).indexOf('2F') > -1 ? ' active' : '',
                  ]"
                  @click="checkedCabin('2F')"
                >
                  <view class="seat_number">F</view>
                </view>
              </view>
              <view class="seat_describe">靠窗</view>
            </view>
          </view>

          <!-- 卧铺展示 -->
          <view class="selection_lying" v-else-if="!isShowSeat()">
            <text>
              卧铺价格暂显示上铺全价，网上购票铺位随机，实际以占座
              后铺位价格为准，如有差价则1-3工作日原路退回。
            </text>
          </view>
        </view>

        <!-- 订单联系人信息 -->
        <view class="order_contact common_style">
          <view :class="['contact_title', { noAsterisk: changeSubmitStatus }]"
            >订单联系人信息</view
          >
          <view class="contact_item_list">
            <view class="contact_item">
              <view
                class="item_title"
                :style="{ color: changeSubmitStatus ? '#999' : '' }"
                >联系人</view
              >

              <view v-if="changeSubmitStatus" class="item_text">{{
                orderPassenger.name
              }}</view>
              <input
                v-else
                class="item_input"
                placeholder="请填写姓名"
                type="text"
                v-model="orderPassenger.name"
                placeholder-style="fontSize: 28upx;fontWeight:400;color:rgba(175,185,196,1);"
              />
            </view>
            <view class="contact_item">
              <view class="item_title">手机号</view>
              <view v-if="changeSubmitStatus" class="item_text">{{
                orderPassenger.phone
              }}</view>
              <input
                v-else
                class="item_input"
                placeholder="用于接收订单通知"
                placeholder-style="fontSize: 28upx;fontWeight:400;color:rgba(175,185,196,1);"
                type="number"
                v-model="orderPassenger.phone"
              />
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    <!-- 底部 -->
    <view class="bottom_bar">
      <view class="left_message">
        <view class="not_pass_message" v-if="passengerList.length < 1"
          >请先添加乘车人</view
        >
        <view v-else class="pass_message" @click="openPriceDialog()">
          合计：
          <view class="pass_message_price">
            <text>&yen;</text>
            {{ getOrderPrice() }}
          </view>
        </view>
      </view>
      <view class="right_half">
        <view class="revise_Back" v-if="changeSubmitStatus" @click="reviseBack()"
          >返回修改</view
        >
        <button
          :disabled="!trueNext"
          :class="['right_btn', { is_true: trueNext }]"
          type="default"
          @click="nextAction()"
          v-if="!changeSubmitStatus"
        >
          下一步
        </button>
        <button
          v-if="changeSubmitStatus"
          class="right_btn is_background"
          @click="submitOrder"
        >
          提交订单
        </button>
      </view>
    </view>

    <!-- 儿童票说明 -->
    <uni-popup ref="childDescription" type="bottom">
      <view class="child_modal_box">
        <view class="modal_box_title">
          <view class="title_value">儿童票说明</view>
          <view class="close_btn" @click="closeChildDialog()"></view>
        </view>
        <view class="modal_box_content">
          <text>1.每名成年乘客可免费携带一名身高不足1.2米的儿童，该儿童可不用购票及填写相关信息。携带的其他儿童身高不足1.2米也须购儿童票。</text>
          <text>2.身高不足1.2米的免费儿童需与成人共用一个席位，若想要单独的席位，须购儿童票。</text>
          <text>3.身高1.2米—1.5米儿童可购儿童票，但须跟成人票一起购买，使用同行成人证件购票并凭此证件取票。</text>
          <text>4.身高超1.5米的儿童须购全价票。因儿童无有效证件，此类票只能在线下售票窗口购买。</text>
          <text>备注：请根据儿童实际身高购票，云上航空不承担因儿童身高与所购车票不符而无法进站的责任。</text>
        </view>
      </view>
    </uni-popup>

    <!-- 成人证件 -->
    <uni-popup ref="adultModal" type="bottom">
      <view class="adult_modal_box">
        <view class="modal_box_title">
          <view class="title_value">选择成人证件为儿童购票</view>
          <view class="close_btn" @click="closeAdultDialog()"></view>
        </view>
        <view class="modal_box_content">
          <view
            :class="['cert_box', { active: item.name === checkedAdtPassenger.name }]"
            v-for="(item, index) in passengerList"
            :key="index"
            @click="checkedCard(item)"
            v-if="item.type !== '儿童'"
          >
            <view class="box_title">{{ item.name }}</view>
            <view class="box_input"
              >{{ item.cert_type }}尾号{{
                item.cert_no ? item.cert_no.slice(-4) : "-"
              }}</view
            >
          </view>
        </view>
      </view>
    </uni-popup>

    <!-- 订单总价 -->
    <uni-popup ref="orderPrice" type="bottom">
      <view class="price_modal_box">
        <view class="modal_box_title">
          <view class="title_value">订单总价</view>
          <view class="close_btn" @click="closePriceDialog()"></view>
        </view>
        <view class="modal_box_content">
          <view class="price_box">
            <view class="price_item">
              <view class="price_title">订单总价</view>
              <view class="price_value">
                <span>&yen;</span>
                <view class="value_info">{{ getOrderPrice() }}</view>
              </view>
            </view>

            <view class="fare_item">
              <view class="item_title">成人票价</view>
              <view class="item_box">
                <view class="item_box_price">&yen;{{ singleData.price }}</view>
                <view class="item_box_person">x{{ passengerNumber.adt }}人</view>
              </view>
            </view>

            <view class="fare_item">
              <view class="item_title">儿童票价</view>
              <view class="item_box">
                <view class="item_box_price">&yen;{{ singleData.price / 2 }}</view>
                <view class="item_box_person">x{{ passengerNumber.chd }}人</view>
              </view>
            </view>

            <view class="fare_item">
              <view class="item_title">服务费</view>
              <view class="item_box">
                <view class="item_box_price">&yen;{{ singleData.service_fee || 0 }}</view>
                <view class="item_box_person">x{{ passengerList.length }}人</view>
              </view>
            </view>

            <view class="fare_item">
              <view class="item_title">保险</view>
              <view class="item_box">
                <view class="item_box_price"
                  >&yen;{{ insuranceActive.default_dis_price || 0 }}</view
                >
                <view class="item_box_person">x{{ insuranceNumber }}人</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </uni-popup>

    <!-- 核验弹窗 -->
    <passengerVerify
      ref="verifyPopup"
      :passengerData="verifyPassengerData"
      @jumpVerify="jumpVerify"
    ></passengerVerify>
  </view>
</template>

<script>
import insurance from "@/api/insurance.js";
import train from "@/api/trainInquiry.js";
import passenger from "@/api/passenger.js";
import trainMessageCard from "@/components/train_message_card.vue"; // 车次信息

import passengerVerify from "@/components/passenger_verify.vue"; // 乘客核验提示框
export default {
  components: {
    trainMessageCard,
    passengerVerify,
  },
  data() {
    return {
      iStatusBarHeight: 0, // 导航栏高度
      pageHeaderData: {}, // 导航栏名称
      trainData: {}, // 预定传值
      singleData: {}, // 座位信息

      chdinf_msg: 0,
      passengerList: [], // 乘客列表
      passengerNumber: {
        adt: 0,
        cnd: 0,
      }, // 乘机人数量

      checkedCabinList: [], // 选座选中

      trueNext: false, // 下一步
      changeSubmitStatus: false, // 下一步到提交订单状态切换
      acceptStatus: true, // 接受无座状态

      insuranceList: [], // 保险列表
      moreInsurance: 4, // 保险默认显示条数
      insuranceActive: {}, // 选择保险
      insuranceNumber: 0, // 带有保险的乘客个数

      checkedAdtPassenger: {}, // 选中成人乘客

      verifyPassengerData: {}, // 核验乘客信息

      // 订单联系人信息
      orderPassenger: {
        name: "", // 联系人
        phone: "", // 手机号
      },
    };
  },
  methods: {
    // 选座服务 座位数量
    getSeatNumber() {
      let number = 0;
      for (let i = 0; i < this.checkedCabinList.length; i++) {
        number += 1;
      }
      return number;
    },
    // 添加乘车人
    jumpPassenger() {
      uni.navigateTo({
        url:
          "/flightReservation/passengerList?chdinfNumber=" +
          JSON.stringify(this.chdinf_msg) +
          "&editPassengerList=" +
          JSON.stringify(this.passengerList) +
          "&trainType=train",
      });
    },

    // 获取是否接受无座状态
    getSeatStatus(val) {
      this.acceptStatus = val;
    },

    // 选座
    checkedCabin(val) {
      if (this.passengerList.length < 1) {
        return false;
      }

      if (String(this.checkedCabinList).indexOf(val) < 0) {
        if (this.checkedCabinList.length < this.passengerList.length) {
          this.checkedCabinList.push(val);
        }
      } else {
        this.checkedCabinList.splice(
          this.checkedCabinList.findIndex((item) => item === val),
          1
        );
      }
    },

    // 是否显示在线选座
    isShowSeat() {
      return this.singleData.name === "无座" || this.singleData.name === "硬座" || false;
    },

    // 是否接受无座
    isNOSeat() {
      return this.singleData.name === "硬卧" || this.singleData.name === "软卧" || false;
    },

    // 计算订单总价
    getOrderPrice() {
      let totalPrice = 0;
      totalPrice =
        Number(this.singleData.price) * Number(this.passengerNumber.adt) +
        Number(this.singleData.price / 2) * Number(this.passengerNumber.chd) +
        Number(this.singleData.service_fee) * Number(this.passengerList.length) +
        Number(this.insuranceActive.default_dis_price || 0) *
          Number(this.insuranceNumber);

      this.trueNext = this.passengerList.length > 0;
      return totalPrice;
    },

    // 返回修改
    reviseBack() {
      this.changeSubmitStatus = false;
    },

    // 打开核验弹窗
    openVerify(val) {
      this.verifyPassengerData = {
        passengerName: val.name,
        phone: val.phone,
        cert_no: val.cert_no,
      };
      this.$refs.verifyPopup.openVerifyPopup();
    },
    // 跳转到核验
    jumpVerify() {
      if (
        this.verifyPassengerData.phone === "" ||
        this.verifyPassengerData.cert_no === ""
      ) {
        uni.showToast({
          title: "乘车人信息不完整",
          icon: "none",
          duration: 3000,
        });
      } else {
        uni.navigateTo({
          url:
            "/flightReservation/passengerVerify?passengerData=" +
            JSON.stringify(this.verifyPassengerData),
        });
        this.$refs.verifyPopup.colseVerifyPopup();
      }
    },

    // 下一步
    nextAction() {
      for (let i = 0; i < this.passengerList.length; i++) {
        if (this.passengerList[i].type === '成人' && this.passengerList[i].verify_status !== 1) {
          this.openVerify(this.passengerList[i]);
          return;
        }
      }

      if (
        (this.trainData.train.type === "G" ||
          this.trainData.train.type === "D" ||
          this.trainData.train.type === "C") &&
        this.passengerList.length !== this.checkedCabinList.length
      ) {
        return uni.showToast({
          title: "请为所有乘客选座",
          icon: "none",
        });
      }
      if (!this.orderPassenger.name || !this.orderPassenger.phone) {
        return uni.showToast({
          title: "请完善订单联系人信息",
          icon: "none",
        });
      }
      if (this.orderPassenger.phone) {
        if (!this.$isPhone(this.orderPassenger.phone)) {
          return uni.showToast({
            title: "联系人手机号码格式有误",
            icon: "none",
          });
        }
      }
      this.changeSubmitStatus = true;

      //  this.passengerList.forEach(item => {
      //         item.is_insure = false
      //     })
    },

    // 提交订单
    submitOrder() {
      let passenger = [];

      this.passengerList.map((item) => {
        passenger.push({
          name: item.name, //类型：String  必有字段  备注：姓名
          card_no: item.cert_no, //类型：String  必有字段  备注：证件号
          card_name: item.cert_type, //类型：String  必有字段  备注：证件名字
          card_type: item.cert_type === "身份证" ? "1" : "", //类型：String  必有字段  备注：证件类型
          id: item.id || 0, //类型：String  必有字段  备注：乘客ID
          seat_name: this.singleData.name, //类型：String  必有字段  备注：座位名字
          seat_code: this.singleData.code, //类型：String  必有字段  备注：座位代码
          price: this.singleData.price, //类型：String  必有字段  备注：座位价格
          ticket_type:
            item.type === "成人" ? "1" : item.type === "儿童" ? "2" : item.type, //类型：String  必有字段  备注：票类型
          phone: item.phone || "", //类型：String  必有字段  备注：手机号
          is_insurance: item.is_insure ? true : false, //类型：String  必有字段  备注：是否购买保险
          school: {
            //类型：Object  可有字段  备注：学校信息，默认为空。如果是学生票则必须
            // province_name:"mock",                //类型：String  可有字段  备注：省份，可为空
            // province_code:"mock",                //类型：String  可有字段  备注：省份代码，可为空
            // code:"mock",                //类型：String  必有字段  备注：学校代码
            // name:"mock",                //类型：String  必有字段  备注：学校名字
            // student_no:"mock",                //类型：String  必有字段  备注：学号
            // system:"mock",                //类型：String  必有字段  备注：学制
            // enter_year:"mock"                //类型：String  必有字段  备注：如学年份
          },
          passport: {
            //类型：Object  可有字段  备注：护照信息，如果是护照则必须
            expired: "2030-01-01", //类型：String  必有字段  备注：过期时间
            birthday: item.birthday, //类型：String  必有字段  备注：生日
            sex: item.sex === 2 ? "M" : "F", //类型：String  必有字段  备注：性别
            country: "CN", //类型：String  必有字段  备注：国家代码
          },
        });
      });

      let data = {
        source: "YunKu", // 数据源
        insurance_id: this.insuranceActive.id || "", // 保险ID
        account: { id: uni.getStorageSync("userInfo").id },
        order: {
          standing: this.acceptStatus, //类型：Boolean  必有字段  备注：是否接受站票，默认否
          is_choose_seat: this.checkedCabinList.length > 0, //类型：Boolean  必有字段  备注：是否选座，默认否
          choose_seat: String(this.checkedCabinList), //类型：String  必有字段  备注：选座内容
        },
        train: {
          departure: this.trainData.station.departure_name, //类型：String  必有字段  备注：出发地
          arrive: this.trainData.station.arrive_name, //类型：String  必有字段  备注：到达地
          departure_code: this.trainData.station.departure_code, //类型：String  必有字段  备注：出发地code
          arrive_code: this.trainData.station.arrive_code, //类型：String  必有字段  备注：到达地code
          code: this.trainData.train.code, //类型：String  必有字段  备注：车次
          number: this.trainData.train.number,
          departure_date: `${this.$moment(this.trainData.train.departure_date).format(
            "YYYY-MM-DD"
          )} ${this.trainData.train.departure}`, //类型：String  必有字段  备注：出发日期
          arrive_date: `${this.$moment(this.trainData.train.departure_date)
            .add(this.trainData.train.days, "d")
            .format("YYYY-MM-DD")} ${this.trainData.train.arrive}`, //类型：String  必有字段  备注：到达日期
          seat_number: "", //类型：String  必有字段  备注：座位号
          travel_time: this.trainData.train.run_minute, //类型：String  必有字段  备注：行程时长
          seat: this.singleData.name, //类型：String  必有字段  备注：座位等级中文
          seat_level: this.singleData.code, //类型：String  必有字段  备注：座位等级
          train_level: this.trainData.train.type, //类型：String  必有字段  备注：火车类型
        },
        passenger: passenger,
      };

      train.getTrainReserve(data).then((res) => {
        if (res.errorcode === 10000) {
          let orderNo = res.data.order.order_no;
          // 选择坐席 托管模式
          uni.removeStorageSync("trainMessage")
          uni.removeStorageSync("pageHeaderData")
          uni.removeStorageSync("singleData")
    
          uni.navigateTo({
            url:
              "/trainReservation/occupySeat?orderNo=" +
              orderNo +
              "&trainInfo=" +
              JSON.stringify(this.trainData) +
              "&seatInfo=" +
              JSON.stringify(this.singleData),
          });
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
            duration: 3000,
          });
        }
      });
    },

    // 移除乘机人  e 提交订单状态 乘车人禁止删除
    removePassenger(val, e) {
      if (e) {
        if (this.changeSubmitStatus) {
          return false;
        }
      }
      this.passengerList.splice(
        this.passengerList.findIndex((item) => item.id === val.id),
        1
      );
      this.getPassengerNumber();
    },

    // 保险
    getInsurance() {
      insurance.trainInsurance().then((res) => {
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
      this.moreInsurance = this.moreInsurance === 4 ? this.insuranceList.length : 4;
    },

    // 乘机人保险开关
    passInsSwitch(e, index, val) {
      if (JSON.stringify(this.insuranceActive) === "{}") {
        return uni.showToast({
          title: "请先选择您需要购买的保险",
          icon: "none",
        });
      }
      this.$set(this.passengerList[index], "is_insure", val);
      this.insuranceNumber = this.passengerList.filter(
        (u) => u.is_insure === true
      ).length;
    },

    // 保险选择
    changeInsurance(val) {
      console.log("保险金额", val);
      //  取消保险勾勾 乘车人保险开关关闭
      if (val.id === this.insuranceActive.id) {
        this.passengerList.forEach((item) => {
          item.is_insure = false;
        });
      }
      this.insuranceActive =
        val.id !== this.insuranceActive.id
          ? val
          : val.id === this.insuranceActive.id
          ? {}
          : {};
    },
    // 选中成人证件
    checkedCard(val) {
      console.log('选中成人',val)
      this.checkedAdtPassenger = val;
      let data = {
        cert_no: val.cert_no,
        cert_type: val.cert_type,
        name: val.name,
        type: "儿童",
        phone: val.phone,
        birthday: val.birthday,
      };
      this.passengerList.push(data);
      this.closeAdultDialog();
      this.getPassengerNumber();
    },
    // 打开儿童票说明
    openChildDialog() {
      this.$refs.childDescription.open();
    },

    closeChildDialog() {
      this.$refs.childDescription.close();
    },

    // 打开成人证件
    openAdultDialog(val) {
      // 如果成人只有一位 那么选择成人证件弹窗不显示
      if(this.passengerNumber.adt === 1) {
        let data = {
          cert_no: val[0].cert_no,
          cert_type: val[0].cert_type,
          name: val[0].name,
          type: "儿童",
          phone: val[0].phone,
          birthday: val[0].birthday,
        }
        this.passengerList.push(data)
      }else {
        this.$refs.adultModal.open();
      }
      this.getPassengerNumber();
      
    },

    closeAdultDialog() {
      this.$refs.adultModal.close();
    },

    // 打开订单总价
    openPriceDialog() {
      // 提交订单之前 订单总价弹窗不显示
      if (!this.changeSubmitStatus) {
        return false;
      }
      this.$refs.orderPrice.open();
    },

    closePriceDialog() {
      this.$refs.orderPrice.close();
    },

    // 计算乘客人数
    getPassengerNumber() {
      this.passengerNumber = {
        adt: this.passengerList.filter((u) => u.type === "成人").length, // 成人数量
        chd: this.passengerList.filter((u) => u.type === "儿童").length, // 儿童数量
      };
    },

    // 乘客状态刷新
    getPassengerNewVerf() {
      let passengerVerf = [];
      this.passengerList.forEach((item) => {
        if (item.verify_status !== 1) {
          passengerVerf.push({
            //类型：Object  必有字段  备注：无
            name: item.name, //类型：String  必有字段  备注：姓名
            card_no: item.cert_no, //类型：String  必有字段  备注：证件号
            card_type: 1, //类型：String  必有字段  备注：证件类型
            card_name: "中国居民身份证", //类型：String  必有字段  备注：证件名字
            phone: item.phone, //类型：String  必有字段  备注：无
            ticket_type: 1, //类型：String  必有字段  备注：票类型
          });
        }
      });
      let data = {
        channel: "Di", //类型：String  必有字段  备注：渠道
        source: "YunKu", //类型：String  必有字段  备注：来源
        passenger: passengerVerf,
      };
      passenger.verifyPassenger(data).then((res) => {
        if (res.errorcode === 10000) {
          this.passengerList.forEach((item) => {
            item.verify_status === 1;
          });
        }
      });
    },
  },
  onShow() {
    
    if (this.passengerList.length > 0) {
      this.getPassengerNewVerf();
    }

    let passenger = uni.getStorageSync("passengerList");
    if (passenger) {
      
      this.passengerList = JSON.parse(passenger);
      uni.removeStorageSync("passengerList");
    }
    console.log("乘客", this.passengerList);
    this.getPassengerNumber();
    // 选择坐席 托管模式
    if(uni.getStorageSync("trainMessage")) {
      this.trainData = JSON.parse(uni.getStorageSync("trainMessage"))
    }
    if(uni.getStorageSync("pageHeaderData")) {
      this.pageHeaderData = JSON.parse(uni.getStorageSync("pageHeaderData"))
    }
    if(uni.getStorageInfoSync("singleData")) {
      this.singleData = JSON.parse(uni.getStorageSync("singleData"))
    }
    
  },
  onLoad(data) {
    this.getInsurance();
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;

    this.trainData = data.trainItem ? JSON.parse(data.trainItem) : {};
    this.singleData = data.singleData ? JSON.parse(data.singleData) : {};
    this.pageHeaderData = data.pageHeaderData ? JSON.parse(data.pageHeaderData):{};

    this.pageHeaderData = JSON.parse(JSON.stringify(this.pageHeaderData));

    let userInfo = uni.getStorageSync("userInfo");
    this.orderPassenger = {
      name: userInfo.role_name, // 联系人
      phone: userInfo.phone, // 手机号
    };
  },
};
</script>

<style scoped lang="less">
.train_reservation {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: RGBA(243, 245, 247, 1);
  .reservation_background {
    flex: 1;
    background: linear-gradient(180deg, #0070e2 0%, rgba(0, 112, 226, 0) 50%);
    display: inline-flex;
    height: 100%;
    overflow: hidden;
  }
  .reservation_content {
    height: 100%;
    overflow-y: auto;

    .common_style {
      background-color: #ffffff;
      box-shadow: 0upx 12upx 18upx rgba(0, 0, 0, 0.04);
      border-radius: 20upx;
      margin: 0upx 20upx;
    }
    .cancel_rules {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-size: 24upx;
      font-weight: 400;
      color: #ffffff;
      position: relative;
      margin: 24upx 20upx;
      &::before {
        content: "";
        width: 32upx;
        height: 34upx;
        right: 98upx;
        background: url("@/static/train_rule.png");
        background-size: contain;
        position: absolute;
      }
    }
    .train_box {
      margin: 0upx 20upx 20upx 20upx;
    }
    .passenger_box {
      display: flex;
      flex-direction: column;
      padding: 28upx 20upx 32upx;
      margin-bottom: 20upx;
      .passenger_top {
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        .passenger_title {
          font-size: 28upx;
          font-weight: bold;
          color: #2a2a2a;
        }
        .passenger_button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8upx 20upx;
          border: 2upx solid #0070e2;
          background-color: #ffffff;
          border-radius: 30upx;
          font-size: 24upx;
          font-weight: 400;
          color: #0070e2;
        }
      }
      .passenger_main {
        width: 100%;
        .main_list {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          position: relative;
          box-sizing: border-box;
          /deep/.uni-swipe {
            width: 100%;
          }

          &:first-child {
            margin-top: 44upx;
          }
          &:not(:last-child) {
            margin-bottom: 40upx;
            .list_message {
              border-bottom: 2upx solid rgba(241, 243, 245, 1);
            }
          }
          .remove_btn {
            background: url(@/static/number_remove_btn.png) no-repeat center center;
            background-size: contain;
            width: 36upx;
            height: 36upx;
            flex-shrink: 0;
            margin-right: 16upx;
            margin-top: 40upx;
          }
          .list_message {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .message_info_item {
              display: flex;
              flex-direction: column;
              width: 100%;
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
                .bottom_left {
                  display: flex;
                  align-items: center;
                  width: 100%;
                  .bottom_title {
                    font-size: 28upx;
                    font-weight: 400;
                    color: rgba(42, 42, 42, 1);
                    margin-right: 32upx;
                    .title_child {
                      display: inline-flex;
                    }
                  }
                  .card {
                    font-size: 28upx;
                    font-weight: bold;
                    color: rgba(42, 42, 42, 1);
                  }
                  .child_explain {
                    font-size: 24upx;
                    font-weight: 400;
                    color: #7b9bc1;
                    margin-left: auto;
                    &::after {
                      display: inline-block;
                      margin-left: 10upx;
                      content: "";
                      width: 12upx;
                      height: 20upx;
                      top: 9upx;
                      left: 125upx;
                      background: url("@/static/train_arrow.png") no-repeat center center;
                      background-size: contain;
                    }
                  }
                }
              }
            }
            .edit_btn {
              background: url(@/static/edit_icon.png) no-repeat center center;
              background-size: contain;
              width: 30upx;
              height: 30upx;
            }
            .insurance_box {
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
          .add_child_btn_message {
            font-size: 24upx;
            font-weight: 400;
            color: #0070e2;
            margin-left: 12upx;
          }
          .add_child_btn_icon {
            width: 30upx;
            height: 30upx;
            object-fit: contain;
            margin-right: 12upx;
          }
        }
      }
    }
    .insurance_box_content {
      font-size: 32upx;
      font-weight: bold;
      color: #2a2a2a;
      padding: 20upx;
      margin-bottom: 20upx;
      .title_text {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin: 10upx 0upx 40upx;
        .title_icon {
          width: 30upx;
          height: 34upx;
          background: url("@/static/insurance.png");
          background-size: contain;
          margin-right: 14upx;
        }
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
              background: url(@/static/insurance_type_1.png) no-repeat center center;
              background-size: contain;
              margin-left: 10upx;
              &.true {
                background: url(@/static/insurance_type_2.png) no-repeat center center;
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
      .insurance_box_no {
        font-size: 28upx;
        color: #2a2a2a;
        font-weight: 400;
      }
    }
    .selection_service {
      display: flex;
      flex-direction: column;
      padding: 30upx 20upx;
      margin-bottom: 20upx;
      .selection_top {
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        .top_title {
          font-size: 28upx;
          font-weight: bold;
          color: #2a2a2a;
        }
        .top_action {
          display: inline-flex;
          font-size: 24upx;
          font-weight: 400;
          color: #666666;
          .top_action_first {
            &.active {
              color: rgba(0, 112, 226, 1);
            }
          }
        }
      }
      .selection_lying {
        margin-top: 20upx;
        padding: 28upx 20upx;
        background: linear-gradient(
          180deg,
          rgba(251, 152, 38, 0.1) 0%,
          rgba(251, 152, 38, 0) 100%
        );
        box-shadow: 0upx 12upx 18upx rgba(0, 0, 0, 0.04);
        border-radius: 20upx;
        text {
          font-size: 24upx;
          font-weight: 400;
          color: #fb9826;
        }
      }
      .notSeat {
        .selection_siting {
          .seat_item {
            .seat_single {
              background: url("@/static/train_not_seat.png") no-repeat center center;
              background-size: contain;
              .seat_number {
                color: #95a1ae;
              }
            }
          }
        }
      }
      .selection_siting {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 36upx;
        margin-top: 60upx;
        .seat_describe {
          border: 2upx solid #d9e1ea;
          border-radius: 10upx;
          font-size: 22upx;
          font-weight: 400;
          color: #95a1ae;
          width: 38upx;
          height: 64upx;
          text-align: center;
        }
        .seat_item {
          display: inline-flex;
          .seat_single {
            width: 60upx;
            height: 64upx;
            background: url("@/static/train_seat.png") no-repeat center center;
            background-size: contain;
            position: relative;
            .seat_number {
              position: absolute;
              font-size: 30upx;
              font-weight: 400;
              left: 20upx;
              top: 8upx;
              color: rgba(0, 112, 226, 0.6);
            }
            &:not(:last-child) {
              margin-right: 30upx;
            }
            &.active {
              background: url("@/static/train_active_seat.png") no-repeat center center;
              background-size: contain;

              .seat_number {
                color: #fff;
              }
            }
          }
        }
      }
    }
    .order_contact {
      display: flex;
      flex-direction: column;
      padding: 30upx 20upx 0upx;
      margin-bottom: 20upx;

      .contact_title {
        font-size: 28upx;
        font-weight: bold;
        color: #2a2a2a;
        margin-bottom: 12upx;
        &::after {
          content: "*";
          color: #ff0000;
          display: inline-block;
          margin-left: 6upx;
        }
        &.noAsterisk {
          &::after {
            display: none;
          }
        }
      }
      .contact_item_list {
        display: flex;
        flex-direction: column;
        .contact_item {
          display: flex;
          font-size: 26upx;
          font-weight: 400;
          color: #2a2a2a;
          padding: 28upx 0upx 34upx;
          .item_title {
            margin-right: 38upx;
            // color: #999999;
          }
          .item_input {
            font-size: 28upx;
            font-weight: 400;
          }
          .item_text {
            font-size: 28upx;
            font-weight: 400;
          }
          &:not(:last-child) {
            border-bottom: 1upx solid #f1f3f5;
          }
        }
      }
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
        .pass_message_price {
          display: inline-flex;
          align-items: baseline;
          justify-content: center;
          font-weight: bold;
          color: #0070e2;
          font-size: 40upx;
          text {
            font-size: 28upx;
            margin-right: 6upx;
          }
          &::after {
            content: "";
            display: inline-block;
            background: url(@/static/flight_checked_btn.png) no-repeat center center;
            background-size: contain;
            width: 16upx;
            height: 12upx;
            margin-left: 16upx;
            padding-bottom: 20upx;
          }
        }
      }
    }

    .right_half {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      .revise_Back {
        font-size: 26upx;
        font-weight: 400;
        color: #95a1ae;
        margin-right: 20upx;
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
        &.is_background {
          background: linear-gradient(90deg, #fb9826 0%, #ffca61 100%);
          box-shadow: 0upx 6upx 12upx rgba(251, 152, 38, 0.3);
          opacity: 1;
        }
      }
    }
  }
  // 儿童票说明
  .child_modal_box {
    position: relative;
     &::before {
      content: "";
      position: absolute;
      bottom: -120upx;
      width: 100%;
      height: 120upx;
      background-color: #fff;
    }
    .modal_box_title {
      background: #ffffff;
      border-radius: 80upx 80upx 0upx 0upx;
      border-bottom: 2upx solid #d9e1ea;
      padding: 42upx 28upx;
      display: flex;
      justify-content: center;
      align-items: center;
      .title_value {
        font-size: 36upx;
        font-weight: bold;
        color: #333333;
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
    .modal_box_content {
      background: #fff;
      display: flex;
      flex-direction: column;
      max-height: 45vh;
      padding: 60upx 52upx;
      font-size: 28upx;
      font-weight: 400;
      color: #707070;
      text {
        margin-bottom: 60upx;
      }
    }
  }
  // 成人证件
  .adult_modal_box {
    position: relative;
     &::before {
      content: "";
      position: absolute;
      bottom: -120upx;
      width: 100%;
      height: 120upx;
      background-color: #fff;
    }
    .modal_box_title {
      background: #ffffff;
      border-radius: 80upx 80upx 0upx 0upx;
      border-bottom: 2upx solid #d9e1ea;
      padding: 42upx 28upx;
      display: flex;
      justify-content: center;
      align-items: center;
      .title_value {
        font-size: 36upx;
        font-weight: bold;
        color: #333333;
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
    .modal_box_content {
      background: #fff;
      display: flex;
      flex-wrap: wrap;
      height: 30vh;
      overflow-y: auto;
      .cert_box {
        width: 310upx;
        height: 130upx;
        background: #f1f3f5;
        border-radius: 10upx;
        text-align: center;
        margin: 32upx;
        border: 2upx solid transparent;
        .box_title {
          font-size: 30upx;
          font-weight: 400;
          color: #333333;
          margin: 22upx 0upx 8upx;
        }
        .box_input {
          font-size: 26upx;
          font-weight: 400;
          color: #afb9c4;
        }
        &.active {
          border: 2upx solid #0070e2;
        }
      }
    }
  }
  // 订单总价
  .price_modal_box {
    position: relative;
     &::before {
      content: "";
      position: absolute;
      bottom: -120upx;
      width: 100%;
      height: 120upx;
      background-color: #fff;
    }
    .modal_box_title {
      background: #ffffff;
      border-radius: 80upx 80upx 0upx 0upx;
      border-bottom: 2upx solid #d9e1ea;
      padding: 42upx 28upx;
      display: flex;
      justify-content: center;
      align-items: center;
      .title_value {
        font-size: 36upx;
        font-weight: bold;
        color: #333333;
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
    .modal_box_content {
      background: #fff;
      padding: 20upx;
      min-height: 35vh;
      .price_box {
        background: #f9f9f9;
        display: flex;
        flex-direction: column;
        padding: 0upx 20upx;
        .price_item {
          display: inline-flex;
          justify-content: flex-start;
          align-items: center;
          border-bottom: 2upx solid #eaeaea;
          padding: 38upx 0upx 26upx;
          .price_title {
            font-size: 28upx;
            font-weight: bold;
            color: #333333;
            margin-right: 24upx;
          }
          .price_value {
            display: inline-flex;
            justify-content: center;
            align-items: baseline;
            color: #ff0000;
            span {
              font-size: 28upx;
            }
            .value_info {
              font-size: 36upx;
            }
          }
        }
        .fare_item {
          display: inline-flex;
          justify-content: space-between;
          align-items: center;
          margin: 20upx 0upx;
          .item_title {
            font-size: 28upx;
            font-weight: 400;
            color: #333333;
          }
          .item_box {
            display: inline-flex;
            .item_box_price {
              font-size: 28upx;
              font-weight: 500;
              color: #ff0000;
            }
            .item_box_person {
              font-size: 28upx;
              font-weight: 500;
              color: #999999;
              margin-left: 18upx;
            }
          }
        }
      }
    }
  }
}
</style>
