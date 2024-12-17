<template>
  <view class="delivery-container">
    <!-- 地图区域 -->
    <map class="delivery-map" :latitude="robotInfo?.latitude || 39.989643"
      :longitude="robotInfo?.longitude || 116.481028" :markers="markers" :polyline="polyline" :scale="18">
      <!-- 可选：添加地图控件 -->
      <cover-view class="map-controls">
        <cover-image src="/static/location.png" class="location-btn" @tap="moveToCurrentLocation" />
      </cover-view>
    </map>

    <!-- 配送信息卡片 -->
    <view class="delivery-card">

      <view class="status-section">
        <view class="status-header">
          <view class="status-icon">
            <u-icon name="car-fill" color="#007AFF" size="28" />
          </view>
          <view class="status-info">
            <text class="status-text">包裹配送中</text>
            <text class="robot-id">配送机器人：{{ robotId }}</text>
          </view>
        </view>
        <view class="estimated-time">
          预计送达时间：{{ packageInfo.deliveryTime }}
        </view>
      </view>


      <view class="package-info">
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
        <button class="action-btn robot-view" @click="navigateToRobotPage">
          <u-icon name="camera-fill" size="20" />
          <text>查看机器人视角</text>
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
    onReady
  } from '@dcloudio/uni-app';

  import {
    ref,
    computed,
    reactive,
    onMounted,
    getCurrentInstance
  } from 'vue';

  import {
    robotDestAPI,
    robotLocAPI
  } from '@/api/api-map.js'
  import {
    getRobotIdAPI
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
  const robotId = ref('')
  const getRobotId = async (orderId) => {
    try {
      const res = await getRobotIdAPI(orderId)
      if (res.code === 24071) {
        // 格式化机器人ID
        robotId.value = res.data
        // return formatRobotId(res.data)
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

  const getPackageInfo = async () => {
    try {
      const instance = getCurrentInstance();
      if (!instance) return;
      const eventChannel = instance.proxy.getOpenerEventChannel();
      // 监听来自上一页面的数据
      eventChannel.on('deliveryData', (data) => {
        packageInfo.value = data;
        console.log('Received deliveryData from the previous page:', data);
        getRobotId(packageInfo.value.orderId);
        getRobotInfo();
      });

    } catch (error) {
      console.error('Failed to set up event listener for deliveryData:', error);
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

  // 添加规划路线
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
      const result = await robotLocAPI(robotId.value);
      robotInfo.value['latitude'] = result.data.latitude;
      robotInfo.value['longitude'] = result.data.longitude;
      console.log('Robot location data:', result);
    } catch (error) {
      console.error('Failed to fetch robot location:', error);
    }


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

    console.log('robotInfo:', robotInfo);
    addMarker();
    drawTrace();

  }

  // mounted的时候加载全部  
  onMounted(async () => {
    try {
      await getPackageInfo();
    } catch (error) {
      console.error('getPackageInfo error:', error);
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
          robotId: packageInfo.value.robotId
        });
      }
    });
  };

  // 联系客服
  const handleContact = () => {
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
</style>