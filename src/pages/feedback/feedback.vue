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
        <view
          v-for="type in feedbackTypes"
          :key="type.id"
          :class="['type-item', { active: selectedType === type.id }]"
          @click="selectedType = type.id"
        >
          <u-icon :name="type.icon" size="24" :color="selectedType === type.id ? '#fff' : '#666'"></u-icon>
          <text>{{ type.name }}</text>
        </view>
      </view>
    </view>

    <!-- 反馈内容 -->
    <view class="feedback-content">
      <text class="section-title">问题描述</text>
      <view class="content-input">
        <textarea
          v-model="content"
          placeholder="请详细描述您遇到的问题或建议..."
          :maxlength="200"
          class="input-area"
        ></textarea>
        <text class="word-count">{{ content.length }}/200</text>
      </view>
    </view>

    <!-- 图片上传 -->
    <view class="image-upload">
      <text class="section-title">图片上传 (选填)</text>
      <text class="upload-tips">最多可上传3张图片</text>
      <view class="upload-grid">
        <view 
          v-for="(image, index) in images" 
          :key="index"
          class="image-item"
        >
          <image :src="image" mode="aspectFill"></image>
          <view class="delete-btn" @click="deleteImage(index)">
            <u-icon name="close" color="#fff" size="12"></u-icon>
          </view>
        </view>
        <view 
          class="upload-btn"
          v-if="images.length < 3"
          @click="chooseImage"
        >
          <u-icon name="camera-fill" size="24" color="#999"></u-icon>
          <text>上传图片</text>
        </view>
      </view>
    </view>

    <!-- 联系方式 -->
    <view class="contact-info">
      <text class="section-title">联系方式 (选填)</text>
      <view class="contact-input">
        <u-icon name="phone" size="20" color="#666"></u-icon>
        <input 
          type="number"
          v-model="contact"
          placeholder="请留下您的手机号，方便我们联系您"
          maxlength="11"
        />
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-section">
      <button 
        class="submit-btn"
        :disabled="!isValid"
        @click="handleSubmit"
      >
        提交反馈
      </button>
      <text class="submit-tips">我们会认真处理您的反馈</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

// 反馈类型
const feedbackTypes = [
  { id: 1, name: '功能异常', icon: 'error-circle' },
  { id: 2, name: '体验问题', icon: 'eye' },
  { id: 3, name: '产品建议', icon: 'light' },
  { id: 4, name: '其他问题', icon: 'more-circle' }
]

const selectedType = ref('')
const content = ref('')
const images = ref([])
const contact = ref('')

// 表单验证
const isValid = computed(() => {
  return selectedType.value && content.value.length >= 10
})

// 选择图片
const chooseImage = () => {
  uni.chooseImage({
    count: 3 - images.value.length,
    success: (res) => {
      images.value = [...images.value, ...res.tempFilePaths]
    }
  })
}

// 删除图片
const deleteImage = (index) => {
  images.value.splice(index, 1)
}

// 提交反馈
const handleSubmit = () => {
  if (!isValid.value) {
    uni.showToast({
      title: '请完善反馈内容',
      icon: 'none'
    })
    return
  }

  uni.showLoading({
    title: '提交中...'
  })

  // 模拟提交
  setTimeout(() => {
    uni.hideLoading()
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
  }, 1500)
}
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
    
    .input-area {
      width: 100%;
      height: 150px;
      padding: 12px;
      font-size: 14px;
      line-height: 1.5;
      border: 1px solid #eee;
      border-radius: 8px;
      background: #f5f7fa;
    }

    .word-count {
      position: absolute;
      right: 12px;
      bottom: 12px;
      font-size: 12px;
      color: #999;
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

    .image-item, .upload-btn {
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
    background: #3498db;
    color: #fff;
    border-radius: 24px;
    font-size: 16px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;

    &:disabled {
      background: #bdc3c7;
      opacity: 0.8;
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