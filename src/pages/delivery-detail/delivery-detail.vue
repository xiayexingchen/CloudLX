<template>
  <view class="delivery-detail">
    <!-- 收货地址 -->
    <view class="address-section" @click="chooseAddress">
      <view v-show="address" class="address-info">
        <view class="user-info">
          <text class="name">{{address.name}}</text>
          <text class="phone">{{address.phone}}</text>
        </view>
        <view class="address">{{address.fullAddress}}</view>
      </view>
      <view v-show="!address" class="no-address">
        <text>请选择收货地址</text>
      </view>
      <uni-icons type="right" size="20" color="#999"></uni-icons>
    </view>

    <!-- 包裹信息 -->
    <view class="package-info">
      <view class="section-title">包裹信息</view>
      <view class="package-item">
        <image :src="packageInfo.image" mode="aspectFill" class="package-image" width="150rpx" height="150rpx">
        </image>
        <view class="package-detail">
          <view class="package-name">{{packageInfo.name}}</view>
          <view class="package-code">
            <uni-icons type="package" size="20" color="#666"></uni-icons>
            快递单号：{{packageInfo.trackingNumber}}
          </view>
        </view>
      </view>
    </view>

    <!-- 配送时间 -->
    <view class="delivery-time">
      <view class="section-title">配送时间</view>
      <picker mode="multiSelector" :range="timeRange" @change="onTimeChange">
        <view class="time-picker selector-info">
          <text>{{selectedTime || '请选择配送时间'}}</text>
          <text>
            <uni-icons type="right" size="20" color="#999"></uni-icons>
            <uni-icons v-if="selectedTime" type="edit" size="20" color="#999" @click="openTimeSelector"></uni-icons>
          </text>
        </view>
      </picker>
    </view>

    <!-- 优惠券 -->
    <view class="coupon-section" @click="chooseCoupon">
      <view class="section-title">优惠券</view>
      <view class="coupon-info selector-info">
        <text v-if="selectedCoupon">
          <uni-icons type="coupon" size="20" color="#666"></uni-icons>
          已选择：{{selectedCoupon.name}}
          <uni-icons type="delete" size="20" color="#999" @click="removeSelectedCoupon"></uni-icons>
        </text>
        <text v-else>请选择优惠券</text>
        <uni-icons type="right" size="20" color="#999"></uni-icons>
      </view>
    </view>

    <!-- 配送费用信息 -->
    <view class="fee-section">
      <view class="fee-table">
        <view class="fee-row">
          <text>配送费</text>
          <text>¥{{deliveryFee}}</text>
        </view>
        <view class="fee-row" v-if="associatedCoupon">
          <text>优惠金额</text>
          <text class="discount">-¥{{selectedCoupon.amount}}</text>
        </view>
        <view class="fee-row total">
          <text>总计</text>
          <text class="total-amount">¥{{totalAmount}}</text>
        </view>
      </view>
    </view>

    <!-- 提交订单按钮 -->
    <view class="submit-btn" @click="submitOrder">
      提交订单
    </view>
  </view>
</template>

