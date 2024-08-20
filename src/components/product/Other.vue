<template>
  <a-form
    :model="form"
    :rules="rules"
    labelAlign="right"
    v-bind="layout"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 16 }"
    ref="formRef"
  >
    <a-row>
      <a-col :span="22">
        <a-form-item
          label="佣金到账类型"
          name="values"
        >
          <a-radio-group
            v-model:value="form.values"
            name="radioGroup"
          >
            <a-radio value="1">立即到账</a-radio>
            <a-radio value="2">订单完成到账</a-radio>
            <a-radio value="3">默认</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-col :span="22">
        <a-divider
          orientation="left"
          orientation-margin="50px"
        >
          广告信息
        </a-divider>
      </a-col>
      <a-col :span="22">
        <a-form-item
          label="广告设置"
          name="values"
        >
          <a-radio-group
            v-model:value="form.values"
            name="radioGroup"
          >
            <a-radio value="1">关闭</a-radio>
            <a-radio value="2">单独设置</a-radio>
            <a-radio value="3">系统设置</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-col :span="22">
        <a-divider
          orientation="left"
          orientation-margin="50px"
        >
          商品资质
        </a-divider>
      </a-col>
      <a-col :span="12">
        <a-form-item
          label="商品资质"
          name="fileList"
        >
          <common-ynd-upload
            title=" "
            v-model="form.sliderImage"
            :max-count="5"
            ez-width="auto"
          />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script lang="ts" setup>
const props = defineProps({
  formData: {
    type: Object,
    default: () => {},
  },
})
const layout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 17,
  },
}
const form = computed(() => props.formData)
const formRef = ref<Element>()
const rules = {
  productName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
}
defineExpose({
  formRef,
})
</script>
