<template>
  <a-modal
    v-model:open="showModal"
    :maskClosable="false"
    :width="config.modelWidth"
    :title="mode == 1 ? '添加部门' : mode == 2 ? '添加下级部门' : '修改部门信息'"
    @ok="handleOk"
    @cancel="emit('closeModal')"
  >
    <a-form
      :model="state.addForm"
      ref="addForm"
      :rules="rules"
      :label-col="state.labelCol"
      :wrapper-col="state.wrapperCol"
    >
      <a-form-item
        label="功能名称"
        name="name"
      >
        <a-input v-model:value.trim="state.addForm.name" />
      </a-form-item>
      <a-form-item
        label="权限值"
        name="powerSign"
        :rules="[
          {
            required: true,
            message: '权限值不能为空',
            trigger: 'blur',
          },
        ]"
      >
        <a-input v-model:value.trim="state.addForm.powerSign" />
      </a-form-item>
      <a-form-item
        label="排序"
        name="sortBy"
      >
        <a-input-number v-model:value.trim="state.addForm.sortBy" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
import config from '@/config/theme'
import apis from '@/apis'
import { message } from 'ant-design-vue'
import type { AnyObj } from '@/utils'
const addForm = ref<HTMLElement>() as any
const showModal = ref(true)
let props = defineProps({
  mode: {
    type: Number,
    default: 1,
  },
  itemData: {
    type: Object,
    default: () => {},
  },
})
const emit = defineEmits(['refreshData', 'closeModal'])
const rules: AnyObj = {
  name: [{ required: true, message: '功能名称不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '请选择功能', trigger: 'change' }],
}
// 获取上下文
const state = reactive({
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
  addForm: {
    funcId: '',
    name: '',
    parentId: '',
    powerSign: '',
    sortBy: 1,
  },
})
// 生命周期
onBeforeMount(() => {
  state.addForm.sortBy = props.itemData.sortBy
  switch (props.mode) {
    case 1: // 添加一级功能
      state.addForm.parentId = '1'
      break
    case 2: // 添加子功能
      state.addForm.parentId = props.itemData.funcId + ''
      break
  }
  if (props.mode == 3) {
    state.addForm.funcId = props.itemData['funcId'] || ''
    state.addForm.name = props.itemData['name'] || ''
    state.addForm.parentId = props.itemData['parentId'] || '1'
    state.addForm.powerSign = props.itemData['powerSign'] || ''
    state.addForm.sortBy = props.itemData['sortBy'] || 1
  }
})

/**
 * 提交表单
 */
const handleOk = () => {
  addForm.value.validate().then(async () => {
    let { code, msg } = await apis.request({
      url: apis.func,
      method: props.mode === 3 ? 'put' : 'post',
      data: state.addForm,
    })
    if (code == 1) {
      message.success(msg)
      emit('closeModal', true)
      return
    }
    message.error(msg)
  })
}
</script>
