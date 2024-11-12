<template>
  <view class="page-container">
    <!-- 背景图片部分 -->
    <view class="background-section">
      <image src="/static/logo.png" mode="aspectFill" class="bg-image" />
    </view>

    <!-- 可拖动的圆角矩形部分 -->
    <view class="movable-section">
      <!-- Logo圆形 -->
      <view class="logo-circle">
        <image src="/static/logo.png" mode="aspectFit" class="logo-image" />
      </view>

      <!-- 内容区域 -->
      <view class="content">
        <view class="welcome-text">欢迎使用 云行包裹</view>

        <button class="btn-wechat" @click="openAuthPopup">
          <text>微信一键登录</text>
        </button>

        <button class="btn-phone" @click="toSmsLogin">
          <text>手机号快速登录</text>
        </button>

        <view class="privacy-text">
          <checkbox style="transform: scale(0.7)" :checked="isChecked" :value="isChecked" class="more">
          </checkbox>
          我已阅读并同意《隐私协议》
        </view>
      </view>
    </view>

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
  const isChecked = ref(false); // 使用ref创建响应式数据
  // 打开授权弹窗
  function openAuthPopup() {
    if (isChecked === false) {
      console.log("请选择协议")
    } else {
      showAuthPopup.value = true;
    }

  }


  function toSmsLogin() {
    uni.navigateTo({
      // url: '/pages/smsLogin/smsLogin'
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
</script>

<style scoped>
  .page-container {
    height: 100vh;
    position: relative;
  }

  .background-section {
    height: 50vh;
    position: fixed;
    width: 100%;
    top: 0;
  }

  .bg-image {
    width: 100%;
    height: 100%;
  }


  .movable-section {
    position: absolute;
    top: 30vh;
    width: 100%;
    min-height: 60vh;
    background-color: #fff;
    border-radius: 20px 20px 0 0;
    padding: 5rpx, 5rpx, 5rpx, 5rpx;
    /* 这样才能滑动，什么原理padding: 60rpx 40rpx; */
  }

  .logo-circle {
    position: absolute;
    top: -100rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 200rpx;
    height: 200rpx;
    background: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo-image {
    width: 150rpx;
    height: 150rpx;
  }

  .welcome-text {
    text-align: center;
    font-size: 36rpx;
    font-weight: bold;
    margin: 140rpx 0 60rpx;
  }

  .btn-wechat {
    background: #0069FF;
    color: #fff;
    height: 90rpx;
    line-height: 90rpx;
    border-radius: 45rpx;
    margin-bottom: 30rpx;
    margin-left: 20rpx;
    margin-right: 20rpx;
  }

  .btn-phone {
    background: #fff;
    color: #333;
    height: 90rpx;
    line-height: 90rpx;
    border-radius: 45rpx;
    margin-left: 20rpx;
    margin-right: 20rpx;
    border: 2px solid #e9e9e9;
  }

  .privacy-text {
    text-align: center;
    font-size: 24rpx;
    color: #999;
    margin-top: 40rpx;
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