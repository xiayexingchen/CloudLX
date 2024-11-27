<script setup>
  import {
    ref,
    computed
  } from 'vue';
  import dayjs from 'dayjs';

  // 状态变量
  const search = ref('');
  const showDatePicker = ref(false);
  const startDate = ref(dayjs().subtract(7, 'day').format('YYYY-MM-DD'));
  const endDate = ref(dayjs().format('YYYY-MM-DD'));

  // 模拟订单数据
  const orders = ref([{
      id: 'ORDER2024031501',
      status: '已送达',
      location: '菜鸟驿站-幸福小区店',
      time: '2024-11-19 14:30:00',
      image: '/static/package1.png',
      trackingNumber: 'YT5647891234',
      price: '99.00',
      items: [{
        name: '休闲运动鞋',
        quantity: 1,
        spec: '黑色 42码'
      }],
      canEvaluate: true
    },
    {
      id: 'ORDER2024031502',
      status: '运输中',
      location: '【广州转运中心】已发出，下一站【深圳转运中心】',
      time: '2024-11-23 10:20:00',
      image: '/static/package2.png',
      trackingNumber: 'SF7891234560',
      price: '199.00',
      items: [{
        name: '商务双肩包',
        quantity: 1,
        spec: '深灰色'
      }],
      canEvaluate: false
    },
    {
      id: 'ORDER2024031401',
      status: '待取件',
      location: '快递柜-幸福小区A区1号柜',
      time: '2024-11-24 18:45:00',
      image: '/static/package3.png',
      trackingNumber: 'JD4567891230',
      price: '299.00',
      items: [{
        name: '智能手表',
        quantity: 1,
        spec: '星空黑'
      }],
      canEvaluate: false,
      pickupCode: '8888'
    }
  ]);

  // 按日期分组的订单
  const groupedOrders = computed(() => {
    const groups = {};
    const filteredOrders = orders.value.filter(order => {
      const orderDate = dayjs(order.time);
      const start = dayjs(startDate.value);
      const end = dayjs(endDate.value);
      const matchSearch = search.value ?
        (order.trackingNumber.includes(search.value) ||
          order.items.some(item => item.name.includes(search.value))) :
        true;
      return orderDate.isAfter(start) && orderDate.isBefore(end) && matchSearch;
    }).sort((a, b) => dayjs(b.time).valueOf() - dayjs(a.time).valueOf()); // 按时间降序;

    filteredOrders.forEach(order => {
      const date = dayjs(order.time).format('YYYY-MM-DD');
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

  const onHide = (order) => {
    uni.showModal({
      title: '确认隐藏',
      content: '确定要隐藏该订单吗？',
      success: (res) => {
        if (res.confirm) {
          orders.value = orders.value.filter(item => item.id !== order.id);
          uni.showToast({
            title: '已隐藏订单',
            icon: 'success'
          });
        }
      }
    });
  };

  const onSearch = () => {
    // 实际项目中这里会调用后端API
    console.log('搜索关键词:', search.value);
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
</script>

<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="search-section">
      <u-search v-model="search" placeholder="输入运单号或商品名称搜索" :show-action="false" @search="onSearch"></u-search>
    </view>

    <!-- 日期选择器 -->
    <view class="date-picker-trigger" @click="showDatePicker = true">
      <view class="date-text">
        <u-icon name="calendar" size="20" color="#666"></u-icon>
        <text>{{ getDateRangeText() }}</text>
      </view>
      <u-icon name="arrow-right" size="20" color="#666"></u-icon>
    </view>

    <!-- 订单列表 -->
    <scroll-view scroll-y class="orders-list" @refresherrefresh="onRefresh" refresher-enabled
      :refresher-triggered="false">
      <block v-for="(group, date) in groupedOrders" :key="date">
        <view class="date-divider">{{ date }}</view>

        <view class="order-card" v-for="order in group" :key="order.id">
          <!-- 订单头部 -->
          <view class="order-header">
            <view class="order-status">{{ order.status }}</view>
            <view class="tracking-number" @click="copyTrackingNumber(order.trackingNumber)">
              运单号：{{ order.trackingNumber }}
              <u-icon name="copy" size="14" color="#666"></u-icon>
            </view>
          </view>

          <!-- 订单内容 -->
          <view class="order-content">
            <image :src="order.image" mode="aspectFill" class="order-image"></image>
            <view class="order-details">
              <view class="order-items">
                <text v-for="(item, index) in order.items" :key="index">
                  {{ item.name }} x{{ item.quantity }}
                </text>
              </view>
              <view class="order-location">
                <u-icon name="map" size="14" color="#666"></u-icon>
                <text>{{ order.location }}</text>
              </view>
              <view class="order-time">
                <u-icon name="clock" size="14" color="#666"></u-icon>
                <text>{{ order.time }}</text>
              </view>
            </view>
          </view>

          <!-- 订单底部 -->
          <view class="order-footer">
            <view class="price">¥{{ order.price }}</view>
            <view class="buttons">
              <u-button v-if="order.canEvaluate" type="primary" size="mini" @click="onEvaluate(order)">评价</u-button>
              <u-button size="mini" @click="onHide(order)">隐藏</u-button>
            </view>
          </view>
        </view>
      </block>

      <!-- 空状态 -->
      <view v-if="Object.keys(groupedOrders).length === 0" class="empty-state">
        <u-icon name="order" size="64" color="#999"></u-icon>
        <text>暂无相关订单</text>
      </view>
    </scroll-view>

    <!-- 日期选择弹窗 -->
    <u-popup v-model="showDatePicker" mode="center">
      <!-- ... 原有的日期选择器内容 ... -->
    </u-popup>
  </view>
</template>

<style lang="scss" scoped>
  .container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f5f5f5;
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
      gap: 5px;
      color: #333;
    }
  }

  .orders-list {
    flex: 1;
    padding: 0 15px;
  }

  .date-divider {
    padding: 10px 0;
    color: #666;
    font-size: 14px;
  }

  .order-card {
    background-color: #fff;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 10px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .order-status {
        font-weight: 500;
        color: #333;
      }

      .tracking-number {
        font-size: 12px;
        color: #666;
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }

    .order-content {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;

      .order-image {
        width: 80px;
        height: 80px;
        border-radius: 4px;
      }

      .order-details {
        flex: 1;

        .order-items {
          margin-bottom: 8px;
          font-size: 14px;
          color: #333;
        }

        .order-location,
        .order-time {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #666;
          margin-top: 4px;
        }
      }
    }

    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 12px;
      border-top: 1px solid #eee;

      .price {
        font-size: 16px;
        font-weight: 500;
        color: #ff4d4f;
      }

      .buttons {
        display: flex;
        gap: 8px;
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
      font-size: 14px;
    }
  }
</style>