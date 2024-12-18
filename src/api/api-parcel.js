// 引入 request 文件
import request from './request.js'

// 获取包裹数据
export const fetchPackageDataAPI = (showLoading = true) => {
  return request({
    url: '/user/packages/getPackagesList',
    method: 'get',
    showLoading // 传入 showLoading 参数
  })
}

// 选择包裹
export const selectToAddPackageAPI = (addInfo) => {
  return request({
    url: '/user/packages/selectPackage',
    method: 'post',
    data: {
      packageId: addInfo.packageId,
      phoneNumber: addInfo.phoneNumber
    }
  });

}

// 添加包裹
export const AddPackageAPI = (packageId) => {
  return request({
    url: '/user/packages/addPackage',
    method: 'post',
    data: {
      packageId
    }
  });

}

// 搜索包裹
export const searchPackageAPI = (packageId) => {
  return request({
    url: '/user/packages/searchPackage',
    method: 'post',
    data: {
      packageId
    }
  })
}