<template>
  <view class="address-container">
    <!-- 顶部标题栏 -->
    <view class="header">
      <text>我的收货地址</text>
    </view>
    <view class="tip-box" v-if="siteName">
      <text class="tip-text">仅显示{{ siteName }}的地址</text>
    </view>
    <!-- 地址列表 -->
    <scroll-view scroll-y class="address-list">

      <view class="address-item" v-for="address in filteredAddressList" :key="address.address_id"
        @click="mode === 'select' && selectAddress(address)">
        <!-- 左侧头像区 -->
        <view class="avatar">
          {{ address.recipient_name.charAt(0) }}
        </view>

        <!-- 地址内容 -->
        <view class="content">
          <view class="user-info">
            <text class="name">{{ address.recipient_name }}</text>
            <text class="phone">{{ address.phone }}</text>
            <text class="tag" v-if="address.is_default">默认</text>
          </view>
          <view class="location">{{ address.region }} {{ address.building }}</view>
        </view>

        <!-- 右侧按钮区域 -->
        <view class="action-area">
          <!-- 编辑按钮 -->
          <view class="edit-btn" @click.stop="editAddress(address)">
            <u-icon name="edit-pen" size="40" color="#666"></u-icon>
          </view>

          <!-- 删除按钮 - 仅在管理模式下显示 -->
          <view v-if="isManageMode" class="delete-btn" @click.stop="deleteAddress(address.address_id)">
            <u-icon name="trash" color="#666" size="40"></u-icon>
          </view>
        </view>

      </view>
      <!-- 无地址提示 -->
      <view class="empty-state" v-if="!addressList.length">
        <u-icon name="home" size="64" color="#999"></u-icon>
        <text>暂无收货地址</text>
      </view>
      <!-- 空状态 -->
      <view v-if="addressList.length > 0 && filteredAddressList.length === 0 && siteName" class="empty-state">
        <u-icon name="info-circle" size="64" color="#999"></u-icon>
        <text>暂无{{ siteName }}的可用地址</text>
      </view>
    </scroll-view>

    <!-- 底部按钮区 -->
    <view class="bottom-section">
      <template v-if="isManageMode">
        <button class="exit-btn" @click="exitManage">退出管理</button>
        <button class="add-btn" @click="addNewAddress">
          <text>添加收货地址</text>
        </button>
      </template>
      <template v-else>
        <button class="manage-btn" @click="toggleManageMode">管理</button>
        <button class="add-btn" @click="addNewAddress">
          <text>添加收货地址</text>
        </button>
      </template>
    </view>
  </view>
</template>
<script setup>
  import {
    ref,
    onMounted,
    getCurrentInstance,
    computed
  } from 'vue'
  import {
    fetchAddressDataAPI,
    addAddressDataAPI,
    updateAddressDataAPI,
    deleteAddressAPI
  } from '@/api/api-user'
  import {
    onLoad,
    onShow
  } from "@dcloudio/uni-app"
  // 地址列表数据
  const addressList = ref([])
  // 页面模式：'manage' 或 'select'
  const mode = ref('manage')
  // 添加管理模式状态
  const isManageMode = ref(false)

  // 切换管理模式
  const toggleManageMode = () => {
    isManageMode.value = !isManageMode.value
  }

  // 退出管理模式
  const exitManage = () => {
    isManageMode.value = false
  }
  const siteName = ref('');
  // 过滤后的地址列表
  const filteredAddressList = computed(() => {
    if (!siteName.value) return addressList.value;

    // 根据站点名过滤地址
    return addressList.value.filter(addr => {
      // 这里的匹配逻辑可以根据实际需求调整
      // 例如：可以用 includes 进行模糊匹配，或者用 === 进行精确匹配
      return addr.region.includes(siteName.value);
    });
  });
  // 初始化
  onMounted(() => {
    fetchAddressList()
  })
  onShow(() => {
    fetchAddressList()
  })
  defineExpose({
  fetchAddressList
});
  // 获取地址列表
  const fetchAddressList = async () => {
    try {
      const res = await fetchAddressDataAPI()
      if (res.code === 23031) {
        addressList.value = res.data
      }
    } catch (error) {
      console.error('获取地址列表失败:', error)
      uni.showToast({
        title: '获取地址失败',
        icon: 'error'
      })
    }
  }

  // 删除地址
  // 处理删除消息
  const deleteAddress = async (addressId) => {
    try {
      uni.showModal({
        title: '提示',
        content: '确定要删除这条地址吗？',
        success: async (res) => {
          if (res.confirm) {
            const result = await deleteAddressAPI(addressId)
            if (result.code === 23131) {
              uni.showToast({
                title: '删除成功',
                icon: 'success'
              })
              // 重新获取地址列表
              fetchAddressList()
            }
          }
        }
      })
    } catch (err) {
      console.error('删除地址失败:', err)
      uni.showToast({
        title: '删除失败',
        icon: 'none'
      })
    }
  }

  // 选择地址（仅在选择模式下生效）
  const selectAddress = (address) => {
    // 如果地址不属于指定站点，显示提示
    if (!address.region.includes(siteName.value)) {
      uni.showToast({
        title: `只能选择${siteName.value}的地址`,
        icon: 'none'
      });
      return;
    }
    if (mode.value === 'select') {
      const selectedAddr = {
        addressId: address.address_id,
        recipientName: address.recipient_name,
        region: address.region,
        building: address.building
      }

      // 将选中的地址作为页面参数返回
      uni.navigateBack({
        delta: 1,
        success: function() {
          // 使用全局事件总线或存储来传递数据
          uni.$emit('addressSelected', selectedAddr)
        }
      })
    }
  }

  // 编辑地址
  const editAddress = (address) => {
    const addressData = {
      addressId: address.address_id,
      recipientName: address.recipient_name,
      region: address.region,
      build: address.building,
      isDefault: address.is_default,
      phone: address.phone
    }

    try {
      const queryString = encodeURIComponent(JSON.stringify(addressData))
      uni.navigateTo({
        url: `/pages/address/address-edit?address=${queryString}`
      })
    } catch (error) {
      console.error('编辑地址失败:', error)
      uni.showToast({
        title: '操作失败',
        icon: 'none'
      })
    }
  }

  // 添加新地址
  const addNewAddress = () => {
    uni.navigateTo({
      url: '/pages/address/address-edit'
    })
  }
  onLoad((options) => {
    console.log('页面参数:', options) // 调试日志
    mode.value = options.mode || 'manage'
    console.log('当前模式:', mode.value) // 调试日志
    if (options.siteName) {
      siteName.value = decodeURIComponent(options.siteName);
    }
  })

  // 退出管理模式
  // const exitManage = () => {
  //   uni.navigateBack()
  // }
