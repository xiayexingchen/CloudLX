<template>
  <view class="delivery-container">
    <!-- 使用v-if/v-else控制显示哪个视图 -->
    <template v-if="currentView === 'map'">
      <!-- 地图区域 -->
      <map class="delivery-map" :latitude="robotInfo?.latitude || 39.989643"
        :longitude="robotInfo?.longitude || 116.481028" :markers="markers" :polyline="polyline" :scale="18">
        <!-- 可选：添加地图控件 -->
        <!--        <cover-view class="map-controls">
          <cover-image src="/static/location.png" class="location-btn" @tap="moveToCurrentLocation" />
        </cover-view> -->
      </map>
    </template>

    <template v-else>
      <!-- 机器人视角视图 -->
      <view class="video-section">
        <image :src="videoUrl" mode="aspectFill" class="video-stream" />
        <!-- 实时数据悬浮层 - 移至顶部 -->
        <view class="metrics-container">
          <view class="metrics-column">
            <view class="metric-item">
              <text class="label">电量 {{robotMetrics.battery}}%</text>
            </view>
            <view class="metric-item">
              <text class="label">速度 {{robotMetrics.linear_velocity.toFixed(1)}} m/s</text>
            </view>
          </view>
          <view class="metrics-column">
            <view class="metric-item">
              <text class="label">经度 {{robotMetrics.longitude}}°E</text>
            </view>
            <view class="metric-item">
              <text class="label">纬度 {{robotMetrics.latitude}}°N</text>
            </view>
          </view>
        </view>
      </view>
    </template>

    <!-- 配送信息卡片 -->
    <view class="delivery-card">

      <view class="status-section">
        <view class="status-header">
          <view class="status-icon">
            <u-icon name="car-fill" color="#007AFF" size="28" />
          </view>
          <view class="status-info">
            <text class="status-text">包裹配送中</text>
            <text class="robot-id-text">配送机器人：{{ fmtRobotId? fmtRobotId:'等待空闲机器人'}}</text>
          </view>
        </view>
        <view class="estimated-time">
          预计送达时间：{{ packageInfo.deliveryTime }}
        </view>
      </view>


      <view class="package-info">
        <view class="info-item">
          <text class="label">包裹编号</text>
          <text class="value">{{ packageInfo.packageId }}</text>
        </view>
        <view class="info-item">
          <text class="label">包裹类型</text>
          <text class="value">{{ packageInfo.packageType }}</text>
        </view>
        <view class="info-item">
          <text class="label">订单编号</text>
          <text class="value">{{ packageInfo.orderId }}</text>
        </view>
        <view class="info-item">
          <text class="label">收货地址</text>
          <text class="value">{{ packageInfo.address }}</text>
        </view>
      </view>

      <view class="action-buttons">
        <button class="action-btn robot-view" @click="toggleView"
          :style="packageInfo.status == '待发货' && currentView === 'map' ? 'opacity: 0.5;' : ''">
          <u-icon :name="currentView === 'map' ? 'camera-fill' : 'map'" size="20" />
          <text>{{ currentView === 'map' ? '查看机器人视角' : '查看地图视角' }}</text>
        </button>
        <button class="action-btn contact" @click="handleContact">
          <u-icon name="server-man" size="20" />
          <text>联系客服</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
  import {
    onLoad,
    onReady,
    onUnload
  } from '@dcloudio/uni-app';

  import {
    ref,
    computed,
    reactive,
    onMounted,
    getCurrentInstance,
    onUnmounted
  } from 'vue';

  import {
    robotDestAPI,
    robotLocAPI,
    orderStatusAPI,
  } from '@/api/api-map.js'
  import {
    getRobotIdAPI,
    fetchRobotInfoAPI
  } from '@/api/api-order'
  import amap from '../../../lib/amap-wx.js'

  // 获得上一个页面数据
  const packageInfo = ref({});
  // 格式化机器人ID的函数
  const formatRobotId = (id) => {
    // 将数字转为字符串并补齐7位
    const paddedNumber = id.toString().padStart(7, '0')
    return `ROID${paddedNumber}`
  }
  // 获取机器人ID的函数
  const robotId = ref('0')
  const fmtRobotId = ref('')
  const getRobotId = async (orderId) => {
    try {
      const res = await getRobotIdAPI(orderId)
      if (res.code === 24071) {
        // 格式化机器人ID
        robotId.value = res.data
        fmtRobotId.value = formatRobotId(robotId.value)
      } else {
        console.error('获取机器人ID失败:', res.msg)
        return null
      }
    } catch (error) {
      console.error('获取机器人ID错误:', error)
      return null
    }
  }
  // 在需要显示机器人ID的地方使用

  const updateMap = async () => {

    const res = await orderStatusAPI(packageInfo.value.orderId);
    console.log('orderStatusAPI res:', res);
    packageInfo.value.status = res.data;

    markers.value = [];
    polyline.value = [];

    if (packageInfo.value.status === '正在运输') {
      st = 1;
    } else if (packageInfo.value.status === '待发货') {
      st = 2;
      robotInfo.value.longitude = sites[packageInfo.value.address.split(' ')[0]]
        .sitePosition[0];
      robotInfo.value.latitude = sites[packageInfo.value.address.split(' ')[0]]
        .sitePosition[1];

      addMarker()
    } else {
      st = 3;
      // 检查是否是第一次显示到达提醒，使用订单ID作为唯一标识
      const storageKey = `hasShownArrivalNotice_${packageInfo.value.orderId}`;
      const hasShownArrivalNotice = uni.getStorageSync(storageKey);
      if (!hasShownArrivalNotice) {
        uni.showModal({
          title: '包裹到达提醒',
          content: '您的包裹已到达，请及时查收！',
          showCancel: false,
          success: () => {
            uni.setStorageSync(storageKey, 'true');
          }
        });
      }
    }

    if (st != 2) {
      await getRobotId(packageInfo.value.orderId);
      await getRobotInfo();

    }

  };


  let st = null;
  const sites = {
    "天马学生公寓": {
      center: [112.945817, 28.165779],
      sitePosition: [112.945318, 28.164796],
    },
    "德智学生公寓": {
      center: [112.940252, 28.162897],
      sitePosition: [112.941401, 28.163157],
    },
    "财院校区学生公寓": {
      center: [112.929928, 28.197679],
      sitePosition: [112.930258, 28.197304],
    },
    "望麓桥学生公寓": {
      center: [112.92857, 28.202066],
      sitePosition: [112.928706, 28.201169],
    },
  };
  const getPackageInfo = async () => {
    try {
      const instance = getCurrentInstance();
      if (!instance) return;
      const eventChannel = instance.proxy.getOpenerEventChannel();
      // 监听来自上一页面的数据
      eventChannel.on('deliveryData', async (data) => {
        packageInfo.value = data;
        console.log('Received deliveryData from the previous page:', data);
        await updateMap();

      });
    } catch (error) {
      console.error('getPackageInfo error:', error);
    }
  };

  // 添加起点、终点、机器人当前位置的的markers
  const markers = ref([]);
  const addMarker = () => {
    markers.value.push({
      iconPath: "../../static/icons/机器人.png",
      id: markers.value.length,
      latitude: robotInfo.value.latitude,
      longitude: robotInfo.value.longitude,
      width: 23,
      height: 33,
    })
    if (st === 1) {
      markers.value.push({
        iconPath: "../../static/icons/mapicon_navi_e.png",
        id: markers.value.length,
        latitude: robotInfo.value.to.latitude,
        longitude: robotInfo.value.to.longitude,
        width: 23,
        height: 33,
      })
      markers.value.push({
        iconPath: "../../static/icons/mapicon_navi_s.png",
        id: markers.value.length,
        latitude: robotInfo.value.from.latitude,
        longitude: robotInfo.value.from.longitude,
        width: 23,
        height: 33,
      })

    }


  }
  // 加规划路线
  const polyline = ref([])
  const drawTrace = () => {
    var myAmapFun = new amap.AMapWX({
      key: 'd2bd6886e703208fc8eb6b4ff8bcb8b2'
    });
    myAmapFun.getWalkingRoute({
      origin: `${robotInfo.value.from.longitude},${robotInfo.value.from.latitude}`,
      destination: `${robotInfo.value.to.longitude},${robotInfo.value.to.latitude}`,
      success: function(data) {
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        polyline.value = [{
          points: points,
          color: "#0091ff",
          width: 6
        }]


      },
      fail: function(info) {

        console.log(info)

      }
    })
  }

  // 请求机器人信息
  const robotInfo = ref({});
  const getRobotInfo = async () => {
    try {
      const result = await robotLocAPI(Number(robotId.value));
      robotInfo.value['latitude'] = result.data.latitude;
      robotInfo.value['longitude'] = result.data.longitude;
      console.log('Robot location data:', result);
    } catch (error) {
      console.error('Failed to fetch robot location:', error);
    }
    // 如果状态为3，就不调用getRobotDest的api了，只要显示机器人位置就行
    if (st !== 3) {
      try {
        const result = await robotDestAPI(robotId.value);
        robotInfo.value['to'] = {
          'latitude': result.data.to.latitude,
          'longitude': result.data.to.longitude
        };
        robotInfo.value['from'] = {
          'latitude': result.data.from.latitude,
          'longitude': result.data.from.longitude
        };

        console.log('Robot to and from data:', result);
      } catch (error) {
        console.error('Failed to fetch robot location:', error);
      }
    }
    console.log('robotInfo:', robotInfo);
    addMarker();
    if (st === 1) {
      drawTrace();
    }

  }

  let refreshTimer = null;
  // mounted的时候加载全部  
  onMounted(async () => {
    try {
      await getPackageInfo();
      refreshTimer = setInterval(async () => {
        await updateMap();
      }, 3000);
    } catch (error) {
      console.error('getPackageInfo error:', error);
    }


  });

  onUnload(() => {
    // 确保页面卸载时清理定时器
    if (metricsTimer) {
      clearInterval(metricsTimer);
      metricsTimer = null;
    }

    if (refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
  });

  onUnmounted(() => {
    // 确保组件卸载时清理定时器
    if (metricsTimer) {
      clearInterval(metricsTimer);
      metricsTimer = null;
    }

    if (refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
  });




  // 定位到当前位置
  const moveToCurrentLocation = () => {
    uni.getLocation({
      type: 'gcj02',
      success: (res) => {
        // packageInfo.value.latitude = res.latitude;
        // packageInfo.value.longitude = res.longitude;
      }
    });
  };

  // 跳转到机器人视角
  const navigateToRobotPage = () => {
    uni.navigateTo({
      url: '/pages/robotView/robotView',
      success: (res) => {
        res.eventChannel.emit('robotData', {
          robotId: robotId.value,
          packageInfo: packageInfo.value,
          robotInfo: robotInfo.value,
          status: st,
        });
      }
    });
  };

  // 联系客服
  const handleContact = () => {
    uni.showModal({
      title: '联系客服',
      content: '客服电话：13019528909',
      confirmText: '拨打',
      success: (res) => {
        if (res.confirm) {
          uni.makePhoneCall({
            phoneNumber: '13019528909'
          });
        }
      }
    });
  };

  // 在现有的 import 语句下添加
  const currentView = ref('map');
  const videoUrl = ref('http://120.46.199.126:8080/robot/video_stream');
  const robotMetrics = ref({
    linear_velocity: 0,
    angular_velocity: 0,
    longitude: 0,
    latitude: 0,
    battery: 100,
    signal: 85
  });

  // 修改定时器相关的代码
  let metricsTimer = null; // 用于存储定时器ID

  // 修改视图切换函数
  const toggleView = () => {
    if (packageInfo.value.status == '待发货' && currentView.value === 'map') {
      uni.showToast({
        title: '包裹未在运输中，暂无机器人视角',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 切换视图前清理现有定时器
    if (metricsTimer) {
      clearInterval(metricsTimer);
      metricsTimer = null;
    }

    currentView.value = currentView.value === 'map' ? 'robot' : 'map';

    // 如果切换到机器人视角，开始获取实时数据
    if (currentView.value === 'robot') {
      // 立即获取一次数据
      getRobotMetrics();
      // 启动定时器
      metricsTimer = setInterval(() => {
        getRobotMetrics();
      }, 6000);
    }
  };

  // 修改获取机器人实时数据的函数
  const getRobotMetrics = async () => {
    try {
      // 获取速度和电量信息
      const velocityRes = await fetchRobotInfoAPI(Number(robotId.value));
      // 获取位置信息
      const locationRes = await robotLocAPI(Number(robotId.value));

      if (velocityRes.code === 50081 && locationRes.code === 27011) {
        robotMetrics.value = {
          ...robotMetrics.value,
          linear_velocity: velocityRes.data.linear_velocity,
          angular_velocity: velocityRes.data.angular_velocity,
          battery: velocityRes.data.battery,
          longitude: locationRes.data.longitude,
          latitude: locationRes.data.latitude
        };
      } else {
        console.error('Failed to fetch robot metrics:', velocityRes.msg, locationRes.msg);
      }
    } catch (error) {
      console.error('Failed to fetch robot metrics:', error);
    }
  };
</script>

<style lang="scss" scoped>
  .delivery-container {
    height: 100vh;
    position: relative;
    background: #f5f6fa;
  }

  .delivery-map {
    width: 100%;
    height: 65%;

    .map-controls {
      position: absolute;
      right: 20px;
      bottom: 30px;

      .location-btn {
        width: 40px;
        height: 40px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    }
  }

  .delivery-card {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: #ffffff;
    border-radius: 24px 24px 0 0;
    padding: 24px;
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08);

    .status-section {
      margin-bottom: 20px;

      .status-header {
        display: flex;
        align-items: center;
        margin-bottom: 12px;

        .status-icon {
          width: 48px;
          height: 48px;
          background: rgba(0, 122, 255, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
        }

        .status-info {
          .status-text {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            display: block;
            margin-bottom: 4px;
          }

          .robot-id {
            color: #666;
            font-size: 14px;
            font-family: monospace; // 使用等宽字体，使数字对齐
            font-weight: 500;
          }
        }
      }

      .estimated-time {
        font-size: 15px;
        color: #007AFF;
        font-weight: 500;
      }
    }

    .package-info {
      margin-bottom: 24px;

      .info-item {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid #f5f5f5;

        .label {
          color: #666;
          font-size: 14px;
        }

        .value {
          color: #333;
          font-size: 14px;
          font-weight: 500;
        }
      }
    }

    .action-buttons {
      display: flex;
      gap: 12px;

      .action-btn {
        flex: 1;
        height: 44px;
        border-radius: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-size: 14px;
        border: none;

        &.robot-view {
          background: #007AFF;
          color: #fff;
        }

        &.contact {
          background: #f5f5f5;
          color: #333;
        }
      }
    }
  }

  // 暗黑模式适配
  @media (prefers-color-scheme: dark) {
    .delivery-card {
      background: #1a1a1a;

      .status-section {
        .status-header {
          .status-info {
            .status-text {
              color: #fff;
            }

            .robot-id {
              color: #999;
            }
          }
        }
      }

      .package-info {
        .info-item {
          border-bottom-color: #333;

          .label {
            color: #999;
          }

          .value {
            color: #fff;
          }
        }
      }

      .action-buttons {
        .action-btn.contact {
          background: #333;
          color: #fff;
        }
      }
    }
  }

  .video-section {
    width: 100%;
    height: 65%;
    position: relative;
    background: #000;
    overflow: hidden;

    .video-stream {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .metrics-container {
      position: absolute;
      top: 10rpx;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-around;
      padding: 0 40rpx;
      //background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(5px);
      padding: 20rpx 40rpx;

      .metrics-column {
        display: flex;
        flex-direction: column;
        gap: 20rpx;
        align-items: flex-start;

        .metric-item {
          .label {
            font-size: 28rpx;
            color: #fff;
            font-weight: 500;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          }
        }
      }
    }
  }
</style>