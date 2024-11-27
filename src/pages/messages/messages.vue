<template>
  <view class="container">
    <!-- 顶部搜索栏 -->
    <view class="search-bar">
      <u-search v-model="searchText" placeholder="搜索消息" :show-action="false" @change="onSearch"></u-search>
    </view>

    <!-- 消息分类标签 -->
    <view class="message-tabs">
      <view v-for="tab in tabs" :key="tab.type" :class="['tab-item', { active: currentTab === tab.type }]"
        @click="currentTab = tab.type">
        {{ tab.name }}
      </view>
    </view>

    <!-- 消息列表 -->
    <scroll-view class="messages-list" scroll-y @scrolltolower="loadMore" :refresher-enabled="true"
      @refresherrefresh="onRefresh">
      <view v-if="filteredMessages.length > 0">
        <view v-for="(message, index) in filteredMessages" :key="index" class="message-item"
          :class="{ unread: !message.isRead }" @click="handleMessageClick(message)">
          <view class="message-icon">
            <u-badge :count="message.unreadCount" :offset="[-2, -2]">
              <u-icon :name="message.icon" :color="message.color" size="40"></u-icon>
            </u-badge>
          </view>
          <view class="message-content">
            <view class="message-header">
              <text class="message-title">{{ message.title }}</text>
              <text class="message-time">{{ formatTime(message.time) }}</text>
            </view>
            <view class="message-desc">{{ message.description }}</view>
          </view>
        </view>
      </view>

      <!-- 空状态展示 -->
      <view v-else class="empty-state">
        <u-icon name="info-circle" size="64" color="#999"></u-icon>
        <text>暂无消息</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
  import {
    ref,
    computed
  } from 'vue';
  import {
    formatDistanceToNow
  } from 'date-fns'
  import {
    zhCN
  } from 'date-fns/locale'

  // 搜索相关
  const searchText = ref('');
  const currentTab = ref('all');

  // 分类标签
  const tabs = [{
      name: '全部',
      type: 'all'
    },
    {
      name: '系统',
      type: 'system'
    },
    {
      name: '订单',
      type: 'order'
    },
    {
      name: '活动',
      type: 'activity'
    }
  ];

  // 模拟消息数据
  const messages = ref([{
      id: 1,
      title: '包裹已送达',
      description: '您的包裹已被放置在小区快递柜，取件码：1234',
      time: new Date(Date.now() - 1000 * 60 * 10),
      icon: 'car-fill',
      color: '#1E90FF',
      type: 'order',
      isRead: false,
      unreadCount: 1
    },
    {
      id: 2,
      title: '限时优惠活动',
      description: '618大促即将开始，提前加购商品享受优惠！',
      time: new Date(Date.now() - 1000 * 60 * 30),
      icon: 'gift-fill',
      color: '#FF6347',
      type: 'activity',
      isRead: true,
      unreadCount: 0
    },
    {
      id: 3,
      title: '系统通知',
      description: '系统将于今晚22:00进行例行维护',
      time: new Date(Date.now() - 1000 * 60 * 60 * 2),
      icon: 'notification-fill',
      color: '#FFD700',
      type: 'system',
      isRead: false,
      unreadCount: 1
    }
  ]);

  // 过滤消息列表
  const filteredMessages = computed(() => {
    return messages.value
      .filter(msg => {
        const matchSearch = msg.title.includes(searchText.value) ||
          msg.description.includes(searchText.value);
        const matchTab = currentTab.value === 'all' || msg.type === currentTab.value;
        return matchSearch && matchTab;
      })
      .sort((a, b) => b.time - a.time);
  });

  // 格式化时间
  const formatTime = (time) => {
    return formatDistanceToNow(time, {
      addSuffix: true,
      locale: zhCN
    });
  };

  // 传递信息
  const handleMessageClick = (message) => {
    uni.navigateTo({
      url: '/pages/message-detail/message-detail',
      success: function(res) {
        res.eventChannel.emit('messageData', {
          type: message.type, // 'system' | 'package' | 'activity'
          title: message.title,
          content: message.description,
          time: message.time,
          // 包裹相关信息（如果是包裹类型消息）
          packageStatus: message.packageStatus,
          trackingNumber: message.trackingNumber,
          packageType: message.packageType,
          // 活动相关信息（如果是活动类型消息）
          image: message.image,
          // 操作按钮配置
          actions: [{
              type: 'view',
              text: '查看详情',
              url: `/pages/package/packageDetail?id=${message.packageId}`
            },
            {
              type: 'call',
              text: '联系客服',
              phoneNumber: '400-123-4567'
            },
            {
              type: 'share',
              text: '分享'
            }
          ]
        });
      }
    });
  };

  // 下拉刷新
  const onRefresh = async () => {
    // TODO: 调用后端API刷新消息列表
    await new Promise(resolve => setTimeout(resolve, 1000));
    uni.stopPullDownRefresh();
  };

  // 加载更多
  const loadMore = () => {
    // TODO: 调用后端API加载更多消息
  };

  // 搜索处理
  const onSearch = () => {
    // 可以在这里处理实时搜索逻辑
  };
</script>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f5f5f5;
  }

  .search-bar {
    padding: 10px 15px;
    background-color: #fff;
  }

  .message-tabs {
    display: flex;
    padding: 10px 15px;
    background-color: #fff;
    border-bottom: 1px solid #eee;
  }

  .tab-item {
    padding: 6px 12px;
    margin-right: 15px;
    border-radius: 15px;
    font-size: 14px;
    color: #666;
  }

  .tab-item.active {
    background-color: #e6f7ff;
    color: #1890ff;
  }

  .messages-list {
    flex: 1;
  }

  .message-item {
    display: flex;
    padding: 15px;
    background-color: #fff;
    margin-bottom: 1px;
  }

  .message-item.unread {
    background-color: #f0f9ff;
  }

  .message-icon {
    margin-right: 12px;
  }

  .message-content {
    flex: 1;
  }

  .message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }

  .message-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }

  .message-time {
    font-size: 12px;
    color: #999;
  }

  .message-desc {
    font-size: 14px;
    color: #666;
    line-height: 1.4;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    color: #999;
  }

  .empty-state text {
    margin-top: 10px;
    font-size: 14px;
  }
</style>