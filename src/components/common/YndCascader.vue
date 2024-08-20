<template>
  <div
    class="m-cascader"
    v-if="state.options && state.options.length"
  >
    <a-cascader
      change-on-select
      :load-data="loadData"
      v-model:value="state.value"
      :field-names="{
        label: 'name',
        value: 'productCategoryId',
        children: 'children',
      }"
      :options="state.options"
      :placeholder="props.placeholder"
      @change="change"
    />
  </div>
</template>
<script lang="ts" setup>
import { message } from 'ant-design-vue'
import apis from '@/apis'
let props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '请选择',
  },
  fields: {
    type: Array,
    default: () => ['value', 'label'],
  },
  productCategoryId: {
    type: String,
    default: '1',
  },
})
let emit = defineEmits(['change', 'update:modelValue'])
let state = reactive({
  value: [],
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
  let { data, code, msg } = await apis.getJSON(apis.findProductCategoryChildrenListByParentId + targetOption.productCategoryId)
  if (code === 1) {
    targetOption.children = data
    state.options = [...state.options]
  } else {
    targetOption.children = []
    state.options = [...state.options]
    message.warning(msg)
  }
  opt.loading = false
}

/**
 * 查询一级分类
 */
const getCategoryListByParentId = async (parentId: string) => {
  state.options = []
  let { data, code, msg } = await apis.getJSON(apis.findProductCategoryChildrenListByParentId + parentId)
  if (code === 1) {
    state.options = data.map((item: any) => {
      item.isLeaf = item.CHildCount == 0
      return item
    })
  } else {
    state.options = []
    message.warning(msg)
  }
}

/**
 * 事件传递
 * 记住： 改造到必须选择第三级分类菜传递
 */
const change = (value: any) => {
  if (value.length == 0) {
    emit('change', [])
    emit('update:modelValue', [])
  } else if (value.length > 1) {
    emit('change', value[value.length - 1])
    emit('update:modelValue', value)
  }
}
</script>
