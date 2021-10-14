<!--
 * @Description:火车票 --- 城市选择
 * @Author: mzr
 * @Date: 2021-09-28 11:53:26
 * @LastEditTime: 2021-10-14 10:49:18
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
        placeholder="支持中文、拼音、简拼、站点三字码搜索"
        v-on:input="openSearchStauts()"
      />
      <view class="close_input" v-if="searchCity !== ''" @click="closeSearch">取消</view>
    </view>

    <scroll-view
      :enable-back-to-top="true"
      :scroll-into-view="intoindex"
      :scroll-y="true"
      :scroll-top="scrollTop"
      @scroll="anchorFixed"
      class="city_main"
    >
      <view class="show_anchor_info" v-if="showAnchorBox && !searchCity">{{
        intoindex
      }}</view>

      <!-- 热门城市 -->
      <view class="city_list hot_city" v-if="!searchCity" id="top">
        <view class="list_item">
          <view class="city_province">热门城市</view>
          <view class="city_box">
            <view
              class="city_item"
              v-for="item in hotCity"
              :key="item"
              @click="jumpIndex(item)"
              >{{ item[1] }}</view
            >
          </view>
        </view>
      </view>

      <view class="city_list" v-if="!searchCity">
        <view :class="['city_anchor', { anchor_fixed: anchorFixedStyle }]">
          <view class="anchor" @click="jumpAnchor('#')">#</view>
          <view
            class="anchor"
            @click="jumpAnchor(item)"
            v-for="(item, index) in cityUnitList"
            :key="index"
            >{{ item }}</view
          >
        </view>
        <view
          class="list_item"
          v-for="(item, index) in cityData"
          :key="index"
          :id="item.code"
        >
          <view class="city_province">{{ item.code }}</view>
          <view class="city_box">
            <view
              class="city_item"
              v-for="(oitem, oindex) in item.data"
              :key="oindex"
              @click="jumpIndex(oitem)"
            >
              <text>{{ oitem[1] }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="city_list" v-if="searchCity">
        <view
          class="list_item"
          @click="jumpIndex(item)"
          v-for="(item, index) in searchList"
          :key="index"
        >
          <view class="city_province_train">
            <view class="city_type">{{ item[2] }}</view>
            <view class="city_text">{{ item[1] }}</view>
          </view>
        </view>
      </view>

      <view class="not_city" v-if="searchCity && searchList.length < 1">
        <view>抱歉，找不到相关信息</view>
        <view>请确认省份名称是否有误</view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import city from "@/utils/cityCode.js";
export default {
  data() {
    return {
      iStatusBarHeight: 0,

      anchorFixedStyle: false, // 锚点定位样式 true - fixed固定

      HotCityHight: 0, // 热门城市高度

      cityUnitList: [], // 26英文列表

      showAnchorBox: false,

      intoindex: "", // 锚点下标

      cityData: [], // 城市
      hotCity: [
        ["", "北京"],
        ["", "上海"],
        ["", "天津"],
        ["", "重庆"],
        ["", "上海"],
        ["", "长沙"],
        ["", "长春"],
        ["", "成都"],
      ],
      cityType: "", // 出发  到达
      cityAddress: "", // 地址

      Areaaddress: {}, // 当前定位地理位置
      searchCity: "", // 城市搜索
      searchList: [], // 城市搜索列表
    };
  },
  methods: {
    // 获取城市
    getCityCode() {
      let city_name_character = [...Array(26).keys()].map((i) =>
        String.fromCharCode(i + 65)
      ); // 生成A-Z数组

      if (uni.getStorageSync("cityList")) {
        this.cityData = uni.getStorageSync("cityList");
      } else {
        let cities = city.split("@"); // 拆分城市数据
        let liarray_cities_array = []; // A-Z城市列表

        for (let i = 0; i < city_name_character.length; i++) {
          liarray_cities_array.push({
            code: city_name_character[i],
            data: [],
          });
        }

        for (let i = 0; i < cities.length; i++) {
          let titem = cities[i];
          let raha = titem
            .toString()
            .charAt(0)
            .toUpperCase();

          for (let k = 0; k < city_name_character.length; k++) {
            if (raha === liarray_cities_array[k].code) {
              liarray_cities_array[k].data.push(titem.split("|"));
            }
          }
        }
        uni.setStorageSync("cityList", liarray_cities_array);
        this.cityData = liarray_cities_array;
      }

      this.cityUnitList = city_name_character;
    },

    // 返回城市
    jumpIndex(val) {
      console.log(val);
      let data = {
        data: {
          city_name: val[1],
        },
        status: this.cityType,
      };
      uni.setStorageSync("city", JSON.stringify(data));
      uni.navigateBack();
    },

    // 清空搜索框
    closeSearch() {
      this.searchCity = "";
      this.searchList = [];
    },

    // 首字母锚点定位
    anchorFixed(event) {
      this.anchorFixedStyle = event.detail.scrollTop >= this.HotCityHight;
    },

    // 跳转城市首字母锚点
    jumpAnchor(val) {
      if (val === "#") {
        this.$nextTick(() => {
          this.intoindex = "top";
        });
      } else {
        this.$nextTick(() => {
          this.intoindex = val;
        });

        this.showAnchorBox = true;
      }

      console.log(this.intoindex);

      setTimeout(() => {
        this.scrollTop = -1;
      }, 100);
      setTimeout(() => {
        this.showAnchorBox = false;
      }, 500);
      this.intoindex = "";
    },

    // 输入框状态
    openSearchStauts() {
      console.log("输入值", this.searchCity);
      let cities = city.split("@");
      this.searchList = [];

      cities.forEach((item) => {
        if (item.indexOf(this.searchCity) !== -1) {
          this.searchList.push(item.split("|"));
        }
      });

      console.log("搜索列表", this.searchList);
    },
  },

  updated() {
    if (!this.searchCity) {
      let view = uni.createSelectorQuery().select(".hot_city");
      view
        .boundingClientRect((data) => {
          this.HotCityHight = data.height;
        })
        .exec();
    }
  },

  onLoad(data) {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.cityType = data.type;
    this.cityAddress = data.address;
    this.getCityCode();
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
    .city_list {
      padding: 0 28upx 0 32upx;
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
          width: 85upx;
          text-align: center;
          padding-left: 10upx;
          box-sizing: border-box;
        }
      }

      &.gps_city {
        padding: 0 28upx 0 32upx;
        .list_item .city_box .city_item {
          margin-bottom: 0;
        }
      }
      .list_item {
        display: block;
        .city_province {
          padding: 36upx 0 17upx;
          font-size: 27upx;
          font-weight: bold;
          color: #000;
        }
        .city_box {
          display: flex;
          flex-wrap: wrap;
          color: #000;
          .city_item {
            font-size: 25upx;
            width: 132upx;
            height: 56upx;
            border: 2upx solid rgba(214, 214, 214, 1);
            box-shadow: -2upx 12upx 18upx rgba(0, 0, 0, 0.04);
            border-radius: 20upx;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 30upx;
            text {
              width: 100%;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              text-align: center;
            }
            &:not(:nth-child(4n)) {
              margin-right: 28upx;
            }
            &.city_item_icon {
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
        .city_province_train {
          display: flex;
          align-items: center;
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
            border-bottom: 2upx solid rgba(214, 214, 214, 0.5);
            padding: 32upx 0 28upx;
            display: flex;
            align-items: center;
            .city_name {
              margin-left: auto;
              font-size: 24upx;
              font-weight: 500;
              color: rgba(175, 185, 196, 1);
            }
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
