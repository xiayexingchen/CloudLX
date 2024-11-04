<template>
  <view class="coupon-container">
    <view class="header">
      <text class="title">我的-优惠券</text>
      <text class="time">12:00</text>
    </view>
    <view class="tabs">
      <view class="tab active">可使用优惠券 (3)</view>
      <view class="tab">已使用优惠券 (2)</view>
    </view>
    <view class="coupon-list">
      <view class="coupon-item" v-for="(coupon, index) in coupons" :key="index">
        <view class="coupon-info">
          <text class="coupon-name">{{ coupon.name }}</text>
          <text class="coupon-price">¥{{ coupon.price }}</text>
        </view>
        <view class="coupon-condition">无使用门槛</view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        coupons: [{
            name: '五一代金券',
            price: 1.5
          },
          {
            name: '开学折扣券',
            price: 0.88
          },
          {
            name: '周年庆代金券',
            price: 1.5
          }
        ]
      };
    }
  };
</script>

<style>
  .coupon-container {
    padding: 10px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    font-size: 18px;
    font-weight: bold;
  }

  .time {
    font-size: 14px;
  }

  .tabs {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }

  .tab {
    padding: 5px 10px;
    border-bottom: 2px solid transparent;
  }

  .tab.active {
    border-bottom: 2px solid #007aff;
  }

  .coupon-list {
    margin-top: 20px;
  }

  .coupon-item {
    border: 1px solid #e0e0e0;
    padding: 10px;
    margin-bottom: 10px;
  }

  .coupon-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .coupon-name {
    font-size: 16px;
  }

  .coupon-price {
    color: #ff5722;
  }

  .coupon-condition {
    margin-top: 5px;
    color: #999;
  }
</style>