// 引入 request 文件
import request from './request.js'

// 获取列表数据
export const fetchOrderDataAPI = (dateInfo) => {
  return request({
    url: '/user/myOrderView/getOrderList',
    method: 'post',
    data: {
      startTime: dateInfo.startTime,
      endTime: dateInfo.endTime
    }
  })
}

// export const selectToAddPackageAPI = (addInfo) => {
//   return request({
//     url: '/user/packages/selectPackage',
//     method: 'post',
//     data: {
//       packageId: addInfo.packageId,
//       phoneNumber: addInfo.phoneNumber
//     }
//   });
//}