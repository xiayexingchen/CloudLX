<template>
  <view class="add-package-container">
    <!-- 顶部说明 -->
    <view class="header-tips">
      <u-icon name="info-circle" color="#3498db" size="20"></u-icon>
      <text>请输入包裹信息</text>
    </view>

    <!-- 输入表单 -->
    <view class="form-card">
      <!-- 包裹编号输入 -->
      <view class="input-group">
        <view class="input-label">
          <u-icon name="gift" size="20" color="#666"></u-icon>
          <text>包裹编号</text>
        </view>
        <view class="input-wrapper">
          <input type="text" v-model="packageId" placeholder="请输入包裹编号" :maxlength="20" :disabled="isSubmitted" />
        </view>
      </view>
      <!-- 手机号输入 -->
      <view class="input-group">
        <view class="input-label">
          <u-icon name="phone" size="20" color="#666"></u-icon>
          <text>主人手机号</text>
        </view>
        <view class="input-wrapper">
          <input type="number" v-model="ownerPhone" placeholder="请输入包裹主人手机号" :maxlength="11" :disabled="isSubmitted" />
          <!--          <u-icon name="info-circle" size="30" color="#3498db" @click="chooseContact"></u-icon> -->
        </view>
      </view>

      <!-- 查找包裹按钮 -->
      <view class="submit-section" v-if="!packageInfo">
        <button class="submit-btn" :disabled="!isSearchValid" @click="searchPackage">
          查找包裹
        </button>
      </view>

      <!-- 包裹信息展示区域 -->
      <view class="package-info" v-if="packageInfo">
        <view class="info-header">
          <text class="title">包裹信息</text>
          <u-icon name="success" color="#07c160" size="20" v-if="packageInfo"></u-icon>
        </view>

        <view class="info-content">
          <view class="info-item">
            <text class="label">包裹编号：</text>
            <text class="value">{{ packageInfo.packageId }}</text>
          </view>
          <view class="info-item">
            <text class="label">包裹类型：</text>
            <text class="value">{{ packageInfo.packageType }}</text>
          </view>
          <view class="info-item">
            <text class="label">入柜时间：</text>
            <text class="value">{{ formattedPackageInTime }}</text>
          </view>
        </view>
      </view>

      <!-- 提交和重置按钮 -->
      <view class="submit-section" v-if="packageInfo">
        <button class="submit-btn" :disabled="!packageInfo" :class="{ 'submit-btn-active': packageInfo }"
          @click="handleSubmit">
          添加包裹
        </button>
        <button class="reset-btn" @click="resetForm">
          重置
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
  import {
    ref,
    computed
  } from 'vue';
  import {
    selectToAddPackageAPI,
    AddPackageAPI
  } from '../../api/api-parcel';

  const packageId = ref('');
  const ownerPhone = ref('');
  const packageInfo = ref(null);
  const packageInTime = ref('');
  const isSubmitted = ref(false);

  // 格式化时间
  const formattedPackageInTime = computed(() => {
    // 将日期字符串中的横杠替换为斜杠
    const dateStr = packageInTime.value.replace(/-/g, '/');
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}/${month}/${day}  ${hours}:${minutes}:${seconds}`;
  });

  // 检查查找包裹的表单是否有效
  const isSearchValid = computed(() => {
    console.log('Package ID Length:', packageId.value.length);
    console.log('Owner Phone Length:', ownerPhone.value.length);
    return packageId.value.length > 0 && ownerPhone.value.length === 11;
  });

  // 查找包裹
  const searchPackage = async () => {
    if (!isSearchValid.value) return;

    try {
      const result = await selectToAddPackageAPI({
        packageId: packageId.value,
        phoneNumber: ownerPhone.value
      });

      if (result.code === 22021) {
        packageInfo.value = result.data;
        packageInTime.value = packageInfo.value.packageInTime;
        console.log('Form submitted, inputs disabled-before:', isSubmitted.value);
        isSubmitted.value = true;
        console.log('Form submitted, inputs disabled-after:', isSubmitted.value);
        uni.showToast({
          title: '已找到包裹',
          icon: 'success'
        });
      } else if (result.code === 22020) {
        packageInfo.value = null;
        uni.showToast({
          title: result.msg,
          icon: 'none'
        });
      }
    } catch (error) {
      packageInfo.value = null;
    }
  };

  // 提交表单
  const handleSubmit = async () => {
    if (!packageInfo.value) return;

    try {
      uni.showLoading({
        title: '添加中...'
      });
      const result = await AddPackageAPI(packageId.value);

      if (result.code === 22031) {
        uni.showToast({
          title: '添加成功',
          icon: 'success'
        });

        setTimeout(() => {
          uni.$emit('refreshPackageList');
          uni.navigateBack();
        }, 1500);
      } else {
        uni.showToast({
          title: '添加失败',
          icon: 'error'
        });
      }
    } catch (error) {
      console.error('添加包裹失败:', error);
      uni.showToast({
        title: '系统错误',
        icon: 'error'
      });
    } finally {
      uni.hideLoading();
    }
  };

  // 重置表单
  const resetForm = () => {
    packageId.value = '';
    ownerPhone.value = '';
    packageInfo.value = null;
    isSubmitted.value = false;
    console.log('Form reset, inputs enabled:', isSubmitted.value);
  };

  // 选择联系人
  // const chooseContact = () => {
  //   uni.addPhoneContact({
  //     success: (res) => {
  //       ownerPhone.value = res.phoneNumber;
  //     }
  //   });
  // };
</script>

<style lang="scss" scoped>
  .add-package-container {
    min-height: 100vh;
    background-color: #f5f7fa;
    padding: 20px;
  }

  .header-tips {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background-color: #e3f2fd;
    border-radius: 8px;
    margin-bottom: 20px;

    text {
      font-size: 14px;
      color: #3B82F6;
    }
  }

  .form-card {
    background-color: #ffffff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  }

  .input-group {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    .input-label {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;

      text {
        font-size: 15px;
        color: #333;
        font-weight: 500;
      }

      .optional {
        font-size: 12px;
        color: #999;
        font-weight: normal;
      }
    }

    .input-wrapper {
      display: flex;
      align-items: center;
      background-color: #f5f7fa;
      border-radius: 8px;
      padding: 0 12px;
      border: 1px solid transparent;
      transition: all 0.3s;

      &:focus-within {
        border-color: #3B82F6;
        background-color: #fff;
      }

      input {
        flex: 1;
        height: 44px;
        font-size: 15px;
        color: #333;
        background: transparent;
      }

      .u-icon {
        padding: 8px;
        margin-left: 8px;
      }
    }
  }

  .package-info {
    margin-top: 20px;
    background-color: #ffffff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

    .info-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid #eee;

      .title {
        font-size: 16px;
        font-weight: 500;
        color: #333;
      }
    }

    .info-content {
      .info-item {
        display: flex;
        margin-bottom: 12px;

        &:last-child {
          margin-bottom: 0;
        }

        .label {
          color: #666;
          min-width: 80px;
        }

        .value {
          color: #333;
          flex: 1;
        }
      }
    }
  }

  .submit-section {
    margin-top: 30px;
    text-align: center;

    .submit-btn {
      width: 100%;
      height: 48px;
      background: #3B82F6;
      color: #fff;
      border-radius: 24px;
      font-size: 16px;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      border: none;

      &[disabled] {
        background: #bdc3c7;
        opacity: 0.8;
      }

      &-active {
        background: #3B82F6;

        &:active {
          transform: scale(0.98);
          background: darken(#3B82F6, 5%);
        }
      }
    }

    .reset-btn {
      margin-top: 10px;
      width: 100%;
      height: 48px;
      background: #f5f5f5;
      color: #333;
      border-radius: 24px;
      font-size: 16px;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      border: none;
    }
  }
</style>