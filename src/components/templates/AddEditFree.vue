<template>
  <a-modal
    v-model:open="showModal"
    :title="mode === 1 ? '新增包邮模板' : mode === 2 ? '编辑包邮模板' : '查看包邮模板'"
    width="50%"
    @cancel="emit('closeModal')"
    @ok="mode !== 3 ? submit() : emit('closeModal')"
  >
    <a-form
      :model="formData"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }"
      ref="form"
    >
      <a-form-item
        label="地区"
        name="areaCode"
        :rules="[{ required: true, message: '地区不能为空' }]"
      >
        <select-area-cascader v-model:value="formData.areaCode" />
      </a-form-item>
      <!--  -->
      <a-form-item
        label="模板"
        name="tempId"
        :rules="[{ required: true, message: '模板不能为空' }]"
      >
        <select-templ-select v-model:value="formData.tempId" />
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
        label="计费方式"
        name="billingMethods"
        :rules="[{ required: true, message: '请选择计费方式' }]"
      >
        <select-dict-select
          dictType="billing-methods"
          v-model:value="formData.billingMethods"
        />
      </a-form-item>
    </a-form>
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
  areaCode: Array<any>
  tempId: string
  billingMethods: number
  number: number
  price: number
  [k: string]: any
}
const emit = defineEmits(['getData', 'closeModal'])
const form = ref()
const showModal = ref<boolean>(props.visible)
const formData = reactive<FormData>({
  areaCode: [],
  tempId: '',
  billingMethods: 0,
  number: 0,
  price: 0,
})
function submit() {
  form.value.validateFields().then(async () => {
    let pageInfo = {
      areaCode: formData.areaCode[formData.areaCode.length - 1],
      tempId: formData.tempId,
    }
    let { code, msg } = await apis.request({
      url: apis.addUndelivered,
      method: props.mode === 1 ? HttpMethod.POST : HttpMethod.PUT,
      data: pageInfo,
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
  }
})
</script>
