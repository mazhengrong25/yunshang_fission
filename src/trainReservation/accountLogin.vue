<!--
 * @Description: 托管模式 ---  账号登陆
 * @Author: mzr
 * @Date: 2021-10-20 15:00:18
 * @LastEditTime: 2021-10-26 17:46:07
 * @LastEditors: mzr
-->
<template>
    <view class="account">
        <yun-header :statusHeight="iStatusBarHeight" centerTitle="账号登陆"></yun-header>
        <view class="header_box">
            <input 
              type="text"
              class="add_passenger_btn"
              v-model="searchAccountInput"
              placeholder="账号查询"
              placeholder-style="font-size:26;font-weight:400;color:#fff;"
              v-on:input="searchAccount()"
            />
        </view>
        <view class="account_main">
            <view class="mian_header">
                <view class="title">12306账号列表</view>
                <view class="filter" @click="addAccount">新增账号</view>
            </view>

            <scroll-view :enable-back-to-top="true" :scroll-y="true" class="account_list">
              <radio-group>
                <label class="item_account" v-for="(item,index) in accountList" :key="index"
                  @click="openRadio(item)"
                >
                  <view class="item_account_total">
                        <view class="checked">
                            <radio color="#0070E2" :value="item" />
                        </view> 
                        <view class="account_title">账号：
                            <text>{{item.name}}</text>
                        </view>
                    </view>
                    <view class="item_action" @click.stop="deleteAccount(item)"></view>
                </label>
              </radio-group>
              <view v-if="accountList.length < 1" class="no_item_account">暂无账号列表相关信息</view>
            </scroll-view> 
            
        </view>
        <view class="submit_box">
            <button class="submit_btn" @click="submitBtn(selectItem)">确认</button>
        </view>
        <!-- 账号验证 -->
        <accountVerify 
          ref="trainAccountVerify"
          :phone="phoneNumber"
          :accountMessageCode="accountMessageCode"
          @changeCode="changeCode"
          @openVerify="openVerify(selectItem.id)"
        ></accountVerify>
        <!-- 接受验证码弹窗 -->
        <!-- <uni-popup ref="receiveCode" type="center" class="receive_code">
          <view class="receiveBox">
              <view class="receiveTitle">请输入短信验证码</view>
              <view class="code_warn">短信验证码已经发送到您的手机</view>
              <view class="receive_input">
                <input 
                  password="true"
                  placeholder="短信验证码"
                  placeholder-style="fontSize:26upx; fontWeight:400;color:#95A1AE;"
                  v-model="accountMessageCode"
                />
              </view>
              <view class="box_bottom">
                <view class="submit_btn active" @click="colse">取消</view>
                <view class="submit_btn" @click="submit">确定</view>
              </view>
          </view>
        </uni-popup> -->
    </view>
</template>

<script>
import train from "@/api/trainInquiry.js"
import accountVerify from '@/components/account_verify.vue'

export default {
    components: {
        accountVerify
    },
    data() {
        return {
            iStatusBarHeight: 0, // 状态栏高度
            accountList: [], // 账号列表
            searchAccountInput:"", // 列表搜索值

            selectItem:{
              id:"",
              name:""
            }, // 选中信息
            accountMessageCode:"", // 验证码
            phoneNumber:"", // 手机号
        }
    },
    methods: {
        
        // 短信验证码输入值
        changeCode(val) {
          this.accountMessageCode = val
        },
        
        // 单选赋值
        openRadio(val) {
          this.selectItem = {
            id : val.id,
            name : val.name
          }
        },
        // 新增账号跳转
        addAccount() {
            uni.navigateTo({
                url: '/trainReservation/addAccount'
            })
        },
        // 账号搜索
        searchAccount(){
          this.getAccountList(this.searchAccountInput)
        },
        // 获取账号列表
        getAccountList(val) {
          let data = {
            name: val || '',
          }

          train.getAccountList(data).then((res) => {
              if (res.errorcode === 10000) {
                  this.accountList = res.data.data
              } else {
                  uni.showToast({
                      title: res.msg,
                      icon: "none",
                      duration: 3000,
                  })

              }
          })
        },
        // 点击确认 
        submitBtn(val) {
          let data = {
            account: {
              id:val.id
            }
          }
          train.getSelectAccount(data).then((res) => {
              // 跳转到查询页面
              if (res.errorcode === 10000) {
                uni.navigateTo({
                  url:
                  "/trainReservation/trainReservation" 
                }) 
              } else {
                // 账号验证
                this.phoneNumber = val.name
                this.$refs.trainAccountVerify.openExp();
              }
          })
        },
        // 短信验证
        openVerify(e) {
          if(!this.accountMessageCode) {
            return false
          }else {

            let data = {
              account: {
                id:e,
                code:this.accountMessageCode,
                type:"2"
              }
            }
            train.getMessVerify(data).then((res) => {
              if(res.errorcode === 10000) {
                this.$refs.trainAccountVerify.closeExp();
                this.submitBtn();
              }else {
                uni.showModal({
                  title: res.msg,
                  icon: "none",
                  duration: 3000,
                })
              }
            })
          }
        },

        // 删除账号 
        deleteAccount(val) {
          let  _that = this
            uni.showModal({
                title: '警告',
                content: `是否删除 ${val.name} 账号`,
                success: function (res) {
                    if (res.confirm) {
                        let data = {
                            id: val.id
                        }
                        train.getDeleteAccount(data).then((res) => {
                            if (res.errorcode === 10000) {
                              _that.getAccountList();
                               uni.showToast({
                                    title: res.msg,
                                    icon: "none",
                                    duration: 3000,
                              });
                            } else {
                                uni.showToast({
                                    title: res.msg,
                                    icon: "none",
                                    duration: 3000,
                                });
                            }
                        })


                    }
                }
            });

        },
    },
    onShow() {
      this.getAccountList();
    },
    onLoad(data) {
        this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    }
}
</script>

