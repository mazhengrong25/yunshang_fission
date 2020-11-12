<!--
 * @Description: 新增乘机人
 * @Author: wish.WuJunLong
 * @Date: 2020-07-23 18:32:17
 * @LastEditTime: 2020-10-14 16:51:05
 * @LastEditors: wish.WuJunLong
--> 
<template>
  <view class="add_passenger">
    <yun-header
      :statusHeight="iStatusBarHeight"
      :headerBottom="Number(10)"
      :centerTitle="(pageType ? '编辑' : '新增') + '乘机人'"
    ></yun-header>
    <scroll-view
      :enable-back-to-top="true"
      :scroll-y="true"
      class="pssenger_main"
    >
      <view class="box-shadow-style">
        <view class="user_message_btn">
          <image
            class="user_message_btn_icon"
            src="@/static/add_passenger_icon.png"
            mode="contain"
          />
          <text>填写说明</text>
        </view>
        <view class="list_item">
          <view class="item_title">
            <text>中文姓名</text>
          </view>
          <input
            class="item_input"
            type="text"
            placeholder="与证件姓名一致"
            placeholder-class="input_placeholder"
            v-model="passenger.name"
          />
          <view
            class="checked_pinyin"
            v-if="addPassengerType"
            @click="switchPinyin()"
            >转拼音</view
          >
        </view>
        <view class="list_item" v-if="addPassengerType">
          <view class="item_title">
            <text class="title_tips">Surname</text>
            <text>姓（拼音）</text>
          </view>
          <view v-py="name"></view>
          <input
            class="item_input"
            type="text"
            placeholder="如Zhang"
            placeholder-class="input_placeholder"
            v-model="passenger.en_first_name"
          />
        </view>
        <view class="list_item" v-if="addPassengerType">
          <view class="item_title">
            <text class="title_tips">Given name</text>
            <text>名（拼音）</text>
          </view>
          <view v-py="name"></view>
          <input
            class="item_input"
            type="text"
            placeholder="如San"
            placeholder-class="input_placeholder"
            v-model="passenger.en_last_name"
          />
        </view>
        <view class="list_item">
          <view class="item_title">
            <text>手机号码</text>
            <!-- <view class="phone_numbering" @click="openAreaCodeSelect()">{{areaCode}}</view> -->
          </view>

          <input
            class="item_input"
            type="number"
            placeholder="用于接收航变信息"
            v-model="passenger.phone"
            placeholder-class="input_placeholder"
          />
        </view>
      </view>

      <uni-swipe-action>
        <uni-swipe-action-item
          v-for="(item, index) in certificateList"
          :key="index"
          @click="onClick()"
          :disabled="certificateList.length <= 1"
        >
          <view class="box-shadow-style certificate">
            <view
              class="certificate_number"
              v-if="certificateList.length > 1"
              >{{ index + 1 }}</view
            >
            <view class="list_item">
              <view class="item_title">
                <text>证件类型</text>
              </view>
              <view class="id_card_type" @click="openSelector(index)">
                <text>{{ item.cert_type }}</text>
              </view>
            </view>

            <view class="list_item">
              <view class="item_title">
                <text>证件号码</text>
              </view>

              <input
                class="item_input"
                :type="item.cert_type === '护照' ? 'text' : 'idcard'"
                placeholder="请保持与证件一致"
                v-model="item.cert_no"
                placeholder-class="input_placeholder"
                @blur="idRardGetBirthdy(item.cert_no,item.cert_type)"
              />
            </view>

            <view
              class="list_item input-right-arrow"
              v-if="item.cert_type === '护照'"
            >
              <view class="item_title">
                <text>证件有效期</text>
              </view>

              <view
                class="item_input"
                @click="
                  openBirthdaySelector(passenger.cert_ex_date, 'cardTime')
                "
              >
                <text v-if="passenger.cert_ex_date">{{
                  passenger.cert_ex_date
                }}</text>
                <text class="input_placeholder" v-else
                  >请选择证件有效截至日期</text
                >
              </view>
            </view>

            <view
              class="list_item input-right-arrow"
              v-if="item.cert_type === '护照'"
            >
              <view class="item_title">
                <text>证件签发国</text>
              </view>

              <view class="item_input" @click="notMessage">
                <text v-if="passenger.nationality">{{
                  passenger.nationality
                }}</text>
                <text class="input_placeholder" v-else>请选择证件签发国家</text>
              </view>
            </view>

            <view
              class="add_card"
              v-if="certificateList.length === index + 1 && !pageType"
              @click="addCertificate()"
              >+ 添加证件</view
            >
          </view>
          <template v-slot:right>
            <view class="option_box">
              <view class="delete_btn" @click="removeCertificate(item, index)">
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
      </uni-swipe-action>

      <view class="box-shadow-style">
        <view class="list_item input-right-arrow">
          <view class="item_title">
            <text>出生日期</text>
          </view>

          <view
            class="item_input"
            @click="openBirthdaySelector(passenger.birthday, 'birthday')"
          >
            <text v-if="passenger.birthday">{{ passenger.birthday }}</text>
            <text class="input_placeholder" v-else>请选择出生年月日</text>
          </view>
        </view>
        <view class="list_item input-right-arrow">
          <view class="item_title">
            <text>性别</text>
          </view>

          <view class="item_input" @click="openSexSelector()">
            <text>{{ passenger.sex }}</text>
          </view>
        </view>
      </view>

      <view class="box-shadow-style">
        <view class="list_item">
          <view class="item_title">
            <text>乘机人分组</text>
          </view>
          <view class="openGroup" @click="openGroupSelect">
            <text v-if="group.group_name">{{ group.group_name }}</text>
            <text v-else class="not_message">请选择分组</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 手机区号选择弹窗 -->
    <yun-selector
      ref="areaCodePopup"
      :dataList="areaCodeList"
      @submitDialog="areaCodeSelectBtn()"
    ></yun-selector>
    <!-- 乘客性别选择弹窗 -->
    <yun-selector
      ref="sexPopup"
      :dataList="sexList"
      @submitDialog="sexSelecctBtn()"
    ></yun-selector>
    <!-- 乘客出生日期选择框 -->
    <yun-selector
      ref="birthdayPopup"
      selectType="date"
      @submitDialog="birthdaySelecctBtn()"
    ></yun-selector>
    <!-- 证件类型选择弹窗 -->
    <yun-selector
      ref="selectorPopup"
      :dataList="certificateTypeList"
      @submitDialog="certificateSelecctBtn()"
    ></yun-selector>

    <!-- 添加分组弹窗 -->
    <uni-popup ref="addGroupPopup" type="dialog">
      <view class="add_group_box">
        <view class="box_title">新增分组</view>
        <input
          class="box_input"
          type="text"
          placeholder="请填写分组名称"
          placeholder-class="input_placeholder"
          v-model="addGroupName"
        />
        <view class="box_bottom">
          <view class="submit" @click="submitAddGroup">确 定</view>
          <view @click="closeAddGroup">取 消</view>
        </view>
      </view>
    </uni-popup>

    <!-- 分组选择弹窗 -->
    <yun-selector
      ref="groupPopup"
      :dataList="groupList"
      :dataItem="'group_name'"
      :addGroup="true"
      @submitDialog="groupPopupSelecctBtn()"
      @openAddGroup="openAddGroup()"
    ></yun-selector>
    <view class="submit_box">
      <button class="submit_btn" @click="returnBtn">保存</button>
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
            <text>若姓名证件号错误将影响登机，</text
            >请你仔细核对，确保信息与乘机证件一致
          </view>
          <view class="content_userinfo">
            <view>
              <text>姓名</text>
              <text>{{ passenger.name }}</text>
            </view>
            <view v-if="passenger.en_first_name || passenger.en_last_name">
              <text>Surname/Given name</text>
              <text
                >{{ passenger.en_first_name }}/{{
                  passenger.en_last_name
                }}</text
              >
            </view>
            <view v-for="(item, index) in certificateList" :key="index">
              <text>{{ item.cert_type }}</text>
              <text>{{ item.cert_no }}</text>
            </view>
          </view>
        </view>

        <view class="btn_box">
          <view class="submit_btn return_btn" @click="editUserinfo"
            >修改信息</view
          >
          <view class="submit_btn submit_post" @click="submitUserinfo"
            >确认保存</view
          >
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import pinyin from "js-pinyin/index.js";
import passenger from "@/api/passenger.js";
export default {
  data() {
    return {
      iStatusBarHeight: 0, // 状态栏高度

      pageType: false, // 页面状态 false新增，true编辑
      pageData: {}, // 修改数据

      addPassengerType: false, // 旅客状态 true国际， false国内

      flightEdit: false, // 航程预定内修改

      passenger: {
        sex: "男",
      },
      certificateList: [
        {
          // 证件信息
          cert_type: "身份证", // 证件类型
          cert_no: "", // 证件号码
        },
      ],

      checkedTimeType: "", // 时间选择器类型

      certificateIndex: "", // 更改证件类型下标

      certificateTypeList: ["身份证", "护照", "其他证件"], //证件类型列表

      areaCode: "+86", // 手机区号
      areaCodeList: ["+86", "+01", "+02", "+03"], // 手机区号列表
      areaCodeIndex: 0, // 手机区号下标

      sexList: ["男", "女"],

      group: {}, // 分组
      groupList: [], // 分组列表
      addGroupName: "", // 添加分组列表名称

      baseInfo: {},
    };
  },
  methods: {
    notMessage() {
      uni.showToast({
        title: "国际功能开发中，请等待后续版本更新",
        icon: "none",
        duration: 3000,
      });
    },

    // 姓名转拼音
    switchPinyin() {
      let name = this.passenger.name;
      this.$set(this.passenger, "en_first_name", pinyin.getFullChars(name[0]));
      this.$set(
        this.passenger,
        "en_last_name",
        pinyin.getFullChars(name.substr(1))
      );
      this.$forceUpdate();
      console.log(this.passenger);
    },

    // 打开手机区号选择弹窗
    openAreaCodeSelect() {
      this.$refs.areaCodePopup.openDialog();
    },
    // 选择手机区号
    areaCodeSelectBtn(e) {
      this.areaCode = e;
    },

    // 打开性别选择框
    openSexSelector() {
      this.$refs.sexPopup.openDialog();
    },
    // 确认性别
    sexSelecctBtn(e) {
      console.log(e)
      if(this.baseInfo.sex && (e !== this.baseInfo.sex)){
          uni.showModal({
            title: '提示',
            content: '当前选择性别与身份证性别不相同',
            success: (res) => {
                if (res.confirm) {
                  this.baseInfo.sex = e;
                  this.passenger.sex = e
                  this.$forceUpdate()
                } else if (res.cancel) {
                    this.baseInfo.sex = this.baseInfo.sex;
                    this.passenger.sex = this.baseInfo.sex;
                    this.$forceUpdate()
                }
            }
          });
        }else{
          this.passenger.sex = e;
          this.baseInfo.sex = e
        }

    },

    // 打开出生日期选择框
    openBirthdaySelector(data, type) {
      this.checkedTimeType = type;
      this.$refs.birthdayPopup.openDialog();
    },
    // 确认出生日期 || 证件有效期
    birthdaySelecctBtn(e) {
      console.log(e);
      let time = e.year + "-" + e.month + "-" + e.day;
      if (this.checkedTimeType === "birthday") {
        this.$set(this.passenger, "birthday", time);
        
        // 判断是否通过身份证判断出出生日期 如果有则判断身份证日期与选中日期是否相同 并 弹窗提示 确定则使用选择器生日，取消则使用身份证生日
        if(this.baseInfo.birthday && (this.passenger.birthday !== this.baseInfo.birthday)){
          uni.showModal({
            title: '提示',
            content: '当前选择生日与身份证生日不相同',
            success: (res) => {
              console.log(this.passenger.birthday ,this.baseInfo.birthday)
                if (res.confirm) {
                  this.baseInfo.birthday = time;
                  this.$forceUpdate()
                } else if (res.cancel) {
                    this.baseInfo.birthday = this.baseInfo.birthday;
                    this.passenger.birthday = this.baseInfo.birthday;
                    this.$forceUpdate()
                }
            }
          });
        }

        

      } else if (this.checkedTimeType === "cardTime") {
        this.$set(this.passenger, "cert_ex_date", time);
      }
    },

    // 打开证件类型选择框
    openSelector(index) {
      this.certificateIndex = index;
      this.$refs.selectorPopup.openDialog();
    },
    // 确认证件类型
    certificateSelecctBtn(e) {
      console.log("确认证件类型", e);
      this.certificateList[this.certificateIndex].cert_type = e;
      this.certificateList.forEach((item) => {
        if (item.cert_type === "护照") {
          this.addPassengerType = true; // 添加国际旅客状态
        } else {
          this.addPassengerType = false;
          this.passenger.en_first_name = "";
          this.passenger.en_last_name = "";
        }
      });
    },


    // 身份证转出生日期
    idRardGetBirthdy(id,type){
      if(type === '身份证'){
        if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(id)) {
          return uni.showToast({
            title: "身份证号码不正确",
            duration: 2000,
            icon: "none",
          });
        } else {
          this.validID(id, type);
        }
      }
      
    },

    // 身份证验证
    async validID(value, type) {
        // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
        let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (reg.test(value)) {
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

      if (sex % 2 === 0) sex = '女';
      else sex = '男';
      this.baseInfo["sex"] = sex; //性别  1男 0女
      this.baseInfo["age"] = age; //年龄
      this.baseInfo["birthday"] = birth; //生日

      this.passenger.birthday = birth; //生日
      this.passenger.sex = sex;

      console.log(this.baseInfo);

      this.$forceUpdate()
    },

    // 打开添加分组弹窗
    openAddGroup() {
      this.$refs.addGroupPopup.open();
      this.$refs.groupPopup.closeDialog();
    },
    // 取消添加分组
    closeAddGroup() {
      this.$refs.addGroupPopup.close();
      this.addGroupName = "";
      this.openGroupSelect();
    },
    // 确认添加分组
    submitAddGroup() {
      if (!this.addGroupName) {
        return uni.showToast({
          title: "请填写分组名",
          icon: "none",
        });
      }
      let data = {
        group_name: this.addGroupName,
      };
      passenger.addGroup(data).then((res) => {
        if (res.errorcode === 10000) {
          uni.showToast({
            title: "添加成功",
            icon: "success",
          });
          this.getGroupList();
          this.closeAddGroup();
        } else {
          uni.showToast({
            title: "添加分组失败，" + res.msg,
            icon: "none",
          });
        }
      });
    },

    // 获取分组列表
    getGroupList() {
      passenger.getGroup().then((res) => {
        if (res.errorcode === 10000) {
          this.groupList = res.data.data;
        } else {
          uni.showToast({
            title: "分组列表获取失败，" + res.msg,
            icon: "none",
          });
        }
      });
    },

    // 打开分组弹窗
    openGroupSelect() {
      this.$refs.groupPopup.openDialog();
    },
    // 确认分组
    groupPopupSelecctBtn(e) {
      console.log(e);
      this.group = e;
    },

    // 添加证件
    addCertificate() {
      this.certificateList.push({
        cert_type: "身份证", // 证件类型
        cert_no: "", // 证件号码
      });
    },

    // 删除证件
    removeCertificate(val, i) {
      console.log(val, i);
      this.certificateList.splice(i, 1);
      this.certificateList.forEach((item) => {
        if (item.cert_type === "护照") {
          this.addPassengerType = true; // 添加国际旅客状态
        } else {
          this.addPassengerType = false;
          this.passenger.en_first_name = "";
          this.passenger.en_last_name = "";
        }
      });
    },

    // 保存按钮 输入验证
    returnBtn() {
      if (
        !this.passenger.name ||
        !this.passenger.phone ||
        // !this.passenger.birthday ||
        !this.certificateList[0].cert_no
      ) {
        return uni.showToast({
          title: "请将信息填写完整再进行保存",
          icon: "none",
        });
      }

      if (!/^1[3456789]\d{9}$/.test(this.passenger.phone)) {
        return uni.showToast({
          title: "手机号码格式错误，请检查是否填写正确",
          icon: "none",
        });
      }

      // if (!this.group.id) {
      //   return uni.showToast({
      //     title: "请选择分组",
      //     icon: "none",
      //   });
      // }
      this.certificateList.forEach((item, index) => {
        if (!item.cert_no) {
          this.certificateList.splice(index, 1);
        }
      });

      
        this.$refs.returnSubmitDialog.open();

      this.$forceUpdate();
    },

    // 二次确认信息取消
    editUserinfo() {
      this.$refs.returnSubmitDialog.close();
    },
    // 二次确认信息提交
    submitUserinfo() {
      this.certificateList.forEach((item) => {
        // console.log(this.passenger);
        // JSON.parse(JSON.stringify(this.passenger))
        let data = {
          name: this.passenger.name,
          phone: this.passenger.phone,
          sex: this.baseInfo.sex === '男'? 1: 0,
          birthday: this.baseInfo.birthday,
          cert_type: item.cert_type,
          cert_no: item.cert_no,
          group_id: this.group.id || 0,
          group: this.group.group_name || "",
          nationality: "CN",
          en_first_name: this.passenger.en_first_name || "",
          en_last_name: this.passenger.en_last_name || "",
        };
        // data.sex = this.baseInfo.sex;
        // data["cert_type"] = item.cert_type;
        // data["cert_no"] = item.cert_no;
        // data["group_id"] = this.group.id;
        // data["group"] = this.group.group_name;
        // data["nationality"] = "CN";
        // if (item.cert_type !== "护照") {
        //   delete data.en_first_name;
        //   delete data.en_last_name;
        // }

        console.log(data);

        if (this.pageType) {
          // 编辑乘机人
          passenger.editPassenger(data, this.pageData.id).then((res) => {
            if (res.errorcode === 10000) {
              uni.showToast({
                title: "修改成功",
                icon: "success",
              });
              setTimeout(() => {
                uni.navigateBack();
                uni.setStorageSync("addPassenger", true);
              }, 500);
              if (this.flightEdit) {
                uni.setStorageSync("editPassengerList", JSON.stringify(data));
              }
            } else {
              uni.showToast({
                title: res.msg,
                icon: "none",
              });
            }
          });
        } else {
          // 新增乘机人
          passenger.addPassenger(data).then((res) => {
            if (res.errorcode === 10000) {
              uni.showToast({
                title: "添加成功",
                icon: "success",
              });
              setTimeout(() => {
                uni.navigateBack();
                uni.setStorageSync("addPassenger", true);
              }, 500);
            } else {
              uni.showToast({
                title: res.msg,
                icon: "none",
              });
            }
          });
        }
      });
    },
  },

  onLoad(val) {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.flightEdit = val.status ? true : false;
    console.log(val.type);
    if (val.type === "edit") {
      this.pageType = val.type === "edit";
      this.pageData = JSON.parse(val.data);
      this.addPassengerType = this.pageData.cert_type === "护照";
      this.passenger = {
        name: this.pageData.name, // 用户名
        en_first_name: this.pageData.en_first_name, // 拼音姓
        en_last_name: this.pageData.en_last_name, // 拼音名
        phone: this.pageData.phone, // 手机号
        birthday: this.pageData.birthday,
        sex: this.pageData.sex === 1 ? "男" : "女",
        id: this.pageData.id,
        type: this.pageData.type,
        checked: this.pageData.checked || false,
      };
      this.baseInfo = {
        birthday: this.pageData.birthday,
        sex: this.pageData.sex === 1 ? "男" : "女", 
      }


      this.certificateList[0] = {
        cert_type: this.pageData.cert_type, // 证件类型
        cert_no: this.pageData.cert_no, // 证件号码
      };
      this.group = {
        group_name: this.pageData.group,
        id: this.pageData.group_id,
      };


    }
    console.log(this.passenger);

    this.getGroupList(); // 获取分组列表
  },
};
</script>

