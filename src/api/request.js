import apiConfig from '@/self-config.js'; // 引入配置文件

const timeout = 5000;


export default async (params) => {
  const base_url = apiConfig.dev.apiUrl; // 从配置文件读取 base_url
  const url = params.url;
  const method = params.method || 'GET';
  const data = params.data || {};
  const contentType = params.contentType || 'application/json;charset=UTF-8'; // 更灵活的 Content-Type
  const header = {
    //'Blade-Auth': uni.getStorageSync('token') || '',
    //'Content-Type': contentType,
    'Authorization': 'Bearer ' + uni.getStorageSync('token') || '',
    //'Tenant-Id': uni.getStorageSync('tenantId') || 'xxx',
    ...params.header
  };
  uni.showLoading({
    title: '加载中...'
  }); // 添加加载提示

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
      uni.clearStorageSync();
      uni.showModal({
        title: '提示',
        content: '请登录',
        showCancel: false,
        success() {
          setTimeout(() => uni.navigateTo({
            url: '/pages/login/index'
          }), 1000);
        }
      });
      throw new Error('Unauthorized'); // 抛出错误，以便在调用处处理
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
    uni.hideLoading();
    uni.hideToast();
  }
};