<!--
 * @Description:火车票 --- 城市选择
 * @Author: mzr
 * @Date: 2021-09-28 11:53:26
 * @LastEditTime: 2021-10-12 09:50:12
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
        placeholder="请输入省份名称"
        v-on:input="openSearchStauts()"
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
      <!-- 定位 -->
      <view class="city_list" v-if="!searchCity">
        <view class="list_item">
          <view class="city_province">当前定位</view>
          <view class="city_box">
            <view class="city_item city_item_icon"
              @click="gpsGetAddress(Areaaddress.city)"
            >{{Areaaddress.city || '获取定位中'}}</view>
          </view>
        </view>
      </view>

      <!-- 热门城市 -->
      <view class="city_list" v-if="!searchCity">
        <view class="list_item">
          <view class="city_province">热门城市</view>
          <view class="city_box">
            <view class="city_item" 
              v-for="item in hotCity" :key="item" 
              @click="jumpIndex(item)"
            >{{item.name}}</view>
          </view>
        </view>
      </view>
      
      <view class="city_list" v-if="!searchCity">
        <view class="list_item" v-for="(item, index) in cityData" :key="index">
          <view class="city_province">{{item.provice}}</view>
          <view class="city_box">
            <view class="city_item" 
              v-for="(oitem,oindex) in item.city" :key="oindex"
              @click="jumpIndex(oitem)"
            >
              <text>{{ oitem.name}}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="city_list" v-if="searchCity">
        <view class="list_item" v-for="(item, index) in searchList" :key="index">
          <view class="city_province_train">
            <view class="city_type">{{item.type}}</view>
            <view class="city_text">{{item.unit}}</view>
          </view>
          <view
            class="item_city"
            v-for="(oitem, oindex) in item.city[0]"
            :key="oindex"
            @click="jumpIndex(oitem)"
          >
            <view class="city_airport">{{oitem.name}}</view>
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
import city from "@/tools/cityCode.json";
export default {
  data() {
    return {
      iStatusBarHeight: 0,

      cityData:[], // 城市
      hotCity : [
        {
          name:"北京市",
          id: 1,
        },
        {
          name:"上海市",
          id: 2,
        },
        {
          name:"天津",
          id: 3,
        },
        {
          name:"重庆市",
          id: 4,
        },
        {
          name:"上海市",
          id: 5,
        },
        {
          name:"长沙",
          id: 6,
        },
        {
          name:"长春",
          id: 7,
        },
        {
          name:"成都",
          id: 8,
        }
      ],
      cityType:"", // 出发  到达
      cityAddress:"", // 地址

      Areaaddress: {}, // 当前定位地理位置
      searchCity:"", // 城市搜索
      searchList:[], // 城市搜索列表
    };
  },
  methods: {
   
    // 获取城市
    getCityCode() {
      this.cityData = city
    },
  
    // 返回城市
    jumpIndex(val) {
      let data = {
        data : {
          city_name: val.name
        },
        status:this.cityType,
      }
      uni.setStorageSync('city',JSON.stringify(data))
      uni.navigateBack();
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
    gpsGetAddress(val) {
      if (val) {
        this.getCityCode(
          this.cityData.filter(
            (item) => val.indexOf(item.name) !== -1
          )[0],
          "city"
        );
      }
    },

    // 清空搜索框
    closeSearch() {
      this.searchCity = "";
      this.searchList = [];
      this.getCityCode();
    },

    // 输入框状态
    openSearchStauts() {
      console.log('输入值',this.searchCity)
      this.searchList = [];
      this.cityList  = []; // 从原数组分离城市数组

      let provinceList = []; // 省份

      this.cityData.forEach((item) => {
        provinceList.push(item.provice)
        this.cityList.push(item.city)
      })
     
      console.log('城市列表',this.cityList)
      provinceList.forEach((item,index) => {
       
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
              city:[]
        });
        this.cityData.forEach((oitem) => {
          if(this.searchList[index].unit === oitem.provice) {
            this.searchList[index].city.push(oitem.city)
          }
        })
      });

      let data = [];
      this.searchList.forEach((item) => {
        if(item.unit.indexOf(this.searchCity) !== -1) {
          data.push(item)
        }
      })
      this.searchList = data

  
      console.log('搜索列表',this.searchList,'原始数组',this.cityData)
    } 
   
  },

  onLoad(data) {
    this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.cityType = data.type
    this.cityAddress = data.address

    this.getCityCode();
    this.getUserAddress();
    
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