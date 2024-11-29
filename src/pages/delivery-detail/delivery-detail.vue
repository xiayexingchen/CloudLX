<template>
  <view class="container">
    <!-- 收货地址卡片 -->
    <view class="card address-card" @click="chooseAddress">
      <view class="card-content">
        <view class="icon-wrap">
          <u-icon name="map" size="20" color="#666"></u-icon>
        </view>
        <view class="content-wrap" v-if="address.name!==''">
          <view class="title">
            <text>{{address.name}}</text>
          </view>
          <view class="desc">{{address.fullAddress}}</view>
        </view>
        <view class="content-wrap" v-else>
          <view class="placeholder">请选择收货地址</view>
        </view>
        <view class="arrow">
          <u-icon name="arrow-right" size="16" color="#999"></u-icon>
        </view>
      </view>
    </view>

    <view class="card">
      <!--  <view class="card-title">包裹信息</view> -->
      <view class="package-info">
        <view class="info-item">
          <image :src="getPackageTypeImage(packageInfo.itemType)" mode="aspectFit" class="package-icon" />
          <view class="info-content">
            <view class="info-row">
              <text class="label">运单号：</text>
              <text class="value">{{packageInfo.trackingNumber}}</text>
            </view>
            <view class="info-row">
              <text class="label">包裹类型：</text>
              <text class="value">{{packageInfo.itemType}}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 配送时间卡片 -->
    <view class="card">
      <picker mode="multiSelector" :range="timeRange" @change="onTimeChange">
        <view class="select-item">
          <view class="select-left">
            <u-icon name="clock" size="20" color="#666"></u-icon>
            <text class="select-label">配送时间</text>
          </view>
          <view class="select-right">
            <text class="select-value">{{selectedTime || '请选择配送时间'}}</text>
            <u-icon name="arrow-right" size="16" color="#999"></u-icon>
          </view>
        </view>
      </picker>
    </view>

    <!-- 优惠券卡片 -->
    <view class="card">
      <view class="select-item" @click="openCouponPopup">
        <view class="select-left">
          <u-icon name="coupon" size="20" color="#666"></u-icon>
          <text class="select-label">优惠券</text>
        </view>
        <view class="select-right">
          <text class="select-value"> <!-- :class="{'has-selected': selectedCoupon}" -->
            {{selectedCoupon ? (formatDiscountValue(selectedCoupon) + selectedCoupon.couponType) : '请选择优惠券'}}
          </text>
          <u-icon name="arrow-right" size="16" color="#999"></u-icon>
        </view>
      </view>
    </view>

    <!-- 费用明细卡片 -->
    <view class="card price-card">
      <view class="price-item">
        <text>配送费</text>
        <text>¥{{deliveryFee}}</text>
      </view>
      <view class="price-item discount" v-if="selectedCoupon">
        <text>优惠金额</text>
        <text class="black">-¥{{(deliveryFee-totalAmount).toFixed(2)}}</text>
      </view>
      <view class="price-item total">
        <text>实付金额</text>
        <text class="amount">¥{{totalAmount}}</text>
      </view>
    </view>

    <!-- 底部提交栏 -->
    <view class="bottom-bar">
      <view class="total-wrap">
        <text>合计：</text>
        <text class="price">¥{{totalAmount}}</text>
      </view>
      <view class="submit-btn" @click="submitOrder">提交订单</view>
    </view>

    <!-- 优惠券弹窗 -->
    <u-popup v-model="showPopup" mode="bottom" :safe-area-inset-bottom="true">
      <view class="popup-container">
        <view class="popup-header">
          <text>选择优惠券</text>
          <u-icon name="close" size="20" @click="closeCouponPopup"></u-icon>
        </view>
        <scroll-view scroll-y class="popup-content">
          <view class="coupon-option" :class="{ active: !selectedCoupon }" @click="selectCoupon(null)">
            不使用优惠券
          </view>
          <view v-for="coupon in coupons" :key="coupon.couponId" class="coupon-item"
            :class="{ active: selectedCoupon?.couponId === coupon.couponId }" @click="selectCoupon(coupon)">
            <view class="coupon-main">
              <view class="coupon-value">
                <text class="value">{{formatDiscountValue(coupon)}}</text>
                <text class="type">{{coupon.couponType}}</text>
              </view>
              <view class="coupon-date">
                {{formatDate(coupon.startDate)}} - {{formatDate(coupon.endDate)}}
              </view>
            </view>
          </view>
        </scroll-view>
        <view class="popup-footer">
          <view class="confirm-btn" @click="confirmCoupon">确定</view>
        </view>
      </view>
    </u-popup>
  </view>
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
  import {
    orderAPI
  } from '@/api/api-order';

  // 地址信息
  const address = ref({
    name: '',
    fullAddress: ''
  });
  // 包裹信息（从上一页面获取）
  const packageInfo = ref({})
  // 获取包裹类型对应的图片
  const getPackageTypeImage = (type) => {
    const imageMap = {
      '外卖': '/static/food.png',
      '快递': '/static/parcel.png',
      '鲜花': '/static/flower.png',
      '蛋糕': '/static/cake.png',
      'other': '/static/other.png'
    };
    return imageMap[type] || imageMap.other;
  };

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
  // 提交订单
  async function submitOrder() {
    if (!address.value) {
      uni.showToast({
        title: '请选择收货地址',
        icon: 'none'
      });
      return;
    }
    if (!selectedTime.value) {
      uni.showToast({
        title: '请选择配送时间',
        icon: 'none'
      });
      return;
    }

    // TODO: 调用提交订单API
    uni.showLoading({
      title: '提交中...'
    });

    try {
      const orderInfo = {
        packageId: packageInfo.value.id,
        startTime: selectedTime.value,
        addressId: address.value.id,
        couponId: selectedCoupon.value?.couponId || null,
        payment_method: '钱包',
        amount: totalAmount.value
      };

      const res = await orderAPI(orderInfo);

      if (res.code === 24021) {
        uni.hideLoading();
        uni.showToast({
          title: '订单提交成功',
          icon: 'success',
          duration: 1500, // 这里应该放在 showToast 配置里
          success: () => {
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          }
        });
      } else {
        throw new Error(res.message || '提交订单失败');
      }
    } catch (error) {
      uni.hideLoading();
      uni.showToast({
        title: error.message || '系统错误',
        icon: 'none'
      });
    }
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
  // 主题色变量
  $primary-color: #2b85e4; // 主题蓝色
  $primary-light: #ecf5ff; // 浅蓝色背景
  $background-color: #f8f8f8; // 背景色
  $border-color: #eee; // 边框颜色

  .container {
    min-height: 100vh;
    background: $background-color;
    padding-bottom: 160rpx;
  }

  // 通用卡片样式
  .card {
    background: #fff;
    margin: 20rpx;
    border-radius: 12rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  }

  // 收货地址卡片
  .address-card {
    .card-content {
      display: flex;
      align-items: center;
      padding: 24rpx;

      .icon-wrap {
        flex-shrink: 0;
        width: 40rpx;
        height: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .content-wrap {
        flex: 1;
        padding: 0 24rpx;

        .title {
          font-size: 32rpx;
          font-weight: 500;
          color: #333;
          margin-bottom: 8rpx;
        }

        .desc {
          font-size: 28rpx;
          color: #666;
          line-height: 1.4;
        }

        .placeholder {
          color: #999;
          font-size: 28rpx;
        }
      }

      .arrow {
        flex-shrink: 0;
        width: 40rpx;
        height: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  // 包裹信息样式
  .package-info {
    padding: 24rpx;

    .card-title {
      font-size: 30rpx;
      font-weight: 500;
      margin-bottom: 20rpx;
      color: #333;
    }

    .info-item {
      display: flex;
      align-items: flex-start;

      .package-icon {
        width: 96rpx;
        height: 96rpx;
        margin-right: 20rpx;
        flex-shrink: 0;
      }

      .info-content {
        flex: 1;
      }

      .info-row {
        display: flex;
        align-items: center;
        margin-bottom: 12rpx;
        font-size: 28rpx;

        &:last-child {
          margin-bottom: 0;
        }

        .label {
          color: #666;
          width: 140rpx;
        }

        .value {
          color: #333;
          flex: 1;
        }
      }
    }
  }

  // 选择器项样式
  .select-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx;
    background: #fff;

    .select-left {
      display: flex;
      align-items: center;

      .select-label {
        font-size: 28rpx;
        color: #333;
        margin-left: 12rpx;
      }
    }

    .select-right {
      display: flex;
      align-items: center;

      .select-value {
        font-size: 28rpx;
        color: #999;
        margin-right: 12rpx;

        &.has-selected {
          color: #333;
        }
      }
    }
  }

  // 价格卡片
  .price-card {
    .price-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16rpx 24rpx;
      font-size: 28rpx;
      color: #333;

      &.discount {
        color: #666;

        .black {
          color: #666;
        }
      }

      &.total {
        padding-top: 20rpx;
        margin-top: 12rpx;
        border-top: 1px solid $border-color;
        font-weight: 500;

        .amount {
          color: #ff4d4f;
          font-size: 32rpx;
        }
      }
    }
  }

  // 底部提交栏
  .bottom-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    display: flex;
    align-items: center;
    padding: 20rpx 24rpx;
    padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

    .total-wrap {
      flex: 1;
      font-size: 28rpx;

      .price {
        font-size: 36rpx;
        font-weight: 500;
        color: #ff4d4f;
      }
    }

    .submit-btn {
      width: 240rpx;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      background: $primary-color;
      color: #fff;
      border-radius: 40rpx;
      font-size: 30rpx;

      &:active {
        opacity: 0.9;
      }
    }
  }

  // 优惠券弹窗
  .popup-container {
    background: #fff;
    border-radius: 24rpx 24rpx 0 0;
    max-height: 80vh;
    display: flex;
    flex-direction: column;

    .popup-header {
      position: relative;
      padding: 24rpx;
      text-align: center;
      font-size: 32rpx;
      font-weight: 500;
      border-bottom: 1px solid $border-color;

      .u-icon {
        position: absolute;
        right: 24rpx;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    .popup-content {
      flex: 1;
      padding: 24rpx;
      max-height: 60vh;
    }

    .coupon-option {
      padding: 24rpx;
      text-align: center;
      border: 1px solid $border-color;
      border-radius: 8rpx;
      margin-bottom: 20rpx;
      font-size: 28rpx;

      &.active {
        background: $primary-light;
        border-color: $primary-color;
        color: $primary-color;
      }
    }

    .coupon-item {
      margin-bottom: 20rpx;
      border-radius: 8rpx;
      background: #fff;

      &.active {
        background: $primary-light;

        .coupon-main {
          border-color: $primary-color;
        }
      }

      .coupon-main {
        padding: 24rpx;
        border: 1px solid $border-color;
        border-radius: 8rpx;
      }

      .coupon-value {
        margin-bottom: 12rpx;

        .value {
          font-size: 36rpx;
          font-weight: 500;
          color: $primary-color;
          margin-right: 12rpx;
        }

        .type {
          font-size: 24rpx;
          color: #666;
        }
      }

      .coupon-date {
        font-size: 24rpx;
        color: #999;
      }
    }

    .popup-footer {
      padding: 24rpx;
      border-top: 1px solid $border-color;

      .confirm-btn {
        height: 88rpx;
        line-height: 88rpx;
        text-align: center;
        background: $primary-color;
        color: #fff;
        border-radius: 44rpx;
        font-size: 30rpx;

        &:active {
          opacity: 0.9;
        }
      }
    }
  }

  // // 适配暗黑模式（可选）
  // @media (prefers-color-scheme: dark) {
  //   // 这里可以添加暗黑模式的样式
  // }
</style>