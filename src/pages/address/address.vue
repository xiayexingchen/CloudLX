<template>
  <view class="address-container">
    <!-- 地址列表 -->
    <view class="address-list">
      <view 
        class="address-item" 
        v-for="address in addressList" 
        :key="address.id"
        @click="selectAddress(address)"
      >
        <view class="address-info">
          <view class="user-info">
            <text class="name">{{ address.name }}</text>
            <text class="phone">{{ address.phone }}</text>
            <text class="tag" v-if="address.isDefault">默认</text>
          </view>
          <view class="address-detail">{{ address.fullAddress }}</view>
        </view>
        <view class="address-actions">
          <button class="edit-btn" @click.stop="editAddress(address)">编辑</button>
          <button class="delete-btn" @click.stop="deleteAddress(address)">删除</button>
        </view>
      </view>
    </view>

    <!-- 添加新地址按钮 -->
    <view class="add-address">
      <button class="add-btn" @click="addNewAddress">新增地址</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

// 模拟数据
const addressList = ref([
  {
    id: 1,
    name: '张三',
    phone: '13800138000',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    detailAddress: '科技园南路88号',
    fullAddress: '广东省深圳市南山区科技园南路88号',
    isDefault: true
  },
  {
    id: 2,
    name: '李四',
    phone: '13900139000',
    province: '广东省',
    city: '广州市',
    district: '天河区',
    detailAddress: '天河路100号',
    fullAddress: '广东省广州市天河区天河路100号',
    isDefault: false
  }
])

// 选择地址
const selectAddress = (address) => {
  console.log('选择的地址：', address)
  // 这里可以添加选择地址后的逻辑
}

// 编辑地址
const editAddress = (address) => {
  console.log('编辑地址：', address)
  // 跳转到编辑页面
  uni.navigateTo({
    url: `/pages/address/edit?id=${address.id}`
  })
}

// 删除地址
const deleteAddress = (address) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除该地址吗？',
    success: (res) => {
      if (res.confirm) {
        // 这里添加删除地址的逻辑
        addressList.value = addressList.value.filter(item => item.id !== address.id)
      }
    }
  })
}

// 添加新地址
const addNewAddress = () => {
  uni.navigateTo({
    url: '/pages/address/edit'
  })
}
</script>

<style lang="scss" scoped>
// 更新主题色变量
$primary-color: #3B82F6; // 新的主题蓝色
$primary-light: #EFF6FF; // 更新后的浅蓝背景色
$danger-color: #EF4444; // 更新为更现代的红色
$text-primary: #1F2937; // 主要文字颜色
$text-secondary: #6B7280; // 次要文字颜色

.address-container {
  padding: 24rpx;
  background: $primary-light;
  min-height: 100vh;
}

.address-list {
  .address-item {
    background: #fff;
    border-radius: 20rpx;
    padding: 32rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 4rpx 16rpx rgba(59, 130, 246, 0.08);
    border: 2rpx solid rgba(59, 130, 246, 0.1);
    transition: all 0.3s ease;
    
    &:active {
      transform: scale(0.98);
    }
    
    .address-info {
      .user-info {
        margin-bottom: 20rpx;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        
        .name {
          font-size: 36rpx;
          font-weight: 600;
          margin-right: 24rpx;
          color: $text-primary;
        }
        
        .phone {
          font-size: 28rpx;
          color: $text-secondary;
        }
        
        .tag {
          background: rgba($primary-color, 0.1);
          color: $primary-color;
          font-size: 24rpx;
          padding: 6rpx 20rpx;
          border-radius: 24rpx;
          margin-left: 24rpx;
          font-weight: 500;
        }
      }
      
      .address-detail {
        font-size: 30rpx;
        color: $text-secondary;
        line-height: 1.6;
      }
    }
    
    .address-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 28rpx;
      gap: 24rpx;
      
      button {
        font-size: 28rpx;
        padding: 16rpx 40rpx;
        border-radius: 40rpx;
        transition: all 0.2s ease;
        
        &.edit-btn {
          background: rgba($primary-color, 0.1);
          border: none;
          color: $primary-color;
          font-weight: 500;
          
          &:active {
            background: rgba($primary-color, 0.2);
          }
        }
        
        &.delete-btn {
          background: rgba($danger-color, 0.1);
          color: $danger-color;
          font-weight: 500;
          
          &:active {
            background: rgba($danger-color, 0.2);
          }
        }
      }
    }
  }
}

.add-address {
  position: fixed;
  bottom: 48rpx;
  left: 40rpx;
  right: 40rpx;
  
  .add-btn {
    background: $primary-color;
    color: #fff;
    height: 100rpx;
    line-height: 100rpx;
    border-radius: 50rpx;
    font-size: 32rpx;
    font-weight: 600;
    box-shadow: 0 8rpx 24rpx rgba(59, 130, 246, 0.25);
    transition: all 0.3s ease;
    
    &:active {
      transform: scale(0.98);
      box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.2);
    }
  }
}
</style>