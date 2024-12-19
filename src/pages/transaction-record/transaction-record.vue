<template>
  <view class="transaction-container">
    <!-- 标题栏
    <view class="header">
      <text class="title">我的账单</text>
    </view> -->

    <!-- 月份选择和统计 -->
    <view class="month-section">
      <view class="month-picker" @click="showPicker = true">
        <text class="month">{{ formatMonth(currentMonth) }}</text>
        <u-icon name="arrow-down" size="14" color="#666"></u-icon>
      </view>
      <view class="month-stats">
        <text>充值：¥{{ monthlyStats.rechargeAmount || '0.00' }}</text>
        <text class="divider">|</text>
        <text>消费：¥{{ monthlyStats.expenditureAmount || '0.00' }}</text>
      </view>
    </view>

    <!-- 交易列表 -->
    <scroll-view scroll-y class="transaction-list">
      <view class="transaction-item" v-for="payment in currentMonthPayments" :key="payment.paymentId">
    <!-- 左侧图标 -->
    <view class="item-icon" :class="getIconClass(payment.paymentType)">
      <u-icon :name="getIconName(payment.paymentType)" size="24" color="#FFF"></u-icon>
    </view>
    
    <!-- 中间信息 -->
    <view class="item-info">
      <view class="info-main">
        <text class="type">{{ getDisplayType(payment) }}</text>
        <text class="time">{{ formatDateTime(payment.paymentTime) }}</text>
      </view>
      <text class="order-id" v-if="payment.orderId">{{ payment.orderId }}</text>
    </view>

    <!-- 右侧金额 -->
    <text class="item-amount" :class="getAmountClass(payment)">
      {{ getAmountPrefix(payment) }}{{ payment.amount.toFixed(2) }}
    </text>
  </view>

      <!-- 无数据提示 -->
      <view v-if="!currentMonthPayments.length" class="empty-tip">
        <text>暂无交易记录</text>
      </view>
    </scroll-view>

    <!-- 月份选择器 -->
    <u-popup v-model="showPicker" mode="bottom" :safe-area-inset-bottom="true">
      <view class="popup-container">
        <view class="popup-header">
          <text @click="showPicker = false">取消</text>
          <text>选择月份</text>
          <text class="confirm-btn" @click="showPicker = false">确定</text>
        </view>
        <view class="month-list">
          <view 
            class="month-item" 
            v-for="item in months" 
            :key="item.value"
            :class="{ active: currentMonth === item.value }"
            @click="selectMonth(item.value)"
          >
            <text>{{ item.text }}</text>
            <u-icon v-if="currentMonth === item.value" name="checkmark" color="#3B82F6" size="16"></u-icon>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup>
import { ref, computed,onMounted } from 'vue';
import { fetchPersonalPaymentsAPI } from '../../api/api-user';

const transactionData = ref([]);
const currentMonth = ref('');
const showPicker = ref(false);

// 月份选择器数据
const months = computed(() => {
  return transactionData.value.map(item => ({
    text: formatMonth(item.month),
    value: item.month
  }));
});
// 修改月份选择处理方法
const selectMonth = (month) => {
  currentMonth.value = month;
  showPicker.value = false;
  // 可以在这里添加选择后的其他处理逻辑
};
// 当前月份统计
const monthlyStats = computed(() => {
  const monthData = transactionData.value.find(item => item.month === currentMonth.value);
  if (!monthData) return { rechargeAmount: 0, expenditureAmount: 0 };

  // 计算实际消费金额（减去退款金额）
  const expenditure = monthData.payments
    .filter(p => p.paymentType === '支付')
    .reduce((sum, p) => sum + p.amount, 0);
    
  const refunds = monthData.payments
    .filter(p => p.paymentType === '退款')
    .reduce((sum, p) => sum + p.amount, 0);

  const recharge = monthData.payments
    .filter(p => p.paymentType === '充值')
    .reduce((sum, p) => sum + p.amount, 0);

  return {
    rechargeAmount: recharge.toFixed(2),
    expenditureAmount: (expenditure - refunds).toFixed(2)
  };
});

// 当前月份交易记录
const currentMonthPayments = computed(() => {
  const monthData = transactionData.value.find(item => item.month === currentMonth.value);
  if (!monthData) return [];
  
  // 对交易记录按时间倒序排序
  return [...monthData.payments].sort((a, b) => {
    return new Date(b.paymentTime) - new Date(a.paymentTime);
  });
});

// 格式化月份显示
const formatMonth = (monthStr) => {
  if (!monthStr) return '';
  const [year, month] = monthStr.split('-');
  return `${month}月`;
};

