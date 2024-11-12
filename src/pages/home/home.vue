<template>
  <!-- 搜索框 -->
  <view class="tab-strict">
    <u-search bg-color="#FFF" margin="8px" style="flex-grow: 1;" :show-action="true" action-text="搜索"
      :animation="true"></u-search>
  </view>
  <!-- 轮播图 -->
  <view class="u-wrap">
    <swiper class="swiper-container" circular :indicator-dots="indicatorDots" :indicator-color='indicatorColor'
      :autoplay="autoplay" :interval="interval" :duration="duration">
      <swiper-item v-for="(item,index) in swiperList">
        <image class="imgs" :src='item.image'></image>
      </swiper-item>
    </swiper>
  </view>
  <!-- 按钮 -->
  <view class="buttons">
    <button @click="toPackageAdd" class="button">新增包裹</button>
    <button @click="toIdcard" class="button">出示身份码</button>
  </view>
  <!--  包裹概览 -->
  <view>
    <!-- Tab 切换栏 -->
    <u-tabs :list="tabList" :current="currentTab" @change="changeTab"></u-tabs>
    <!-- 卡片部分 -->
    <scroll-view scroll-y style="height: 800px; width:100%;" @scrolltolower="loadMoreData">
      <view class="package-card" v-for="(item, index) in currentPackageList" :key="item.packageId"
        @click="handlePackageClick(item)">
        <view class="package-info">
          <image class="package-image" :src="getPackageTypeImage(item.type)" mode="aspectFit"></image>
          <view class="package-details">
            <text class="status">{{ item.packageSiteName }}</text>
            <text class="location">{{ item.packageType }}</text>
            <text class="time">{{ item.packageInTime }}</text>
          </view>
        </view>
        <view class="package-buttons">
          <!-- 按钮部分保持不变 -->
          <template v-if="currentTab === 0">
            <u-button size="small" type="primary" @click.stop="pickupPackage(item)">配送</u-button>
            <!--            <u-button size="small" type="default" @click.stop="hidePackage(index)">隐藏</u-button> -->
          </template>
          <template v-else-if="currentTab === 2">
            <u-button size="small" type="default" @click.stop="hidePackage(index)">隐藏</u-button>
            <u-button size="small" type="primary" @click.stop="reviewPackage(item)">评价</u-button>
          </template>
          <template v-else-if="currentTab === 3">
            <u-button size="small" type="primary" @click.stop="reviewPackage(item)">联系管理员</u-button>
            <!--            <u-button size="small" type="default" @click.stop="hidePackage(index)">隐藏</u-button> -->
          </template>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
  import {
    ref,
    onMounted,
    computed
  } from 'vue';
  import {
    fetchPackageDataAPI
  } from '../../api/api';
  const indicatorDots = ref(true);
  const indicatorColor = ref("#FFF");
  const autoplay = ref(true);
  const interval = ref(2000);
  const duration = ref(500);

  // 轮播图数据
  const swiperList = ref([{
      image: '/static/1.jpg'
    },
    {
      image: '/static/2.jpg'
    },
    {
      image: '/static/3.jpg'
    }
  ]);

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
    pendingPackageList: [],
    deliveringPackageList: [],
    completedPackageList: [],
    timeoutPackageList: []
  });
  // 计算当前显示的包裹列表
  const currentPackageList = computed(() => {
    switch (currentTab.value) {
      case 0:
        return allPackages.value.pendingPackageList;
      case 1:
        return allPackages.value.deliveringPackageList;
      case 2:
        return allPackages.value.completedPackageList;
      case 3:
        return allPackages.value.timeoutPackageList;
      default:
        return [];
    }
  });
  // 获取包裹类型对应的图片
  const getPackageTypeImage = (type) => {
    const imageMap = {
      'flower': '/static/flower.png',
      'food': '/static/food.png',
      'parcel': '/static/parcel.png',
      'fragile': '/static/fragile.png',
      'other': '/static/other.png'
    };
    return imageMap[type] || imageMap.other;
  };

  // 获取包裹信息
  const fetchPackageData = async () => {
    try {
      const response = await fetchPackageDataAPI();
      console.log(response);
      allPackages.value = response.data;
      //test
      console.log(allPackages.value.pendingPackageList);
      console.log(currentPackageList.value);
      console.log(currentPackageList.value[0])
    } catch (error) {
      console.error('获取包裹信息失败:', error);
      uni.showToast({
        title: '获取数据失败',
        icon: 'none'
      });
    }
  }



  // 处理包裹点击
  const handlePackageClick = (parcel) => {
    console.log("点击")
    const routes = {
      0: '/pages/package/pendingPackage',
      1: '/pages/package/deliveringPackage',
      2: '/pages/package/completedPackage',
      3: '/pages/package/timeoutPackage'
    };
    console.log(`${routes[currentTab.value]}?id=${parcel.packageId}`);
    uni.navigateTo({
      url: `${routes[currentTab.value]}?id=${parcel.packageId}`
    });
  };
  // 包裹操作函数
  const pickupPackage = (parcel) => {
    // 实现取件逻辑
  };

  const trackPackage = (parcel) => {
    // 实现追踪逻辑
  };

  const reviewPackage = (parcel) => {
    // 实现评价逻辑
  };

  const hidePackage = (index) => {
    currentPackageList.value.splice(index, 1);
  };

  // 页面加载时获取数据
  onMounted(() => {
    fetchPackageData();
  });

  // Tab切换处理
  function changeTab(index) {
    currentTab.value = index;
  }

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

<style>
  page {
    background-color: #ededed;
  }
</style>

<style scoped lang="scss">
  .swiper-container {
    height: 180px;
  }

  .item {
    height: 180px;
  }

  .imgs {
    height: 180px;
    width: 100%;
  }


  .delivery-time {
    color: #666;
    font-size: 12px;
  }

  .buttons {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
  }

  .button {
    flex: 1;
    margin: 0 5px;
    padding: 10px;
    background-color: #007AFF;
    color: white;
    border-radius: 5px;
    text-align: center;
  }

  .button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }


  .package-card {
    background-color: #ffffff;
    border-radius: 8px;
    margin: 10px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .package-info {
    display: flex;
    align-items: flex-start;
    margin-bottom: 15px;
  }

  .package-image {
    width: 80px;
    height: 80px;
    flex-shrink: 0;
    margin-right: 5px;
  }

  .package-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;

    .status {
      font-size: 16px;
      font-weight: bold;
      color: #333;
    }

    .location,
    .time {
      font-size: 14px;
      color: #666;
    }
  }

  .package-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;

    :deep(.u-button) {
      margin-left: 10px;
    }
  }
</style>