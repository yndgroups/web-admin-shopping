<template>
  <a-cascader
    :options="options"
    :load-data="loadData"
    change-on-select
    v-bind="$attrs"
    allow-clear
    placeholder="请选择地区"
    :fieldNames="{ label: 'areaName', value: 'areaCode' }"
  />
</template>

<script lang="ts" setup>
import apis from '@/apis'

const options = ref([])
const loadData = (selectedOptions: any) => {
  const targetOption = selectedOptions[selectedOptions.length - 1]
  getAeraList(targetOption.areaCode).then(res => {
    if (res) {
      targetOption.children = res || []
    } else {
      targetOption.isLeaf = true
    }
  })
}

async function getAeraList(parentCode: string) {
  let { data, code, msg } = await apis.getJSON(apis.getParenCodeAreaList + `?parentCode=${parentCode}`)
  if (code === 1) {
    data.forEach((item: any) => {
      item.children = []
      item.isLeaf = false
    })
    return data
  }
}
onMounted(() => {
  getAeraList('000000000000').then(res => {
    options.value = res || []
  })
})
</script>
