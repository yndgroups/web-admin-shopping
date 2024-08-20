<template>
  <div>
    <a-select
      v-bind="attrs"
      :disabled="disabled"
      :fieldNames="{ label: 'description', value: 'dictValue' }"
      :options="options"
      v-model:value.trim="currentValue"
      @change="changeDictSelect"
      :placeholder="placeholder"
    ></a-select>
  </div>
</template>
<script lang="ts" setup>
import apis from '@/apis'
import { message } from 'ant-design-vue'

const attrs = useAttrs()
let props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  dictParentId: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
let currentValue = ref(props.modelValue)
const emit = defineEmits(['update:modelValue'])
const { proxy } = getCurrentInstance() as any
let options = ref([])

onBeforeMount(async () => {
  let { data, code, msg } = await apis.getJSON(`/api/common/dict/findDictListByParentId/${props.dictParentId}`)
  if (code === 1 && data && data.length) {
    options.value = data || []
    return
  }
  message.warning('没有查询到对应的字典列表')
})

const changeDictSelect = (val: any) => {
  emit('update:modelValue', val)
}
</script>
