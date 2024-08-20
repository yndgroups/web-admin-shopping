<template>
  <!-- 核销 -->
  <a-form
    :model="form"
    :rules="rules"
    labelAlign="right"
    v-bind="layout"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 16 }"
    @validate="handleValidate"
    ref="formRef"
  >
    <a-row :gutter="10">
      <a-col :span="22">
        <a-form-item
          label="生成核销码个数"
          name="yuan"
        >
          <a-input
            type="number"
            v-model:value="form.yuan"
            allow-clear
          />
        </a-form-item>
      </a-col>

      <a-col :span="22">
        <a-form-item
          label="有效期"
          name="vlaus"
        >
          <a-tree
            v-model:selectedKeys="state.selectedKeys"
            :tree-data="state.treeData"
            defaultExpandAll
          >
            <template #title="{ title, key }">
              <a-form-item
                v-if="key === '102'"
                name="number"
              >
                有效时间起天
                <a-input-number
                  v-model:value="form.number"
                  size="small"
                  :min="1"
                  :max="100000"
                />
                内可使用
              </a-form-item>
              <a-form-item
                v-else-if="key === '103'"
                name="time"
              >
                在
                <a-range-picker
                  size="small"
                  separator="至"
                  v-model:value="form.time"
                />
              </a-form-item>

              <template v-else>{{ title }}</template>
            </template>
          </a-tree>
        </a-form-item>
      </a-col>
      <a-col :span="22">
        <a-form-item
          label="下单时间"
          name="radioGroup"
        >
          <a-radio-group
            v-model:value="form.radioGroup"
            name="radioGroup"
          >
            <a-radio value="1">每天限制购买时间</a-radio>
            <a-radio value="2">需提前购买限制天数（只针对票务商品）</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-col :span="22">
        <a-form-item
          label="核销保护期"
          name="radioGroup"
        >
          <a-radio-group
            v-model:value="form.radioGroup"
            name="radioGroup"
          >
            <a-radio value="1">关闭</a-radio>
            <a-radio value="2">开启</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-col :span="22">
        <a-form-item
          label="每日核销限制"
          name="radioGroup"
        >
          <a-checkbox-group v-model:value="form.values">
            <a-checkbox value="1">限制每日每单核销数量（该商品每日限制核销数量）</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
      </a-col>
      <a-col :span="22">
        <a-form-item
          name="checked"
          label="是否开启扫码枪"
        >
          <a-switch
            v-model:checked="form.checked"
            checked-children="开"
            un-checked-children="关"
          />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script lang="ts" setup>
import type { Rule } from 'ant-design-vue/es/form'
const formRef = ref<Element>()
const rules: Record<string, Rule[]> = {
  productName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
}
const layout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 17,
  },
}
const state = ref({
  expandedKeys: [],
  selectedKeys: [],
  checkedKeys: [],
  treeData: [
    {
      title: '付款后立即生效',
      key: '1',
      children: [
        { title: '生效时间起长期有效', key: '101' },
        { title: '', key: '102' },
        { title: '', key: '103' },
      ],
    },
    { title: '付款后次日生效', key: '2' },
  ],
})
const props = defineProps({
  formData: {
    type: Object,
    default: () => {},
  },
})
const form = computed(() => props.formData)
const handleValidate = (...args: any) => {}
defineExpose({
  formRef,
})
</script>
