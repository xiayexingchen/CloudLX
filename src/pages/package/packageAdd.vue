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
          <input type="text" v-model="packageId" placeholder="请输入包裹编号" :maxlength="20" />
          <!--          <u-icon 
            name="scan" 
            size="24" 
            color="#3498db"
            @click="scanCode"
          ></u-icon> -->
        </view>
      </view>
      <!-- 手机号输入 -->
      <view class="input-group">
        <view class="input-label">
          <u-icon name="phone" size="20" color="#666"></u-icon>
          <text>主人手机号</text>
        </view>
        <view class="input-wrapper">
          <input type="number" v-model="ownerPhone" placeholder="请输入包裹主人手机号" :maxlength="11"
            @input="handlePhoneInput" />
          <u-icon name="contacts" size="24" color="#3498db" @click="chooseContact"></u-icon>
        </view>
      </view>

      <!-- 包裹信息展示区域 -->
      <view class="package-info" v-if="packageInfo">
        <view class="info-header">
          <text class="title">包裹信息</text>
          <u-icon name="success" color="#07c160" size="20" v-if="packageInfo"></u-icon>
        </view>

        <view class="info-content">
          <view class="info-item">
            <text class="label">包裹类型：</text>
            <text class="value">{{ packageInfo.packageType }}</text>
          </view>
          <view class="info-item">
            <text class="label">位置：</text>
            <text class="value">{{ packageInfo.packageSiteName }}</text>
          </view>
          <!-- 可以根据需要添加更多信息 -->
        </view>
      </view>

      <!-- 提交按钮 -->
      <view class="submit-section">
        <button class="submit-btn" :disabled="!packageInfo" :class="{ 'submit-btn-active': packageInfo }"
          @click="handleSubmit">
          添加包裹
        </button>
        <text class="tips">添加包裹后将通知包裹主人</text>
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

  // // 包裹类型文字映射
  //// const packageTypeText = {
  //   express: '快递包裹',
  //   storage: '寄存包裹'
  // };
  // 防抖函数
  const debounce = (fn, delay) => {
    let timer = null;
    return function(...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  };

  // 手机号输入处理
  const handlePhoneInput = debounce(async () => {
    if (ownerPhone.value.length === 11 && packageId.value) {
      try {
        // 查询包裹信息
        const result = await selectToAddPackageAPI({
          packageId: packageId.value,
          phoneNumber: ownerPhone.value
        });

        if (result.code === 22021) {
          packageInfo.value = result.data;
          uni.showToast({
            title: '已找到包裹',
            icon: 'success'
          });
        } else {
          packageInfo.value = null;
          uni.showToast({
            title: '未找到包裹',
            icon: 'error'
          });
        }
      } catch (error) {
        console.error('查询包裹失败:', error);
        packageInfo.value = null;
      }
    }
  }, 500);

  //dele
  // 表单验证
  const isFormValid = computed(() => {
    return packageId.value.length > 0 &&
      ownerPhone.value.length === 11;
  });

  // 扫码功能
  const scanCode = () => {
    uni.scanCode({
      success: (res) => {
        packageId.value = res.result;
      }
    });
  };

  // 选择联系人
  const chooseContact = () => {
    uni.addPhoneContact({
      success: (res) => {
        ownerPhone.value = res.phoneNumber;
      }
    });
  };

  // 提交表单
  const handleSubmit = async () => {
    if (!packageInfo.value) return;

    try {
      uni.showLoading({
        title: '添加中...'
      });
      console.log(packageId.value);
      const result = await AddPackageAPI(packageId.value);

      if (result.code === 22031) {
        uni.showToast({
          title: '添加成功',
          icon: 'success'
        });

        // 延迟返回，让用户看到成功提示
      setTimeout(() => {
        // 发送刷新事件
        uni.$emit('refreshPackageList');
        // 返回上一页
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
      color: #3498db;
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
        border-color: #3498db;
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

  .remark-input {
    width: 100%;
    height: 100px;
    background-color: #f5f7fa;
    border-radius: 8px;
    padding: 12px;
    font-size: 14px;
    line-height: 1.5;
    border: 1px solid transparent;

    &:focus {
      border-color: #3498db;
      background-color: #fff;
    }
  }

  .word-count {
    text-align: right;
    font-size: 12px;
    color: #999;
    margin-top: 4px;
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
      background: #bdc3c7;
      color: #fff;
      border-radius: 24px;
      font-size: 16px;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      border: none;

      &:disabled {
        background: #bdc3c7;
        cursor: not-allowed;
      }

      &-active {
        background: #3498db;

        &:active {
          transform: scale(0.98);
          background: darken(#3498db, 5%);
        }
      }
    }

    .tips {
      font-size: 12px;
      color: #999;
      margin-top: 12px;
      display: block;
    }
  }
</style>