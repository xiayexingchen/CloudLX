<template>
  <view class="identity-code-container">
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

        <!-- CSS生成的身份码图案 -->
        <view class="css-barcode">
          <view v-for="(width, index) in barcodePattern" 
                :key="index" 
                class="code-line"
                :style="{
                  width: width + 'rpx',
                  backgroundColor: index % 2 === 0 ? '#000' : '#fff'
                }">
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';

const userCode = ref('B0R6BWM3VE'); // 你的身份码

// 生成条形码模式
const barcodePattern = computed(() => {
  // 开始和结束的保护字符
  const guardPattern = [3, 3, 3, 3]; // [黑,白,黑,白]
  
  // 将字符转换为条形码宽度模式
  const codePattern = userCode.value.repeat(2).split('').map(char => {
    const value = char.charCodeAt(0);
    // 根据字符ASCII值生成不同的宽度（2-4rpx）
    return value % 3 + 2;
  });
  
  // 组合完整的条形码模式
  return [...guardPattern, ...codePattern, ...guardPattern.reverse()];
});
</script>

<style lang="scss" scoped>
.identity-code-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%);
  padding: 30rpx;
}

.code-card {
  width: 90%;
  max-width: 600rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(10px);
}

.card-decoration {
  margin-bottom: 30rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  
  .decoration-circle {
    width: 12rpx;
    height: 12rpx;
    border-radius: 50%;
    background: #93C5FD;
  }
  
  .decoration-line {
    flex: 1;
    height: 4rpx;
    background: linear-gradient(90deg, #93C5FD 0%, transparent 100%);
  }
}

.code-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
}

.code-label {
  font-size: 28rpx;
  color: #64748B;
  letter-spacing: 2rpx;
}

.code-value {
  font-size: 40rpx;
  font-weight: 600;
  color: #1E293B;
  letter-spacing: 4rpx;
  font-family: monospace;
}

.css-barcode {
  width: 100%;
  height: 140rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  padding: 20rpx;
  border-radius: 16rpx;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 10rpx rgba(0, 0, 0, 0.05);
  
  .code-line {
    height: 100%;
    display: inline-block;
  }
}

// 扫描动画效果
.css-barcode::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2rpx;
  background: linear-gradient(90deg, 
    transparent,
    #60A5FA,
    transparent
  );
  animation: scan 2s linear infinite;
  opacity: 0.5;
}

@keyframes scan {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(200%);
  }
}

// 添加卡片悬浮效果
.code-card {
  transition: transform 0.3s ease;
  
  &:active {
    transform: scale(0.98);
  }
}
</style>