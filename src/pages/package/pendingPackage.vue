<template>
  <view class="container">
    <!-- 地图区域 -->
    <map class="map" :latitude="packageInfo.latitude" :longitude="packageInfo.longitude" :markers="markers" :scale="16"
      @regionchange="onRegionChange">
      <!-- 地图控件 -->
      <cover-view class="map-controls">
        <cover-image src="/static/location.png" class="location-btn" @tap="moveToCurrentLocation" />
      </cover-view>
    </map>

    <!-- 包裹信息卡片 -->
    <view class="info-card">
      <!-- 状态栏 -->
      <view class="status-bar">
        <view class="status-icon">
          <u-icon name="bag-fill" color="#007AFF" size="28" />
        </view>
        <text class="status-text">待取件</text>
      </view>

      <!-- 包裹信息列表 -->
      <scroll-view class="info-scroll" scroll-y="true">
        <view class="info-list">
          <view class="info-item">
            <text class="label">包裹编号</text>
            <text class="value">{{ packageInfo.trackingNumber }}</text>
          </view>
          <view class="info-item">
            <text class="label">取货地址</text>
            <text class="value">{{ packageInfo.address }}</text>
          </view>
          <view class="info-item">
            <text class="label">取货柜号</text>
            <text class="value highlight">{{ packageInfo.locker }}</text>
          </view>
          <view class="info-item">
            <text class="label">物品类型</text>
            <text class="value">{{ packageInfo.itemType }}</text>
          </view>
          <view class="info-item">
            <text class="label">入柜时间</text>
            <text class="value">{{ packageInfo.entryTime }}</text>
          </view>
          <!--          <view class="info-item">
            <text class="label">取件码</text>
            <text class="value code">{{ packageInfo.pickupCode }}</text>
          </view> -->
        </view>
      </scroll-view>

      <!-- 操作按钮 -->
      <view class="action-buttons">
        <button class="action-btn navigate" @click="handleNavigation">
          <u-icon name="map" size="20" />
          <text>导航到柜子</text>
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

  // 包裹信息
  const packageInfo = ref({
    latitude: 28.178328,
    longitude: 112.944991,
    trackingNumber: '',
    address: '',
    locker: '',
    itemType: '',
    entryTime: '',
    pickupCode: ''
  });

  // 地图标记点
  const markers = computed(() => [{
    id: 1,
    latitude: packageInfo.value.latitude,
    longitude: packageInfo.value.longitude,
    title: '快递柜位置',
    iconPath: '/static/location.png',
    width: 32,
    height: 32
  }]);

  // 获取上一页面数据
  onMounted(() => {
    const instance = getCurrentInstance().proxy
    const eventChannel = instance.getOpenerEventChannel();
    eventChannel.on('pendingData', (data) => {
      packageInfo.value = {
        ...packageInfo.value,
        ...data
      };
    });
    console.log(packageInfo);
  });

  // 地图区域变化
  const onRegionChange = (e) => {
    console.log('地图区域变化:', e);
  };

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

  // 导航到柜子
  const handleNavigation = () => {
    uni.openLocation({
      latitude: packageInfo.value.latitude,
      longitude: packageInfo.value.longitude,
      name: packageInfo.value.address,
      address: `${packageInfo.value.address} (柜号: ${packageInfo.value.locker})`
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
  .container {
    height: 100vh;
    background: #f5f6fa;
  }

  .map {
    height: 55%;
    width: 100%;
    position: relative;

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

  .info-card {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 45%;
    background: #ffffff;
    border-radius: 24px 24px 0 0;
    padding: 20px;
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08);

    .status-bar {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .status-icon {
        width: 44px;
        height: 44px;
        background: rgba(0, 122, 255, 0.1);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
      }

      .status-text {
        font-size: 18px;
        font-weight: 600;
        color: #333;
      }
    }

    .info-scroll {
      height: calc(100% - 140px);
    }

    .info-list {
      .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
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

          &.highlight {
            color: #007AFF;
            font-weight: 600;
          }

          &.code {
            color: #f56c6c;
            font-weight: 600;
            font-size: 16px;
          }
        }
      }
    }

    .action-buttons {
      position: absolute;
      bottom: 20px;
      left: 20px;
      right: 20px;
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

        &.navigate {
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
    .info-card {
      background: #1a1a1a;

      .status-bar {
        .status-text {
          color: #fff;
        }
      }

      .info-list {
        .info-item {
          border-bottom-color: #333;

          .label {
            color: #999;
          }

          .value {
            color: #fff;

            &.code {
              color: #ff6b6b;
            }
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