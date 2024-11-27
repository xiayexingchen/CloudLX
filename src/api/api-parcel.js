// 引入 request 文件
import request from './request.js'

// 获取包裹数据
export const fetchPackageDataAPI = () => {
  return request({
    url: '/user/packages/getPackagesList',
    method: 'get',

  })
}
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
export const AddPackageAPI = (packageId) => {
  return request({
    url: '/user/packages/addPackage',
    method: 'post',
    data: {
      packageId
    }
  });

}