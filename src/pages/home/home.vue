<template>
  <view class="home-container">
    <!-- 搜索框 -->
    <view class="search-section" @click="toSearch">
      <u-search placeholder="搜索包裹" :clearabled="true" shape="round" :background-color="'var(--bg-primary)'"
        :border-color="'var(--primary-light)'" :input-style="{color: 'var(--text-primary)'}" />
    </view>
    <!-- v-model="searchText" -->


    <!-- 轮播图部分 -->
    <view class="swiper-section">
      <swiper class="swiper" circular autoplay interval="3000" duration="500" indicator-dots
        :indicator-active-color="'var(--primary-color)'" @change="handleSwiperChange">
        <swiper-item v-for="(item, index) in activityList" :key="item.activityId" @click="handleActivityClick(item)">
          <image :src="getActivityImage(item.imageData)" mode="aspectFill" class="swiper-image" />
        </swiper-item>
      </swiper>
      <!-- 可选：添加活动标题显示 -->
      <view class="activity-title" v-if="activityList.length > 0">
        {{ activityList[currentSwiperIndex]?.activityName }}
      </view>
    </view>

    <!-- 功能按钮区 -->
    <view class="action-section">
      <view class="action-button add" @click="toPackageAdd">
        <u-icon name="plus" color="#FFFFFF" size="24"></u-icon>
        <text>新增包裹</text>
      </view>
      <view class="action-button code" @click="toIdcard">
        <u-icon name="account" color="#FFFFFF" size="24"></u-icon>
        <text>身份码</text>
      </view>
    </view>

    <!-- 包裹列表区域 -->
    <view class="package-section">
      <u-tabs :list="tabList" :current="currentTab" @change="changeTab" :activeStyle="{
          color: '#3B82F6',
          fontWeight: 'bold'
        }" :inactiveStyle="{
          color: '#64748B'
        }" itemStyle="padding-left: 15px; padding-right: 15px;height: 44px;" lineColor="#3B82F6" :lineWidth="20">
      </u-tabs>

      <scroll-view scroll-y class="package-list" @scrolltolower="loadMoreData">
        <view class="package-card" v-for="(item, index) in currentPackageList" :key="item.id"
          @click="handlePackageClick(item)">
          <!-- 包裹基本信息 -->
          <!--  包裹基本信息 - 根据不同状态显示不同内容 -->
          <view class="card-header">
            <image class="type-icon" :src="getPackageTypeImage(item.packageType)" mode="aspectFit" />
            <!-- 1. 待取包裹 -->
            <template v-if="currentTab === 0">
              <view class="package-info">
                <text class="package-type"> 柜号：{{ item.packageCabinetId }}</text>
              </view>
            </template>
            <!-- 2. 有订单号包裹 -->
            <template v-if="currentTab == 1">
              <view class="package-info">
                <text class="package-type">{{ item.packageStatus }}</text>
                <text>{{" "}}</text> <text>{{" "}}</text> <text>{{" "}}</text>
                <text class="tracking-number">
                  {{item.packageOrderId }}</text>
              </view>
            </template>
            <template v-if="currentTab == 2">
              <view class="package-info">
                <text class="package-type">已签收</text>
                <text>{{" "}}</text> <text>{{" "}}</text> <text>{{" "}}</text>
                <text class="tracking-number">
                  {{item.packageOrderId }}</text>
              </view>
            </template>
            <template v-if="currentTab == 3">
              <view class="package-info">
                <text class="package-type">已超时</text>
                <text>{{" "}}</text> <text>{{" "}}</text> <text>{{" "}}</text>
                <text class="tracking-number">
                  {{item.packageOrderId }}</text>
              </view>
            </template>
            <view class="status-tag" :class="getStatusClass(item.packageStatus)">
              {{ item.packageStatus }}
            </view>
          </view>

          <!-- 包裹详情 -->
          <!-- 包裹详情 - 根据不同状态显示不同内容 -->
          <view class="card-content">
            <!-- 1. 待取包裹 -->
            <template v-if="currentTab === 0">
              <view class="info-item">
                <u-icon name="car" size="20" color="#64748B"></u-icon>
                <text>包裹类型：{{ item.packageType }}</text>
              </view>
              <view class="info-item">
                <u-icon name="map" size="20" color="#64748B"></u-icon>
                <text>包裹位置：{{ `${item.packageSiteName} ` }}</text>

              </view>
              <view class="info-item">
                <u-icon name="clock" size="20" color="#64748B"></u-icon>
                <text>入库时间：{{ item.packageInTime }}</text>
              </view>
            </template>

            <!-- 2. 配送中包裹 -->
            <template v-if="currentTab === 1">
              <!--              <view class="info-item delivery">
                <u-icon name="car" size="24" color="#2196F3"></u-icon>
                <text class="delivering">配送中</text>
              </view> -->
              <view class="info-item">
                <u-icon name="car" size="20" color="#64748B"></u-icon>
                <text>包裹类型：{{ item.packageType }}</text>
              </view>
              <view class="info-item">
                <u-icon name="clock" size="20" color="#64748B"></u-icon>
                <text>预计送达时间：{{ item.packageEstimatedCompletedTime }}</text>
              </view>
              <view class="info-item">
                <u-icon name="map-fill" size="20" color="#64748B"></u-icon>
                <text>下单时间：{{ item.packageOrderCreatedTime }}</text>
              </view>
            </template>

            <!-- 3. 已签收包裹 -->
            <template v-if="currentTab === 2">
              <!--              <view class="info-item success">
                <u-icon name="checkmark-circle" size="24" color="#19be6b"></u-icon>
                <text class="signed">已签收</text>
              </view> -->
              <view class="info-item">
                <u-icon name="car" size="20" color="#64748B"></u-icon>
                <text>包裹类型：{{ item.packageType }}</text>
              </view>
              <view class="info-item">
                <u-icon name="info-circle" size="20" color="#64748B"></u-icon>
                <text>{{ item.packageDeliveryType === '机器人配送' ? '已从机器人处取出' : '已从柜子中取出' }}</text>
              </view>
              <!--              <view class="info-item">
                <u-icon name="map-fill" size="16" color="#64748B"></u-icon>
                <text>已送至：{{ item.deliveryAddress }}</text>
              </view> -->
              <view class="info-item">
                <u-icon name="clock" size="20" color="#64748B"></u-icon>
                <text>签收时间：{{ item.packageCompletedTime }}</text>
              </view>
            </template>

            <!-- 4. 已超时包裹 -->
            <template v-if="currentTab === 3">
              <!--            <view class="info-item timeout">
                <u-icon name="warning" size="24" color="#64748B"></u-icon>
                <text class="timeout-text">已超时</text>
              </view> -->
              <view class="info-item">
                <u-icon name="clock" size="20" color="#64748B"></u-icon>
                <text>入库时间：{{ item.packageInTime }}</text>
              </view>
              <view class="info-item warning">
                <u-icon name="info-circle" size="20" color="#64748B"></u-icon>
                <text>你的包裹已超时，请及时联系管理员</text>
              </view>
            </template>
          </view>

          <!-- 操作按钮 -->
          <view class="card-actions" @click.stop>
            <!-- 待取包裹 -->
            <template v-if="currentTab === 0">
              <button class="action-btn primary" @click="toDeliver(item)" :disabled="isPackageDelivering(item)"
                :class="{ 'disabled': isPackageDelivering(item) }">
                <u-icon name="arrow-right" size="20" color="#FFFFFF"></u-icon>
                <text>{{ isPackageDelivering(item) ? '待发货' : '机器人配送' }}</text>
              </button>
            </template>

            <!-- 正在配送 - 添加退单按钮 -->
            <template v-else-if="currentTab === 1">
              <template v-if="item.packageStatus === '待发货'">
                <button class="action-btn primary" @click="cancelOrder(item)">
                  <u-icon name="close" size="20" color="#FFFFFF"></u-icon>
                  <text>退单</text>
                </button>
              </template>
              <template v-else-if="item.packageStatus === '已完成'">
                <button class="action-btn primary" @click="confirmDelivery(item)">
                  <u-icon name="checkmark" size="20" color="#FFFFFF"></u-icon>
                  <text>确认签收</text>
                </button>
              </template>
            </template>

            <!-- 今日签收 -->
            <template v-else-if="currentTab === 2">
              <view class="button-group">
                <!-- 只有存在 orderID 时才显示评价相关按钮 -->
                <template v-if="item.packageOrderId">
                  <!-- 已评价状态 -->
                  <button v-if="isPackageReviewed(item.packageOrderId)" class="action-btn disabled" disabled>
                    <u-icon name="checkmark-circle" size="20" color="#FFFFFF"></u-icon>
                    <text>已评价</text>
                  </button>
                  <!-- 未评价状态 -->
                  <button v-else class="action-btn primary" @click="toReviewPackage(item)">
                    <u-icon name="star" size="20" color="#FFFFFF"></u-icon>
                    <text>评价</text>
                  </button>
                </template>

                <!-- <button class="action-btn secondary" @click="hidePackage(index)">
      <u-icon name="eye-off" size="20" color="#64748B"></u-icon>
      <text>隐藏</text>
    </button> -->
              </view>
            </template>

            <!-- 超时包裹 -->
            <template v-else-if="currentTab === 3">
              <button class="action-btn primary" @click="contactAdmin(item)">
                <u-icon name="phone" size="16" color="#FFFFFF"></u-icon>
                <text>联系管理员</text>
              </button>
            </template>
          </view>
        </view>

        <!-- 无数据提示 -->
        <view v-if="currentPackageList.length === 0" class="empty-tip">
          <u-empty mode="data" text="暂无包裹"></u-empty>

        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
  import {
    ref,
    onMounted,
    computed,
    onBeforeUnmount,
  } from 'vue';
  import {
    fetchPackageDataAPI
  } from '../../api/api-parcel';
  import {
    fetchActivityAPI
  } from '../../api/api-activity';
  import {
    cancelOrderAPI,
    confirmDeliveryAPI,
    fetchReviewRecordAPI
  } from '../../api/api-order';
  import {
    onShow,
    onHide
  } from '@dcloudio/uni-app'
  // 轮询间隔（例如每30秒）
  const POLL_INTERVAL = 10000;
  let pollTimer = null;
  let isPageVisible = ref(false); // 添加页面可见性标志

  const indicatorDots = ref(true);
  const indicatorColor = ref("#FFF");
  const autoplay = ref(true);
  const interval = ref(2000);
  const duration = ref(500);
  // 活动数据
  const activityList = ref([]);
  const currentSwiperIndex = ref(0);
  //const searchText = ref('');
  // 轮询函数
  // 轮询函数
  // 轮询函数
  const startPolling = () => {
    // 确保先停止已存在的轮询
    stopPolling();
    console.log('开始轮询服务...');
    isPageVisible.value = true;
    pollTimer = setInterval(async () => {
      // 检查页面是否可见
      if (!isPageVisible.value) {
        console.log('页面不可见，跳过轮询');
        return;
      }
      console.log(`执行轮询检查 - ${new Date().toLocaleTimeString()}`);

      // 先检查是否有新内容
      const hasNew = await checkNewContent();

      // 只有在有新内容时才更新数据
      if (hasNew) {
        console.log('检测到新内容，更新数据...');
        await Promise.all([
          fetchPackageData(),
          fetchActivityData()
        ]);
      } else {
        console.log('没有检测到新内容，跳过更新');
      }
    }, POLL_INTERVAL);
  };

  // 检查新内容的具体实现
  const checkNewContent = async () => {
    try {
      console.log('开始检查新内容...');
      const [packageRes, activityRes] = await Promise.all([
        fetchPackageDataAPI(false),
        fetchActivityAPI(false)
      ]);

      const hasNewPackagesResult = hasNewPackages(packageRes.data);
      const hasNewActivitiesResult = hasNewActivities(activityRes.data);

      console.log('检查结果:', {
        hasNewPackages: hasNewPackagesResult,
        hasNewActivities: hasNewActivitiesResult,
        currentPackages: {
          pending: allPackages.value.pendingPackageList?.length || 0,
          delivering: allPackages.value.deliveringPackageList?.length || 0,
          completed: allPackages.value.completedPackageList?.length || 0,
          timeout: allPackages.value.timeoutPackageList?.length || 0
        },
        newPackages: {
          pending: packageRes.data.pendingPackageList?.length || 0,
          delivering: packageRes.data.deliveringPackageList?.length || 0,
          completed: packageRes.data.completedPackageList?.length || 0,
          timeout: packageRes.data.timeoutPackageList?.length || 0
        }
      });

      // 检查是否有新包裹
      if (hasNewPackagesResult) {
        console.log('发现新包裹！');
        uni.showToast({
          title: '您有新的包裹',
          icon: 'none',
          duration: 2000
        });
      }

      // 检查是否有新活动
      if (hasNewActivitiesResult) {
        console.log('发现新活动！');
        uni.showToast({
          title: '有新活动发布',
          icon: 'none',
          duration: 2000
        });
      }

      return hasNewPackagesResult || hasNewActivitiesResult;
    } catch (error) {
      console.error('检查新内容失败:', error);
      return false;
    }
  };
  // 判断是否有新包裹
  const hasNewPackages = (newData) => {
    const oldPackages = allPackages.value;
    // 比较新旧包裹数量
    const oldCount = {
      pending: oldPackages.pendingPackageList?.length || 0,
      delivering: oldPackages.deliveringPackageList?.length || 0,
      completed: oldPackages.completedPackageList?.length || 0,
      timeout: oldPackages.timeoutPackageList?.length || 0
    };

    const newCount = {
      pending: newData.pendingPackageList?.length || 0,
      delivering: newData.deliveringPackageList?.length || 0,
      completed: newData.completedPackageList?.length || 0,
      timeout: newData.timeoutPackageList?.length || 0
    };

    // 如果任何一个类别的数量增加，说明有新包裹
    return Object.keys(oldCount).some(key => newCount[key] > oldCount[key]);
  };

  // 判断是否有新活动
  const hasNewActivities = (newData) => {
    const oldActivities = activityList.value;
    // 检查是否有新增的活动
    return newData.length > oldActivities.length;
  };
  // 停止轮询时也添加日志
  // 修改停止轮询函数
  const stopPolling = () => {
    console.log('停止轮询服务...');
    isPageVisible.value = false;

    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
      console.log('轮询定时器已清除');
    }
  };





  // 获取活动图片完整路径
  const getActivityImage = (imageData) => {
    if (!imageData) return '/static/loginLogo.png'; // 默认图片
    return 'http://120.46.199.126:8080' + imageData; // 拼接完整的图片URL
  };
  // 处理轮播图切换
  const handleSwiperChange = (e) => {
    currentSwiperIndex.value = e.detail.current;
  };
  // 处理活动点击
  const handleActivityClick = (activity) => {
    if (activity.status === '进行中') {
      uni.navigateTo({
        url: `/pages/activity/activity?id=${activity.activityId}`,
        success: (res) => {
          // 传递数据给详情页面
          res.eventChannel.emit('activityData', {
            data: activity
          })
        }
      });
    } else {
      uni.showToast({
        title: '活动未开始',
        icon: 'none'
      });
    }
  };
  // 添加退单方法
  const cancelOrder = async (parcel) => {
    try {
      uni.showModal({
        title: '确认退单',
        content: '确定要取消该订单吗？',
        success: async (res) => {
          if (res.confirm) {
            console.log("parcel.packageId" + parcel.packageOrderId)
            const response = await cancelOrderAPI(parcel.packageOrderId);
            if (response.code === 24031) {
              uni.showToast({
                title: '退单成功',
                icon: 'success'
              });
              // 刷新包裹列表
              fetchPackageData();
            } else {
              throw new Error(response.msg || '退单失败');
            }
          }
        }
      });
    } catch (error) {
      console.error('退单失败:', error);
      uni.showToast({
        title: error.message || '退单失败',
        icon: 'none'
      });
    }
  };
  // 添加确认签收方法
  const confirmDelivery = async (parcel) => {
    try {
      uni.showModal({
        title: '确认签收',
        content: '确定要签收该包裹吗？',
        success: async (res) => {
          if (res.confirm) {
            const response = await confirmDeliveryAPI(parcel.packageOrderId);
            if (response.code === 24051) {
              uni.showToast({
                title: '签收成功',
                icon: 'success'
              });
              // 刷新包裹列表
              fetchPackageData();
            } else {
              throw new Error(response.msg || '签收失败');
            }
          }
        }
      });
    } catch (error) {
      console.error('签收失败:', error);
      uni.showToast({
        title: error.message || '签收失败',
        icon: 'none'
      });
    }
  };
  // 获取活动数据
  const fetchActivityData = async () => {
    try {
      const res = await fetchActivityAPI();
      if (res.code === 26011) {
        // 过滤掉没有图片的活动
        activityList.value = res.data.filter(item => item.imageData);
      } else {
        throw new Error(res.msg || '获取活动数据失败');
      }
    } catch (error) {
      console.error('获取活动数据失败:', error);
      uni.showToast({
        title: error.message || '获取活动数据失败',
        icon: 'none'
      });
    }
  };

  function toSearch() {
    uni.navigateTo({
      url: "/pages/search/search",
      success: function(res) {
        // 通过eventChannel向搜索页面传递数据
        res.eventChannel.emit('acceptPackageData', {
          pendingPackages: allPackages.value.pendingPackageList || [],
          deliveringPackages: allPackages.value.deliveringPackageList || [],
          completedPackages: allPackages.value.completedPackageList || [],
          timeoutPackages: allPackages.value.timeoutPackageList || []
        });
      }
    });
  }
  const isPackageDelivering = (parcel) => {
    // 检查包裹是否在配送列表中
    return allPackages.value.deliveringPackageList.some(
      p => p.packageId === parcel.packageId && p.packageStatus === '待发货'
    );
  };
  // Tab 列表和当前选择的 tab
  const tabList = ref([{
      name: '待取包裹',
      id: 0
    },
    {
      name: '正在配送',
      id: 1
    },
    {
      name: '近日签收',
      id: 2
    },
    {
      name: '超时包裹',
      id: 3
    }
  ]);
  const currentTab = ref(0); // 当前选中的 tab id
  // 包裹数据存储
  const allPackages = ref({
    completedPackageList: [],
    timeoutPackageList: [],
    pendingPackageList: [],
    deliveringPackageList: []
  });
  // 计算当前显示的包裹列表
  const currentPackageList = computed(() => {
    switch (currentTab.value) {
      case 0:
        return allPackages.value.pendingPackageList || [];
      case 1:
        return allPackages.value.deliveringPackageList || [];
      case 2:
        return allPackages.value.completedPackageList || [];
      case 3:
        return allPackages.value.timeoutPackageList || [];
      default:
        return [];
    }
  });

  // 获取包裹类型对应的图片
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

  // 获取包裹信息
  const fetchPackageData = async (showLoading = true) => {
    try {
      const response = await fetchPackageDataAPI(showLoading);
      if (response.code === 22011) {
        // 添加日期格式化函数
        const parseDate = (dateStr) => {
          if (!dateStr) return 0;
          // 将 "2024-12-18 11:47:15" 转换为 "2024-12-18T11:47:15"
          return new Date(dateStr.replace(' ', 'T')).getTime();
        };

        // 在更新 allPackages 之前添加排序逻辑
        const sortedData = {
          ...response.data,
          // 待取包裹按 packageInTime 倒序
          pendingPackageList: response.data.pendingPackageList?.sort((a, b) =>
            parseDate(b.packageInTime) - parseDate(a.packageInTime)
          ),
          // 超时包裹按 packageInTime 倒序
          timeoutPackageList: response.data.timeoutPackageList?.sort((a, b) =>
            parseDate(b.packageInTime) - parseDate(a.packageInTime)
          ),
          // 配送中包裹按 packageOrderCreatedTime 倒序
          deliveringPackageList: response.data.deliveringPackageList?.sort((a, b) =>
            parseDate(b.packageOrderCreatedTime) - parseDate(a.packageOrderCreatedTime)
          ),
          // 已签收包裹按 packageCompletedTime 倒序
          completedPackageList: response.data.completedPackageList?.sort((a, b) =>
            parseDate(b.packageCompletedTime) - parseDate(a.packageCompletedTime)
          )
        };

        allPackages.value = sortedData;
        console.log(allPackages.value.pendingPackageList);
      }
    } catch (error) {
      console.error('获取包裹信息失败:', error);
      uni.showToast({
        title: '获取数据失败',
        icon: 'none'
      });
    }
  }
  // const fetchPackageData = async (showLoading = true) => {
  //   try {
  //     //const response = await fetchPackageDataAPI();
  //     const response = await fetchPackageDataAPI(showLoading);
  //   if (response.code === 22011) {
  //     // 在更新 allPackages 之前添加排序逻辑
  //     const sortedData = {
  //       ...response.data,
  //       // 待取包裹按 packageInTime 倒序
  //       pendingPackageList: response.data.pendingPackageList?.sort((a, b) => 
  //         new Date(b.packageInTime) - new Date(a.packageInTime)
  //       ),
  //       // 超时包裹按 packageInTime 倒序
  //       timeoutPackageList: response.data.timeoutPackageList?.sort((a, b) => 
  //         new Date(b.packageInTime) - new Date(a.packageInTime)
  //       ),
  //       // 配送中包裹按 packageOrderCreatedTime 倒序
  //       deliveringPackageList: response.data.deliveringPackageList?.sort((a, b) => 
  //         new Date(b.packageOrderCreatedTime) - new Date(a.packageOrderCreatedTime)
  //       ),
  //       // 已签收包裹按 packageCompletedTime 倒序
  //       completedPackageList: response.data.completedPackageList?.sort((a, b) => 
  //         new Date(b.packageCompletedTime) - new Date(a.packageCompletedTime)
  //       )
  //     };
  //     allPackages.value = sortedData;
  //     console.log(allPackages.value.pendingPackageList);
  //   }
  //   } catch (error) {
  //     console.error('获取包裹信息失败:', error);
  //     uni.showToast({
  //       title: '获取数据失败',
  //       icon: 'none'
  //     });
  //   }
  // }
  // 添加状态类名获取方法
  const getStatusClass = (status) => {
    const statusMap = {
      '待取件': 'pending',
      '配送中': 'delivering',
      '已签收': 'completed',
      '已超时': 'timeout'
    };
    return statusMap[status] || '';
  };

  // 处理包裹点击
  const handlePackageClick = (parcel) => {
    const routes = {
      0: {
        url: '/pages/package/pendingPackage',
        eventName: 'pendingData',
        getData: (parcel) => ({
          packageId: parcel.packageId,
          address: parcel.packageSiteName,
          locker: parcel.packageCabinetId,
          itemType: parcel.packageType,
          entryTime: parcel.packageInTime,
          latitude: parcel.latitude,
          longitude: parcel.longitude
        })
      },
      1: {
        url: '/pages/package/deliveringPackage',
        eventName: 'deliveryData',
        getData: (parcel) => ({
          robotId: parcel.robotId,
          deliveryTime: parcel.packageEstimatedCompletedTime,
          packageType: parcel.packageType,
          orderId: parcel.packageOrderId,
          address: parcel.packageAddress,
          latitude: parcel.latitude,
          longitude: parcel.longitude,
          status: parcel.packageStatus,
        })
      },
      2: {
        url: '/pages/package/completedPackage',
        eventName: 'completedData',
        getData: (parcel) => ({
          orderId: parcel.packageOrderId,
          packageId: parcel.packageId,
          packageType: parcel.packageType,
          packageAddress: parcel.packageAddress,
          packageCompletedTime: parcel.packageCompletedTime,
          packageOrderCreatedTime: parcel.packageOrderCreatedTime,
          contactName: parcel.contactName,
          contactPhone: parcel.contactPhone,
          orderTime: parcel.orderTime,
          receivedTime: parcel.receivedTime,
          payment: parcel.payment
        })
      },
      3: {
        url: '/pages/package/timeoutPackage',
        eventName: 'timeoutData',
        getData: (parcel) => ({
          packageId: parcel.packageId,
          itemType: parcel.packageType,
          entryTime: parcel.packageInTime,
          timeoutDuration: `超时${parcel.timeoutDuration}`,
          adminName: parcel.adminName,
          adminPhone: parcel.adminPhone
        })
      }
    };

    const routeConfig = routes[currentTab.value];
    if (!routeConfig) return;

    uni.navigateTo({
      url: `${routeConfig.url}?id=${parcel.id}`,
      success: function(res) {
        console.log("parcel:" + parcel);
        res.eventChannel.emit(routeConfig.eventName, routeConfig.getData(parcel));
      },
      fail: function(err) {
        console.error('页面跳转失败:', err);
        uni.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  };
  // 包裹操作函数
  const toDeliver = (parcel) => {
    // 如果包裹正在配送中，则不执行操作
    if (isPackageDelivering(parcel)) {
      uni.showToast({
        title: '该包裹正在等待发货',
        icon: 'none'
      });
      return;
    }
    // 使用 uni.navigateTo 跳转到目标页面，并传递 parcel.id 作为 URL 参数
    uni.navigateTo({
      url: `/pages/delivery-detail/delivery-detail?parcelId=${parcel.id}`,
      success: (res) => {
        // 使用 eventChannel 传递包裹信息到目标页面
        res.eventChannel.emit('parcelData', {
          packageId: parcel.packageId,
          address: parcel.packageSiteaddress,
          locker: parcel.packageCabinetId,
          itemType: parcel.packageType,
          entryTime: parcel.packageInTime,
          siteName: parcel.packageSiteName
        });
      },
      fail: (err) => {
        console.error('页面跳转失败:', err);
        uni.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  };

  // 已评价订单ID列表
  const reviewedOrderIds = ref([]);

  // 获取已评价订单列表
  const fetchReviewedOrders = async () => {
    try {
      const res = await fetchReviewRecordAPI();
      if (res.code === 24091) {
        reviewedOrderIds.value = res.data;
      }
    } catch (error) {
      console.error('获取评价记录失败:', error);
    }
  };

  // 检查包裹是否已评价
  const isPackageReviewed = (orderId) => {
    return reviewedOrderIds.value.includes(orderId);
  };

  // 跳转到评价页面
  const toReviewPackage = (item) => {
    uni.navigateTo({
      url: `/pages/review/review?orderId=${item.packageOrderId}`,
      success: (res) => {
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          orderId: item.packageOrderId,
          packageType: item.packageType,
          completedTime: item.packageCompletedTime,
        });
      },
      // events: {
      //   // 监听评价完成事件
      //   reviewCompleted: () => {
      //     // 评价完成后立即更新评价状态
      //     reviewedOrderIds.value.push(item.packageOrderId);
      //   }
      // }
    });
  };

  const hidePackage = (index) => {
    currentPackageList.value.splice(index, 1);
  };
  const contactAdmin = (parcel) => {
    uni.showModal({
      title: '联系客服',
      content: '客服电话：400-123-4567',
      confirmText: '拨打',
      success: (res) => {
        if (res.confirm) {
          uni.makePhoneCall({
            phoneNumber: '4001234567'
          });
        }
      }
    });
  }
  // 页面显示/隐藏时的日志
  onShow(() => {
    console.log('页面显示，初始化数据和开启轮询...');
    isPageVisible.value = true;
    fetchPackageData(true);
    fetchActivityData(true);
    fetchReviewedOrders();
    startPolling();
  });

  onHide(() => {
    console.log('页面隐藏，停止轮询...');
    stopPolling();
  });


  // // 以防万一，也在页面卸载时清理
  // onUnload(() => {
  //   console.log('页面卸载，清理轮询...');
  //   stopPolling();
  // });

  // 页面加载时获取数据
  onMounted(() => {
    fetchPackageData();
    fetchActivityData();
    fetchReviewedOrders();
    // 添加刷新事件监听
    uni.$on('refreshPackageList', () => {
      fetchPackageData();
    });
  });
  // 组件卸载前移除事件监听
  onBeforeUnmount(() => {
    console.log('组件卸载，清理轮询...');
    uni.$off('refreshPackageList');
    stopPolling();
  });
  // Tab切换处理
  const changeTab = async (index) => {
    currentTab.value = index;
    if (index === 2) { // 切换到近日签收标签
      await fetchReviewedOrders();
    }
    // ... 其他切换逻辑
  };

  function toPackageAdd() {
    uni.navigateTo({
      url: "/pages/package/packageAdd"
    });
  }


  function toIdcard() {
    uni.navigateTo({
      url: "/pages/idCard/idCard"
    });
  }



  // 滚动到底部加载更多
  const loadMoreData = () => {
    console.log("加载更多数据");
  };
</script>

<style lang="scss" scoped>
  :root {
    // 主色调：清新淡雅的天蓝色系
    --primary-color: #60A5FA; // 主要品牌色
    --primary-dark: #3B82F6; // 深色调
    --primary-light: #93C5FD; // 浅色调

    // 背景色
    --bg-primary: #F0F9FF; // 主背景色
    --bg-secondary: #FFFFFF; // 次要背景

    // 文字颜色
    --text-primary: #1E40AF; // 主要文字
    --text-secondary: #60A5FA; // 次要文字
    --text-light: #FFFFFF; // 亮色文字

    // 功能色
    --success: #34D399; // 成功色
    --error: #F87171; // 错误色
  }

  .home-container {
    min-height: 100vh;
    background: var(--bg-primary);
    padding-bottom: 20px;
  }

  .search-section {
    position: sticky;
    top: 0;
    z-index: 100;
    padding: 12px 20px;
    background: var(--bg-secondary);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  }

  // .swiper-section {
  //   padding: 16px 20px;

  //   .swiper {
  //     height: 160px;
  //     border-radius: 16px;
  //     overflow: hidden;
  //     box-shadow: 0 4px 12px rgba(96, 165, 250, 0.1);

  //     .swiper-image {
  //       width: 100%;
  //       height: 100%;
  //       object-fit: cover;
  //     }
  //   }
  // }
  .swiper-section {
    padding: 16px 20px;
    position: relative;

    .activity-title {
      position: absolute;
      bottom: 40rpx; // 调整位置，避免与指示点重叠
      left: 0;
      right: 0;
      text-align: center;
      color: #fff;
      font-size: 28rpx;
      padding: 0 20rpx;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      z-index: 1;
    }
  }

  .swiper-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .action-section {
    padding: 0 20px;
    margin-bottom: 24px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;

    .action-button {
      height: 72px;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.3s ease;

      &.add {
        background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
      }

      &.code {
        background: linear-gradient(135deg, var(--primary-dark), var(--text-primary));
      }

      text {
        color: var(--text-light);
        font-size: 14px;
        font-weight: 500;
      }

      &:active {
        transform: translateY(1px);
      }
    }
  }

  // 包裹列表区域
  .package-section {
    background: #FFFFFF;
    border-radius: 20px 20px 0 0;
    min-height: calc(100vh - 420px); // 调整高度以适应上方内容
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.04);

    .u-tabs {
      background: #FFFFFF;
      border-radius: 20px 20px 0 0;
      border-bottom: 1px solid #E2E8F0;
      position: sticky;
      top: 56px; // 搜索框高度
      z-index: 99;
    }

  }

  // 包裹卡片样式
  .package-card {
    // float: none;
    // position: relative;
    // width: 100%;
    // /* 或设置最大宽度 */
    // max-width: 400px;
    // margin: 0 auto;
    // /* 居中对齐 上面是新加的*/
    background: #FFFFFF;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    border: 1px solid #E2E8F0;

    .card-header {
      display: flex;
      align-items: center;
      margin-bottom: 16px;

      .type-icon {
        width: 40px;
        height: 40px;
        padding: 8px;
        background: #F1F5F9;
        border-radius: 8px;
      }

      .package-info {
        flex: 1;
        margin-left: 12px;

        .package-type {
          font-size: 16px;
          font-weight: 600;
          color: #1E293B;
        }

        .tracking-number {
          font-size: 13px;
          color: #64748B;
          margin-top: 4px;
        }
      }

      .status-tag {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;

        &.pending {
          background: #EFF6FF;
          color: #3B82F6;
        }

        &.delivering {
          background: #F0FDF4;
          color: #22C55E;
        }

        &.completed {
          background: #F1F5F9;
          color: #64748B;
        }

        &.timeout {
          background: #FEF2F2;
          color: #EF4444;
        }
      }
    }

    .card-content {

      .info-item {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        color: #64748B;
        font-size: 14px;

        &:last-child {
          margin-bottom: 0;
        }
      }

      .info-item text {
        white-space: nowrap;
        /* 禁止换行 */
        overflow: hidden;
        /* 隐藏超出内容 */
        text-overflow: ellipsis;
        /* 超出部分以省略号显示 */
        margin-left: 8px;
        /* 图标和文字之间的间距 */
      }
    }

    .card-actions {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #E2E8F0;

      .button-group {
        display: flex;
        gap: 12px;
      }

      .action-btn {
        flex: 1;
        height: 36px;
        border-radius: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-size: 14px;
        border: none;
        transition: all 0.2s ease;

        &:active {
          transform: translateY(1px);
        }

        &.primary {
          background: #3B82F6;
          color: #FFFFFF;

          // 添加悬停效果
          &:hover {
            background: #2563EB;
          }
        }

        &.secondary {
          background: #F1F5F9;
          color: #64748B;
        }

        &.warning {
          background: #EF4444;
          color: #FFFFFF;
        }

        &.disabled {
          background: #94A3B8 !important; // 使用更浅的颜色表示禁用状态
          color: #FFFFFF !important;
          cursor: not-allowed;
          opacity: 0.7;
        }

        &.reviewed {
          background-color: #F3F4F6;
          color: #10B981;
          cursor: default;

          &:active {
            opacity: 1;
          }
        }
      }
    }
  }

  // 空状态
  .empty-tip {
    padding: 40px 20px;
    text-align: center;
    color: #64748B;
  }

  // 下拉刷新和上拉加载样式
  :deep(.uni-scroll-view-refresh) {
    background: #F8FAFC;
  }

  :deep(.uni-scroll-view-loading) {
    background: #F8FAFC;
    color: #64748B;
  }
</style>