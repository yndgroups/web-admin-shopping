<template>
  <a-config-provider :locale="locale">
    <slot></slot>
  </a-config-provider>
</template>
<script setup lang="ts">
import zhCN from 'ant-design-vue/lib/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
const locale = zhCN
</script>
