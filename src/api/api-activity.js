// 引入 request 文件
import request from './request.js'

//获得正在进行或未开始活动列表接口
export const fetchActivityAPI = () => {
  return request({
    url: '/user/activity/get-activity-list',
    method: 'get',

  })
}
//优惠券活动-是否已被用户领取
export const fetchCouponStatusAPI = (activityId) => {
  return request({
    url: '/user/activity/isClaimCoupon',
    method: 'post',
    data: {
      activityId
    }
  })
}
//领取优惠券
export const updateCouponStatusAPI = (activityId) => {
  return request({
    url: '/user/activity/claimCoupon',
    method: 'post',
    data: {
      activityId
    }
  })
}
//获取充值返利活动信息
export const fetchRechargeActivityInfoAPI = (activityId) => {
  return request({
    url: '/user/mine-view/get-recharge-info',
    method: 'get',

  })
}