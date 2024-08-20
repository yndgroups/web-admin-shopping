<template>
  <a-form
    :model="state.formData"
    labelAlign="right"
  >
    <a-tabs v-model:activeKey="state.activeKey">
      <a-tab-pane
        v-for="item in state.tablist"
        :key="item.value"
        :tab="item.label"
        class="a-tab-pane-box"
      >
        <store-basic
          v-if="state.activeKey === 1"
          :form-data="state.formData"
        ></store-basic>
        <store-contact
          v-if="state.activeKey === 2"
          :form-data="state.formData"
        ></store-contact>
        <store-rate
          v-if="state.activeKey === 3"
          :form-data="state.formData"
        ></store-rate>
        <store-setup
          v-if="state.activeKey === 4"
          :form-data="state.formData"
        ></store-setup>
      </a-tab-pane>
    </a-tabs>
    <div></div>
  </a-form>
</template>
<script lang="ts" setup>
import { Mode } from '@/core'
import { PlusSquareOutlined, MinusSquareOutlined } from '@ant-design/icons-vue'
import type { FormInstance } from 'ant-design-vue'
const formRef = ref<FormInstance>()
const props = defineProps({
  mode: {
    type: String,
    default: Mode.DETAIL,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  methods: {
    type: Object,
    default: undefined,
  },
  modelData: {
    type: Object,
    default: () => {},
  },
})

const state = reactive({
  formData: {
    ...props.modelData,
    fileList: [],
  },
  activeKey: 1,
  tablist: [
    { label: '基本信息', value: 1 },
    { label: '联系商家', value: 2 },
    { label: '结算费率', value: 3 },
    { label: '设置', value: 4 },
  ],
  rules: {
    name: [
      {
        required: true,
        message: '请输入规格名称',
        trigger: 'blur',
      },
    ],
    sortBy: [
      {
        required: true,
        message: '请输入排序',
        type: 'number',
        trigger: 'blur',
      },
    ],
  } as any,
})
const columns = [
  {
    title: '规格项',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '规格值',
    dataIndex: 'options',
    key: 'options',
  },
] as any
</script>

<style lang="scss" scoped>
.spec-form {
  padding-top: 24px;
}
.ant-tabs-tabpane {
  max-height: 55vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 20px;
}

.options {
  li {
    padding-bottom: 5px;
  }
}

.actions {
  font-size: 18px;
  padding-left: 10px;

  .add {
    margin-right: 10px;
    color: green;
  }

  .minus {
    margin-right: 10px;
    color: #f00;
  }
}
.required {
  color: #f00;
  padding-right: 5px;
}
</style>
