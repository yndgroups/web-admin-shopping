<template>
  <a-modal
    :visible="true"
    :maskClosable="false"
    :width="config.modelWidth"
    :title="mode == 1 ? '添加应用' : '修改应用'"
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
        label="应用名称"
        name="name"
      >
        <a-input v-model:value="state.addForm.name" />
      </a-form-item>
      <a-form-item
        label="logo地址"
        name="icon"
      >
        <a-input v-model:value="state.addForm.icon" />
      </a-form-item>
      <a-form-item
        label="介绍"
        name="introduce"
      >
        <a-input v-model:value="state.addForm.introduce" />
      </a-form-item>
      <a-form-item
        label="配置模块"
        name="mdId"
      >
        <a-select
          v-model:value="state.addForm.mdId"
          mode="multiple"
          placeholder="请选择模块"
          :options="state.mdIdOptions"
        />
      </a-form-item>
      <a-form-item
        label="排序"
        name="sortBy"
      >
        <a-input v-model:value="state.addForm.sortBy" />
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
  addForm: {
    icon: null,
    introduce: null,
    name: null,
    appId: null,
    mdId: [],
    sortBy: 1,
  },
  mdIdOptions: [
    {
      value: 1,
      label: '基础',
    },
  ],
})

let rules: any = {
  name: [{ required: true, message: '请填写应用名称', trigger: 'blur' }],
  icon: [{ required: true, message: '请填写logo地址', trigger: 'blur' }],
  introduce: [{ required: true, message: '请输入介绍', trigger: 'blur' }],
  mdId: [{ required: true, type: 'array', message: '请选择模块', trigger: 'change' }],
}

// 生命周期
onBeforeMount(() => {
  if (props.mode == 3) {
    for (let k in state.addForm) {
      if (props.itemData[k] != undefined && props.itemData[k] != null) {
        state.addForm[k] = props.itemData[k]
        if (k === 'mdId') {
          state.addForm['mdId'] = props.itemData['mdId'].split(',')
        }
      }
    }
  }
  queryAppModulePageList()
})

// 查询模块
const queryAppModulePageList = async () => {
  let {
    data: { list },
    code,
  } = await apis.postJSON(apis.queryAppModulePageList, {
    data: {
      pageIndex: 1,
      pageSize: 1000,
    },
  })
  if (code == 200 && list && list.length) {
    state.mdIdOptions = list.map((item: any) => {
      return {
        value: item.mdId + '',
        label: item.name,
      }
    })
  } else {
    state.mdIdOptions = []
  }
}

// 操作方法
const handleOk = () => {
  addForm.value.validate().then(async () => {
    switch (props.mode) {
      case 1:
        state.addForm.appId = null
        break
      case 2:
        state.addForm.appId = props.itemData.appId
        break
    }
    let sendData = JSON.parse(JSON.stringify(state.addForm))
    sendData.mdId = sendData.mdId.join(',')
    let { code, msg } = await apis.request({
      url: apis.app,
      method: props.mode === 1 ? HttpMethod.POST : HttpMethod.PUT,
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
