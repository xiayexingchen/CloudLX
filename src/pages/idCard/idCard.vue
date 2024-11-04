<template>
  <view class="identity-code-container">
    <view class="identity-card">
      <text class="name">张三</text>
      <view class="barcode">
        <text>CS8071565621545699A</text>
      </view>
      <text class="refresh-hint">点击可放大刷新</text>
    </view>
  </view>
</template>

<script setup>
  // 身份码页面的逻辑
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
    padding: 20px;
    border-radius: 10px;
    text-align: center;
  }

  .name {
    font-size: 24px;
    font-weight: bold;
  }

  .barcode {
    margin: 20px 0;
  }

  .refresh-hint {
    color: #888;
  }
</style>