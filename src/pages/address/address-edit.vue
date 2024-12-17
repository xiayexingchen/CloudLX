<template>
  <view class="edit-container">
    <!-- 表单区域 -->
    <view class="form-group">
      <view class="form-item">
        <text class="label">收货人</text>
        <input type="text" v-model="formData.recipientName" placeholder="请输入收货人姓名" placeholder-class="placeholder" />
      </view>

      <view class="form-item">
        <text class="label">区域</text>
        <picker mode="selector" :range="regionOptions" @change="onRegionChange" :value="regionIndex">
          <view class="picker-value" :class="{ placeholder: !formData.region }">
            {{ formData.region || '请选择区域' }}
            <text class="arrow">›</text>
          </view>
        </picker>
      </view>

      <view class="form-item">
        <text class="label">楼栋</text>
        <picker mode="multiSelector" :range="buildingOptions" @change="onBuildingChange" @columnchange="onColumnChange"
          :value="buildingIndex">
          <view class="picker-value" :class="{ placeholder: !formData.build }">
            {{ formData.build || '请选择楼栋' }}
            <text class="arrow">›</text>
          </view>
        </picker>
      </view>
    </view>

    <!-- 默认地址设置 -->
    <view class="default-section">
      <view class="default-item">
        <text>设为默认地址</text>
        <switch :checked="formData.isDefault" @change="onSwitchChange" color="#3B82F6" />
      </view>
      <text class="tip">设为默认地址后，下次将优先使用该地址</text>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-section">
      <button class="submit-btn" :class="{ 'btn-active': isFormValid }" @click="handleSubmit">
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
    updateAddressDataAPI,
    fetchAddressDataAPI
  } from '@/api/api-user'

  const formData = ref({
    addressId: '',
    recipientName: '',
    region: '',
    build: '',
    isDefault: false
  })
  // 区域选项
  const regionOptions = ['天马学生公寓', '德智学生公寓', '其他区域']
  const regionIndex = ref(0)
  // 判断是否为编辑模式
  const isEdit = ref(false)
  const isDefaultDisabled = ref(false); // 添加这个变量的定义
  // 楼栋选择器数据
  const buildingOptions = ref([
    ['一区', '二区', '三区'],
    ['1栋', '2栋', '3栋'] // 默认显示1区的楼栋
  ]);
  // 根据区域获取对应的楼栋列表
  const getBuildingsByArea = (areaIndex) => {
    const buildingCounts = {
      0: 3, // 1区有3栋
      1: 7, // 2区有7栋
      2: 20 // 3区有20栋
    };

    const count = buildingCounts[areaIndex];
    return Array.from({
      length: count
    }, (_, i) => `${i + 1}栋`);
  };

  // 检查是否有现有地址
  // 修改检查现有地址的方法
  const checkExistingAddresses = async () => {
    try {
      const res = await fetchAddressDataAPI();
      if (res.code === 23031) {
        // 如果地址列表为空，强制设置当前地址为默认地址
        if (!res.data || res.data.length === 0) {
          formData.value.isDefault = true;
          // 禁用默认地址开关
          isDefaultDisabled.value = true;
        }
      }
    } catch (error) {
      console.error('获取地址列表失败:', error);
    }
  };

  // 处理列变化
  const onColumnChange = (e) => {
    const {
      column,
      value
    } = e.detail;

    if (column === 0) { // 如果改变的是区域列
      // 更新楼栋列的数据
      buildingOptions.value[1] = getBuildingsByArea(value);
      // 重置楼栋列的选择
      buildingIndex.value = [value, 0];
    }
  };
  // 处理最终选择
  const onBuildingChange = (e) => {
    const [areaIndex, buildingIndex] = e.detail.value;
    const area = buildingOptions.value[0][areaIndex];
    const building = buildingOptions.value[1][buildingIndex];

    // 更新表单数据
    formData.value.build = `${area}${building}`;
  };
  // 编辑模式下的数据回显处理
  const initBuildingSelection = (buildString) => {
    if (!buildString) return;

    // 解析已有的楼栋信息，例如 "3区19栋"
    const areaMatch = buildString.match(/(\d+)区/);
    const buildingMatch = buildString.match(/(\d+)栋/);

    if (areaMatch && buildingMatch) {
      const areaNumber = parseInt(areaMatch[1]);
      const buildingNumber = parseInt(buildingMatch[1]);

      // 计算区域索引
      const areaIndex = areaNumber - 1;

      // 更新楼栋选项
      buildingOptions.value[1] = getBuildingsByArea(areaIndex);

      // 设置选择器的索引
      buildingIndex.value = [areaIndex, buildingNumber - 1];
    }
  };
  // 当前选择的索引
  const buildingIndex = ref([0, 0]);

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
    // 如果是编辑模式，初始化楼栋选择
    if (formData.value.build) {
      initBuildingSelection(formData.value.build);
    }
    // 检查是否有现有地址
    checkExistingAddresses();
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
    // 如果是第一个地址，强制设置为默认地址
    // 如果是第一个地址，强制设置为默认地址
    if (isDefaultDisabled.value && !formData.value.isDefault) {
      return uni.showToast({
        title: '首个地址必须设为默认地址',
        icon: 'none'
      });
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