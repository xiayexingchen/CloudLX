<template>
  <view class="feedback-container">
    <!-- 顶部提示 -->
    <view class="feedback-header">
      <text class="header-title">感谢您的反馈</text>
      <text class="header-desc">您的建议是我们进步的动力</text>
    </view>

    <!-- 反馈类型选择 -->
    <view class="feedback-type">
      <text class="section-title">反馈类型</text>
      <view class="type-grid">
        <view v-for="type in feedbackTypes" :key="type.id" :class="['type-item', { active: selectedType === type.id }]"
          @click="handleTypeSelect(type.id)"> <!-- 修改这里 -->
          <u-icon :name="type.icon" size="24" :color="selectedType === type.id ? '#fff' : '#666'">
          </u-icon>
          <text>{{ type.name }}</text>
        </view>
      </view>
    </view>

    <!-- 反馈内容 -->
    <view class="feedback-content">
      <text class="section-title">问题描述</text>
      <view class="content-input">
        <textarea v-model="content" placeholder="请详细描述您遇到的问题或建议（至少5个字）..." :maxlength="80" class="input-area"
          @blur="validateContent">     </textarea>


        <text :class="['word-count', getActualLength(content) < 5 ? 'error' : '']">
          {{ getActualLength(content) }}/80
        </text>
        <text v-if="content.length > 0 && getActualLength(content) < 5" class="error-tip">
          请至少输入5个字的描述
        </text>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-section">
      <button class="submit-btn" :disabled="!isValid" @click="handleSubmit">
        提交反馈
      </button>
      <text class="submit-tips">我们会认真处理您的反馈</text>
    </view>
  </view>
</template>

<script setup>
  import {
    ref,
    computed,
    onMounted,
    getCurrentInstance
  } from 'vue'
  import {
    feedbackAPI
  } from '@/api/api-user'
  // 用户名
  const username = ref('')

  // 反馈类型
  const selectedType = ref('')
  const content = ref('')
  const contact = ref('')

  // 反馈类型
  const feedbackTypes = [{
      id: 1,
      name: '功能异常',
      icon: 'error-circle'
    },
    {
      id: 2,
      name: '体验问题',
      icon: 'eye'
    },
    {
      id: 3,
      name: '产品建议',
      icon: 'error-circle'
    },
    {
      id: 4,
      name: '其他问题',
      icon: 'more-circle'
    }
  ]

  // 添加类型选择处理函数
  const handleTypeSelect = (typeId) => {
    selectedType.value = typeId
    console.log('Selected type:', typeId)
  }
  // 添加一个计算实际字数的函数
  const getActualLength = (str) => {
    // 移除所有空格和换行符后计算长度
    return str.replace(/[\s\r\n]/g, '').length;
  };

  // 修改表单验证
  const isValid = computed(() => {
    // const isValidType = selectedType.value !== '';
    // console.log('selectedType.value:', selectedType.value);
    // const isValidContent = getActualLength(content.value) >= 5;
    // console.log('Form validation:', {
    //   isValidType,
    //   isValidContent
    // });
    //return isValidType && isValidContent;
    return true;
  });

  // 修改内容验证函数
  const validateContent = () => {
    const actualLength = getActualLength(content.value);
    if (content.value.length > 0 && actualLength < 5) {
      uni.showToast({
        title: '请至少输入5个字的描述',
        icon: 'none',
        duration: 2000
      });
    }
  };

  // 提交反馈
  const handleSubmit = async () => {
    console.log('Submit button clicked') // 添加调试日志

    // 表单验证
    if (!selectedType.value) {
      uni.showToast({
        title: '请选择反馈类型',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    if (getActualLength(content.value) < 5) {
      uni.showToast({
        title: '请至少输入5个字的描述',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    try {
      uni.showLoading({
        title: '提交中...'
      })

      // 获取选中类型的完整信息
      const selectedTypeInfo = feedbackTypes.find(type => type.id === selectedType.value)
      console.log('Selected Type Info:', selectedTypeInfo) // 添加调试日志

      if (!selectedTypeInfo) {
        throw new Error('未选择反馈类型')
      }

      const feedbackInfo = {
        content: content.value,
        username: username.value,
        type: selectedTypeInfo.name
      }

      console.log('Feedback Info to be sent:', feedbackInfo) // 添加调试日志

      const result = await feedbackAPI(feedbackInfo)
      console.log('API Response:', result) // 添加调试日志

      if (result.code === 23121) {
        uni.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000,
          success: () => {
            setTimeout(() => {
              uni.navigateBack()
            }, 2000)
          }
        })
      }
    } catch (err) {
      console.error('提交反馈失败:', err)
      uni.showToast({
        title: '提交失败',
        icon: 'none',
        duration: 2000
      })
    } finally {
      uni.hideLoading()
    }
  }

  onMounted(() => {
    const instance = getCurrentInstance().proxy
    const eventChannel = instance.getOpenerEventChannel();
    eventChannel.on('userData', (data) => {
      username.value = data.username
    })
  })
</script>

<style lang="scss" scoped>
  .feedback-container {
    min-height: 100vh;
    background-color: #f5f7fa;
    padding: 20px;
  }

  .feedback-header {
    text-align: center;
    margin-bottom: 30px;

    .header-title {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
      display: block;
    }

    .header-desc {
      font-size: 14px;
      color: #666;
    }
  }

  .section-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-bottom: 16px;
    display: block;
  }

  .feedback-type {
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    .type-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;

      .type-item {
        height: 80px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: #f5f7fa;
        border-radius: 8px;
        transition: all 0.3s;

        text {
          font-size: 12px;
          color: #666;
        }

        &.active {
          background: #3498db;

          text {
            color: #fff;
          }
        }
      }
    }
  }

  .feedback-content {
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    .content-input {
      position: relative;
      width: 100%;

      .input-area {
        width: 100%;
        height: 150px;
        padding: 12px;
        font-size: 14px;
        line-height: 1.5;
        border: 1px solid #eee;
        border-radius: 8px;
        background: #f5f7fa;
        box-sizing: border-box;
      }

      .word-count {
        position: absolute;
        right: 12px;
        bottom: 12px;
        font-size: 12px;
        color: #999;

        &.error {
          color: #ff4d4f;
        }
      }

      .error-tip {
        position: absolute;
        left: 12px;
        bottom: -20px;
        font-size: 12px;
        color: #ff4d4f;
      }
    }
  }

  .image-upload {
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    .upload-tips {
      font-size: 12px;
      color: #999;
      margin-bottom: 12px;
    }

    .upload-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;

      .image-item,
      .upload-btn {
        width: 100px;
        height: 100px;
        border-radius: 8px;
        overflow: hidden;
      }

      .image-item {
        position: relative;

        image {
          width: 100%;
          height: 100%;
        }

        .delete-btn {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 20px;
          height: 20px;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .upload-btn {
        border: 1px dashed #ddd;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        background: #f5f7fa;

        text {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }

  .contact-info {
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    .contact-input {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #f5f7fa;
      border-radius: 8px;

      input {
        flex: 1;
        font-size: 14px;
      }
    }
  }

  .submit-section {
    text-align: center;
    margin-top: 30px;

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
      border: none;

      &:disabled {
        background: #ccc;
        opacity: 0.7;
        cursor: not-allowed;
      }

      &:active {
        transform: scale(0.98);
      }
    }

    .submit-tips {
      font-size: 12px;
      color: #999;
      margin-top: 12px;
      display: block;
    }
  }
</style>