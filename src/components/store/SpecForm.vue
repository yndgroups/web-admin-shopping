<template>
  <div class="spec-form">
    <a-form
      ref="formRef"
      :model="state.formData"
      labelAlign="right"
      :label-col="{ span: 3 }"
      :wrapper-col="{ span: 20 }"
      :rules="state.rules"
    >
      <a-form-item
        name="name"
        label="规格名称"
      >
        <a-input
          v-model:value="state.formData.name"
          show-count
          :maxlength="30"
          placeholder="请输入规格名称"
          allow-clear
          :disabled="readOnly"
        ></a-input>
      </a-form-item>
      <a-form-item
        name="sortBy"
        label="排序"
      >
        <a-input-number
          v-model:value="state.formData.sortBy"
          style="width: 200px"
          placeholder="请输入排序"
          allow-clear
          min="1"
          max="100"
          :disabled="readOnly"
        />
      </a-form-item>
      <a-form-item
        name="sortBy"
        label="规格参数"
      >
        <a-table
          :dataSource="state.formData.options"
          :columns="columns"
          bordered
          :pagination="false"
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'name'">
              <span class="required">*</span>
              <a-input
                style="width: 200px"
                v-model:value="record.name"
                placeholder="规格项名称"
                :disabled="readOnly"
              />
              <span
                class="actions"
                v-if="!readOnly"
              >
                <PlusSquareOutlined
                  class="add"
                  @click="addItem(index)"
                />
                <MinusSquareOutlined
                  class="minus"
                  v-if="state.formData.options.length > 1"
                  @click="minusItem(index)"
                />
              </span>
            </template>
            <template v-if="column.key === 'options'">
              <ul class="options">
                <li
                  v-for="(_, i) in record.options"
                  :key="i"
                >
                  <span class="required">*</span>
                  <a-input
                    style="width: 250px"
                    v-model:value="record.options[i]"
                    placeholder="规格项名称"
                    :disabled="readOnly"
                  />
                  <span
                    class="actions"
                    v-if="!readOnly"
                  >
                    <PlusSquareOutlined
                      class="add"
                      @click="add(record, i)"
                    />
                    <MinusSquareOutlined
                      class="minus"
                      v-if="record.options.length > 1"
                      @click="minus(record, i)"
                    />
                  </span>
                </li>
              </ul>
            </template>
          </template>
        </a-table>
      </a-form-item>
      <div class="text-right pd-t20">
        <a-button
          class="mg-r10"
          @click="methods?.closeModal"
        >
          {{ readOnly ? '关闭' : '取消' }}
        </a-button>
        <a-button
          info
          @click="methods?.onValidate(formRef)"
          v-if="!readOnly"
          type="primary"
        >
          提交
        </a-button>
      </div>
    </a-form>
  </div>
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
  formData: props.modelData,
  options: [{ name: '', options: [] }],
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

function addItem(index: number) {
  state.formData.options.splice(index + 1, 0, { name: '', options: [''] })
}

function minusItem(index: number) {
  state.formData.options.splice(index, 1)
}

// 新增新增项
function add(record: AnyObject, i: number) {
  record.options.splice(i + 1, 0, '')
}

// 删除项
function minus(record: AnyObject, i: number) {
  record.options.splice(i, 1)
}
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
