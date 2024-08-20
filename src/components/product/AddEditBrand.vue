<template>
  <a-modal
    v-model:open="showModal"
    :title="type === 0 ? '添加品牌' : type === 1 ? '修改品牌' : '详情'"
    :width="1200"
    :bodyStyle="{ height: '70vh', overflowX: 'auto' }"
    @cancel="emit('closeModal')"
    class="modal-box"
    @ok="submit"
    :okButtonProps="{ disabled: type === 2 }"
  >
    <a-form
      :model="formData"
      ref="form"
    >
      <a-row :gutter="20">
        <a-col :span="12">
          <a-form-item
            label="品牌名称"
            name="name"
            :rules="[{ required: true, message: '请输入品牌名称' }]"
          >
            <a-input
              v-model:value="formData.name"
              placeholder="请输入品牌名称"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="展示类型"
            name="displayType"
            :rules="[{ required: true, message: '请选择展示类型' }]"
          >
            <select-dict-select
              v-model:value="formData.displayType"
              dictType="display-Type"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="品牌网址"
            name="url"
            :rules="[{ required: true, message: '请输入品牌网址' }]"
          >
            <a-input
              v-model:value="formData.url"
              placeholder="请输入网址"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="排序"
            name="sortBy"
          >
            <a-input
              type="number"
              v-model:value="formData.sortBy"
              placeholder="请输入排序"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-col>
          <a-form-item
            label="品牌logo"
            name="logo"
            :rules="[{ required: true, message: '请上传品牌logo' }]"
          >
            <common-ynd-upload
              v-model="formData.logo"
              accept="image/*"
              ezWidth=""
            />
          </a-form-item>
        </a-col>
        <a-col>
          <a-form-item
            label="品牌介绍"
            name="introduction"
          >
            <CommonYndRichText
              v-model="formData.introduction"
              v-model:value="formData.introduction"
              height="800"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import apis from '@/apis'
import { HttpMethod } from '@/config/axios'
import { message } from 'ant-design-vue'
interface Data {
  brandId: string
  displayType: number
  introduction: string
  logo: string
  name: string
  sortBy: number
  url: string
}
const props = defineProps({
  visible: {
    type: Boolean,
    default: () => false,
  },
  row: {
    type: Object,
    default: () => {},
  },
  type: {
    type: Number,
    default: 0,
  },
})
const showModal = ref<boolean>(props.visible)
let formData = reactive<Data>({
  brandId: '',
  displayType: 0,
  introduction: '',
  logo: '',
  name: '',
  sortBy: 0,
  url: '',
})
const form = ref<any>()
const emit = defineEmits(['getData', 'closeModal'])
function submit() {
  form.value.validateFields().then(async () => {
    let { code, msg } = await apis.request({
      url: apis.addEditBrand,
      method: props.type === 0 ? HttpMethod.POST : HttpMethod.PUT,
      data: formData,
    })
    if (code === 1) {
      message.success(props.type === 0 ? '新增成功' : '修改成功')
      emit('getData')
      emit('closeModal')
    } else {
      message.warning(msg)
    }
  })
}

onMounted(() => {
  if (props.type === 1 || props.type === 2) {
    formData.brandId = props.row.brandId
    formData.displayType = props.row.displayType
    formData.introduction = props.row.introduction
    formData.logo = props.row.logo
    formData.name = props.row.name
    formData.sortBy = props.row.sortBy
    formData.url = props.row.url
  }
})
</script>
