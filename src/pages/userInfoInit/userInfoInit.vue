<template>
  <view class="form-container">
    <view class="header">
      <h1 class="form-title">个人信息</h1>
      <text class="form-subtitle">请完善您的个人信息</text>
    </view>

    <!-- 用户名 -->
    <view class="form-item">
      <text class="form-label">用户名 <text class="required">*</text></text>
      <u-input v-model="formData.username" placeholder="请输入用户名" :clearable="true" class="form-input" :border="true" />
    </view>

    <!-- 手机号 -->
    <view class="form-item">
      <text class="form-label">手机号 <text class="required">*</text></text>
      <view class="phone-input">
        <u-input v-model="formData.phoneNumber" placeholder="请输入手机号" type="number" :clearable="true" class="form-input"
          :border="true" maxlength="11" />
        <u-button @click="getVerificationCode" class="verification-btn"
          :disabled="isGettingCode || !/^1[3-9]\d{9}$/.test(formData.phoneNumber)" type="primary"
          size="mini">{{ codeButtonText }}</u-button>
      </view>
    </view>

    <!-- 验证码 -->
    <view class="form-item">
      <text class="form-label">验证码 <text class="required">*</text></text>
      <u-input v-model="formData.code" placeholder="请输入验证码" type="number" :clearable="true" class="form-input"
        :border="true" maxlength="6" />
    </view>
    <!-- 性别 -->
    <view class="form-item">
      <text class="form-label">性别</text>
      <view class="gender-group">
        <u-radio-group v-model="formData.gender" @change="genderChange">
          <u-radio v-for="item in genderList" :key="item.name" :name="item.name">
            {{item.name}}
          </u-radio>
        </u-radio-group>
      </view>
    </view>
    <!-- 生日 -->
    <view class="form-item">
      <text class="form-label">生日</text>
      <view class="calendar-box" @click="openCalendar">
        <text v-if="showDate" class="date-text">{{ showDate.result }}</text>
        <text v-else class="placeholder-text">点击选择日期</text>
        <u-icon name="calendar" size="20" color="#666"></u-icon>
        <u-calendar v-model="show" :mode="mode" @change="change"></u-calendar>
      </view>
    </view>

    <!-- 提交按钮 -->
    <u-button @click="submitForm" type="primary" class="submit-btn">确认提交</u-button>
  </view>
</template>

<script setup>
  import {
    ref,
    computed,
    nextTick
  } from 'vue';
  import {
    sendMessageAPI,
    submitUserInfoAfterFirstLoginAPI
  } from '@/api/api-user.js';

  // 表单数据
  const formData = ref({
    username: '',
    phoneNumber: '',
    code: '',
    gender: '',
    birthday: ''
  });

  // 表单校验规则
  const rules = {
    username: [{
      required: true,
      message: '请输入用户名',
      trigger: ['blur', 'change']
    }],
    phoneNumber: [{
      required: true,
      message: '请输入手机号',
      trigger: ['blur', 'change']
    }, {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号',
      trigger: ['blur', 'change']
    }],
    code: [{
      required: true,
      message: '请输入验证码',
      trigger: ['blur', 'change']
    }]
  };

  // 性别选项
  const genderList = [{
    name: '男',
    icon: 'man'
  }, {
    name: '女',
    icon: 'woman'
  }];

  // 验证码按钮相关
  const isGettingCode = ref(false);
  const countdown = ref(60);
  const codeButtonText = computed(() =>
    isGettingCode.value ? `${countdown.value}s后重试` : '获取验证码'
  );

  const show = ref(false);
  const mode = ref('date');
  const showDate = ref('');
  const openCalendar = () => {
    show.value = true;
  }
  const change = (e) => {
    showDate.value = e;
    show.value = false;
    formData.value.birthday = e.result;
  }

  // 性别改变事件
  const genderChange = (e) => {
    console.log('选择的性别：', e);
  };
  // 获取验证码
  const getVerificationCode = async () => {
    if (isGettingCode.value) return;

    if (!formData.value.phoneNumber || !/^1[3-9]\d{9}$/.test(formData.value.phoneNumber)) {
      uni.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }

    try {
      isGettingCode.value = true;
      const response = await sendMessageAPI(formData.value.phoneNumber);

      if (response.code === 21031) {
        isGettingCode.value = true; // 设置为true后开始倒计时
        startCountdown();
        uni.showToast({
          title: '验证码已发送',
          icon: 'success'
        });
      } else {
        uni.showToast({
          title: '验证码发送失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('发送验证码失败', error);
      uni.showToast({
        title: '发送失败，请重试',
        icon: 'none'
      });
    }
  };

  // 倒计时
  const startCountdown = () => {
    countdown.value = 60; // 重置倒计时
    const timer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(timer);
        isGettingCode.value = false;
      }
    }, 1000);
  };

  // 提交表单
  const submitForm = async () => {
    if (!formData.value.username || !formData.value.phoneNumber || !formData.value.code) {
      uni.showToast({
        title: '请完整填写必填项',
        icon: 'none'
      });
      return;
    }

    try {
      console.log(formData.value);
      const res = await submitUserInfoAfterFirstLoginAPI(formData.value);
      console.log(res);
      // 修改这里：检查 21041 状态码
      if (res.code === 21041) { // 之前可能是其他状态码
        uni.showToast({
          title: '提交成功',
          icon: 'success'
        });

        // 重置表单
        formData.value = {
          username: '',
          phoneNumber: '',
          code: '',
          gender: '',
          birthday: ''
        };
        showDate.value = '';

        // 跳转
        uni.switchTab({
          url: '/pages/home/home'
        });
      } else {
        uni.showToast({
          title: res.msg || '提交失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('提交信息失败', error);
      uni.showToast({
        title: '提交失败，请重试',
        icon: 'none'
      });
    }
  };
</script>
<style scoped>
  .form-container {
    padding: 30px 20px;
    background-color: #ffffff;
    min-height: 100vh;
  }

  .header {
    margin-bottom: 40px;
    text-align: center;
  }

  .form-title {
    font-size: 24px;
    color: #333;
    margin-bottom: 8px;
  }

  .form-subtitle {
    font-size: 14px;
    color: #666;
  }

  .form-item {
    margin-bottom: 25px;
  }

  .form-label {
    display: block;
    margin-bottom: 8px;
    font-size: 15px;
    color: #333;
  }

  .required {
    color: #ff4d4f;
    margin-left: 4px;
  }

  .form-input {
    background-color: #f8f8f8;
    border-radius: 8px;
  }

  .phone-input {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .verification-btn {
    white-space: nowrap;
    min-width: 100px;
  }

  .calendar-box {
    width: 100%;
    height: 45px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    background-color: #f8f8f8;
    border-radius: 8px;
    border: 1px solid #eee;
  }

  .gender-group {
    display: flex;
    gap: 30px;
    padding: 10px 15px;
    background-color: #f8f8f8;
    border-radius: 8px;
    border: 1px solid #eee;
  }

  .gender-item {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .date-text {
    color: #333;
  }

  .placeholder-text {
    color: #999;
  }

  .submit-btn {
    width: 100%;
    height: 45px;
    margin-top: 40px;
    border-radius: 8px;
  }
</style>