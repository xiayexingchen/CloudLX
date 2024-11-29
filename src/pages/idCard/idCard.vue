<template>
  <view class="identity-code-container">
    <view class="identity-card">
      <view class="card-header">
        <!--        <text class="title">身份码</text>
        <text class="time">{{ currentTime }}</text> -->
      </view>
      <view class="barcode">
        <text class="barcode-text">{{ identityCode }}</text>
        <view class="barcode-image"></view>
      </view>
    </view>
  </view>
</template>
<!-- <template>
  <view class="identity-code-container">
    <view class="identity-card" @click="handleCardClick">
      <view class="barcode">
        <text class="barcode-text">{{ identityCode }}</text>
        <view class="barcode-image"></view>
      </view>
      <view class="card-footer">
        <text class="refresh-hint">
          <text class="icon">🔄</text> 点击刷新
        </text>
        <text class="time">{{ currentTime }}</text>
      </view>
            <view class="card-footer">
        <text class="validity">本码1分钟内有效</text>
      </view>
    </view>
  </view>
</template> -->

<script setup>
  import {
    ref,
    onMounted
  } from 'vue'

  const identityCode = ref('CS8071565621545699A')
  const currentTime = ref('')

  // const updateTime = () => {
  //   const now = new Date()
  //   currentTime.value = now.toLocaleTimeString('zh-CN', {
  //     hour12: false
  //   })
  // }

  const handleCardClick = () => {
    // 可以添加刷新动画或其他交互效果
    updateTime()
  }

  // onMounted(() => {
  //   updateTime()
  //   setInterval(updateTime, 1000)
  // })
</script>

<style scoped>
  .identity-code-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
    padding: 30rpx;
  }

  .identity-card {
    background-color: #fff;
    padding: 40rpx;
    border-radius: 24rpx;
    width: 85%;
    box-shadow: 0 8rpx 32rpx rgba(37, 99, 235, 0.2);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40rpx;
  }

  .title {
    font-size: 36rpx;
    font-weight: 600;
    color: #1F2937;
  }

  .time {
    font-size: 32rpx;
    color: #3B82F6;
    font-weight: 500;
  }

  .barcode {
    background: #F8FAFC;
    padding: 40rpx 30rpx;
    border-radius: 16rpx;
    border: 2rpx solid rgba(59, 130, 246, 0.1);
  }

  .barcode-text {
    font-family: monospace;
    font-size: 36rpx;
    letter-spacing: 2rpx;
    color: #1F2937;
    font-weight: 500;
  }

  .barcode-image {
    height: 120rpx;
    margin-top: 30rpx;
    background: repeating-linear-gradient(90deg,
        #000 0,
        #000 2px,
        #fff 2px,
        #fff 4px);
    border-radius: 4rpx;
  }

  .card-footer {
    margin-top: 40rpx;
    text-align: center;
  }

  .validity {
    font-size: 28rpx;
    color: #6B7280;
    background: rgba(59, 130, 246, 0.1);
    padding: 12rpx 32rpx;
    border-radius: 100rpx;
  }
</style>