<template>
  <view class="container">
    <!-- Tab栏 - 三个均匀分布 -->
    <view class="tabs">
      <view v-for="tab in tabs" :key="tab.type" class="tab-item" :class="{ active: currentTab === tab.type }"
        @click="handleTabChange(tab.type)">
        {{ tab.name }}
        <view v-if="getUnreadCount(tab.type)" class="tab-badge">
          {{ getUnreadCount(tab.type) }}
        </view>
      </view>
    </view>

    <!-- 消息列表 -->
    <scroll-view class="messages-list" scroll-y @scrolltolower="loadMore" refresher-enabled
      @refresherrefresh="onRefresh">
      <view v-if="filteredMessages.length > 0">
        <u-swipe-action 
      v-for="(message, index) in filteredMessages" 
      :key="message.messageId"
      :show="message.show"
      :index="index"
      :options="options"
      @click="handleSwipeClick"
      @open="handleSwipeOpen"
    >

          <view class="message-item" :class="{ unread: !message.isRead }" @click="handleMessageClick(message)">
            <view class="message-content">
      <!-- 消息头部 -->
      <view class="message-header">
        <text class="message-type">{{ message.messageType }}</text>
        <text class="message-time">{{ formatTime(message.createdAt) }}</text>
      </view>
      
      <!-- 消息主体 -->
      <view class="message-body">
        <text class="message-title single-line">{{ message.title }}</text>
        <text class="message-desc single-line">{{ formatContent(message.content) }}</text>
      </view>
    </view>
          </view>
        </u-swipe-action>
      </view>

      <!-- 空状态 -->
      <view v-else class="empty-state">
        <u-empty mode="message" text="暂无消息"></u-empty>
      </view>
    </scroll-view>
  </view>
</template>


<script setup>
  import {
    ref,
    computed,
    onMounted
  } from 'vue'
  import {
    formatDistanceToNow
  } from 'date-fns'
  import {
    zhCN
  } from 'date-fns/locale'
  import {
    fetchMessagesAPI,
    deleteMessagesAPI
  } from '@/api/api-user'
  import {
    onShow
  } from '@dcloudio/uni-app';
  const messages = ref([])
  const currentTab = ref('包裹提醒')
  // 滑动按钮配置
  const options = [{
    text: '删除',
    style: {
      backgroundColor: '#dd524d'
    }
  }]
  const handleSwipeClick = async (index) => {
    try {
      const message = filteredMessages.value[index]
      uni.showModal({
        title: '提示',
        content: '确定要删除这条消息吗？',
        success: async (res) => {
          if (res.confirm) {
            const result = await deleteMessagesAPI(message.messageId)
            if (result.code === 25011) {
              uni.showToast({
                title: '删除成功',
                icon: 'success'
              })
              // 重新获取消息列表
              fetchMessages()
            }
          }
        }
      })
    } catch (err) {
      console.error('删除消息失败:', err)
      uni.showToast({
        title: '删除失败',
        icon: 'none'
      })
    }
  }

  // 处理滑动打开
  const handleSwipeOpen = (index) => {
    // 为当前操作的项添加 show 属性
    filteredMessages.value = filteredMessages.value.map((item, idx) => ({
      ...item,
      show: idx === index
    }))
  }
  // 简化的Tab配置
  const tabs = [{
      type: '活动提醒',
      name: '活动'
    },
    {
      type: '包裹提醒',
      name: '包裹'
    },
    {
      type: '订单提醒',
      name: '订单'
    }
  ]

  // 未读消息数量
  const unreadCount = computed(() => {
    return messages.value.filter(msg => !msg.isRead).length
  })

  // 过滤消息
  const filteredMessages = computed(() => {
    // if (currentTab.value === 'all') {
    //   return messages.value
    // }
    return messages.value.filter(msg => msg.messageType === currentTab.value)
  })

  // 处理Tab切换
  const handleTabChange = (type) => {
    currentTab.value = type
  }
  // 获取每个分类的未读数量
  const getUnreadCount = (type) => {
    return messages.value.filter(msg =>
      !msg.isRead && (type === 'all' || msg.messageType === type)
    ).length
  }
  // 格式化时间
  const formatTime = (time) => {
    try {
      if (!time) return ''
      const date = new Date(time.replace(' ', 'T'))
      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: zhCN
      })
    } catch (err) {
      return time
    }
  }

  // 格式化内容
  const formatContent = (content) => {
    return content.length > 50 ? content.slice(0, 50) + '...' : content
  }

  // 获取消息列表
  const fetchMessages = async () => {
    try {
      const res = await fetchMessagesAPI()
      if (res.code === 25011) {
        messages.value = res.data
      }
    } catch (err) {
      console.error('获取消息失败:', err)
      uni.showToast({
        title: '获取消息失败',
        icon: 'none'
      })
    }
  }
  // 处理删除消息
  const handleDelete = async (messageId) => {
    try {
      uni.showModal({
        title: '提示',
        content: '确定要删除这条消息吗？',
        success: async (res) => {
          if (res.confirm) {
            const result = await deleteMessagesAPI(messageId)
            if (result.code === 25031) {
              uni.showToast({
                title: '删除成功',
                icon: 'success'
              })
              // 重新获取消息列表
              fetchMessages()
            }
          }
        }
      })
    } catch (err) {
      console.error('删除消息失败:', err)
      uni.showToast({
        title: '删除失败',
        icon: 'none'
      })
    }
  }
  // 处理消息点击
  const handleMessageClick = (message) => {
    uni.navigateTo({
      url: '/pages/message-detail/message-detail',
      success: (res) => {
        res.eventChannel.emit('messageData', message)
      }
    })
  }

  // 下拉刷新
  const onRefresh = async () => {
    await fetchMessages()
    uni.stopPullDownRefresh()
  }

  // 加载更多
  const loadMore = () => {
    // TODO: 实现加载更多逻辑
  }
  // 在页面显示时刷新数据
  onShow(() => {
    fetchMessages();
  });
  onMounted(() => {
    fetchMessages()
  })
