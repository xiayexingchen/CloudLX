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
        <u-swipe-action v-for="(message, index) in filteredMessages" :key="message.messageId" :show="message.show"
          :index="index" :options="options" @click="handleSwipeClick" @open="handleSwipeOpen">
    
            <view class="message-item" :class="{ unread: !message.isRead }" @click="handleMessageClick(message)">
              <view class="message-content">
              <view class="message-header">
                <text class="message-type">{{ message.messageType }}</text>
                <text class="message-time">{{ formatTime(message.createdAt) }}</text>
              </view>
              <text class="message-title text-ellipsis">{{ message.title }}</text>
              <text class="message-desc text-ellipsis">{{ formatContent(message.content) }}</text>
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
    background: #fff;
    padding: 16px;
    border-bottom: 1px solid #eee;
    width: 100%;
    overflow: hidden;

    &.unread {
      position: relative;

      &::before {
        content: '●';
        position: absolute;
        left: 6px;
        top: 50%;
        transform: translateY(-50%);
        color: #3B82F6;
        font-size: 12px;
      }

      .message-content {
        margin-left: 16px;
      }
    }
  }

  // 滑动按钮样式
  :deep(.u-swipe-action) {
    width: 100% !important;
    
    .u-swipe-action-item {
      width: 100% !important;
      
      &__content {
        width: 100% !important;
        box-sizing: border-box;
      }
      
      &__right {
        height: 100%;
        display: flex;
        align-items: stretch;
      }
    }
  }

  // 消息内容样式
  .message-content {
    width: 100%;
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
  }

  .message-time {
    font-size: 14px;
    color: #999;
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
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-bottom: 6px;
    display: block;
  }

  .message-desc {
    font-size: 14px;
    color: #666;
    line-height: 1.5;
    display: block;
  }

  // 空状态样式
  .empty-state {
    padding: 40px 0;
    text-align: center;
  }
</style>