// 格式化日期时间
const formatDateTime = (dateTimeStr) => {
  try {
    // 将 "2024-12-07 11:04:22" 转换为 "2024-12-07T11:04:22"
    const standardDate = dateTimeStr.replace(' ', 'T');
    const date = new Date(standardDate);
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }

    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${month}-${day} ${hours}:${minutes}`;
  } catch (error) {
    console.error('Date parsing error:', error);
    // 如果日期解析失败，返回原始字符串的简化版本
    return dateTimeStr.split(' ')[0];
  }
};

// 获取图标类名
const getIconClass = (type) => {
  const classMap = {
    '充值': 'recharge',
    '退款': 'refund',
    '支付': 'payment'
  };
  return classMap[type] || 'payment';
};

// 获取图标名称
const getIconName = (type) => {
  const iconMap = {
    '充值': 'plus',
    '退款': 'reload',
    '支付': 'minus'
  };
  return iconMap[type] || 'minus';
};

// 获取显示类型
const getDisplayType = (payment) => {
  if (payment.paymentType === '支付') {
    return '消费 | ' + (payment.paymentMethod || '钱包');
  }
  return payment.paymentType;
};

// 获取金额样式
const getAmountClass = (payment) => {
  return payment.paymentType === '支付' ? 'expense' : 'income';
};

// 获取金额前缀
const getAmountPrefix = (payment) => {
  return payment.paymentType === '支付' ? '-' : '+';
};

// 月份选择处理
const onMonthSelect = (e) => {
  currentMonth.value = e.value[0];
  showPicker.value = false;
};

// 获取交易数据
const fetchTransactionData = async () => {
  try {
    const response = await fetchPersonalPaymentsAPI();
    if (response.code === 23141) {
      // 对月份数据按时间倒序排序
      transactionData.value = response.data.sort((a, b) => {
        return new Date(b.month) - new Date(a.month);
      });
      
      if (transactionData.value.length > 0) {
        // 默认选择最新月份
        currentMonth.value = transactionData.value[0].month;
      }
    }
  } catch (error) {
    console.error('获取交易记录失败:', error);
  }
};

onMounted(() => {
  fetchTransactionData();
});

// 格式化优惠券值
const formatDiscountValue = (coupon) => {
  if (coupon.couponType === '折扣券') {
    // 将小数乘以10并四舍五入到1位小数，确保显示正确的折扣值
    const discount = Math.round(coupon.discountValue * 100) / 10;
    return `${discount}折`;
  } else {
    return `¥${coupon.discountValue}`;
  }
};

// 计算优惠后金额也需要注意精度问题
const calculateTotal = () => {
  let total = deliveryFee.value;

  if (selectedCoupon.value) {
    if (selectedCoupon.value.couponType === '折扣券') {
      // 使用 toFixed 确保精确计算
      total = (total * selectedCoupon.value.discountValue).toFixed(2);
      total = parseFloat(total); // 转回数字
    } else {
      total -= selectedCoupon.value.discountValue;
    }
  }

  return Math.max(total, 0).toFixed(2);
};
</script>

<style lang="scss" scoped>
.transaction-container {
  min-height: 100vh;
  background: #F7F7F7;
}

.header {
  padding: 16px 20px;
  background: #FFF;
  
  .title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }
}

.month-section {
  padding: 12px 20px;
  background: #FFF;
  border-bottom: 1px solid #F0F0F0;

  .month-picker {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    .month {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      margin-right: 4px;
    }
  }

  .month-stats {
    font-size: 13px;
    color: #666;

    .divider {
      margin: 0 8px;
      color: #DDD;
    }
  }
}

.transaction-list {
 // padding: 0 20px;
  max-height: calc(100vh - 140px);
}

.transaction-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #F0F0F0;
  gap: 12px; // 添加间距

  .item-icon {
    flex-shrink: 0; // 防止图标缩小
    width: 40px;
    height: 40px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    &.recharge {
      background: #4CD964;
    }

    &.refund {
      background: #4CD964;
    }

    &.payment {
      background: #007AFF;
    }
  }

  .item-info {
    flex: 1;
    min-width: 0; // 关键：允许子元素收缩
    
    .info-main {
      display: flex;
      flex-direction: column;
      gap: 4px;
      
      .type {
        font-size: 16px;
        color: #333;
        white-space: nowrap; // 防止换行
        overflow: hidden;    // 隐藏溢出
        text-overflow: ellipsis; // 显示省略号
      }

      .time {
        font-size: 12px;
        color: #999;
      }
    }

    .order-id {
      font-size: 12px;
      color: #999;
      margin-top: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .item-amount {
    flex-shrink: 0; // 防止金额缩小
    font-size: 16px;
    font-weight: 500;
    min-width: 80px; // 设置最小宽度
    text-align: right; // 右对齐

    &.income {
      color: #4CD964;
    }

    &.expense {
      color: #333;
    }
  }
}

.empty-tip {
  padding: 40px 0;
  text-align: center;
  color: #999;
  font-size: 14px;
}
.popup-container {
  background-color: #fff;
  border-radius: 24rpx 24rpx 0 0;
  padding-bottom: env(safe-area-inset-bottom);

  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid #eee;
    font-size: 28rpx;

    .confirm-btn {
      color: #3B82F6;
    }
  }

  .month-list {
    max-height: 60vh;
    overflow-y: auto;

    .month-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx;
      font-size: 32rpx;
      color: #333;
      border-bottom: 1rpx solid #eee;

      &:last-child {
        border-bottom: none;
      }

      &.active {
        color: #3B82F6;
      }
    }
  }
}
</style>