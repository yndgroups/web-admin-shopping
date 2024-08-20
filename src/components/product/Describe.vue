<template>
  <a-form
    :model="form"
    :rules="rules"
    labelAlign="right"
    v-bind="layout"
    layout="vertical"
    @validate="handleValidate"
    ref="formRef"
  >
    <a-form-item
      label="商品详情"
      name="content"
    >
      <CommonYndTnymce
        v-if="showDetail"
        v-model:value="form.content"
        :height="600"
      />
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>
const props = defineProps({
  formData: {
    type: Object,
    default: () => {},
  },
})
const form = computed(() => props.formData)
const rules = {
  content: [{ required: true, message: '请输入商品详情', trigger: 'change' }],
} as any
const layout = {
  labelCol: {
    span: 0,
  },
  wrapperCol: {
    span: 24,
  },
}
const showDetail = ref(false)
const formRef = ref<Element>()
const handleValidate = (...args: any) => {}
defineExpose({
  formRef,
})

nextTick(() => {
  showDetail.value = true
})
</script>
