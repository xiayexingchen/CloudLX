<template>
  <view>
    <view class="inputView">
      <text class="leftTitle">{{leftTitle}}</text>

      <input class="picker" :name="name" :value="value" :placeholder="placeholder" disabled="true"
        @click="chooseClick" />

      <image class="arrowImg0" mode="aspectFit" :src="bindImgSrc()"></image>

    </view>

    <view class="line"></view>
  </view>
</template>

<script>
  export default {
    name: "",
    props: {
      // 左边标题栏
      leftTitle: {
        type: String,
        default: ""
      },
      // 默认输入占位符
      placeholder: {
        type: String,
        default: ""
      },
      // 输入框name
      name: {
        type: String,
        default: ""
      },
      // 选择输入框值
      value: {
        type: String,
        default: ""
      },

    },
    data() {
      return {


      }
    },
    onLoad() {


    },
    methods: {
      bindImgSrc() {

        // #ifdef VUE3
        return new URL('../assets/img/home/container_bg.png', import.meta.url).href;
        // #endif

        // #ifndef VUE3
        return require('./arrow_right.png');
        // #endif
      },
      chooseClick(e) {


        this.$emit("click", e);

      },
    }

  }
</script>

<style scoped>
  .inputView {
    flex-direction: row;
    display: flex;
    height: 50px;
    align-items: center;
    width: 100%;
  }





  .leftTitle {
    margin-left: 20px;
    width: 72px;
    font-size: 28rpx;
    color: #333333;
  }

  .picker {
    margin-left: 0px;
    width: calc(100vw - 109px);
    height: 100rpx;
    font-size: 30rpx;
  }




  .arrowImg0 {
    margin-right: 22px;
    width: 30rpx;
    height: 30rpx;
  }

  .line {
    width: 90%;
    height: 2rpx;
    margin-left: -2rpx;
    background-color: #f8f8f8;
    margin-left: 5%;

  }
</style>