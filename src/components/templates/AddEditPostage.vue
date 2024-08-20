<template>
  <a-modal
    v-model:open="showModal"
    :title="mode === 1 ? '新增地区邮费模板' : mode === 2 ? '编辑地区邮费模板' : '查看地区邮费模板'"
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
const emit = defineEmits(['getData', 'closeModal'])
const form = ref()
const showModal = ref<boolean>(props.visible)
interface FormData {
  areaCode: Array<any>
  tempId: string
  [k: string]: any
}
const formData = reactive<FormData>({
  areaCode: [],
  tempId: '',
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