</script>

<style lang="scss" scoped>
  // 基础容器样式
  .container {
    min-height: 100vh;
    background: #f5f7fa;
  }
  .messages-list {
  width: 100%;
  height: 100%;
}
  // 头部样式
  .header {
    background: #fff;
    padding: 20px 16px;
    border-bottom: 1px solid #eee;

    .title {
      font-size: 20px;
      font-weight: 500;
      color: #333;
    }
  }

  // 列表容器样式
  .list-container {
    width: 100%;
    box-sizing: border-box;
  }

  // 滑动项样式
  .swipe-item {
    width: 100%;
    box-sizing: border-box;
    background: #fff;
  }

  // 标签栏样式
  .tabs {
    display: flex;
    background: #fff;
    padding: 0;
    border-bottom: 1px solid #eee;
  }

  .tab-item {
    flex: 1;
    padding: 14px 0;
    font-size: 16px;
    color: #666;
    position: relative;
    text-align: center;

    &.active {
      color: #3B82F6;
      font-weight: 500;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 20px;
        height: 2px;
        background: #3B82F6;
        border-radius: 1px;
      }
    }

    .tab-badge {
      position: absolute;
      top: 6px;
      right: 20%;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      background: #3B82F6;
      color: #fff;
      font-size: 12px;
      line-height: 16px;
      text-align: center;
      border-radius: 8px;
    }
  }

  // 消息项样式
  .message-item {
  width: 100vw;
  box-sizing: border-box;
  background: #fff;
  padding: 24rpx;
  border-bottom: 1px solid #eee;
 // overflow: hidden; // 添加这行确保内容不会溢出

  &.unread {
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      left: 8rpx;
      top: 50%;
      transform: translateY(-50%);
      width: 12rpx;
      height: 12rpx;
      background: #564dff;
      border-radius: 50%;
      box-shadow: 0 0 4rpx rgba(255, 77, 79, 0.5); // 添加阴影效果
    }

    .message-content {
  width: 100%;
  box-sizing: border-box;
  //padding-right: 120rpx;
    }
  }
}
// 文本单行省略
.single-line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%; // 限制最大宽度
  display: block;
}

  // 滑动按钮样式
:deep(.u-swipe-action) {
  width: 100vw !important; // 使用视口宽度
  background: #fff;
  overflow: hidden;

  .u-swipe-action-item {
    width: 100vw !important;
    background: #fff;
    position: relative;

    &__content {
      width: 100vw !important;
      background: #fff;
      position: relative;
      z-index: 1;
    }

    &__right {
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      z-index: 2;
    }
  }
}
// 删除按钮样式
.u-swipe-action-item__right {
  .u-swipe-action__button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 30rpx;
    flex-shrink: 0; // 防止按钮被压缩
    background-color: #dd524d;
    color: #fff;
  }
}

  .message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .message-type {
    font-size: 14px;
    color: #3B82F6;
    font-weight: 500;
  }

  .message-time {
    font-size: 14px;
    color: #999;
  }
  .message-body {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  width: 100%; // 确保宽度100%
}
  // 文本样式
  .text-ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    display: block;
  }
  .message-title {
    
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
}

.message-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.4;
}
// 标题和描述文本的省略处理
.message-title,
.message-desc {
  display: block; // 确保是块级元素
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

  // 空状态样式
  .empty-state {
    padding: 40px 0;
    text-align: center;
  }
</style>