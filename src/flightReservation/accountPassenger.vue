<!--
 * @Description: 新增/编辑12306账号乘客
 * @Author: wish.WuJunLong
 * @Date: 2021-10-27 11:11:15
 * @LastEditTime: 2021-10-29 17:13:23
 * @LastEditors: mzr
-->

<template>
  <div class="account_passenger">
    <yun-header
      :statusHeight="iStatusBarHeight"
      :headerBottom="Number(10)"
      :centerTitle="pageType + '乘机人'"
    ></yun-header>

    <div class="passenger_box">
      <div class="box_list">
        <div class="list_item">
          <div class="item_title">姓名</div>
          <div class="item_input">
            <input
              placeholder="与证件姓名一致"
              type="text"
              v-model="passengerData.name"
              placeholder-class="input_placeholder"
            />
          </div>
        </div>
        <div class="list_item">
          <div class="item_title">手机号码</div>
          <div class="item_input">
            <input
              placeholder="用于实名认证"
              type="number"
              v-model="passengerData.phone"
              placeholder-class="input_placeholder"
            />
          </div>
        </div>
        <div class="list_item">
          <div class="item_title">乘客类型</div>
          <div class="item_input">
            <view class="id_card_type" @click="openPassengerSelect()">
              <text v-if="passengerData.ticket_type">{{
                passengerData.ticket_type
              }}</text>
              <text v-else class="input_placeholder">请选择乘客类型</text>
            </view>
          </div>
        </div>
      </div>

      <div class="box_list">
        <div class="list_item">
          <div class="item_title">证件类型</div>
          <div class="item_input">
            <view class="id_card_type" @click="openCradSelect()">
              <text v-if="passengerData.card_type">{{ passengerData.card_type }}</text>
              <text v-else class="input_placeholder">请选择证件类型</text>
            </view>
          </div>
        </div>
        <div class="list_item">
          <div class="item_title">证件号码</div>
          <div class="item_input">
            <input
              placeholder="与证件号码一致"
              type="idcard"
              v-model="passengerData.card_no"
              placeholder-class="input_placeholder"
            />
          </div>
        </div>
      </div>
    </div>

    <view class="submit_box">
      <view class="submit_btn submit_post" @click="submitDataBtn()">保存</view>
    </view>

    <!-- 二次确认信息弹窗 -->
    <uni-popup ref="returnSubmitDialog" type="bottom">
      <view class="return_submit">
        <view class="title">
          信息确认
          <view class="close_btn" @click="editUserinfo"></view>
        </view>

        <view class="retuen_content">
          <view class="content_title">
            <text>若姓名证件号错误将影响登机，</text>请你仔细核对，确保信息与乘机证件一致
          </view>
          <view class="content_userinfo">
            <view>
              <text>姓名</text>
              <text>{{ passengerData.name }}</text>
            </view>
            <view>
              <text>{{ passengerData.card_type }}</text>
              <text>{{ passengerData.card_no }}</text>
            </view>
          </view>
        </view>

        <view class="btn_box">
          <view class="submit_btn return_btn" @click="editUserinfo">修改信息</view>
          <view class="submit_btn submit_post" @click="submitUserinfo">确认保存</view>
        </view>
      </view>
    </uni-popup>

    <!-- 证件类型选择弹窗 -->
    <yun-selector
      ref="selectorPopup"
      :dataList="cardTypeList"
      @submitDialog="cardTypeListSelectBtn()"
    ></yun-selector>
    <!-- 乘客类型选择弹窗 -->
    <yun-selector
      ref="cardStatusListPopup"
      :dataList="cardStatusList"
      @submitDialog="cardStatusListBtn()"
    ></yun-selector>
    <!-- 账号验证 -->
    <!-- <accountVerify
      ref="trainAccountVerify"
      :phone="passengerData.phone"
    ></accountVerify> -->
  </div>
</template>

