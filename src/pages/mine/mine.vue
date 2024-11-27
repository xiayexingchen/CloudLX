<template>
  <view class="mine-container">
    <!-- 用户信息卡片 -->
    <view class="user-card" @click="toUserInfo">
      <view class="user-avatar">
        <u-avatar :src="userInfo.avatar" size="80"></u-avatar>
      </view>
      <view class="user-info">
        <text class="username">{{ userInfo.nickname }}</text>
        <text class="user-id">ID: {{ userInfo.userId }}</text>
      </view>
      <u-icon name="arrow-right" color="#969799" size="20"></u-icon>
    </view>

    <!-- 功能网格 -->
    <view class="feature-grid">
      <view class="grid-item" @click="toAddress">
        <u-icon name="map" size="32" color="#3498db"></u-icon>
        <text class="grid-text">我的地址</text>
      </view>
      <view class="grid-item" @click="toWallet">
        <u-icon name="wallet" size="32" color="#e74c3c"></u-icon>
        <text class="grid-text">我的钱包</text>
      </view>
      <view class="grid-item" @click="toDiscount">
        <u-icon name="coupon" size="32" color="#f1c40f"></u-icon>
        <text class="grid-text">优惠券</text>
      </view>
      <view class="grid-item" @click="toFeedback">
        <u-icon name="chat" size="32" color="#2ecc71"></u-icon>
        <text class="grid-text">反馈建议</text>
      </view>
    </view>

    <!-- 其他选项 -->
    <view class="other-options">
      <view class="option-item" @click="toDisclaimer">
        <u-icon name="file-text" size="24" color="#666"></u-icon>
        <text class="option-text">免责声明</text>
        <u-icon name="arrow-right" color="#969799" size="16"></u-icon>
      </view>
    </view>

    <!-- 退出按钮 -->
    <view class="logout-section">
      <u-button class="logout-button" @click="handleLogout">退出登录</u-button>
    </view>
  </view>
</template>

<script setup>
  import {
    ref
  } from 'vue'

  // 用户信息
  const userInfo = ref({
    avatar: '/static/logo.png',
    nickname: '大幕孤烟直',
    userId: '888888'
  })

  // 导航函数
  const toUserInfo = () => {
    uni.navigateTo({
      url: '/pages/user-info/user-info'
    })
  }

  const toAddress = () => {
    uni.navigateTo({
      url: '/pages/address/address'
    })
  }

  const toWallet = () => {
    uni.navigateTo({
      url: '/pages/wallet/wallet'
    })
  }

  const toDiscount = () => {
    uni.navigateTo({
      url: '/pages/discount/discount'
    })
  }

  const toFeedback = () => {
    uni.navigateTo({
      url: '/pages/feedback/feedback'
    })
  }

  const toDisclaimer = () => {
    uni.navigateTo({
      url: '/pages/disclaimer/disclaimer'
    })
  }

  const handleLogout = () => {
    uni.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // TODO: 执行退出登录逻辑
          uni.clearStorageSync()
          uni.reLaunch({
            url: '/pages/login/login'
          })
        }
      }
    })
  }
</script>

<style lang="scss" scoped>
  .mine-container {
    min-height: 100vh;
    background-color: #f5f5f5;
    padding-bottom: 30px;
  }

  .user-card {
    display: flex;
    align-items: center;
    padding: 20px;
    background-color: #ffffff;
    margin-bottom: 15px;

    .user-avatar {
      margin-right: 15px;
    }

    .user-info {
      flex: 1;

      .username {
        font-size: 18px;
        font-weight: 500;
        color: #333;
        margin-bottom: 4px;
        display: block;
      }

      .user-id {
        font-size: 12px;
        color: #999;
      }
    }
  }

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background-color: #ffffff;
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 8px;
    margin: 15px;

    .grid-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 15px 0;

      &:active {
        background-color: #f5f5f5;
      }

      .grid-text {
        margin-top: 8px;
        font-size: 12px;
        color: #666;
      }
    }
  }

  .other-options {
    background-color: #ffffff;
    margin: 15px;
    border-radius: 8px;

    .option-item {
      display: flex;
      align-items: center;
      padding: 15px;

      &:active {
        background-color: #f5f5f5;
      }

      .option-text {
        flex: 1;
        margin-left: 10px;
        font-size: 14px;
        color: #333;
      }
    }
  }

  .logout-section {
    margin: 30px 15px;
  }

  // 凭什么不行？!
  .logout-button {
    background: #0069FF;
    color: #ffffff;
  }
</style>