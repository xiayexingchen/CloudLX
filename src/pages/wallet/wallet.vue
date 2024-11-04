<template>
  <view class="wallet">
    <view class="balance">
      <text>当前余额</text>
      <text class="balance-amount">¥ {{ balance }}</text>
    </view>
    <view class="recharge-options">
      <u-button v-for="chargeOption in chargeOptions" :key="chargeOption" @click="charge(chargeOption)">
        ¥{{ chargeOption }}
      </u-button>
    </view>
    <u-button type="primary" @click="confirmCharge">确认充值</u-button>
  </view>
</template>

<script setup>
  import {
    ref,
    onMounted
  } from 'vue';
  import {
    getPersonalBalanceAPI
  } from '../../api/api.js'
  const balance = ref(0); // 初始余额

  const chargeOptions = ref([10, 50, 100, 200, 500, 1000]); // 充值选项


  const charge = (amount) => {
    // 调用充值接口的逻辑
    console.log('充值金额:', amount);
  };

  const confirmCharge = () => {
    // 确认充值的逻辑
    console.log('确认充值');
  };

  onMounted(() => {
    getPersonalBalanceAPI().then((result) => {
      console.log(result);
      console.log("result.data.balance");
      // 处理获取余额成功
      balance.value = result.data.balance;
    }).catch((error) => {
      // 处理错误
      console.error('获取余额失败:', error);
    });
  })
</script>

<style scoped>
  .wallet {
    padding: 20px;
  }

  .balance {
    font-size: 24px;
    font-weight: bold;
    color: #007aff;
  }

  .recharge-options {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 20px;
  }

  .recharge-options u-button {
    margin-right: 10px;
  }

  .balance-amount {
    color: #007aff;
  }
</style>