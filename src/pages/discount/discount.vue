<template>
  <view class="coupon-container">
    <!-- 顶部状态栏
    <view class="header">
      <view class="title-bar">
        <text class="title">我的优惠券</text>
      </view>
    </view> -->

    <!-- 标签页 -->
    <view class="tabs">
      <view v-for="(tab, index) in tabs" :key="index" class="tab-item" :class="{ active: currentTab === index }"
        @tap="switchTab(index)">
        <text>{{ tab.name }}</text>
        <text class="count">({{ tab.count }})</text>
      </view>
    </view>

    <!-- 优惠券列表 -->
    <scroll-view class="coupon-list" scroll-y @scrolltolower="loadMore">
      <view v-for="(coupon, index) in currentCoupons" :key="index" class="coupon-item"
        :class="{ 'used': currentTab === 1 }">
        <view class="left-section">
          <view class="price">
            <!-- 根据优惠券类型显示不同格式 -->
            <template v-if="coupon.couponType === '折扣券'">
              <text class="amount">{{ formatDiscount(coupon.discountValue) }}</text>
              <text class="symbol">折</text>
            </template>
            <template v-else>
              <text class="symbol">¥</text>
              <text class="amount">{{ formatMoney(coupon.discountValue) }}</text>
            </template>
          </view>
          <view class="condition">{{ coupon.couponType }}</view>
        </view>

        <view class="right-section">
          <view class="coupon-name">{{ coupon.couponType }}</view>
          <view class="valid-date">有效期至：{{ formatDate(coupon.endDate) }}</view>
          <view class="status-tag" :class="{ 'used': currentTab === 1 }">
            {{ coupon.status }}
          </view>
        </view>

        <view class="decoration">
          <view class="circle top"></view>
          <view class="circle bottom"></view>
        </view>
      </view>

      <!-- 空状态展示 -->
      <view v-if="currentCoupons.length === 0" class="empty-state">
        <u-empty mode="coupon" text="暂无优惠券"></u-empty>
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
  import {
    fetchUnUsedCouponssDataAPI,
    fetchUsedCouponssDataAPI
  } from '@/api/api-user'
  // 当前时间
  const currentTime = ref('12:00')
  const updateTime = () => {
    const now = new Date()
    currentTime.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  }

  // 标签页配置
  const tabs = ref([{
      name: '未使用',
      count: 0
    },
    {
      name: '已使用',
      count: 0
    }
  ])
  const currentTab = ref(0)

  // 优惠券数据
  const unusedCoupons = ref([])
  const usedCoupons = ref([])

  // 计算当前显示的优惠券列表
  // 计算当前显示的优惠券列表
  const currentCoupons = computed(() => {
    return currentTab.value === 0 ? unusedCoupons.value : usedCoupons.value
  })

  // 切换标签
  const switchTab = (index) => {
    currentTab.value = index
  }

  // 获取未使用优惠券
  const fetchUnusedCoupons = async () => {
    try {
      const res = await fetchUnUsedCouponssDataAPI()
      if (res.code === 23071) { // 修改状态码
        unusedCoupons.value = res.data
        tabs.value[0].count = res.data.length
      }
    } catch (err) {
      console.error('获取未使用优惠券失败:', err)
    }
  }

  // 获取已使用优惠券
  const fetchUsedCoupons = async () => {
    try {
      const res = await fetchUsedCouponssDataAPI()
      if (res.code === 23081) { // 修改状态码，请确认实际状态码
        usedCoupons.value = res.data
        tabs.value[1].count = res.data.length
      }
    } catch (err) {
      console.error('获取已使用优惠券失败:', err)
    }
  }
  // 格式化折扣值（折扣券）
  const formatDiscount = (value) => {
    return (value * 10).toFixed(1)
  }

  // 格式化金额（代金券）
  const formatMoney = (value) => {
    return value.toFixed(2)
  }

  // 格式化日期
  const formatDate = (dateStr) => {
    return dateStr.split(' ')[0]
  }
  // 加载更多
  const loadMore = () => {
    // 如果需要分页加载，在这里实现
    console.log('加载更多')
  }

  // 页面加载时获取数据
  onMounted(() => {
    fetchUnusedCoupons()
    fetchUsedCoupons()
  })
</script>

<style lang="scss" scoped>
  .coupon-container {
    min-height: 100vh;
    background-color: #f5f7fa;

    .header {
      background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
      padding: 40rpx 32rpx 20rpx;

      .title-bar {
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
          color: #3B82F6;
          font-weight: bold;

          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 40rpx;
            height: 4rpx;
            background: #3B82F6;
            border-radius: 2rpx;
          }
        }
      }
    }

    .coupon-list {
      // padding: rpx;
      height: calc(100vh - 220rpx);

      .coupon-item {
        display: flex;
        background: #fff;
        border-radius: 16rpx;
        margin-top: 12rpx;
        margin-bottom: 12rpx;
        position: relative;
        overflow: hidden;
        box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);

        &.used {
          opacity: 0.7;
        }

        .left-section {
          width: 220rpx;
          background: #3B82F6;
          padding: 32rpx;
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          .price {
            display: flex;
            align-items: baseline;
            justify-content: center;

            .symbol {
              font-size: 32rpx;
              margin-right: 4rpx;
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

          .status-tag {
            position: absolute;
            right: 32rpx;
            bottom: 32rpx;
            padding: 8rpx 24rpx;
            border-radius: 24rpx;
            font-size: 24rpx;

            &:not(.used) {
              background: rgba(59, 130, 246, 0.1);
              color: #3B82F6;
            }

            &.used {
              background: #f5f5f5;
              color: #999;
            }
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
        padding: 100rpx 0;
      }
    }
  }
</style>