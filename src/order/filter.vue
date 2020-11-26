<!--
 * @Description: 订单筛选页面
 * @Author: wish.WuJunLong
 * @Date: 2020-08-17 10:31:20
 * @LastEditTime: 2020-11-26 09:23:39
 * @LastEditors: wish.WuJunLong
-->
<template>
  <view class="filter">
    <yun-header
      :statusHeight="iStatusBarHeight"
      centerTitle="筛选"
    ></yun-header>

    <scroll-view
      :enable-back-to-top="true"
      :scroll-y="true"
      class="filter_main"
    >
      <view class="list_item" v-if="filterType === '0'">
        <view class="item_title">日期条件</view>
        <view class="item_content item_checkbox">
          <view
            :class="['checkbox_item', { active: item.active }]"
            v-for="item in dateFilter"
            :key="item"
            @click="activeDate(item)"
            >{{ item.name }}</view
          >
        </view>
      </view>

      <view class="list_item" v-if="filterType === '1'">
        <view class="item_title">退票状态</view>
        <view class="item_content item_checkbox">
          <view
            :class="['checkbox_item', { active: item.active }]"
            v-for="item in refundFilter"
            :key="item"
            @click="activeRefundFilter(item)"
            >{{ item.name }}</view
          >
        </view>
      </view>

      <view class="list_item" v-if="filterType === '2'">
        <view class="item_title">订单状态</view>
        <view class="item_content item_checkbox">
          <view
            :class="['checkbox_item', { active: item.active }]"
            v-for="item in changeFilter"
            :key="item"
            @click="activeChangeFilter(item)"
            >{{ item.name }}</view
          >
        </view>
      </view>

      <view class="list_item" v-if="filterType === '0'">
        <view class="item_title">订单状态</view>
        <view class="item_content item_checkbox">
          <view
            :class="['checkbox_item', { active: item.active }]"
            v-for="item in orderStatus"
            :key="item"
            @click="activeOrderStatus(item)"
            >{{ item.name }}</view
          >
        </view>
      </view>

      <view class="list_item">
        <view class="item_title">时间范围</view>
        <view class="item_content item_dialog">
          <view
            v-if="filterType === '0'"
            :class="['dialog_view', { input_placeholder: !timeLimit.start }]"
            @click="openlimitdaySelector('start')"
            >{{ timeLimit.start ? timeLimit.start : "预定日始" }}</view
          >
          <view
            v-if="filterType === '1'"
            :class="['dialog_view', { input_placeholder: !refundTime.start }]"
            @click="openlimitdaySelector('start')"
          >{{refundTime.start?refundTime.start:'申请日始'}}</view>
           <view v-if="filterType === '2'"
            :class="['dialog_view',{input_placeholder: !changeTime.start}]"
            @click="openlimitdaySelector('start')"
          >{{changeTime.start?changeTime.start:'申请日始'}}</view>
          <view class="dialog_line">—</view>
          <view
            v-if="filterType === '0'"
            :class="['dialog_view', { input_placeholder: !timeLimit.end }]"
            @click="openlimitdaySelector('end')"
            >{{ timeLimit.end ? timeLimit.end : "预定日止" }}</view
          >
          <view
            v-if="filterType === '1'"
            :class="['dialog_view', { input_placeholder: !refundTime.end }]"
            @click="openlimitdaySelector('end')"
          >{{refundTime.end?refundTime.end:'申请日止'}}</view>
          <view v-if="filterType === '2'"
            :class="['dialog_view',{input_placeholder: !changeTime.end}]"
            @click="openlimitdaySelector('end')"
          >{{changeTime.end?changeTime.end:'申请日止'}}</view>
        </view>
      </view>

      <view class="list_item" v-if="filterType === '1'">
        <view class="item_title">乘客类型</view>
        <view class="item_content item_checkbox">
          <view
            :class="['checkbox_item', { active: item.active }]"
            v-for="item in passengerFilter"
            :key="item"
            @click="activeDate(item, 'passenger')"
            >{{ item.name }}</view
          >
        </view>
      </view>

      <view class="list_item" v-if="filterType === '2'">
        <view class="item_title">乘客类型</view>
        <view class="item_content item_checkbox">
          <view
            :class="['checkbox_item', { active: item.active }]"
            v-for="item in passengerChangeFilter"
            :key="item"
            @click="activeDate(item,'change_passenger')"
          >{{item.name}}</view>
        </view>
      </view>

      <view class="list_item" v-if="filterType === '1'">
        <view class="item_title">订单类型</view>
        <view class="item_content item_checkbox">
          <view
            :class="['checkbox_item', { active: item.active }]"
            v-for="item in orderFilter"
            :key="item"
            @click="activeDate(item, 'orderType')"
            >{{ item.name }}</view
          >
        </view>
      </view>

      <view class="list_item" v-if="filterType === '0'">
        <view class="item_title">城市选择</view>
        <view class="item_content item_dialog">
          <view
            :class="['dialog_view', { input_placeholder: !citySelect.start }]"
            @click="whereToBtn()"
            >{{
              citySelect.start.type === "city"
                ? citySelect.start.data.city_name
                : citySelect.start.type === "hot" &&
                  citySelect.start.data.city_name === "上海"
                ? citySelect.start.data.city_name +
                  citySelect.start.data.air_port_name
                : citySelect.start.type === "hot" &&
                  citySelect.start.data.city_name === "北京"
                ? citySelect.start.data.city_name + "首都"
                : citySelect.start.type === "hot"
                ? citySelect.start.data.city_name
                : citySelect.start.data.air_port_name || "出发城市"
            }}</view
          >
          <view class="dialog_line">—</view>
          <view
            :class="['dialog_view', { input_placeholder: !citySelect.end }]"
            @click="whereFromBtn()"
            >{{
              citySelect.end.type === "city"
                ? citySelect.end.data.city_name
                : citySelect.end.type === "hot" &&
                  citySelect.end.data.city_name === "上海"
                ? citySelect.end.data.city_name +
                  citySelect.end.data.air_port_name
                : citySelect.end.type === "hot" &&
                  citySelect.end.data.city_name === "北京"
                ? citySelect.end.data.city_name + "首都"
                : citySelect.end.type === "hot"
                ? citySelect.end.data.city_name
                : citySelect.end.data.air_port_name || "到达城市"
            }}</view
          >
        </view>
      </view>

      <view
        class="list_item list_input"
        v-if="filterType === '0' || filterType === '2'"
      >
        <view class="item_title">订单号</view>
        <input
          type="text"
          class="item_input"
          v-model="orderNumber"
          placeholder="请填写订单号"
          placeholder-class="input_placeholder"
        />
      </view>

      <view class="list_item list_input">
        <view class="item_title">票号</view>
        <input
          type="text"
          class="item_input"
          v-model="ticket_Number"
          placeholder="请填写票号"
          placeholder-class="input_placeholder"
        />
      </view>

      <view class="list_item list_input">
        <view class="item_title">PNR</view>
        <input
          type="text"
          class="item_input"
          v-model="pnr"
          placeholder="请填写PNR"
          placeholder-class="input_placeholder"
        />
      </view>
      <view class="list_item list_input" v-if="filterType === '0'">
        <view class="item_title">航班号</view>
        <input
          type="text"
          class="item_input"
          v-model="flightNumber"
          placeholder="请填写航班号"
          placeholder-class="input_placeholder"
        />
      </view>

      <view
        class="list_item list_input"
        v-if="filterType === '1' || filterType === '2'"
      >
        <view class="item_title">乘机人</view>
        <input
          type="text"
          class="item_input"
          v-model="flightPassenger"
          placeholder="请填写乘机人"
          placeholder-class="input_placeholder"
        />
      </view>

      <view class="list_item list_input" v-if="filterType === '1'">
        <view class="item_title">申请人</view>
        <input
          type="text"
          class="item_input"
          v-model="flightApplicant"
          placeholder="请填写申请人"
          placeholder-class="input_placeholder"
        />
      </view>
    </scroll-view>

    <!-- 选择日期 -->
    <yun-selector
      ref="limitdayPopup"
      selectType="date"
      @submitDialog="limitdaySelecctBtn()"
    ></yun-selector>
    <!-- 订票员选择 -->
    <flight-filter-dialog
      ref="filterDialog"
      @ticketFilterData="submitFilterBtn"
      :flightType="false"
      :checkboxGroup="nameGroup"
    ></flight-filter-dialog>

    <!-- 按钮组 -->
    <view class="filter_bottom">
      <view class="bottom_btn reset_btn" @click="resetBtn">重置</view>

      <button
        :class="['bottom_btn submit_btn', { disabled: submitBtnStatus }]"
        :disabled="submitBtnStatus"
        @click="yesBtn"
      >
        确定
      </button>
    </view>
  </view>
