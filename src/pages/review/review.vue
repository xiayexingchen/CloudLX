<template>
  <view class="review-container">
    <!-- 顶部配送信息卡片 -->
    <view class="delivery-card">
      <view class="delivery-info">
        <u-icon name="checkmark-circle-fill" color="#19be6b" size="50"></u-icon>
        <view class="delivery-text">
          <text class="success-text">配送已完成</text>
          <text class="time">{{ orderInfo.deliveryTime }}</text>
        </view>
      </view>
    </view>

    <!-- 评分区域 -->
    <view class="rating-section">
      <view class="rating-title">为本次配送服务评分</view>
      <view class="stars">
        <u-rate v-model="rating" count="5" activeColor="#ff9900" inactiveColor="#c8c9cc" size="40"
          @change="onRatingChange"></u-rate>
      </view>
      <view class="rating-text">{{ ratingText }}</view>
    </view>

    <!-- 评价标签 -->
    <view class="tags-section">
      <u-row gutter="20">
        <u-col span="4" v-for="(tag, index) in tags" :key="index">
          <view class="tag-item" :class="{ active: tag.selected }" @click="toggleTag(index)">
            {{ tag.text }}
          </view>
        </u-col>
      </u-row>
    </view>

    <!-- 评价输入框 -->
    <view class="comment-section">
      <u--textarea v-model="comment" placeholder="请输入您的评价内容（选填）" height="200" count maxlength="200"></u--textarea>
    </view>

    <!-- 上传图片 -->
    <view class="upload-section">
      <u--upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" multiple :maxCount="4" width="160"
        height="160"></u--upload>
      <view class="upload-tips">最多上传4张图片</view>
    </view>

    <!-- 匿名评价开关 -->
    <view class="anonymous-section">
      <u-cell :border="false">
        <template v-slot:title>
          <view class="anonymous-title">匿名评价</view>
        </template>
        <template v-slot:right-icon>
          <u-switch v-model="isAnonymous"></u-switch>
        </template>
      </u-cell>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-section">
      <u-button type="primary" @click="submitReview" :loading="submitting">
        提交评价
      </u-button>
    </view>
  </view>
</template>

<script setup>
  import {
    ref,
    computed
  } from 'vue'

  // 订单信息
  const orderInfo = ref({
    orderId: '',
    deliveryTime: '2024-03-20 14:30:00',
  })

  // 评分相关
  const rating = ref(5)
  const ratingText = computed(() => {
    const texts = ['非常差', '差', '一般', '好', '非常好']
    return texts[rating.value - 1]
  })

  // 快捷标签
  const tags = ref([{
      text: '配送很快',
      selected: false
    },
    {
      text: '服务好',
      selected: false
    },
    {
      text: '很准时',
      selected: false
    },
    {
      text: '很专业',
      selected: false
    },
    {
      text: '态度好',
      selected: false
    },
    {
      text: '很礼貌',
      selected: false
    },
  ])

  // 评价内容
  const comment = ref('')
  const fileList = ref([])
  const isAnonymous = ref(false)
  const submitting = ref(false)

  // 评分变化
  const onRatingChange = (value) => {
    rating.value = value
  }

  // 切换标签
  const toggleTag = (index) => {
    tags.value[index].selected = !tags.value[index].selected
  }

  // 上传图片
  const afterRead = (event) => {
    const {
      file
    } = event
    // 这里处理图片上传逻辑
    fileList.value.push({
      url: file.url,
      status: 'uploading',
      message: '上传中'
    })

    // 模拟上传
    setTimeout(() => {
      fileList.value[fileList.value.length - 1].status = 'success'
      fileList.value[fileList.value.length - 1].message = ''
    }, 1000)
  }

  // 删除图片
  const deletePic = (event) => {
    fileList.value.splice(event.index, 1)
  }

  // 提交评价
  const submitReview = async () => {
    if (rating.value === 0) {
      uni.$u.toast('请选择评分')
      return
    }

    submitting.value = true

    const selectedTags = tags.value
      .filter(tag => tag.selected)
      .map(tag => tag.text)

    const reviewData = {
      orderId: orderInfo.value.orderId,
      rating: rating.value,
      tags: selectedTags,
      comment: comment.value,
      images: fileList.value.map(file => file.url),
      isAnonymous: isAnonymous.value
    }

    try {
      // TODO: 调用评价接口
      await new Promise(resolve => setTimeout(resolve, 1500))

      uni.$u.toast('评价提交成功')
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    } catch (error) {
      uni.$u.toast('评价提交失败，请重试')
    } finally {
      submitting.value = false
    }
  }
</script>

<style lang="scss" scoped>
  .review-container {
    min-height: 100vh;
    background-color: #f5f5f5;
    padding-bottom: 40rpx;

    .delivery-card {
      background-color: #ffffff;
      margin: 20rpx;
      padding: 30rpx;
      border-radius: 12rpx;

      .delivery-info {
        display: flex;
        align-items: center;

        .delivery-text {
          margin-left: 20rpx;

          .success-text {
            font-size: 32rpx;
            font-weight: bold;
            color: #19be6b;
            display: block;
          }

          .time {
            font-size: 24rpx;
            color: #909399;
            margin-top: 6rpx;
            display: block;
          }
        }
      }
    }

    .rating-section {
      background-color: #ffffff;
      padding: 40rpx 30rpx;
      margin: 20rpx;
      border-radius: 12rpx;
      text-align: center;

      .rating-title {
        font-size: 28rpx;
        color: #303133;
        margin-bottom: 30rpx;
      }

      .stars {
        margin-bottom: 20rpx;
      }

      .rating-text {
        font-size: 26rpx;
        color: #ff9900;
      }
    }

    .tags-section {
      background-color: #ffffff;
      padding: 30rpx;
      margin: 20rpx;
      border-radius: 12rpx;

      .tag-item {
        background-color: #f5f5f5;
        color: #666;
        padding: 16rpx 20rpx;
        text-align: center;
        border-radius: 100rpx;
        font-size: 24rpx;
        margin-bottom: 20rpx;

        &.active {
          background-color: #ecf5ff;
          color: #2979ff;
        }
      }
    }

    .comment-section {
      background-color: #ffffff;
      padding: 30rpx;
      margin: 20rpx;
      border-radius: 12rpx;
    }

    .upload-section {
      background-color: #ffffff;
      padding: 30rpx;
      margin: 20rpx;
      border-radius: 12rpx;

      .upload-tips {
        font-size: 24rpx;
        color: #909399;
        margin-top: 20rpx;
      }
    }

    .anonymous-section {
      background-color: #ffffff;
      margin: 20rpx;
      border-radius: 12rpx;

      .anonymous-title {
        font-size: 28rpx;
        color: #303133;
      }
    }

    .submit-section {
      padding: 30rpx;
      margin-top: 40rpx;
    }
  }
</style>