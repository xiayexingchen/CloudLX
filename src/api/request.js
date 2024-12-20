import apiConfig from './self-config.js'; // 引入配置文件

const timeout = 5000;
// 添加一个标记变量来追踪是否已经显示了登录弹窗
let isShowingLoginModal = false;
// 添加一个全局变量来跟踪 loading 状态，哪个页面真机调试出错，就替换成自定义showLoading
let isShowLoading = false;

// 封装显示 loading 的方法
const showLoading = (title = '加载中...') => {
  isShowLoading = true;
  uni.showLoading({
    title,
    mask: true
  });
};

// 封装隐藏 loading 的方法
const hideLoading = () => {
  if (isShowLoading) {
    isShowLoading = false;
    uni.hideLoading();
  }
};

// 封装显示 toast 的方法
const showToast = (options) => {
  if (isShowLoading) {
    hideLoading();
  }
  uni.showToast(options);
};

export default async (params) => {
  const base_url = apiConfig.dev.apiUrl; // 从配置文件读取 base_url（后端）
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
  //真机调试showloading和toast冲突，注释掉了
    // showLoading({
    //   title: '加载中...'
    // });
  
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
    } else {
      showToast({
        title: `请求失败: ${res.statusCode}`,
        icon: 'none',
        duration: 2000
      });
      throw new Error(`HTTP error ${res.statusCode}`); // 抛出错误
    }
  } catch (error) {
    showToast({
      title: `请求出错: ${error.message}`,
      icon: 'none',
      duration: 2000
    });
    console.error('请求错误:', error); // 打印错误信息到控制台
    throw error; // 重新抛出错误，以便在调用处处理
  } finally {
    //  hideLoading();
    // uni.hideToast();
    
  }
};

// 导出这些方法供其他地方使用
export {
  showLoading,
  hideLoading,
  showToast
};