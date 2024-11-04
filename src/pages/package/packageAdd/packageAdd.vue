<template>
  <view class="add-package-container">
    <view class="input-group">
      <input type="text" placeholder="输入包裹编号" v-model="packageId" />
      <input type="text" placeholder="输入主人手机号" v-model="ownerPhone" />
    </view>
    <button @click="sharePackage">共享包裹</button>
  </view>
</template>

<script setup>
  import {
    ref
  } from 'vue';

  const packageId = ref('');
  const ownerPhone = ref('');

  function sharePackage() {
    // 共享包裹的逻辑
    console.log('共享包裹:', packageId.value, ownerPhone.value);
  }
</script>

<style scoped>
  .add-package-container {
    padding: 20px;
  }

  .input-group {
    margin-bottom: 20px;
  }

  input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  button {
    width: 100%;
    padding: 10px;
    background-color: #007aff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
</style>