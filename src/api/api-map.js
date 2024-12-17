// 引入 request 文件
import request from './request.js'

// 获取机器人目的地
export const robotDestAPI = async (packageId) => {
  console.log('packageId in robotDestAPI: ', packageId);
  return request({
    url: '/user/myMapView/get-robotDestination',
    method: 'post',
    data: {
      robotId: parseInt(robotId)
    }
  })
}

// 获取机器人位置
export const robotLocAPI = async (packageId) => {
  console.log('packageId in robotLocAPI: ', packageId);
  return request({
    url: '/user/myMapView/get-robotLocation',
    method: 'post',
    data: {
      robotId: parseInt(robotId)
    }
  })
}

// 获取包裹所在站点位置
export const packageLocAPI = async (packageId) => {
  console.log('packageId in packageLocAPI: ', packageId);
  return request({
    url: '/user/myMapView/get-packageLocation',
    method: 'post',
    data: {
      packageId: packageId
    }
  })
}