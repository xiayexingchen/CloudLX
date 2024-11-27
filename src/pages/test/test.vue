<template>
  <u-calendar v-model="show" :mode="mode" @change="change"></u-calendar>
</template>

<script setup>
  import {
    ref
  } from 'vue';

  // 状态变量
  const show = ref(true);
  const mode = ref('range');

  // 方法
  const change = (e) => {
    console.log(e);
  };
</script>