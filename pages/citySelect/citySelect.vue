<!--
 * @Description: 城市选择
 * @Author: wish.WuJunLong
 * @Date: 2020-06-17 11:05:11
 * @LastEditTime: 2020-08-07 18:11:07
 * @LastEditors: wish.WuJunLong
--> 
<template>
  <view class="city_select">
    <yun-header :statusHeight="iStatusBarHeight" centerTitle="城市选择"></yun-header>
    <view class="city_search">
      <input
        type="text"
        class="city_search_input"
        placeholder-style="font-size: 24rpx;font-weight:500;color:rgba(206,206,208,1);"
        v-model="searchCity"
        placeholder="输入城市名称或者字母"
      />
      <view class="close_input" v-if="searchCity !== ''" @click="closeSearch">取消</view>
    </view>

    <view class="city_swiper_header">
      <view :class="['header_btn',{'acive': isCityActive}]" @click="checkedCityBtn(true)">国内</view>
      <view :class="['header_btn',{'acive': !isCityActive}]" @click="checkedCityBtn(false)">国际/中国港澳台</view>
    </view>

    <scroll-view
      :enable-back-to-top="true"
      :scroll-into-view="intoindex"
      :scroll-y="true"
      :scroll-top="scrollTop"
      @scroll="anchorFixed"
      class="city_main"
    >
      <view class="show_anchor_info" v-if="showAnchorBox">{{intoindex}}</view>
      <view class="address_list_main">
        <view class="gps_address address_tag_list" v-if="isCityActive">
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

      <view class="city_list">
        <view :class="['city_anchor',{'anchor_fixed':anchorFixedStyle}]">
          <view class="anchor" @click="jumpAnchor('#')">#</view>
          <view
            class="anchor"
            @click="jumpAnchor(item)"
            v-for="(item, index) in cityUnitList"
            :key="index"
          >{{item}}</view>
        </view>
        <view class="list_item" v-for="(item, index) in cityList" :key="index" :id="item.unit">
          <view class="item_unit">{{item.unit}}</view>
          <view
            class="item_city"
            v-for="(oitem, oindex) in item.data"
            :key="oindex"
            @click="getCityData(oitem)"
          >
            <view class="city_info">{{oitem[oitem.length - 1]}}</view>
            <view class="city_code">{{oitem[oitem.length - 2]}}</view>
          </view>
        </view>
      </view>

      <view class="not_city" v-if="notCity">
        <view>抱歉，找不到相关信息</view>
        <view>请核实城市/国家名称是否有误</view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import airport from "@/api/airport.js";
import city from "@/api/city.js";
export default {
  data() {
    return {
      iStatusBarHeight: 0,
			searchCity: "", // 城市搜索
			
			cityType: '',  // 选择城市类型 to 去程、form 返程

      HotCityHight: 0, // 热门城市高度
      anchorFixedStyle: false, // 锚点定位样式 true - fixed固定

      showAnchorBox: false,
      scrollTop: -1, // 滑动页面距离顶部高度
      intoindex: "", // 锚点下标
      cityUnitList: [], // 城市首字母
      cityList: [],

      isCityActive: true, // 国内国际状态切换

      Areaaddress: {}, // 当前定位地理位置

      notCity: false, // 未找到相关信息
    };
  },
  methods: {
    // 清空搜索框
    closeSearch() {
      this.searchCity = "";
    },

    // 切换国内国外城市列表
    checkedCityBtn(val) {
      this.isCityActive = val;
    },

    // 获取定位
    getUserAddress() {
      let that = this;
      uni.getLocation({
        type: "wgs84",
        success: function (res) {
          let latitude, longitude;
          latitude = res.latitude.toString();
          longitude = res.longitude.toString();
          uni.request({
            header: {
              "Content-Type": "application/text",
            },
            url:
              "http://apis.map.qq.com/ws/geocoder/v1/?location=" +
              latitude +
              "," +
              longitude +
              "&key=LBEBZ-U6KKX-YYH4Z-T7OLR-7QGH3-DPB4G",
            success(re) {
              if (re.statusCode === 200) {
                that.Areaaddress = re.data.result.ad_info;
                console.log(that.Areaaddress);
              } else {
                console.log("获取信息失败，请重试！");
              }
            },
          });
        },
      });
    },

    // 处理城市列表
    getAirportData() {
      city.domesticCity.forEach((item) => {
        this.cityUnitList.push(item[3][0].toUpperCase());
      });
      this.cityUnitList = [...new Set(this.cityUnitList)].sort();
      this.cityUnitList.forEach((oitem, oindex) => {
        this.cityList.push({
          unit: "",
          data: [],
        });
        city.domesticCity.forEach((item, index) => {
          if (item[3][0].toUpperCase() === oitem) {
            this.cityList[oindex]["unit"] = oitem;
            this.cityList[oindex]["data"].push(item);
          }
        });
      });

      this.cityList.sort((a, b) => {
        return a.unit.localeCompare(b.unit);
      });
    },

    // 首字母锚点定位
    anchorFixed(event) {
      this.anchorFixedStyle = event.detail.scrollTop >= this.HotCityHight;
    },

    // 跳转城市首字母锚点
    jumpAnchor(val) {
      if (val === "#") {
        console.log("返回顶部");
        this.$nextTick(() => {
          this.scrollTop = 0;
        });
      } else {
        this.$nextTick(() => {
          this.intoindex = val;
          console.log(this.intoindex);
        });

        this.showAnchorBox = true;
      }
      this.intoindex = "";
      setTimeout(() => {
        this.scrollTop = -1;
      }, 100);
      setTimeout(() => {
        this.showAnchorBox = false;
      }, 500);
    },

    // 获取城市信息 填入地址信息
    getCityData(val) {
			let data = {
				type: 'city',
				status: this.cityType,
				data: val
			}
			uni.setStorageSync('city', JSON.stringify(data));
      uni.switchTab({
        url: "/pages/index/index",
      });
    },
  },

  updated() {
    let view = uni.createSelectorQuery().select(".address_list_main");
    view
      .boundingClientRect((data) => {
        this.HotCityHight = data.height;
      })
      .exec();
  },

  onLoad(data) {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.getUserAddress();
		this.getAirportData();
		this.cityType = data.type
  },
};
</script>

