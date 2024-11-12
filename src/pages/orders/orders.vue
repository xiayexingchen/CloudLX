<template>
  <view class="container">
    <!-- 搜索栏 -->
    <u-search placeholder="包裹编号搜索" v-model="search" @search="onSearch"></u-search>

    <!-- 时间选择器触发按钮 -->
    <view class="date-picker-trigger" @click="showDatePicker = true">
      <text>{{ getDateRangeText() }}</text>
      <u-icon name="calendar"></u-icon>
    </view>

    <!-- 时间选择弹窗 -->
    <u-popup v-model="showDatePicker" mode="center">
      <view class="date-picker-popup">
        <!-- 快捷按钮 -->
        <view class="quick-buttons">
          <u-button size="mini" @click="selectDateRange('week')">近7天</u-button>
          <u-button size="mini" @click="selectDateRange('month')">近一个月</u-button>
          <u-button size="mini" @click="selectDateRange('thisYear')">今年(2024年)</u-button>
          <u-button size="mini" @click="selectDateRange('lastYear')">去年(2023年)</u-button>
        </view>
        
        <!-- 自定义时间选择 -->
        <view class="date-range-picker">
          <view class="date-input">
            <text>起始时间：</text>
            <u-datetime-picker
              v-model="startDate"
              mode="date"
              :max-date="endDate"
            ></u-datetime-picker>
          </view>
          <view class="date-input">
            <text>结束时间：</text>
            <u-datetime-picker
              v-model="endDate"
              mode="date"
              :min-date="startDate"
              :max-date="new Date()"
            ></u-datetime-picker>
          </view>
        </view>
        
        <!-- 确认按钮 -->
        <view class="popup-buttons">
          <u-button @click="confirmDateRange" type="primary">确定</u-button>
          <u-button @click="showDatePicker = false">取消</u-button>
        </view>
      </view>
    </u-popup>

    <!-- 订单列表 -->
    <scroll-view scroll-y style="flex: 1;">
      <block v-for="(group, date) in groupedOrders" :key="date">
        <!-- 日期分割行 -->
        <view class="date-divider">{{ date }}</view>
        
        <!-- 订单卡片 -->
        <view class="order-card" v-for="order in group" :key="order.id">
          <view class="order-content">
            <image :src="order.image" mode="aspectFit" class="order-image"></image>
            <view class="order-details">
              <text class="status">{{ order.status }}</text>
              <text class="location">{{ order.location }}</text>
              <text class="time">{{ order.time }}</text>
            </view>
          </view>
          <view class="order-buttons">
            <u-button size="mini" type="primary" @click="onEvaluate(order)">评价</u-button>
            <u-button size="mini" @click="onHide(order)">隐藏</u-button>
          </view>
        </view>
      </block>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import dayjs from 'dayjs';

// 状态变量
const search = ref('');
const showDatePicker = ref(false);
const startDate = ref(dayjs().subtract(7, 'day').toDate());
const endDate = ref(new Date());
const orders = ref([]);

// 按日期分组的订单
const groupedOrders = computed(() => {
  const groups = {};
  orders.value.forEach(order => {
    const date = dayjs(order.time).format('YYYY-MM-DD');
    if (!groups[date]) groups[date] = [];
    groups[date].push(order);
  });
  return groups;
});

// 日期范围文本显示
const getDateRangeText = () => {
  return `${dayjs(startDate.value).format('YYYY-MM-DD')} 至 ${dayjs(endDate.value).format('YYYY-MM-DD')}`;
};

// 快捷日期选择
const selectDateRange = (type) => {
  const end = new Date();
  let start;
  
  switch(type) {
    case 'week':
      start = dayjs().subtract(7, 'day').toDate();
      break;
    case 'month':
      start = dayjs().subtract(1, 'month').toDate();
      break;
    case 'thisYear':
      start = dayjs().startOf('year').toDate();
      break;
    case 'lastYear':
      start = dayjs().subtract(1, 'year').startOf('year').toDate();
      end = dayjs().subtract(1, 'year').endOf('year').toDate();
      break;
  }
  
  startDate.value = start;
  endDate.value = end;
};

// 确认日期选择
const confirmDateRange = async () => {
  showDatePicker.value = false;
  await fetchOrders();
};

// 获取订单数据
const fetchOrders = async () => {
  try {
    const response = await uni.request({
      url: 'YOUR_API_ENDPOINT',
      data: {
        startDate: dayjs(startDate.value).format('YYYY-MM-DD'),
        endDate: dayjs(endDate.value).format('YYYY-MM-DD'),
        search: search.value
      }
    });
    orders.value = response.data;
  } catch (error) {
    uni.showToast({
      title: '获取订单失败',
      icon: 'none'
    });
  }
};

// 订单操作
const onEvaluate = (order) => {
  uni.navigateTo({
    url: `/pages/evaluate/evaluate?id=${order.id}`
  });
};

const onHide = (order) => {
  // 实现隐藏逻辑
};

const onSearch = () => {
  fetchOrders();
};
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
  padding: 10px;
}

.date-picker-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
}

.date-picker-popup {
  background-color: #fff;
  padding: 20px;
  width: 80vw;
  border-radius: 8px;
}

.quick-buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 10px;
}

.date-range-picker {
  margin-bottom: 20px;
}

.date-input {
  margin: 10px 0;
}

.popup-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.date-divider {
  padding: 8px;
  background-color: #f5f5f5;
  color: #666;
  font-size: 14px;
}

.order-card {
  background-color: #fff;
  margin: 10px 0;
  padding: 15px;
  border-radius: 8px;
}

.order-content {
  display: flex;
  margin-bottom: 15px;
}

.order-image {
  width: 60px;
  height: 60px;
  margin-right: 15px;
}

.order-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  .status {
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }
  
  .location, .time {
    font-size: 14px;
    color: #666;
  }
}

.order-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>