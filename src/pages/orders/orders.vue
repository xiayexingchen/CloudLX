<template>
  <view class="container">
    <u-search placeholder="包裹编号搜索" v-model="search" @search="onSearch"></u-search>
    <u-datetime-picker v-model="date" mode="date" @change="onDateChange">时间选择器，待写</u-datetime-picker>
    <u-card :title="title" :sub-title="subTitle" :thumb="thumb">
      <template v-slot:body>
        <view>
          <view class="u-body-item u-flex u-border-bottom u-col-between u-p-t-0">
            <view class="u-body-item-title u-line-2">包裹2</view>
            <image
              src="https://img11.360buyimg.com/n7/jfs/t1/94448/29/2734/524808/5dd4cc16E990dfb6b/59c256f85a8c3757.jpg"
              mode="aspectFill"></image>
          </view>
          <view class="u-body-item u-flex u-row-between u-p-b-0">
            <view class="u-body-item-title u-line-2">包裹1</view>
            <image
              src="https://img12.360buyimg.com/n7/jfs/t1/102191/19/9072/330688/5e0af7cfE17698872/c91c00d713bf729a.jpg"
              mode="aspectFill"></image>
          </view>
        </view>
      </template>
      <template v-slot:foot>
        <view class=""><u-icon name="chat-fill" size="34" color="" label="30评论"></u-icon></view>
      </template>
    </u-card>
    <!--    <u-list>
      <u-list-item v-for="(order, index) in orders" :key="index" :title="'已签收'" :note="order.details"
        :extra="order.time">
        <template #rightIcon>
          <u-icon name="delete" @click="onDelete(order)"></u-icon>
          <u-icon name="comment" @click="onEvaluate(order)"></u-icon>
        </template>
      </u-list-item>
    </u-list> -->
  </view>
</template>

<script setup>
  import {
    ref
  } from 'vue';

  const search = ref('');
  const date = ref('');
  const orders = ref([{
      details: '已送至 天马一区一栋',
      time: '10-16 19:11:27'
    },
    // ...其他订单数据
  ]);

  function onSearch(value) {
    // 搜索订单的逻辑
  }

  function onDateChange(value) {
    // 根据选择的日期过滤订单
  }

  function onDelete(order) {
    // 删除订单的逻辑
  }

  function onEvaluate(order) {
    // 评价订单的逻辑
  }
</script>
<style>
  page {
    background-color: #ededed;
  }
</style>
<style scoped lang="scss">
  .container {
    padding: 20px;
  }

  .u-card-wrap {
    background-color: $u-bg-color;
    padding: 1px;
  }

  .u-body-item {
    font-size: 32rpx;
    color: #333;
    padding: 20rpx 10rpx;
  }

  .u-body-item image {
    width: 120rpx;
    flex: 0 0 120rpx;
    height: 120rpx;
    border-radius: 8rpx;
    margin-left: 12rpx;
  }
</style>