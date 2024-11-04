<template>
  <view class="container">
    <view class="header">
      <text class="time">12:00</text>
      <text class="title">免责声明</text>
    </view>
    <view class="content">
      <view class="section">
        <text class="section-title">一、[协议的范围]</text>
        <view class="section-content">
          <text>1.1 本条款是你与腾讯之间关于你使用小程序服务所订立的协议。“用户”是指注册、登录、使用微信小程序的个人或组织。</text>
          <text>1.2 微信用户使用小程序即成为该小程序的服务用户，微信小程序可以通过小程序平台为相关用户提供应用服务。</text>
          <text>1.3 小程序属于微信公众账号，在不与本条款冲突的情况下，你应遵守《微信公众平台服务协议》等协议规则关于微信公众帐号的其他相关规定。</text>
        </view>
      </view>
      <view class="section">
        <text class="section-title">二、[小程序注册]</text>
        <view class="section-content">
          <text>2.1 你在使用本服务前需要绑定个人信息。微信小程序通手机号进行绑定注册。</text>
          <text>2.2 用户在绑定完成后，方可使用相关功能。</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {};
    },
    methods: {}
  };
</script>

<style>
  .container {
    padding: 16px;
    background-color: #f5f5f5;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .time {
    font-size: 14px;
  }

  .title {
    font-size: 18px;
    font-weight: bold;
  }

  .section {
    margin-bottom: 16px;
  }

  .section-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .section-content {
    font-size: 14px;
    line-height: 1.5;
  }
</style>