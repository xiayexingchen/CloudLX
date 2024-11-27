<template>
  <view class="identity-code-container">
    <view class="identity-card" @click="handleCardClick">
      <!-- ... existing name ... -->
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
    </view>
  </view>
</template>

<script setup>
  import {
    ref,
    onMounted
  } from 'vue'

  const identityCode = ref('CS8071565621545699A')
  const currentTime = ref('')

  const updateTime = () => {
    const now = new Date()
    currentTime.value = now.toLocaleTimeString('zh-CN', {
      hour12: false
    })
  }

  const handleCardClick = () => {
    // 可以添加刷新动画或其他交互效果
    updateTime()
  }

  onMounted(() => {
    updateTime()
    setInterval(updateTime, 1000)
  })
</script>

<style scoped>
  .identity-code-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #007aff;
  }

  .identity-card {
    background-color: #fff;
    padding: 30px;
    border-radius: 15px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
  }

  .identity-card:active {
    transform: scale(0.98);
  }

  .barcode {
    margin: 25px 0;
    padding: 15px;
    background-color: #f8f8f8;
    border-radius: 8px;
  }

  .barcode-text {
    font-family: monospace;
    font-size: 18px;
    letter-spacing: 1px;
  }

  .barcode-image {
    height: 80px;
    margin-top: 10px;
    background: repeating-linear-gradient(90deg, #000 0, #000 2px, #fff 2px, #fff 4px);
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    font-size: 14px;
  }

  .refresh-hint {
    color: #666;
    display: flex;
    align-items: center;
  }

  .icon {
    margin-right: 4px;
  }

  .time {
    color: #888;
  }
</style>