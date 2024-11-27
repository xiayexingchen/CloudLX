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
.address-container {
  padding: 20rpx;
  background: #f5f5f5;
  min-height: 100vh;
}

.address-list {
  .address-item {
    background: #fff;
    border-radius: 12rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
    
    .address-info {
      .user-info {
        margin-bottom: 10rpx;
        
        .name {
          font-size: 32rpx;
          font-weight: bold;
          margin-right: 20rpx;
        }
        
        .phone {
          font-size: 28rpx;
          color: #666;
        }
        
        .tag {
          background: #ff4400;
          color: #fff;
          font-size: 24rpx;
          padding: 4rpx 12rpx;
          border-radius: 4rpx;
          margin-left: 20rpx;
        }
      }
      
      .address-detail {
        font-size: 28rpx;
        color: #333;
        line-height: 1.4;
      }
    }
    
    .address-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 20rpx;
      
      button {
        margin-left: 20rpx;
        font-size: 28rpx;
        padding: 10rpx 30rpx;
        border-radius: 8rpx;
        
        &.edit-btn {
          background: #fff;
          border: 1px solid #ddd;
        }
        
        &.delete-btn {
          background: #ff4400;
          color: #fff;
        }
      }
    }
  }
}

.add-address {
  position: fixed;
  bottom: 40rpx;
  left: 20rpx;
  right: 20rpx;
  
  .add-btn {
    background: #ff4400;
    color: #fff;
    height: 88rpx;
    line-height: 88rpx;
    border-radius: 44rpx;
    font-size: 32rpx;
  }
}
</style>