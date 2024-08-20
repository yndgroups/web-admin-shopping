<template>
  <a-select
    v-bind="$attrs"
    allow-clear
    placeholder="请选择"
  >
    <a-select-option
      v-for="item in options"
      :value="item.value"
      :key="item.value"
    >
      {{ item.label }}
    </a-select-option>
  </a-select>
</template>

<script lang="ts" setup>
import dict from '@/utils/dict'
import { Select } from 'ant-design-vue'
const ASelectOption = Select.Option
import { computed } from 'vue'
const props = defineProps({
  dictType: {
    type: String,
    required: true,
  },
})
const options = computed(() => {
  return dict[props.dictType]
})
</script>
