<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="fixed-header">
      <view class="search-section">
        <u-search v-model="searchText" placeholder="输入订单号或站点名搜索" :show-action="false" @change="onSearch"></u-search>
      </view>

      <!-- 日期选择器 -->
      <view class="date-picker-trigger" @click="showCalendar = true">
        <view class="date-text">
          <u-icon name="calendar" size="20" color="#666"></u-icon>
          <text>{{ getDateRangeText() }}</text>
        </view>
        <u-icon name="arrow-right" size="20" color="#666"></u-icon>
      </view>
    </view>

    <!-- 订单列表 -->
    <view class="orders-list">
      <block v-for="(group, date) in groupedOrders" :key="date">
        <view class="date-divider">{{ date }}</view>
        <view class="order-card" v-for="order in group" :key="order.order_id" @click="handleOrderClick(order)">
          <!-- 订单头部 -->
          <view class="order-header">
            <view class="left">
              <text class="order-id">订单号：{{ order.order_id }}</text>
              <!-- 使用 text-overflow 处理站点名过长 -->
              <!-- <text class="site-name text-ellipsis">{{ order.site_name }}</text> -->
              <text class="status" :class="getStatusClass(order.status)">
                {{ order.status }}
              </text>
            </view>
            <!-- <text class="order-id">订单号：{{ order.order_id }}</text> -->
          </view>

          <!-- 订单内容 -->
          <view class="order-content">
            <view class="info-row">
              <u-icon name="map" size="20" color="#666"></u-icon>
              <text class="address">送至：{{order.delivery_address }}</text>
            </view>

            <!--            <view class="info-row">
              <u-icon name="account" size="16" color="#666"></u-icon>
              <text>{{ order.username }}</text>
              <text class="phone">{{order.phone_number }}</text>
            </view> -->
            <template v-if="order.status==='已完成'">
              <view class="info-row">
                <u-icon name="clock" size="20" color="#666"></u-icon>
                <text>签收时间：{{ order.completed_at }}</text>
              </view>
            </template>
            <template v-else>
              <view class="info-row">
                <u-icon name="clock" size="20" color="#666"></u-icon>
                <text>预计完成时间：{{ order.estimated_completion_time }}</text>
              </view>
            </template>
          </view>

          <!-- 订单底部 -->
          <!-- 在订单卡片的底部操作区域 -->
          <view class="order-footer">
            <view class="left">
              <text class="type">{{ order.type }}</text>
              <text class="amount">¥{{ (order.total_amount).toFixed(2) }}</text>
            </view>
            <view class="actions">
              <!-- 只在订单状态为"已完成"时显示删除按钮 -->
              <template v-if="order.status === '已完成'">
                <u-button size="mini" type="error" plain @click.stop="handleDeleteOrder(order)">删除订单</u-button>
              </template>
              <!-- 其他状态的订单按钮 -->
              <!-- <template v-else>
        <u-button v-if="order.status === '待发货'" type="primary" size="mini">退单</u-button>
      </template> -->
            </view>
          </view>
        </view>
      </block>
    </view>

    <!-- 空状态 -->
    <view v-if="Object.keys(groupedOrders).length === 0" class="empty-state">
      <u-icon name="order" size="64" color="#999"></u-icon>
      <text>暂无相关订单</text>
    </view>

    <!-- 日期选择弹窗
    <u-popup v-model="showDatePicker" mode="bottom">
      <view class="calendar-popup">
        <view class="calendar-header">
          <text>选择日期范围</text>
          <u-icon name="close" @click="showDatePicker = false"></u-icon>
        </view>
        <u-calendar :show="showDatePicker" mode="range" :defaultDate="[startDate, endDate]" @change="handleDateChange"
          color="#3498db"></u-calendar>
      </view>
    </u-popup> -->
    <!-- 日历选择器 -->
    <u-calendar v-model="showCalendar" mode="range" @change="handleDateChange"></u-calendar>
    <!-- @close="showCalendar = false"
  :insert="false"
  :clearDate="false"
  :startDate="startDate"
  :endDate="endDate" -->
  </view>