<script>
import passenger from "@/api/passenger.js";
import accountVerify from '@/components/account_verify.vue';
export default {
  components: { accountVerify },
  data() {
    return {
      iStatusBarHeight: 0, // 状态栏高度
      pageType: "新增",
      passengerData: {}, //

      cardTypeList: [
        "中国居民身份证",
        "港澳台居民居住证",
        "护照",
        "港澳居民来往内地通行证",
        "台湾居民来往大陆通行证",
        "外国人永久居留身份证",
      ],

      cardStatusList: ["成人", "儿童", "学生", "残疾军人"],
    };
  },

  methods: {
    // 打开证件选择弹窗
    openCradSelect() {
      this.$refs.selectorPopup.openDialog();
    },

    // 打开乘客类型选择
    openPassengerSelect() {
      this.$refs.cardStatusListPopup.openDialog();
    },

    // 获取证件类型
    cardTypeListSelectBtn(val) {
      console.log(val);
      this.passengerData.card_type = val;
      this.$forceUpdate();
    },

    // 选择乘客类型
    cardStatusListBtn(val) {
      this.passengerData.ticket_type = val;
      this.$forceUpdate();
    },

    // 提交保存按钮
    submitDataBtn() {
      if (
        !this.passengerData.name ||
        !this.passengerData.phone ||
        !this.passengerData.card_type ||
        !this.passengerData.card_no ||
        !this.passengerData.ticket_type
      ) {
        return uni.showToast({
          title: "请将信息填写完整再进行保存",
          icon: "none",
        });
      }

      if (
        !/^1[3456789]\d{9}$/.test(this.passengerData.phone) &&
        this.pageType === "新增"
      ) {
        return uni.showToast({
          title: "手机号码格式错误，请检查是否填写正确",
          icon: "none",
        });
      } else {
        this.idRardGetBirthdy();
      }
    },

    // 身份证转出生日期
    idRardGetBirthdy() {
      if (this.passengerData.card_type === "中国居民身份证" && this.pageType === "新增") {
        if (
          !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.passengerData.card_no)
        ) {
          return uni.showToast({
            title: "身份证号码不正确",
            duration: 2000,
            icon: "none",
          });
        } else {
          this.validID(this.passengerData.card_no);
          this.$refs.returnSubmitDialog.open();
        }
      } else {
        this.validID(this.passengerData.card_no);
        this.$refs.returnSubmitDialog.open();
      }
    },

    // 身份证验证
    async validID(value) {
      // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (reg.test(value) && this.pageType === "新增") {
        await this.go(value.length, value);
      }
    },

    // 根据身份证获取生日年龄性别
    go(val, idCard) {
      console.log(val, idCard);
      let iden = idCard;
      let sex = null;
      let birth = null;
      let myDate = new Date();
      let month = myDate.getMonth() + 1;
      let day = myDate.getDate();
      let age = 0;

      if (val === 18) {
        age = myDate.getFullYear() - iden.substring(6, 10) - 1;
        sex = iden.substring(16, 17);
        birth =
          iden.substring(6, 10) +
          "-" +
          iden.substring(10, 12) +
          "-" +
          iden.substring(12, 14);
        if (
          iden.substring(10, 12) < month ||
          (iden.substring(10, 12) == month && iden.substring(12, 14) <= day)
        )
          age++;
      }
      if (val === 15) {
        age = myDate.getFullYear() - iden.substring(6, 8) - 1901;
        sex = iden.substring(13, 14);
        birth =
          "19" +
          iden.substring(6, 8) +
          "-" +
          iden.substring(8, 10) +
          "-" +
          iden.substring(10, 12);
        if (
          iden.substring(8, 10) < month ||
          (iden.substring(8, 10) == month && iden.substring(10, 12) <= day)
        )
          age++;
      }

      if (sex % 2 === 0) sex = "1";
      else sex = "0";

      console.log(age);

      this.passengerData["sex"] = sex; //性别  0男 1女
      this.passengerData['birthday'] = birth

      this.$forceUpdate();
    },

    // 二次确认关闭
    editUserinfo() {
      this.$refs.returnSubmitDialog.close();
    },
    // 二次确认提交
    submitUserinfo() {
      console.log(this.passengerData);

      let data = {
        account: {
          id: this.accountId,
        },
        passenger: {
          id: this.passengerData.id, //类型：String  可有字段  备注：如果是修改请传入id
          name: this.passengerData.name, //类型：String  必有字段  备注：姓名
          card_type:
            this.passengerData.card_type === "中国居民身份证"
              ? "1"
              : this.passengerData.card_type === "港澳台居民居住证"
              ? "2"
              : this.passengerData.card_type === "护照"
              ? "B"
              : this.passengerData.card_type === "港澳居民来往内地通行证"
              ? "C"
              : this.passengerData.card_type === "台湾居民来往大陆通行证"
              ? "G"
              : this.passengerData.card_type === "外国人永久居留身份证"
              ? "H"
              : this.passengerData.card_type, //类型：String  必有字段  备注：证件类型
          card_no: this.passengerData.card_no, //类型：String  必有字段  备注：证件号
          phone: this.passengerData.phone, //类型：String  必有字段  备注：手机号
          sex: this.passengerData.sex, //类型：String  必有字段  备注：性别
          ticket_type:
            this.passengerData.ticket_type === "成人"
              ? "1"
              : this.passengerData.ticket_type === "儿童"
              ? "2"
              : this.passengerData.ticket_type === "学生"
              ? "3"
              : this.passengerData.ticket_type === "残疾军人"
              ? "4"
              : this.passengerData.ticket_type, //类型：String  必有字段  备注：乘客类型
        },
      };

      passenger.accountPassenger(data, this.pageType === "编辑").then((res) => {
        if (res.errorcode === 10000) {
          uni.showToast({
            title: "操作成功",
            icon: "none",
          });
          setTimeout(() => {
            uni.navigateBack();
            uni.setStorageSync("addPassenger", true);
          }, 1000);
        } else {
          uni.showToast({
            title: res.msg,
            duration: 2000,
            icon: "none",
          });
          this.$refs.returnSubmitDialog.close();
        }
        console.log(res);
      });

      console.log(data);
    },
  },

  onLoad(data) {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.pageType = data.type;
    this.accountId = data.accountId;
    if (data.passengerData) {
      let editPassenger = JSON.parse(data.passengerData);
      editPassenger.ticket_type =
        editPassenger.ticket_type === 1
          ? "成人"
          : editPassenger.ticket_type === 2
          ? "儿童"
          : editPassenger.ticket_type === 3
          ? "学生"
          : editPassenger.ticket_type === 4
          ? "残疾军人"
          : editPassenger.ticket_type;
      editPassenger.card_type =
        editPassenger.card_type === "1"
          ? "中国居民身份证"
          : editPassenger.card_type === "2"
          ? "港澳台居民居住证"
          : editPassenger.card_type === "B"
          ? "护照"
          : editPassenger.card_type === "C"
          ? "港澳居民来往内地通行证"
          : editPassenger.card_type === "G"
          ? "台湾居民来往大陆通行证"
          : editPassenger.card_type === "H"
          ? "外国人永久居留身份证"
          : editPassenger.card_type;
      this.passengerData = editPassenger;
    }

    console.log(this.passengerData);
  },
};
</script>