<style lang="less" scoped>
.account {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: rgba(243, 245, 247, 1);
    .header_box {
        padding: 27upx 0;
        background: rgba(0, 112, 226, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        .add_passenger_btn {
            border: 2upx solid rgba(255, 255, 255, 1);
            width: 710upx;
            height: 90upx;
            text-align: center;
            border-radius: 90upx;
            font-size: 26upx;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            letter-spacing: 6upx;
            position: relative;
            /deep/ .input-placeholder::before {
              content: '';
              position: absolute;
              width: 30upx;
              height: 30upx;
              background: url(@/static/train_account_search.png) no-repeat center center;
              background-size: contain;
              bottom: 30upx;
              left: 260upx;
            }
        }
    }
    .account_main {
        flex: 1;
        width: 100%;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        .mian_header {
            padding: 0 40upx;
            margin: 40upx 0 30upx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .title {
                font-size: 30upx;
                font-weight: bold;
                color: rgba(51, 51, 51, 1);
            }
            .filter {
                font-size: 24upx;
                font-weight: bold;
                color: rgba(0, 112, 226, 1);
                display: inline-flex;
                align-items: center;
                justify-content: right;
            }
        }
        .account_list {
            background: #ffffff;
            box-shadow: 0upx 12upx 18upx rgba(0, 0, 0, 0.04);
            border-radius: 20upx;
            margin: 0upx 20upx;
            height: 85%;
            width: auto;
            .item_account {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 40upx 0upx;
                margin: 0upx 30upx;
                .item_account_total {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    .checked {
                        transform: scale(0.7);
                    }
                    .account_title {
                        display: inline-flex;
                        font-size: 26upx;
                        font-weight: 400;
                        color: #95a1ae;
                        text {
                            color: #2a2a2a;
                        }
                    }
                }
                .item_action {
                    width: 36upx;
                    height: 36upx;
                    background: url("@/static/train_account_delete.png")
                        no-repeat center center;
                    background-size: contain;
                }
                &:not(:last-child) {
                    border-bottom: 1upx solid #f1f3f5;
                }
            }
            .no_item_account {
                font-size: 26upx;
                font-weight: 400;
                color: #95a1ae;
                text-align: center;
                margin-top: 120upx;
            }
        }
    }
    .submit_box {
        background: rgba(255, 255, 255, 1);
        height: 100upx;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 24upx;
        padding-bottom: var(--status-bar-height);
        border-top: 2upx solid rgba(229, 229, 229, 1);
        .submit_btn {
            flex: 1;
            height: 90upx;
            margin: 0 50upx;
            background: linear-gradient(
                90deg,
                rgba(0, 112, 226, 1) 0%,
                rgba(86, 197, 255, 1) 100%
            );
            box-shadow: 0 6upx 12upx rgba(0, 112, 226, 0.3);
            border-radius: 80upx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32upx;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            letter-spacing: 10upx;
        }
    }
    // 接受验证码
    // .receive_code {
    //   .receiveBox {
    //     width: 540upx;
    //     height: 376upx;
    //     background-color: #fff;
    //     text-align: center;
    //     .receiveTitle {
    //       font-size: 36upx;
    //       color: #2a2a2a;
    //       font-weight: bold;
    //       padding: 36upx 0upx 24upx;
    //     }
    //     .code_warn {
    //       color: #FB9826;
    //       font-size: 26upx;
    //       margin: 20upx 0upx;
    //     }
    //     .receive_input {
    //       display: inline-flex;
    //       align-items: center;
    //       justify-content: center;
    //       background: #f1f3f5;
    //       padding: 20upx;
    //       margin-bottom: 30upx;
    //     }
    //     .box_bottom {
    //       margin-top: auto;
    //       display: flex;
    //       align-items: center;
    //       height: 90upx;
    //       .submit_btn {
    //         flex: 1;
    //         background: rgba(0, 112, 226, 0.1);
    //         font-size: 28upx;
    //         font-weight: 400;
    //         color: rgba(0, 112, 226, 1);
    //         display: flex;
    //         align-items: center;
    //         justify-content: center;
    //         height: 100%;
    //         &.active {
    //           background: rgba(0, 112, 226, 1);
    //           color: rgba(255, 255, 255, 1);
    //         }
    //       }
    //     }
    //   }
    // }
}
</style>