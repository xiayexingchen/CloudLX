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
    <!-- 当前 Tab 下的包裹卡片列表 -->
    <scroll-view scroll-y style="height: 800px; width:100%;" @scrolltolower="loadMoreData">
      <u-card v-for="(item, index) in packageList" :key="item.id" :title="item.title">

        <view class="package-info">
          <image :src="item.image" mode="aspectFit"></image> <!-- 包裹类型的图片 -->
          <view class="package-details">
            <text>{{ item.deliveryStatus }}</text> <!-- 包裹状态 -->
            <text>{{ item.attributes }}</text> <!-- 包裹属性 -->

          </view>

        </view>
        <view class="package-buttons">
          <u-button size="small" type="default" @click="hidePackage(index)">隐藏</u-button>
          <u-button size="small" type="primary" @click="reviewPackage(index)">评价</u-button>
          <!-- 根据是否有评价按钮 -->
        </view>
      </u-card>
    </scroll-view>
  </view>
</template>

<script setup>
  import {
    ref,
    onMounted
  } from 'vue';

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
      name: '已签收',
      id: 2
    },
    {
      name: '超时包裹',
      id: 3
    }
  ]);
  const currentTab = ref(0); // 当前选中的 tab id
  const packageList = ref([]); // 当前 tab 下的包裹数据

  const fetchPackageData = (tabId) => {
    // 这里可以用真实的接口替代
    if (tabId === 0) {
      packageList.value = [{
        deliveryStatus: "已送至 天马一区一栋",
        attributes: "快递",
        image: "/static/parcel.png",
        hasReview: true,
        id: 1,
        title: "包裹1"
      }];
    } else if (tabId === 1) {
      packageList.value = [{
        deliveryStatus: "外卖至望儿菜鸟驿站B5柜",
        attributes: "外卖",
        image: "/static/food.png",
        hasReview: false,
        id: 2,
        title: "包裹2"
      }];
    }
    // 其他类型的包裹数据加载逻辑
  };

  function changeTab(index) {
    currentTab.value = index;
    fetchPackageData(index);
  }

  // 页面加载时获取默认 tab 数据
  onMounted(() => {
    fetchPackageData(currentTab.value);
  });

  function toPackageAdd() {
    uni.navigateTo({
      url: "/pages/packageAdd/packageAdd"
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

  // 隐藏包裹
  const hidePackage = (index) => {
    packageList.value.splice(index, 1);
  };

  // 评价包裹
  const reviewPackage = (index) => {
    console.log("评价包裹", packageList.value[index]);
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

  .package-info {
    font-size: 14px;
    color: #333;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
  }

  .package-details {
    margin-left: 10px;
  }

  .package-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }
</style>