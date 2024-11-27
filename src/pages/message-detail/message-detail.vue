<template>
  <view class="message-detail">
    <!-- 消息头部 -->
    <view class="message-header">
      <view class="title-section">
        <text class="message-type" :class="messageInfo.type">
          {{ getTypeText(messageInfo.type) }}
        </text>
        <text class="message-title">{{ messageInfo.title }}</text>
      </view>
      <view class="message-meta">
        <text class="time">{{ messageInfo.time }}</text>
      </view>
    </view>

    <!-- 消息内容 -->
    <view class="message-content">
      <!-- 系统通知类型 -->
      <template v-if="messageInfo.type === 'system'">
        <view class="system-notice">
          <view class="notice-icon">
            <u-icon name="volume" color="#1890ff" size="24" />
          </view>
          <text class="notice-text">{{ messageInfo.content }}</text>
        </view>
      </template>

      <!-- 包裹状态类型 -->
      <template v-else-if="messageInfo.type === 'package'">
        <view class="package-status">
          <view class="status-icon">
            <u-icon :name="getStatusIcon(messageInfo.packageStatus)" :color="getStatusColor(messageInfo.packageStatus)"
              size="24" />
          </view>
          <view class="status-info">
            <text class="status-text">{{ messageInfo.content }}</text>
            <view class="package-meta">
              <text class="tracking-number">包裹编号：{{ messageInfo.trackingNumber }}</text>
              <text class="package-type">{{ messageInfo.packageType }}</text>
            </view>
          </view>
        </view>
      </template>

      <!-- 活动通知类型 -->
      <template v-else-if="messageInfo.type === 'activity'">
        <view class="activity-notice">
          <image v-if="messageInfo.image" :src="messageInfo.image" mode="widthFix" class="activity-image" />
          <text class="activity-text">{{ messageInfo.content }}</text>
        </view>
      </template>
    </view>

    <!-- 相关操作按钮 -->
    <view class="action-buttons" v-if="messageInfo.actions?.length">
      <button v-for="action in messageInfo.actions" :key="action.type" class="action-btn" :class="action.type"
        @click="handleAction(action)">
        {{ action.text }}
      </button>
    </view>
  </view>
</template>

<script setup>
  import {
    ref,
    onMounted,
    getCurrentInstance
  } from 'vue';

  // 消息信息
  const messageInfo = ref({});

  // 获取消息类型文本
  const getTypeText = (type) => {
    const typeMap = {
      system: '系统通知',
      package: '包裹状态',
      activity: '活动通知'
    };
    return typeMap[type] || '通知';
  };

  // 获取包裹状态图标
  const getStatusIcon = (status) => {
    const iconMap = {
      pending: 'clock',
      delivering: 'car',
      completed: 'checkmark-circle',
      timeout: 'warning'
    };
    return iconMap[status] || 'info-circle';
  };

  // 获取状态颜色
  const getStatusColor = (status) => {
    const colorMap = {
      pending: '#faad14',
      delivering: '#1890ff',
      completed: '#52c41a',
      timeout: '#ff4d4f'
    };
    return colorMap[status] || '#666';
  };

  // 处理按钮点击
  const handleAction = (action) => {
    switch (action.type) {
      case 'view':
        uni.navigateTo({
          url: action.url
        });
        break;
      case 'call':
        uni.makePhoneCall({
          phoneNumber: action.phoneNumber
        });
        break;
      case 'share':
        uni.share({
          provider: 'weixin',
          scene: 'WXSceneSession',
          type: 0,
          title: messageInfo.value.title,
          summary: messageInfo.value.content,
          success: function(res) {
            console.log('分享成功');
          }
        });
        break;
      default:
        console.log('未知操作类型');
    }
  };

  // 页面加载时获取消息数据
  onMounted(() => {
    const instance = getCurrentInstance().proxy
    const eventChannel = instance.getOpenerEventChannel();
    eventChannel.on('messageData', (data) => {
      messageInfo.value = data;
    });
  });
</script>

<style lang="scss" scoped>
  .message-detail {
    min-height: 100vh;
    background-color: #f5f6fa;
    padding: 20px;
  }

  .message-header {
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    .title-section {
      margin-bottom: 12px;

      .message-type {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        margin-right: 8px;

        &.system {
          background: #e6f7ff;
          color: #1890ff;
        }

        &.package {
          background: #f6ffed;
          color: #52c41a;
        }

        &.activity {
          background: #fff7e6;
          color: #faad14;
        }
      }

      .message-title {
        font-size: 18px;
        font-weight: 600;
        color: #333;
      }
    }

    .message-meta {
      font-size: 14px;
      color: #999;
    }
  }

  .message-content {
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    .system-notice {
      display: flex;
      align-items: flex-start;
      gap: 12px;

      .notice-text {
        flex: 1;
        font-size: 15px;
        line-height: 1.6;
        color: #333;
      }
    }

    .package-status {
      display: flex;
      gap: 12px;

      .status-info {
        flex: 1;

        .status-text {
          font-size: 15px;
          color: #333;
          margin-bottom: 8px;
          display: block;
        }

        .package-meta {
          font-size: 13px;
          color: #666;

          .tracking-number {
            margin-right: 12px;
          }
        }
      }
    }

    .activity-notice {
      .activity-image {
        width: 100%;
        border-radius: 8px;
        margin-bottom: 12px;
      }

      .activity-text {
        font-size: 15px;
        line-height: 1.6;
        color: #333;
      }
    }
  }

  .action-buttons {
    display: flex;
    gap: 12px;
    padding: 0 20px;

    .action-btn {
      flex: 1;
      height: 44px;
      border-radius: 22px;
      font-size: 15px;
      border: none;

      &.view {
        background: #1890ff;
        color: #fff;
      }

      &.call {
        background: #52c41a;
        color: #fff;
      }

      &.share {
        background: #faad14;
        color: #fff;
      }
    }
  }

  // 暗黑模式适配
  @media (prefers-color-scheme: dark) {
    .message-detail {
      background-color: #1a1a1a;
    }

    .message-header,
    .message-content {
      background: #2c2c2c;

      .message-title {
        color: #fff;
      }

      .notice-text,
      .status-text,
      .activity-text {
        color: #fff;
      }
    }
  }
</style>