<template>
  <view class="container">
    <!-- 标题和Logo -->
    <view class="header">
      <image src="/static/logo.png" class="logo" />
      <text class="welcome-text">欢迎使用 云行包裹</text>
    </view>

    <!-- 微信快捷登录按钮 -->
    <u-button type="primary" class="login-button" @click="openAuthPopup">
      微信快捷登录
    </u-button>
    <!-- 手机验证码登录按钮 -->
    <u-button type="primary" class="login-button" @click="toSmsLogin">
      手机验证码登录
    </u-button>

    <!-- 底部弹窗（是否授权一键登录） -->
    <u-popup mode="bottom" v-model="showAuthPopup" :overlay="true" overlay-style="background-color: rgba(0, 0, 0, 0.5);"
      @close="showAuthPopup = false">
      <view class="auth-popup">
        <text class="popup-title">云行包裹</text>
        <text class="popup-subtitle">一键登录</text>
        <u-button type="primary" @click="confirmAuth">允许</u-button>
        <u-button type="default" @click="showAuthPopup = false">不允许</u-button>
      </view>
    </u-popup>
  </view>
</template>

<script setup>
  import {
    ref
  } from 'vue';
  import {
    fetchUserProfileAPI
  } from '../../api/api';

  const showAuthPopup = ref(false);

  // 打开授权弹窗
  function openAuthPopup() {
    showAuthPopup.value = true;
  }


  function toSmsLogin() {
    uni.navigateTo({
      url: '/pages/smsLogin/smsLogin'
    });
  }

  // 确认授权并调用登录函数并处理结果
  async function confirmAuth() {
    const isNewUser = ref(1);
    showAuthPopup.value = false;

    try {
      const response = await wxlogin(); // 等待wxlogin Promise解决
      console.log(response.data); // 这里可以获取到token
      const token = response.data; // 假设 data 是 token
      console.log(response.msg); // 这里可以获取到登录成功的消息

      if (response.code === 21021) {
        isNewUser.value = 0; // 标记为新用户
        uni.navigateTo({
          url: '/pages/userInfoInit/userInfoInit'
        });
      } else { //此处code是21011
        uni.switchTab({
          url: '/pages/home/home'
        });
      }
    } catch (error) {
      console.error("登录失败", error); // 处理登录失败的情况
    }
  }

  // 微信登录函数-拿到code
  // 微信登录函数-转发给后端
  async function wxlogin() {
    return new Promise((resolve, reject) => {
      uni.login({
        provider: 'weixin', // 使用微信登录
        success: function(loginRes) {
          console.log(loginRes);
          const wxCode = loginRes.code;
          fetchUserProfileAPI(wxCode)
            .then((result) => { // 这里的result是fetchUserProfileAPI返回的结果
              return {
                data: result.data,
                code: result.code,
                msg: result.msg
              };
            })
            .then((response) => { // 这里的response是上面返回的对象
              console.log(response);
              // 保存 token
              uni.setStorageSync('token', response.data);
              console.log('Bearer ' + uni.getStorageSync('token'))
              resolve(response); // 使用resolve返回response对象
            })
            .catch((error) => { // 处理可能出现的错误
              reject(error); // 使用reject返回错误信息
            });
        },
        fail: function(error) {
          reject(error); // 如果uni.login失败，使用reject返回错误信息
        }
      });
    });
  }



  // 模拟微信登录函数（wxlogin）
  // 实际上，这里你应该替换成实际的登录逻辑
  // async function wxlogin() {
  //   // 模拟获取 token 和 isNewUser 状态
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve({
  //         token: "sample_token",
  //         isNewUser: Math.random() > 0.5
  //       });
  //     }, 1000);
  //   });
  // }
</script>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f7f8fa;
  }

  .header {
    text-align: center;
    margin-bottom: 40px;
  }

  .logo {
    width: 100px;
    height: 100px;
  }

  .welcome-text {
    font-size: 18px;
    color: #333;
    margin-top: 10px;
  }

  .login-button {
    width: 80%;
    margin-top: 20px;
  }

  .auth-popup {
    padding: 20px;
    text-align: center;
  }

  .popup-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }

  .popup-subtitle {
    font-size: 16px;
    color: #666;
    margin: 10px 0 20px 0;
  }
</style>