</template>

<script>
import flightFilterDialog from "@/components/flight_filter_dialog.vue"; // 航班筛选弹窗
import refundListVue from './refundList.vue';
export default {
  components: {
    flightFilterDialog,
  },
  data() {
    return {
      iStatusBarHeight: 0,

      filterType: "", //筛选类型  国内外  国内退票 国内改签  依次为0 1  2

      submitBtnStatus: false, // 确认按钮状态

      dateFilter: [
        // 日期条件筛选列表
        {
          name: "预定日期",
          active: false,
        },
        {
          name: "起飞时间",
          active: false,
        },
      ],

      refundFilter: [
        //退票状态筛选列表
        {
          name: "申请中",
          id: 1,
          active: false,
        },
        {
          name: "成功",
          id: 2,
          active: false,
        },
        {
          name: "已取消",
          id: 3,
          active: false,
        },
      ],

      changeFilter: [
        //改签状态筛选列表
        {
          name: "申请中",
          id: 1,
          active: false,
        },
        {
          name: "待支付",
          id: 2,
          active: false,
        },
        {
          name: "待出票",
          id: 3,
          active: false,
        },
        {
          name: "已完成",
          id: 4,
          active: false,
        },
      ],

      passengerFilter: [
        //乘客类型筛选列表
        {
          name: "成人",
          value: "ADT",
          active: false,
        },
        {
          name: "儿童",
          value: "CNN",
          active: false,
        },
        {
          name: "婴儿",
          value: "INF",
          active: false,
        },
      ],

      passengerChangeFilter: [
        // 改签列表
        {
          name: "成人",
          value: "ADT",
          active: false,
        },
        {
          name: "儿童",
          value: 'CHD',
          active:false,
        },
        {
          name: "婴儿",
          value: "INF",
          active: false,
        },
      ],

      orderFilter: [
        // 订单类型筛选列表
        {
          name: "客户单",
          id: 0,
          active: false,
        },
        {
          name: "手工单",
          id: 1,
          active: false,
        },
      ],

      orderStatus: [
        // 订单状态筛选列表  id对应导航栏位置
        {
          name: "已预订",
          id: 1,
          active: false,
        },
        {
          name: "待出票",
          id: 2,
          active: false,
        },
        {
          name: "已出票",
          id: 3,
          active: false,
        },
        {
          name: "已取消",
          id: 4,
          active: false,
        },
      ],
      timeLimit: {
        // 时间范围
        start: "",
        end: "",
      },
      // 退票申请时间开始结束
      refundTime: {
        start: "",
        end: "",
      },
      // 改签申请时间开始结束
      changeTime: {
        start:"",
        end:"",
      },
      citySelect: {
        // 城市选择
        start: "",
        end: "",
      },
      airMessage: {
        to: {},
        from: {},
        toTime: {},
      },
      nameGroup: [
        //订票员选择
        "马冬梅",
        "欧阳娜娜",
        "Lisa",
        "GD",
      ],

      pnr: "", // pnr
      orderNumber: "", // 订单号
      flightNumber: "", // 航班号
      booker: "", // 订票员

      dateType: "", // 日期选择类型

      activeStatus: null, // 订单状态
      dateStatus: null, //  日期状态
      passengerStatus: null, //乘客状态
      orderType: null, //订单状态

    //改签筛选
    changeStatus: null, //改签订单状态
    changePassengerStatus:null, //乘客类型

    
    };
  },
  methods: {
    // 条件选择
    activeDate(val, type) {
      if (this.filterType === "0") {
        // 日期选择
        this.dateFilter.forEach((item) => {
          console.log(val);
          if (item.name === val.name) {
            item.active = !val.active;
            this.dateStatus = item.active
              ? item.name === "起飞时间"
                ? "depart"
                : item.name === "预定日期"
                ? "create"
                : ""
              : null;
          } else {
            item.active = false;
          }
        });
      } else if (this.filterType === "1") {
        if (type === "passenger") {
          // 乘客状态
          this.passengerFilter.forEach((item) => {
            if (item.name === val.name) {
              item.active = !val.active;
              this.passengerStatus = item.active ? val.value : null;
            } else {
              item.active = false;
            }
          });
        } else if (type === "orderType") {
          // 订单状态
          this.orderFilter.forEach((item) => {
            if (item.name === val.name) {
              item.active = !val.active;
              this.orderType = item.active ? val.id : null;
            } else {
              item.active = false;
            }
          });
        }
            
      }else if(this.filterType === "2") {


          if(type === "change_passenger"){

            // 乘客状态
            this.passengerChangeFilter.forEach((item) => {
              if (item.name === val.name) {
                item.active = !val.active;
                this.changePassengerStatus = item.active?val.value: null
              } else {
                item.active = false;
              }
            }); 
          }
      }
    },
    // 订单状态选择  国内订单
    activeOrderStatus(val) {
      this.orderStatus.forEach((item) => {
        if (item.name === val.name) {
          item.active = !val.active;
          this.activeStatus = item.active ? val.id : null;
        } else {
          item.active = false;
        }
      });
    },

    // 订单状态   退票列表
    activeRefundFilter(val) {
      this.refundFilter.forEach((item) => {
        if (item.name === val.name) {
          item.active = !val.active;
          this.refundStatus = item.active ? val.id : null;
        } else {
          item.active = false;
        }
      });
    },

    // 订单状态  改签列表
    activeChangeFilter(val) {
      this.changeFilter.forEach((item) => {
        if (item.name === val.name) {
          item.active = !val.active;
          this.changeStatus = item.active ? val.id : null;
        } else {
          item.active = false;
        }
      });
    },

    // 重置筛选
    resetBtn() {
      this.dateFilter.forEach((item) => (item.active = false));
      this.orderStatus.forEach((item) => (item.active = false));
      this.timeLimit.start = "";
      this.timeLimit.end = "";
      this.citySelect.start = "";
      this.citySelect.end = "";
      this.pnr = "";
      this.orderNumber = "";
      this.flightNumber = "";
      this.booker = "";

      // 退票筛选
      this.refundFilter.forEach((item) => (item.active = false));
      this.refundStatus=null;
      this.flightPassenger = "";  // 乘机人
      this.flightApplicant = "";  // 申请人
      this.ticket_Number = "";  // 票号
      this.refundTime.start = ""; //时间范围
      this.refundTime.end = "";
      this.orderType = ""; // 客户单  手工单
      this.passengerStatus = ""; // 旅客类型
      let data = {}

      // 改签筛选
      this.changeFilter.forEach((item) => (item.active = false));
      this.changeStatus=null;
      this.changePassengerStatus = ""; //乘客类型
      this.changeTime.start = ""; //时间范围
      this.changeTime.end = "";
      this.ticket_Number = "";  // 票号
      this.flightPassenger = "";  // 乘机人
    

      uni.setStorageSync('orderListFilter',JSON.stringify(data));
      uni.navigateBack();
    },

    // 确定筛选
    yesBtn() {
       
      let data 
      // let change_data
      // 国内列表筛选
      if (this.filterType === "0") {
        data = {
          pnr: this.pnr, //pnr
          orderNumber: this.orderNumber, //订单号
          flightNumber: this.flightNumber, // 航班号
          booker: this.booker, //订票员
          Citystart: this.citySelect.start, //出发城市
          Cityend: this.citySelect.end, //到达城市
          Timestart: this.timeLimit.start, //日始时间
          Timend: this.timeLimit.end, //日止时间
          status: this.activeStatus, // 订单状态
          date: this.dateStatus, //日期条件
        };
      } else if (this.filterType === "1") {
        // 国内退票筛选
        data = {
          // admin_name: this.flightApplicant, // 申请人
          passenger_name: this.flightPassenger, // 乘机人
          order_status: this.refundStatus, // 订单状态
          ticket_no: this.ticket_Number, // 票号
          pnr: this.pnr, //pnr
          start_date: this.refundTime.start, //申请日始
          end_date: this.refundTime.end, //申请日止
          passenger_type: this.passengerStatus, // 旅客类型
          order_type: this.orderType, // 客户单  手工单
        };
      } else if (this.filterType == "2") {
        //改签筛选
        data = {
          change_status: this.changeStatus, //订单状态
          passengerType: this.changePassengerStatus, //乘客类型
          ticketNumber: this.ticket_Number, //票号
          pnrNumber: this.pnr, //pnr
          orderNumber: this.orderNumber, // 订单号
          passengerName: this.flightPassenger, //乘机人
          Timestart: this.changeTime.start, //申请日始
          Timend: this.changeTime.end, //申请日止
         
        }
      }
      
      uni.setStorageSync('orderListFilter',JSON.stringify(data));
      uni.navigateBack(); 

      
    },

    // 打开时间范围日期选择框
    openlimitdaySelector(type) {
      this.dateType = type;
      this.$refs.limitdayPopup.openDialog();
    },

    // 确认时间范围
    limitdaySelecctBtn(e) {
      console.log(e);
      let start =
        e.year +
        "-" +
        (e.month < 10 ? "0" + e.month : e.month) +
        "-" +
        (e.day < 10 ? "0" + e.day : e.day);

      if (this.dateType === "end" && this.timeLimit.start) {
        if (
          new Date(start).getTime() < new Date(this.timeLimit.start).getTime()
        ) {
          return uni.showToast({
            title: "请选择大于起始时间",
            icon: "none",
          });
        }
      } else if (this.dateType === "start" && this.timeLimit.end) {
        if (
          new Date(start).getTime() > new Date(this.timeLimit.end).getTime()
        ) {
          return uni.showToast({
            title: "请选择小于结束时间",
            icon: "none",
          });
        }
      } else if (this.dateType === "end" && this.refundTime.start) {
        if (
          new Date(start).getTime() < new Date(this.refundTime.start).getTime()
        ) {
          return uni.showToast({
            title: "请选择大于起始时间",
            icon: "none",
          });
        }
      } else if (this.dateType === "start" && this.refundTime.end) {
        if (
          new Date(start).getTime() > new Date(this.refundTime.end).getTime()
        ) {
          return uni.showToast({
            title: "请选择小于结束时间",
            icon: "none",
          });
        }
      }else if(this.dateType === 'end' && this.changeTime.start) {
        if(new Date(start).getTime() < new Date(this.changeTime.start).getTime()){
          return uni.showToast({
            title:'请选择大于起始时间',
            icon:'none'
          })
        }
      }else if(this.dateType === 'start' && this.changeTime.end) {
        if(new Date(start).getTime() > new Date(this.changeTime.end).getTime()){
          return uni.showToast({
            title:'请选择小于结束时间',
            icon:'none'
          })
        }
      }

      this.$set(this.timeLimit,this.dateType,start)
      this.$set(this.refundTime,this.dateType,start)
      this.$set(this.changeTime,this.dateType,start)
    },

    //城市选择  出发城市
    whereToBtn() {
      //  跳转到城市选择页面
      uni.navigateTo({
        url: "/pages/citySelect/citySelect?type=to",
      });
    },

    //城市选择  到达城市
    whereFromBtn() {
      //  跳转到城市选择页面
      uni.navigateTo({
        url: "/pages/citySelect/citySelect?type=from",
      });
    },

    // 订票员选择
    openFilterDialog() {
      this.$refs.filterDialog.openFilterDialog();
    },

    // 关闭弹出框
    closeFilterDialog() {
      this.$refs.filterDialog.closeFilterDialog();
    },

    // 确认订票员
    submitFilterBtn(val) {
      console.log("123", val);
      this.booker = val;
      console.log(this.nameGroup);
    },
  },
  onLoad(data) {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.filterType = data.type;
    console.log(data);
    this.is_order_fliter = data.filterData
      ? true
      : data.refundData
      ? false
      : undefined;
    // 国内筛选 如果国内筛选字段 不为 空值 并且 拥有国内筛选这个字段 才进入数据组装
    if (data.filterData !== "{}" && this.filterType === "0") {
      let fliterData = JSON.parse(data.filterData);
      console.log("筛选条件", fliterData);
      this.pnr = fliterData.pnr; //pnr
      this.orderNumber = fliterData.orderNumber; //订单号
      this.flightNumber = fliterData.flightNumber; // 航班号
      this.booker = fliterData.book_user; //订票员
      this.citySelect.start = fliterData.Citystart; //出发城市
      this.citySelect.end = fliterData.Cityend; //到达城市
      this.timeLimit.start = fliterData.Timestart; //日始时间
      this.timeLimit.end = fliterData.Timend; //日止时间
      this.activeStatus = fliterData.status; // 订单状态
      this.dateStatus = fliterData.date; //日期条件

      this.orderStatus.forEach(
        (item) => (item.active = item.id === fliterData.status)
      );
      this.dateFilter[1].active = fliterData.date === "depart";
      this.dateFilter[0].active = fliterData.date === "create";
    }
    // 退票列表
    if (this.filterType === "1" && data.refundData !== "{}") {
      let refundList = JSON.parse(data.refundData);
      // this.flightApplicant = refundList.admin_name // 申请人
      this.flightPassenger = refundList.passenger_name; // 乘机人
      this.refundStatus = refundList.order_status; // 订单状态
      this.ticket_Number = refundList.ticket_no; // 票号
      this.pnr = refundList.pnr; // pnr
      (this.refundTime.start = refundList.start_date), //申请日始
        (this.refundTime.end = refundList.end_date), //申请日止
        (this.passengerStatus = refundList.passenger_type), // 旅客类型
        (this.orderType = refundList.order_type), // 客户单 手工单
        this.refundFilter.forEach(
          (item) => (item.active = item.id === refundList.order_status)
        );
      this.passengerFilter.forEach(
        (item) => (item.active = item.value === refundList.passenger_type)
      );
      this.orderFilter.forEach(
        (item) => (item.active = item.id === refundList.order_type)
      );
    }

    //改签列表
    if(this.filterType === '2' && data.changeData !== '{}'){
      let changeList = JSON.parse(data.changeData)
      this.changeStatus = changeList.change_status // 订单状态
      this.changePassengerStatus = changeList.passengerType //乘客类型
      this.ticket_Number = changeList.ticketNumber //票号
      this.pnr = changeList.pnrNumber //pnr
      this.orderNumber = changeList.orderNumber //订单号
      this.flightPassenger = changeList.passengerName //乘机人
      this.changeTime.start = changeList.Timestart, //申请日始
      this.changeTime.end = changeList.Timend, //申请日止


      this.changeFilter.forEach(item => item.active = item.id === changeList.change_status)
      this.passengerChangeFilter.forEach(item => item.active = item.value === changeList.passengerType)
      
    }
  },

  onShow() {
    // 获取城市信息
    if (uni.getStorageSync("city")) {
      let cityData = JSON.parse(uni.getStorageSync("city"));
      console.log(JSON.parse(uni.getStorageSync("city")));
      if (cityData.status === "to") {
        this.citySelect.start = cityData;
        this.airMessage["to"] = cityData.data;
        this.airMessage["to_type"] = cityData.type;
      } else if (cityData.status === "from") {
        this.citySelect.end = cityData;
        this.airMessage["from"] = cityData.data;
        this.airMessage["from_type"] = cityData.type;
      }
      console.log(this.citySelect);
      uni.removeStorageSync("city");
    }
  },
};
</script>

