<template>
  <a-modal
    v-model:open="showModal"
    title="新增用户"
    :width="1000"
    :bodyStyle="{ height: '70vh', overflowX: 'auto' }"
    @cancel="emit('closeModal')"
    class="modal-box"
    @ok="submit"
  >
    <a-form
      :model="formData"
      ref="form"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-row :gutter="10">
        <a-col :span="12">
          <a-form-item
            label="账户类型"
            name="userId"
            :rules="[{ required: true, message: '账户类型' }]"
          >
            <select-dict-select
              dictType="account-type"
              v-model:value="formData.userId"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="真实姓名"
            name="realName"
            :rules="[
              { required: true, message: '真实姓名' },
              {
                pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
                message: '手机号格式不对',
                trigger: 'change',
              },
            ]"
          >
            <a-input v-model="formData.realName" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
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
            <a-input v-model="formData.phone" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
interface Data {
  userId: string
  [key: string]: any
}
const props = defineProps({
  visible: {
    type: Boolean,
    default: () => false,
  },
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
const emit = defineEmits(['getData', 'closeModal'])
const showModal = ref<boolean>(props.visible)
let formData = reactive<Data>({
  userId: '',
  accountType: 0,
  authorizedValue: 'string',
  email: 'string',
  phone: 'string',
  realName: 'string',
  reasonsProhibition: 'string',
  regType: 0,
  sourceId: 'string',
  status: 0,
  userName: 'string',
  userPassword: 'string',
})
const form = ref<any>()

onMounted(() => {
  if (props.modalData) {
    formData.userId = props.modalData.userId
    for (let key in props.modalData) {
      formData[key] = props.modalData[key]
    }
  }
})

const submit = () => {
  Logger.warn(`自定义表单测试 => ${props.mode}`, props.mode, formData)
  form.value.validateFields().then(async () => {
    if (props.methods) {
      props.methods.onSave(props.mode, formData)
    }
  })
}
</script>
