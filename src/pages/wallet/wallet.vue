<template>
  <view class="wallet-container">
    <!-- 顶部余额卡片 -->
    <view class="balance-card">
      <view class="balance-header">
        <text class="label">我的余额</text>
        <view class="record-btn" @click="toTransactionRecord">
          <u-icon name="list" size="16" color="#fff"></u-icon>
          <text>交易记录</text>
        </view>
      </view>
      <view class="balance-amount">
        <text class="currency">¥</text>
        <text class="number">{{ formatBalance(balance) }}</text>
      </view>
      <view class="balance-tips">余额可用于支付快递费用</view>
    </view>

    <!-- 充值金额选择 -->
    <view class="recharge-section">
      <view class="section-title">
        <text>选择充值金额</text>
        <text class="subtitle">充值金额将实时到账</text>
      </view>
      
      <view class="amount-grid">
        <view 
          v-for="amount in chargeOptions" 
          :key="amount"
          :class="['amount-item', { active: selectedAmount === amount }]"
          @click="selectAmount(amount)"
        >
          <text class="amount">¥{{ amount }}</text>
          <text class="bonus" v-if="getBonus(amount)">送{{ getBonus(amount) }}元</text>
        </view>
      </view>

      <!-- 自定义金额 -->
      <view class="custom-amount">
        <text>其他金额</text>
        <input 
          type="digit" 
          v-model="customAmount"
          placeholder="请输入充值金额"
          @input="onCustomAmountInput"
        />
      </view>
    </view>

    <!-- 支付方式选择 -->
    <view class="payment-section">
      <view class="section-title">支付方式</view>
      <view class="payment-options">
        <view 
          v-for="method in paymentMethods" 
          :key="method.id"
          :class="['payment-item', { active: selectedPayment === method.id }]"
          @click="selectPayment(method.id)"
        >
          <u-icon :name="method.icon" size="24" :color="method.color"></u-icon>
          <text>{{ method.name }}</text>
          <u-icon 
            name="checkmark-circle" 
            size="20" 
            color="#3498db"
            v-if="selectedPayment === method.id"
          ></u-icon>
        </view>
      </view>
    </view>

    <!-- 底部充值按钮 -->
    <view class="bottom-bar">
      <view class="total-amount">
        <text>实付金额：</text>
        <text class="price">¥{{ getFinalAmount() }}</text>
      </view>
      <button 
        class="recharge-btn" 
        :disabled="!canRecharge"
        @click="handleRecharge"
      >
        立即充值
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';

const balance = ref(0);
const chargeOptions = ref([10, 30, 50, 100, 200, 500]);
const selectedAmount = ref(null);
const customAmount = ref('');
const selectedPayment = ref('wxpay');

// 支付方式
const paymentMethods = [
  { id: 'wxpay', name: '微信支付', icon: 'weixin-fill', color: '#07c160' },
  { id: 'alipay', name: '支付宝', icon: 'alipay-fill', color: '#1677ff' }
];

// 格式化余额
const formatBalance = (value) => {
  return Number(value).toFixed(2);
};

// 获取赠送金额
const getBonus = (amount) => {
  if (amount >= 500) return 50;
  if (amount >= 200) return 20;
  if (amount >= 100) return 10;
  return 0;
};

// 选择金额
const selectAmount = (amount) => {
  selectedAmount.value = amount;
  customAmount.value = '';
};

// 自定义金额输入
const onCustomAmountInput = (e) => {
  selectedAmount.value = null;
};

// 选择支付方式
const selectPayment = (method) => {
  selectedPayment.value = method;
};

// 获取最终支付金额
const getFinalAmount = () => {
  const amount = customAmount.value || selectedAmount.value || 0;
  return formatBalance(amount);
};

// 是否可以充值
const canRecharge = computed(() => {
  const amount = Number(customAmount.value || selectedAmount.value || 0);
  return amount > 0 && selectedPayment.value;
});

// 充值处理
const handleRecharge = () => {
  if (!canRecharge.value) return;
  
  uni.showLoading({ title: '处理中...' });
  
  // 模拟支付过程
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({
      title: '充值成功',
      icon: 'success',
      duration: 2000,
      success: () => {
        setTimeout(() => {
          uni.navigateBack();
        }, 2000);
      }
    });
  }, 1500);
};

// 跳转到交易记录
const toTransactionRecord = () => {
  uni.navigateTo({
    url: '/pages/transaction-record/transaction-record'
  });
};
</script>

<style lang="scss" scoped>
.wallet-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-bottom: 100px;
}

.balance-card {
  background: linear-gradient(135deg, #3498db, #2980b9);
  padding: 24px;
  margin: 20px;
  border-radius: 16px;
  color: #fff;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);

  .balance-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .label {
      font-size: 16px;
      opacity: 0.9;
    }

    .record-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
      opacity: 0.9;
    }
  }

  .balance-amount {
    margin: 16px 0;
    
    .currency {
      font-size: 24px;
      margin-right: 4px;
    }

    .number {
      font-size: 40px;
      font-weight: 600;
    }
  }

  .balance-tips {
    font-size: 12px;
    opacity: 0.8;
  }
}

.recharge-section, .payment-section {
  background: #fff;
  margin: 20px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .subtitle {
    font-size: 12px;
    color: #999;
    font-weight: normal;
  }
}

.amount-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;

  .amount-item {
    position: relative;
    height: 80px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;

    &.active {
      border-color: #3498db;
      background-color: #ebf7ff;
    }

    .amount {
      font-size: 18px;
      font-weight: 500;
      color: #333;
    }

    .bonus {
      font-size: 12px;
      color: #ff6b6b;
      margin-top: 4px;
    }
  }
}

.custom-amount {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-top: 1px solid #f0f0f0;

  text {
    font-size: 14px;
    color: #666;
    margin-right: 12px;
  }

  input {
    flex: 1;
    height: 40px;
    background: #f5f7fa;
    border-radius: 6px;
    padding: 0 12px;
    font-size: 14px;
  }
}

.payment-options {
  .payment-item {
    display: flex;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    text {
      flex: 1;
      margin-left: 12px;
      font-size: 15px;
      color: #333;
    }
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);

  .total-amount {
    font-size: 14px;
    color: #666;

    .price {
      font-size: 20px;
      font-weight: 600;
      color: #ff6b6b;
    }
  }

  .recharge-btn {
    width: 120px;
    height: 44px;
    background: #3498db;
    color: #fff;
    border-radius: 22px;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;

    &:active {
      transform: scale(0.98);
      background: darken(#3498db, 5%);
    }

    &[disabled] {
      background: #bdc3c7;
      opacity: 0.8;
    }
  }
}
</style>