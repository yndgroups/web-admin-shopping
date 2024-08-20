<template>
  <span>{{ text }}</span>
</template>

<script setup lang="ts">
import dict from '@/utils/dict'
import { computed } from 'vue'
const props = defineProps({
  dictType: {
    type: String,
    required: true,
  },
  value: {
    required: true,
  },
})
const text = computed(() => {
  let list = dict[props.dictType].filter((item: any) => {
    return item.value === Number(props.value)
  })
  return list.length ? list[0].label : '--'
})
</script>
