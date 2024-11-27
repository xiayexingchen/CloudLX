<template>
  <view class="coupon-container">
    <!-- 顶部状态栏 -->
    <view class="header">
      <view class="status-bar">
        <text>{{ currentTime }}</text>
      </view>
      <view class="title-bar">
        <text class="title">我的优惠券</text>
      </view>
    </view>

    <!-- 标签页 -->
    <view class="tabs">
      <view v-for="(tab, index) in tabs" :key="index" class="tab-item" :class="{ active: currentTab === index }"
        @click="switchTab(index)">
        <text>{{ tab.name }}</text>
        <text class="count">({{ tab.count }})</text>
      </view>
    </view>

    <!-- 优惠券列表 -->
    <scroll-view class="coupon-list" scroll-y @scrolltolower="loadMore">
      <view v-for="(coupon, index) in currentCoupons" :key="coupon.id" class="coupon-item"
        :class="{ 'used': currentTab === 1 }">
        <view class="left-section">
          <view class="price">
            <text class="symbol">¥</text>
            <text class="amount">{{ coupon.price }}</text>
          </view>
          <view class="condition">{{ coupon.condition }}</view>
        </view>

        <view class="right-section">
          <view class="coupon-name">{{ coupon.name }}</view>
          <view class="valid-date">有效期至：{{ coupon.validDate }}</view>
          <view class="use-btn" v-if="currentTab === 0" @click="useCoupon(coupon)">
            立即使用
          </view>
          <view class="status-tag" v-else>已使用</view>
        </view>

        <view class="decoration">
          <view class="circle top"></view>
          <view class="circle bottom"></view>
        </view>
      </view>

      <!-- 空状态展示 -->
      <view v-if="currentCoupons.length === 0" class="empty-state">
        <image src="/static/images/empty-coupon.png" mode="aspectFit"></image>
        <text>暂无优惠券</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
  import {
    ref,
    computed,
    onMounted
  } from 'vue'

  // 当前时间
  const currentTime = ref('12:00')
  const updateTime = () => {
    const now = new Date()
    currentTime.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  }

  // 标签页配置
  const tabs = ref([{
      name: '可使用优惠券',
      count: 3
    },
    {
      name: '已使用优惠券',
      count: 2
    }
  ])
  const currentTab = ref(0)

  // 模拟优惠券数据
  const availableCoupons = ref([{
      id: 1,
      name: '新人专享券',
      price: 50,
      condition: '满199元可用',
      validDate: '2024-12-31',
      type: 'new'
    },
    {
      id: 2,
      name: '周年庆优惠券',
      price: 100,
      condition: '满299元可用',
      validDate: '2024-06-30',
      type: 'anniversary'
    },
    {
      id: 3,
      name: '会员专享券',
      price: 30,
      condition: '无使用门槛',
      validDate: '2024-05-31',
      type: 'member'
    }
  ])

  const usedCoupons = ref([{
      id: 4,
      name: '618购物节优惠券',
      price: 80,
      condition: '满258元可用',
      validDate: '2024-06-18',
      type: 'festival'
    },
    {
      id: 5,
      name: '生日特惠券',
      price: 60,
      condition: '满158元可用',
      validDate: '2024-04-30',
      type: 'birthday'
    }
  ])

  // 计算当前显示的优惠券列表
  const currentCoupons = computed(() => {
    return currentTab.value === 0 ? availableCoupons.value : usedCoupons.value
  })

  // 切换标签
  const switchTab = (index) => {
    currentTab.value = index
  }

  // 使用优惠券
  const useCoupon = (coupon) => {
    uni.showModal({
      title: '提示',
      content: '是否使用该优惠券？',
      success: (res) => {
        if (res.confirm) {
          // TODO: 调用后端API使用优惠券
          uni.showToast({
            title: '使用成功',
            icon: 'success'
          })
        }
      }
    })
  }

  // 加载更多
  const loadMore = () => {
    // TODO: 实现加载更多逻辑
    console.log('加载更多')
  }

  // 生命周期
  onMounted(() => {
    updateTime()
    setInterval(updateTime, 60000)
  })
</script>

<style lang="scss" scoped>
  .coupon-container {
    min-height: 100vh;
    background-color: #f5f7fa;

    .header {
      background: linear-gradient(135deg, #0069FF 0%, #0069FF 100%);
      padding-bottom: 20rpx;

      .status-bar {
        padding: 20rpx 32rpx;
        color: #fff;
        font-size: 28rpx;
      }

      .title-bar {
        padding: 0 32rpx;

        .title {
          color: #fff;
          font-size: 36rpx;
          font-weight: bold;
        }
      }
    }

    .tabs {
      display: flex;
      background: #fff;
      padding: 0 32rpx;
      position: sticky;
      top: 0;
      z-index: 1;

      .tab-item {
        flex: 1;
        text-align: center;
        padding: 24rpx 0;
        font-size: 28rpx;
        color: #666;
        position: relative;

        .count {
          margin-left: 4rpx;
          color: #999;
        }

        &.active {
          color: #0069FF;
          font-weight: bold;

          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 40rpx;
            height: 4rpx;
            background: #0069FF;
            border-radius: 2rpx;
          }
        }
      }
    }

    .coupon-list {
      padding: 32rpx;
      height: calc(100vh - 220rpx);

      .coupon-item {
        display: flex;
        background: #fff;
        border-radius: 16rpx;
        margin-bottom: 24rpx;
        position: relative;
        overflow: hidden;
        box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);

        &.used {
          opacity: 0.7;
        }

        .left-section {
          width: 220rpx;
          background: #0069FF;
          padding: 32rpx;
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          .price {
            .symbol {
              font-size: 32rpx;
            }

            .amount {
              font-size: 64rpx;
              font-weight: bold;
            }
          }

          .condition {
            font-size: 24rpx;
            margin-top: 8rpx;
          }
        }

        .right-section {
          flex: 1;
          padding: 32rpx;
          position: relative;

          .coupon-name {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
            margin-bottom: 16rpx;
          }

          .valid-date {
            font-size: 24rpx;
            color: #999;
          }

          .use-btn {
            position: absolute;
            right: 32rpx;
            bottom: 32rpx;
            background: #0069FF;
            color: #fff;
            padding: 12rpx 32rpx;
            border-radius: 32rpx;
            font-size: 26rpx;
          }

          .status-tag {
            position: absolute;
            right: 32rpx;
            bottom: 32rpx;
            color: #999;
            font-size: 26rpx;
          }
        }

        .decoration {
          .circle {
            position: absolute;
            left: 200rpx;
            width: 40rpx;
            height: 40rpx;
            background: #f5f7fa;
            border-radius: 50%;

            &.top {
              top: -20rpx;
            }

            &.bottom {
              bottom: -20rpx;
            }
          }
        }
      }

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 100rpx 0;

        image {
          width: 200rpx;
          height: 200rpx;
          margin-bottom: 32rpx;
        }

        text {
          color: #999;
          font-size: 28rpx;
        }
      }
    }
  }
</style>