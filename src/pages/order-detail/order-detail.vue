<template>
  <view class="container">
    <!-- 状态卡片 -->
    <view class="status-card">
      <view class="status-header">
        <view class="status-icon" :class="orderInfo.status === '已完成' ? 'completed' : 'processing'">
          <u-icon :name="orderInfo.status === '已完成' ? 'checkmark-circle' : 'clock'" size="32" color="#FFFFFF">
          </u-icon>
        </view>
        <view class="status-info">
          <text class="status-text">{{ orderInfo.status }}</text>
          <text class="status-desc">{{ getStatusDescription() }}</text>
        </view>
      </view>
    </view>

    <!-- 订单信息卡片 -->
    <view class="info-card">
      <view class="card-title">订单信息</view>
      <view class="info-list">
        <view class="info-item">
          <text class="label">订单编号</text>
          <text class="value">{{ orderInfo.order_id }}</text>
        </view>
        <view class="info-item">
          <text class="label">包裹编号</text>
          <text class="value">{{ orderInfo.package_id }}</text>
        </view>
        <view class="info-item">
          <text class="label">包裹类型</text>
          <text class="value">{{ orderInfo.type }}</text>
        </view>
        <view class="info-item">
          <text class="label">下单时间</text>
          <text class="value">{{ orderInfo.created_at }}</text>
        </view>
        <view class="info-item" v-if="orderInfo.status !== '已完成' && orderInfo.estimated_completion_time">
          <text class="label">预计送达</text>
          <text class="value">{{ orderInfo.estimated_completion_time }}</text>
        </view>
        <view class="info-item" v-if="orderInfo.status === '已完成' && orderInfo.completed_at">
          <text class="label">完成时间</text>
          <text class="value">{{ orderInfo.completed_at }}</text>
        </view>
      </view>
    </view>

    <!-- 配送信息卡片 -->
    <view class="info-card">
      <view class="card-title">配送信息</view>
      <view class="info-list">
        <view class="info-item">
          <text class="label">收件人</text>
          <text class="value">{{ orderInfo.username }}</text>
        </view>
        <view class="info-item">
          <text class="label">联系电话</text>
          <text class="value">{{ orderInfo.phone_number }}</text>
        </view>
        <view class="info-item">
          <text class="label">取件站点</text>
          <text class="value">{{ orderInfo.site_name }}</text>
        </view>
        <view class="info-item address">
          <text class="label">收货地址</text>
          <text class="value">{{ orderInfo.delivery_address }}</text>
        </view>
      </view>
    </view>

    <!-- 支付信息卡片 -->
    <view class="info-card">
      <view class="card-title">支付信息</view>
      <view class="info-list">
        <view class="info-item">
          <text class="label">支付金额</text>
          <text class="value price">¥{{ (orderInfo.total_amount).toFixed(2) }}</text>
          <!--  -->
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
  import {
    ref,
    getCurrentInstance
  } from 'vue';
  import {
    onLoad
  } from '@dcloudio/uni-app';

  const orderInfo = ref({});

  // 获取状态描述
  const getStatusDescription = () => {
    const statusMap = {
      '已完成': '订单已完成配送',
      '配送中': '订单正在配送中',
      '待发货': '等待机器人取件'
    };
    return statusMap[orderInfo.value.status] || '';
  };

  // 页面加载时获取订单数据
  onLoad((options) => {
    const instance = getCurrentInstance().proxy
    const eventChannel = instance.getOpenerEventChannel();
    eventChannel.on('orderData', (data) => {
      orderInfo.value = data;
    });
  });
</script>

<style lang="scss" scoped>
  .container {
    min-height: 100vh;
    background-color: #F0F9FF;
    padding: 20rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  }

  // 状态卡片样式
  .status-card {
    background: linear-gradient(135deg, #60A5FA, #3B82F6);
    border-radius: 24rpx;
    padding: 40rpx 32rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.15);

    .status-header {
      display: flex;
      align-items: center;
      gap: 24rpx;

      .status-icon {
        width: 88rpx;
        height: 88rpx;
        border-radius: 44rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.2);

        &.completed {
          background: rgba(52, 211, 153, 0.2);
        }
      }

      .status-info {
        flex: 1;

        .status-text {
          font-size: 40rpx;
          color: #FFFFFF;
          font-weight: 600;
          margin-bottom: 8rpx;
          display: block;
        }

        .status-desc {
          font-size: 28rpx;
          color: rgba(255, 255, 255, 0.9);
        }
      }
    }
  }

  // 信息卡片通用样式
  .info-card {
    background: #FFFFFF;
    border-radius: 24rpx;
    padding: 32rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);

    .card-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #1E293B;
      margin-bottom: 24rpx;
      padding-left: 16rpx;
      border-left: 8rpx solid #3B82F6;
    }

    .info-list {
      .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16rpx 0;
        font-size: 28rpx;
        border-bottom: 2rpx solid #F1F5F9;

        &:last-child {
          border-bottom: none;
        }

        &.address {
          align-items: flex-start;
        }

        .label {
          color: #64748B;
          flex-shrink: 0;
          width: 160rpx;
        }

        .value {
          color: #1E293B;
          flex: 1;
          text-align: right;

          &.price {
            color: #EF4444;
            font-weight: 600;
            font-size: 32rpx;
          }
        }
      }
    }
  }
</style>