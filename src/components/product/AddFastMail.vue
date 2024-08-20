<template>
  <a-modal
    v-model:open="showModal"
    :title="type === 0 ? '添加快递' : type === 1 ? '修改快递' : '详情'"
    :width="800"
    :bodyStyle="{ height: '70vh', overflowX: 'auto' }"
    @cancel="emit('closeModal')"
    class="modal-box"
    @ok="submit"
    :okButtonProps="{ disabled: type === 2 }"
  >
    <a-form
      :model="formData"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
      ref="form"
    >
      <a-form-item
        label="简称"
        name="abbreviation"
        :rules="[{ required: true, message: '请输入简称' }]"
      >
        <a-input
          v-model:value="formData.abbreviation"
          placeholder="请输入简称"
          allow-clear
        />
      </a-form-item>
      <a-form-item
        label="账号"
        name="account"
        :rules="[{ required: true, message: '请输入账号' }]"
      >
        <a-input
          v-model:value="formData.account"
          placeholder="请输入账号"
          allow-clear
        />
      </a-form-item>
      <a-form-item
        label="是否显示"
        name="display"
        :rules="[{ required: true, message: '请选择是否显示' }]"
      >
        <select-dict-select
          v-model:value="formData.display"
          dictType="display"
          placeholder="请选择"
        />
      </a-form-item>
      <a-form-item
        label="是否可用"
        name="enabled"
        :rules="{ required: true, message: '请选择是否可用' }"
      >
        <select-dict-select
          v-model:value="formData.enabled"
          dictType="enabled"
          placeholder="请选择"
        />
      </a-form-item>
      <a-form-item
        label="快递公司全称"
        name="fullName"
        :rules="{ required: true, message: '请输入快递公司全称' }"
      >
        <a-input
          v-model:value="formData.fullName"
          placeholder="请输入快递公司全称"
          allow-clear
        />
      </a-form-item>
      <a-form-item
        label="是否需要取件网点"
        name="net"
      >
        <select-dict-select
          v-model:value="formData.net"
          dictType="net"
          placeholder="请选择"
        />
      </a-form-item>
      <a-form-item
        label="网点名称"
        name="netName"
        :rules="{ required: formData.net, message: '请输入网点名称' }"
      >
        <a-input
          v-model:value="formData.netName"
          placeholder="请输入网点名称"
          allow-clear
        />
      </a-form-item>
      <a-form-item
        label="合伙人id"
        name="partnerId"
      >
        <a-input
          v-model:value="formData.partnerId"
          placeholder="请输入合伙人id"
          allow-clear
        />
      </a-form-item>
      <a-form-item
        label="合伙人密钥"
        name="partnerKey"
      >
        <a-input
          v-model:value="formData.partnerKey"
          placeholder="请输入合伙人密钥"
          allow-clear
        />
      </a-form-item>
      <a-form-item
        label="密钥"
        name="secretCode"
      >
        <a-input
          v-model:value="formData.secretCode"
          placeholder="请输入密钥"
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

interface Data {
  abbreviation: string
  account: string
  display: number
  enabled: number
  expressId: string
  fullName: string
  net: number
  netName: string
  partnerId: string
  partnerKey: string
  secretCode: string
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
  abbreviation: '',
  account: '',
  display: 0,
  enabled: 0,
  expressId: '',
  fullName: '',
  net: 0,
  netName: '',
  partnerId: '',
  partnerKey: '',
  secretCode: '',
  sortBy: 0,
})
const showModal = ref<boolean>(props.visible)
const form = ref<any>()
const emit = defineEmits(['getData', 'closeModal'])
function submit() {
  form.value.validateFields().then(async () => {
    formData.sortBy = Number(formData.sortBy)
    let { code, msg } = await apis.request({
      url: apis.addEditExpress,
      method: props.type === 0 ? HttpMethod.POST : HttpMethod.PUT,
      data: formData,
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
onMounted(() => {
  if (props.type === 1) {
    formData.abbreviation = props.row.abbreviation
    formData.account = props.row.account
    formData.display = props.row.display
    formData.enabled = props.row.enabled
    formData.expressId = props.row.expressId
    formData.fullName = props.row.fullName
    formData.net = props.row.net
    formData.netName = props.row.netName
    formData.partnerId = props.row.partnerId
    formData.partnerKey = props.row.partnerKey
    formData.secretCode = props.row.secretCode
    formData.sortBy = props.row.sortBy
  }
})
</script>
