<template>
  <a-modal
    v-model:open="showModal"
    :maskClosable="false"
    :width="config.modelWidth"
    :title="mode == 1 ? '添加角色' : '修改角色'"
    @ok="handleOk"
    @cancel="emit('closeModal')"
  >
    <a-form
      :model="state.addForm"
      ref="addForm"
      :rules="rules"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 14 }"
    >
      <a-form-item
        label="角色名称"
        name="name"
      >
        <a-input v-model:value.trim="state.addForm.name" />
      </a-form-item>
      <a-form-item
        label="角色介绍"
        name="introduce"
      >
        <a-input v-model:value.trim="state.addForm.introduce" />
      </a-form-item>
      <a-form-item
        label="角色唯一标识"
        name="uniqueIdentification"
      >
        <a-input v-model:value.trim="state.addForm.uniqueIdentification" />
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
import apis from '@/apis'
import { message } from 'ant-design-vue'
const addForm = ref<HTMLElement>() as any
const showModal = ref(true)
// 获取上下文

// 父子传值
let props = defineProps({
  mode: {
    type: Number, // 1新增 2修改 3 删除 4新增子
    default: 1,
  },
  itemData: {
    type: Object,
    default: () => {},
  },
  appId: {
    type: String,
    default: '',
  },
})
let emit = defineEmits(['getListData', 'closeModal'])
let state = reactive<any>({
  addForm: {
    introduce: '',
    name: '',
    appId: '',
    roleId: null,
    sortBy: '',
    uniqueIdentification: '',
  },
})
// 校验规则
const rules: any = {
  name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
  uniqueIdentification: [{ required: true, message: '角色唯一不能为空', trigger: 'blur' }],
  introduce: [{ required: true, message: '角色介绍不能为空', trigger: 'blur' }],
  sortBy: [
    {
      required: true,
      type: 'number',
      message: '角色排序不能为空',
      trigger: 'blur',
    },
  ],
}

// 生命周期
onBeforeMount(() => {
  if (props.mode == 3) {
    for (let k in state.addForm) {
      if (props.itemData[k] != undefined && props.itemData[k] != null) {
        state.addForm[k] = props.itemData[k]
      }
    }
  } else {
    state.addForm.appId = props.appId
  }
})

/**
 * 提交表单
 */
const handleOk = () => {
  addForm.value.validate().then(async () => {
    let { code, msg } = await apis.request({
      url: apis.role,
      method: props.mode === 3 ? 'put' : 'post',
      data: state.addForm,
    })
    if (code == 1) {
      message.success(msg)
      emit('getListData', true)
      return
    }
    message.error(msg)
  })
}
</script>
