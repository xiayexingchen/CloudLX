<template>
  <view class="sms-login">
    <u-text class="welcome-text">欢迎登录</u-text>
    <u-input v-model="phone" placeholder="请输入手机号" type="number" class="phone-input" />
    <u-button type="info" @click="getCode">获取验证码</u-button>
    <u-input v-model="code" placeholder="请输入验证码" class="code-input" />
    <u-button type="primary" @click="login">登录</u-button>
    <u-checkbox :checked="agree">我已阅读并同意 <u-link href="#" text="用户协议" /> <u-link href="#" text="隐私政策" /></u-checkbox>
  </view>
</template>

<script>
  import {
    sendMessageAPI
  } from '../../api/api';
  export default {
    data() {
      return {
        phone: '',
        code: '',
        agree: true
      }
    },
    methods: {
      getCode() {
        // 调用发送验证码接口
        sendMessageAPI(this.phone).then(response => {
          console.log(response);
          if (response.code === 21031) {
            // this.toHome();
          } else {
            uni.showToast({
              title: '验证码发送失败',
              icon: 'none'
            });
          }
        }).catch(error => {
          console.error('发送验证码失败', error);
        });
      },
      login() {
        if (!this.phone || !this.code || !this.agree) {
          uni.showToast({
            title: '请填写完整信息',
            icon: 'none'
          });
          return;
        }
        uni.showToast({
          title: '登录成功',
          icon: 'success'
        });
        // 登录逻辑
        uni.switchTab({
          url: "/pages/home/home"
        })
      }
    }
  }
</script>

<style scoped>
  .sms-login {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding-top: 40px;
  }

  .welcome-text {
    font-size: 18px;
    margin-bottom: 20px;
  }

  .phone-input,
  .code-input {
    width: 80%;
    margin-top: 10px;
  }
</style>