<script setup>
  import {
    ref,
    computed
  } from 'vue'
  import {
    onLoad
  } from "@dcloudio/uni-app"
  // 地址信息
  const address = ref(null)
  // 包裹信息（从上一页面获取）
  const packageInfo = ref({})
  // 配送时间选择
  const timeRange = ref([
    ['今天', '明天', '后天'],
    ['09:00-11:00', '14:00-16:00', '16:00-18:00']
  ])
  const selectedTime = ref('')
  // 优惠券
  const selectedCoupon = ref(null)
  // 配送费
  const deliveryFee = ref(15)

  // 计算总金额
  const totalAmount = computed(() => {
    let total = deliveryFee.value
    if (selectedCoupon.value) {
      total -= selectedCoupon.value.amount
    }
    return total.toFixed(2)
  })

  // 选择地址
  const chooseAddress = () => {
    // 这里添加进入地址列表页面的逻辑，同时设置返回时的淡入动画相关参数
    uni.navigateTo({
      url: '/pages/address/address-list'
    })
  }

  // 选择配送时间
  const onTimeChange = (e) => {
    const [dateIndex, timeIndex] = e.detail.value
    selectedTime.value = `${timeRange.value[0][dateIndex]} ${timeRange.value[1][timeIndex]}`
  }

  // 重新打开时间选择器
  const openTimeSelector = () => {
    // 这里添加重新打开时间选择器的逻辑
  }

  // 选择优惠券
  const chooseCoupon = () => {
    // 这里添加进入优惠券列表页面的逻辑，同时设置返回时的淡入动画相关参数
    uni.navigateTo({
      url: '/pages/coupon/coupon-list'
    })
  }

  // 取消已选择的优惠券
  const removeSelectedCoupon = () => {
    selectedCoupon.value = null
  }

  // 提交订单
  const submitOrder = () => {
    if (!address.value) {
      uni.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return
    }
    if (!selectedTime.value) {
      uni.showToast({
        title: '请选择配送时间',
        icon: 'none'
      })
      return
    }

    // TODO: 调用提交订单API
    uni.showLoading({
      title: '提交中...'
    })

    // 模拟API调用
    setTimeout(() => {
      uni.hideLoading()
      uni.showToast({
        title: '订单提交成功',
        icon: 'success'
      })
      // 跳转到订单详情页
      uni.navigateTo({
        url: '/pages/order/order-detail'
      })
    }, 1500)
  }

  // 页面加载时获取上一页面传递的包裹信息
  onLoad((options) => {
    if (options.parcel) {
      console.log("options" + options);
      packageInfo.value = JSON.parse(decodeURIComponent(options.parcel));

      console.log(" packageInfo.value" + packageInfo.value);
    }
  })
</script>

<style lang="scss">
  .delivery-detail {
    min-height: 100vh;
    background-color: #f9f9f9;
    padding-bottom: 120rpx;

    .section-title {
      font-size: 32rpx;
      color: #333;
      font-weight: bold;
      margin-bottom: 20rpx;
    }

    .address-section {
      background-color: #fff;
      padding: 30rpx;
      margin-bottom: 20rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .address-info {
        flex: 1;

        .user-info {
          margin-bottom: 10rpx;

          .name {
            margin-right: 20rpx;
          }

          .phone {
            color: #666;
          }
        }

        .address {
          color: #333;
          font-size: 30rpx;
        }
      }

      .no-address {
        color: #999;
      }
    }

    .package-info {
      background-color: #fff;
      padding: 30rpx;
      margin-bottom: 20rpx;

      .package-item {
        display: flex;
        align-items: center;

        .package-image {
          width: 150rpx;
          height: 150rpx;
          margin-right: 20rpx;
        }

        .package-detail {
          flex: 1;

          .package-name {
            font-size: 30rpx;
            margin-bottom: 10rpx;
          }

          .package-code {
            color: #666;
            font-size: 26rpx;
          }
        }
      }
    }

    .delivery-time,
    .coupon-section {
      background-color: #fff;
      padding: 30rpx;
      margin-bottom: 20rpx;

      .selector-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #666;
      }
    }

    .fee-section {
      background-color: #fff;
      padding: 30rpx;
      margin-bottom: 20rpx;

      .fee-table {
        display: table;
        width: 100%;

        .fee-row {
          display: table-row;

          text {
            display: table-cell;
            padding: 10rpx;
          }
        }

        .total {
          border-top: 1rpx solid #eee;
          padding-top: 20rpx;
          font-weight: bold;

          .total-amount {
            color: #007BFF;
            font-size: 32rpx;
          }
        }
      }
    }

    .submit-btn {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 100rpx;
      background-color: #007BFF;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;
    }
  }
</style>