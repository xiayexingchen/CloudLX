<template>
  <view class="disclaimer">
    <!-- 状态栏 -->
    <view class="status-bar">
      <view class="status-left">
        <text>{{ currentTime }}</text>
      </view>
      <view class="status-center">
        <text>免责声明</text>
      </view>
      <view class="status-right"></view>
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <view 
        v-for="(section, index) in disclaimerSections" 
        :key="index" 
        class="section"
      >
        <view class="section-header">
          <text class="section-number">{{ section.number }}</text>
          <text class="section-title">{{ section.title }}</text>
        </view>
        <view class="section-content">
          <view 
            v-for="(item, idx) in section.content" 
            :key="idx" 
            class="content-item"
          >
            <text class="item-number">{{ item.number }}</text>
            <text class="item-text">{{ item.text }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 当前时间
const currentTime = ref('12:00')

// 更新时间函数
const updateTime = () => {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  currentTime.value = `${hours}:${minutes}`
}

// 免责声明内容
const disclaimerSections = ref([
  {
    number: '一',
    title: '协议的范围',
    content: [
      {
        number: '1.1',
        text: '本条款是你与腾讯之间关于你使用小程序服务所订立的协议。"用户"是指注册、登录、使用微信小程序的个人或组织。'
      },
      {
        number: '1.2',
        text: '微信用户使用小程序即成为该小程序的服务用户，微信小程序可以通过小程序平台为相关用户提供应用服务。'
      },
      {
        number: '1.3',
        text: '小程序属于微信公众账号，在不与本条款冲突的情况下，你应遵守《微信公众平台服务协议》等协议规则关于微信公众帐号的其他相关规定。'
      }
    ]
  },
  {
    number: '二',
    title: '小程序注册',
    content: [
      {
        number: '2.1',
        text: '你在使用本服务前需要绑定个人信息。微信小程序通过手机号进行绑定注册。'
      },
      {
        number: '2.2',
        text: '用户在绑定完成后，方可使用相关功能。'
      }
    ]
  }
])

// 生命周期钩子
onMounted(() => {
  updateTime()
  // 每分钟更新一次时间
  setInterval(updateTime, 60000)
})
</script>

<style lang="scss" scoped>
.disclaimer {
  min-height: 100vh;
  background-color: #f8f9fa;
  
  .status-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    height: 88rpx;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    padding: 0 32rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

    .status-left {
      flex: 1;
      text-align: left;
      font-size: 28rpx;
      color: #666;
    }

    .status-center {
      flex: 2;
      text-align: center;
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }

    .status-right {
      flex: 1;
    }
  }

  .content {
    padding: 108rpx 32rpx 32rpx;

    .section {
      background-color: #ffffff;
      border-radius: 16rpx;
      padding: 24rpx;
      margin-bottom: 24rpx;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);

      .section-header {
        display: flex;
        align-items: center;
        margin-bottom: 20rpx;

        .section-number {
          font-size: 32rpx;
          font-weight: 600;
          color: #333;
          margin-right: 16rpx;
        }

        .section-title {
          font-size: 32rpx;
          font-weight: 600;
          color: #333;
        }
      }

      .section-content {
        .content-item {
          display: flex;
          margin-bottom: 16rpx;
          
          &:last-child {
            margin-bottom: 0;
          }

          .item-number {
            font-size: 28rpx;
            color: #666;
            margin-right: 16rpx;
            flex-shrink: 0;
          }

          .item-text {
            font-size: 28rpx;
            color: #666;
            line-height: 1.6;
          }
        }
      }
    }
  }
}
</style>