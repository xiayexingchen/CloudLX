<template>
  <view class="delivery-detail">
    <!-- 收货地址部分 -->
    <view class="address-section" @click="chooseAddress">
      <template v-if="address.name!==''">
        <view class="address-info">
          <view class="user-info">
            <text class="name">{{address.name}}</text>
          </view>
          <view class="address">{{address.fullAddress}}</view>
        </view>
      </template>
      <template v-else>
        <view class="no-address">
          <u-icon name="map" size="24" color="#409EFF"></u-icon>
          <text class="placeholder">请选择收货地址</text>
        </view>
      </template>
      <u-icon name="arrow-right" size="20" color="#999"></u-icon>
    </view>

    <!-- 包裹信息部分 -->
    <view class="package-info">
      <view class="section-title">包裹信息</view>
      <view class="package-item">
        <view class="package-type">
          <image :src="getPackageTypeImage(packageInfo.itemType)" mode="aspectFit" class="type-icon" />
        </view>
        <view class="package-detail">
          <view class="tracking-info">
            <text class="label">运单号：</text>
            <text class="value">{{packageInfo.trackingNumber}}</text>
          </view>
          <view class="type-info">
            <text class="label">包裹类型：</text>
            <text class="value">{{packageInfo.itemType}}</text>
          </view>
        </view>
      </view>
    </view>


    <!-- 配送时间 -->
    <view class="delivery-time">
      <view class="section-title">配送时间</view>
      <picker mode="multiSelector" :range="timeRange" @change="onTimeChange">
        <view class="time-picker selector-info">
          <view class="left">
            <u-icon name="clock" size="16" color="#666"></u-icon>
            <text>{{selectedTime || '请选择配送时间'}}</text>
          </view>
          <view class="right">
            <u-icon name="arrow-right" size="16" color="#999"></u-icon>
          </view>
        </view>
      </picker>
    </view>

    <!-- 优惠券 -->
    <view class="coupon-section" @click="openCouponPopup">
      <view class="section-title">优惠券</view>
      <view class="coupon-info selector-info">
        <view class="left">
          <u-icon name="coupon" size="16" color="#666"></u-icon>
          <text v-if="selectedCoupon">
            已选择：{{formatDiscountValue(selectedCoupon) + selectedCoupon.couponType}}
          </text>
          <text v-else>请选择优惠券</text>
        </view>
        <view class="right">
          <u-icon v-if="selectedCoupon" name="close" size="16" color="#999" @click.stop="removeSelectedCoupon"></u-icon>
          <u-icon name="arrow-right" size="16" color="#999"></u-icon>
        </view>
      </view>
    </view>

    <!-- 配送费用信息 -->
    <view class="fee-section">
      <view class="fee-table">
        <view class="fee-row">
          <text>配送费</text>
          <text>¥{{deliveryFee}}</text>
        </view>
        <view class="fee-row" v-if="selectedCoupon">
          <text>优惠金额</text>
          <text class="discount">-¥{{(deliveryFee-totalAmount).toFixed(2)}}</text>
        </view>
        <view class="fee-row total">
          <text>总计</text>
          <text class="total-amount">¥{{totalAmount}}</text>
        </view>
      </view>
    </view>

    <!-- 提交订单按钮 -->
    <view class="submit-btn" @click="submitOrder">提交订单</view>

    <!-- 优惠券弹窗 -->
    <!-- 优惠券弹窗 -->
    <u-popup v-model="showPopup" mode="bottom" :mask-close-able="true" :safe-area-inset-bottom="true"
      border-radius="16">
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
    background-color: #f5f7fa; // 更改背景色为更柔和的色调
    padding-bottom: 120rpx;

    // 统一的卡片样式
    .address-section,
    .package-info,
    .delivery-time,
    .coupon-section,
    .fee-section {
      background-color: #fff;
      padding: 32rpx;
      margin: 20rpx;
      border-radius: 16rpx;
      box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
    }

    // 统一的标题样式
    .section-title {
      font-size: 30rpx;
      color: #2c3e50;
      font-weight: 600;
      margin-bottom: 24rpx;
      position: relative;
      padding-left: 24rpx;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 6rpx;
        height: 24rpx;
        background-color: #409EFF;
        border-radius: 3rpx;
      }
    }

    // 地址部分样式优化
    .address-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 32rpx;
      background: #fff;

      .address-info {
        flex: 1;
        margin-right: 20rpx;

        .user-info {
          margin-bottom: 12rpx;
          display: flex;
          align-items: center;

          .name {
            font-size: 32rpx;
            font-weight: 600;
            color: #2c3e50;
            margin-right: 24rpx;
          }

        }

        .address {
          font-size: 28rpx;
          color: #606266;
          line-height: 1.4;
        }
      }

      .no-address {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 12rpx;

        .placeholder {
          font-size: 30rpx;
          color: #909399;
        }
      }
    }

    // 包裹信息样式优化
    .package-info {
      .package-item {
        display: flex;
        align-items: center;
        gap: 24rpx;
        padding: 20rpx;
        background: #f8f9fc;
        border-radius: 12rpx;

        .package-type {
          width: 80rpx;
          height: 80rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          border-radius: 12rpx;
          box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

          .type-icon {
            width: 48rpx;
            height: 48rpx;
          }
        }

        .package-detail {
          flex: 1;

          .tracking-info,
          .type-info {
            display: flex;
            align-items: center;
            margin-bottom: 8rpx;

            &:last-child {
              margin-bottom: 0;
            }

            .label {
              font-size: 26rpx;
              color: #909399;
              margin-right: 8rpx;
            }

            .value {
              font-size: 28rpx;
              color: #2c3e50;
              font-weight: 500;
            }
          }
        }
      }
    }


    // 选择器通用样式
    .selector-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #f5f7fa;
      padding: 24rpx;
      border-radius: 12rpx;
      font-size: 28rpx;
      color: #606266;

      .left {
        display: flex;
        align-items: center;
        gap: 12rpx;
      }

      .right {
        display: flex;
        align-items: center;
        gap: 8rpx;
      }
    }

    // 优惠券弹窗样式优化
    .coupon-popup {
      padding: 32rpx;
      border-radius: 24rpx 24rpx 0 0;

      .popup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 32rpx;

        .title {
          font-size: 32rpx;
          font-weight: 600;
          color: #2c3e50;
        }
      }

      .coupon-list {
        max-height: 60vh;
        padding: 0 0 32rpx;
      }

      .coupon-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24rpx;
        margin-bottom: 16rpx;
        background: #fff;
        border: 2rpx solid #edf2f7;
        border-radius: 12rpx;
        transition: all 0.3s ease;

        &.active {
          background: #ecf5ff;
          border-color: #409EFF;
        }

        .coupon-left {
          .discount-value {
            color: #409EFF;
            font-size: 36rpx;
            font-weight: 600;
            margin-right: 8rpx;
          }

          .coupon-type {
            font-size: 24rpx;
            color: #909399;
          }
        }

        .coupon-right {
          .valid-date {
            font-size: 24rpx;
            color: #909399;
          }
        }
      }

      .popup-footer {
        padding-top: 24rpx;

        .confirm-btn {
          width: 100%;
          height: 88rpx;
          line-height: 88rpx;
          text-align: center;
          color: #fff;
          background: linear-gradient(135deg, #409EFF 0%, #3481e3 100%);
          border-radius: 44rpx;
          font-size: 32rpx;
          font-weight: 600;
          box-shadow: 0 4rpx 12rpx rgba(64, 158, 255, 0.3);
          transition: all 0.3s ease;

          &:active {
            transform: scale(0.98);
          }
        }
      }
    }

    // 费用部分样式优化
    .fee-section {
      .fee-table {
        .fee-row {
          padding: 16rpx 0;

          text {
            color: #606266;
            font-size: 28rpx;

            &.discount {
              color: #ff6b6b;
            }
          }
        }

        .total {
          border-top: 2rpx solid #edf2f7;
          margin-top: 16rpx;
          padding-top: 24rpx;

          .total-amount {
            color: #409EFF;
            font-size: 36rpx;
            font-weight: 600;
          }
        }
      }
    }


    // 提交按钮样式优化
    .submit-btn {
      position: fixed;
      left: 20rpx;
      right: 20rpx;
      bottom: 20rpx;
      height: 96rpx;
      line-height: 96rpx; // 添加行高使文字垂直居中
      background: linear-gradient(135deg, #409EFF 0%, #3481e3 100%);
      color: #fff; // 添加文字颜色
      font-size: 32rpx;
      font-weight: 600;
      text-align: center; // 添加文字水平居中
      box-shadow: 0 4rpx 12rpx rgba(64, 158, 255, 0.3);
      border-radius: 48rpx;
      z-index: 100; // 确保按钮在最上层

      // 添加点击效果
      &:active {
        transform: scale(0.98);
      }
    }
  }
</style>