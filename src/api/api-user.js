// 引入 request 文件
import request from './request.js'

//发短信验证码
export const sendMessageAPI = (phoneNumber) => {
  return request({
    url: '/user/sendMessage',
    method: 'post',
    data: {
      phoneNumber
    }
  });
}
//将用户信息发送给后端
export const submitUserInfoAfterFirstLoginAPI = (userData) => {
  return request({
    url: '/user/personal-info/add', // 假设后端处理首次登录后用户信息的路径
    method: 'post',
    data: {
      phoneNumber: userData.phoneNumber,
      code: userData.code,
      username: userData.username,
      birthday: userData.birthday,
      gender: userData.gender
    }
  });
}
//用户微信一键登录
export const fetchUserProfileAPI = (code) => {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      code
    }
  });
}
//获得用户资金
export const getPersonalBalanceAPI = () => {
  return request({
    url: '/user/mine-view/get-personal-balance',
    method: 'get',
  })
}
//获得用户地址信息
export const fetchAddressDataAPI = (userInfo) => {
  return request({
    url: '/user/mine-view/get-personal-address',
    method: 'get'
  })

}
//获得用户优惠券
export const fetchUnUsedCouponssDataAPI = () => {
  return request({
    url: '/user/mine-view/get-unusedcoupons',
    method: 'get'
  })

}

// ... existing code ...

// 修改用户头像
export const modifyAvatarAPI = (avatarData) => {
  return request({
    url: '/user/modifyAvatar',
    method: 'post',
    data: {
      avatar: avatarData,
      format: 'image/jpeg'
    }
  })
}