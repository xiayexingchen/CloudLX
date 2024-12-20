// 引入 request 文件
import request from './request.js'

// 获取机器人目的地
export const robotDestAPI = async (robotId) => {
  console.log('packageId in robotDestAPI: ', robotId);
  return request({
    url: '/user/myMapView/get-robotDestination',
    method: 'post',
    data: {
      robotId: parseInt(robotId)
    }
  })
}

// 获取机器人位置
export const robotLocAPI = async (robotId) => {
  console.log('packageId in robotLocAPI: ', robotId);
  return request({
    url: '/user/myMapView/get-robotLocation',
    method: 'post',
    data: {
      robotId: parseInt(robotId),
    }
  })
}

// 获取包裹所在站点位置
export const packageLocAPI = async (robotId) => {
  console.log('packageId in packageLocAPI: ', robotId);
  return request({
    url: '/user/myMapView/get-packageLocation',
    method: 'post',
    data: {
      packageId: robotId,
    }
  })
}

// 获得订单状态
export const orderStatusAPI = async (orderId) => {
  console.log('orderId in orderStatusAPI: ', orderId);
  return request({
    url: '/user/myMapView/get-order-status',
    method: 'post',
    data: {
      orderId: orderId,
    }
  })
}