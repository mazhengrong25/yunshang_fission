<!--
 * @Description: 航班筛选
 * @Author: wish.WuJunLong
 * @Date: 2020-07-22 10:50:47
 * @LastEditTime: 2020-09-11 18:21:41
 * @LastEditors: wish.WuJunLong
--> 
<template>
  <view :class="['filter_box',{'mini': filterMini}]">
    <view @click="filterBtn('price')" :class="['filter_btn',{active: filterBtnActive === 'price'}]">
      <image
        v-if="filterBtnActive === 'price'"
        class="filter_btn_icon"
        src="@/static/filter_price_active.png"
        mode="contain"
      />
      <image v-else class="filter_btn_icon" src="@/static/filter_price.png" mode="contain" />
			<image class="filter_btn_mini_icon" src="@/static/filter_price_active.png" mode="contain" />
      <text>价格(低-高)</text>
    </view>
    <view class="filter_line"></view>
    <view @click="filterBtn('time')" :class="['filter_btn',{active: filterBtnActive === 'time'}]">
      <image
        v-if="filterBtnActive === 'time'"
        class="filter_btn_icon"
        src="@/static/filter_time_active.png"
        mode="contain"
      />
      <image v-else class="filter_btn_icon" src="@/static/filter_time.png" mode="contain" />
			<image class="filter_btn_mini_icon" src="@/static/filter_time_active.png" mode="contain" />
      <text>时间(早-晚)</text>
    </view>
    <view class="filter_line"></view>
    <view class="filter_btn" @click="openFilter">
      <image class="filter_btn_icon" src="@/static/filter_btn.png" mode="contain" />
			<image class="filter_btn_mini_icon" src="@/static/filter_btn_active.png" mode="contain" />
      <text>筛选</text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    filterMini: {
      // 筛选盒子类型
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      filterBtnActive: "time" // 筛选排序默认值
    };
  },
  methods: {
    // 排序按钮
    filterBtn(val) {
      this.$emit('filterType',val)
      this.filterBtnActive = val;
    },
    // 打开筛选弹窗
    openFilter() {
      this.$emit("openFilter", true);
    }
  },
};
</script>

<style scoped lang="less">
.filter_box {
  display: flex;
  align-items: center;
  justify-content: center;
  &.mini {
    .filter_btn {
			flex-direction: row;
			color: #333;
      .filter_btn_mini_icon {
				margin-right: 14upx;
				display: block;
			}
			.filter_btn_icon{
				display: none;
			}
    }
    .filter_line {
      height: 50upx;
    }
  }
  .filter_line {
    width: 2upx;
    height: 60upx;
    background: rgba(175, 185, 196, 0.2);
  }
  .filter_btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 20upx;
    font-weight: 400;
    color: #AFB9C4;
    width: 236upx;
    &.active {
      color: rgba(0, 112, 226, 1);
    }
		.filter_btn_icon,
		.filter_btn_mini_icon {
      width: 40upx;
      height: 40upx;
      object-fit: contain;
      margin-bottom: 6upx;
      display: inline-flex;
      align-items: center;
      justify-content: center;
		}
		.filter_btn_mini_icon{
			display: none;
		}
  }
}
</style>
