<!--
 * @Description: 已出票订单退票页面
 * @Author: wish.WuJunLong
 * @Date: 2020-08-17 10:31:20
 * @LastEditTime: 2020-08-17 18:10:12
 * @LastEditors: wish.WuJunLong
-->
<template>
  <view class="refund">
    <yun-header :statusHeight="iStatusBarHeight" centerTitle="退票"></yun-header>
	<!-- 正文 -->
	<scroll-view :enable-back-to-top="true" :scroll-y="true" class="content"
	<!-- 退票信息 -->
	<refundTop :dataList="list" @submitBtn="submit"></refundTop>
	<!-- 特别提醒 -->
	<view class="sep_list">
		<view class="list_icon">
			<image src="@/static/refund_warn.png" mode="aspectFit" />
		</view>
		<view class="list_title">国际退票特别提醒</view>
		<view class="list_right">
			<image src="../../static/refund_right.png" mode="aspectFit"></image>
		</view>
	</view>
	<!-- 航班信息 -->
	<view class="main_list filght_info">
	<view class="main_list_title">航班信息</view>
	 <view class="info_header">
		<view class="header_type">{{orderDetails.routing_type === 1?'单程':
									orderDetails.routing_type === 2?'往返':
									orderDetails.routing_type === 3?'多程':''}}</view>
		<view class="header_time">
		  {{item.departure_time.substring(0,10)}}
		  <text>{{$dateTool(item.departure_time,"ddd")}}</text>
		</view>
	  </view>
	  <view class="info_message">
		<view class="message_box">
		  <view class="date">{{item.departure_time.substring(10,16)}}</view>
		  <view class="address">{{item.departure}}</view>
		</view>
	
		<view class="message_center">
		  <view class="date">{{(item.duration.replace(":","h"))}}m</view>
		  <view class="center_icon"></view>
		  <view class="type">直飞</view>
		</view>
	
		<view class="message_box">
		  <view class="date">{{item.arrive_time.substring(10,16)}}</view>
		  <view class="address">{{item.arrive}}</view>
		</view>
	  </view>
	
	  <view class="filght_message">
		<view class="message_icon"></view>
		<view class="message_list">{{item.inter_segments[0].flight_no}}</view>
		<view class="message_list">空客A320</view>
		<view class="message_list">有早餐</view>
	  </view>
	
	  <view class="filght_bottom">
		<view class="bottom_list">{{item.inter_segments[0].cabin}}{{item.inter_segments[0].cabin_level === 'ECONOMY'?'经济舱':
									item.inter_segments[0].cabin_level === 'FIRST'?'头等舱':
									item.inter_segments[0].cabin_level === 'BUSINESS'?'公务舱':''}}</view>
		<view class="bottom_list">退改签规则</view>
		<view class="bottom_list">每人托运2件，每件23KG</view>
	  </view>
	</view>
	<!-- 出行信息 -->
	<refundSel ></refundSel>
	<!-- 订单信息 -->
	<view class="main_list order_message">
	  <view class="main_list_title">订单信息</view>
	  <view class="message_list">
		<view class="list_item">
		  <view class="item_title">订单编号</view>
		  <view class="item_message">{{orderDetails.order_no}}</view>
		</view>
		<view class="list_item">
		  <view class="item_title">PNR</view>
		  <view class="item_message">{{orderDetails.pnr_code}}</view>
		</view>
		<view class="list_item">
		  <view class="item_title">订票员</view>
		  <view class="item_message">{{orderDetails.book_user}}</view>
		</view>
		<view class="list_item">
		  <view class="item_title">预定时间</view>
		  <view class="item_message">{{orderDetails.created_at}}</view>	<!-- 时间 -->
		</view>
		<view class="list_item">
		  <view class="item_title">备注</view>
		  <view class="item_message input-right-arrow">{{orderDetails.ext}}</view>
		</view>
	  </view>
	</view>
	</scroll-view>
	<!-- 提交申请按钮 -->
	<view class="filter_bottom">
	  <view class="bottom_btn submit_btn">提交申请</view>
	</view>
  </view>
</template>

<script>
	import refundTop from "@/components/refund_top.vue"
	import refundSel from "@/components/refund_sel.vue"
