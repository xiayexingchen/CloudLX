<template>
  <view class="search-container">
    <!-- 搜索头部 -->
    <view class="search-header">
      <view class="search-box">
        <u-icon name="search" size="20" color="#666"></u-icon>
        <input class="search-input" v-model="searchKeyword" placeholder="输入包裹关键词搜索(包裹编号/订单号等)"
          @confirm="handleSearch" />
        <u-icon v-if="searchKeyword" name="close" size="20" color="#666" @click="clearSearch"></u-icon>
      </view>
      <text class="confirm-btn" @click="handleSearch">搜索</text>
    </view>

    <!-- 搜索历史 -->
    <view class="search-history" v-if="!searchKeyword && searchHistory.length > 0">
      <view class="history-header">
        <text class="title">搜索历史</text>
        <u-icon name="trash" size="20" color="#666" @click="clearHistory"></u-icon>
      </view>
      <view class="history-list">
        <view class="history-item" v-for="(item, index) in searchHistory" :key="index" @click="searchWithHistory(item)">
          <u-icon name="clock" size="14" color="#666"></u-icon>
          <text>{{ item }}</text>
        </view>
      </view>
    </view>

    <!-- 搜索结果 -->
    <scroll-view scroll-y class="search-results" v-if="searchKeyword">
      <view v-if="searchResults.length === 0 && showNoResult" class="empty-tip">
        <u-empty mode="search" text="暂无相关包裹"></u-empty>
      </view>

      <view v-else class="result-list">
        <view class="result-item" v-for="(item, index) in searchResults" :key="index" @click="handlePackageClick(item)">
          <view class="item-header">
            <image class="type-icon" :src="getPackageTypeImage(item.packageType)" mode="aspectFit" />
            <view class="package-info">
              <text class="package-id">{{ item.packageOrderId || item.packageCabinetId }}</text>
              <text class="package-type">{{ item.packageType }}</text>
            </view>
            <view :class="['status-tag', getStatusClass(item.packageStatus)]">
              {{ item.packageStatus }}
            </view>
          </view>

          <view class="item-content">
            <view class="info-row">
              <u-icon name="map" size="14" color="#64748B"></u-icon>
              <text>{{ item.packageSiteName || '暂无地址' }}</text>
            </view>
            <view class="info-row">
              <u-icon name="clock" size="14" color="#64748B"></u-icon>
              <text>{{ formatDate(item.packageInTime || item.packageOrderCreatedTime) }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
  import {
    ref,
    onMounted,
    getCurrentInstance
  } from 'vue';
  import dayjs from 'dayjs';

  const searchKeyword = ref('');
  const searchHistory = ref([]);
  const searchResults = ref([]);
  const showNoResult = ref(false);
  const allPackages = ref({});

  // 格式化日期
  const formatDate = (date) => {
    return dayjs(date).format('YYYY-MM-DD HH:mm');
  };

  // 获取包裹类型图标
  const getPackageTypeImage = (type) => {
    const imageMap = {
      '外卖': '/static/food.png',
      '快递': '/static/parcel.png',
      '鲜花': '/static/flower.png',
      '蛋糕': '/static/cake.png',
      'other': '/static/other.png'
    };
    return imageMap[type] || imageMap.other;
  };

  // 获取状态样式类
  const getStatusClass = (status) => {
    const statusMap = {
      '待取件': 'pending',
      '配送中': 'delivering',
      '已签收': 'completed',
      '已超时': 'timeout'
    };
    return statusMap[status] || '';
  };

  // 加载搜索历史
  const loadSearchHistory = () => {
    const history = uni.getStorageSync('searchHistory');
    if (history) {
      searchHistory.value = JSON.parse(history);
    }
  };

  // 保存搜索历史
  const saveSearchHistory = (keyword) => {
    let history = searchHistory.value;
    // 去重
    if (!history.includes(keyword)) {
      history.unshift(keyword);
      // 限制历史记录数量
      if (history.length > 10) {
        history.pop();
      }
      searchHistory.value = history;
      uni.setStorageSync('searchHistory', JSON.stringify(history));
    }
  };

  // 清空历史记录
  const clearHistory = () => {
    uni.showModal({
      title: '提示',
      content: '确定要清空搜索历史吗？',
      success: (res) => {
        if (res.confirm) {
          searchHistory.value = [];
          uni.removeStorageSync('searchHistory');
        }
      }
    });
  };

  // 使用历史记录搜索
  const searchWithHistory = (keyword) => {
    searchKeyword.value = keyword;
    handleSearch();
  };

  // 清空搜索
  const clearSearch = () => {
    searchKeyword.value = '';
    searchResults.value = [];
    showNoResult.value = false;
  };
  // 处理搜索
  const handleSearch = () => {
    if (!searchKeyword.value.trim()) {
      uni.showToast({
        title: '请输入搜索关键词',
        icon: 'none'
      });
      return;
    }

    // 调试日志：打印搜索关键词
    console.log('搜索关键词:', searchKeyword.value);

    // 调试日志：打印所有包裹数据
    console.log('所有包裹数据:', allPackages.value);

    const searchKey = searchKeyword.value.toLowerCase();
    const allPackagesList = [
      ...allPackages.value.pendingPackages || [],
      ...allPackages.value.deliveringPackages || [],
      ...allPackages.value.completedPackages || [],
      ...allPackages.value.timeoutPackages || []
    ];

    // 调试日志：打印合并后的包裹列表
    console.log('合并后的包裹列表:', allPackagesList);

    searchResults.value = allPackagesList.filter(pkg => {
      // 调试日志：打印每个包裹的搜索字段
      console.log('正在检查包裹:', {
        id: pkg.packageId,
        orderId: pkg.packageOrderId,
        cabinetId: pkg.packageCabinetId,
        type: pkg.packageType,
        siteName: pkg.packageSiteName
      });

      const result = (
        pkg.packageId?.toLowerCase().includes(searchKey) ||
        pkg.packageOrderId?.toLowerCase().includes(searchKey) ||
        pkg.packageCabinetId?.toLowerCase().includes(searchKey) ||
        pkg.packageType?.toLowerCase().includes(searchKey) ||
        pkg.packageSiteName?.toLowerCase().includes(searchKey)
      );

      // 调试日志：打印匹配结果
      console.log('是否匹配:', result);
      return result;
    });

    // 调试日志：打印搜索结果
    console.log('搜索结果:', searchResults.value);

    showNoResult.value = searchResults.value.length === 0;
    if (searchResults.value.length > 0) {
      saveSearchHistory(searchKeyword.value);
    }
  };

  // 处理包裹点击
  const handlePackageClick = (pkg) => {
    // 判断包裹属于哪个列表
    let listType;
    if (allPackages.value.pendingPackages?.some(p => p.packageId === pkg.packageId)) {
      listType = 'pending';
    } else if (allPackages.value.deliveringPackages?.some(p => p.packageId === pkg.packageId)) {
      listType = 'delivering';
    } else if (allPackages.value.completedPackages?.some(p => p.packageId === pkg.packageId)) {
      listType = 'completed';
    } else if (allPackages.value.timeoutPackages?.some(p => p.packageId === pkg.packageId)) {
      listType = 'timeout';
    }

    const listRouteMap = {
      pending: {
        url: '/pages/package/pendingPackage',
        eventName: 'pendingData',
        getData: (pkg) => ({
          packageId: pkg.packageId,
          address: pkg.packageSiteName,
          locker: pkg.packageCabinetId,
          itemType: pkg.packageType,
          status: pkg.packageStatus,
          entryTime: pkg.packageInTime,
          latitude: pkg.latitude,
          longitude: pkg.longitude
        })
      },
      delivering: {
        url: '/pages/package/deliveringPackage',
        eventName: 'deliveryData',
        getData: (pkg) => ({
          robotId: pkg.robotId,
          deliveryTime: pkg.packageEstimatedCompletedTime,
          packageType: pkg.packageType,
          orderId: pkg.packageOrderId,
          status: pkg.packageStatus,
          address: pkg.packageAddress,
          latitude: pkg.latitude,
          longitude: pkg.longitude
        })
      },
      completed: {
        url: '/pages/package/completedPackage',
        eventName: 'completedData',
        getData: (pkg) => ({
          orderId: pkg.packageOrderId,
          packageId: pkg.packageId,
          packageType: pkg.packageType,
          packageAddress: pkg.packageAddress,
          packageCompletedTime: pkg.packageCompletedTime,
          packageOrderCreatedTime: pkg.packageOrderCreatedTime,
          contactName: pkg.contactName,
          contactPhone: pkg.contactPhone,
          orderTime: pkg.orderTime,
          receivedTime: pkg.receivedTime,
          payment: pkg.payment
        })
      },
      timeout: {
        url: '/pages/package/timeoutPackage',
        eventName: 'timeoutData',
        getData: (pkg) => ({
          packageId: pkg.packageId,
          itemType: pkg.packageType,
          entryTime: pkg.packageInTime,
          timeoutDuration: `超时${pkg.timeoutDuration}`,
          adminName: pkg.adminName,
          adminPhone: pkg.adminPhone
        })
      }
    };

    const routeInfo = listRouteMap[listType];
    if (routeInfo) {
      uni.navigateTo({
        url: `${routeInfo.url}?id=${pkg.id}`,
        success: function(res) {
          res.eventChannel.emit(routeInfo.eventName, routeInfo.getData(pkg));
        }
      });
    }
  };


  onMounted(() => {
    loadSearchHistory();
    const instance = getCurrentInstance().proxy
    const eventChannel = instance.getOpenerEventChannel();
    eventChannel.on('acceptPackageData', (data) => {
      allPackages.value = data;
    });
  });
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

  .search-results {
    height: calc(100vh - 140rpx);
    padding: 0 20rpx;
  }

  .result-list {
    padding: 20rpx 0;
  }

  .result-item {
    background: #FFFFFF;
    border-radius: 12rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

    .item-header {
      display: flex;
      align-items: center;
      margin-bottom: 16rpx;

      .type-icon {
        width: 40rpx;
        height: 40rpx;
        margin-right: 16rpx;
      }

      .package-info {
        flex: 1;
        display: flex;
        flex-direction: column;

        .package-id {
          font-size: 28rpx;
          color: #333;
          font-weight: 500;
          margin-bottom: 4rpx;
        }

        .package-type {
          font-size: 24rpx;
          color: #666;
        }
      }

      .status-tag {
        padding: 4rpx 16rpx;
        border-radius: 20rpx;
        font-size: 24rpx;

        &.pending {
          background: #E0F2FE;
          color: #0284C7;
        }

        &.delivering {
          background: #F0FDF4;
          color: #16A34A;
        }

        &.completed {
          background: #F1F5F9;
          color: #64748B;
        }

        &.timeout {
          background: #FEF2F2;
          color: #DC2626;
        }
      }
    }

    .item-content {
      .info-row {
        display: flex;
        align-items: center;
        font-size: 26rpx;
        color: #64748B;
        margin-bottom: 8rpx;

        &:last-child {
          margin-bottom: 0;
        }

        .u-icon {
          margin-right: 8rpx;
        }

        text {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }

  .empty-tip {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100rpx 0;

    .u-empty {
      margin-bottom: 20rpx;
    }

    text {
      font-size: 28rpx;
      color: #999;
    }
  }

  // 点击效果
  .result-item:active {
    transform: scale(0.98);
    transition: transform 0.2s ease;
  }

  // 搜索框动画
  .search-box {
    transition: all 0.3s ease;

    &:focus-within {
      box-shadow: 0 0 0 2rpx rgba(59, 130, 246, 0.1);
    }
  }

  // 历史记录项动画
  .history-item {
    transition: all 0.2s ease;

    &:active {
      transform: scale(0.95);
      opacity: 0.8;
    }
  }

  // 加载动画
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20rpx);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .result-item {
    animation: fadeIn 0.3s ease;
  }

  // 滚动条样式
  ::-webkit-scrollbar {
    width: 6rpx;
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3rpx;
  }
</style>