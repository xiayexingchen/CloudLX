<template>
  <view>
    <view class="user-box" style="display: flex; padding: 30px;">
      <view style="margin-right: 10px;">
        <u-avatar src="/static/logo.png" size="100"></u-avatar>
      </view>
      <view style="flex: 1; padding-bottom: 20px;">
        <view style="font-size: 18px;">大幕孤烟直</view>
      </view>
      <view style="margin-left: 10px; padding: 10px;">
        <u-icon name="arrow-right" color="#969799" size="28"></u-icon>
      </view>
    </view>
    <view style="margin-top: 20px;">
      <u-cell-group>
        <u-cell-item icon="star" title="我的地址" @click="toAddress"></u-cell-item>
        <u-cell-item icon="photo" title="我的钱包" @click="toWallet"></u-cell-item>
        <u-cell-item icon="heart" title="优惠券" @click="toDiscount"></u-cell-item>
        <u-cell-item icon="red-packet" title="反馈建议" @click="toFeedback"></u-cell-item>
        <u-cell-item icon="order" title="免责声明" @click="toDisclaimer"></u-cell-item>
        <!--     <u-cell-item icon="edit-pen" title="修改密码"></u-cell-item> -->
      </u-cell-group>
    </view>
    <view style="margin-top: 20px;">
      <u-cell-group>
        <u-cell-item icon="setting" title="退出账号"></u-cell-item>
      </u-cell-group>
    </view>
  </view>
</template>
<script setup>
  import {
    ref
  } from 'vue';
  const pic = ref('/static/logo.png');
  const show = ref(true);

  function toAddress() {
    // 跳转到地址页面的逻辑
    uni.navigateTo({
      url: '/pages/address/address'
    });
  };

  function toWallet() {
    // 跳转到钱包页面的逻辑
    uni.navigateTo({
      url: '/pages/wallet/wallet'
    });
  };

  function toDiscount() {
    // 跳转到优惠券页面的逻辑
    uni.navigateTo({
      url: '/pages/discount/discount'
    });
  };

  function toFeedback() {
    // 跳转到反馈建议页面的逻辑
    uni.navigateTo({
      url: '/pages/feedback/feedback'
    });
  };

  function toDisclaimer() {
    // 跳转到免责声明页面的逻辑
    uni.navigateTo({
      url: '/pages/disclaimer/disclaimer'
    });
  }
</script>
<style lang="scss">
  page {
    background-color: #ededed;
  }

  .camera {
    width: 54px;
    height: 44px;

    &:active {
      background-color: #ededed;
    }
  }

  .user-box {
    background-color: #fff;
  }
</style>