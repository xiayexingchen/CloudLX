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
          <view class="barcode-inner">
            <view v-for="(width, index) in barcodePattern" :key="index" class="code-line" :style="{
                  width: width + 'rpx',
                  backgroundColor: index % 2 === 0 ? '#000' : '#fff'
                }">
            </view>
            <view v-for="(width, index) in barcodePattern" :key="index" class="code-line" :style="{
                  width: width + 'rpx',
                  backgroundColor: index % 2 === 0 ? '#000' : '#fff'
                }">
            </view>
            <view v-for="(width, index) in barcodePattern" :key="index" class="code-line" :style="{
                  width: width + 'rpx',
                  backgroundColor: index % 2 === 0 ? '#000' : '#fff'
                }">
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { fetchUserCodeAPI } from '@/api/api-user'  // 导入接口

const userCode = ref(''); // 初始化为空字符串

// 获取用户身份码
const fetchUserCode = async () => {
  try {
    const res = await fetchUserCodeAPI()
    if (res.code === 21061) {  // 替换为实际的成功状态码
      userCode.value = res.data 
    } else {
      uni.showToast({
        title: res.msg || '获取身份码失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('获取身份码失败:', error)
    uni.showToast({
      title: '获取身份码失败',
      icon: 'none'
    })
  }
}

// 在页面加载时获取身份码
onMounted(() => {
  fetchUserCode()
})

  // 修改条形码模式生成逻辑
  const barcodePattern = computed(() => {
    // 开始和结束的保护字符，增加宽度
    const guardPattern = [6, 6, 6, 6]; // [黑,白,黑,白] - 增加宽度

    // 将字符转换为条形码宽度模式，增加基础宽度
    const codePattern = userCode.value.split('').map(char => {
      const value = char.charCodeAt(0);
      // 增加基础宽度（4-8rpx）
      return value % 5 + 4;
    });

    // 重复模式以增加整体宽度
    const repeatedPattern = [...codePattern, ...codePattern];

    // 组合完整的条形码模式
    return [...guardPattern, ...repeatedPattern, ...guardPattern.reverse()];
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
    padding: 40rpx 30rpx;
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
    width: 100%; // 确保内容占满卡片宽度
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
    // width: 100%; // 确保文本占满宽度
    text-align: center; // 文本居中
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

    .barcode-inner {
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 80%; // 确保最小宽度
      height: 100%;
    }

    .code-line {
      height: 100%;
      display: inline-block;
      transition: all 0.3s ease;
    }
  }

  // 扫描动画效果
  .css-barcode::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    right: -100%;
    height: 2rpx;
    background: linear-gradient(90deg,
        transparent,
        rgba(96, 165, 250, 0.8),
        transparent);
    animation: scan 2s linear infinite;
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