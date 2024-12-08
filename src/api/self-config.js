const apiConfig = {
  dev: { //����ip
    //apiUrl: 'http://192.168.31.118:80',
    apiUrl:'http://120.46.199.126:80',
    //apiUrl: 'http://127.0.0.1:4523/m1/5326600-4997107-default' //apifox
    //apiUrl: 'http://192.168.31.19:4523/m1/5326600-4997107-default' //�������ԣ�����ip
    //apiUrl: 'http://192.168.253.90:4523/m1/5326600-4997107-default' //�������ԣ�����ip
  },
  prod: { //apifoxģ������ip
    apiUrl: 'http://127.0.0.1:4523/m1/5326600-4997107-default'
  },
  tmp: { //�������ԣ��Լ�ip
    apiUrl: 'http://10.72.63.251:4523/m1/5326600-4997107-default'
  },
}
export default apiConfig