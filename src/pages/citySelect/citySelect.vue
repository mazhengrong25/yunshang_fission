<!--
 * @Description: 城市选择
 * @Author: wish.WuJunLong
 * @Date: 2020-06-17 11:05:11
 * @LastEditTime: 2020-09-21 16:37:44
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
        v-on:input="openSearchStauts()"
      />
      <view class="close_input" v-if="searchCity !== ''" @click="closeSearch">取消</view>
    </view>

    <!-- <view class="city_swiper_header" v-if="!searchCity">
      <view :class="['header_btn',{'acive': isCityActive}]" @click="checkedCityBtn(true)">国内</view>
      <view :class="['header_btn',{'acive': !isCityActive}]" @click="checkedCityBtn(false)">国际/中国港澳台</view>
    </view> -->

    <scroll-view
      :enable-back-to-top="true"
      :scroll-into-view="intoindex"
      :scroll-y="true"
      :scroll-top="scrollTop"
      @scroll="anchorFixed"
      class="city_main"
    >
      <view class="show_anchor_info" v-if="showAnchorBox && !searchCity">{{intoindex}}</view>
      <view class="address_list_main" v-if="!searchCity">
        <view class="gps_address address_tag_list" v-if="isCityActive">
          <view class="address_title">当前定位</view>
          <view class="address_list_box">
            <view class="address_tag address_tag_icon" @click="gpsGetAddress(Areaaddress.city)">{{Areaaddress.city || '获取定位中'}}</view>
          </view>
        </view>

        <view class="address_tag_list">
          <view class="address_title">热门城市</view>
          <view class="address_list_box">
            <view class="address_tag" v-for="(item, index) in hotCity" :key="index" @click="getCityData(item,'hot')">
              {{item.city_name === '上海'? item.city_name + item.air_port_name:
              item.city_name === '北京'? item.city_name + '首都':item.city_name}}
            </view>
          </view>
        </view>
      </view>

      <view class="city_list" v-if="!searchCity">
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
            @click="getCityData(oitem,'city')"
          >
            <view class="city_info">{{oitem.city_name}}</view>
            <view class="city_code">{{oitem.city_code}}</view>
          </view>
        </view>
      </view>

      <view class="city_list">
        <view class="list_item" v-for="(item, index) in searchList" :key="index">
          <view class="city_province">
            <view class="city_type">{{item.type}}</view>
            <view class="city_text">{{item.unit}}</view>
          </view>
          <view
            class="item_city"
            @click="getCityData(oitem,'air')"
            v-for="(oitem, oindex) in item.data"
            :key="oindex"
          >
            <view class="city_airport">{{oitem.air_port_name}}</view>
            <view class="city_code">{{oitem.air_port}}</view>
            <view class="city_name">{{oitem.city_name}}</view>
          </view>
        </view>
      </view>

      <view class="not_city" v-if="searchList.length <= 0 && searchCity">
        <view>抱歉，找不到相关信息</view>
        <view>请核实城市/国家名称是否有误</view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import city from "@/api/city.js";
