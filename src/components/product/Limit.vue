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
        <a-divider
          orientation="left"
          orientation-margin="50px"
        >
          限购设置
        </a-divider>
      </a-col>
      <a-col :span="22">
        <a-form-item
          label="购买限制"
          name="isLimit"
        >
          <a-radio-group
            v-model:value="form.isLimit"
            @change="changeLimit"
          >
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <template v-if="form.isLimit == 1">
        <a-col :span="22">
          <a-form-item
            label="限购数量"
            name="limitNum"
            :rules="[
              {
                required: form.specType == 0,
                message: '请输入限购数量',
                trigger: 'blur',
              },
            ]"
          >
            <a-input-number
              v-model:value="form.limitNum"
              style="width: 200px"
              placeholder="请输入限购数量"
            />
          </a-form-item>
        </a-col>
        <a-col :span="22">
          <a-form-item
            label="限购类型"
            name="limitType"
            :rules="[{ required: true, message: '请选择限购类型', trigger: 'change' }]"
          >
            <a-radio-group v-model:value="form.limitType">
              <a-radio :value="1">单次限购</a-radio>
              <a-radio :value="2">永久限购</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </template>
      <a-col :span="22">
        <a-divider
          orientation="left"
          orientation-margin="50px"
        >
          邮费设置
        </a-divider>
      </a-col>
      <a-col :span="22">
        <a-form-item
          label="请选择模板"
          name="tempId"
        >
          <select-templ-select v-model:value="form.tempId"></select-templ-select>
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
  isLimit: [{ required: true, message: '请选择是否限购', trigger: 'blur' }],
}
const changeLimit = (e: any) => {
  if (e.target.value === 0) {
    form.value.limitNum = null
    form.value.limitType = null
  }
}
defineExpose({
  formRef,
})
</script>
