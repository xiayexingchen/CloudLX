<template>
  <view class="address-list">
    <view 
      v-for="address in addresses" 
      :key="address.address_id" 
      class="address-card"
      @click="selectAddress(address)"
    >
      <view class="address-header">
        <text class="recipient-name">{{ address.recipient_name }}</text>
        <text v-if="address.is_default" class="default-tag">默认</text>
      </view>
      <view class="address-details">
        <text>{{ address.region }} {{ address.building }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchAddressDataAPI } from '@/api/api-user';

const addresses = ref([]);

// 获取地址数据
const fetchAddressData = async () => {
  try {
    const res = await fetchAddressDataAPI();
    if (res.code === 23031) {
      addresses.value = res.data;
    } else {
      uni.showToast({
        title: '获取地址失败',
        icon: 'none'
      });
    }
  } catch (error) {
    console.error('获取地址失败:', error);
    uni.showToast({
      title: '系统错误',
      icon: 'none'
    });
  }
};

// 选择地址
const selectAddress = (address) => {
  // 格式化地址数据以匹配上一页面的结构
  const formattedAddress = {
    name: address.recipient_name,
    phone: '', // 如果API返回的数据中没有电话号码，这里需要处理
    fullAddress: `${address.region} ${address.building}`,
    value: true // 确保地址被选中
  };

  // 获取页面栈
  const pages = getCurrentPages();
  const prevPage = pages[pages.length - 2];

  // 设置上一页的数据
  if (prevPage) {
    prevPage.$vm.address = formattedAddress;
  }

  // 返回上一页
  uni.navigateBack({
    success: () => {
      uni.showToast({
        title: '已选择地址',
        icon: 'success'
      });
    }
  });
};

// 页面加载时获取地址数据
onMounted(() => {
  fetchAddressData();
});
</script>

<style lang="scss" scoped>
.address-list {
  padding: 15px;
  background-color: #f8f8f8;
  min-height: 100vh;
}

.address-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:active {
    background-color: #f5f5f5;
  }
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  .recipient-name {
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }

  .default-tag {
    background-color: #007AFF;
    color: #fff;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
  }
}

.address-details {
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}
</style>