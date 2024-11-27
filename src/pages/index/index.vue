<template>
  <view class="login-container">
    <!-- 云朵装饰背景 -->
    <view class="cloud-decoration">
      <view class="cloud cloud-1"></view>
      <view class="cloud cloud-2"></view>
      <view class="cloud cloud-3"></view>
    </view>

    <!-- Logo区域 -->
    <view class="logo-section">
      <view class="logo-wrapper">
        <image src="/static/loginLogo.png" mode="aspectFit" class="logo-image" />
      </view>
      <view class="brand-text">
        <text class="brand-name">云行者包裹</text>
        <text class="brand-slogan">让每一个包裹都乘云而行</text>
      </view>
    </view>

    <!-- 登录区域 -->
    <view class="login-section">
      <view class="welcome-text">
        <text class="title">欢迎使用</text>
        <text class="subtitle">请使用微信账号登录体验完整功能</text>
      </view>

      <button class="login-btn" @click="openAuthPopup" :disabled="!isChecked">
        <text>微信一键登录</text>
      </button>
      <!-- 隐私协议 -->
      <view class="privacy-section">
        <checkbox-group @change="handlePrivacyCheck">
          <label class="privacy-label">
            <checkbox :checked="isChecked" :value="isChecked" color="#4A90E2" />
            <text class="privacy-text">我已阅读并同意</text>
            <text class="privacy-link" @click="showPrivacyPolicy">《隐私协议》</text>
          </label>
        </checkbox-group>
      </view>
    </view>

    <!-- 授权弹窗 -->
    <u-popup mode="bottom" v-model="showAuthPopup">
      <view class="auth-popup">
        <view class="popup-header">
          <text class="popup-title">微信授权登录</text>
          <text class="popup-desc">授权后将获得更好的服务体验</text>
        </view>
        <view class="auth-content">
          <view class="auth-item">
            <u-icon name="account" size="20" color="#4A90E2" />
            <text>获得您的公开信息（昵称、头像等）</text>
          </view>
        </view>
        <view class="auth-buttons">
          <button class="auth-btn cancel" @click="showAuthPopup = false">取消</button>
          <button class="auth-btn confirm" @click="confirmAuth">确认授权</button>
        </view>
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
  } from '../../api/api-user.js';
  const showAuthPopup = ref(false);
  const isChecked = ref(false);


  // 处理隐私协议勾选
  const handlePrivacyCheck = (e) => {
    isChecked.value = e.detail.value.length > 0;
  };

  // 打开授权弹窗
  const openAuthPopup = () => {
    console.log('1');
    if (!isChecked.value) {
      console.log('2');
      uni.showToast({
        title: '请先同意隐私协议',
        icon: 'none'
      });
      return;
    }
    showAuthPopup.value = true;
  };

  // 确认授权
  const confirmAuth = async () => {
    showAuthPopup.value = false;
    try {
      const response = await wxlogin();
      if (response.code === 21021) {
        uni.navigateTo({
          url: '/pages/userInfoInit/userInfoInit'
        });
      } else { //21011?
        uni.switchTab({
          url: '/pages/home/home'
        });
      }
    } catch (error) {
      console.error('登录失败', error);
      uni.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      });
    }
  };
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
  // 显示隐私政策
  const showPrivacyPolicy = () => {
    // 实现隐私政策查看逻辑
  };
</script>
<style lang="scss" scoped>
  .login-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
    position: relative;
    overflow: hidden;
  }

  .cloud-decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100vh;
    pointer-events: none;

    .cloud {
      position: absolute;
      background: #FFFFFF;
      border-radius: 50px;
      opacity: 0.8;
      filter: blur(20px);
      animation: float 20s infinite ease-in-out;

      &-1 {
        width: 150px;
        height: 60px;
        top: 15%;
        left: -30px;
        animation-delay: -2s;
      }

      &-2 {
        width: 100px;
        height: 40px;
        top: 25%;
        right: -20px;
        animation-delay: -5s;
      }

      &-3 {
        width: 120px;
        height: 50px;
        top: 45%;
        left: 30%;
        animation-delay: -8s;
      }
    }
  }

  .logo-section {
    padding-top: 15vh;
    text-align: center;

    .logo-wrapper {
      width: 120px;
      height: 120px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 30px;
      box-shadow: 0 8px 32px rgba(100, 181, 246, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: float 6s infinite ease-in-out;

      .logo-image {
        width: 90px;
        height: 90px;
      }
    }

    .brand-text {
      margin-top: 24px;

      .brand-name {
        font-size: 28px;
        font-weight: 600;
        color: #1565C0;
        display: block;
        margin-bottom: 8px;
      }

      .brand-slogan {
        font-size: 16px;
        color: #42A5F5;
        font-weight: 500;
      }
    }
  }

  .login-section {
    margin-top: 12vh;
    padding: 0 40px;

    .welcome-text {
      text-align: center;
      margin-bottom: 32px;

      .title {
        font-size: 24px;
        font-weight: 600;
        color: #1565C0;
        display: block;
        margin-bottom: 8px;
      }

      .subtitle {
        font-size: 15px;
        color: #42A5F5;
      }
    }

    .login-btn {
      width: 100%;
      height: 54px;
      background: linear-gradient(135deg, #1E88E5 0%, #1565C0 100%);
      border-radius: 27px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      font-size: 17px;
      color: #FFFFFF;
      border: none;
      box-shadow: 0 8px 24px rgba(33, 150, 243, 0.3);
      transition: all 0.3s ease;

      &:active {
        transform: translateY(2px);
        box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2);
      }

      &:disabled {
        background: #90CAF9;
        box-shadow: none;
      }

      .wechat-icon {
        width: 24px;
        height: 24px;
      }
    }
  }

  .privacy-section {
    margin-top: 24px;
    text-align: center;

    .privacy-label {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      font-size: 14px;

      .privacy-text {
        color: #42A5F5;
      }

      .privacy-link {
        color: #1565C0;
      }
    }
  }

  .auth-popup {
    background: #FFFFFF;
    border-radius: 24px 24px 0 0;
    padding: 24px;

    .popup-header {
      text-align: center;
      margin-bottom: 24px;

      .popup-title {
        font-size: 20px;
        font-weight: 600;
        color: #1565C0;
        display: block;
        margin-bottom: 8px;
      }

      .popup-desc {
        font-size: 14px;
        color: #42A5F5;
      }
    }

    .auth-content {
      margin-bottom: 24px;

      .auth-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: #E3F2FD;
        border-radius: 12px;
        font-size: 15px;
        color: #1565C0;
      }
    }

    .auth-buttons {
      display: flex;
      gap: 12px;

      .auth-btn {
        flex: 1;
        height: 48px;
        border-radius: 24px;
        font-size: 16px;
        border: none;

        &.cancel {
          background: #E3F2FD;
          color: #42A5F5;
        }

        &.confirm {
          background: linear-gradient(135deg, #1E88E5 0%, #1565C0 100%);
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2);
        }
      }
    }
  }

  @keyframes float {

    0%,
    100% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-20px);
    }
  }
</style>