<style lang="less" scoped>
.account_passenger {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: rgba(243, 245, 247, 1);
  .passenger_box {
    padding: 20upx;

    .box_list {
      background: #ffffff;
      box-shadow: 0px 12upx 18upx rgba(0, 0, 0, 0.04);
      border-radius: 20upx;
      padding: 20upx 30upx 0;
      &:not(:last-child) {
        margin-bottom: 20upx;
      }
      .list_item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 28upx 0 32upx;
        &:not(:last-child) {
          border-bottom: 2upx solid #f1f3f5;
        }
        .item_title {
          font-size: 28upx;
          font-weight: bold;
          color: #2a2a2a;
        }
        .item_input {
          text-align: right;
          font-size: 28upx;
          font-weight: 400;
          color: #333333;
          .input_placeholder {
            font-size: 26upx;
            font-weight: 400;
            color: #afb9c4;
          }
        }
      }
    }
  }

  .submit_box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    padding: 28upx 40upx 26upx;
    margin-top: auto;
    .submit_btn {
      width: 100%;
      height: 90upx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32upx;
      font-weight: 400;
      letter-spacing: 4upx;
      border-radius: 80upx;
      background: linear-gradient(
        90deg,
        rgba(0, 112, 226, 1) 0%,
        rgba(86, 197, 255, 1) 100%
      );
      box-shadow: 0 6upx 12upx rgba(0, 112, 226, 0.3);
      color: rgba(255, 255, 255, 1);
      border-color: transparent;
    }
  }

  // 二次确认弹窗
  .return_submit {
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
    .retuen_content {
      background-color: #fff;
      padding: 48upx 20upx;
      .content_title {
        padding: 0 32upx 0 20upx;
        font-size: 24upx;
        font-weight: 500;
        color: rgba(0, 0, 0, 1);
        margin-bottom: 46upx;
        letter-spacing: 4upx;
        line-height: 34upx;

        text {
          color: #0070e2;
        }
      }
      .content_userinfo {
        background: rgba(243, 245, 247, 1);
        border-radius: 20upx;
        padding: 24upx 22upx;
        view {
          display: flex;
          width: 100%;
          justify-content: space-between;
          align-items: center;
          &:not(:last-child) {
            margin-bottom: 16upx;
          }
          text {
            font-size: 28upx;
            color: rgba(0, 0, 0, 1);
            &:first-child {
              font-weight: 400;
            }
            &:last-child {
              font-weight: bold;
            }
          }
        }
      }
    }
    .btn_box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #fff;
      padding: 0 40upx 26upx;
      .submit_btn {
        width: 320upx;
        height: 90upx;
        border: 2upx solid transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32upx;
        font-weight: 400;
        letter-spacing: 4upx;
        border-radius: 80upx;
        &.return_btn {
          color: rgba(0, 112, 226, 1);
          border-color: rgba(0, 112, 226, 1);
          background: #fff;
          box-shadow: none;
        }
        &.submit_post {
          background: linear-gradient(
            90deg,
            rgba(0, 112, 226, 1) 0%,
            rgba(86, 197, 255, 1) 100%
          );
          box-shadow: 0 6upx 12upx rgba(0, 112, 226, 0.3);
          color: rgba(255, 255, 255, 1);
          border-color: transparent;
        }
      }
    }
  }
}
</style>
