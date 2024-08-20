<template>
  <div>
    <a-select
      v-bind="$attrs"
      v-model:value.trim="currentValue"
      show-search
      placeholder="请选择店铺"
      :default-active-first-option="false"
      :show-arrow="false"
      :filter-option="false"
      :not-found-content="null"
      :fieldNames="{ label: 'name', value: 'storeId' }"
      :options="options"
      @search="handleSearch"
      @change="handleChange"
    ></a-select>
  </div>
</template>
<script lang="ts" setup>
import apis from '@/apis'
import { message } from 'ant-design-vue'
const options = ref([])
let props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  storeName: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update:modelValue'])
let currentValue = ref(props.modelValue)
let timer: NodeJS.Timeout
onBeforeMount(() => {
  if (props.storeName) {
    getStoreListByName(props.storeName)
  }
})
const handleSearch = (val: any) => {
  getStoreListByName(val)
}
const handleChange = (val: any) => {
  emit('update:modelValue', `${val}`)
}
const getStoreListByName = (val: any) => {
  if (!val) {
    return
  }
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(async () => {
    let { data, code, msg } = await apis.getJSON(`${apis.storeFindList}?storeName=${val}`)
    code === 1 && data && data.length ? (options.value = data || []) : message.warning(msg)
  }, 1000)
}
</script>
