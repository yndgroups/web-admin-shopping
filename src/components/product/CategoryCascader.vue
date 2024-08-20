<template>
  <div
    class="ez-categroy-cascader"
    v-if="state.options && state.options.length"
  >
    <a-cascader
      change-on-select
      :load-data="loadData"
      :field-names="{
        label: 'name',
        value: 'productCategoryId',
        children: 'children',
      }"
      :options="state.options"
      v-bind="$attrs"
    />
  </div>
</template>
<script lang="ts" setup>
import apis from '@/apis'
import { message } from 'ant-design-vue'
import { reactive, getCurrentInstance, onBeforeMount } from 'vue'
const { proxy } = getCurrentInstance() as any
let props = defineProps({
  productCategoryId: {
    type: String,
    default: '0',
  },
})
let state = reactive({
  options: [],
})

onBeforeMount(() => {
  getCategoryListByParentId(props.productCategoryId)
})

/**
 * 动态加载下一级分类
 */
const loadData = async (opt: any) => {
  const targetOption = opt[opt.length - 1]
  opt.loading = true
  let { data, code, msg } = await apis.getJSON(apis.categoryFindListByParentId + targetOption.productCategoryId)
  if (code === 1) {
    targetOption.children = data.map((item: any) => {
      item.isLeaf = item.childCount == 0
      return item
    })
  } else {
    targetOption.children = []
    message.warning(msg)
  }
  opt.loading = false
}

/**
 * 查询一级分类
 */
const getCategoryListByParentId = async (parentId: string) => {
  state.options = []
  let { data, code, msg } = await apis.getJSON(apis.categoryFindListByParentId + parentId)
  if (code === 1) {
    state.options = data.map((item: any) => {
      item.isLeaf = parentId != props.productCategoryId
      item.level = 1
      return item
    })
  } else {
    state.options = []
    message.warning(msg)
  }
}
</script>
