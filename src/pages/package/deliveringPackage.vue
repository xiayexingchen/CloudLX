<template>
  <view class="delivery-container">
    <!-- 地图区域 -->
    <map class="delivery-map" :latitude="packageInfo.latitude" :longitude="packageInfo.longitude" :markers="markers"
      :scale="16">
      <!-- 可选：添加地图控件 -->
      <cover-view class="map-controls">
        <cover-image src="/static/location.png" class="location-btn" @tap="moveToCurrentLocation" />
      </cover-view>
    </map>

    <!-- 配送信息卡片 -->
    <view class="delivery-card">
      <!-- 配送状态 -->
      <view class="status-section">
        <view class="status-header">
          <view class="status-icon">
            <u-icon name="car-fill" color="#007AFF" size="28" />
          </view>
          <view class="status-info">
            <text class="status-text">包裹配送中</text>
            <text class="robot-id">配送机器人：{{ packageInfo.robotId }}</text>
          </view>
        </view>
        <view class="estimated-time">
          预计送达时间：{{ packageInfo.deliveryTime }}
        </view>
      </view>

      <!-- 包裹信息 -->
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

      <!-- 操作按钮 -->
      <view class="action-buttons">
        <button class="action-btn robot-view" @click="navigateToRobotPage">
          <u-icon name="camera-fill" size="20" />
          <text>查看机器人视角</text>
        </button>
        <button class="action-btn contact" @click="handleContact">
          <u-icon name="server-man" size="20" />
          <text>联系客服</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
  import {
    ref,
    computed,
    reactive,
    onMounted,
    getCurrentInstance
  } from 'vue';

  const packageInfo = ref({
    latitude: 30.5937,
    longitude: 114.3055,
    robotId: '',
    deliveryTime: '',
    packageType: '',
    orderId: '',
    address: ''
  });

  // 计算地图标记点
  const markers = computed(() => [{
    id: 1,
    latitude: packageInfo.value.latitude,
    longitude: packageInfo.value.longitude,
    title: '配送机器人',
    iconPath: '/static/robot.png',
    width: 40,
    height: 40
  }]);

  // 获取上一页面数据
  onMounted(() => {
    const instance = getCurrentInstance().proxy
    const eventChannel = instance.getOpenerEventChannel();
    eventChannel.on('deliveryData', (data) => {
      packageInfo.value = {
        ...packageInfo.value,
        ...data
      };
    });
  });

  // 定位到当前位置
  const moveToCurrentLocation = () => {
    uni.getLocation({
      type: 'gcj02',
      success: (res) => {
        packageInfo.value.latitude = res.latitude;
        packageInfo.value.longitude = res.longitude;
      }
    });
  };

  // 跳转到机器人视角
  const navigateToRobotPage = () => {
    uni.navigateTo({
      url: '/pages/robotView/robotView',
      success: (res) => {
        res.eventChannel.emit('robotData', {
          robotId: packageInfo.value.robotId
        });
      }
    });
  };

  // 联系客服
  const handleContact = () => {
    uni.showModal({
      title: '联系客服',
      content: '客服电话：400-123-4567',
      confirmText: '拨打',
      success: (res) => {
        if (res.confirm) {
          uni.makePhoneCall({
            phoneNumber: '4001234567'
          });
        }
      }
    });
  };
</script>

<style lang="scss" scoped>
  .delivery-container {
    height: 100vh;
    position: relative;
    background: #f5f6fa;
  }

  .delivery-map {
    width: 100%;
    height: 65%;

    .map-controls {
      position: absolute;
      right: 20px;
      bottom: 30px;

      .location-btn {
        width: 40px;
        height: 40px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
            font-size: 14px;
            color: #666;
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

  // 暗黑模式适配
  @media (prefers-color-scheme: dark) {
    .delivery-card {
      background: #1a1a1a;

      .status-section {
        .status-header {
          .status-info {
            .status-text {
              color: #fff;
            }

            .robot-id {
              color: #999;
            }
          }
        }
      }

      .package-info {
        .info-item {
          border-bottom-color: #333;

          .label {
            color: #999;
          }

          .value {
            color: #fff;
          }
        }
      }

      .action-buttons {
        .action-btn.contact {
          background: #333;
          color: #fff;
        }
      }
    }
  }
</style>