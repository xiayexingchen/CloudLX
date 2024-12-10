<template>
  <view class="activity-detail">
    <!-- 顶部图片 -->
    <image v-if="activityData.imageData" :src="getActivityImage(activityData.imageData)" mode="aspectFill"
      class="activity-banner" />

    <!-- 活动基本信息 -->
    <view class="activity-header">
      <text class="activity-name">{{ activityData.activityName }}</text>
      <view class="activity-status" :class="activityData.status === '进行中' ? 'active' : 'pending'">
        {{ activityData.status }}
      </view>
    </view>

    <!-- 活动时间信息 -->
    <view class="activity-time">
      <view class="time-item">
        <u-icon name="calendar" size="32" color="#666"></u-icon>
        <text>{{ formatDate(activityData.startTime) }} - {{ formatDate(activityData.endTime) }}</text>
      </view>
    </view>

    <!-- 根据活动类型显示不同内容 -->
    <template v-if="activityData.activityType === 'ticket'">
      <!-- 优惠券活动 -->
      <view class="coupon-section">
        <view class="coupon-card">
          <view class="coupon-left">
            <view class="discount-value">
              <text class="number">{{ formatDiscountValue(activityData.discountValue) }}</text>
              <text class="unit">{{ activityData.couponType === '折扣券' ? '折' : '元' }}</text>
            </view>
            <text class="coupon-type">{{ activityData.couponType }}</text>
          </view>
          <view class="coupon-right">
            <text class="validity">有效期</text>
            <text class="dates">{{ formatDate(activityData.startTime) }} - {{ formatDate(activityData.endTime) }}</text>
            <button class="receive-btn" :class="{ 'disabled': activityData.status !== '进行中' }" @click="receiveCoupon">
              {{ getButtonText() }}
            </button>
          </view>
        </view>
      </view>
    </template>
    <template v-else>
      <!-- 普通活动 -->
      <view class="activity-content">
        <view class="content-title">活动详情</view>
        <rich-text :nodes="activityData.description || '暂无活动详情'"></rich-text>
      </view>
    </template>

    <!-- 活动规则 -->
    <view class="activity-rules">
      <view class="rules-title">活动规则</view>
      <view class="rules-content">
        <view class="rule-item">1. 每个用户仅限参与一次</view>
        <view class="rule-item">2. 活动期间领取的优惠券需在有效期内使用</view>
        <view class="rule-item">3. 最终解释权归平台所有</view>
      </view>
    </view>
  </view>
</template>

<script setup>
  import {
    ref,
    onMounted
  } from 'vue';
  import dayjs from 'dayjs';

  //const activityData = ref({});
  const activityData = ref({
    activityId: 1,
    activityName: "元旦有礼！",
    description: "活动详情描述...",
    imageData: "/activity/example.jpg",
    startTime: "2025-01-01 00:00:00",
    endTime: "2025-01-08 23:59:59",
    status: "进行中",
    activityType: "ticket",
    couponType: "代金券",
    discountValue: 2.00
  })
  // 格式化日期
  const formatDate = (date) => {
    return dayjs(date).format('YYYY.MM.DD');
  };

  // 格式化优惠值
  const formatDiscountValue = (value) => {
    if (activityData.value.couponType === '折扣券') {
      return (value * 10).toFixed(1);
    }
    return value.toFixed(2);
  };

  // 获取活动图片
  const getActivityImage = (imageData) => {
    return import.meta.env.VITE_APP_BASE_API + imageData;
  };

  // 获取按钮文字
  const getButtonText = () => {
    if (activityData.value.status === '未开始') {
      return '即将开始';
    } else if (activityData.value.status === '进行中') {
      return '立即领取';
    } else {
      return '活动结束';
    }
  };

  // 领取优惠券
  const receiveCoupon = () => {
    if (activityData.value.status !== '进行中') {
      uni.showToast({
        title: activityData.value.status === '未开始' ? '活动未开始' : '活动已结束',
        icon: 'none'
      });
      return;
    }

    // TODO: 调用领取优惠券API
    uni.showLoading({
      title: '领取中...'
    });

    // 模拟API调用
    setTimeout(() => {
      uni.hideLoading();
      uni.showToast({
        title: '领取成功',
        icon: 'success'
      });
    }, 1000);
  };

  // 页面加载时获取活动详情
  onMounted(() => {
    // 获取路由参数
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const activityId = currentPage.options.id;

    // 修复: 从当前页面实例获取 eventChannel
    // const eventChannel = currentPage.$getOpenerEventChannel?.();
    // if (eventChannel) {
    //   // 接收上一页面传递的数据
    //   eventChannel.on('activityData', function(data) {
    //     console.log('接收到的活动数据:', data);
    //     activityData.value = data.data;
    //   });
    // }
  });
