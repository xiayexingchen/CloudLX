<template>
  <view class="login-container">
    <!-- 简约背景 -->
    <view class="background-wave"></view>

    <!-- 主要内容区域 -->
    <view class="content-wrapper">
      <!-- Logo区域 -->
      <view class="logo-section">
        <view class="avatar-wrapper">
          <view class="avatar-border">
            <view class="avatar-container">
              <image src="/static/loginLogo.png" mode="aspectFit" class="avatar-image" />
            </view>
          </view>
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
              <checkbox :checked="isChecked" :value="isChecked" color="#3B82F6" />
              <text class="privacy-text">我已阅读并同意</text>
              <text class="privacy-link" @click="showPrivacyPolicy">《隐私协议》</text>
            </label>
          </checkbox-group>
        </view>
      </view>
    </view>

    <!-- 授权弹窗 -->
    <u-popup mode="bottom" v-model="showAuthPopup" :round="16">
      <view class="auth-popup">
        <view class="popup-header">
          <text class="popup-title">微信授权登录</text>
        </view>

        <view class="auth-content">
          <view class="auth-item">
            <u-icon name="account" size="22" color="var(--primary-color)" />
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
      if (response.code === 21021) { //新用户，要初始化信息
        uni.navigateTo({
          url: '/pages/userInfoInit/userInfoInit'
        });
      } else { //21011老用户，直接登录
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
  // 清新配色系统
  :root {
    // 主色调：清新淡雅的天蓝色系
    --primary-color: #3B82F6; // 主要品牌色，可替换#60A5FA等
    --primary-dark: #3B82F6; // 深色调
    --primary-light: #93C5FD; // 浅色调

    // 背景色
    --bg-primary: #F0F9FF; // 主背景色
    --bg-secondary: #FFFFFF; // 次要背景

    // 文字颜色
    --text-primary: #1E40AF; // 主要文字
    --text-secondary: #60A5FA; // 次要文字
    --text-light: #FFFFFF; // 亮色文字

    // 功能色
    --success: #34D399; // 成功色
    --error: #F87171; // 错误色
  }

  .login-container {
    min-height: 100vh;
    background-color: var(--bg-primary);
    position: relative;
  }

  .background-wave {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 45vh;
    background: linear-gradient(180deg, var(--primary-color) 0%, var(--bg-primary) 100%);
    border-radius: 0 0 50% 50% / 0 0 100px 100px;
    opacity: 0.1;
  }

  .content-wrapper {
    position: relative;
    padding: 40px 30px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .logo-section {
    margin-top: 10vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;

    .avatar-wrapper {
      width: 110px;
      height: 110px;
      display: flex; // 添加flex布局
      justify-content: center; // 水平居中
      align-items: center; // 垂直居中
      position: relative;
    }

    .avatar-border {
      width: 100%;
      height: 100%;
      border-radius: 28px;
      background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
      padding: 2px;
      display: flex; // 添加flex布局
      justify-content: center; // 水平居中
      align-items: center; // 垂直居中

      &:hover {
        box-shadow: 0 6px 24px rgba(96, 165, 250, 0.2);
      }
    }

    .avatar-container {
      width: calc(100% - 4px); // 减去padding的宽度
      height: calc(100% - 4px); // 减去padding的高度
      background: var(--bg-secondary);
      border-radius: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    }

    .avatar-image {
      width: 75%;
      height: 75%;
      object-fit: contain;
      display: block; // 确保图片作为块级元素
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      align-items: center; // 文字也居中对齐
      gap: 12px;

      .brand-name {
        font-size: 26px;
        font-weight: 600;
        color: var(--text-primary);
        line-height: 1.2;
      }

      .brand-slogan {
        font-size: 15px;
        color: var(--text-secondary);
        line-height: 1.4;
      }
    }
  }


  .login-section {
    margin-bottom: 10vh;

    .welcome-text {
      text-align: center;
      margin-bottom: 30px;

      .title {
        font-size: 24px;
        font-weight: 600;
        color: var(--text-primary);
        display: block;
        margin-bottom: 8px;
      }

      .subtitle {
        font-size: 15px;
        color: var(--text-secondary);
      }
    }

    .login-btn {
      width: 100%;
      height: 50px;
      background: var(--primary-color);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-size: 16px;
      color: var(--text-light);
      border: none;
      box-shadow: 0 4px 12px rgba(96, 165, 250, 0.2);
      transition: all 0.2s ease;

      .wechat-icon {
        width: 22px;
        height: 22px;
      }

      &:active {
        transform: translateY(1px);
      }

      &:disabled {
        background: var(--primary-light);
        box-shadow: none;
      }
    }
  }

  .privacy-section {
    margin-top: 20px;
    text-align: center;

    .privacy-label {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      font-size: 14px;

      .privacy-text {
        color: var(--text-secondary);
      }

      .privacy-link {
        color: var(--primary-color);
      }
    }
  }

  .auth-popup {
    background: var(--bg-secondary);
    padding: 24px;

    .popup-header {
      text-align: center;
      margin-bottom: 20px;

      .popup-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 6px;
      }

      .popup-desc {
        font-size: 14px;
        color: var(--text-secondary);
      }
    }

    .auth-content {
      margin-bottom: 24px;

      .auth-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: var(--bg-primary);
        border-radius: 12px;
        font-size: 14px;
        color: var(--text-secondary);
      }
    }

    .auth-buttons {
      display: flex;
      gap: 12px;

      .auth-btn {
        flex: 1;
        height: 44px;
        border-radius: 10px;
        font-size: 15px;
        border: none;

        &.cancel {
          background: var(--bg-primary);
          color: var(--text-secondary);
        }

        &.confirm {
          background: var(--primary-color);
          color: var(--text-light);
        }
      }
    }
  }
</style>