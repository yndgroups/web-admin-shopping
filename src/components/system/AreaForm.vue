<template>
  <a-form
    :model="state.addForm"
    ref="formRef"
    :rules="state.rules"
    :label-col="state.labelCol"
    :wrapper-col="state.wrapperCol"
  >
    <a-form-item
      label="地区名称"
      name="areaName"
    >
      <a-input v-model:value="state.addForm.areaName" />
    </a-form-item>

    <a-form-item
      label="地区编码"
      name="areaCode"
    >
      <a-input
        v-model:value="state.addForm.areaCode"
        @input="inputAreaCode"
        :maxlength="12"
      />
    </a-form-item>
    <a-form-item
      label="地区级别"
      name="areaTag"
    >
      <a-input-number
        :disabled="true"
        v-model:value="state.addForm.areaTag"
      />
    </a-form-item>

    <a-form-item
      label="全称"
      name="fullAreaName"
    >
      <a-input v-model:value="state.addForm.fullAreaName" />
    </a-form-item>

    <a-form-item
      label="是否国标码"
      name="isStandard"
    >
      <a-select
        v-model:value="state.addForm.isStandard"
        placeholder="请选择模块"
        :options="state.isStandardOptions"
      />
    </a-form-item>

    <a-form-item
      label="年份"
      name="year"
    >
      <a-input-number v-model:value="state.addForm.year" />
    </a-form-item>
    <div class="btn-group text-right">
      <a-button
        class="mg-r10"
        @click="methods.closeModal"
      >
        取消
      </a-button>
      <a-button
        type="primary"
        @click="handleOk"
      >
        提交
      </a-button>
    </div>
  </a-form>
</template>
<script lang="ts" setup>
import { message } from 'ant-design-vue'
// import { numToAmount } from 'encjs/core/maths'

const formRef = ref()
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
  methods: {
    type: Object,
    default: () => {},
  },
})
let state = reactive<any>({
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
  isStandardOptions: [
    {
      value: 1,
      label: '  是',
    },
    {
      value: 0,
      label: '否',
    },
  ],
  addForm: {
    areaId: '',
    areaName: '',
    areaCode: '',
    areaTag: 0,
    fullAreaName: '',
    isStandard: 0,
    likeColumn: '',
    parentCode: '',
    year: '',
  },
  rules: {
    areaName: [{ required: true, message: '地区名称不能为空', trigger: 'blur' }],
    areaCode: [{ required: true, message: '地区编码不能为空', trigger: 'blur' }],
    areaTag: [{ required: true, message: '地区级别不能为空', trigger: 'blur' }],
    fullAreaName: [{ required: true, message: '地区全名不能为空', trigger: 'blur' }],
    year: [{ required: true, message: '数据来源年限不能为空', trigger: 'blur' }],
  },
  timerId: 0,
})

onBeforeMount(() => {
  if (props.mode == 2) {
    for (let k in state.addForm) {
      if (props.itemData[k] != undefined && props.itemData[k] != null) {
        state.addForm[k] = props.itemData[k]
      }
    }
  }
})

const inputAreaCode = (el: any) => {
  if (state.timerId) {
    clearTimeout(state.timerId)
  }
  state.timerId = setTimeout(() => {
    let val = `${el.target.value}` || ''
    // console.log(numToAmount(val))
    if (val && val.length !== 12) {
      message.warn('请输入12位地区数字编码')
      return
    }
    if (!/\d{12}/.test(val)) {
      message.warn('地区编码格式不对')
      return
    }
    console.log(/\d{12}/.test(val), '2222')
    console.log(val)
    if (val === '000000000000') {
      state.addForm.areaTag = 0
    } else {
      state.addForm.areaTag = 1
    }
    switch (true) {
      case val === '0000000000000':
        state.addForm.areaTag = 0
        break
      case val.substring(2).includes('0000000000'):
        state.addForm.areaTag = 1
        break
      case val.substring(4).includes('00000000'):
        state.addForm.areaTag = 2
        break
      case val.substring(6).includes('000000'):
        state.addForm.areaTag = 3
        break
      case val.substring(8).includes('0000') || val.substring(9).includes('000'):
        state.addForm.areaTag = 4
        break
      default:
        state.addForm.areaTag = 5
    }
  }, 500)
}

// 操作方法
const handleOk = () => {
  formRef.value.validate().then(async () => {
    switch (props.mode) {
      case 1: // 添加一级菜单
        state.addForm.parentId = 1
        break
      case 2: // 添加子菜单
        state.addForm.parentId = props.itemData.menuId
        break
    }
    // 保存数据
    props.methods.onSave(state.addForm)
  })
}
</script>