export default {
  data() {
    return {
      iStatusBarHeight: 0,

      hotCity: [], // 热门城市

      cityAirList: [], // 城市机场原始数据

      searchCity: "", // 城市搜索
      searchList: [], // 城市搜索列表

      cityType: "", // 选择城市类型 to 去程、form 返程

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

    // 定位数据查找相同城市
    gpsGetAddress(val){
      if(val){
        this.getCityData(this.cityAirList.filter(item => val.indexOf(item.city_name) !== -1)[0],'city')
      }
    },

    // 获取城市机场列表
    getAirData() {
      let data = {
        range: "CN",
      };
      city.getAir(data).then((res) => {
        this.cityAirList = res;
        // 热门城市组装
        this.cityAirList.forEach(item =>{
          if(
            item.air_port_name === '首都'||
            item.city_name === '重庆'||
            item.city_name === '成都'||
            item.city_name === '广州'||
            item.city_name === '上海'||
            item.city_name === '杭州'||
            item.city_name === '乌鲁木齐'||
            item.city_name === '深圳'
            ){
            this.hotCity.push(item)
          }
        })
        this.cityUnitList.forEach((item, index) => {
          this.cityList.push({
            unit: "",
            data: [],
          });
          res.forEach((oitem) => {
            if (String(oitem.city_ename[0]).toUpperCase() === item && oitem.air_port !== 'MY2') {
              this.cityList[index]["unit"] = item;
              this.cityList[index]["data"].push(oitem);
            }
          });


          var hash = {};
          this.cityList[index]["data"] = this.cityList[index]["data"].reduce(function(oitem, next) {
            hash[next.city_name] ? '' : hash[next.city_name] = true && oitem.push(next);
            return oitem
        }, [])
        });
        console.log(this.cityList)
        
        


        
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
    getCityData(val,type) {
      let data = {
        type: type,
        status: this.cityType,
        data: val
      };
      uni.setStorageSync("city", JSON.stringify(data));
      uni.navigateBack();
    },

    // 筛选输入框状态
    openSearchStauts() {
      this.searchList = [];
      let provinceList = [];
      if (this.searchCity) {
        this.cityAirList.forEach((item) => {
          if (
            JSON.stringify(item)
              .toLowerCase()
              .indexOf(this.searchCity.toLowerCase()) !== -1
          ) {
            provinceList.push(item.province);
          }
        });
        [...new Set(provinceList)].forEach((item, index) => {
          this.searchList.push({
            unit: item,
            type:
              item === "北京"
                ? "首都"
                : item === "上海" || item === "天津" || item === "重庆"
                ? "直辖市"
                : item === "内蒙古" ||
                  item === "广西" ||
                  item === "西藏" ||
                  item === "宁夏" ||
                  item === "新疆"
                ? "自治区"
                : item === "香港" || item === "澳门"
                ? "特别行政区"
                : "省份",
            data: [],
          });
          this.cityAirList.forEach((oitem) => {
            let cityName = oitem.air_port + oitem.air_port_name + oitem.province_py
                           oitem.city_name + oitem.city_code + oitem.city_pinyin 
                           
            if (JSON.stringify(cityName).toLowerCase().indexOf(this.searchCity.toLowerCase()) !== -1 && this.searchList[index].unit === oitem.province) {
              this.searchList[index].data.push(oitem);
            }
          });
        });
      }
      this.searchList = this.searchList.filter(item => item.data.length > 0)
      console.log(this.searchList)
    },
  },

  updated() {
    if (!this.searchCity) {
      let view = uni.createSelectorQuery().select(".address_list_main");
      view
        .boundingClientRect((data) => {
          this.HotCityHight = data.height;
        })
        .exec();
    }
  },

  onLoad(data) {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.getUserAddress();

    this.cityUnitList = [...Array(26).keys()].map((i) =>
      String.fromCharCode(i + 65)
    ); // 生成A-Z数组
    this.getAirData();
    this.cityType = data.type;
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
        line-height: 36upx;
        &.anchor_fixed {
          position: fixed;
          top: 20vh;
        }
        .anchor {
          width: 100upx;
          text-align: center;
          padding-left: 70upx;
          box-sizing: border-box;
        }
      }
      .list_item {
        .city_province {
          display: flex;
          align-items: center;
          position: relative;
          border-bottom: 2rpx solid rgba(214, 214, 214, 0.5);
          padding: 50upx 0 24upx;
          font-size: 24upx;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
          .city_type {
            padding: 0 6upx;
            height: 30upx;
            background: rgba(226, 121, 0, 1, 0.6);
            border-radius: 6upx;
            margin-right: 20upx;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 20upx;
            font-weight: 300;
            color: rgba(255, 255, 255, 1);
          }

          & ~ .item_city {
            margin-left: 58upx;
            &::before {
              content: "";
              width: 12upx;
              height: 12upx;
              border: 2upx solid rgba(175, 185, 196, 0.3);
              border-top: none;
              border-right: none;
            }
            .city_name {
              margin-left: auto;
              font-size: 24upx;
              font-weight: 500;
              color: rgba(175, 185, 196, 1);
            }
          }
        }
        .item_unit {
          font-size: 28upx;
          font-weight: 500;
          color: rgba(42, 42, 42, 1);
          margin: 20upx 0 14upx;
        }
        .item_city {
          border-bottom: 2upx solid rgba(214, 214, 214, 0.5);
          padding: 32upx 0 28upx;
          display: flex;
          align-items: center;
          .city_info {
            font-size: 28upx;
            font-weight: 500;
            color: rgba(42, 42, 42, 1);
          }
          .city_airport {
            margin-left: 16rpx;
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
