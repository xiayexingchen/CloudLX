<template>
  <view class="robot-view">
    <!-- 视频流容器 -->
    <view class="video-container">
      <image :src="imageSrc" mode="aspectFit" />
      
      <!-- 数据显示层 -->
      <view class="data-overlay">
        <view class="data-item">
          <text class="label">经度:</text>
          <text class="value">{{ longitude }}°E</text>
        </view>
        <view class="data-item">
          <text class="label">纬度:</text>
          <text class="value">{{ latitude }}°N</text>
        </view>
        <view class="data-item">
          <text class="label">速度:</text>
          <text class="value">{{ speed }} km/h</text>
        </view>
        <view class="data-item">
          <text class="label">电量:</text>
          <text class="value">{{ battery }}%</text>
        </view>
        <view class="data-item">
          <text class="label">信号强度:</text>
          <text class="value">{{ signal }}%</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 视频流地址
const imageSrc = ref('http://120.46.199.126/robot/video_stream');

// 模拟数据
const longitude = ref(116.3972);
const latitude = ref(39.9075);
const speed = ref(0);
const battery = ref(85);
const signal = ref(92);

// 模拟数据更新
let timer;

const updateData = () => {
  // 模拟数据变化
  longitude.value += (Math.random() - 0.5) * 0.0001;
  latitude.value += (Math.random() - 0.5) * 0.0001;
  speed.value = Math.floor(Math.random() * 5 * 10) / 10;
  battery.value = Math.max(0, Math.min(100, battery.value + (Math.random() - 0.5)));
  signal.value = Math.max(0, Math.min(100, signal.value + (Math.random() - 0.5) * 2));
};

onMounted(() => {
  // 每秒更新一次数据
  timer = setInterval(updateData, 1000);
});

onUnmounted(() => {
  // 清理定时器
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style lang="scss" scoped>
.robot-view {
  width: 100%;
  height: 100vh;
  background-color: #000;
  position: relative;
}

.video-container {
  width: 100%;
  height: 100%;
  position: relative;

  image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.data-overlay {
  position: absolute;
  top: 20rpx;
  left: 20rpx;
  padding: 20rpx;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 10rpx;
  z-index: 1;
}

.data-item {
  margin-bottom: 10rpx;
  display: flex;
  align-items: center;

  &:last-child {
    margin-bottom: 0;
  }

  .label {
    color: #ffffff;
    font-size: 24rpx;
    margin-right: 10rpx;
  }

  .value {
    color: #00ff00;
    font-size: 24rpx;
    font-family: monospace;
  }
}
</style>