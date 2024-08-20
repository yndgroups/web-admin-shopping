<template>
  <a-modal
    v-model:open="showModal"
    :maskClosable="false"
    :width="1380"
    :title="mode == 1 ? '添加协议' : '修改协议'"
    @ok="handleOk"
    @cancel="emit('closeModal', false)"
    style="min-width: 1380px"
  >
    <a-form
      :model="state.addForm"
      ref="addForm"
      :rules="rules"
      :label-col="{ span: 3 }"
      :wrapper-col="{ span: 20 }"
    >
      <a-form-item
        label="协议标题"
        name="title"
      >
        <a-input v-model:value="state.addForm.title" />
      </a-form-item>
      <a-form-item
        label="协议类型"
        name="type"
      >
        <a-select
          v-model:value="state.addForm.type"
          placeholder="请选择"
          :options="state.typeOptions"
        />
      </a-form-item>
      <a-form-item
        label="协议内容"
        name="content"
      >
        <!-- <CommonYndRichText v-model:value="state.addForm.content" :width="1100" :height="600" /> -->
        <CommonYndTnymce
          v-model:value="state.addForm.content"
          :width="1100"
          :height="600"
        ></CommonYndTnymce>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
import apis from '@/apis'
import { HttpMethod } from '@/config/axios'
import config from '@/config/theme'
import { message } from 'ant-design-vue'
let emit = defineEmits(['getListData', 'closeModal'])
const addForm = ref<HTMLElement>() as any
const showModal = ref(true)
// 获取上下文
let props = defineProps({
  mode: {
    // 1新增 2修改 3 删除 4新增子
    type: Number,
    default: 1,
  },
  itemData: {
    type: Object,
    default: () => {},
  },
})

let state = reactive<any>({
  typeOptions: [
    {
      value: 1,
      label: '会员协议',
    },
    {
      value: 2,
      label: '代理协议',
    },
  ],
  addForm: {
    agreeId: '',
    title: '',
    content: '',
    type: null,
    display: 1,
  },
})

let rules: any = {
  title: [{ required: true, message: '请填协议标题', trigger: 'blur' }],
  type: [{ required: true, message: '请选择选择协议类型', trigger: 'blur' }],
  content: [{ required: true, message: '请填写协议内容', trigger: 'blur' }],
}

// 生命周期
onBeforeMount(() => {
  if (props.mode == 2) {
    for (let k in state.addForm) {
      if (props.itemData[k] != undefined && props.itemData[k] != null) {
        state.addForm[k] = props.itemData[k]
      }
    }
  }
})

// 操作方法
const handleOk = () => {
  addForm.value.validate().then(async () => {
    let { code, msg } = await apis.request({
      url: apis.agreement,
      method: props.mode === 1 ? HttpMethod.POST : HttpMethod.PUT,
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
