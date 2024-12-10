<template>
  <view class="edit-container">
    <!-- 表单区域 -->
    <view class="form-group">
      <view class="form-item">
        <text class="label">收货人</text>
        <input 
          type="text" 
          v-model="formData.recipientName" 
          placeholder="请输入收货人姓名"
          placeholder-class="placeholder"
        />
      </view>

      <view class="form-item">
        <text class="label">区域</text>
        <picker 
          mode="selector" 
          :range="regionOptions" 
          @change="onRegionChange"
          :value="regionIndex"
        >
          <view class="picker-value" :class="{ placeholder: !formData.region }">
            {{ formData.region || '请选择区域' }}
            <text class="arrow">›</text>
          </view>
        </picker>
      </view>

      <view class="form-item">
        <text class="label">楼栋</text>
        <input 
          type="text" 
          v-model="formData.build" 
          placeholder="请输入详细楼栋号"
          placeholder-class="placeholder"
        />
      </view>
    </view>

    <!-- 默认地址设置 -->
    <view class="default-section">
      <view class="default-item">
        <text>设为默认地址</text>
        <switch 
          :checked="formData.isDefault" 
          @change="onSwitchChange" 
          color="#3B82F6"
        />
      </view>
      <text class="tip">设为默认地址后，下次将优先使用该地址</text>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-section">
      <button 
        class="submit-btn" 
        :class="{ 'btn-active': isFormValid }"
        @click="handleSubmit"
      >
        保存
      </button>
    </view>
  </view>
</template>

<script setup>
  import {
    ref,
    onMounted,
    computed 
  } from 'vue'
  import {
    addAddressDataAPI,
    updateAddressDataAPI
  } from '@/api/api-user'

  const formData = ref({
    addressId: '',
    recipientName: '',
    region: '',
    build: '',
    isDefault: false
  })
// 区域选项
const regionOptions = ['天马学生公寓', '其他区域']
const regionIndex = ref(0)
  // 判断是否为编辑模式
  const isEdit = ref(false)

  onMounted(() => {
  // 修改获取参数的方式
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  // 使用 options 而不是 $page.options
  const address = currentPage.options?.address

  if (address) {
    try {
      isEdit.value = true
      const addressData = JSON.parse(decodeURIComponent(address))
      formData.value = {
        addressId: addressData.addressId || '',
        recipientName: addressData.recipientName || '',
        region: addressData.region || '',
        build: addressData.build || '',
        isDefault: addressData.isDefault || false
      }
    } catch (error) {
      console.error('解析地址数据失败:', error)
      uni.showToast({
        title: '加载地址数据失败',
        icon: 'none'
      })
    }
    }
  })
// 表单验证
const isFormValid = computed(() => {
  return formData.value.recipientName.trim() && 
         formData.value.region.trim() && 
         formData.value.build.trim()
})
  const onSwitchChange = (e) => {
    formData.value.isDefault = e.detail.value
  }
  const onRegionChange = (e) => {
  const index = e.detail.value
  formData.value.region = regionOptions[index]
  regionIndex.value = index
}

  const handleSubmit = async () => {
    // 表单验证
    if (!formData.value.recipientName.trim()) {
      return uni.showToast({
        title: '请输入收货人姓名',
        icon: 'none'
      })
    }
    if (!formData.value.region.trim()) {
      return uni.showToast({
        title: '请输入区域',
        icon: 'none'
      })
    }
    if (!formData.value.build.trim()) {
      return uni.showToast({
        title: '请输入楼栋',
        icon: 'none'
      })
    }

    try {
      uni.showLoading({
        title: '保存中...'
      })

    // 准备提交的数据
    const submitData = {
      recipientName: formData.value.recipientName,
      region: formData.value.region,
      build: formData.value.build,
      isDefault: formData.value.isDefault ? 1 : 0
    }

    // 如果是编辑模式，添加addressId
    if (isEdit.value) {
      submitData.addressId = formData.value.addressId
    }

    // 选择对应的API
    const api = isEdit.value ? updateAddressDataAPI : addAddressDataAPI
    const res = await api(submitData)

    // 根据不同的操作类型判断返回码
    const isSuccess = isEdit.value ? res.code === 23041 : res.code === 23091

    if (isSuccess) {
      uni.showToast({
        title: res.msg || '保存成功',
        icon: 'success',
        duration: 1500
      })
      
      // 延迟返回，让用户看到提示
      setTimeout(() => {
        // 返回上一页并刷新数据
        const pages = getCurrentPages()
        const prevPage = pages[pages.length - 2]
        if (prevPage?.$vm) {
          prevPage.$vm.fetchAddressList()
        }
        uni.navigateBack()
      }, 1500)
    } else {
      uni.showToast({
        title: res.msg || '保存失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('保存地址失败:', error)
    uni.showToast({
      title: '保存失败',
      icon: 'error'
    })
  } finally {
    uni.hideLoading()
  }
}
  
</script>

<style lang="scss" scoped>
$primary-color: #3B82F6;
$border-color: #EAECF0;
$text-primary: #1F2937;
$text-secondary: #6B7280;
$background: #F9FAFB;

.edit-container {
  min-height: 100vh;
  background: $background;
  padding-top: 12rpx;
}

.form-group {
  background: #fff;
  margin-bottom: 24rpx;
  
  .form-item {
    display: flex;
    align-items: center;
    min-height: 108rpx;
    padding: 0 32rpx;
    border-bottom: 2rpx solid $border-color;
    
    &:last-child {
      border-bottom: none;
    }

    .label {
      width: 140rpx;
      font-size: 28rpx;
      color: $text-primary;
      font-weight: 500;
    }

    input {
      flex: 1;
      height: 108rpx;
      font-size: 28rpx;
      color: $text-primary;
    }

    .picker-value {
      flex: 1;
      font-size: 28rpx;
      color: $text-primary;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .arrow {
        color: $text-secondary;
        font-size: 32rpx;
        transform: rotate(90deg);
      }
    }
  }
}

.default-section {
  background: #fff;
  padding: 32rpx;
  margin-bottom: 48rpx;

  .default-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;
    
    text {
      font-size: 28rpx;
      color: $text-primary;
      font-weight: 500;
    }
  }

  .tip {
    font-size: 24rpx;
    color: $text-secondary;
  }
}

.submit-section {
  padding: 40rpx 32rpx;
  
  .submit-btn {
    width: 100%;
    height: 88rpx;
    background: $primary-color;
    color: #fff;
    font-size: 32rpx;
    font-weight: 500;
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
    transition: all 0.3s;
    
    &.btn-active {
      opacity: 1;
      box-shadow: 0 4rpx 12rpx rgba($primary-color, 0.2);
    }

    &:active {
      transform: scale(0.98);
    }
  }
}

.placeholder {
  color: $text-secondary;
}
</style>