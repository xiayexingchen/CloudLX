<template>
  <view class="robot-view">
    <!-- 视频流容器 -->
    <view class="video-section">
      <image :src="videoUrl" mode="aspectFill" class="video-stream" />
      <!-- 实时数据悬浮层 -->
      <view class="data-overlay">
        <view class="data-row">
          <view class="data-item">
            <text class="label">速度</text>
            <text class="value">{{linear_velocity.toFixed(1)}} m/s</text>
          </view>
          <view class="data-item">
            <text class="label">角速度</text>
            <text class="value">{{angular_velocity.toFixed(1)}} rad/s</text>
          </view>
        </view>
        <view class="data-row">
          <view class="data-item">
            <text class="label">经度</text>
            <text class="value">{{longitude}}°E</text>
          </view>
          <view class="data-item">
            <text class="label">纬度</text>
            <text class="value">{{latitude}}°N</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 配送信息卡片 -->
    <view class="delivery-card">

      <view class="status-section">
        <view class="status-header">
          <view class="status-icon">
            <u-icon name="car-fill" color="#007AFF" size="28" />
          </view>
          <view class="status-info">
            <text class="status-text">包裹配送中</text>
            <text class="robot-id-text">配送机器人：{{ fmtRobotId? fmtRobotId:'等待空闲机器人'}}</text>
          </view>
        </view>
        <view class="estimated-time">
          预计送达时间：{{ packageInfo.deliveryTime }}
        </view>
      </view>


      <view class="package-info">
        <view class="info-item">
          <text class="label">包裹类型</text>
          <text class="value">{{ packageInfo.packageType }}</text>
        </view>
        <view class="info-item">
          <text class="label">订单编号</text>
          <text class="value">{{ packageInfo.orderId }}</text>
        </view>
        <view class="info-item">
          <text class="label">收货地址</text>
          <text class="value">{{ packageInfo.address }}</text>
        </view>
      </view>

      <view class="action-buttons">
        <button class="action-btn robot-view" @click="navigateBackToRobotPage">
          <u-icon name="camera-fill" size="20" />
          <text>返回机器人？？？这按钮咋写</text>
        </button>
        <button class="action-btn contact" @click="handleContact">
          <u-icon name="server-man" size="20" />
          <text>联系客服</text>
        </button>
      </view>
    </view>

  </view>
</template>

<style lang="scss" scoped>
  .robot-view {
    height: 100vh;
    background: #f8f9fa;
    position: relative;
  }

  .video-section {
    width: 100%;
    height: 60vh;
    position: relative;
    background: #000;
    overflow: hidden;

    .video-stream {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .data-overlay {
      position: absolute;
      top: 20rpx;
      left: 20rpx;
      padding: 20rpx;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(10px);
      border-radius: 16rpx;

      .data-row {
        display: flex;
        gap: 24rpx;
        margin-bottom: 16rpx;

        &:last-child {
          margin-bottom: 0;
        }
      }

      .data-item {
        .label {
          font-size: 24rpx;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 4rpx;
          display: block;
        }

        .value {
          font-size: 28rpx;
          color: #fff;
          font-family: 'Monaco', monospace;
        }
      }
    }
  }

  .delivery-card {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: #ffffff;
    border-radius: 24px 24px 0 0;
    padding: 24px;
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08);

    .status-section {
      margin-bottom: 20px;

      .status-header {
        display: flex;
        align-items: center;
        margin-bottom: 12px;

        .status-icon {
          width: 48px;
          height: 48px;
          background: rgba(0, 122, 255, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
        }

        .status-info {
          .status-text {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            display: block;
            margin-bottom: 4px;
          }

          .robot-id {
            color: #666;
            font-size: 14px;
            font-family: monospace; // 使用等宽字体，使数字对齐
            font-weight: 500;
          }
        }
      }

      .estimated-time {
        font-size: 15px;
        color: #007AFF;
        font-weight: 500;
      }
    }

    .package-info {
      margin-bottom: 24px;

      .info-item {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid #f5f5f5;

        .label {
          color: #666;
          font-size: 14px;
        }

        .value {
          color: #333;
          font-size: 14px;
          font-weight: 500;
        }
      }
    }

    .action-buttons {
      display: flex;
      gap: 12px;

      .action-btn {
        flex: 1;
        height: 44px;
        border-radius: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-size: 14px;
        border: none;

        &.robot-view {
          background: #007AFF;
          color: #fff;
        }

        &.contact {
          background: #f5f5f5;
          color: #333;
        }
      }
    }
  }
</style>

<script setup>
  import {
    ref,
    onMounted,
    getCurrentInstance
  } from 'vue';

  // 数据响应式声明
  const videoUrl = ref('http://120.46.199.126:8080/robot/video_stream');
  const robotId = ref(1);
  const linear_velocity = ref(0);
  const angular_velocity = ref(0);
  const longitude = ref(0);
  const latitude = ref(0);
  const packageType = ref('');
  const orderId = ref('');
  const deliveryAddress = ref('');
  const packageInfo = ref({});
  const robotInfo = ref({});
  const status = ref(null);

  // 获取上一页面传递的数据
  const getDeliveryData = async () => {
    try {
      const instance = getCurrentInstance().proxy
      const eventChannel = instance.getOpenerEventChannel();
      if (!instance) return;
      eventChannel.on('robotData', (data) => {
        robotId.value = data.robotId;
        packageInfo.value = data.packageInfo;
        robotInfo.value = data.robotInfo;
        status.value = data.status;
        polyline.value = data.polyline;
        markers.value = data.markers;

        console.log('Received data in robotView:', data);
      });
    } catch (error) {
      console.error('Failed to get delivery data:', error);
    }
  };

  // 模拟实时数据更新
  let timer;
  onMounted(() => {
    getDeliveryData();
    timer = setInterval(() => {
      // 这里添加实际的数据更新逻辑
    }, 1000);
  });

  onUnmounted(() => {
    if (timer) clearInterval(timer);
  });
</script>