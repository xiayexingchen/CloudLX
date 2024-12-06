// 引入 request 文件
import request from './request.js'

// 获取机器人目的地
export const robotDestAPI = (robotId) => {
    return request({
        url: '/user/myMapView/robotDest',
        method: 'post',
        data: {
            robotId: robotId
        }
    })
}

// 获取机器人位置
export const robotLocAPI = (robotId) => {
    return request({
        url: '/user/myMapView/robotLoc',
        method: 'post',
        data: {
            robotId: robotId
        }
    })
}