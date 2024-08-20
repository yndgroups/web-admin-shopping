<template>
  <div class="form-container">
    <a-form
      ref="formRef"
      :model="state.formData"
      labelAlign="right"
      :label-col="{ span: 4 }"
    >
      <a-form-item
        name="title"
        label="店铺选择"
      >
        <common-ynd-select-store
          :disabled="isReadonly"
          v-model:value="state.formData.storeId"
        ></common-ynd-select-store>
      </a-form-item>
      <a-form-item
        name="title"
        label="显示位置"
      >
        <common-ynd-select-store
          :disabled="isReadonly"
          v-model:value="state.formData.storeId"
        ></common-ynd-select-store>
      </a-form-item>
      <a-form-item
        name="title"
        label="备注"
      >
        <a-input
          v-model:value="state.formData.remarks"
          :disabled="isReadonly"
          show-count
          :maxlength="100"
          placeholder="请输入备注"
          allow-clear
        ></a-input>
      </a-form-item>
      <a-form-item
        v-for="(item, index) in state.formData.content"
        :label="'广告图片' + (index + 1)"
        :key="index"
        :label-col="{ span: 4 }"
      >
        <div class="list-item">
          <a-row>
            <a-col :span="4">
              <common-ynd-upload
                :disabled="isReadonly"
                title="尺寸 750 * 300"
                v-model="item.imageUrl"
                :max-count="1"
                ez-width="auto"
              />
            </a-col>
            <a-col :span="17">
              <div class="pd-b10">
                <span class="pd-r10">标题:</span>
                <a-input
                  v-model:value="item.title"
                  :disabled="isReadonly"
                  show-count
                  :maxlength="30"
                  placeholder="请输入标题"
                  allow-clear
                ></a-input>
              </div>
              <div class="pd-b10">
                <span class="pd-r10">目标地址:</span>
                <a-input
                  v-model:value="item.targetUrl"
                  :disabled="isReadonly"
                  show-count
                  :maxlength="150"
                  placeholder="请输入目标地址"
                  allow-clear
                ></a-input>
              </div>
            </a-col>
            <a-col :span="3">
              <minus-circle-outlined
                v-if="index > 0"
                @click="removeAddItem(index)"
                class="pd-l10 fs20"
              />
              <plus-circle-outlined
                v-if="index < 4"
                @click="addItem"
                class="pd-l10 fs20"
              />
            </a-col>
          </a-row>
        </div>
      </a-form-item>
    </a-form>
    <div class="btn-group text-right">
      <a-button
        class="mg-r20"
        @click="methods?.closeModal()"
        v-if="mode !== Mode.DETAIL"
      >
        取消
      </a-button>
      <a-button
        type="primary"
        @click="submitForm"
      >
        {{ mode === Mode.DETAIL ? '返回' : '提交' }}
      </a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const formRef = ref()
import apis from '@/apis'
import { Mode } from '@/core'
import { message } from 'ant-design-vue'
const props = defineProps({
  mode: {
    type: String,
    default: Mode.DETAIL,
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

const isReadonly = computed(() => {
  return props.mode === Mode.DETAIL
})

const state = reactive({
  formData: props.modelData,
  fileList: [],
})

// 提交表单数据
const submitForm = () => {
  console.log(props.mode, state.formData, 'submitForm')
  formRef.value.validate().then(async () => {
    if (props.mode === Mode.CREATE) {
      let { code, errMsg } = await apis.postJSON(apis.storeAd, {
        data: state.formData,
      })
      if (code === 1) {
        message.success('提交成功')
        props.methods?.closeModal()
      } else {
        message.error(errMsg)
      }
    } else if (props.mode === Mode.UPDATE) {
      let { code, errMsg } = await apis.putJSON(apis.storeAd, {
        data: state.formData,
      })
      if (code === 1) {
        message.success('提交成功')
        props.methods?.closeModal()
      } else {
        message.error(errMsg)
      }
    } else {
      props.methods?.closeModal()
    }
  })
}

// 移除项
const removeAddItem = (index: any) => {
  state.formData.content.splice(index, 1)
}

// 添加项
const addItem = () => {
  if (state.formData.content.length < 5) {
    state.formData.content.push({
      imageUrl: '',
      targetUrl: '',
      title: '',
    })
  } else {
    message.error('最多只能添加五个广告图片')
  }
}
</script>

<style lang="scss" scoped>
.form-container {
  padding-top: 20px;

  .ant-tabs-tabpane {
    max-height: 55vh;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 20px;
  }
  .list-item {
    border-bottom: 1px dashed rgb(220, 217, 217);
    padding-bottom: 20px;
  }
}
</style>
