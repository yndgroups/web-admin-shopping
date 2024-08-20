<template>
  <div>
    <a-modal
      v-model:open="showModal"
      :title="`给 [${roleItem.name}] 角色授予菜单权限`"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="emit('closeModal', false)"
      :width="'1000px'"
    >
      <div class="role-menu">
        <div class="tuli">
          <strong>
            <a-badge color="#333" />
            菜单
          </strong>
          <strong>
            <a-badge status="error" />
            按钮
          </strong>
        </div>
        <div
          class="pd-l30"
          v-if="treeData && treeData.length"
        >
          <a-tree
            v-model:selectedKeys="selectedKeys"
            v-model:checkedKeys="checkedKeys"
            checkable
            :tree-data="treeData"
            :defaultExpandAll="true"
            :showLine="true"
            :checkStrictly="true"
            :fieldNames="{ children: 'children', title: 'name', key: 'menuId' }"
            @check="checkNodes"
          >
            <template #title="{ name, type }">
              <template v-if="type === 1">
                <span style="color: #333">{{ name }}</span>
              </template>
              <template v-else>
                <span style="color: #ff4d4f">{{ name }}</span>
              </template>
            </template>
          </a-tree>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import apis from '@/apis'
import { Modal, message } from 'ant-design-vue'
// 定义数据类型
interface Data {
  confirmLoading: boolean
  loading: boolean
  treeData: any[]
  expandedKeys: []
  selectedKeys: []
  checkedKeys: {
    checked: any[]
    halfChecked: any
  }
}
let props = defineProps({
  visible: {
    type: Boolean,
    default: true,
    required: true,
  },
  roleItem: {
    type: Object,
    required: true,
  },
})
let emit = defineEmits(['closeModal'])
let showModal = ref(props.visible)
const confirmLoading = ref(false)

let state = reactive<Data>({
  confirmLoading: false,
  loading: false,
  treeData: [],
  expandedKeys: [],
  selectedKeys: [],
  checkedKeys: {
    checked: [],
    halfChecked: [],
  },
})
let { treeData, selectedKeys, checkedKeys } = toRefs(state)

const handleOk = () => {
  if (state.checkedKeys && state.checkedKeys.checked && state.checkedKeys.checked.length > 0) {
    Modal.confirm({
      title: '确定要进行授权操作吗？',
      onOk() {
        let tempRoleMenu = new Array<any>()
        state.checkedKeys.checked.forEach(menuId => {
          tempRoleMenu.push({ roleId: props.roleItem.roleId, menuId: menuId })
        })
        // 保存数据
        saveData(tempRoleMenu)
      },
      onCancel() {
        message.info('取消授权操作')
      },
    })
  } else {
    message.error('还未进行任何菜单选择')
    state.confirmLoading = false
  }
}

// 保存授权数据
const saveData = async (data: any[]) => {
  const { code, msg } = await apis.postJSON(apis.createRoleMenu, {
    data: data,
  })
  if (code === 1) {
    message.success(msg)
    emit('closeModal', true)
    return
  }
  message.error(msg)
}

// 初始化数据
onMounted(() => {
  getListData()
})

// 根据节点选中情况找到对应
const checkNodes = (checkedKeys: any, e: any) => {
  let { checked, checkedNodes, node, event } = e
  if (checked && checkedNodes.length > 0) {
    // 如果选中有父选项，则吧父亲选项加入
    if (node.parent) {
      let nodes = node.parent.nodes || []
      if (nodes.length) {
        nodes.forEach((item: any) => {
          if (state.checkedKeys.checked.indexOf(item.menuId) === -1) {
            state.checkedKeys.checked.push(item.menuId)
          }
        })
      }
    }
    // 如果有自选项，也全部进行选中
    if (node.children && node.children.length > 0) {
      recursionInsert(node.children)
      /* node.children.forEach((item: any) => {
        if (state.checkedKeys.checked.indexOf(item.menuId) === -1) {
          state.checkedKeys.checked.push(item.menuId);
        }
      }); */
    }
  }
  // 如果是取消选项，则移除子选项
  if (checked === false) {
    let children = node.children || []
    if (children && children.length > 0) {
      recursionRemove(children)
    }
  }
}

// 递归移除子菜单
const recursionRemove = (children: any[]) => {
  if (children && Array.isArray(children)) {
    children.forEach(item => {
      if (item.children && item.children.length > 0) {
        let index = state.checkedKeys.checked.indexOf(item.menuId)
        if (index > -1) {
          state.checkedKeys.checked.splice(index, 1)
        }
        recursionRemove(item.children)
      } else {
        let index = state.checkedKeys.checked.indexOf(item.menuId)
        if (index > -1) {
          state.checkedKeys.checked.splice(index, 1)
        }
      }
    })
  }
}

// 递归添加子菜单
const recursionInsert = (children: any[]) => {
  if (children && Array.isArray(children)) {
    children.forEach(item => {
      if (item.children && item.children.length > 0) {
        state.checkedKeys.checked.push(item.menuId)
        recursionInsert(item.children)
      } else {
        if (state.checkedKeys.checked.indexOf(item.menuId) === -1) {
          state.checkedKeys.checked.push(item.menuId)
        }
      }
    })
  }
}

// 获取菜单数据
const getListData = async () => {
  state.loading = true
  let { data, code } = await apis.getJSON(`${apis.findMenuInfoByRoleIds}/${props.roleItem.roleId}`)
  if (code === 1) {
    state.treeData = data['menuList'] || []
    state.checkedKeys = data['roleMenuIds'] || []
  }
  state.loading = false
}
</script>
<style lang="scss">
.role-menu {
  padding: 0 50px;

  .tuli {
    border-bottom: 1px dashed #ccc;
    padding-bottom: 10px;
    margin-bottom: 10px;
    strong {
      padding: 2px 10px;
      display: inline-block;
      margin-right: 20px;
    }
  }
}
</style>
