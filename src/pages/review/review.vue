<template>
  <view class="review-container">
    <!-- 顶部配送信息 -->
    <view class="package-info" v-if="orderInfo.packageType">
      <view class="info-item">
        <text class="label">包裹类型</text>
        <text class="value">{{ orderInfo.packageType }}</text>
      </view>
      <view class="info-item">
        <text class="label">送达时间</text>
        <text class="value">{{ orderInfo.completedTime }}</text>
      </view>
    </view>

    <!-- 评分区域 -->
    <view class="rating-section">
      <view class="rating-title">为本次配送服务评分</view>
      <view class="stars">
        <u-rate v-model="rating" :count="5" :size="40" active-color="#F59E0B" inactive-color="#E5E7EB" :gutter="20"
          active-icon="star-fill" inactive-icon="star" @change="onRatingChange"></u-rate>
      </view>
      <view class="rating-text" :style="{ color: ratingColors[rating - 1] }">
        {{ ratingText }}
      </view>
    </view>

    <!-- 评价输入框 -->
    <view class="comment-section">
      <textarea v-model="comment" class="comment-input" placeholder="请描述一下您对本次配送服务的感受吧~" :maxlength="200"
        show-confirm-bar="false"></textarea>
      <view class="word-count">{{ comment.length }}/200</view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-section">
      <button class="submit-btn" :disabled="!isValid" :class="{ 'btn-active': isValid }" @tap="submitReview">
        提交评价
      </button>
    </view>
  </view>
</template>

<script setup>
  import {
    ref,
    computed,
    onMounted,
    getCurrentInstance
  } from 'vue'
  import {
    reviewAPI
  } from '@/api/api-order'
  import {
    onLoad,
    onShow
  } from "@dcloudio/uni-app"
  // 订单信息
  const orderInfo = ref({
    orderId: '',
    packageType: '',
    completedTime: ''
  });

  // 评分相关
  const rating = ref(5)
  const ratingColors = ['#DC2626', '#F59E0B', '#F59E0B', '#10B981', '#10B981']
  const ratingText = computed(() => {
    const texts = ['非常差', '差', '一般', '好', '非常好']
    return rating.value ? texts[rating.value - 1] : '请评分'
  })

  // 评价内容
  const comment = ref('')

  // 表单验证
  const isValid = computed(() => {
    return rating.value > 0 && comment.value.trim().length > 0
  })

  // 评分变化处理
  // 评分变化处理
  const onRatingChange = (value) => {
    rating.value = value
    // 可以在这里添加震动反馈
    uni.vibrateShort()
  }

  // 提交评价
  const submitReview = async () => {
    if (!isValid.value) {
      uni.showToast({
        title: '请完成评分和评价',
        icon: 'none'
      });
      return;
    }

    try {
      uni.showLoading({
        title: '提交中...'
      });

      const reviewInfo = {
        orderId: orderInfo.value.orderId,
        review_text: comment.value.trim(),
        evaluation_score: rating.value
      };

      const res = await reviewAPI(reviewInfo);

      if (res.code === 24081) {
        uni.showToast({
          title: '评价成功',
          icon: 'success'
        });
        // 延迟返回并触发事件
        setTimeout(() => {
          uni.navigateBack({
            delta: 1,
            // success: (result) => {
            //   // 在返回成功的回调中触发事件
            //   result.eventChannel.emit('reviewCompleted');
            // }
          });
        }, 1500);
      } else {
        throw new Error(res.msg || '评价失败');
      }
    } catch (error) {
      console.error('提交评价失败:', error);
      uni.showToast({
        title: error.message || '评价失败，请重试',
        icon: 'none'
      });
    } finally {
      uni.hideLoading();
    }
  };
  // 页面加载
  // onLoad((options) => {
  //   if (options.orderId) {
  //     orderInfo.value.orderId = options.orderId
  //   }
  // })
  // 接收上一页传来的数据
  onMounted(() => {
    const instance = getCurrentInstance().proxy
    const eventChannel = instance.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', (data) => {
      orderInfo.value = data;
    });
  });
</script>

<style lang="scss" scoped>
  .review-container {
    min-height: 100vh;
    background-color: #F3F4F6;
    padding: 24rpx;
  }

  .delivery-card {
    background: #FFFFFF;
    border-radius: 16rpx;
    padding: 32rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

    .delivery-info {
      display: flex;
      align-items: center;
      gap: 20rpx;

      .delivery-text {
        .success-text {
          font-size: 32rpx;
          font-weight: 600;
          color: #10B981;
          display: block;
          margin-bottom: 8rpx;
        }

        .time {
          font-size: 24rpx;
          color: #6B7280;
        }
      }
    }
  }

  .rating-section {
    background: #FFFFFF;
    border-radius: 16rpx;
    padding: 32rpx;
    margin-bottom: 24rpx;
    text-align: center;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

    .rating-title {
      font-size: 28rpx;
      color: #374151;
      margin-bottom: 32rpx;
    }

    .stars {
      margin-bottom: 24rpx;
      display: flex;
      justify-content: center;
    }

    .rating-text {
      font-size: 28rpx;
      font-weight: 500;
      transition: color 0.3s;
    }
  }


  .comment-section {
    background: #FFFFFF;
    border-radius: 16rpx;
    padding: 32rpx;
    margin-bottom: 48rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  }

  .submit-section {
    padding: 0 32rpx;
    margin-top: 48rpx;

    .submit-btn {
      width: 100%;
      height: 88rpx;
      background: #3B82F6;
      color: #FFFFFF;
      font-size: 32rpx;
      font-weight: 500;
      border-radius: 44rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.7;
      transition: all 0.3s;

      &.btn-active {
        opacity: 1;
        box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.2);
      }

      &:active {
        transform: scale(0.98);
      }

      &:disabled {
        background: #E5E7EB;
        color: #9CA3AF;
        box-shadow: none;
      }
    }
  }

  .package-info {
    background: #FFFFFF;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 12rpx 0;

      .label {
        color: #64748B;
        font-size: 28rpx;
      }

      .value {
        color: #334155;
        font-size: 28rpx;
        font-weight: 500;
      }
    }
  }
</style>