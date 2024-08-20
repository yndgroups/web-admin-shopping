<template>
  <a-modal
    v-model:open="showModal"
    :maskClosable="false"
    :width="config.modelWidth"
    :title="`给【 ${itemData.name} 】角色授权`"
    @ok="handleOk"
    @cancel="emit('closeModal')"
  >
    <a-tree
      v-if="state.tableData && state.tableData.length > 0"
      checkable
      checkStrictly
      :defaultExpandAll="true"
      :tree-data="state.tableData"
      :replaceFields="{ children: 'children', title: 'name', key: 'menuId' }"
      v-model:selectedKeys="state.selectedKeys"
      v-model:checkedKeys="state.checkedKeys"
      @check="onCheckChange"
    ></a-tree>
  </a-modal>
</template>
<script lang="ts" setup>
import apis from '@/apis'
import config from '@/config/theme'
let props = defineProps({
  itemData: {
    type: Object,
    required: true,
  },
}) as any
let emit = defineEmits(['closeModal'])
let showModal = ref(true)
let state = reactive<any>({
  tableData: [],
  expandedKeys: [],
  selectedKeys: [],
  checkedKeys: [],
  allSelectedNodes: [],
})

onBeforeMount(() => {
  getListData()
})

/**
 * 移除未选中的子项
 */
const setIds = (arr: Array<any>, curtentId: string, bool: boolean) => {
  if (!arr || typeof arr != 'object') {
    return
  }
  arr.forEach((item: any) => {
    let children = item.children && item.children.default() ? item.children.default() : []
    if (children && children.length > 0 && children[0].length > 0) {
      setIds(children[0], item.key, bool)
    }
    let index = state.selectedKeys.indexOf(item.key)
    if (bool) {
      if (index !== -1) {
        state.selectedKeys.splice(index, 1)
        state.selectedKeys.splice(state.selectedKeys.indexOf(curtentId), 1)
        state.checkedKeys = state.selectedKeys
      }
    } else {
      if (index == -1) {
        state.selectedKeys.push(item.key)
        state.checkedKeys = state.selectedKeys
      }
      let parentIds = getParentIds(state.tableData, curtentId)
      if (parentIds.length > 0) {
        parentIds.forEach(id => {
          state.selectedKeys.push(id)
        })
      }
    }
  })
}

/**
 * 递归找父级
 */
const getParentIds = (treeData: any[], id: string): any[] => {
  let allparents = new Array<any>()
  if (treeData.length == 0) {
    return []
  }

  let findele = (data: any, id: string) => {
    if (!id) return
    data.forEach((item: any, index: number) => {
      if (item.menuId == id) {
        allparents.unshift(item.menuId)
        findele(treeData, item.parentId)
      } else {
        if (item.children) {
          findele(item.children, id)
        }
      }
    })
  }
  findele(treeData, id)
  return allparents
}

/**
 * 选择
 */
const onCheckChange = (selectedKeys: any, checkInfo: any) => {
  if (!checkInfo.checked) {
    if (checkInfo.node.eventKey) {
      let obj = proxy.utils.findObj(state.tableData, 'menuId', checkInfo.node.eventKey)
      if (obj && obj.children && obj.children.length > 0) {
        let ids = proxy.utils.findIds([obj], 'menuId')
        ids.forEach(id => {
          let index = state.selectedKeys.indexOf(id)
          index > -1 ? state.selectedKeys.splice(index, 1) : ''
        })
      } else {
        let index = state.selectedKeys.indexOf(checkInfo.node.eventKey)
        index > -1 ? state.selectedKeys.splice(index, 1) : ''
      }
      state.checkedKeys = state.selectedKeys
    }
  } else {
    // 选择
    if (checkInfo.node.eventKey) {
      let obj = proxy.utils.findObj(state.tableData, 'menuId', checkInfo.node.eventKey)
      if (obj && obj.children && obj.children.length > 0) {
        let ids = proxy.utils.findIds([obj], 'menuId')
        ids.forEach((id: string) => {
          let index = state.selectedKeys.indexOf(id)
          index == -1 ? state.selectedKeys.push(id) : ''
        })
      } else {
        state.selectedKeys.push(checkInfo.node.eventKey)
      }
      let pids = getParentIds(state.tableData, checkInfo.node.eventKey)
      if (pids.length > 0) {
        pids.forEach(id => {
          state.selectedKeys.push(id)
        })
      }
      state.checkedKeys = state.selectedKeys
    }
  }
}

/**
 * 查询授权菜单的id列表
 */
const queryMenuListByAppId = async () => {
  let { data, code } = await apis.getJSON(apis.getMenuIdsByRoleId + props.itemData.roleId)
  if (code == 200) {
    state.expandedKeys = data || []
    state.checkedKeys = data || []
    state.selectedKeys = data || []
  } else {
    state.expandedKeys = []
    state.checkedKeys = []
    state.selectedKeys = []
  }
}

const getListData = async () => {
  queryMenuListByAppId()
  state.tableData = []
  let { data, code } = await apis.getJSON(apis.queryMenuListByAppId + props.itemData.appId)
  state.tableData = code == 200 && data['menuList'] && data['menuList'].length > 0 ? data['menuList'] : []
}

/**
 * 提交数据
 */
const handleOk = async () => {
  // let ids = proxy.utils.unique(state.selectedKeys)
  // const { code, data, msg } = await apis.postJSON(apis.roleRelationMenu, {
  //   data: { menuIds: ids, roleId: props.itemData.roleId }
  // })
  // if (code == 1) {
  //   message.success(msg)
  //   emit('getListData')
  //   return
  // }
  // message.error(data)
}
</script>
