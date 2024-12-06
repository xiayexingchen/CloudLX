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
//下单
export const orderAPI = (orderInfo) => {
    return request({
        url: '/user/myOrderView/placeOrder',
        method: 'post',
        data: {
            packageId: orderInfo.packageId,
            startTime: orderInfo.startTime,
            addressId: orderInfo.addressId,
            couponId: orderInfo.couponId,
            payment_method: orderInfo.payment_method,
            amount: orderInfo.amount
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