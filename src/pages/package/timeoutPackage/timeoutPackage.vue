<template>
  <view class="package-detail">
    <view class="package-status">
      <text class="status-text">包裹存放已超时</text>
      <text>你的报告已暂时移到他处，请及时联系管理员</text>
      <text>联系电话: 156****4571</text>
      <button class="action-button">一键拨号</button>
    </view>
    <view class="package-info">
      <text>包裹编号: {{ packageInfo.trackingNumber }}</text>
      <text>物品类型: {{ packageInfo.itemType }}</text>
      <text>入柜时间: {{ packageInfo.entryTime }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const packageInfo = ref({
  trackingNumber: '123456789',
   itemType: '快递',
   entryTime: '2023年10月10日 12:34:56'
});
</script>

<style scoped>
.package-detail {
  padding: 20px;
}

.package-status {
  background-color: #f8f8f8f8;
  padding: 10px;
  margin-bottom: 20px;
}

.status-text {
  font-size: 18px;
  font-weight: bold;
  color: #ff4d4f;
}

.action-button {
  background-color: #ff4d4f;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
}
</style>