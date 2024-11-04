<template>
  <view class="order-detail">
    <view class="order-status">
      <text class="status-text">已签收</text>
      <text>感谢您对云行者配送服务的信任，期待再次光临</text>
    </view>
    <view class="order-info">
      <text>订单编号: {{ orderInfo.orderId }}</text>
      <text>包裹编号: {{ orderInfo.trackingNumber }}</text>
      <text>包裹类型: {{ orderInfo.packageType }}</text>
      <text>取货地址: {{ orderInfo.pickupAddress }}</text>
      <text>取货联系人: {{ orderInfo.contactName }}</text>
      <text>收货电话: {{ orderInfo.contactPhone }}</text>
      <text>下单时间: {{ orderInfo.orderTime }}</text>
      <text>签收时间: {{ orderInfo.receivedTime }}</text>
      <text>支付费用: ¥{{ orderInfo.payment }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const orderInfo = ref({
  orderId: '123456789',
   trackingNumber: '987654321',
   packageType: '快递',
   pickupAddress: '天马一区一栋702',
   contactName: '张三',
   contactPhone: '13812345678',
   orderTime: '2023年10月10日 12:34:56',
   receivedTime: '2023年10月11日 14:2:33',
   payment: 2.00
});
</script>

<style scoped>
.order-detail {
  padding: 20px;
}

.order-status {
  background-color: #f8f8f8f8;
  padding: 10px;
  margin-bottom: 20px;
}

.status-text {
  font-size: 18px;
  font-weight: bold;
  color: #4caf50;
}
</style>