<template>
  <view class="container">
    <map class="map" :latitude="latitude" :longitude="longitude" markers="markers"></map>
    <view class="info">
      <view class="info-item">包裹配送中，请稍后</view>
      <view class="info-item">ROB-1</view>
      <view class="info-item">预计送达时间：{{ deliveryTime }}</view>
      <view class="info-item">包裹类型：{{ packageType }}</view>
      <button class="robot-button" @click="navigateToRobotPage">点击查看实时机器人视角</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const latitude = ref(30.5937); // 示例纬度
const longitude = ref(114.3055); // 示例经度
const deliveryTime = ref('12:15-12:30'); // 示例预计送达时间
const packageType = ref('外卖'); // 示例包裹类型
const markers = ref([
  {
    id: 1,
    latitude: latitude.value,
    longitude: longitude.value,
    title: '收货地',
    iconPath: '/static/robot.png', // 机器人图标路径
    width: 50,
    height: 50
  }
]);

const navigateToRobotPage = () => {
  // 跳转到机器人视角页面的逻辑
  uni.navigateTo({
    url: '/pages/robotView/robotView' // 机器人视角页面的路径
  });
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
  padding: 20px;
  background-color: #fff;
}

.info-item {
  margin-bottom: 10px;
}

.robot-button {
  background-color: #007aff;
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}
</style>