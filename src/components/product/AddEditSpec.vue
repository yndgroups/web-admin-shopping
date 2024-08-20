<template>
  <a-modal
    v-model:open="showModal"
    :title="type === 0 ? '添加分类' : '修改分类'"
    :width="800"
    :bodyStyle="{ height: '50vh', overflowX: 'auto' }"
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
        label="规格名称"
        name="name"
        :rules="[{ required: true, message: '请输入分类名称' }]"
      >
        <a-input
          v-model:value="formData.name"
          placeholder="请输入分类名称"
          allow-clear
        />
      </a-form-item>
      <a-form-item
        v-for="(domain, index) in formData.options"
        :key="index"
        :label="index === 0 ? '可选项' : ' '"
        :name="['options', index]"
        :rules="{
          required: true,
          message: 'domain can not be null',
          trigger: 'change',
        }"
      >
        <a-input
          v-model:value="formData.options[index]"
          placeholder="请输入可选项"
          style="width: 60%; margin-right: 8px"
        />
        <a-button
          v-if="index > 0"
          type="link"
          danger
          @click="removeDomain(index)"
        >
          删除
        </a-button>
        <a-button
          v-if="index + 1 === formData.options.length"
          @click="addDomain"
          type="link"
        >
          增加
        </a-button>
      </a-form-item>
      <a-form-item
        label="绑定分类"
        name="productCategoryId"
        :rules="[{ required: true, message: '请选择商品分类' }]"
      >
        <product-category-cascader
          v-model:value="formData.productCategoryId"
          productCategoryId="2021122212235000002"
          placeholder="请选择商品分类"
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
import { number } from 'echarts'
import { reactive, ref, getCurrentInstance, onMounted } from 'vue'
// interface Domain {
//     value: string;
//     key: number;
// }
interface Data {
  name: string
  options: any[]
  productCategoryId: string[]
  sortBy: 0
  specId: string
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
const showModal = ref<boolean>(props.visible)
let formData = reactive<Data>({
  name: '',
  options: [''],
  productCategoryId: [],
  sortBy: 0,
  specId: '',
})
const form = ref<any>()
const emit = defineEmits(['getData', 'closeModal'])
function submit() {
  form.value.validateFields().then(async () => {
    let info = {
      ...formData,
      options: JSON.stringify(formData.options),
      productCategoryId: formData.productCategoryId[formData.productCategoryId.length - 1 || 0] || '',
      sortBy: Number(formData.sortBy),
    }
    let { code, msg } = await apis.request({
      url: apis.AddEditSpec,
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
function removeDomain(index: number) {
  formData.options.splice(index, 1)
}
function addDomain() {
  if (formData.options[formData.options.length - 1] === '') {
    form.value.validateFields()
  } else {
    formData.options.push('')
  }
}
onMounted(() => {
  if (props.type === 1) {
    formData.name = props.row.name || ''
    formData.options = JSON.parse(props.row.options) || ['']
    formData.productCategoryId = [props.row.productCategoryId] || []
    formData.sortBy = props.row.sortBy || 0
    formData.specId = props.row.specId
  }
})
</script>
