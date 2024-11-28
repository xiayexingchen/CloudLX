<template>
  <view class="delivery-detail">
    <!-- 收货地址 -->
    <view class="address-section" @click="chooseAddress">
      <view v-show="address" class="address-info">
        <view class="user-info">
          <text class="name">{{address.name}}</text>
          <text class="phone">{{address.name !=='' ? '':'请选择收货地址'}}</text>
        </view>
        <view class="address">{{address.fullAddress}}</view>
      </view>
      <view v-show="!address.name.value" class="no-address">
        <text>></text>
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
          <view class="package-name">{{packageInfo.trackingNumber}}</view>
          <view class="package-code">
            <uni-icons type="package" size="20" color="#666"></uni-icons>
            快递类型：{{packageInfo.itemType}}
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
    <view class="coupon-section" @click="openCouponPopup">
      <view class="section-title">优惠券</view>
      <view class="coupon-info selector-info">
        <text v-if="selectedCoupon">
          <u-icon name="coupon" size="20" color="#666"></u-icon>
          已选择：{{formatDiscountValue(selectedCoupon) + selectedCoupon.couponType}}
          <u-icon name="close" size="20" @click="removeSelectedCoupon"></u-icon>
        </text>
        <text v-else>请选择优惠券</text>
        <u-icon name="right" size="20" color="#999"></u-icon>
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
  <!-- 优惠券弹窗 -->
  <!-- 优惠券弹窗 -->
  <u-popup v-model="showPopup" mode="bottom" :mask-close-able="true" :safe-area-inset-bottom="true" border-radius="16">
    <view class="coupon-popup">
      <view class="popup-header">
        <text class="title">选择优惠券</text>
        <u-icon name="close" size="20" @click="closeCouponPopup"></u-icon>
      </view>

      <scroll-view scroll-y class="coupon-list">
        <!-- 不使用优惠券选项 -->
        <view class="coupon-item no-coupon" :class="{ active: !selectedCoupon }" @click="selectCoupon(null)">
          不使用优惠券
        </view>

        <!-- 优惠券列表 -->
        <view v-for="coupon in coupons" :key="coupon.couponId" class="coupon-item"
          :class="{ active: selectedCoupon?.couponId === coupon.couponId }" @click="selectCoupon(coupon)">
          <view class="coupon-left">
            <text class="discount-value">
              {{ formatDiscountValue(coupon) }}
            </text>
            <text class="coupon-type">{{ coupon.couponType }}</text>
          </view>
          <view class="coupon-right">
            <text class="valid-date">
              {{ formatDate(coupon.startDate) }} - {{ formatDate(coupon.endDate) }}
            </text>
          </view>
        </view>
      </scroll-view>

      <view class="popup-footer">
        <button class="confirm-btn" @click="confirmCoupon">确定</button>
      </view>
    </view>
  </u-popup>
</template>

