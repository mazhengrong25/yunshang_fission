<!--
 * @Description:火车票 --- 城市选择
 * @Author: mzr
 * @Date: 2021-09-28 11:53:26
 * @LastEditTime: 2021-09-28 18:11:57
 * @LastEditors: mzr
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
        placeholder="输入城市名称或者字母，至少输入两个字符"
      />
      <view class="close_input" v-if="searchCity !== ''" @click="closeSearch">取消</view>
    </view>

    <scroll-view
      :enable-back-to-top="true"
      :scroll-into-view="intoindex"
      :scroll-y="true"
      :scroll-top="scrollTop"
      class="city_main"
    >
      <!-- 热门城市 -->
      <view class="city_list">
        <view class="list_item">
          <view class="city_province">热门城市</view>
          <view class="city_box">
            <view class="city_item" v-for="(item,index) in hotCity" :key="index" @click="jumpIndex(item)">
                {{ item.name}}
            </view>
          </view>
        </view>
      </view>
      
      <view class="city_list">
        <view class="list_item" v-for="(item, index) in cityData" :key="index">
          <view class="city_province">{{item.provice}}</view>
          <view class="city_box">
            <view class="city_item" v-for="(oitem,oindex) in item.city" :key="oindex">
                {{ oitem.name}}
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

     
    
  </view>
</template>

<script>
import city from "@/tools/cityCode.json";
export default {
  data() {
    return {
      iStatusBarHeight: 0,
      cityData:[], // 城市

      hotCity:[], // 热门城市
      
    };
  },
  methods: {
   
    // 获取城市
    getCityCode() {
      this.cityData = city
      this.cityData.forEach((item) => {
        item.city.forEach((pitem) => {
          if(
            pitem.name === '北京市区' ||
            pitem.name === '上海市区' ||
            pitem.name === '天津' ||
            pitem.name === '重庆市区' ||
            pitem.name === '长沙' ||
            pitem.name === '长春' ||
            pitem.name === '成都' ||
            pitem.name === '福州' ||
            pitem.name === '广州' ||
            pitem.name === '贵阳' ||
            pitem.name === '哈尔滨'
          ) {
            this.hotCity.push(pitem)
          }
        }) 
      })
    },
  
    // 返回城市
    jumpIndex(val) {
      let data = {
        name:val.name
      }
      uni.setStorageSync('trainCity',JSON.stringify(data))
      uni.navigateBack;
    }

 
   
  },

  onLoad(data) {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
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
    .city_list {
      padding: 0 28upx var(--status-bar-height) 32upx;
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
          }
        }
      }
    }
  }
}
</style>