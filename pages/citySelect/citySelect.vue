<template>
	<view class="city_select">
		<view class="city_search">
			<input type="text" class="city_search_input" placeholder-style="font-size: 24rpx;font-weight:500;color:rgba(206,206,208,1);"
			 v-model="searchCity" placeholder="输入城市名称或者字母">
			<view class="close_input" v-if="searchCity !== ''" @click="closeSearch">取消</view>
		</view>

		<view class="city_main">
			
			<view class="city_swiper">
				<view class="city_swiper_header">
					<view :class="['header_btn',{'acive': isCityActive}]" @click="checkedCityBtn(true)">国内</view>
					<view :class="['header_btn',{'acive': !isCityActive}]" @click="checkedCityBtn(false)">国际/中国港澳台</view>
				</view>
				
				<view class="address_list_main" v-if="isCityActive">
					<view class="gps_address address_tag_list">
						<view class="address_title">当前定位</view>
						<view class="address_list_box">
							<view class="address_tag address_tag_icon">{{Areaaddress.city || '获取定位中'}}</view>
						</view>
					</view>
					
					<view class="address_tag_list">
						<view class="address_title">热门城市</view>
						<view class="address_list_box">
							<view class="address_tag">北京首都</view>
							<view class="address_tag">重庆</view>
							<view class="address_tag">成都</view>
							<view class="address_tag">广州</view>
							<view class="address_tag">上海虹桥</view>
						</view>
					</view>
				</view>
				
				<view class="address_list_main" v-else>
					<view class="address_tag_list">
						<view class="address_title">热门城市</view>
						<view class="address_list_box">
							<view class="address_tag">北京首都</view>
							<view class="address_tag">重庆</view>
							<view class="address_tag">成都</view>
							<view class="address_tag">广州</view>
							<view class="address_tag">上海虹桥</view>
						</view>
					</view>
					
					
					
				</view>
				
				
			</view>



			<view class="not_city" v-if="notCity">
				<view>抱歉，找不到相关信息</view>
				<view>请核实城市/国家名称是否有误</view>
			</view>
		</view>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchCity: '', // 城市搜索
				
				isCityActive: true,  // 国内国际状态切换
				
				Areaaddress: {}, // 当前定位地理位置

				notCity: false, // 未找到相关信息
			};
		},
		methods: {
			// 清空搜索框
			closeSearch() {
				this.searchCity = ""
			},
			
			// 切换国内国外城市列表
			checkedCityBtn(val){
				this.isCityActive = val
			},
			
			// 获取定位
			getUserAddress(){
				let that = this
				uni.getLocation({
				  type: 'wgs84',
				  success: function(res) {
						let latitude,longitude;
						latitude = res.latitude.toString();
						longitude = res.longitude.toString();
						uni.request({
							header:{
								"Content-Type": "application/text"
							},
							url:'http://apis.map.qq.com/ws/geocoder/v1/?location='+latitude+','+longitude+'&key=LBEBZ-U6KKX-YYH4Z-T7OLR-7QGH3-DPB4G',
							success(re) {	   
								if(re.statusCode === 200){
									that.Areaaddress  = re.data.result.ad_info;
									console.log(that.Areaaddress)
								}else{ 
									console.log("获取信息失败，请重试！")
								} 
							 } 
						})						
				  }
				})
			},
			
		},
		
		onLoad() {
			this.getUserAddress()
		}
	}
</script>

<style scoped lang="less">
	.city_select {
		.city_search {
			display: flex;
			align-items: center;
			background-color: #0070E2;
			padding: 14upx 20upx;
			position: relative;

			&::before {
				content: '';
				position: absolute;
				display: inline-flex;
				left: 40upx;
				background: url(../../static/search.png) no-repeat;
				background-size: contain;
				width: 26upx;
				height: 26upx;
			}

			.city_search_input {
				flex: 1;
				height: 60upx;
				background: rgba(255, 255, 255, 1);
				border-radius: 60upx;
				padding: 0 20upx 0 62upx;
				font-size: 24upx;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
			}

			.close_input {
				margin-left: 26upx;
				font-size: 30upx;
				font-weight: 500;
				color: rgba(255, 255, 255, 1);
			}
		}
		
		
		.city_main{
			
			.city_swiper{
				.city_swiper_header{
					display: flex;
					align-items: center;
					height: 80upx;
					.header_btn{
						flex: 1;
						height: 100%;
						border-bottom: 2upx solid rgba(0,112,226,0);
						display: inline-flex;
						align-items: center;
						justify-content: center;
						font-size: 28upx;
						font-weight:300;
						color:rgba(42,42,42,1);
						transition: all .3s;
						&.acive{
							border-color: rgba(0,112,226,1);
							font-weight:bold;
							color:rgba(0,112,226,1);
						}
					}
				}
				
				.address_list_main{
					padding: 36upx 20upx 0;
					.address_tag_list{
						&.gps_address{
							margin-bottom: 6upx;
						}
						.address_title{
							font-size: 20upx;
							font-weight:400;
							color:rgba(42,42,42,1);
							margin-bottom: 15upx;
						}
						.address_list_box{
							display: flex;
							flex-wrap: wrap;
							padding: 0 6upx;
							.address_tag{
								width: 210upx;
								height: 58upx;
								border: 2upx solid rgba(214,214,214,1);
								box-shadow:-2upx 12upx 18upx rgba(0,0,0,0.04);
								border-radius: 20upx;
								display: inline-flex;
								align-items: center;
								justify-content: center;
								font-size: 28upx;
								font-weight:400;
								color:rgba(42,42,42,1);
								margin-bottom: 30upx;
								&:not(:nth-child(3n)){
									margin-right: 28upx;
								}
								&.address_tag_icon{
									&::before{
										content: '';
										background: url(../../static/address.png) no-repeat;
										background-size: contain;
										width: 24upx;
										height: 28upx;
										margin-right: 14upx;
									}
								}
							}
						}
					}
					
				}
				
				
			}
			
			
			
			
			.not_city{
				margin-top: 152upx;
				text-align: center;
				font-size: 24upx;
				font-weight:500;
				line-height: 40upx;
				color:rgba(153,153,153,1);
			}
		}
	}
</style>
