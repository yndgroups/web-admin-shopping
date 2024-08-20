<template>
  <a-form
    :model="formData"
    ref="form"
    :label-col="{ span: 4 }"
    :wrapper-col="{ span: 18 }"
  >
    <a-form-item
      label="联系电话"
      name="phone"
      :rules="[
        { required: true, message: '联系电话' },
        {
          pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
          message: '手机号格式不对',
          trigger: 'change',
        },
      ]"
    >
      <a-input-search
        v-model:value="formData.phone"
        placeholder="请输入联系电话"
        allow-clear
        enter-button
        @search="searchUser"
      />
    </a-form-item>
    <template v-if="hasUser">
      <a-form-item
        label="员工姓名"
        name="realName"
        :rules="[{ required: true, message: '请输入员工姓名' }]"
      >
        <a-input
          v-model:value="formData.realName"
          placeholder="请输入员工姓名"
          allow-clear
          disabled
        />
      </a-form-item>
      <a-form-item
        label="电子邮箱"
        name="email"
        :rules="[
          {
            pattern: /^[A-Za-z\d]+([-_\.][A-Za-z\d]+)*@([A-Za-z\d]+[-\.])+[A-Za-z\d]{2,4}(,[A-Za-z\d]+([-_\.][A-Za-z\d]+)*@([A-Za-z\d]+[-\.])+[A-Za-z\d]{2,4})*$/,
            message: '请输入正确的邮箱',
            trigger: 'change',
          },
        ]"
      >
        <a-input
          v-model:value="formData.email"
          placeholder="请输入电子邮箱"
          allow-clear
          type="email"
          disabled
        />
      </a-form-item>
      <a-form-item
        label="岗位名称"
        name="jobName"
        :rules="[{ required: true, message: '请输入岗位名称' }]"
      >
        <a-input
          v-model:value="formData.jobName"
          placeholder="请输入岗位名称"
          allow-clear
        />
      </a-form-item>
      <a-form-item
        label="员工照片"
        name="avatar"
        :rules="[{ required: true, message: '请上传员工照片' }]"
      >
        <common-ynd-upload
          v-model="formData.avatar"
          accept="image/*"
          ezWidth=""
        />
      </a-form-item>
      <a-form-item
        label="核销开关"
        name="verifyStatus"
      >
        <a-switch
          v-model:checked="formData.verifyStatus"
          checked-children="开"
          un-checked-children="关"
          :checkedValue="1"
          :unCheckedValue="0"
        />
      </a-form-item>
      <a-form-item
        label="订单推送"
        name="pushStatus"
      >
        <a-switch
          v-model:checked="formData.pushStatus"
          checked-children="开"
          un-checked-children="关"
          :checkedValue="1"
          :unCheckedValue="0"
        />
      </a-form-item>
    </template>
    <div class="text-center">
      <a-button
        type="primary"
        @click="onSave"
      >
        提交
      </a-button>
    </div>
  </a-form>
</template>

<script lang="ts" setup>
import apis from '@/apis'
import { Modal } from 'ant-design-vue'

interface Data {
  brandId: string
  [key: string]: any
}
const props = defineProps({
  mode: {
    type: Number,
    default: 1,
  },
  modalData: {
    type: Object,
    default: null,
  },
  methods: {
    type: Object,
    default: null,
  },
})
let hasUser = ref(false)
let formData = reactive<any>({
  userId: '',
  brandId: '',
  realName: '',
  phone: '',
  email: '',
  avatar: '',
  jobName: '',
  verifyStatus: 0,
  pushStatus: 0,
})
const form = ref<any>()

const searchUser = async () => {
  let { data, code } = await apis.postJSON(apis.findUserIdByUserParam, {
    data: {
      phone: formData.phone,
      userName: '',
    },
  })
  if (code == 1 && data) {
    formData.userId = data.userId || ''
    formData.realName = data.realName || ''
    formData.email = data.email || ''
    hasUser.value = true
  } else {
    hasUser.value = false
    Modal.confirm({
      title: '用户信息查询失败',
      content: '请进入小程序进行登录，完善信息之后再来进行员工添加！',
      cancelText: ' ',
    })
  }
}

onMounted(() => {
  if (props.modalData) {
    formData.brandId = `${props.modalData.brandId}`
    for (let key in props.modalData) {
      formData[key] = props.modalData[key]
    }
    hasUser.value = true
  }
})

const onSave = () => {
  // @ts-ignore
  Logger.warn(`自定义表单测试 => ${props.mode}`, props.mode, formData)
  form.value.validateFields().then(async () => {
    if (props.methods) {
      props.methods.onSave(props.mode, formData)
    }
  })
}
</script>
