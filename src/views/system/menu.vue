<template>
  <div class="page-menu">
    <a-card size="small">
      <!-- 功能区 -->
      <div class="actions text-left pd-b10">
        <a-button
          type="primary"
          :size="config.formSize"
          class="mg-r10"
          @click="addMenu"
        >
          <span>添加一级菜单</span>
        </a-button>
      </div>
      <!-- 数据表格 -->
      <a-table
        :loading="state.loading"
        tableLayout="fixed"
        @expand="expand"
        :columns="columns"
        :expandedRowKeys="state.expandedRowKeys"
        :data-source="state.tableData"
        :pagination="false"
        :row-key="(record: any) => record.menuId"
        :scroll="{ y: vh }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'type'">
            <span v-if="record.type === 1">菜单</span>
            <span
              v-else
              class="text-danger"
            >
              按钮
            </span>
          </template>
          <template v-if="column.key === 'icon'">
            <component
              v-if="record.icon"
              :is="record.icon"
            ></component>
          </template>
          <template v-if="column.key === 'operation'">
            <a-button
              type="link"
              :size="config.formSize"
              @click="addChildMenu(record)"
            >
              <span
                class="text-dark-color"
                v-if="record.type === 1"
              >
                添加子菜单
              </span>
              <span
                v-if="record.type === 2"
                class="text-danger"
              >
                添加子按钮
              </span>
            </a-button>
            <a-button
              type="link"
              :size="config.formSize"
              @click="edit(record)"
            >
              <span class="text-warning">修改</span>
            </a-button>
            <a-popconfirm
              title="您确定要删除这条数据吗？"
              trigger="click"
              @confirm="onDelete(record)"
            >
              <template v-slot:icon>
                <question-circle-outlined style="color: red" />
              </template>
              <a-button
                type="link"
                :size="config.formSize"
              >
                <span class="text-danger">删除</span>
              </a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 菜单编辑 -->
    <SystemMenuForm
      v-if="state.formView"
      :item-data="state.itemData"
      :mode="state.mode"
      @closeModal="state.formView = false"
      @refreshData="getListData"
    />
  </div>
</template>

<script lang="ts" setup layout="shopping" title="菜单管理">
import config from '@/config/theme'
import apis from '@/apis'
import { message } from 'ant-design-vue'
import { Mode } from '@/core'
const vh = computed(() => {
  const { vh } = inject<any>('viewport')
  return vh - 200
})
const columns: any = [
  { title: '菜单名称', dataIndex: 'name', key: 'name', width: 150, fixed: 'left' },
  { title: '父菜单名称', dataIndex: 'parentName', key: 'parentName', width: 100 },
  { title: '菜单地址', dataIndex: 'url', key: 'url', width: 100 },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    align: 'center',
    width: 100,
  },
  {
    title: '权限值',
    dataIndex: 'powerSign',
    key: 'powerSign',
    width: 150,
  },
  {
    title: '图标',
    dataIndex: 'icon',
    key: 'icon',
    width: 60,
    align: 'center',
  },
  { title: '排序', dataIndex: 'sortBy', width: 60, key: 'sortBy', align: 'center' },
  { title: '操作', width: 220, key: 'operation', align: 'center', fixed: 'right' },
]
let state = reactive<any>({
  loading: false,
  formView: false, // 表单显示
  shrink: false, // 收縮表单
  mode: Mode.CREATE,
  itemData: {
    sortBy: 1,
  }, // 新增修改的当前点击项
  searchForm: {
    // 搜索表单
    name: '',
  },
  // 分页参数
  pageInfo: {
    pageIndex: 1,
    pageSize: 10,
    total: 0,
  },
  // 表格数据
  tableData: [],
  expandedRowKeys: new Array<any>(),
})

// 自定义函数

const getListData = async () => {
  state.formView = false
  state.tableData = []
  state.loading = true
  let { data, code } = await apis.getJSON(apis.menuTreeAll)
  if (code === 1) {
    state.tableData = data || []
  }
  state.loading = false
}

onMounted(() => {
  getListData()
})

/**
 * 添加一级菜单菜单
 */
const addMenu = () => {
  let sortBy = 1
  if (state.tableData && state.tableData.length > 0) {
    let data = state.tableData[state.tableData.length - 1] as any
    sortBy = data.sortBy + 1
  }
  state.itemData.parentId = '0'
  state.itemData.sortBy = sortBy
  state.itemData.parentName = '一级菜单'
  state.mode = Mode.CREATE
  state.formView = true
}

/**
 * 添加子菜单
 */
const addChildMenu = (itemData: any) => {
  let sortBy = 1
  if (itemData.children && itemData.children.length > 0) {
    let data = itemData.children[itemData.children.length - 1]
    sortBy = data.sortBy + 1
  }
  state.itemData.parentId = itemData.menuId
  state.itemData.sortBy = sortBy
  state.itemData.parentName = itemData.name
  state.mode = Mode.CREATE
  state.formView = true
}

/**
 * 删除
 */
const onDelete = async (item: any) => {
  const { code, msg } = await apis.deleteJSON(apis.menu, {
    data: [`${item.menuId}`],
  })
  if (code === 1) {
    message.success(msg)
    getListData()
    return
  }
  message.error(msg)
}

const expand = (expanded: any, record: any) => {
  if (expanded) {
    state.expandedRowKeys.push(record.menuId)
  } else {
    state.expandedRowKeys.splice(state.expandedRowKeys.indexOf(record.menuId), 1)
  }
}

const edit = (record: any) => {
  state.mode = Mode.UPDATE
  state.itemData = record
  state.formView = true
}
</script>

<style lang="scss" scoped>
:deep(.ant-table .ant-table-thead th) {
  padding: 4px;
}
:deep(.ant-table .ant-table-tbody td) {
  padding: 4px;
}
</style>
