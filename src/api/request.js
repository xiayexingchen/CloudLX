import apiConfig from './self-config.js'; // 引入配置文件

const timeout = 5000;
// 添加一个标记变量来追踪是否已经显示了登录弹窗
let isShowingLoginModal = false;

export default async (params) => {
  const base_url = apiConfig.dev.apiUrl; // 从配置文件读取 base_url（后端）
  const url = params.url;
  const method = params.method || 'GET';
  const data = params.data || {};
  const contentType = params.contentType || 'application/json;charset=UTF-8'; // 更灵活的 Content-Type
  const showLoading = params.showLoading !== false; // 新增参数，默认为true
  const header = {
    //'Blade-Auth': uni.getStorageSync('token') || '',
    //'Content-Type': contentType,
    'Authorization': 'Bearer ' + uni.getStorageSync('token') || '',
    //'Tenant-Id': uni.getStorageSync('tenantId') || 'xxx',
    ...params.header
  };
  if (showLoading) {
    uni.showLoading({
      title: '加载中...'
    });
  }
  try {
    const res = await uni.request({
      url: base_url + url,
      method,
      header,
      data,
      timeout
    });
    if (res.statusCode === 200) {
      return res.data;
    } else if (res.statusCode === 401) {
      // 只在第一次 401 时显示弹窗
      if (!isShowingLoginModal) {
        isShowingLoginModal = true;
        uni.clearStorageSync();
        uni.showModal({
          title: '提示',
          content: '请重新登录',
          showCancel: false,
          success() {
            setTimeout(() => {
              uni.reLaunch({
                url: '/pages/index/index'
              });
              // 重置标记（可选，因为跳转后页面会重新加载）
              isShowingLoginModal = false;
            }, 1000);
          }
        });
      }
      throw new Error('Unauthorized');
  // try {
  //   const res = await uni.request({
  //     url: base_url + url,
  //     method,
  //     header,
  //     data,
  //     timeout
  //   });
  //   if (res.statusCode === 200) {
  //     return res.data;
  //   } else if (res.statusCode === 401) {
  //     uni.clearStorageSync();
  //     uni.showModal({
  //       title: '提示',
  //       content: '请重新登录',
  //       showCancel: false,
  //       success() {
  //         setTimeout(() => uni.navigateTo({
  //           url: '/pages/index/index'
  //         }), 1000);
  //       }
  //     });
  //     throw new Error('Unauthorized'); // 抛出错误，以便在调用处处理
    } else {
      uni.showToast({
        title: `请求失败: ${res.statusCode}`,
        icon: 'error',
        duration: 2000
      });
      throw new Error(`HTTP error ${res.statusCode}`); // 抛出错误
    }
  } catch (error) {
    uni.showToast({
      title: `请求出错: ${error.message}`,
      icon: 'error',
      duration: 2000
    });
    console.error('请求错误:', error); // 打印错误信息到控制台
    throw error; // 重新抛出错误，以便在调用处处理
  } finally {
    if (showLoading) {
      uni.hideLoading();
      uni.hideToast();
    }
  }
};