<template>
  <a-select
    v-bind="$attrs"
    allow-clear
    placeholder="请选择"
    show-search
    :filter-option="false"
    @search="handleSearch"
    @change="handleChange"
  >
    <a-select-option
      v-for="item in options"
      :value="item.productId"
      :key="item.productId"
    >
      {{ item.productName }}
    </a-select-option>
  </a-select>
</template>

<script lang="ts" setup>
import apis from '@/apis'
import { Select } from 'ant-design-vue'
const ASelectOption = Select.Option
const options = ref<any>([])
const timer = ref<NodeJS.Timeout>(0)
const productName = ref('')
async function getList(productName: string = '') {
  options.value = []
  let { data, code } = await apis.postJSON(apis.findProductPageList, {
    data: {
      pageIndex: 1,
      pageSize: 50,
      params: { productName: productName },
    },
  })
  if (code === 1) {
    options.value = data.list || []
  }
}
function handleSearch(val: string) {
  if (timer.value) {
    clearTimeout(timer.value)
  }
  timer.value = setTimeout(function () {
    getList(val)
    productName.value = val
  }, 1500)
}
function handleChange(val: string) {
  getList(productName.value)
}
onMounted(() => {
  getList()
})
</script>
