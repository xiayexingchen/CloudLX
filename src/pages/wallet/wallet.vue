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
        <view v-for="amount in chargeOptions" :key="amount"
          :class="['amount-item', { active: selectedAmount === amount }]" @click="selectAmount(amount)">
          <text class="amount">¥{{ amount }}</text>
          <text class="bonus" v-if="getBonus(amount)">送{{ getBonus(amount) }}元</text>
        </view>
      </view>

      <!-- 自定义金额 -->
      <view class="custom-amount">
        <text>其他金额</text>
        <input type="digit" v-model="customAmount" placeholder="请输入充值金额" @input="onCustomAmountInput" maxlength="11" />
      </view>
    </view>

    <!-- 支付方式选择 -->
    <view class="payment-section">
      <view class="section-title">支付方式</view>
      <view class="payment-options">
        <view v-for="method in paymentMethods" :key="method.id"
          :class="['payment-item', { active: selectedPayment === method.id }]" @click="selectPayment(method.id)">
          <u-icon :name="method.icon" size="24" :color="method.color"></u-icon>
          <text>{{ method.name }}</text>
          <u-icon name="checkmark-circle" size="20" color="#3498db" v-if="selectedPayment === method.id"></u-icon>
        </view>
      </view>
    </view>

    <!-- 底部充值按钮 -->
    <view class="bottom-bar">
      <view class="total-amount">
        <text>实付金额：</text>
        <text class="price">¥{{ getFinalAmount() }}</text>
      </view>
      <button class="recharge-btn" :disabled="!canRecharge" @click="handleRecharge">
        立即充值
      </button>
    </view>
  </view>
</template>

