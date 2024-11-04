<template>
  <view class="user-info">
    <u-form @submit="submitForm">
      <u-form-item label="用户名" required>
        <u-input placeholder="请输入姓名" v-model="userInfo.name" />
      </u-form-item>
      <u-form-item label="手机号" required>
        <u-input type="number" placeholder="请输入手机号" v-model="userInfo.phone" />
        <u-button type="info" @click="getCode">获取验证码</u-button>
      </u-form-item>
      <u-form-item label="验证码" required>
        <u-input type="number" placeholder="请输入验证码" v-model="userInfo.code" />
      </u-form-item>
      <u-form-item label="性别" required>
        <view class="radio-group">
          <radio value="male" :checked="selectedGender === 'male'" @change="onChange" />男
          <radio value="female" :checked="selectedGender === 'female'" @change="onChange" />女
        </view>
      </u-form-item>
      <u-form-item label="生日" required>
        <u-datetime-picker v-model="userInfo.birthday" type="date" />
      </u-form-item>
      <u-button type="primary" form-type="submit" @click="submitForm">确认</u-button>
    </u-form>
  </view>
</template>

<script>
  import {
    sendMessageAPI,
    submitUserInfoAfterFirstLogin
  } from '../../api/api';

  export default {
    data() {
      return {
        userInfo: {
          name: '',
          phone: '',
          code: '',
          gender: '男',
          birthday: '2003-11-06',
          selectedGender: 'male'
        }
      }
    },
    methods: {
      getCode() {
        // 调用发送验证码接口
        sendMessageAPI(this.userInfo.phone).then(response => {
          console.log(response);
          if (response.code === 21031) {
            // this.toHome();
          } else {
            uni.showToast({
              title: '验证码发送失败',
              icon: 'none'
            });
          }
        }).catch(error => {
          console.error('发送验证码失败', error);
        });
      },
      submitForm() {
        console.log(this.userInfo);
        // 提交用户信息
        submitUserInfoAfterFirstLogin(this.userInfo).then(response => {
          if (response.code === 21041) {
            this.toHome();
          } else {
            uni.showToast({
              title: '验证码已过期或不存在',
              icon: 'none'
            });
          }
        }).catch(error => {
          console.error('提交信息失败', error);
        });
      },
      toHome() {
        uni.switchTab({
          url: "/pages/home/home"
        });
      }
    }
  }
</script>

<style scoped>
  .user-info {
    padding: 20px;
  }

  .radio-group {
    display: flex;
    align-items: center;
  }

  .radio-label {
    margin-right: 20px;
  }

  /* 可以自定义radio的样式，这里只是一个基础示例 */
  radio {
    display: inline-block;
    vertical-align: middle;
  }
</style>