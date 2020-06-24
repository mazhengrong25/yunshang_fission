<template>
	<view class="ticket_inquiry">
<!-- 		<view class="header_topbar" :style="{height: statusBarHeight + 'px'}">
			<image class="go_back" @click="goBack" src="../../static/back.png" mode=""></image>
			<view class="title">
				<text>重庆</text>
				<image class="title_icon" src="../../static/ticket_header_path.png" mode=""></image>
				<text>北京</text>
			</view>
		</view> -->
		
		<view class="ticket_header">
			<view class="ticket_time_list">
				<view :class="['ticket_time_btn',{'active': item.number === activeTimeNumber}]" @click="clickBtn(item)" v-for="(item, index) in ticketTimeList" :key="index">
					<view class="time_day">{{item.day}}</view>
					<view class="time_number">{{item.number}}</view>
					<!-- <view class="time_price">&yen; {{item.price}}</view> -->
				</view>
			</view>
			<view class="calendar_btn" @click="backCalendar">
				<image class="calendar_btn_icon" src="../../static/from_time.png" mode=""></image>
				日历
			</view>
		</view>
		
		<view class="ticket_content">
			<view class="ticket_box">
				<view class="ticket_list" v-for="(item, index) in ticketList" :key="index" @click="jumpFlightInfo(item)">
					
					<view class="ticket_left">
						<view class="ticket_message">
							<view class="ticket_start ticket_time">
								<view class="ticket_date">{{item.startTime}}</view>
								<view class="ticket_address">{{item.startAddress}}</view>
							</view>
							<view class="ticket_arrow">
								<view>{{item.voyageTime}}</view>
								<view class="ticket_type" v-if="ticketType !== '国内'">{{item.voyageType}}</view>
							</view>
							<view class="ticket_end ticket_time">
								<view class="ticket_date">{{item.endTime}}<text class="more_time" v-if="item.moreTime">+{{item.moreTime}}天</text></view>
								<view class="ticket_address">{{item.endAddress}}</view>
							</view>
						</view>
						
						<view class="ticket_details">
							<image class="ticket_details_icon" src="../../static/dhlogo@2x.png" mode=""></image>
							{{item.airline}} | {{item.model}}
						</view>
						
					</view>
					
					
					<view class="ticket_right">
						<view class="ticket_price">
							<text class="currency">&yen;</text>
							{{item.price}}
						</view>
						<view class="overseas" v-if="item.overseas">
							(境外&yen;{{item.overseas}})
						</view>
						<view class="ticket_cabin">
							{{item.cabin}}
						</view>
						<view v-if="item.reward" class="ticket_reward">奖励金 &yen;{{item.reward}}</view>
					</view>

				</view>

			</view>

		</view>
		
		<view class="ticket_footer"> 
			<view @click="footerBtn('price')" :class="['footer_btn',{active: footerBtnActive === 'price'}]">
				<image v-if="footerBtnActive === 'price'" class="footer_btn_icon" src="../../static/filter_price_active.png" mode=""></image>
				<image v-else class="footer_btn_icon" src="../../static/filter_price.png" mode=""></image>
				价格(低-高)
			</view>
			<view class="footer_line"></view>
			<view @click="footerBtn('time')" :class="['footer_btn',{active: footerBtnActive === 'time'}]">
				<image v-if="footerBtnActive === 'time'" class="footer_btn_icon" src="../../static/filter_time_active.png" mode=""></image>
				<image v-else class="footer_btn_icon" src="../../static/filter_time.png" mode=""></image>
				时间(早-晚)
			</view>
			<view class="footer_line"></view>
			<view class="footer_btn" @click="openFilter">
				<image class="footer_btn_icon" src="../../static/filter_price.png" mode=""></image>
				筛选
			</view>
		</view>
		
		
		<uni-popup ref="filterPopup" type="bottom" class="filter_dialog">
			<view class="filter_main">
				<view class="filter_title">
					<view class="close_dialog" @click="closeFilterDialog">取消</view>
					<view class="close_filter" @click="closeFilterList">清空筛选</view>
					<view class="submit_filter">确定</view>
				</view>
				
				<view class="filter_content">
					<view class="content_name_list">
						<view 
						:class="['list_name',{'acitce': activeFilterIndex === index}]" 
						v-for="(item, index) in filterList.listName" 
						:key="index"
						@click="openFilterList(index)"
						>{{item}}</view>
					</view>
					
					<view class="content_list" v-if="activeFilterIndex === 0">
						<view 
						:class="['takeoff_time_list',{active: takeoffTimeName === index}]"
						@click="takeoffTimeActive(item,index)"
						 v-for="(item, index) in takeoffTime" 
						 :key="index">
							<view class="list_name">{{item}}</view>
							<view class="list_click"></view>
						</view>
					</view>
				</view>
				
				
				
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ticketType: '国内',  // 机票查询默认值
				footerBtnActive: 'time', // 底部排序默认值
				
				ticketTimeList: [{ // 日期选择列表
					day: '今天',
					number: '17',
					price: 475
				},{
					day: '明天',
					number: '04-18',
					price: 475
				},{
					day: '后天',
					number: '19',
					price: 475
				},{
					day: '周一',
					number: '20',
					price: 475
				},{
					day: '周二',
					number: '21',
					price: 475
				},{
					day: '周三',
					number: '22',
					price: 475
				}],
				activeTimeNumber: '04-18', // 日期选择
				
				ticketList: [{
					startTime: '08:00',
					startAddress: '江北T3',
					voyageTime: '2h30m',
					endTime: '10:30',
					endAddress: '大兴',
					price: '390',
					cabin: '经济舱',
					reward: '20',
					airline: '南航CZ2801',
					model: '空客A320(中)'
				},{
					startTime: '08:00',
					startAddress: '江北T3',
					voyageTime: '2h30m',
					voyageType: '转 香港',
					moreTime: 1,
					overseas: 4088,
					endTime: '10:30',
					endAddress: '大兴',
					price: '280',
					cabin: '经济舱4.8折',
					reward: '',
					airline: '南航CZ2801',
					model: '空客A320(中)'
				},{
					startTime: '09:00',
					startAddress: '江北T3',
					voyageTime: '2h45m',
					endTime: '11:45',
					endAddress: '首都T3',
					price: '300',
					cabin: '经济舱',
					reward: '',
					airline: '南航CZ2801',
					model: '空客A320(中)'
				},{
					startTime: '08:00',
					startAddress: '江北T3',
					voyageTime: '2h30m',
					endTime: '10:30',
					endAddress: '大兴',
					price: '390',
					cabin: '经济舱',
					reward: '',
					airline: '南航CZ2801',
					model: '空客A320(中)'
				},{
					startTime: '08:00',
					startAddress: '江北T3',
					voyageTime: '2h30m',
					endTime: '10:30',
					endAddress: '大兴',
					price: '390',
					cabin: '经济舱',
					reward: '20',
					airline: '南航CZ2801',
					model: '空客A320(中)'
				},{
					startTime: '08:00',
					startAddress: '江北T3',
					voyageTime: '2h30m',
					endTime: '10:30',
					endAddress: '大兴',
					price: '390',
					cabin: '经济舱',
					reward: '',
					airline: '南航CZ2801',
					model: '空客A320(中)'
				}],
				
				
				filterDataList: [],  // 筛选列表
				
				filterList: {  // 筛选列表名称
					listName: ['起飞时间段','航空公司','舱位','机场'],
				},
				
				activeFilterIndex: 0, // 默认筛选列表名称下标
				
				takeoffTime: [  // 起飞时间段选择列表
					'不限',
					'上午00:00-12:00',
					'中午12:00-14:00',
					'下午14:00-18:00',
					'晚上18:00-24:00',
				],
				
				takeoffTimeName: 0, // 起飞时间段默认选择
			
			};
		},
		onLoad: function (data) {
			this.ticketType = data.type
		  console.log(data)
		},
		methods:{
			// 选择日期
			clickBtn(val){
				console.log(val)
				this.activeTimeNumber = val.number
			},
			
			// 返回日历选择
			backCalendar(){
				
			},
			
			// 排序按钮
			footerBtn(val){
				this.footerBtnActive = val
			},
			
			
			// 打开筛选
			openFilter(){
				this.$refs.filterPopup.open()
			},
			// 关闭弹出框
			closeFilterDialog(){
				this.$refs.filterPopup.close()
			},
			
			// 清空筛选
			closeFilterList(){
				this.filterDataList = []
				this.takeoffTimeName = 0
			},
			
			// 切换筛选盒子
			openFilterList(val){
				this.activeFilterIndex = val
			},
			
			// 起飞时间段选择
			takeoffTimeActive(val,index){
				this.takeoffTimeName = index
				this.filterDataList[this.activeFilterIndex] = val
				
			},
			
			// 跳转航程信息
			jumpFlightInfo(data){
				uni.navigateTo({
					url: '../flightInfo/flightInfo'
				})
			},
			
			
		},
		onReady() {
			uni.setNavigationBarTitle({
					fontSrc: "https://at.alicdn.com/t/font_1899917_i7jq18twklr.ttf",
			    title: '重庆 \ue702 北京', 
			});
		}
	}