<script setup>
  import {
    ref,
    computed,
    reactive,
    onMounted,
    getCurrentInstance
  } from 'vue';
  import dayjs from 'dayjs';
  import {
    onLoad
  } from "@dcloudio/uni-app"
  import {
    fetchUnUsedCouponssDataAPI
  } from '@/api/api-user';
  // 地址信息
  const address = ref({
    name: '',
    phone: '',
    fullAddress: ''
  });
  // 包裹信息（从上一页面获取）
  const packageInfo = ref({})
  // 配送时间选择
  const timeRange = ref([
    ['今天', '明天', '后天'],
    ['09:00-11:00', '14:00-16:00', '16:00-18:00']
  ])
  const selectedTime = ref('')
  // 优惠券相关状态变量
  const showPopup = ref(false);
  const coupons = ref([]);
  const selectedCoupon = ref(null);
  const deliveryFee = ref(2.5); // 配送费用

  // 选择地址
  const chooseAddress = () => {
    // 这里添加进入地址列表页面的逻辑，同时设置返回时的淡入动画相关参数
    uni.navigateTo({
      url: '/pages/delivery-detail/delivery-address'
    })
  }
  // 由于使用了 setup 语法，需要暴露 address 变量
  defineExpose({
    address
  });
  // 选择配送时间
  const onTimeChange = (e) => {
    const [dateIndex, timeIndex] = e.detail.value
    selectedTime.value = `${timeRange.value[0][dateIndex]} ${timeRange.value[1][timeIndex]}`
  }

  // 重新打开时间选择器
  const openTimeSelector = () => {
    // 这里添加重新打开时间选择器的逻辑
  }

  // 获取优惠券列表
  const fetchCoupons = async () => {
    try {
      const res = await fetchUnUsedCouponssDataAPI();
      if (res.code === 23071) {
        coupons.value = res.data;
      } else {
        uni.showToast({
          title: '获取优惠券失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('获取优惠券失败:', error);
      uni.showToast({
        title: '系统错误',
        icon: 'none'
      });
    }
  };
  // 打开优惠券弹窗
  const openCouponPopup = async () => {
    showPopup.value = true;
    await fetchCoupons();
  };

  // 关闭优惠券弹窗
  const closeCouponPopup = () => {
    showPopup.value = false;
  };
  // 选择优惠券
  const selectCoupon = (coupon) => {
    selectedCoupon.value = coupon;
  };

  // 确认选择
  const confirmCoupon = () => {
    closeCouponPopup();
    calculateTotal();
  };

  // 打开优惠券选择
  const chooseCoupon = () => {
    showCouponPopup.value = true;
    fetchCoupons();
  };

  // 格式化优惠券值
  const formatDiscountValue = (coupon) => {
    if (coupon.couponType === '折扣券') {
      return `${coupon.discountValue * 10}折`;
    } else {
      return `¥${coupon.discountValue}`;
    }
  };

  // 格式化日期
  const formatDate = (date) => {
    return dayjs(date).format('MM-DD');
  };

  // 计算优惠后金额
  const calculateTotal = () => {
    let total = deliveryFee.value;

    if (selectedCoupon.value) {
      if (selectedCoupon.value.couponType === '折扣券') {
        total *= selectedCoupon.value.discountValue;
      } else {
        total -= selectedCoupon.value.discountValue;
      }
    }

    return Math.max(total, 0).toFixed(2);
  };

  // 计算总金额
  const totalAmount = computed(() => {
    return calculateTotal();
  });

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
  onLoad((options) => {
    const instance = getCurrentInstance().proxy
    const eventChannel = instance.getOpenerEventChannel();

    // 接收包裹数据
    eventChannel.on('parcelData', (data) => {
      packageInfo.value = data;
      console.log('接收到的包裹数据:', data);
    });
  });
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

    .delivery-time {
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

    .coupon-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      background: #fff;
      margin-bottom: 10px;

      text {
        &:first-child {
          color: #333;
          font-size: 14px;
        }

        &:last-child {
          color: #666;
          font-size: 14px;
        }
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

    .coupon-popup {
      background-color: #fff;
      border-radius: 16px 16px 0 0;
      max-height: 70vh;
      display: flex;
      flex-direction: column;

      .popup-header {
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eee;

        .title {
          font-size: 16px;
          font-weight: 500;
          color: #333;
        }
      }

      .coupon-list {
        flex: 1;
        padding: 16px;
        max-height: calc(70vh - 120px);
      }

      .coupon-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        margin-bottom: 12px;
        background: #f8f8f8;
        border-radius: 8px;
        border: 1px solid #eee;

        &.active {
          background: #e6f7ff;
          border-color: #1890ff;
        }

        &.no-coupon {
          justify-content: center;
          color: #666;
        }

        .coupon-left {
          .discount-value {
            font-size: 20px;
            font-weight: bold;
            color: #ff4d4f;
            margin-right: 8px;
          }

          .coupon-type {
            font-size: 12px;
            color: #666;
          }
        }

        .coupon-right {
          .valid-date {
            font-size: 12px;
            color: #999;
          }
        }
      }

      .popup-footer {
        padding: 16px;
        border-top: 1px solid #eee;

        .confirm-btn {
          width: 100%;
          height: 44px;
          background: #1890ff;
          color: #fff;
          border-radius: 22px;
          border: none;
          font-size: 16px;

          &:active {
            opacity: 0.9;
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