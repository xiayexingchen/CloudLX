const apiConfig = {
  dev: { //后端ip
    //apiUrl: 'http://192.168.31.118:80',
    apiUrl: 'http://127.0.0.1:4523/m1/5326600-4997107-default' //apifox
    //apiUrl: 'http://192.168.31.19:4523/m1/5326600-4997107-default' //真机调试，主机ip
    //apiUrl: 'http://192.168.8.90:4523/m1/5326600-4997107-default' //真机调试，主机ip
  },
  prod: { //apifox模拟后端ip
    apiUrl: 'http://127.0.0.1:4523/m1/5326600-4997107-default'
  },
  tmp: { //真机调试，自己ip
    apiUrl: 'http://10.72.63.251:4523/m1/5326600-4997107-default'
  },
}
export default apiConfig