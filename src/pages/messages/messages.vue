<template>
  <view class="container">
    <!-- 消息列表 -->
    <view class="messages-list">
      <view v-for="(message, index) in messages" :key="index" class="message-item">
        <view class="message-icon">
          <u-icon :name="message.icon" :color="message.color" size="40"></u-icon>
        </view>
        <view class="message-content">
          <view class="message-title">{{ message.title }}</view>
          <view class="message-time">{{ message.time }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
  import {
    ref
  } from 'vue';

  // 消息数据
  const messages = ref([{
      title: '包裹派送',
      time: '10分钟前',
      icon: 'calendar-fill',
      color: '#1E90FF'
    },
    {
      title: '活动与优惠',
      time: '10分钟前',
      icon: 'gift-fill',
      color: '#FF6347'
    }
  ]);

  // 导入uView UI的图标组件
  //  import uIcon from '@/unicomponents/u-icon/u-icon.vue';
</script>
<style>
  page {
    background-color: #ededed;
  }
</style>
<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .messages-list {
    flex: 1;
    background-color: #F5F5F5;
  }

  .message-item {
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #E5E5E5;
  }

  .message-icon {
    margin-right: 10px;
  }

  .message-content {
    flex: 1;
  }

  .message-title {
    font-size: 16px;
    font-weight: bold;
  }

  .message-time {
    font-size: 12px;
    color: #999;
  }

  .bottom-nav {
    display: flex;
    justify-content: space-around;
    background-color: #FFFFFF;
    padding: 10px 0;
    border-top: 1px solid #E5E5E5;
  }
</style>