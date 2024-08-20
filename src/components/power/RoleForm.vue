<template>
  <a-form
    :model="formData"
    ref="form"
    :label-col="{ span: 4 }"
    :wrapper-col="{ span: 18 }"
  >
    <a-form-item
      label="角色名称"
      name="name"
      :rules="[{ required: true, message: '请输入角色名称' }]"
    >
      <a-input
        v-model:value="formData.name"
        placeholder="请输入角色名称"
        allow-clear
      />
    </a-form-item>
    <a-form-item
      label="角色介绍"
      name="introduce"
      :rules="[{ required: true, message: '请输入角色介绍' }]"
    >
      <a-input
        v-model:value="formData.introduce"
        placeholder="请输入角色名称"
        allow-clear
      />
    </a-form-item>
    <a-form-item
      label="角色唯一标识"
      name="uniqueIdentification"
      :rules="[{ required: true, message: '请输入角色唯一标识' }]"
    >
      <a-input
        v-model:value="formData.uniqueIdentification"
        placeholder="请输入角色唯一标识"
        allow-clear
      />
    </a-form-item>
    <a-form-item
      label="角色唯一标识"
      name="sortBy"
      :rules="[{ required: true, message: '请输入排序' }]"
    >
      <a-input-number
        v-model:value="formData.sortBy"
        placeholder="请输入排序"
        allow-clear
      />
    </a-form-item>
    <div class="text-center">
      <a-button
        type="primary"
        @click="onSave"
      >
        提交
      </a-button>
    </div>
  </a-form>
</template>

<script lang="ts" setup>
import apis from '@/apis'
interface Data {
  roleId: string
  [key: string]: any
}
const props = defineProps({
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
let hasUser = ref(false)
let formData = reactive<Data>({
  roleId: '',
  appId: apis.appId,
  name: '',
  introduce: '',
  uniqueIdentification: '',
})
const form = ref<any>()

onMounted(() => {
  if (props.modalData) {
    formData.roleId = props.modalData.roleId
    for (let key in props.modalData) {
      formData[key] = props.modalData[key]
    }
    hasUser.value = true
  }
})

const onSave = () => {
  // @ts-ignore
  Logger.warn(`自定义表单测试 => ${props.mode}`, props.mode, formData)
  form.value.validateFields().then(async () => {
    if (props.methods) {
      props.methods.onSave(props.mode, formData)
    }
  })
}
</script>
