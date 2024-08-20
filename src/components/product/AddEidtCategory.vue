<template>
  <a-modal
    v-model:open="showModal"
    :title="type ? '修改分类 ' : '添加分类'"
    :width="800"
    :bodyStyle="{ height: '28vh' }"
    @cancel="emit('closeModal')"
    class="modal-box"
    @ok="submit"
  >
    <a-form
      :model="formData"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 19 }"
      ref="form"
    >
      <a-form-item
        label="分类名称"
        name="name"
        :rules="[{ required: true, message: '请输入分类名称' }]"
      >
        <a-input
          v-model:value="formData.name"
          placeholder="请输入运费分类名称"
          allow-clear
        />
      </a-form-item>
      <a-form-item
        label="普通店铺分佣比例"
        name="profitSharing"
      >
        <a-input
          v-model:value="formData.profitSharing"
          placeholder="请输入普通店铺分佣比例"
          allow-clear
        />
      </a-form-item>
      <a-form-item
        label="自营店铺分佣比例"
        name="selfRate"
      >
        <a-input
          v-model:value="formData.selfRate"
          placeholder="请输入自营店铺分佣比例"
          allow-clear
        />
      </a-form-item>
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
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import apis from '@/apis'
import { HttpMethod } from '@/config/axios'
import type { FormInstance } from 'ant-design-vue'
interface Data {
  name: string
  parentId: string
  productCategoryId: string
  profitSharing: string
  selfRate: string
  sortBy: number
}
const { proxy }: any = getCurrentInstance()
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
  name: '',
  parentId: '',
  productCategoryId: '',
  profitSharing: '',
  selfRate: '',
  sortBy: 0,
})
const showModal = ref<boolean>(props.visible)
const form = ref<any>()
const emit = defineEmits(['getData', 'closeModal'])
function submit() {
  form.value.validateFields().then(async () => {
    let { code, msg } = await apis.request({
      url: apis.addOrEditCategory,
      method: props.type === 0 ? HttpMethod.POST : HttpMethod.PUT,
      data: formData,
    })
    if (code === 1) {
      message.success(props.type === 1 ? '新增成功' : '修改成功')
      emit('getData')
      emit('closeModal')
    } else {
      message.warning(msg)
    }
  })
}
onMounted(() => {
  if (props.type === 0) {
    formData.parentId = props.row.id
  } else {
    formData.name = props.row.name
    formData.parentId = props.row.parentId
    formData.productCategoryId = props.row.productCategoryId
    formData.profitSharing = props.row.profitSharing
    formData.selfRate = props.row.selfRate
    formData.sortBy = props.row.sortBy
  }
})
</script>