<style lang="less" scoped>
.add_passenger {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: rgba(243, 245, 247, 1);
  .pssenger_main {
    flex: 1;
    overflow-y: auto;
    padding-bottom: 20upx;
    .box-shadow-style {
      &:not(:last-child) {
        margin-bottom: 20upx;
      }
    }

    .user_message_btn {
      font-size: 20upx;
      font-weight: 400;
      color: rgba(42, 42, 42, 1);
      margin-bottom: 52upx;
      display: flex;
      align-items: center;
      .user_message_btn_icon {
        width: 20upx;
        height: 20upx;
        object-fit: contain;
        margin-right: 6upx;
      }
    }
    .list_item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      &:not(:last-child) {
        padding-bottom: 12upx;
        margin-bottom: 28upx;
        border-bottom: 2upx solid #f1f3f5;
      }
      .checked_pinyin {
        width: 120upx;
        height: 44upx;
        border: 2upx solid rgba(0, 112, 226, 1);
        border-radius: 22upx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24upx;
        font-weight: 400;
        color: rgba(0, 112, 226, 1);
        margin-left: 20upx;
      }
      .item_title {
        font-size: 28upx;
        font-weight: bold;
        color: rgba(42, 42, 42, 1);
        flex-shrink: 0;
        margin-right: 20upx;
        display: inline-flex;
        align-items: flex-start;
        flex-direction: column;
        .title_tips {
          white-space: nowrap;
          font-size: 26upx;
          font-weight: 400;
          color: rgba(42, 42, 42, 1);
        }
        .phone_numbering {
          display: inline-flex;
          align-items: center;
          margin-left: 20upx;
          font-size: 13px;
          font-weight: 400;
          color: rgba(42, 42, 42, 1);
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
      }
      .id_card_type {
        font-size: 28upx;
        font-weight: 400;
        color: rgba(42, 42, 42, 1);
        display: inline-flex;
        align-items: center;
        &::after {
          content: "";
          background: url("@/static/arrow.png") no-repeat center center;
          background-size: contain;
          width: 12upx;
          height: 20upx;
          display: block;
          margin-left: 14upx;
        }
      }
      .item_input {
        font-size: 28upx;
        font-weight: 400;
        text-align: right;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }

      .openGroup {
        font-size: 28upx;
        font-weight: 400;
        color: #333;
        display: inline-flex;
        align-items: center;
        .not_message {
          color: rgba(175, 185, 196, 1);
        }
        &::after {
          content: "";
          background: url("@/static/arrow.png") no-repeat center center;
          background-size: contain;
          width: 12upx;
          height: 20upx;
          display: block;
          margin-left: 14upx;
        }
      }
    }

    .certificate {
      position: relative;
      padding-top: 54upx;
      width: 100%;
      .certificate_number {
        position: absolute;
        left: 0;
        top: 0;
        width: 50upx;
        height: 36upx;
        background: rgba(0, 112, 226, 0.2);
        border-radius: 20upx 0 20upx 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 24upx;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
      }
      .add_card {
        text-align: center;
        font-size: 30upx;
        font-weight: bold;
        color: rgba(0, 112, 226, 1);
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

  .submit_box {
    background: rgba(255, 255, 255, 1);
    height: 100upx;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 24upx;
    padding-bottom: var(--status-bar-height);
    border-top: 2upx solid rgba(229, 229, 229, 1);
    .submit_btn {
      flex: 1;
      height: 90upx;
      margin: 0 50upx;
      background: linear-gradient(
        90deg,
        rgba(0, 112, 226, 1) 0%,
        rgba(86, 197, 255, 1) 100%
      );
      box-shadow: 0 6upx 12upx rgba(0, 112, 226, 0.3);
      border-radius: 80upx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32upx;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      letter-spacing: 10upx;
    }
  }

  .add_group_box {
    width: 540upx;
    height: 330upx;
    background: rgba(255, 255, 255, 1);
    border-radius: 20upx;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding-top: 36upx;
    .box_title {
      font-size: 36upx;
      font-weight: bold;
      color: rgba(42, 42, 42, 1);
      text-align: center;
      margin-bottom: 18upx;
    }
    .box_input {
      height: 80upx;
      background: rgba(243, 245, 247, 1);
      margin: 0 20upx;
      padding: 0 22upx;
    }
    .box_bottom {
      margin-top: auto;
      display: flex;
      align-items: center;
      height: 90upx;
      view {
        flex: 1;
        background: rgba(0, 112, 226, 0.1);
        font-size: 28upx;
        font-weight: 400;
        color: rgba(0, 112, 226, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        &.submit {
          background: rgba(0, 112, 226, 1);
          color: rgba(255, 255, 255, 1);
        }
      }
    }
  }

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
