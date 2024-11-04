<template>
  <view class="container">
    <map class="map" :latitude="latitude" :longitude="longitude" @regionchange="onRegionChange">
      <!-- 货柜位置标记 -->
      <cover-view class="marker" :style="{ top: markerTop, left: markerLeft }"></cover-view>
    </map>
    <view class="info">
      <scroll-view class="info-scroll" scroll-y="true">
        <view class="info-item">包裹编号: {{ packageInfo.trackingNumber }}</view>
        <view class="info-item">取货地址: {{ packageInfo.address }}</view>
        <view class="info-item">取货柜子: {{ packageInfo.locker }}</view>
        <view class="info-item">物品类型: {{ packageInfo.itemType }}</view>
        <view class="info-item">入柜时间: {{ packageInfo.entryTime }}</view>
      </scroll-view>
    </view>
    <button class="toggle-button" @click="toggleMapType">切换到货柜位置</button>
  </view>
</template>

<script setup>
  import {
    ref,
    onMounted
  } from 'vue';

  const latitude = ref(30.5937); // 示例纬度
  const longitude = ref(114.3055); // 示例经度
  const markerTop = ref('30%'); // 示例标记位置
  const markerLeft = ref('40%'); // 示例标记位置
  const packageInfo = ref({
    trackingNumber: '123456789',
    address: '天马三区十栋快递驿站',
    locker: '柜子A5',
    itemType: '快递',
    entryTime: '2023年10月10日 12:34:56'
  });

  const onRegionChange = (e) => {
    // 地图区域改变时的处理逻辑
    console.log('地图区域改变:', e);
  };

  const toggleMapType = () => {
    // 切换地图类型的逻辑
    // 这里可以用图片或文字替代实现不了的功能
    console.log('切换到货柜位置');
  };
</script>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .map {
    flex: 1;
  }

  .info {
    flex: 0 0 200px;
    background-color: #fff;
    padding: 10px;
  }

  .info-scroll {
    height: 100%;
  }

  .info-item {
    margin-bottom: 10px;
  }

  .toggle-button {
    position: absolute;
    bottom: 20px;
    right: 20px;
    background-color: #007aff;
    color: #fff;
    padding: 10px;
    border-radius: 5px;
  }
</style>