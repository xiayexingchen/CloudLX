<template>
  <view class="feedback-page">
    <view class="header">
      <text class="title">意见反馈</text>
    </view>
    <view class="feedback-form">
      <u-form-item label="问题类型">
        <u-select v-model="feedbackType" placeholder="请选择问题类型">
          <u-option value="建议">建议</u-option>
          <u-option value="问题">问题</u-option>
        </u-select>
      </u-form-item>
      <u-form-item label="问题描述">
        <u-input type="textarea" v-model="feedbackMessage" placeholder="请描述您遇到的问题..."></u-input>
      </u-form-item>
      <u-form-item>
        <u-button type="primary" @click="submitFeedback">提交</u-button>
      </u-form-item>
    </view>
    <view class="contact-info">
      <text>联系方式</text>
      <text>请填写您的手机号，以便我们联系您</text>
      <u-input type="number" v-model="contactNumber" placeholder="请输入手机号"></u-input>
      <view class="links">
        <u-link href="javascript:void(0);">检查网络</u-link>
        <u-link href="javascript:void(0);">联系我们</u-link>
      </view>
    </view>
  </view>
</template>

<script setup>
  import {
    ref
  } from 'vue';

  const feedbackType = ref('建议');
  const feedbackMessage = ref('');
  const contactNumber = ref('');

  const submitFeedback = () => {
    // 提交反馈的逻辑
    console.log('提交反馈:', feedbackMessage.value);
    // 这里可以添加提交反馈的API调用
  };
</script>

<style scoped>
  .feedback-page {
    padding: 20px;
  }

  .header {
    background-color: #007aff;
    color: #fff;
    padding: 15px;
    text-align: center;
  }

  .title {
    font-size: 20px;
    font-weight: bold;
  }

  .feedback-form {
    margin-top: 20px;
  }

  .contact-info {
    margin-top: 20px;
  }

  .links {
    margin-top: 10px;
    text-align: center;
  }

  .u-link {
    color: #007aff;
  }
</style>