</script>

<style lang="scss" scoped>
  .activity-detail {
    min-height: 100vh;
    background: #f8f8f8;

    .activity-banner {
      width: 100%;
      height: 400rpx;
      object-fit: cover;
    }

    .activity-header {
      padding: 30rpx;
      background: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .activity-name {
        font-size: 36rpx;
        font-weight: bold;
        color: #333;
      }

      .activity-status {
        padding: 8rpx 20rpx;
        border-radius: 24rpx;
        font-size: 24rpx;

        &.active {
          background: #e6f7ff;
          color: #1890ff;
        }

        &.pending {
          background: #f5f5f5;
          color: #999;
        }
      }
    }

    .activity-time {
      padding: 20rpx 30rpx;
      background: #fff;
      margin-top: 2rpx;

      .time-item {
        display: flex;
        align-items: center;
        gap: 12rpx;
        color: #666;
        font-size: 28rpx;
      }
    }

    .coupon-section {
      padding: 30rpx;

      .coupon-card {
        background: linear-gradient(135deg, #ff6b6b, #ff8787);
        border-radius: 16rpx;
        height: 200rpx;
        display: flex;
        overflow: hidden;
        position: relative;

        &::before {
          content: '';
          position: absolute;
          left: 70%;
          top: 0;
          bottom: 0;
          width: 20rpx;
          background: radial-gradient(circle at 0 50%, transparent 25%, #f8f8f8 26%, #f8f8f8 75%, transparent 76%) repeat-y;
          background-size: 20rpx 40rpx;
        }

        .coupon-left {
          width: 70%;
          padding: 30rpx;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #fff;

          .discount-value {
            display: flex;
            align-items: baseline;

            .number {
              font-size: 80rpx;
              font-weight: bold;
            }

            .unit {
              font-size: 32rpx;
              margin-left: 8rpx;
            }
          }

          .coupon-type {
            font-size: 28rpx;
            margin-top: 8rpx;
          }
        }

        .coupon-right {
          flex: 1;
          background: rgba(255, 255, 255, 0.1);
          padding: 30rpx;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #fff;

          .validity {
            font-size: 24rpx;
            opacity: 0.8;
          }

          .dates {
            font-size: 22rpx;
            margin: 8rpx 0 16rpx;
            opacity: 0.8;
          }

          .receive-btn {
            width: 160rpx;
            height: 60rpx;
            line-height: 60rpx;
            text-align: center;
            background: #fff;
            color: #ff6b6b;
            border-radius: 30rpx;
            font-size: 24rpx;
            font-weight: bold;

            &.disabled {
              background: rgba(255, 255, 255, 0.5);
              color: rgba(255, 107, 107, 0.5);
            }
          }
        }
      }
    }

    .activity-content {
      margin-top: 20rpx;
      padding: 30rpx;
      background: #fff;

      .content-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 20rpx;
      }
    }

    .activity-rules {
      margin-top: 20rpx;
      padding: 30rpx;
      background: #fff;

      .rules-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 20rpx;
      }

      .rules-content {
        .rule-item {
          font-size: 28rpx;
          color: #666;
          line-height: 1.6;
          margin-bottom: 12rpx;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
</style>