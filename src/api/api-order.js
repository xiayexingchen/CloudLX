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
//取消订单
export const cancelOrderAPI = (orderId) => {
  return request({
    url: '/user/myOrderView/cancelOrder',
    method: 'post',
    data: {
      orderId: orderId
    }
  })
}
//确认收货
export const confirmDeliveryAPI = (orderId) => {
  return request({
    url: '/user/myOrderView/confirmDelivery',
    method: 'post',
    data: {
      orderId: orderId
    }
  })
}
//删除订单
export const deleteOrderAPI = (orderId) => {
  return request({
    url: '/user/myOrderView/deleteCompletedOrder',
    method: 'delete',
    data: {
      orderId
    }

  })
}
//获取配送的机器人的id 
export const getRobotIdAPI = (orderId) => {
  return request({
    url: '/user/myOrderView/get-robotId',
    method: 'post',
    data: {
      orderId: orderId
    }
  })
}
//评价订单
export const reviewAPI = (reviewInfo) => {
  return request({
    url: '/user/myOrderView/review-order',
    method: 'post',
    data: {
      orderId: reviewInfo.orderId,
      review_text: reviewInfo.review_text,
      evaluation_score: reviewInfo.evaluation_score
    }
  })
}
//获取已评价的订单的信息

export const fetchReviewRecordAPI = () => {
  return request({
    url: '/user/myOrderView/get-reviewRecordList',
    method: 'get',
    showLoading: false
  })
}
//获得机器人实时信息
export const fetchRobotInfoAPI = (robotId) => {
  return request({
    url: '/robot/get-velocity',
    method: 'post',
    data: {
      robotId: robotId,
      showLoading: false
    }
  })
}