<template>
  <a-modal
    v-model:open="showModal"
    :title="mode === 1 ? '新增模板' : mode === 2 ? '编辑模板' : '查看模板'"
    width="50%"
    @cancel="emit('closeModal')"
    @ok="mode !== 3 ? submit() : emit('closeModal')"
  >
    <div>
      <a-form
        :model="formData"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 18 }"
        ref="form"
      >
        <a-form-item
          label="模板名称"
          name="name"
          :rules="[{ required: true, message: '请输入模板名称' }]"
        >
          <a-input
            v-model:value="formData.name"
            placeholder="请输入运费模板名称"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          label="计费方式"
          name="billingMethods"
          :rules="[{ required: true, message: '请选择计费方式' }]"
        >
          <select-dict-select
            dictType="billing-methods"
            v-model:value="formData.billingMethods"
          />
        </a-form-item>
        <a-form-item
          label="是否包邮"
          name="appoint"
          :rules="[{ required: true, message: '请选择是否包邮' }]"
        >
          <select-dict-select
            dictType="appoint"
            v-model:value="formData.appoint"
          />
        </a-form-item>
        <a-form-item
          label="是否送达"
          name="noDelivery"
          :rules="[{ required: true, message: '请选择是否送达' }]"
        >
          <select-dict-select
            dictType="no_delivery"
            v-model:value="formData.noDelivery"
          />
        </a-form-item>
        <a-form-item
          label="排序"
          name="sortBy"
          :rules="[{ required: true, message: '请输入排序' }]"
        >
          <a-input-number
            v-model:value="formData.sortBy"
            :min="0"
            style="width: 100%"
          />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
import apis from '@/apis'
import { HttpMethod } from '@/config/axios'
import { message } from 'ant-design-vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: () => true,
  },
  rowData: {
    type: Object,
    default: () => {},
  },
  mode: {
    type: Number,
    default: () => 1,
  },
})
interface FormData {
  [k: string]: any
  name: string
  billingMethods: null
  appoint: null
  noDelivery: null
  sortBy: number
}
const showModal = ref<boolean>(props.visible)
const emit = defineEmits(['getData', 'closeModal'])
const form = ref()
const formData = reactive<FormData>({
  name: '',
  billingMethods: null,
  appoint: null,
  noDelivery: null,
  sortBy: 0,
})
function submit() {
  form.value.validateFields().then(async () => {
    let { code, msg } = await apis.request({
      url: apis.addEditDeleteTem,
      method: props.mode === 1 ? HttpMethod.POST : HttpMethod.PUT,
      data: formData,
    })
    if (code === 1) {
      message.success(props.mode === 1 ? '新增成功' : '修改成功')
      emit('getData')
      emit('closeModal')
    } else {
      message.warning(msg)
    }
  })
}
watch(
  () => props.visible,
  val => {
    if (!val) {
      // 每次关闭应该重置表单，id没有绑定表单，所以得手动重置
      form.value.resetFields()
      formData.tempId = ''
    }
  },
)
onMounted(() => {
  if (props.mode !== 1) {
    for (let key in formData) {
      formData[key] = props.rowData[key]
    }
    formData.noDelivery = props.rowData.noDelivery
    formData.tempId = props.rowData.tempId
  }
})
</script>
