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
export const fetchUserProfileAPI = (code) => {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      code
    }
  });
}
export const getPersonalBalanceAPI = () => {
  return request({
    url: '/user/mine-view/get-personal-balance',
    method: 'get',
  })
}