<template>
  <view class="container">
    <!-- 头像区域 -->
    <view class="avatar-section">
    <view class="avatar-wrapper" @click="chooseImage">
      <image class="avatar" :src="avatarUrl || '/static/default-avatar.png'" mode="aspectFill"></image>
    </view>
  </view>

    <!-- 信息列表 -->
    <view class="info-list">
      <!-- 用户名 -->
      <view class="info-item" @click="showUsernamePopup">
        <text class="label">用户名</text>
        <view class="value-wrapper">
          <text class="value">{{userInfo.username}}</text>
          <u-icon name="arrow-right" color="#999" size="16"></u-icon>
        </view>
      </view>

      <!-- 生日 -->
      <view class="info-item" @click="openCalendar">
        <text class="label">生日</text>
        <view class="value-wrapper">
          <text class="value">{{userInfo.birthday || '请选择日期'}}</text>
          <u-icon name="arrow-right" color="#999" size="16"></u-icon>
        </view>
      </view>

      <!-- 修改性别选择部分 -->
      <view class="info-item" @click="showGenderPopup">
        <text class="label">性别</text>
        <view class="value-wrapper">
          <text class="value">{{userInfo.gender}}</text>
          <u-icon name="arrow-right" color="#999" size="16"></u-icon>
        </view>
      </view>

      <!-- 用户名编辑弹窗 -->
      <u-popup v-model="showUsername" mode="bottom" :safe-area-inset-bottom="true">
        <view class="popup-container">
          <view class="popup-header">
            <text @click="cancelEdit">取消</text>
            <text>修改用户名</text>
            <text class="confirm-btn" @click="confirmUsername">确定</text>
          </view>
          <view class="popup-content">
            <input class="username-input" v-model="tempUsername" placeholder="请输入用户名" maxlength="20" />
          </view>
        </view>
      </u-popup>

      <!-- 生日选择器 -->
      <u-calendar v-model="showDate" :mode="date" @change="change"></u-calendar>

      <!-- 性别选择器 -->
      <u-popup v-model="showGender" mode="bottom" :safe-area-inset-bottom="true">
        <view class="popup-container">
          <view class="popup-header">
            <text @click="showGender = false">取消</text>
            <text>选择性别</text>
            <text class="confirm-btn" @click="showGender = false">确定</text>
          </view>
          <view class="popup-content">
            <view class="gender-options">
              <view class="gender-item" :class="{ active: userInfo.gender === '男' }" @click="selectGender('男')">
                <text>男</text>
                <u-icon v-if="userInfo.gender === '男'" name="checkmark" color="#3B82F6" size="16"></u-icon>
              </view>
              <view class="gender-item" :class="{ active: userInfo.gender === '女' }" @click="selectGender('女')">
                <text>女</text>
                <u-icon v-if="userInfo.gender === '女'" name="checkmark" color="#3B82F6" size="16"></u-icon>
              </view>
            </view>
          </view>
        </view>
      </u-popup>
    </view>
  </view>
</template>

<script setup>
  import {
    ref,
    reactive,
    onMounted
  } from 'vue'
  import dayjs from 'dayjs'
import { updateAvatarAPI, fetchAvatarAPI } from '@/api/api-user'
  // 用户信息
  const userInfo = reactive({
    username: 'Zhangsan',
    birthday: '2003-12-25',
    gender: '男'
  })

  // 弹窗控制
  const showUsername = ref(false)
  const showDate = ref(false)
  const showGender = ref(false)
// 头像URL
const avatarUrl = ref('')
  // 临时存储编辑值
  const tempUsername = ref('')

  // 性别选项
  const genderOptions = ['男', '女']


