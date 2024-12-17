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
    <!-- 配送时间选择 -->
    <!-- <view class="select-item">
    <view class="select-left">
      <text class="select-label">配送时间</text>
    </view>
    <view class="select-right">
      <picker mode="multiSelector" 
        :range="timeRange" 
        @change="onTimeChange"
        :value="[0, currentTimeSlotIndex]">
        <text class="select-value" :class="{'has-selected': selectedTime}">
          {{ selectedTime || '请选择配送时间' }}
        </text>
      </picker>
    </view>
  </view> -->
    <!-- 配送时间选择 -->
    <view class="delivery-time-section">
      <view class="section-title">配送时间</view>

      <!-- 快捷选择 -->
      <!-- 快捷选择 -->
      <view class="quick-select">
        <view class="time-option immediate" :class="{ active: deliveryType === 'immediate' }" @tap="selectImmediate">
          <text class="option-title">立即配送</text>
          <text class="option-desc">预计 {{ getEstimatedTime() }} 送达</text>
        </view>
        <view class="time-option scheduled" :class="{ active: deliveryType === 'scheduled' }" @tap="openTimeSelector">
          <text class="option-title">预约配送</text>
          <text class="option-desc">{{
          deliveryType === 'scheduled' ? 
          (scheduledTime || '选择配送时间') : 
          '选择配送时间' 
        }}</text>
        </view>
      </view>

      <!-- 时间选择弹窗 -->
      <u-popup v-model="showTimePicker" mode="bottom" round="16">
        <view class="time-picker-popup">
          <view class="popup-header">
            <text>选择配送时间</text>
            <text class="close-btn" @tap="showTimePicker = false">✕</text>
          </view>

          <!-- 日期选择 -->
          <view class="date-tabs">
            <view v-for="(date, index) in dateOptions" :key="index" class="date-tab"
              :class="{ active: selectedDateIndex === index }" @tap="selectDate(index)">
              <text class="date-name">{{ date.name }}</text>
              <text class="date-value">{{ date.date }}</text>
            </view>
          </view>

          <!-- 时间段选择 -->
          <scroll-view scroll-y class="time-slots">
            <view v-for="(slot, index) in availableTimeSlots" :key="index" class="time-slot"
              :class="{ active: selectedTimeSlot === slot }" @tap="selectTimeSlot(slot)">
              {{ slot }}
            </view>
          </scroll-view>

          <!-- 确认按钮 -->
          <view class="confirm-btn" @tap="confirmTimeSelection">
            确认
          </view>
        </view>
      </u-popup>
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
    getCurrentInstance,
    onUnmounted
  } from 'vue';
  import dayjs from 'dayjs';
  import {
    onLoad,
    onShow
  } from "@dcloudio/uni-app"
  import {
    fetchUnUsedCouponssDataAPI,
    fetchAddressDataAPI
  } from '@/api/api-user';
  import {
    orderAPI
  } from '@/api/api-order';

  // 获取当前时间
  const now = dayjs();
  const currentHour = now.hour();
  const currentMinute = now.minute();
  const deliveryType = ref('immediate'); // immediate 或 scheduled
  const showTimePicker = ref(false);
  const selectedDateIndex = ref(0);
  const selectedTimeSlot = ref('');
  const scheduledTime = ref(''); // 显示用的文本
  const actualDeliveryTime = ref(''); // 实际发送给后端的时间值


  // 生成日期选项
  const dateOptions = computed(() => {
    const today = dayjs();
    return [{
        name: '今天',
        date: today.format('MM-DD'),
        fullDate: today.format('YYYY-MM-DD')
      },
      {
        name: '明天',
        date: today.add(1, 'day').format('MM-DD'),
        fullDate: today.add(1, 'day').format('YYYY-MM-DD')
      },
      {
        name: '后天',
        date: today.add(2, 'day').format('MM-DD'),
        fullDate: today.add(2, 'day').format('YYYY-MM-DD')
      }
    ];
  });

  // 生成可选时间段
  const availableTimeSlots = computed(() => {
    const slots = [];
    const now = dayjs();
    const currentHour = now.hour();
    const currentMinute = now.minute();

    // 如果是今天，从当前时间开始
    if (selectedDateIndex.value === 0) {
      let startHour = currentHour;
      let startMinute = Math.ceil(currentMinute / 30) * 30;

      if (startMinute === 60) {
        startHour++;
        startMinute = 0;
      }

      for (let h = startHour; h < 24; h++) {
        for (let m = h === startHour ? startMinute : 0; m < 60; m += 30) {
          slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
        }
      }
    } else {
      // 其他日期显示全天时间段
      for (let h = 8; h < 22; h++) {
        for (let m = 0; m < 60; m += 30) {
          slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
        }
      }
    }

    return slots;
  });

  // 生成时间段
  const generateTimeSlots = () => {
    const slots = [];
    const currentTime = dayjs();

    // 从当前时间开始,每30分钟一个时间段,生成未来4小时内的时间段
    for (let i = 0; i < 8; i++) {
      const slotTime = currentTime.add(30 * i, 'minute');
      slots.push(slotTime.format('HH:mm'));
    }

    return slots;
  };
  // 选择立即配送
  // 修改选择立即配送的方法
  const selectImmediate = () => {
    deliveryType.value = 'immediate';
    scheduledTime.value = ''; // 清空预约配送的显示文本
    // 立即配送时，实际时间设为当前时间
    actualDeliveryTime.value = dayjs().format('YYYY-MM-DD HH:mm');
  };

  // 打开时间选择器
  const openTimeSelector = () => {
    deliveryType.value = 'scheduled';
    if (!scheduledTime.value) {
      // 如果没有选择过预约时间，不要显示立即配送的时间
      scheduledTime.value = '选择配送时间';
    }
    showTimePicker.value = true;
  };

  // 选择日期
  const selectDate = (index) => {
    selectedDateIndex.value = index;
    selectedTimeSlot.value = '';
  };

  // 选择时间段
  const selectTimeSlot = (slot) => {
    selectedTimeSlot.value = slot;
  };

  // 确认时间选择
  const confirmTimeSelection = () => {
    if (!selectedTimeSlot.value) {
      uni.showToast({
        title: '请选择配送时间',
        icon: 'none'
      });
      return;
    }

    const date = dateOptions.value[selectedDateIndex.value];
    // 更新显示文本
    scheduledTime.value = `${date.name} ${selectedTimeSlot.value}`;

    // 更新实际时间值，格式化为 YYYY-MM-DD HH:mm
    actualDeliveryTime.value = dayjs(`${date.fullDate} ${selectedTimeSlot.value}`).format('YYYY-MM-DD HH:mm');

    showTimePicker.value = false;
  };
  // 提供给父组件的方法，获取实际配送时间
  const getDeliveryTime = () => {
    return {
      type: deliveryType.value,
      time: actualDeliveryTime.value
    };
  };
  // 获取预计送达时间
  const getEstimatedTime = () => {
    return dayjs().add(30, 'minutes').format('HH:mm');
  };
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
  // 初始化默认地址
  // 初始化默认地址
  const initDefaultAddress = async () => {
    try {
      const res = await fetchAddressDataAPI()
      if (res.code === 23031) {
        // 查找默认地址
        const defaultAddress = res.data.find(addr => addr.is_default)
        if (defaultAddress) {
          // 检查默认地址是否属于当前站点
          if (defaultAddress.region.includes(packageInfo.value.siteName)) {
            // 地址有效，设置地址
            address.value = {
              id: defaultAddress.address_id,
              name: defaultAddress.recipient_name,
              fullAddress: `${defaultAddress.region} ${defaultAddress.building}`
            }
          } else {
            // 默认地址不属于当前站点，提示用户重新选择
            uni.showModal({
              title: '提示',
              content: `当前默认地址不在${packageInfo.value.siteName}，请重新选择配送地址`,
              showCancel: false,
              // success: () => {
              //   // 模态框关闭后自动打开地址选择
              //   chooseAddress();
              // }
            });
          }
        } else {
          // 没有默认地址，提示用户选择
          uni.showModal({
            title: '提示',
            content: '请选择配送地址',
            showCancel: false,
            success: () => {
              chooseAddress();
            }
          });
        }
      }
    } catch (error) {
      console.error('获取默认地址失败:', error)
      uni.showToast({
        title: '获取地址信息失败',
        icon: 'none'
      });
    }
  }
  // 配送时间选择
  const timeRange = ref([
    ['立即配送'], // 第一列固定为"立即配送"
    generateTimeSlots() // 第二列为具体时间段
  ]);
  // 计算当前应该默认选中的时间段索引
  const currentTimeSlotIndex = computed(() => {
    return 0; // 默认选中第一个时间段
  });
  const selectedTime = ref('')
  // 优惠券相关状态变量
  const showPopup = ref(false);
  const coupons = ref([]);
  const selectedCoupon = ref(null);
  const deliveryFee = ref(2.5); // 配送费用

  // 选择地址
  // 选择地址
  // const chooseAddress = () => {
  //   uni.navigateTo({
  //     url: '/pages/address/address?mode=select'
  //   });
  // };
  const chooseAddress = () => {

    uni.navigateTo({
      url: `/pages/address/address?mode=select&siteName=${encodeURIComponent(packageInfo.value.siteName)}`
    });
  };
  // 统一处理地址更新的函数
  const updateAddress = (selectedAddr) => {
    console.log('收到选中的地址:', selectedAddr);
    address.value = {
      id: selectedAddr.addressId,
      name: selectedAddr.recipientName,
      fullAddress: `${selectedAddr.region} ${selectedAddr.building}`
    };
  };

  // 监听地址选择事件
  onShow(() => {
    uni.$on('addressSelected', updateAddress);
  });

  // 记得在页面卸载时移除事件监听
  onUnmounted(() => {
    uni.$off('addressSelected');
  });

  // // 由于使用了 setup 语法，需要暴露 address 变量
  // defineExpose({
  //   address
  // });
  // 选择配送时间
  // 选择配送时间
  const onTimeChange = (e) => {
    const [dateIndex, timeIndex] = e.detail.value;

    if (dateIndex === 0) { // 选择立即配送
      const estimatedTime = dayjs().add(30, 'minute').format('HH:mm');
      selectedTime.value = `立即配送 (预计${estimatedTime}送达)`;
    } else {
      selectedTime.value = timeRange.value[1][timeIndex];
    }
  };
  // 获取预计送达时间
  const getEstimatedDeliveryTime = () => {
    return dayjs().add(30, 'minute').format('HH:mm');
  };
  // 获取格式化的日期
  const getFormattedDate = (dateIndex) => {
    const date = new Date()
    date.setDate(date.getDate() + dateIndex)
    return dayjs(date).format('YYYY-MM-DD')
  }

  // // 重新打开时间选择器
  // const openTimeSelector = () => {
  //   // 这里添加重新打开时间选择器的逻辑
  // }

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
  // delivery-detail.vue
  import {
    fetchPersonalBalanceAPI
  } from '@/api/api-user';

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

    // 检查余额
    try {
      const balanceRes = await fetchPersonalBalanceAPI();
      if (balanceRes.code === 23051) {
        const balance = balanceRes.data;
        const orderAmount = Number(totalAmount.value);

        if (balance < orderAmount) {
          // 显示确认框
          uni.showModal({
            title: '余额不足',
            content: `当前余额：¥${balance}\n订单金额：¥${orderAmount}\n是否前往充值？`,
            confirmText: '去充值',
            cancelText: '取消',
            success: (res) => {
              if (res.confirm) {
                // 用户点击确认，跳转到钱包页面
                uni.navigateTo({
                  url: '/pages/wallet/wallet'
                });
              }
            }
          });
          return;
        }
      }

      // 余额充足，继续提交订单
      uni.showLoading({
        title: '提交中...'
      });

      try {
        const orderInfo = {
          packageId: packageInfo.value.trackingNumber,
          startTime: actualDeliveryTime.value,
          addressId: address.value.id,
          couponId: selectedCoupon.value?.couponId || null,
          payment_method: '钱包',
          amount: Number(totalAmount.value)
        };

        const res = await orderAPI(orderInfo);

        if (res.code === 24021) {
          uni.hideLoading();
          uni.$emit('refreshPackageList');
          uni.showToast({
            title: '订单提交成功',
            icon: 'success',
            duration: 1500,
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
    } catch (error) {
      console.error('获取余额失败:', error);
      uni.showToast({
        title: '获取余额信息失败',
        icon: 'none'
      });
    }
  }

  // 页面加载时初始化默认地址
  // 页面加载时默认选择立即配送
  onMounted(() => {
    // initDefaultAddress();
    selectedTime.value = `立即配送 (预计${getEstimatedDeliveryTime()}送达)`;
    selectImmediate();
  })

  onLoad((options) => {
    const instance = getCurrentInstance().proxy
    const eventChannel = instance.getOpenerEventChannel();

    // 接收包裹数据
    eventChannel.on('parcelData', (data) => {
      packageInfo.value = data;
      console.log('接收到的包裹数据:', data);
      initDefaultAddress();
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

  .delivery-time-section {
    padding: 20rpx;
    background: #fff;
    border-radius: 12rpx;
    margin: 20rpx;

    .section-title {
      font-size: 28rpx;
      color: #333;
      margin-bottom: 20rpx;
    }

    .quick-select {
      display: flex;
      gap: 20rpx;

      .time-option {
        flex: 1;
        padding: 20rpx;
        border-radius: 8rpx;
        background: #f8f8f8;
        border: 2rpx solid #eee;

        &.active {
          background: #ecf5ff;
          border-color: #409eff;
        }

        .option-title {
          font-size: 28rpx;
          color: #333;
          margin-bottom: 8rpx;
          display: block;
        }

        .option-desc {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }

  .time-picker-popup {
    background: #fff;
    border-radius: 24rpx 24rpx 0 0;

    .popup-header {
      padding: 30rpx;
      text-align: center;
      font-size: 32rpx;
      font-weight: 500;
      border-bottom: 1rpx solid #eee;
      position: relative;

      .close-btn {
        position: absolute;
        right: 30rpx;
        top: 50%;
        transform: translateY(-50%);
        font-size: 40rpx;
        color: #999;
      }
    }

    .date-tabs {
      display: flex;
      padding: 20rpx;
      border-bottom: 1rpx solid #eee;

      .date-tab {
        flex: 1;
        text-align: center;
        padding: 20rpx;
        border-radius: 8rpx;

        &.active {
          background: #409eff;

          .date-name,
          .date-value {
            color: #fff;
          }
        }

        .date-name {
          font-size: 28rpx;
          color: #333;
          margin-bottom: 8rpx;
          display: block;
        }

        .date-value {
          font-size: 24rpx;
          color: #666;
        }
      }
    }

    .time-slots {
      max-height: 600rpx;
      padding: 20rpx;

      .time-slot {
        padding: 20rpx;
        text-align: center;
        border-radius: 8rpx;
        margin-bottom: 16rpx;
        background: #f8f8f8;

        &.active {
          background: #409eff;
          color: #fff;
        }
      }
    }

    .confirm-btn {
      margin: 20rpx;
      height: 88rpx;
      line-height: 88rpx;
      text-align: center;
      background: #409eff;
      color: #fff;
      border-radius: 44rpx;
      font-size: 32rpx;
    }
  }

  // // 适配暗黑模式（可选）
  // @media (prefers-color-scheme: dark) {
  //   // 这里可以添加暗黑模式的样式
  // }
</style>