export default {
	components:{
		refundTop,
		refundSel
	},
  data() {
    return {
      iStatusBarHeight: 0,
	  
	   orderDetails: [], // 订单详情

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
        {
          name: "出票日期",
          active: false,
        },
      ],
      orderStatus: [
        // 订单状态筛选列表
        {
          name: "已预订",
          active: false,
        },
        {
          name: "待出票",
          active: false,
        },
        {
          name: "已出票",
          active: false,
        },
        {
          name: "已取消",
          active: false,
        },
      ],
      timeLimit: {
        // 时间范围
        start: "2020-08-17",
        end: "2020-08-18",
      },
      citySelect: {
        start: "重庆",
        end: "",
      },
      pnr: "", // pnr
      orderNumber: "", // 订单号
      flightNumber: "", // 航班号
      booker: "", // 订票员
    };
  },
  methods: {
	  submit(val){
		  console.log(val)
	  },
    // 日期条件选择
    activeDate(val) {
      this.dateFilter.forEach((item) => {
        if (item.name === val.name) {
          item.active = !val.active;
        } else {
          item.active = false;
        }
      });
    },
    // 订单状态选择
    activeOrderStatus(val) {
      this.orderStatus.forEach((item) => {
        if (item.name === val.name) {
          item.active = !val.active;
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
    },
  },
  onLoad() {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
  },
};
</script>

<style lang="less" scoped>
.refund {
	 background: rgba(243, 245, 247, 1);
	 height: 100vh;
	 position: relative;
	 
	 .sep_list {
	 	 display: flex;
	 	 align-items: center;
	 	 justify-content: start;
	 	 border-radius: 10upx;
	 	 width: 710upx;
	 	 height: 60upx;
	 	 background-color: RGBA(244, 236, 226, 1);
	 	 z-index: 1;
	 	 margin-left: 23upx;
	 	 .list_icon {
	 	   width: 24upx;
	 	   height: 24upx;
	 	   image {
	 		 width: 100%;
	 		 height: 100%;
	 		 object-fit: contain;
	 	   }
	 	  margin: 10upx 10upx;
	 	  margin-bottom: 40upx;
	 
	 	 }
	 	 .list_right {
	 	   width: 24upx;
	 	   height: 24upx;
	 	   image {
	 		 width: 100%;
	 		 height: 100%;
	 		 object-fit: contain;
	 	   }
	 	   margin-left: 439upx;
	 	   margin-bottom: 30upx;
	 	 
	 	 }
	 	 .list_title {
	 	   font-size: 24upx;
	 	   font-weight: 400;
	 	   color: rgba(251, 152, 38, 1);
	 	 }
	 }
	 .main_list {
	   background: rgba(255, 255, 255, 1);
	   box-shadow: 0 12upx 18upx rgba(0, 0, 0, 0.04);
	   border-radius: 20upx;
	   margin: 20upx 20upx 20upx;
	   padding: 24upx 20upx 20upx;
	   .main_list_title {
	     font-size: 32upx;
	     font-weight: bold;
	     color: rgba(42, 42, 42, 1);
	   }
	   &.filght_info {
	     .info_header {
	       display: flex;
	       align-items: center;
	       margin-bottom: 20upx;
	       .header_type {
	         width: 80upx;
	         height: 30upx;
	         background: linear-gradient(
	           270deg,
	           rgba(0, 112, 226, 1) 0%,
	           rgba(86, 197, 255, 1) 100%
	         );
	         border-radius: 10upx;
	         font-size: 20upx;
	         font-weight: 400;
	         color: rgba(255, 255, 255, 1);
	         display: inline-flex;
	         align-items: center;
	         justify-content: center;
	         margin-right: 12upx;
	       }
	       .header_time {
	         font-size: 24upx;
	         font-weight: 400;
	         color: rgba(42, 42, 42, 1);
	         text {
	           margin-left: 12upx;
	         }
	       }
	     }
	     .info_message {
	       display: flex;
	       align-items: center;
	       justify-content: space-between;
	       margin-bottom: 26upx;
	       .message_box {
	         .date {
	           font-size: 36upx;
	           font-weight: bold;
	           color: rgba(42, 42, 42, 1);
	           margin-bottom: 4upx;
	         }
	         .address {
	           font-size: 24upx;
	           font-weight: 400;
	           color: rgba(42, 42, 42, 1);
	         }
	       }
	       .message_center {
	         display: flex;
	         align-items: center;
	         justify-content: center;
	         flex-direction: column;
	         .date {
	           font-size: 22upx;
	           font-weight: 400;
	           color: rgba(175, 185, 196, 1);
	         }
	         .center_icon {
	           width: 112upx;
	           height: 20upx;
	           background: url(@/static/ticket_path.png) no-repeat center
	             center;
	           background-size: contain;
	           display: block;
	         }
	         .type {
	           font-size: 22upx;
	           font-weight: 400;
	           color: rgba(175, 185, 196, 1);
	         }
	       }
	     }
	     .filght_message {
	       display: flex;
	       align-items: center;
	       justify-content: center;
	       .message_icon {
	         width: 24upx;
	         height: 24upx;
	         object-fit: contain;
	         margin-right: 6upx;
	       }
	       .message_list {
	         font-size: 22upx;
	         font-weight: 400;
	         color: rgba(175, 185, 196, 1);
	         display: inline-flex;
	         align-items: center;
	         &:not(:last-child) {
	           &::after {
	             content: "";
	             display: block;
	             width: 2upx;
	             height: 20upx;
	             background: rgba(217, 225, 234, 1);
	             margin: 0 8upx;
	           }
	         }
	       }
	     }
	     .filght_bottom {
	       display: flex;
	       align-items: center;
	       border-top: 2upx dashed rgba(217, 225, 234, 1);
	       margin-top: 20upx;
	       padding-top: 20upx;
	       justify-content: center;
	       .bottom_list {
	         font-size: 24upx;
	         font-weight: 400;
	         color: rgba(175, 185, 196, 1);
	         display: inline-flex;
	         align-items: center;
	         &:not(:last-child) {
	           &::after {
	             content: "";
	             display: block;
	             width: 2upx;
	             height: 20upx;
	             background: rgba(217, 225, 234, 1);
	             margin: 0 8upx;
	           }
	         }
	       }
	     }
	   }
	   &.passenger {
	     .passenger_list {
	       margin-top: 46upx;
	       .list_item {
	         &:not(:last-child) {
	           margin-bottom: 60upx;
	         }
	         &:last-child {
	           padding-bottom: 32upx;
	           border-bottom: 2upx solid rgba(241, 243, 245, 1);
	           margin-bottom: 30upx;
	         }
	         .list_info {
	           display: flex;
	           align-items: center;
	           margin-bottom: 34upx;
	           .info_type {
	             width: 100upx;
	             height: 30upx;
	             border: 2upx solid rgba(127, 183, 240, 1);
	             border-radius: 20upx;
	             margin-right: 12upx;
	             font-size: 20upx;
	             font-weight: 400;
	             color: rgba(127, 183, 240, 1);
	             display: inline-flex;
	             align-items: center;
	             justify-content: center;
	           }
	           .info_name {
	             font-size: 28upx;
	             font-weight: bold;
	             color: rgba(42, 42, 42, 1);
	             margin-right: 8upx;
	           }
	           .is_insurance {
	             background: url(@/static/insurance_icon.png) no-repeat center
	               center;
	             background-size: contain;
	             width: 25upx;
	             height: 30upx;
	           }
	           .group_type {
	             margin-left: 28upx;
	             font-size: 22upx;
	             font-weight: 400;
	             color: rgba(153, 153, 153, 1);
	           }
	         }
	         .list_message {
	           display: flex;
	           align-items: center;
	           .message_title {
	             font-size: 28upx;
	             font-weight: 400;
	             color: rgba(42, 42, 42, 1);
	             margin-right: 32upx;
	           }
	           .message_number {
	             font-size: 28upx;
	             font-weight: bold;
	             color: rgba(42, 42, 42, 1);
	           }
	         }
	       }
	     }
	     .contact {
	       .contact_list {
	         display: flex;
	         align-items: center;
	         &:not(:last-child) {
	           margin-bottom: 36upx;
	         }
	         .list_title {
	           font-size: 28upx;
	           font-weight: 400;
	           color: rgba(102, 102, 102, 1);
	           width: 132upx;
	         }
	         .list_message {
	           font-size: 28upx;
	           font-weight: bold;
	           color: rgba(42, 42, 42, 1);
	         }
	       }
	     }
	   }
	   &.certificate {
	     .certificate_message {
	       margin-top: 32upx;
	       // border-top: 2upx solid #f1f3f5;
	       padding-top: 34upx;
	       display: flex;
	       align-items: center;
	       .message_title {
	         font-size: 28upx;
	         font-weight: 400;
	         color: rgba(153, 153, 153, 1);
	         margin-right: 40upx;
	       }
	       .message_text {
	         font-size: 28upx;
	         font-weight: 400;
	         color: rgba(42, 42, 42, 1)
	       }
	     }
	   }
	   &.order_message {
	     .message_list {
	       margin-top: 40upx;
	       .list_item {
	         display: flex;
	         align-items: center; 
	         &:not(:last-child){
	           margin-bottom: 30upx;
	         }
	         .item_title {
	           font-size: 24upx;
	           font-weight: 400;
	           color: rgba(153, 153, 153, 1);
	           width: 100upx;
	         }
	         .item_message {
	           flex: 1;
	           text-align: right;
	           font-size: 24upx;
	           font-weight: 400;
	           color: rgba(42, 42, 42, 1);
	         }
	       }
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
	  padding: 90upx 45upx;
	  padding-bottom: calc(26upx + var(--status-bar-height));
	  box-sizing: border-box;
	  background: #fff;
	  z-index: 1;
	  .bottom_btn {
	    width: 650upx;
	    height: 90upx;
	    border: 2upx solid transparent;
	    border-radius: 80upx;
	    display: flex;
	    align-items: center;
	    justify-content: center;
	    font-size: 32upx;
	    font-weight: 400;
	    &.submit_btn {
	      background: linear-gradient(
	        90deg,
	        rgba(0, 112, 226, 1) 0%,
	        rgba(86, 197, 255, 1) 100%
	      );
	      box-shadow: 0 6upx 12upx rgba(0, 112, 226, 0.3);
	      color: rgba(255, 255, 255, 1);
		  letter-spacing: 8upx;
	    }
	  }
	}
 
}
</style>