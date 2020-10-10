<!--
 * @Description: 乘机人列表
 * @Author: wish.WuJunLong
 * @Date: 2020-07-23 17:09:14
 * @LastEditTime: 2020-10-10 09:19:51
 * @LastEditors: wish.WuJunLong
--> 
<template>
  <view class="passenger">
    <yun-header
      :statusHeight="iStatusBarHeight"
      :centerTitle="passengerType ? '旅客管理' : '选择乘机人'"
    ></yun-header>
    <view class="header_box" v-if="!showDefault">
      <view class="add_passenger_btn" @click="jumpAddPassenger()">
        <image
          class="add_icon"
          src="@/static/add_passenger_btn.png"
          mode="contain"
        />
        <text>{{ passengerType ? "新增旅客" : "新增乘机人" }}</text>
      </view>
    </view>

    <view class="passenger_main" v-if="!showDefault">
      <view class="mian_header">
        <view class="title">常用乘机人</view>
        <view class="filter" @click="openGroupSelect">
          <text>{{ group.group_name ? group.group_name : "筛选" }}</text>
          <image
            class="filter_icon"
            src="@/static/arrow_bule.png"
            mode="contain"
          />
        </view>
      </view>

      <scroll-view
        :enable-back-to-top="true"
        :scroll-y="true"
        class="mian_list"
      >
        <uni-swipe-action :disabled="passengerType">
          <uni-swipe-action-item
            v-for="(item, index) in passengerList"
            :key="index"
          >
            <view class="list_item" @click="checkedPassenger(item, index)">
              <view class="checked" v-if="!passengerType">
                <radio :checked="item.checked" color="#0070E2" />
              </view>
              <view class="item_info">
                <view class="info_top">
                  <view class="type">{{ item.type }}</view>
                  <view class="user_name">{{
                    item.name || item.en_first_name + "/" + item.en_last_name
                  }}</view>
                  <view class="position">{{
                    item.group ? item.group : "未分组"
                  }}</view>
                </view>
                <view class="info_bottom">
                  <view class="bottom_title">{{ item.cert_type }}</view>
                  <view class="card">{{ item.cert_no }}</view>
                </view>
              </view>

              <view class="edit_btn" @click="jumpEditUserInfo(item)"></view>
            </view>
            <template v-slot:right>
              <view class="option_box">
                <view class="delete_btn" @click="removePassenger(item, index)">
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
      </scroll-view>
    </view>

    <default-page
      style="flex: 1"
      v-if="showDefault"
      @returnBtn="getTicketData()"
      :defaultType="showDefaultType"
    ></default-page>

    <!-- 筛选弹窗 -->
    <yun-selector
      ref="groupPopup"
      :dataItem="'group_name'"
      :dataList="groupList"
      :userSearch="true"
      @submitDialog="groupPopupSelecctBtn()"
      @userSearchBtn="userSearchBtn()"
    ></yun-selector>

    <!-- 姓名筛选弹窗 -->
    <yun-config
      ref="yunConfig"
      :showInput="true"
      :submitText="{ left: '取消', right: '确认' }"
      submitIndex="right"
      title="请输入姓名"
      @submitConfig="submitConfig"
    ></yun-config>

    <view class="submit_box" v-if="!passengerType && !showDefault">
      <button class="submit_btn" @click="returnBtn">确认</button>
    </view>
  </view>
</template>

