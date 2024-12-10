<template>
  <view>
    <image :src="imageSrc" mode="widthFix" />
  </view>
</template>

<script setup>
  import {
    ref,
    onMounted
  } from 'vue';
  // const imageSrc = ref('http://192.168.31.118:80/robot/video_stream');
  const imageSrc = ref('http://120.46.199.126/robot/video_stream');
  // const imageSrc = ref('');

  // onMounted(() => {
  //   startVideoStream();
  // });

  // function startVideoStream() {
  //   // 设置视频流的URL
  //   const videoStreamUrl = 'http://192.168.31.118:80/robot/video_stream'; // 修改为你后端的实际URL

  //   const socket = uni.connectSocket({
  //     url: videoStreamUrl,
  //     success: () => {
  //       console.log('连接成功');
  //     },
  //     fail: (err) => {
  //       console.log('连接失败', err);
  //     }
  //   });

  //   socket.onMessage((data) => {
  //     const arrayBuffer = data.data;
  //     const blob = new Blob([arrayBuffer], {
  //       type: 'image/jpeg'
  //     });
  //     const objectURL = URL.createObjectURL(blob);
  //     imageSrc.value = objectURL;
  //   });

  //   socket.onError((err) => {
  //     console.log('Socket错误', err);
  //   });

  //   socket.onClose(() => {
  //     console.log('Socket连接关闭');
  //   });
  // }
</script>