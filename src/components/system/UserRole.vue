<template>
  <div>
    <a-modal
      v-model:open="showModal"
      :title="`给 [ ${currentUser.userName} ] 角色授予菜单权限`"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="emit('closeModal', false)"
      :width="'1000px'"
    >
      <a-checkbox-group
        v-model:value="state.checkedKeys"
        :options="state.roleList"
      >
        <template #label="{ value }">
          <span style="color: red">{{ value }}</span>
        </template>
      </a-checkbox-group>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import apis from '@/apis'
import { message } from 'ant-design-vue'
const { proxy } = getCurrentInstance() as any
let props = defineProps({
  visible: {
    type: Boolean,
    default: true,
    required: true,
  },
  currentUser: {
    type: Object,
    required: true,
  },
})
let showModal = ref(props.visible)
const confirmLoading = ref(false)
let emit = defineEmits(['closeModal'])
interface Data {
  confirmLoading: boolean
  loading: boolean
  roleList: any[]
  checkedKeys: []
}
let state = reactive<Data>({
  confirmLoading: false,
  loading: false,
  roleList: [],
  checkedKeys: [],
})

onMounted(() => {
  getRoleListData()
})

// 获取角色列表数据
const getRoleListData = async () => {
  state.loading = true
  state.roleList = []
  let { data, code, msg } = await apis.getJSON(apis.findAuthRoleListByUserId + props.currentUser.userId)
  if (code == 1) {
    let resData = data.list || []
    state.roleList = resData.map((item: any) => {
      return {
        label: item.name,
        value: item.roleId,
      }
    })
    let roleIds = data.roleIds || []
    if (roleIds.length) {
      state.checkedKeys = roleIds
    }
  } else {
    state.roleList = []
    message.warning(msg)
  }
  state.loading = false
}

const handleOk = async () => {
  if (state.checkedKeys.length < 1) {
    message.error('请选择角色')
    return
  }
  let saveData = state.checkedKeys.map((roleId: string) => {
    return {
      roleId: roleId,
      userId: props.currentUser.userId,
    }
  })
  const { code, msg } = await apis.postJSON(apis.createUserRole, {
    data: saveData,
  })
  if (code === 1) {
    message.success(msg)
    emit('closeModal', true)
    return
  }
  message.error(msg)
}
</script>
