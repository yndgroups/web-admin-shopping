<!-- <template>
  <div>
    <RouterView />
    <CommonRouterConfig show-tabbar="1" />
  </div>
</template> -->
<template>
  <a-config-provider :locale="zhCN">
    <router-view />
    <!-- <CommonRouterConfig show-tabbar="1" /> -->
  </a-config-provider>
</template>
<script lang="ts" setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import type { Viewport } from '@/core'
dayjs.locale('zh-cn')
let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 500
let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 500
let viewport = ref<Viewport>({
  vh: clientHeight,
  vw: clientWidth,
  timer: 0,
})
provide('viewport', viewport)
onMounted(() => {
  window.onresize = () => {
    if (viewport.value.timer) {
      clearTimeout(viewport.value.timer)
    }
    viewport.value.timer = setTimeout(() => {
      let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 500
      let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 500
      viewport.value.vh = clientHeight || 0
      viewport.value.vw = clientWidth || 0
    }, 100)
  }
})
</script>