<style lang="less" scoped>
.filter {
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  .filter_main {
    height: calc(100% - (270upx + var(--status-bar-height)));
    overflow-y: auto;
    box-sizing: border-box;
    .list_item {
      margin: 0 20upx 50upx;
      &:first-child {
        margin-top: 50upx;
      }
      &.list_input {
        display: flex;
        justify-content: space-between;
        padding-bottom: 26upx;
        border-bottom: 2upx solid rgba(241, 243, 245, 1);
        margin-bottom: 34upx;
        .item_input {
          text-align: right;
          margin-left: 50upx;
          font-size: 28upx;
          color: rgba(175, 185, 196, 1);
        }
      }
    }
    .item_title {
      font-size: 28upx;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
    }
    .item_checkbox {
      display: flex;
      align-items: center;
      margin-top: 30upx;
      .checkbox_item {
        width: 156upx;
        height: 70upx;
        background: rgba(241, 243, 245, 1);
        border-radius: 10upx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24upx;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        &.active {
          background: rgba(0, 112, 226, 0.6);
          color: rgba(255, 255, 255, 1);
        }
        &:not(:last-child) {
          margin-right: 28upx;
        }
      }
    }
    .item_dialog {
      display: flex;
      align-items: center;
      margin-top: 30upx;
      .dialog_view {
        width: 280upx;
        height: 70upx;
        background: rgba(241, 243, 245, 1);
        border-radius: 36upx;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 20upx;
        box-sizing: border-box;
        font-size: 28upx;
        font-weight: 400;
      }
      .dialog_line {
        font-size: 28upx;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        margin: 0 40upx;
      }
    }
  }

  .filter_bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    border-top: 2upx solid rgba(229, 229, 229, 1);
    bottom: 0;
    left: 0;
    width: 100vw;
    height: calc(144upx + var(--status-bar-height));
    padding: 26upx 20upx;
    padding-bottom: calc(26upx + var(--status-bar-height));
    box-sizing: border-box;
    background: #fff;
    z-index: 1;
    .bottom_btn {
      width: 320upx;
      height: 90upx;
      border: 2upx solid transparent;
      border-radius: 80upx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32upx;
      font-weight: 400;
      margin: 0;

      &.reset_btn {
        border-color: rgba(0, 112, 226, 1);
        color: rgba(0, 112, 226, 1);
      }
      &.submit_btn {
        background: linear-gradient(
          90deg,
          rgba(0, 112, 226, 1) 0%,
          rgba(86, 197, 255, 1) 100%
        );
        box-shadow: 0 6upx 12upx rgba(0, 112, 226, 0.3);
        color: rgba(255, 255, 255, 1);
      }
      &.disabled {
        opacity: 0.4;
      }
    }
  }
}
</style>
