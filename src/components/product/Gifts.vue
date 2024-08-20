<template>
  <!-- 赠礼 -->
  <a-form
    :model="form"
    :rules="rules"
    labelAlign="right"
    v-bind="layout"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 16 }"
    ref="formRef"
  >
    <a-row :gutter="10">
      <a-col :span="22">
        <a-form-item
          label="是否开启多买赠礼"
          name="values"
        >
          <a-radio-group
            v-model:value="form.values"
            name="radioGroup"
          >
            <a-radio value="1">是</a-radio>
            <a-radio value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>

      <a-col :span="22">
        <a-divider
          orientation="left"
          orientation-margin="0px"
        >
          积分信息
        </a-divider>
      </a-col>

      <a-col :span="22">
        <a-form-item
          label="积分抵扣"
          name="values"
        >
          <a-radio-group
            v-model:value="form.values"
            name="radioGroup"
          >
            <a-radio value="1">关闭</a-radio>
            <a-radio value="2">开启</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>

      <a-col :span="22">
        <a-form-item
          label="最高抵扣"
          name="values"
        >
          <a-input-number
            v-model:value="form.type"
            addon-after="元"
          />
        </a-form-item>
      </a-col>

      <a-col :span="22">
        <a-form-item
          label="购买商品赠送积分"
          name="values"
        >
          <a-input-number
            v-model:value="form.type"
            addon-after="积分"
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
