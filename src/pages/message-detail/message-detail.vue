<template>
  <view class="message-detail">
    <!-- 消息头部 -->
    <view class="header">
      <view class="header-top">
        <text class="message-type">{{ messageData.messageType }}</text>
        <text class="time">{{ formatTime(messageData.createdAt) }}</text>
      </view>
      <text class="title">{{ messageData.title }}</text>
    </view>

    <!-- 消息内容 -->
    <view class="content">
      {{ messageData.content }}
    </view>

    <!-- 底部操作区 -->
    <view class="footer">
      <button class="back-btn" @click="handleBack">
        返回
      </button>
    </view>
  </view>
</template>

<script setup>
  import {
    ref,
    onMounted,
    getCurrentInstance
  } from 'vue'
  import {
    formatDistanceToNow
  } from 'date-fns'
  import {
    zhCN
  } from 'date-fns/locale'
  import {
    readMessagesAPI
  } from '../../api/api-user';

  const messageData = ref({})

  // 获取页面传递的数据
  onMounted(() => {
    const instance = getCurrentInstance().proxy
    const eventChannel = instance.getOpenerEventChannel();
    eventChannel.on('messageData', (data) => {
      messageData.value = data
      // 如果消息未读，可以在这里调用标记已读的 API
      if (!data.isRead) {
        markAsRead(data.messageId)
      }
    })
  })

  // 获取标签颜色
  const getTagColor = (type) => {
    const colors = {
      '活动提醒': '#722ed1',
      '系统通知': '#1890ff',
      '订单提醒': '#52c41a'
    }
    return colors[type] || '#666'
  }

  // 格式化时间
  const formatTime = (time) => {
    if (!time) return ''
    try {
      const date = new Date(time.replace(' ', 'T'))
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (err) {
      return time
    }
  }

  // 标记消息已读
  const markAsRead = async (messageId) => {
    try {
      const result = await readMessagesAPI(messageId)
      if (result.code === 25011) {
        console.log('消息已标记为已读')
      }
    } catch (err) {
      console.error('标记已读失败:', err)
    }
  }


  // 返回列表
  const handleBack = () => {
    uni.navigateBack()
  }

  // 删除消息
  const handleDelete = () => {
    uni.showModal({
      title: '删除消息',
      content: '确定要删除这条消息吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            // TODO: 调用删除消息 API
            uni.showToast({
              title: '删除成功',
              icon: 'success'
            })
            setTimeout(() => {
              uni.navigateBack()
            }, 1500)
          } catch (err) {
            uni.showToast({
              title: '删除失败',
              icon: 'error'
            })
          }
        }
      }
    })
  }
</script>

<style lang="scss" scoped>
  .message-detail {
    min-height: 100vh;
    background: #fff;
    display: flex;
    flex-direction: column;
  }

  .header {
    padding: 20px 16px;
    border-bottom: 1px solid #eee;
    background: #fff;

    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .message-type {
      font-size: 14px;
      color: #3B82F6;
    }

    .time {
      font-size: 14px;
      color: #999;
    }

    .title {
      font-size: 18px;
      font-weight: 500;
      color: #333;
      line-height: 1.4;
    }
  }

  .content {
    flex: 1;
    padding: 20px 16px;
    font-size: 16px;
    color: #333;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .footer {
    padding: 16px;
    border-top: 1px solid #eee;
    background: #fff;
  }

  .back-btn {
    width: 100%;
    height: 44px;
    background: #3B82F6;
    color: #fff;
    font-size: 16px;
    border-radius: 22px;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;

    &:active {
      opacity: 0.9;
    }
  }

  // 添加进入动画
  .message-detail {
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>