<template>
  <a-modal
    v-model:open="showModal"
    :maskClosable="false"
    :width="config.modelWidth"
    :title="mode == Md.CREATE ? '添加分类' : mode === Md.UPDATE ? '修改分类' : '详情'"
    @ok="handleOk"
    @cancel="emit('closeModal')"
  >
    <a-form
      :model="state.addForm"
      ref="addForm"
      :rules="state.rules"
      :label-col="state.labelCol"
      :wrapper-col="state.wrapperCol"
    >
      <a-form-item
        label="上级分类"
        name="name"
      >
        <a-input
          :value="state.parentName"
          disabled
        />
      </a-form-item>
      <a-form-item
        label="分类名称"
        name="name"
      >
        <a-input v-model:value.trim="state.addForm.name" />
      </a-form-item>
      <a-form-item
        label="自营店铺分佣比例"
        name="selfRate"
      >
        <a-input-number v-model:value.number="state.addForm.selfRate" />
      </a-form-item>
      <a-form-item
        label="普通店铺分佣比例"
        name="profitSharing"
      >
        <a-input-number v-model:value.number="state.addForm.profitSharing" />
      </a-form-item>
      <a-form-item
        label="排序"
        name="sortBy"
      >
        <a-input-number v-model:value.number="state.addForm.sortBy" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
import config from '@/config/theme'
import { menu, store } from '@/config/data/enum'
import { message } from 'ant-design-vue'
import apis from '@/apis'
import { Mode as Md } from '@/core'
const icons = inject('icons') as any
const showModal = ref(true)
const addForm = ref<HTMLElement>() as any
let props = defineProps({
  mode: {
    type: String,
    default: Md.DETAIL,
  },
  itemData: {
    type: Object,
    default: () => {},
  },
})
const emit = defineEmits(['refreshData', 'closeModal'])
const state = reactive<any>({
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
  addForm: {
    storeId: '1',
    name: '',
    parentId: '',
    productCategoryId: '',
    profitSharing: 0,
    selfRate: 0,
    sortBy: 0,
  },
  parentName: '',
  rules: {
    name: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
  },
})
// 生命周期
onBeforeMount(() => {
  state.parentName = props.itemData.parentName
  switch (props.mode) {
    case Md.CREATE:
      state.addForm.parentId = props.itemData.parentId
      state.addForm.sortBy = props.itemData.sortBy
      break
    case Md.UPDATE: // 添加子菜单
      state.addForm.parentId = props.itemData.menuId + ''
      state.addForm.productCategoryId = `${props.itemData['productCategoryId']}`
      state.addForm.name = props.itemData['name'] || ''
      state.addForm.parentId = props.itemData['parentId'] || '0'
      state.addForm.sortBy = props.itemData['sortBy'] || 1
      break
  }
})

/**
 * 提交表单
 */
const handleOk = () => {
  addForm.value.validate().then(async () => {
    let { code, msg } = await apis.request({
      url: apis.productCategory,
      method: props.mode === Md.UPDATE ? 'put' : 'post',
      data: state.addForm,
    })
    if (code == 1) {
      message.success(msg)
      emit('refreshData', true)
      return
    }
    message.error(msg)
  })
}
</script>
