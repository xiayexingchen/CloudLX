<template>
  <view class="search-container">
    <!-- 搜索框 -->
    <view class="search-header">
      <view class="search-box">
        <u-icon name="search" size="20" color="#999"></u-icon>
        <input class="search-input" type="text" v-model="searchKeyword" placeholder="请输入运单号" confirm-type="search"
          @confirm="handleSearch" @input="handleInput" />
        <u-icon v-if="searchKeyword" name="close" size="20" color="#999" @click="clearSearch"></u-icon>
      </view>
      <text class="confirm-btn" @click="handleSearch">搜索</text>
    </view>

    <!-- 搜索历史 -->
    <view class="search-history" v-if="!searchKeyword && searchHistory.length > 0">
      <view class="history-header">
        <text class="title">搜索历史</text>
        <u-icon name="trash" size="20" color="#999" @click="clearHistory"></u-icon>
      </view>
      <view class="history-list">
        <view class="history-item" v-for="(item, index) in searchHistory" :key="index" @click="searchWithHistory(item)">
          <u-icon name="clock" size="16" color="#999"></u-icon>
          <text>{{item}}</text>
        </view>
      </view>
    </view>

    <!-- 搜索结果 -->
    <view class="search-result" v-if="packageInfo.packageId">
      <view class="package-card">
        <view class="package-header">
          <text class="package-id">运单号：{{packageInfo.packageId}}</text>
          <text class="package-type">{{packageInfo.packageType}}</text>
        </view>
        <view class="package-info">
          <view class="info-item">
            <text class="label">存放位置：</text>
            <text class="value">{{packageInfo.packageCabinetId}}</text>
          </view>
          <view class="info-item">
            <text class="label">站点名称：</text>
            <text class="value">{{packageInfo.packageSiteName}}</text>
          </view>
          <!--          <view class="info-item">
            <text class="label">站点地址：</text>
            <text class="value">{{packageInfo.packageSiteaddress}}</text>
          </view> -->
          <view class="info-item">
            <text class="label">入柜时间：</text>
            <text class="value">{{formatDate(packageInfo.packageInTime)}}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 无结果提示 -->
    <view class="no-result" v-if="showNoResult">
      <u-empty mode="search" text="未找到相关包裹"></u-empty>
    </view>
  </view>
</template>

<script setup>
  import {
    ref,
    computed
  } from 'vue'
  import {
    searchPackageAPI
  } from '@/api/api-parcel'
  import dayjs from 'dayjs'

  // 搜索相关
  const searchKeyword = ref('')
  const searchHistory = ref([])
  const packageInfo = ref({})
  const showNoResult = ref(false)

  // 从本地存储获取搜索历史
  const loadSearchHistory = () => {
    const history = uni.getStorageSync('searchHistory')
    if (history) {
      searchHistory.value = JSON.parse(history)
    }
  }

  // 保存搜索历史
  const saveSearchHistory = (keyword) => {
    if (!keyword) return
    let history = searchHistory.value
    // 删除已存在的相同关键词
    history = history.filter(item => item !== keyword)
    // 将新关键词添加到开头
    history.unshift(keyword)
    // 最多保存10条历史记录
    history = history.slice(0, 10)
    searchHistory.value = history
    uni.setStorageSync('searchHistory', JSON.stringify(history))
  }

  // 清空搜索历史
  const clearHistory = () => {
    uni.showModal({
      title: '提示',
      content: '确定清空搜索历史吗？',
      success: (res) => {
        if (res.confirm) {
          searchHistory.value = []
          uni.removeStorageSync('searchHistory')
        }
      }
    })
  }

  // 使用历史记录搜索
  const searchWithHistory = (keyword) => {
    searchKeyword.value = keyword
    handleSearch()
  }

  // 清空搜索框
  const clearSearch = () => {
    searchKeyword.value = ''
    packageInfo.value = {}
    showNoResult.value = false
  }

  // 处理搜索
  const handleSearch = async () => {
    if (!searchKeyword.value.trim()) {
      uni.showToast({
        title: '请输入运单号',
        icon: 'none'
      })
      return
    }

    try {
      uni.showLoading({
        title: '搜索中...'
      })

      const res = await searchPackageAPI(searchKeyword.value)

      if (res.code === 22021) {
        packageInfo.value = res.data
        showNoResult.value = false
        saveSearchHistory(searchKeyword.value)
      } else {
        packageInfo.value = {}
        showNoResult.value = true
      }
    } catch (error) {
      uni.showToast({
        title: '搜索失败',
        icon: 'none'
      })
    } finally {
      uni.hideLoading()
    }
  }

  // 返回上一页
  const goBack = () => {
    uni.navigateBack()
  }

  // 格式化日期
  const formatDate = (date) => {
    return dayjs(date).format('YYYY-MM-DD HH:mm')
  }

  // 页面加载时获取搜索历史
  loadSearchHistory()
</script>

<style lang="scss">
  .search-container {
    min-height: 100vh;
    background-color: #f8f8f8;
    padding-bottom: 40rpx;
  }

  .search-header {
    display: flex;
    align-items: center;
    padding: 20rpx;
    background-color: #fff;
    position: sticky;
    top: 0;
    z-index: 100;

    .search-box {
      flex: 1;
      display: flex;
      align-items: center;
      background-color: #f5f5f5;
      border-radius: 32rpx;
      padding: 0 20rpx;
      height: 64rpx;
      margin-right: 20rpx;

      .search-input {
        flex: 1;
        height: 64rpx;
        margin: 0 20rpx;
        font-size: 28rpx;
      }
    }

    .confirm-btn {
      font-size: 28rpx;
      color: #333;
    }
  }

  .search-history {
    background-color: #fff;
    margin-top: 20rpx;
    padding: 20rpx;

    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;

      .title {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
      }
    }

    .history-list {
      display: flex;
      flex-wrap: wrap;
      gap: 20rpx;

      .history-item {
        display: flex;
        align-items: center;
        background-color: #f5f5f5;
        padding: 12rpx 24rpx;
        border-radius: 32rpx;
        font-size: 24rpx;
        color: #666;

        .u-icon {
          margin-right: 8rpx;
        }
      }
    }
  }

  .search-result {
    margin-top: 20rpx;
    padding: 0 20rpx;

    .package-card {
      background-color: #fff;
      border-radius: 12rpx;
      padding: 20rpx;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);

      .package-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20rpx;
        padding-bottom: 20rpx;
        border-bottom: 1px solid #eee;

        .package-id {
          font-size: 28rpx;
          color: #333;
          font-weight: 500;
        }

        .package-type {
          font-size: 24rpx;
          color: #2b85e4;
          background-color: #ecf5ff;
          padding: 4rpx 16rpx;
          border-radius: 24rpx;
        }
      }

      .package-info {
        .info-item {
          display: flex;
          margin-bottom: 16rpx;
          font-size: 26rpx;

          &:last-child {
            margin-bottom: 0;
          }

          .label {
            color: #666;
            width: 140rpx;
            flex-shrink: 0;
          }

          .value {
            color: #333;
            flex: 1;
          }
        }
      }
    }
  }

  .no-result {
    margin-top: 200rpx;
  }
</style>