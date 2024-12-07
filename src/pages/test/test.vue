 <template>
   <view>
     message页面
     <button type="primary" @click="chooseImg">上传图片</button>
     <img v-for="img in imgArr" :src="img" @click="previewImg(img)">
   </view>
 </template>

 <script>
   export default {
     data() {
       return {
         imgArr: []
       }
     },
     methods: {
       chooseImg() {
         uni.chooseImage({
           count: 9,
           success: (res) => {
             this.handleImageToBase64(res.tempFilePaths);
           }
         })
       },
       handleImageToBase64(imagePaths) {
         imagePaths.forEach((path) => {
           uni.getFileSystemManager().readFile({
             filePath: path,
             encoding: 'base64',
             success: (res) => {
               console.log("res", res);
               this.imgArr.push('data:image/jpeg;base64,' + res
                 .data); // 将Base64编码的图片数据存入数组
             },
             fail: (error) => {
               console.error('Failed to read file:', error);
             }
           });
         });
       },
       previewImg(index) {
         // 根据索引预览图片
         uni.previewImage({
           current: this.imgArr[index], // 当前预览的图片路径
           urls: this.imgArr // 预览的图片数组
         })
         console.log("current2", this.imgArr);
       }
     }
   }
 </script>

 <style scoped>

 </style>
 <!-- <template>
  <view class="img-boxs">
    <image :src="userInfo.avatar" @click="handleUpImg"> </image>
    <cover-view>修改头像</cover-view>
  </view>

</template>

<script setup>
  import {
    ref
  } from 'vue';
  import { modifyAvatarAPI } from '@/api/api-user.js'
  // 使用 ref 来管理响应式数据
  const userInfo = ref({
    avatar: '', // 默认头像
    userName: 'John Doe' // 假设用户名为 John Doe
  });

  // // 处理上传头像的函数
  // const handleUpImg = () => {
  //   // 点击图片区域，选择图片并上传
  //   uni.chooseImage({
  //     count: 1, // 选择一张图片
  //     success: (res) => {
  //       // 图片选择成功的回调
  //       userInfo.value.avatar = res.tempFilePaths[0]; // 更新视图

  //       // 上传图片
  //       uni.uploadFile({
  //         url: 'http://127.0.0.1:4523/m1/5326600-4997107-default/user/modifyAvatar', // 请求地址
  //         filePath: res.tempFilePaths[0], // 临时文件路径
  //         name: 'avatarfile', // 文件对应的 key 值
  //         header: {
  //           type: 'client' // 请求头中需要的额外数据
  //         },
  //         formData: {
  //           userName: userInfo.value.userName // 额外的表单数据，传递用户名
  //         },
  //         success: (uploadRes) => {
  //           // 上传成功后的回调
  //           console.log('头像上传成功', uploadRes);
  //         },
  //         fail: (err) => {
  //           // 上传失败后的回调
  //           console.error('头像上传失败', err);
  //         }
  //       });
  //     },
  //     fail: (err) => {
  //       console.error('选择图片失败', err);
  //     }
  //   });
  // };
  // ... existing code ...

  const handleUpImg = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      uni.getFileSystemManager().readFile({
        filePath: res.tempFilePaths[0],
        encoding: 'base64',
        success: async (base64Res) => {
          const base64Data = `data:image/jpeg;base64,${base64Res.data}`;
          userInfo.value.avatar = base64Data; // 更新视图

          try {
            const res = await modifyAvatarAPI(base64Data)
            console.log('头像上传成功', res)
          } catch (err) {
            console.error('头像上传失败', err)
          }
        },
        fail: (err) => {
          console.error('读取图片失败', err);
        }
      });
    },
    fail: (err) => {
      console.error('选择图片失败', err);
    }
  });
};

  // ... existing code ...
</script>

<style scoped>
  .img-boxs {
    width: 100px;
    height: 100px;
    border-radius: 100%;
    position: relative;
    overflow: hidden;
  }

  .img-boxs image {
    width: 100px;
    height: 100px;
    border-radius: 100%;
    margin-bottom: 10px;
  }

  .img-boxs cover-view {
    width: 100px;
    height: 40px;
    text-align: center;
    color: #fff;
    background-color: rgba(107, 96, 99, .4);
    position: absolute;
    left: 50%;
    top: 66%;
    transform: translate(-50%, 0);
  }
</style> -->