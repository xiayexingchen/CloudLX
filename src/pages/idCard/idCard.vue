<template>
  <view class="identity-code-container">
    <view class="background-animation"></view>

    <view class="code-card">
      <!-- 顶部装饰 -->
      <view class="card-decoration">
        <view class="decoration-circle"></view>
        <view class="decoration-line"></view>
      </view>

      <!-- 身份码展示 -->
      <view class="code-content">
        <text class="code-label">身份码</text>
        <text class="code-value">{{ userCode }}</text>

        <!-- 条形码 -->
        <view class="barcode-container">
          <u-code ref="uCode" :text="userCode" code-type="barcode" :width="300" :height="100" bgColor="#ffffff"
            color="#000000"></u-code>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
  import {
    ref,
    onMounted
  } from 'vue';
  import {
    fetchUserCodeAPI
  } from '@/api/api-user';

  const userCode = ref('');

  // 获取身份码
  const fetchUserCode = async () => {
    try {
      const res = await fetchUserCodeAPI();
      if (res.code === 21061) {
        userCode.value = res.data;
      }
    } catch (error) {
      console.error('获取身份码失败:', error);
    }
  };

  onMounted(() => {
    fetchUserCode();
  });
</script>

<style lang="scss" scoped>
  .identity-code-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #1a1a1a;
    position: relative;
    overflow: hidden;
  }

  .background-animation {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(125deg, #3B82F6, #93C5FD);
    background-size: 400% 400%;
    animation: gradientBG 15s ease infinite;
    opacity: 0.9;
  }

  @keyframes gradientBG {
    0% {
      background-position: 0% 50%
    }

    50% {
      background-position: 100% 50%
    }

    100% {
      background-position: 0% 50%
    }
  }

  .code-card {
    width: 85%;
    max-width: 600rpx;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    border-radius: 30rpx;
    padding: 40rpx;
    box-shadow: 0 8rpx 32rpx rgba(59, 130, 246, 0.3);
    position: relative;
    z-index: 1;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .card-decoration {
    display: flex;
    align-items: center;
    margin-bottom: 40rpx;

    .decoration-circle {
      width: 20rpx;
      height: 20rpx;
      background: #3B82F6;
      border-radius: 50%;
      margin-right: 20rpx;
      animation: pulse 2s infinite;
    }

    .decoration-line {
      flex: 1;
      height: 2rpx;
      background: linear-gradient(to right, #3B82F6, transparent);
    }
  }

  .code-content {
    text-align: center;
    padding: 40rpx 0;

    .code-label {
      font-size: 28rpx;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 20rpx;
      display: block;
    }

    .code-value {
      font-size: 60rpx;
      font-weight: bold;
      color: #fff;
      letter-spacing: 4rpx;
      font-family: monospace;
      text-shadow: 0 0 10rpx rgba(59, 130, 246, 0.5);
      margin-bottom: 40rpx;
      display: block;
    }
  }

  .barcode-container {
    background: #ffffff;
    padding: 20rpx;
    border-radius: 16rpx;
    margin: 0 auto;
    width: fit-content;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }

    50% {
      transform: scale(1.2);
      opacity: 0.8;
    }

    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>