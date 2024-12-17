<template>
  <view class="timeout-container">
    <!-- 状态区域 -->
    <view class="status-card">
      <view class="status-icon">
        <!--        <u-icon name="warning-fill" color="#ff4d4f" size="48" /> -->
      </view>
      <text class="status-title">已超时</text>
      <text class="status-desc">您的包裹已被转移至他处，请及时联系管理员</text>
    </view>

    <!-- 包裹信息卡片 -->
    <view class="info-card">
      <view class="card-header">
        <text class="title">包裹信息</text>
      </view>
      <view class="info-list">
        <view class="info-item">
          <text class="label">包裹编号</text>
          <text class="value">{{ packageInfo.trackingNumber }}</text>
        </view>
        <view class="info-item">
          <text class="label">物品类型</text>
          <text class="value">{{ packageInfo.itemType }}</text>
        </view>
        <view class="info-item">
          <text class="label">入柜时间</text>
          <text class="value">{{ packageInfo.entryTime }}</text>
        </view>
        <!--        <view class="info-item">
          <text class="label">超时时长</text>
          <text class="value highlight">{{ packageInfo.timeoutDuration }}</text>
        </view> -->
      </view>
    </view>

    <!-- 联系方式卡片 -->
    <view class="info-card">
      <view class="card-header">
        <text class="title">管理员联系方式</text>
      </view>
      <view class="contact-info">
        <text class="contact-name">刘*</text>
        <text class="contact-phone">130****1111</text>
        <button class="call-button" @click="handleCall">
          <u-icon name="phone-fill" color="#fff" size="20" />
          <text>一键拨号</text>
        </button>
      </view>
    </view>

    <!-- 温馨提示 -->
    <view class="notice-card">
      <view class="notice-header">
        <u-icon name="info-circle-fill" color="#1890ff" size="20" />
        <text>温馨提示</text>
      </view>
      <text class="notice-content">'为了确保物品安全，超时包裹已被转移到专门的存储区域。请尽快联系管理员取回您的物品，感谢您的理解与配合。'</text>
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
    statusText: '',
    statusDesc: '',
    trackingNumber: '',
    itemType: '',
    entryTime: '',
    timeoutDuration: '',
    adminName: '',
    adminPhone: '',
    notice: ''
  });

  // 获取上一页面传递的数据
  onMounted(() => {
    const instance = getCurrentInstance().proxy
    const eventChannel = instance.getOpenerEventChannel();
    eventChannel.on('timeoutData', (data) => {
      packageInfo.value = {
        ...packageInfo.value,
        ...data
      };
    });
  });

  // 拨打电话
  const handleCall = () => {
    if (packageInfo.value.adminPhone) {
      uni.makePhoneCall({
        phoneNumber: packageInfo.value.adminPhone,
        success: () => {
          console.log('拨打电话成功');
        },
        fail: () => {
          uni.showToast({
            title: '拨打电话失败',
            icon: 'none'
          });
        }
      });
    }
  };
</script>

<style lang="scss" scoped>
  .timeout-container {
    min-height: 100vh;
    background-color: #f5f6fa;
    padding: 20px;
  }

  .status-card {
    background: linear-gradient(135deg, #3B82F6, #3B82F6);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 20px;
    text-align: center;
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(255, 77, 79, 0.2);

    .status-icon {
      margin-bottom: 16px;
    }

    .status-title {
      font-size: 20px;
      font-weight: 600;
      display: block;
      margin-bottom: 8px;
    }

    .status-desc {
      font-size: 14px;
      opacity: 0.9;
    }
  }

  .info-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    .card-header {
      margin-bottom: 16px;

      .title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        position: relative;
        padding-left: 12px;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 16px;
          background: #3B82F6;
          border-radius: 2px;
        }
      }
    }

    .info-list {
      .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;

        &:not(:last-child) {
          border-bottom: 1px solid #f5f5f5;
        }

        .label {
          color: #666;
          font-size: 14px;
        }

        .value {
          color: #333;
          font-size: 14px;
          font-weight: 500;

          &.highlight {
            color: #3B82F6;
            font-weight: 600;
          }
        }
      }
    }
  }

  .contact-info {
    text-align: center;
    padding: 16px 0;

    .contact-name {
      font-size: 16px;
      color: #333;
      font-weight: 500;
      display: block;
      margin-bottom: 8px;
    }

    .contact-phone {
      font-size: 20px;
      color: #333;
      font-weight: 600;
      display: block;
      margin-bottom: 16px;
    }

    .call-button {
      background: #3B82F6;
      color: #ffffff;
      border: none;
      border-radius: 24px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 16px;
      box-shadow: 0 4px 12px rgba(255, 77, 79, 0.2);

      &:active {
        transform: translateY(1px);
      }
    }
  }

  .notice-card {
    background: #e6f7ff;
    border-radius: 12px;
    padding: 16px;
    margin-top: 20px;

    .notice-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      color: #1890ff;
      font-weight: 500;
    }

    .notice-content {
      font-size: 14px;
      color: #666;
      line-height: 1.6;
    }
  }

  // 暗黑模式适配
  @media (prefers-color-scheme: dark) {
    .timeout-container {
      background-color: #1a1a1a;
    }

    .info-card {
      background: #2c2c2c;

      .card-header .title {
        color: #fff;
      }

      .info-list .info-item {
        border-bottom-color: #3d3d3d;

        .label {
          color: #999;
        }

        .value {
          color: #fff;
        }
      }
    }

    .contact-info {

      .contact-name,
      .contact-phone {
        color: #fff;
      }
    }

    .notice-card {
      background: rgba(24, 144, 255, 0.1);
    }
  }
</style>