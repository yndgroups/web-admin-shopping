<template>
  <a-modal
    v-model:open="showModal"
    :title="type === 0 ? '添加店铺' : type === 1 ? '修改店铺' : '详情'"
    :width="1000"
    :bodyStyle="{ height: '70vh', overflowX: 'auto' }"
    @cancel="emit('closeModal')"
    class="modal-box"
    @ok="submit"
    :okButtonProps="{ disabled: type === 2 }"
  >
    <a-form
      :model="formData"
      ref="form"
      :rules="rules"
      layout="vertical"
    >
      <a-row :gutter="20">
        <a-col :span="12">
          <a-form-item
            label="店铺名称"
            name="name"
            :rules="[{ required: true, message: '请输入店铺名称' }]"
          >
            <a-input
              v-model:value="formData.name"
              placeholder="请输入店铺名称"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="营业时间"
            name="time"
            :rules="[{ required: true, message: '请选择营业时间' }]"
          >
            <a-range-picker
              v-model:value="formData.time"
              value-format="YYYY-MM-DD HH:mm:ss"
              :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
              style="width: 100%"
              :placeholder="['请选择营业时间', '请选择营业时间']"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item
            label="门店推荐图"
            name="recommendImage"
            :rules="[{ required: true, message: '请输入简称' }]"
          >
            <common-ynd-upload
              v-model="formData.recommendImage"
              accept="image/*"
              ezWidth=""
              :maxCount="10"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="logo"
            name="logo"
            :rules="[{ required: true, message: '请上传logo' }]"
          >
            <common-ynd-upload
              v-model="formData.logo"
              accept="image/*"
              ezWidth=""
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="联系邮箱"
            name="email"
          >
            <a-input
              v-model:value="formData.email"
              placeholder="请输入联系邮箱"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="到期日期"
            name="endDate"
            :rules="[{ required: true, message: '请输入简称' }]"
          >
            <a-date-picker
              v-model:value="formData.endDate"
              value-format="YYYY-MM-DD HH:mm:ss"
              :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
              style="width: 100%"
              placeholder="请选择"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="搜索关键词"
            name="keyword"
            :rules="[{ required: true, message: '请输入搜索关键词' }]"
          >
            <a-input
              v-model:value="formData.keyword"
              placeholder="请输入搜索关键词"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="手机号码"
            name="mobile"
          >
            <a-input
              v-model:value="formData.mobile"
              placeholder="请输入手机号码"
              allow-clear
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item
            label="座机号码"
            name="phone"
          >
            <a-input
              v-model:value="formData.phone"
              placeholder="请输入座机号码"
              allow-clear
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item
            label="状态"
            name="status"
            :rules="[{ required: true, message: '请选择状态' }]"
          >
            <select-dict-select
              v-model:value="formData.status"
              dictType="enabled"
              placeholder="请选择状态"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="店铺分类"
            name="storeCategoryId"
          >
            <a-input
              v-model:value="formData.storeCategoryId"
              :min="0"
              style="width: 100%"
              placeholder="请输入店铺分类"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="核销时间"
            name="verificationTime"
            :rules="[{ required: true, message: '请输入核销时间' }]"
          >
            <a-date-picker
              v-model:value="formData.verificationTime"
              value-format="YYYY-MM-DD HH:mm:ss"
              :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
              style="width: 100%"
              placeholder="请选择"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="邮编"
            name="zipCode"
          >
            <a-input
              v-model:value="formData.zipCode"
              :min="0"
              style="width: 100%"
              placeholder="请输入邮编"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="店铺简介"
            name="introduction"
            :rules="[{ required: true, message: '请输入店铺简介' }]"
          >
            <CommonYndRichText
              v-model="formData.introduction"
              v-model:value="formData.introduction"
              height="500"
              placeholder="请输入店铺简介"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="店铺地址"
            name="address"
            :rules="[{ required: true, message: '请输入简称' }]"
          >
            <commonYndMaps
              v-model:address="formData.address"
              v-model:lat="formData.lat"
              v-model:lng="formData.lon"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import type { Rule } from 'ant-design-vue/es/form'
import dayjs from 'dayjs'
import apis from '@/apis'
import { HttpMethod } from '@/config/axios'
import { message } from 'ant-design-vue'

interface Data {
  storeId: string //商店主键id
  [key: string]: any
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
let formData = reactive<Data>({
  address: '',
  email: '',
  endDate: '',
  introduction: '',
  keyword: '',
  lat: '',
  logo: '',
  lon: '',
  mobile: '',
  name: '',
  phone: '',
  recommendImage: '',
  status: 0,
  storeCategoryId: '',
  storeId: '',
  verificationTime: '',
  zipCode: '',
  businessEndTime: '',
  businessStartTime: '',
  time: [],
})
const rules: Record<string, Rule[]> = {
  email: [
    {
      required: true,
      pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      trigger: 'change',
      message: '邮箱格式有误',
    },
  ],
  mobile: [
    {
      required: true,
      pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
      trigger: 'change',
      message: '手机号格式有误',
    },
  ],
  phone: [
    {
      required: true,
      pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,
      trigger: 'change',
      message: '座机号码格式有误',
    },
  ],
  storeCategoryId: [
    {
      required: true,
      pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
      trigger: 'change',
      message: '只能输入数字，如：965937',
    },
  ],
  zipCode: [
    {
      required: true,
      pattern: /^[0-9]\d{5}$/,
      trigger: 'change',
      message: '邮编格式有误',
    },
  ],
}
const showModal = ref<boolean>(props.visible)
const form = ref<any>()
const emit = defineEmits(['getData', 'closeModal'])
function submit() {
  form.value.validateFields().then(async () => {
    let info = {
      ...formData,
      businessEndTime: formData.time[1],
      businessStartTime: formData.time[0],
      day_time: null,
    }
    let { code, msg } = await apis.request({
      url: apis.addEditStore,
      method: props.type === 0 ? HttpMethod.POST : HttpMethod.PUT,
      data: info,
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
  if (props.type !== 0) {
    for (let key in formData) {
      formData[key] = props.row[key]
    }
    formData.time = [props.row.businessStartTime, props.row.businessEndTime]
  }
})
</script>