</template>
<script setup>
  import {
    ref,
    computed,
    onMounted
  } from 'vue';
  import dayjs from 'dayjs';
  import {
    onLoad,
    onShow,
  } from '@dcloudio/uni-app';
  import {
    fetchOrderDataAPI,
    deleteOrderAPI
  } from '@/api/api-order';
  // 状态变量
  const searchText = ref('');
  const showCalendar = ref(false);
  const startDate = ref(dayjs().subtract(60, 'day').format('YYYY-MM-DD'));
  const endDate = ref(dayjs().format('YYYY-MM-DD'));
  const orders = ref([]);
  const loading = ref(false);
  const dateInfo = ref({
    startTime: '',
    endTime: ''
  })
  // 搜索功能
  const search = ref('');
  const onSearch = () => {
    // 这里可以选择是否重新请求数据
    // 如果数据量不大，可以直接用本地筛选（已在 groupedOrders 中实现）
    // 如果数据量大，建议发起新的请求
    if (search.value.length >= 10) {
      fetchOrderData();
    }
  };
  // 获取订单数据
  const fetchOrderData = async () => {
    try {
      loading.value = true;

      const dateInfo = {
        startTime: dayjs(startDate.value).startOf('day').format('YYYY-MM-DD'),
        endTime: dayjs(endDate.value).endOf('day').format('YYYY-MM-DD')
      };
      console.log(dateInfo);
      const res = await fetchOrderDataAPI(dateInfo);

      if (res.code === 24011) { // 假设24011是成功状态码
        console.log(res.data);
        orders.value = res.data;

      } else {
        uni.showToast({
          title: '获取订单失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('获取订单列表失败:', error);
      uni.showToast({
        title: '系统错误',
        icon: 'none'
      });
    } finally {
      loading.value = false;
      // 如果是下拉刷新，需要结束刷新状态
      //uni.stopPullDownRefresh();
    }
  };


  // 日期选择处理TODO
  // const handleDateChange = (e) => {
  //   startDate.value = e[0];
  //   endDate.value = e[1];
  //   fetchOrderData();
  // };
  const handleDateChange = (e) => {
    console.log('日期选择:', e);
    startDate.value = e.startDate;
    endDate.value = e.endDate;
    showCalendar.value = false;
    fetchOrderData(); // 选择日期后重新获取数据
  };
  // 状态样式映射
  const getStatusClass = (status) => {
    const map = {
      '待发货': 'status-pending',
      '正在运输': 'status-shipping',
      '已完成': 'status-completed'
    };
    return map[status] || '';
  };

  // 格式化手机号
  // const formatPhone = (phone) => {
  //   return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  // };

  //格式化日期
  const formatDate = (date) => {
    return dayjs(date).format('YYYY-MM-DD');
  };

  //   const groupedOrders = computed(() => {
  //   const groups = {};
  //   const filteredOrders = orders.value.filter(order => {
  //     const orderDate = dayjs(order.created_at);
  //     const start = dayjs(startDate.value).startOf('day');
  //     const end = dayjs(endDate.value).endOf('day');

  //     console.log("订单日期:", orderDate.format('YYYY-MM-DD HH:mm:ss'));
  //     console.log("开始日期:", start.format('YYYY-MM-DD HH:mm:ss'));
  //     console.log("结束日期:", end.format('YYYY-MM-DD HH:mm:ss'));

  //     const matchSearch = search.value ?
  //       (order.order_id.includes(search.value) ||
  //         order.username.includes(search.value)) :
  //       true;

  //     // 使用 unix 时间戳进行比较
  //     const orderTime = orderDate.unix();
  //     const startTime = start.unix();
  //     const endTime = end.unix();

  //     return orderTime >= startTime && orderTime <= endTime && matchSearch;
  //   }).sort((a, b) => dayjs(b.created_at).valueOf() - dayjs(a.created_at).valueOf());

  //   filteredOrders.forEach(order => {
  //     const date = dayjs(order.created_at).format('YYYY-MM-DD');
  //     if (!groups[date]) groups[date] = [];
  //     groups[date].push(order);
  //   });

  //   console.log("分组结果:", groups);
  //   return groups;
  // });
  const groupedOrders = computed(() => {
    const groups = {};
    const filteredOrders = orders.value.filter(order => {
      // 1. 时间过滤
      const orderDate = dayjs(order.created_at);
      const start = dayjs(startDate.value).startOf('day');
      const end = dayjs(endDate.value).endOf('day');
      const orderTime = orderDate.unix();
      const startTime = start.unix();
      const endTime = end.unix();
      const isInTimeRange = orderTime >= startTime && orderTime <= endTime;

      // 2. 搜索过滤
      const searchValue = searchText.value.toLowerCase();
      const matchSearch = !searchValue ? true : (
        order.order_id.toLowerCase().includes(searchValue) ||
        order.site_name.toLowerCase().includes(searchValue)
      );

      // 返回同时满足时间和搜索条件的订单
      return isInTimeRange && matchSearch;
    }).sort((a, b) => dayjs(b.created_at).valueOf() - dayjs(a.created_at).valueOf());

    // 分组逻辑保持不变
    filteredOrders.forEach(order => {
      const date = dayjs(order.created_at).format('YYYY-MM-DD');
      if (!groups[date]) groups[date] = [];
      groups[date].push(order);
    });

    return groups;
  });
  // 日期范围文本显示
  const getDateRangeText = () => {
    return `${startDate.value} 至 ${endDate.value}`;
  };

  // 订单操作
  const onEvaluate = (order) => {
    uni.navigateTo({
      url: `/pages/evaluate/evaluate?id=${order.id}`
    });
  };
  // 日期选择处理

  // const onHide = (order) => {
  //   uni.showModal({
  //     title: '确认隐藏',
  //     content: '确定要隐藏该订单吗？',
  //     success: (res) => {
  //       if (res.confirm) {
  //         orders.value = orders.value.filter(item => item.id !== order.id);
  //         uni.showToast({
  //           title: '已隐藏订单',
  //           icon: 'success'
  //         });
  //       }
  //     }
  //   });
  // };

  // 处理订单点击
  const handleOrderClick = (order) => {
    uni.navigateTo({
      url: '/pages/order-detail/order-detail',
      success: (res) => {
        // 传递订单数据到详情页
        res.eventChannel.emit('orderData', {
          site_name: order.site_name,
          completed_at: order.completed_at,
          delivery_address: order.delivery_address,
          estimated_completion_time: order.estimated_completion_time,
          total_amount: order.total_amount,
          created_at: order.created_at,
          phone_number: order.phone_number,
          package_id: order.package_id,
          type: order.type,
          order_id: order.order_id,
          username: order.username,
          status: order.status
        });
      },
      fail: (err) => {
        console.error('页面跳转失败:', err);
        uni.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  };

  // 复制单号
  const copyTrackingNumber = (number) => {
    uni.setClipboardData({
      data: number,
      success: () => {
        uni.showToast({
          title: '已复制单号',
          icon: 'success'
        });
      }
    });
  };
  // // 页面加载时获取数据
  // onMounted(() => {
  //   fetchOrderData();
  // });
  // 刷新数据
  const onRefresh = () => {
    // 实际项目中这里会调用后端API
    uni.showLoading({
      title: '刷新中...'
    });
    setTimeout(() => {
      uni.hideLoading();
      uni.showToast({
        title: '刷新成功',
        icon: 'success'
      });
    }, 1000);
  };
  // 页面加载时获取数据
  onMounted(() => {
    fetchOrderData();
  });
  onShow(() => {
    fetchOrderData();
  });
  // 删除订单处理函数
  const handleDeleteOrder = async (order) => {
    // 阻止事件冒泡，避免触发订单详情
    //stopPropagation();

    // 再次确认订单状态
    if (order.status !== '已完成') {
      uni.showToast({
        title: '只能删除已完成的订单',
        icon: 'none'
      });
      return;
    }

    // 显示确认弹窗
    uni.showModal({
      title: '删除订单',
      content: '确定要删除这条订单记录吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            uni.showLoading({
              title: '删除中...'
            });

            const result = await deleteOrderAPI(order.order_id);

            if (result.code === 24061) {
              uni.showToast({
                title: '删除成功',
                icon: 'success'
              });

              // 从列表中移除该订单
              orders.value = orders.value.filter(item => item.order_id !== order.order_id);
            } else {
              uni.showToast({
                title: result.msg || '删除失败',
                icon: 'none'
              });
            }
          } catch (error) {
            console.error('删除订单失败:', error);
            uni.showToast({
              title: '删除失败，请稍后重试',
              icon: 'none'
            });
          } finally {
            uni.hideLoading();
          }
        }
      }
    });
  };
</script>


<style lang="scss" scoped>
  .container {
    min-height: 100vh;
    background-color: #f5f5f5;
    padding-top: 110px; // 固定头部的高度
  }

  .fixed-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background-color: #fff;
  }

  .search-section {
    padding: 10px 15px;
    background-color: #fff;
  }

  .date-picker-trigger {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px;
    background-color: #fff;
    margin-bottom: 10px;

    .date-text {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #333;

      text {
        font-size: 16px;
      }
    }
  }

  .orders-list {
    padding: 15px;
  }

  .date-divider {
    padding: 10px 0;
    color: #666;
    font-size: 16px;
  }

  .order-card {
    background: #fff;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12rpx;

      .left {
        display: flex;
        align-items: center;
        gap: 8rpx;
        flex: 1; // 让左侧占据剩余空间
        min-width: 0; // 关键：允许子元素收缩
      }

      .site-name {
        font-size: 32rpx;
        font-weight: 500;
        color: #333;
        max-width: 300rpx; // 限制最大宽度
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .status {
        flex-shrink: 0; // 状态标签不缩小
        padding: 4rpx 16rpx;
        border-radius: 4rpx;
        font-size: 24rpx;

        &.status-pending {
          background: #fff7e6;
          color: #fa8c16;
        }

        &.status-shipping {
          background: #e6f7ff;
          color: #1890ff;
        }

        &.status-completed {
          flex-shrink: 0; // 订单号不缩小
          background: #f6ffed;
          color: #52c41a;
        }
      }

      .order-id {
        font-size: 15px;
        color: #333;
      }
    }

    .order-content {
      padding: 12px 0;
      border-top: 1px solid #f5f5f5;
      border-bottom: 1px solid #f5f5f5;

      .info-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        color: #666;
        font-size: 16px;

        &:last-child {
          margin-bottom: 0;
        }

        .address {
          flex: 1;
        }

        .phone {
          color: #999;
          margin-left: 12px;
        }
      }
    }

    // 通用文本省略样式
    .text-ellipsis {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12px;

      .left {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .type {
        padding: 2px 8px;
        background: #f5f5f5;
        border-radius: 4px;
        font-size: 14px;
        color: #666;
      }

      .amount {
        font-size: 18px;
        font-weight: 500;
        color: #ff4d4f;
      }

      // .actions {
      //   display: flex;
      //   gap: 8px;
      // }
    }
  }

  .actions {
    display: flex;
    gap: 12rpx;

    // 修改深度选择器的写法
    :deep() {
      .u-button--mini {
        padding: 0 24rpx;
        height: 56rpx;
      }

      .u-button--plain {
        border-color: #ff4d4f;
        color: #ff4d4f;

        &:active {
          opacity: 0.7;
        }
      }

      // 删除按钮样式
      .u-button--error.u-button--plain {
        border-color: #ff4d4f;
        color: #ff4d4f;
        background-color: rgba(255, 77, 79, 0.05);

        &:active {
          background-color: rgba(255, 77, 79, 0.1);
        }
      }
    }
  }

  .calendar-popup {
    background-color: #fff;
    border-radius: 16px 16px 0 0;

    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #eee;

      text {
        font-size: 18px;
        font-weight: 500;
        color: #333;
      }
    }
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    color: #999;

    text {
      margin-top: 10px;
      font-size: 16px;
    }
  }
</style>