<script setup>
  import {
    ref,
    computed,
    onMounted
  } from 'vue';
  import {
    fetchRechargeActivityInfoAPI
  } from '@/api/api-activity'; // 添加这个导入
  import {
    fetchPersonalBalanceAPI,
    addPersonalBalanceAPI
  } from '@/api/api-user';
  const balance = ref(0);
  const chargeOptions = ref([10, 30, 50, 100, 200, 500]);
  const rechargeActivities = ref([]); // 新增活动数据的 ref
  const selectedAmount = ref(null);
  const customAmount = ref('');
  const selectedPayment = ref('wxpay');
  import {
    showLoading,
    hideLoading,
    showToast
  } from '@/api/request.js';

  // 支付方式
  const paymentMethods = [{
      id: 'wxpay',
      name: '微信支付',
      icon: 'weixin-fill',
      color: '#07c160'
    }
    //,
    // {
    //   id: 'alipay',
    //   name: '支付宝',
    //   icon: 'alipay-fill',
    //   color: '#1677ff'
    // }
  ];

  // 格式化余额
  const formatBalance = (value) => {
    return Number(value).toFixed(2);
  };

  // 获取赠送金额
  const getBonus = (amount) => {
    const activity = rechargeActivities.value.find(a => a.recharge_amount === amount);
    // 只有当活动存在且状态为"进行中"时才返回赠送金额
    return (activity && activity.status === '进行中') ? activity.bonus_amount : 0;
  };
  // 添加获取余额的函数
  const fetchBalance = async () => {
    try {
      const res = await fetchPersonalBalanceAPI();
      if (res.code === 23051) {
        balance.value = res.data.balance || 0;
      }
    } catch (error) {
      console.error('获取余额失败:', error);
    }
  };
  // 选择金额
  const selectAmount = (amount) => {
    selectedAmount.value = amount;
    customAmount.value = '';
  };

  // 添加金额输入处理函数
  const onCustomAmountInput = (e) => {
    // 取消预设金额的选中状态
    selectedAmount.value = null;
    
    let value = e.detail.value;
    
    // 1. 移除非数字和小数点
    value = value.replace(/[^\d.]/g, '');
    
    // 2. 检查小数位数并提示
    if (value.includes('.')) {
      const [intPart, decimalPart] = value.split('.');
      if (decimalPart && decimalPart.length > 2) {
        uni.showToast({
          title: '金额最多支持两位小数',
          icon: 'none'
        });
        // 截取两位小数
       // value = intPart + '.' + decimalPart.slice(0, 2);
      }
    }
    
    // 3. 限制整数部分最多8位
    const [intPart, decimalPart] = value.split('.');
    if (intPart.length > 8) {
      value = intPart.slice(0, 8) + (decimalPart ? '.' + decimalPart : '');
    }
    
    // 4. 避免以小数点开头，自动补0
    if (value.startsWith('.')) {
      value = '0' + value;
    }
    
    // 5. 更新输入框的值
    customAmount.value = value;
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

  // 简化 canRecharge 计算属性，只做基础验证
  const canRecharge = computed(() => {
    const amount = Number(customAmount.value || selectedAmount.value || 0);
    return amount > 0 && selectedPayment.value;
  });

  // 添加获取充值活动的函数
  const fetchRechargeActivities = async () => {
    try {
      const res = await fetchRechargeActivityInfoAPI();
      if (res.code === 23111 && res.data) {
        rechargeActivities.value = res.data;
        // 用 API 返回的金额更新充值选项
        chargeOptions.value = res.data.map(item => item.recharge_amount);
      }
    } catch (error) {
      console.error('获取充值活动信息失败:', error);
    }
  };
  // 修改充值处理函数
  const handleRecharge = async () => {
    const amount = Number(customAmount.value || selectedAmount.value || 0);
    
    // 验证并显示具体错误信息
    if (isNaN(amount)) {
      uni.showToast({
        title: '请输入有效金额',
        icon: 'none'
      });
      return;
    }

    // 验证小数位数
    const decimalPlaces = amount.toString().split('.')[1]?.length || 0;
    if (decimalPlaces > 2) {
      uni.showToast({
        title: '金额最多支持两位小数',
        icon: 'none'
      });
      return;
    }

    if (amount <= 0) {
      uni.showToast({
        title: '充值金额必须大于0',
        icon: 'none'
      });
      return;
    }

    if (amount > 1000) {
      uni.showToast({
        title: '单次充值不能超过1000元',
        icon: 'none'
      });
      return;
    }

    const totalAfterRecharge = balance.value + amount;
    if (totalAfterRecharge > 10000000) {
      uni.showToast({
        title: '账户总额不能超过1000万',
        icon: 'none'
      });
      return;
    }

    if (!selectedPayment.value) {
      uni.showToast({
        title: '请选择支付方式',
        icon: 'none'
      });
      return;
    }

    try {
      uni.showLoading({
        title: '充值中...'
      });

      const res = await addPersonalBalanceAPI(amount);

      if (res.code === 23061) {
        // 充值成功后重新获取余额
        await fetchBalance();

        uni.showToast({
          title: '充值成功',
          icon: 'success',
          duration: 2000
        });

        // 重置选择
        selectedAmount.value = null;
        customAmount.value = '';

      } else {
        uni.showToast({
          title: res.msg || '充值失败',
          icon: 'error'
        });
      }
    } catch (error) {
      console.error('充值失败:', error);
      uni.showToast({
        title: '充值失败，请重试',
        icon: 'error'
      });
    } finally {
      uni.hideLoading();
    }
  };
  // 跳转到交易记录
  const toTransactionRecord = () => {
    uni.navigateTo({
      url: '/pages/transaction-record/transaction-record'
    });
  };
  // 更新 onMounted 钩子
  onMounted(async () => {
    await fetchBalance();
    await fetchRechargeActivities();
  });
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

  .recharge-section,
  .payment-section {
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
      // width: 120px;
      padding: 0px 30px;
      height: 44px;
      background: #3498db;
      color: #fff;
      border-radius: 22px;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      margin-left: auto; // 添加这行，将按钮推到右边
      margin: 0 0 0 auto; // 只保留 margin-left: auto，其他方向设为 0

      &::after {
        border: none;
      }

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