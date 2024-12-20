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
      <!-- 优惠券活动部分 -->
      <view class="coupon-section" v-if="activityData.activityType === 'ticket'">
        <view class="coupon-wrapper">
          <view class="coupon">
            <!-- 左侧金额部分 -->
            <view class="amount-section">
              <text class="currency" v-if="activityData.couponType === '代金券'">¥</text>
              <text class="amount">{{ formatDiscountValue(activityData.discountValue) }}</text>
              <text class="unit">{{ activityData.couponType === '折扣券' ? '折' : '' }}</text>
              <text class="type">{{ activityData.couponType }}</text>
            </view>

            <!-- 右侧信息部分 -->
            <view class="info-section">
              <view class="title">{{ activityData.activityName }}</view>
              <view class="date">
                <text>有效期</text>
                <text>{{ formatDate(activityData.startTime) }} - {{ formatDate(activityData.endTime) }}</text>
              </view>
              <button class="claim-btn" :class="{ 
              'disabled': activityData.status !== '进行中' || isClaimed,
              'claimed': isClaimed 
            }" @click="receiveCoupon">
                {{ getButtonText() }}
              </button>
            </view>

            <!-- 装饰性圆点 -->
            <view class="dots dots-left"></view>
            <view class="dots dots-right"></view>
          </view>
        </view>
      </view>
    </template>
    <template v-else>
      <!-- 充值返利活动 -->
      <view class="activity-content">
        <view class="content-title">活动详情</view>
        <view class="rule-item">🎉 超值充值福利来袭！</view>
        <view class="rule-item">💰 充值金额越多，返利越多</view>
        <view class="rule-item">⏰ 活动时间有限，错过等一年</view>
        <view class="rule-item">✨ 所有返利立即到账，可直接使用</view>
        <view class="rule-item">🎁 充值金额无使用限制，校内通用</view>
        <view class="rule-item">💝 心动不如行动，快来参与吧！</view>

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
    onMounted,
    getCurrentInstance
  } from 'vue';
  import dayjs from 'dayjs';
  import {
    fetchCouponStatusAPI,
    updateCouponStatusAPI
  } from '@/api/api-activity'; // 确保导入路径正确

  //const activityData = ref({});
  const activityData = ref({
    activityId: 1,
    activityName: "元旦有礼！",
    description: "活动详情描述...",
    imageData: "",
    startTime: "2025-01-01 00:00:00",
    endTime: "2025-01-08 23:59:59",
    status: "进行中",
    activityType: "ticket",
    couponType: "代金券",
    discountValue: 2.00
  })

  // 新增：优惠券是否已领取的状态
  const isClaimed = ref(false);
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
    return 'http://120.46.199.126:8080' + imageData;
  };

  // 修改：获取按钮文字逻辑
  const getButtonText = () => {
    if (isClaimed.value) {
      return '已领取';
    }
    if (activityData.value.status === '未开始') {
      return '即将开始';
    } else if (activityData.value.status === '进行中') {
      return '立即领取';
    } else {
      return '活动结束';
    }
  };

  // 新增：检查优惠券状态
  const checkCouponStatus = async (activityId) => {
    try {
      const res = await fetchCouponStatusAPI(activityId);
      if (res.code === 26021) {
        isClaimed.value = res.data;
      }
    } catch (error) {
      console.error('获取优惠券状态失败:', error);
      uni.showToast({
        title: '获取优惠券状态失败',
        icon: 'none'
      });
    }
  };
  // 修改：领取优惠券逻辑
  const receiveCoupon = async () => {
    // 检查活动状态
    if (activityData.value.status !== '进行中') {
      uni.showToast({
        title: activityData.value.status === '未开始' ? '活动未开始' : '活动已结束',
        icon: 'none'
      });
      return;
    }

    // 检查是否已领取
    if (isClaimed.value) {
      uni.showToast({
        title: '您已领取过该优惠券',
        icon: 'none'
      });
      return;
    }

    try {
      uni.showLoading({
        title: '领取中...'
      });

      const res = await updateCouponStatusAPI(activityData.value.activityId);

      uni.hideLoading();

      if (res.code === 26031) {
        isClaimed.value = true;
        uni.showToast({
          title: '领取成功',
          icon: 'success'
        });
      } else {
        uni.showToast({
          title: res.msg || '领取失败',
          icon: 'none'
        });
      }
    } catch (error) {
      uni.hideLoading();
      console.error('领取优惠券失败:', error);
      uni.showToast({
        title: '领取失败，请稍后重试',
        icon: 'none'
      });
    }
  };

  // 页面加载时获取活动详情
  onMounted(() => {
    // 获取路由参数
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const activityId = currentPage.options.id;

    // 修复: 从当前页面实例获取 eventChannel
    const instance = getCurrentInstance().proxy
    const eventChannel = instance.getOpenerEventChannel();
    if (eventChannel) {
      // 接收上一页面传递的数据
      eventChannel.on('activityData', function(data) {
        console.log('接收到的活动数据:', data);
        activityData.value = data.data;
        // 获取到活动数据后检查优惠券状态
        if (activityData.value.activityType === 'ticket') {
          checkCouponStatus(activityData.value.activityId);
        }
      });
    }


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

      .coupon-wrapper {
        padding: 20rpx;
        background: #fff;
        border-radius: 16rpx;
      }

      .coupon {
        position: relative;
        display: flex;
        background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
        border-radius: 12rpx;
        height: 220rpx;
        overflow: hidden;
        box-shadow: 0 4rpx 16rpx rgba(255, 107, 107, 0.2);

        // 左侧金额部分
        .amount-section {
          width: 35%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          position: relative;
          padding: 20rpx;

          .currency {
            font-size: 36rpx;
            color: #fff;
            position: relative;
            top: 10rpx;
          }

          .amount {
            font-size: 80rpx;
            font-weight: bold;
            color: #fff;
            line-height: 1;
            margin: 10rpx 0;
          }

          .unit {
            font-size: 32rpx;
            color: #fff;
          }

          .type {
            font-size: 24rpx;
            color: #fff;
            margin-top: 10rpx;
            padding: 4rpx 16rpx;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 20rpx;
          }
        }

        // 右侧信息部分
        .info-section {
          flex: 1;
          padding: 30rpx;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .title {
            font-size: 32rpx;
            color: #fff;
            font-weight: 500;
          }

          .date {
            display: flex;
            flex-direction: column;
            font-size: 24rpx;
            color: rgba(255, 255, 255, 0.8);

            text {
              margin: 4rpx 0;
            }
          }

          .claim-btn {
            width: 180rpx;
            height: 64rpx;
            line-height: 64rpx;
            font-size: 28rpx;
            color: #FF6B6B;
            background: #fff;
            border-radius: 32rpx;
            text-align: center;
            margin: 0;
            padding: 0;
            align-self: flex-end;

            &.disabled {
              background: rgba(255, 255, 255, 0.6);
              color: rgba(255, 107, 107, 0.6);
            }

            &.claimed {
              background: rgba(255, 255, 255, 0.5);
              color: rgba(255, 255, 255, 0.8);
            }
          }
        }

        // 装饰性圆点
        .dots {
          position: absolute;
          width: 20rpx;
          height: 20rpx;
          background: #f8f8f8;
          border-radius: 50%;

          &.dots-left {
            left: -10rpx;
            top: 50%;
            transform: translateY(-50%);
          }

          &.dots-right {
            right: -10rpx;
            top: 50%;
            transform: translateY(-50%);
          }
        }

        &::after {
          content: '';
          position: absolute;
          left: 35%;
          top: 0;
          bottom: 0;
          border-left: 2rpx dashed rgba(255, 255, 255, 0.3);
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