<template>
  <view class="mine-container">
    <!-- 用户信息卡片 -->
    <view class="user-card" @click="toUser">
      <view class="user-avatar">
        <u-avatar :src="avatarUrl || '/static/default-avatar.png'" size="80" shape="circle"></u-avatar>
      </view>
      <view class="user-info">
        <text class="username">{{ userInfo.username }}</text>
      </view>
      <u-icon name="arrow-right" color="#ffffff" size="20"></u-icon>
    </view>

    <!-- 功能网格 -->
    <view class="feature-grid">
      <view class="grid-item" v-for="(item, index) in features" :key="index" @click="handleClick(item)">
        <u-icon :name="item.icon" size="32" :color="item.color"></u-icon>
        <text class="grid-text">{{ item.text }}</text>
      </view>
    </view>

    <!-- 其他选项 -->
    <view class="other-options">
      <view class="option-item" @click="toDisclaimer">
        <u-icon name="file-text" size="24" color="#1e88e5"></u-icon>
        <text class="option-text">免责声明</text>
        <u-icon name="arrow-right" color="#969799" size="16"></u-icon>
      </view>
    </view>

    <!-- 退出按钮 -->
    <view class="logout-section">
      <u-button class="logout-button" @click="handleLogout"> <text>退出登录</text></u-button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { debounce } from 'lodash'
import { fetchAvatarAPI, fetchUserDataAPI } from '@/api/api-user'



  // 用户信息
  const userInfo = ref({
    nickname: '',
  })

// 头像URL
const avatarUrl = ref('')
// 保存上一次的URL用于比较
const lastAvatarUrl = ref('')
// 获取头像URL
const fetchAvatar = async () => {
  try {
    const res = await fetchAvatarAPI()
    if (res.code === 23101) {
      const newUrl = 'http://120.46.199.126:80' + res.data + '?t=' + new Date().getTime()
      
      // 只有当URL发生变化时才更新
      if (newUrl !== lastAvatarUrl.value) {
        avatarUrl.value = newUrl
        lastAvatarUrl.value = newUrl
        console.log('头像已更新')
      } else {
        console.log('头像未变化，无需更新')
      }
    }
  } catch (err) {
    console.error('获取头像失败:', err)
  }
}
// 获取用户信息
const fetchUserData = async () => {
  try {
    const res = await fetchUserDataAPI()
    if (res.code === 23011) {
      // 只有当用户信息发生变化时才更新
      if (JSON.stringify(userInfo.value) !== JSON.stringify(res.data)) {
        userInfo.value = res.data
        console.log('用户信息已更新')
      } else {
        console.log('用户信息未变化，无需更新')
      }
    }
  } catch (err) {
    console.error('获取用户信息失败:', err)
  }
}

// 创建防抖版本的获取函数
const debouncedFetchAvatar = debounce(fetchAvatar, 300)
const debouncedFetchUserData = debounce(fetchUserData, 300)
onMounted(() => {
  fetchAvatar()
  fetchUserData()
})


onShow(() => {
  debouncedFetchAvatar()
  debouncedFetchUserData()
})
  // 处理点击事件
  const handleClick = (item) => {
    // 使用 item.action 来调用对应的函数
    if (item.action === 'toAddress') {
      toAddress();
    } else if (item.action === 'toWallet') {
      toWallet();
    } else if (item.action === 'toDiscount') {
      toDiscount();
    } else if (item.action === 'toFeedback') {
      toFeedback();
    }
  };
  // 功能菜单配置
  const features = ref([{
      icon: 'map',
      color: '#1e88e5',
      text: '我的地址',
      action: "toAddress"
    },
    {
      icon: 'rmb-circle',
      color: '#1976d2',
      text: '我的钱包',
      action: "toWallet"
    },
    {
      icon: 'coupon',
      color: '#2196f3',
      text: '优惠券',
      action: "toDiscount"
    },
    {
      icon: 'chat',
      color: '#42a5f5',
      text: '反馈建议',
      action: "toFeedback"
    }
  ])
  // 导航函数
  const toUser = () => {
    uni.navigateTo({
      url: '/pages/user/user'
    })
  }

  const toAddress = () => {
    uni.navigateTo({
      url: '/pages/address/address?mode=manage'
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

// 跳转到反馈页面
const toFeedback = () => {
  uni.navigateTo({
    url: '/pages/feedback/feedback',
    success: (res) => {
      // 传递用户名到反馈页面
      res.eventChannel.emit('userData', {
        username: userInfo.value.username
      })
    }
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

// ... existing template code ...

<style lang="scss" scoped>
  :root {
    // 主色调：清新淡雅的天蓝色系
    --primary-color: #3B82F6; // 主要品牌色，可替换#60A5FA等
    --primary-dark: #3B82F6; // 深色调
    --primary-light: #93C5FD; // 浅色调

    // 背景色
    --bg-primary: #F0F9FF; // 主背景色
    --bg-secondary: #FFFFFF; // 次要背景

    // 文字颜色
    --text-primary: #1E40AF; // 主要文字
    --text-secondary: #60A5FA; // 次要文字
    --text-light: #FFFFFF; // 亮色文字

    // 功能色
    --success: #34D399; // 成功色
    --error: #F87171; // 错误色
  }

  .mine-container {
    min-height: 100vh;
    background-color: #f1f5f9; // 更浅的背景色
    padding-bottom: 30px;
  }

  .user-card {
    display: flex;
    align-items: center;
    padding: 25px 20px; // 增加内边距
    background: #3B82F6; // 渐变蓝色背景
    margin-bottom: 20px;
    border-radius: 0 0 25px 25px; // 底部圆角

    .user-info {
      flex: 1;

      .username {
        font-size: 20px;
        font-weight: 600;
        color: #ffffff; // 白色文字
        margin-bottom: 6px;
        display: block;
      }

      .user-id {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.8); // 半透明白色
      }
    }
  }

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
    background-color: #ffffff;
    padding: 20px 15px;
    margin: 15px;
    border-radius: 15px; // 增加圆角
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05); // 添加阴影

    .grid-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 15px 0;
      transition: all 0.3s ease; // 添加过渡效果

      &:active {
        background-color: #eff6ff; // 更浅的蓝色
        transform: scale(0.95); // 点击时缩小效果
      }

      .grid-text {
        margin-top: 10px;
        font-size: 13px;
        color: #333;
        font-weight: 500;
      }
    }
  }

  .other-options {
    background-color: #ffffff;
    margin: 15px;
    border-radius: 15px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

    .option-item {
      display: flex;
      align-items: center;
      padding: 18px 15px;
      transition: all 0.3s ease;

      &:active {
        background-color: #eff6ff;
      }

      .option-text {
        flex: 1;
        margin-left: 12px;
        font-size: 14px;
        color: #333;
        font-weight: 500;
      }
    }
  }

  // 重写退出按钮样式
  .logout-section {
    margin: 30px 15px;

    .logout-button {
      background-color: #3B82F6;

      .text {
        color: #F0F9FF;
      }
    }

    // .logout-btn {
    //   width: 100%;
    //   height: 50px;
    //   background: var(--primary-color);
    //   border-radius: 12px;
    //   display: flex;
    //   align-items: center;
    //   justify-content: center;
    //   gap: 10px;
    //   font-size: 16px;
    //   color: var(--text-light);
    //   border: none;
    //   box-shadow: 0 4px 12px rgba(96, 165, 250, 0.2);
    //   transition: all 0.2s ease;


    //   &:active {
    //     transform: translateY(1px);
    //   }

    //}
  }
</style>