</script>


<style lang="scss" scoped>
  .address-container {
    min-height: 100vh;
    background: #f7f7f7;
    display: flex;
    flex-direction: column;
  }

  .bottom-section {
    padding: 20rpx;
    background: #fff;
    display: flex;
    gap: 20rpx;

    .manage-btn,
    .exit-btn {
      flex: 1;
      height: 88rpx;
      border: 2rpx solid #ddd;
      border-radius: 44rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;
      color: #666;
    }

    .add-btn {
      flex: 2;
      height: 88rpx;
      background: #FFD21E; // 修改为黄色
      color: #333;
      border-radius: 44rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;
    }
  }

  .tip-box {
    padding: 16rpx 24rpx;
    background-color: #fff7e6;
    margin: 20rpx;
    border-radius: 8rpx;

    .tip-text {
      font-size: 28rpx;
      color: #fa8c16;
    }
  }

  // 管理模式下的样式调整
  .address-item {
    &.manage-mode {
      .content {
        padding-right: 160rpx; // 为复选框留出空间
      }
    }
  }

  .default-checkbox {
    position: absolute;
    right: 30rpx;
    top: 50%;
    transform: translateY(-50%);
  }

  .header {
    background: #fff;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    font-weight: 500;
    position: relative;
    border-bottom: 1rpx solid #eee;
  }

  .address-list {
    flex: 1;
    padding: 20rpx;
  }

  .address-item {
    background: #fff;
    border-radius: 12rpx;
    margin-bottom: 20rpx;
    padding: 30rpx;
    display: flex;
    align-items: center;
    position: relative;

    .action-area {
      position: absolute;
      right: 30rpx;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      gap: 20rpx; // 按钮之间的间距
    }

    .avatar {
      width: 80rpx;
      height: 80rpx;
      background: #EFF6FF;
      color: #3B82F6;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;
      margin-right: 20rpx;
    }

    .content {
      flex: 1;
      padding-right: 80rpx;

      .user-info {
        display: flex;
        align-items: center;
        margin-bottom: 10rpx;

        .name {
          font-size: 32rpx;
          font-weight: 500;
          margin-right: 20rpx;
        }

        .phone {
          font-size: 28rpx;
          color: #666;
          margin-right: 20rpx;
        }

        .tag {
          font-size: 24rpx;
          color: #3B82F6;
          background: #EFF6FF;
          padding: 4rpx 16rpx;
          border-radius: 20rpx;
        }
      }

      .location {
        font-size: 28rpx;
        color: #666;
        line-height: 1.4;
      }
    }

    .edit-btn,
    .delete-btn {
      width: 40rpx;
      height: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    // 管理模式下的内容区域调整
    &.manage-mode {
      .content {
        padding-right: 160rpx; // 为两个按钮留出空间
      }
    }
  }

  // 注释掉的默认地址选择器样式（暂时保留注释）
  /* .default-checkbox {
  position: absolute;
  right: 30rpx;
  top: 50%;
  transform: translateY(-50%);
} */

  .bottom-section {
    padding: 20rpx;
    background: #fff;
    display: flex;
    gap: 20rpx;

    .exit-btn {
      flex: 1;
      height: 88rpx;
      border: 2rpx solid #ddd;
      border-radius: 44rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;
      color: #666;
    }

    .add-btn {
      flex: 2;
      height: 88rpx;
      background: #3B82F6;
      color: #fff;
      border-radius: 44rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;
    }
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80rpx 0;
    text-align: center;

    text {
      font-size: 28rpx;
      color: #999;
      margin: 20rpx 0 40rpx;
    }

  }
</style>