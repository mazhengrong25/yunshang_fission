<!--
 * @Description: 信息弹窗模块
 * @Author: wish.WuJunLong
 * @Date: 2020-07-17 13:40:40
 * @LastEditTime: 2020-07-17 13:59:59
 * @LastEditors: wish.WuJunLong
--> 
<template>
  <div class="message_dialog">
    <div class="message_content">
      <div class="title">温馨提示</div>
      <div class="message_list">
        <div class="list_item">
          <p>多程搜索仅适用于出镜航班，请至少添加一个中国港澳台或国际城市</p>
        </div>
        <div class="list_item">
          <div>场景一：多目的地行程</div>
          <p>去程：深圳-东京</p>
          <p>回程：大阪-深圳</p>
        </div>
        <div class="list_item">
          <div>场景二：出发与返回地不同</div>
          <p>去程：深圳-首尔</p>
          <p>回程：首尔-佛山</p>
        </div>

        <div class="list_item">
          <p>目前仅支持两程搜索</p>
        </div>

      </div>
    </div>

    <div class="close_btn" @click="closeDialog"></div>

  </div>
</template>

<script>
export default {
  methods: {
    closeDialog(){
      this.$emit('closeDialog', true)
    },
  }
}
</script>

<style lang="less" scoped>
  .message_dialog{
    padding: 0 50upx;
    .message_content{
      background-color: #fff;
      padding: 44upx 54upx 92upx;
      border-radius:20upx;
      .title{
        font-size:36upx;
        font-weight:bold;
        color:rgba(51,51,51,1);
        margin-bottom: 50upx;
        text-align: center;
      }
      .message_list{
        .list_item{
          &:not(:last-child){
            margin-bottom: 40upx;
          }
          >div{
            font-size:24upx;
            font-weight:bold;
            color:rgba(51,51,51,1);
            margin-bottom: 14upx;
          }
          >p{
            font-size:24upx;
            font-weight:500;
            color:rgba(51,51,51,1);
          }
        }
      }
    }
    .close_btn{
      background: url('../static/dialog_close_btn.png') no-repeat center center;
      background-size: contain;
      width: 80upx;
      height: 80upx;
      margin: 60upx auto 0;
    }
  }
</style>