<script>
import passenger from "@/api/passenger.js";
import moment from "moment";
moment.locale("zh-cn");
export default {
  data() {
    return {
      iStatusBarHeight: 0, // 状态栏高度

      showDefault: true, // 缺省页
      showDefaultType: "not_passenger", // 报错类型

      passengerType: true, // true个人中心跳入 false添加联系人跳入

      group: {}, // 分组筛选
      groupList: ["不限"], // 分组列表

      passengerList: [], // 乘机人列表

      checkePassenger: [], // 已选择乘客列表

      chdinfNumber: {}, // 航司规定乘客数量
      flightPassengerList: [], // 预定页面切换乘机人

      searchUserName: "", // 用户名筛选
    };
  },
  methods: {
    // 跳转新增乘机人
    jumpAddPassenger() {
      uni.navigateTo({
        url: "/pages/flightReservation/addPassenger",
      });
    },

    compare(property) {
      
     
    },

    /**
     * @Description: 获取旅客列表信息
     * @author Wish
     * @date 2020/8/14
     */
    getPassengerData(id) {
      let data;
      if (id) {
        data = {
          group_id: id,
        };
      }
      passenger.getPassenger(data).then((res) => {
        if (res.errorcode === 10000) {
          this.passengerList = res.data.data;

          this.passengerList.forEach((item) => {
            item.name = item.name?item.name:null
            item["type"] =
              moment().diff(item.birthday, "years") < 12 &&
              moment().diff(item.birthday, "years") >= 2
                ? "儿童"
                : moment().diff(item.birthday, "years") < 2
                ? "婴儿"
                : "成人";
          });

          let reg = /[a-zA-Z0-9]/;
          this.passengerList.sort((a,b) => {
            return reg.test(a.name) - reg.test(b.name)
          })


          if (this.flightPassengerList.length > 0) {
            this.checkePassenger = this.flightPassengerList;
            this.flightPassengerList.forEach((item, index) => {
              this.passengerList.forEach((oitem, oindex) => {
                if (item.id === oitem.id) {
                  this.passengerList[oindex].checked = true;
                }
              });
            });
          }
          this.showDefault = false;

          this.getGroupList();
        }
      });
    },

    // 跳转修改乘机人列表
    jumpEditUserInfo(val) {
      console.log(val);
      uni.navigateTo({
        url:
          "/pages/flightReservation/addPassenger?type=edit&data=" +
          JSON.stringify(val),
      });
    },

    // 删除乘机人
    removePassenger(val, i) {
      console.log(val);
      passenger.removePassenger(val.id).then((res) => {
        if (res.errorcode === 10000) {
          this.getPassengerData();
          uni.showToast({
            title: "删除成功",
            icon: "success",
          });
        } else {
          uni.showToast({
            title: res.msg,
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
          this.groupList.forEach((item) => {
            this.passengerList.forEach((oitem) => {
              if (oitem.group_id === item.id) {
                oitem["group"] = item.group_name;
              }
            });
          });
          this.groupList.unshift({ group_name: "不限" });
        } else {
          uni.showToast({
            title: "分组列表获取失败，" + res.msg,
            icon: "none",
          });
        }
      });
    },

    // 打开用户名筛选弹窗
    userSearchBtn() {
      console.log("打开弹窗");
      this.$refs.yunConfig.openConfigPopup();
    },

    // 用户名筛选
    submitConfig(val) {
      console.log(val);
      if (val) {
        let newArr = [];
        this.passengerList.forEach((item, index) => {
          let username = item.name + item.en_first_name + item.en_last_name;
          if (
            JSON.stringify(username)
              .toLowerCase()
              .indexOf(val.toLowerCase()) !== -1
          ) {
            newArr.push(item);
          }
        });
        this.passengerList = newArr;
      } else {
        this.getPassengerData();
      }
    },

    // 打开分组弹窗
    openGroupSelect() {
      this.$refs.groupPopup.openDialog();
    },
    // 确认分组
    groupPopupSelecctBtn(e) {
      this.$refs.yunConfig.inputValue = "";
      console.log(e);
      if (e.group_name !== "不限") {
        this.group = e;
        this.getPassengerData(e.id);
      } else {
        this.group = {};
        this.getPassengerData();
      }
    },

    // 选中乘机人
    checkedPassenger(data, index) {
      this.passengerList[index].checked = !this.passengerList[index].checked;
      if (this.passengerList[index].checked) {
        let info = this.passengerList[index];
        this.checkePassenger.push(info);
      } else {
        this.checkePassenger.splice(
          this.checkePassenger.findIndex((item) => item.id === data.id),
          1
        );
      }
    },

    // 确认乘机人
    returnBtn() {
      if (this.checkePassenger.length < 1) {
        return uni.showToast({
          title: "请选择乘机人",
          icon: "none",
          duration: 2000,
        });
      }

      let atdNumber = 0;
      let chdNumber = 0;
      let infNumber = 0;

      console.log(this.checkePassenger);

      this.checkePassenger.forEach((item) => {
        item['adtType'] = item.type === '成人'
        atdNumber = item.type === "成人" ? atdNumber + 1 : atdNumber;
        chdNumber = item.type === "儿童" ? chdNumber + 1 : chdNumber;
        infNumber = item.type === "婴儿" ? infNumber + 1 : infNumber;
      });
      if (
        (atdNumber === 0 && chdNumber > 0) ||
        (atdNumber === 0 && infNumber > 0)
      ) {
        return uni.showToast({
          title: "请至少选择一个成人",
          icon: "none",
          duration: 2000,
        });
      }
      if (JSON.stringify(this.chdinfNumber) !== "{}") {
        if (
          chdNumber !== 0 &&
          atdNumber * this.chdinfNumber.has_inf_cnn_number < chdNumber
        ) {
          return uni.showToast({
            title: "超出航司规定儿童人数",
            icon: "none",
            duration: 2000,
          });
        }
        if (
          infNumber !== 0 &&
          atdNumber * this.chdinfNumber.has_inf_inf_number < infNumber
        ) {
          return uni.showToast({
            title: "超出航司规定婴儿人数",
            icon: "none",
            duration: 2000,
          });
        }
      }

      this.checkePassenger.sort((a, b) => b.adtType - a.adtType)
      console.log('乘客类型排序',this.checkePassenger)

      uni.setStorageSync("passengerList", JSON.stringify(this.checkePassenger));
      uni.navigateBack();
    },
  },
  onShow() {
    if (uni.getStorageSync("addPassenger")) {
      console.log("新增返回");
      this.getPassengerData();
      uni.removeStorageSync("addPassenger");
    }
  },
  onLoad(data) {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.passengerType = data.type === "userInfo";
    this.chdinfNumber = data.chdinfNumber ? JSON.parse(data.chdinfNumber) : {};
    this.flightPassengerList = data.editPassengerList
      ? JSON.parse(data.editPassengerList)
      : [];

    // this.chdinfNumber = {
    //   air_line: "CA",
    //   cnn_number: 2,
    //   has_inf_cnn_number: 1,
    //   has_inf_inf_number: 1,
    // };
    console.log(this.chdinfNumber);
    this.getPassengerData();
  },
};
</script>

<style lang="less" scoped>
.passenger {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: rgba(243, 245, 247, 1);
  .header_box {
    padding: 27upx 0;
    background: rgba(0, 112, 226, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    .add_passenger_btn {
      border: 2upx solid rgba(255, 255, 255, 1);
      width: 710upx;
      height: 90upx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 90upx;
      font-size: 26upx;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      letter-spacing: 6upx;
      .add_icon {
        width: 35upx;
        height: 35upx;
        margin-right: 12upx;
      }
    }
  }
  .passenger_main {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    .mian_header {
      padding: 0 40upx;
      margin: 40upx 0 30upx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        font-size: 30upx;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
      }
      .filter {
        font-size: 24upx;
        font-weight: bold;
        color: rgba(0, 112, 226, 1);
        .filter_icon {
          width: 16upx;
          height: 12upx;
          object-fit: contain;
          margin-left: 14upx;
        }
      }
    }
    .mian_list {
      overflow-y: auto;
      height: 100%;
      flex: 1;
      .list_item {
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 12upx 18upx rgba(0, 0, 0, 0.04);
        border-radius: 20upx;
        padding: 28upx 40upx 40upx 20upx;
        margin: 0 20upx 20upx;
        display: flex;
        align-items: center;
        width: 100%;

        .checked {
          margin-right: 26upx;
          radio {
            transform: scale(0.7);
          }
        }

        .item_info {
          .info_top {
            display: flex;
            align-items: center;
            margin-bottom: 32upx;
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
          .info_bottom {
            display: flex;
            .bottom_title {
              font-size: 26upx;
              font-weight: 400;
              color: rgba(42, 42, 42, 1);
              margin-right: 24upx;
            }
            .card {
              font-size: 26upx;
              font-weight: 400;
              color: rgba(42, 42, 42, 1);
            }
          }
        }
        .edit_btn {
          background: url(@/static/edit_icon.png) no-repeat center center;
          background-size: contain;
          width: 30upx;
          height: 30upx;
          margin-left: auto;
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
}
</style>