// 选择图片
const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async (res) => {
      try {
        // 显示加载中
        uni.showLoading({
          title: '上传中...',
          mask: true
        })

        // 读取图片为base64
        const base64 = await getImageBase64(res.tempFilePaths[0])
        
        // 上传头像
        const updateResult = await updateAvatarAPI(base64)
        console.log("base64"+base64);
        if (updateResult.code === 23091) {
          // 获取新的头像URL
          await fetchAvatar()
          
          uni.showToast({
            title: '更新成功',
            icon: 'success'
          })
        }
      } catch (err) {
        console.error('更新头像失败:', err)
        uni.showToast({
          title: '更新失败',
          icon: 'none'
        })
      } finally {
        uni.hideLoading()
      }
    }
  })
}
// 获取图片base64
const getImageBase64 = (tempFilePath) => {
  return new Promise((resolve, reject) => {
    uni.getFileSystemManager().readFile({
      filePath: tempFilePath,
      encoding: 'base64',
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 获取头像URL
const fetchAvatar = async () => {
  try {
    const res = await fetchAvatarAPI()
    if (res.code === 23101) {
      avatarUrl.value = 'http://120.46.199.126:80'+res.data
    }
  } catch (err) {
    console.error('获取头像失败:', err)
  }
}
// 页面加载时获取头像
onMounted(() => {
  fetchAvatar()
})
  // 显示用户名编辑弹窗
  const showUsernamePopup = () => {
    tempUsername.value = userInfo.username
    showUsername.value = true
  }

  // 取消编辑
  const cancelEdit = () => {
    showUsername.value = false
  }

  // 确认用户名修改
  const confirmUsername = () => {
    if (tempUsername.value.trim()) {
      userInfo.username = tempUsername.value
      showUsername.value = false
      uni.showToast({
        title: '修改成功',
        icon: 'success'
      })
    } else {
      uni.showToast({
        title: '用户名不能为空',
        icon: 'none'
      })
    }
  }


  // 打开日历
  const openCalendar = () => {
    showDate.value = true
  }

  // 日期变更处理
  const change = (e) => {
    userInfo.birthday = e.result
    showDate.value = false
    uni.showToast({
      title: '修改成功',
      icon: 'success'
    })
  }
  // 显示性别选择器
  const showGenderPopup = () => {
    showGender.value = true
  }


  // 确认性别选择
  const selectGender = (gender) => {
    userInfo.gender = gender
    showGender.value = false
    uni.showToast({
      title: '修改成功',
      icon: 'success'
    })
  }
  // 修改日期相关的变量和方法
  const minDate = dayjs().subtract(100, 'year').valueOf() // 转换为时间戳
  const maxDate = dayjs().valueOf() // 转换为时间戳

  const confirmDate = (e) => {
    userInfo.birthday = dayjs(e.value).format('YYYY-MM-DD')
    uni.showToast({
      title: '修改成功',
      icon: 'success'
    })
  }
</script>

<style lang="scss">
  .container {
    min-height: 100vh;
    background-color: #f8f8f8;
  }

  .avatar-section {
    background-color: #ffffff;
    padding: 40rpx 0;
    display: flex;
    justify-content: center;
    align-items: center;

    .avatar-wrapper {
      width: 160rpx;
      height: 160rpx;
      border-radius: 80rpx;
      cursor: pointer;
      border: 4rpx solid #fff;
      overflow: hidden;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);

      &:hover {
      opacity: 0.8; // 添加悬停效果
    }
    }

    .avatar {
      width: 100%;
      height: 100%;
    }
  }

  .info-list {
    margin-top: 20rpx;
    background-color: #fff;
    padding: 0 30rpx;

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx 0;
      border-bottom: 1rpx solid #eee;

      &:last-child {
        border-bottom: none;
      }

      .label {
        font-size: 28rpx;
        color: #333;
      }

      .value-wrapper {
        display: flex;
        align-items: center;

        .value {
          font-size: 28rpx;
          color: #666;
          margin-right: 10rpx;
        }
      }
    }
  }

  .popup-container {
    background-color: #fff;
    border-radius: 24rpx 24rpx 0 0;

    .popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx;
      border-bottom: 1rpx solid #eee;
      font-size: 28rpx;

      .confirm-btn {
        color: #3B82F6;
      }
    }

    .popup-content {
      padding: 30rpx;

      .username-input {
        width: 100%;
        height: 80rpx;
        background-color: #f8f8f8;
        border-radius: 8rpx;
        padding: 0 20rpx;
        font-size: 28rpx;
      }
    }
  }

  // 添加性别选择的样式
  .gender-options {
    padding: 20rpx 0;

    .gender-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx;
      font-size: 28rpx;
      color: #333;
      border-bottom: 1rpx solid #eee;

      &:last-child {
        border-bottom: none;
      }

      &.active {
        color: #3B82F6;
      }
    }
  }
</style>