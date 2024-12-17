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
export const fetchPersonalBalanceAPI = () => {
  return request({
    url: '/user/mine-view/get-personal-balance',
    method: 'get',
  })
}
//充值用户资金
export const addPersonalBalanceAPI = (amount) => {
  return request({
    url: '/user/mine-view/add-personal-balance',
    method: 'post',
    data: {
      amount
    }
  })
}
//获得用户地址信息
export const fetchAddressDataAPI = () => {
  return request({
    url: '/user/mine-view/get-personal-address',
    method: 'get'
  })

}
//新增用户地址信息
export const addAddressDataAPI = (addressInfo) => {
  return request({
    url: '/user/mine-view/add-personal-address',
    method: 'post',
    data: {
      recipientName: addressInfo.recipientName,
      region: addressInfo.region,
      build: addressInfo.build,
      isDefault: addressInfo.isDefault
    }
  })

}
//修改用户地址信息
export const updateAddressDataAPI = (addressInfo) => {
  return request({
    url: '/user/mine-view/update-personal-address',
    method: 'post',
    data: {
      addressId: addressInfo.addressId,
      recipientName: addressInfo.recipientName,
      region: addressInfo.region,
      build: addressInfo.build,
      isDefault: addressInfo.isDefault
    }
  })

}
//删除地址信息
export const deleteAddressAPI = (addressId) => {
  return request({
    url: '/user/mine-view/delete-personal-address',
    method: 'delete',
    data: {
      addressId
    }

  })
}

//获得用户未使用优惠券
export const fetchUnUsedCouponssDataAPI = () => {
  return request({
    url: '/user/mine-view/get-unusedcoupons',
    method: 'get'
  })

}
//获得用户已使用优惠券
export const fetchUsedCouponssDataAPI = () => {
  return request({
    url: '/user/mine-view/get-usedcoupons',
    method: 'get'
  })

}
//获得用户信息
export const fetchUserDataAPI = () => {
  return request({
    url: '/user/mine-view/get-personal-info',
    method: 'get'
  })

}
//更新用户信息
export const updateUserDataAPI = (userInfo) => {
  return request({
    url: '/user/mine-view/update-personal-info',
    method: 'post',
    data: {
      username: userInfo.username,
      birthday: userInfo.birthday,
      gender: userInfo.gender
    }
  })

}
//
// ... existing code ...

// 修改用户头像
export const updateAvatarAPI = (avatarData) => {
  return request({
    url: '/user/modifyAvatar',
    method: 'post',
    data: {
      avatar: avatarData,
      format: 'image/jpeg'
    }
  })
}
//获得头像url
export const fetchAvatarAPI = () => {
  return request({
    url: '/user/getAvatarURL',
    method: 'get',

  })
}
//获得消息列表
export const fetchMessagesAPI = () => {
  return request({
    url: '/user/message-view/get-messages',
    method: 'get',

  })
}
//删除消息
export const deleteMessagesAPI = (messageId) => {
  return request({
    url: '/user/message-view/delete-message',
    method: 'delete',
    data: {
      messageId
    }

  })
}
//已读消息
export const readMessagesAPI = (messageId) => {
  return request({
    url: '/user/message-view/read-message',
    method: 'post',
    data: {
      messageId
    }

  })
}
//获取身份吗
export const fetchUserCodeAPI = () => {
  return request({
    url: '/user/get-userCode',
    method: 'get',

  })
}
//反馈建议
export const feedbackAPI = (feedbackInfo) => {
  return request({
    url: '/user/mine-view/feedback-suggestion',
    method: 'post',
    data: {
      content: feedbackInfo.content,
      title: feedbackInfo.username + "-反馈建议",
      type: feedbackInfo.type
    }

  })
}

//获取用户账单情况
export const fetchPersonalPaymentsAPI = () => {
  return request({
    url: '/user/mine-view/get-payments',
    method: 'get',
  })
}

//退出登录
export const logoutAPI = () => {
  return request({
    url: '/user/logout',
    method: 'post',

  })
}