</script>

<style scoped lang="less">
	.ticket_inquiry{
		display: flex;
		flex-direction: column;
		height: 100vh;
		.header_topbar{
			background:rgba(0,112,226,1);
			display: flex;
			align-items: flex-end;
			justify-content: center;
			position: relative;
			padding: 0 20upx 20upx;
			height: var(--status-bar-height);
			.go_back{
				position: absolute;
				left: 20upx;
				width: 40upx;
				height: 40upx;
			}
			.title{
				font-size: 36upx;
				font-weight:bold;
				letter-spacing:8upx;
				color:rgba(255,255,255,1);
				display: flex;
				align-items: center;
				.title_icon{
					width: 35upx;
					height: 8upx;
					margin: 0 28upx;
				}
			}
		}
		
		.header{
			width: 100%;
			height: 88upx;
			background:rgba(0,112,226,1);
		}
		.ticket_header{
			height: 144upx;
			background:rgba(0,112,226,1);
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-left: 20upx;
			.ticket_time_list{
				display: flex;
				align-items: center;
				text-align: center;
				flex: 1;
				overflow-x: auto;
				height: 100%;
				.ticket_time_btn{
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					flex-shrink: 0;
					width: 130upx;
					height: 104upx;
					background:rgba(30,139,249,.9);
					border-radius: 20upx;
					margin-right: 20upx;
					color:rgba(255,255,255,1);
					&.active{
						background:rgba(255,255,255,1);
						color:rgba(42,42,42,1);
						.time_price{
							color:rgba(255,0,0,1);
						}
					}
					.time_day{
						font-size: 18upx;
						font-weight:400;
						letter-spacing: 5upx;
					}
					.time_number{
						font-size: 34upx;
						font-weight:bold;
						line-height: 40upx;
					}
					.time_price{
						font-size: 20upx;
						font-weight:500;
					}
				}

			}
			.calendar_btn{
				width: 120upx;
				height: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				flex-shrink: 0;
				font-size: 22upx;
				font-weight:400;
				color:rgba(255,255,255,1);
				.calendar_btn_icon{
					width: 40upx;
					height: 40upx;
					margin-bottom: 6upx;
				}
			}
		}
		
		.ticket_content{
			background:rgba(242,244,246,1);
			padding: 20upx;
			flex: 1;
			overflow-y: auto;
			.ticket_box{
				.ticket_list{
					display: flex;
					justify-content: space-between;
					background:rgba(255,255,255,1);
					box-shadow: 0 12upx 18upx rgba(0,0,0,0.04);
					border-radius: 20upx;
					padding: 26upx 20upx;
					&:not(:last-child){
						margin-bottom: 20upx;
					}
					.ticket_left{
						width: 60%;
						.ticket_message{
							display: flex;
							justify-content: space-between;
							margin-bottom: 34upx;
							.ticket_time{
								.ticket_date{
									font-size: 36upx;
									font-weight:bold;
									color:rgba(42,42,42,1);
									margin-bottom: 6upx;
									position: relative;
									.more_time{
										position: absolute;
										font-size: 18upx;
										font-weight:400;
										color:rgba(42,42,42,1);
										top: 0;
										right: -1;
										width: 60upx;
									}
								}
								.ticket_address{
									font-size: 22upx;
									font-weight:400;
									color:rgba(42,42,42,1);
								}
							}
							.ticket_arrow{
								font-size: 22upx;
								font-weight:400;
								color:rgba(175,185,196,1);
								position: relative;
								padding-top: 10upx;
								.ticket_type{
									margin-top: 14upx;
								}
							
								&::before{
									content: ''; 
									position: absolute;
									background: url(../../static/ticket_path.png) no-repeat;
									background-size: contain;
									width: 113upx;
									height: 21upx;
									top: 32upx;
									left: -6upx;
								}
							}
						}
						
						.ticket_details{
							font-size: 20upx;
							font-weight:400;
							color:rgba(175,185,196,1);
							.ticket_details_icon{
								width: 22upx;
								height: 16upx;
								margin-right: 8upx;
							}
						}
						
					}
					
					.ticket_right{
						text-align: right;
						.ticket_price{
							font-size: 42upx;
							font-weight:bold;
							color:rgba(255,0,0,1);
							margin-bottom: 2upx;
							.currency{
								font-size: 24upx;
							}
							
						}
						.overseas{
							font-size: 20upx;
							font-weight:400;
							color:rgba(0,112,226,1);
						}
						.ticket_cabin{
							font-size: 22upx;
							font-weight:400;
							color:rgba(153,153,153,1);
							margin-bottom: 2upx;
						}
						.ticket_reward{
							background: rgba(255,0,0,.1);
							font-size:18upx;
							font-weight:400;
							color:rgba(255,0,0,1);
							padding: 2upx 12upx;
							display: inline-flex;
							align-items: center;
						}
					}
					
				}
			}
		}
		
		.ticket_footer{
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100upx;
			border-top: 2upx solid rgba(229,229,229,1);
			background-color: #fff;
			.footer_line{
				width: 2upx;
				height: 60upx;
				background: rgba(175,185,196,.2);
			}
			.footer_btn{
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				font-size: 20upx;
				font-weight:400;
				color:rgba(175,185,196,1);
				width: 236upx;
				&.active{
					color:rgba(0,112,226,1);
				}
				.footer_btn_icon{
					width: 40upx;
					height: 40upx;
					object-fit: contain;
					margin-bottom: 6upx;
				}
			}
		}
		
		.filter_dialog{
			.filter_main{
				background:rgba(255,255,255,1);
				border-radius:80upx 80upx 0 0;
				.filter_title{
					padding: 50upx 40upx 30upx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					border-bottom: 2upx solid rgba(217,225,234,1);
					.close_dialog{
						font-size: 28upx;
						font-weight:bold;
						color:rgba(102,102,102,1);
					}
					.close_filter{
						font-size: 28upx;
						font-weight:500;
						color:rgba(175,185,196,1);
						&.active{
							color:rgba(0,112,226,1);
						}
					}
					.submit_filter{
						font-size: 28upx;
						font-weight:bold;
						color:rgba(0,112,226,1);
					}
				}
				.filter_content{
					min-height: 600upx;
					display: flex;
					.content_name_list{
						width:220upx;
						flex-shrink: 0;
						display: flex;
						flex-direction: column;
						background:rgba(241,243,245,1);
						.list_name{
							height: 100upx;
							display: flex;
							align-items: center;
							justify-content: center;
							font-size: 28upx;
							font-weight:400;
							color:rgba(51,51,51,1);
							border-bottom: 2upx solid rgba(217,225,234,1);
							&.acitce{
								background:rgba(255,255,255,1);
							}
						}
					}
					.content_list{
						flex: 1;
						padding: 32upx 40upx 32upx 30upx;
						.takeoff_time_list{
							display: flex;
							align-items: center;
							justify-content: space-between;
							margin-bottom: 56upx;
							&.active{
								.list_name{
									color:rgba(0,112,226,1)
								}
								.list_click{
									background: url(../../static/selected_active.png) no-repeat;
									background-size: contain;
								}
							}
							.list_name{
								font-size: 28upx;
								font-weight:400;
								color:rgba(51,51,51,1);
							}
							.list_click{
								background: url(../../static/selected.png) no-repeat;
								background-size: contain;
								width: 40upx;
								height: 40upx;
							}
						}
						
						
						
					}
				}
				
	
			}
		}
		
	}
</style>