<style scoped lang="less">
.city_select {
  display: flex;
  flex-direction: column;
  height: 100vh;
  .city_search {
    display: flex;
    align-items: center;
    background-color: #0070e2;
    padding: 14upx 20upx;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      display: inline-flex;
      left: 40upx;
      background: url(@/static/search.png) no-repeat;
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

  .city_swiper_header {
    display: flex;
    align-items: center;
    height: 80upx;
    .header_btn {
      flex: 1;
      height: 100%;
      border-bottom: 2upx solid rgba(0, 112, 226, 0);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 28upx;
      font-weight: 300;
      color: rgba(42, 42, 42, 1);
      transition: all 0.3s;
      &.acive {
        border-color: rgba(0, 112, 226, 1);
        font-weight: bold;
        color: rgba(0, 112, 226, 1);
      }
    }
  }

  .city_main {
    flex: 1;
    overflow-y: auto;
    height: 100%;
    position: relative;
    .show_anchor_info {
      position: fixed;
      width: 100upx;
      height: 100upx;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
      font-size: 48upx;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      left: 50%;
      top: 50%;
      margin-left: -50upx;
      margin-top: -50upx;
      z-index: 3;
    }
    .address_list_main {
      padding: 36upx 20upx 0;
      .address_tag_list {
        &.gps_address {
          margin-bottom: 6upx;
        }
        .address_title {
          font-size: 22upx;
          font-weight: 400;
          color: rgba(42, 42, 42, 1);
          margin-bottom: 15upx;
        }
        .address_list_box {
          display: flex;
          flex-wrap: wrap;
          padding: 0 6upx;
          .address_tag {
            width: 210upx;
            height: 58upx;
            border: 2upx solid rgba(214, 214, 214, 1);
            box-shadow: -2upx 12upx 18upx rgba(0, 0, 0, 0.04);
            border-radius: 20upx;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 28upx;
            font-weight: 400;
            color: rgba(42, 42, 42, 1);
            margin-bottom: 30upx;
            &:not(:nth-child(3n)) {
              margin-right: 28upx;
            }
            &.address_tag_icon {
              &::before {
                content: "";
                background: url(@/static/address.png) no-repeat;
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

    .city_list {
      padding: 0 28upx var(--status-bar-height) 32upx;
      position: relative;
      .city_anchor {
        position: absolute;
        right: 0;
        top: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 24upx;
        font-weight: 300;
        color: rgba(0, 112, 226, 1);
        line-height: 40upx;
        &.anchor_fixed {
          position: fixed;
          top: 25vh;
        }
        .anchor {
          width: 100upx;
          text-align: center;
          padding-left: 70upx;
          box-sizing: border-box;
        }
      }
      .list_item {
        .item_unit {
          font-size: 28upx;
          font-weight: 500;
          color: rgba(42, 42, 42, 1);
          margin: 20upx 0 14upx;
        }
        .item_city {
          border-bottom: 2upx solid rgba(214, 214, 214, 0.5);
          padding: 24upx 0 18upx;
          display: flex;
          align-items: center;
          .city_info {
            font-size: 28upx;
            font-weight: 500;
            color: rgba(42, 42, 42, 1);
          }
          .city_code {
            font-size: 22upx;
            font-weight: 300;
            color: rgba(42, 42, 42, 1);
            margin-left: 16upx;
          }
        }
      }
    }

    .not_city {
      margin-top: 152upx;
      text-align: center;
      font-size: 24upx;
      font-weight: 500;
      line-height: 40upx;
      color: rgba(153, 153, 153, 1);
    }
  }
}
</style>
