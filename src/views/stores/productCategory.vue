<template>
  <div class="page-product-category">
    <a-card size="small">
      <!-- 功能区 -->
      <div class="actions text-left pd-b10">
        <a-button
          type="primary"
          :size="config.formSize"
          class="mg-r10"
          @click="addProductCategory"
          v-auth="'admin:productCategory:add'"
        >
          <span>添加一级分类</span>
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
        :row-key="(record: any) => record.productCategoryId"
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
              @click="addChildProductCategory(record)"
              v-auth="'admin:productCategory:add'"
            >
              <span class="text-dark-color">添加子分类</span>
            </a-button>
            <a-button
              type="link"
              :size="config.formSize"
              @click="edit(record)"
              v-auth="'admin:productCategory:edit'"
            >
              <span class="text-warning">修改</span>
            </a-button>
            <a-popconfirm
              title="您确定要删除这条数据吗？"
              trigger="click"
              @confirm="onDelete(record)"
              v-auth="'admin:productCategory:del'"
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
    <ProductProductCategoryForm
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
  { title: '分类名称', dataIndex: 'name', key: 'name', width: 150, fixed: 'left' },
  { title: '上级分类名称', dataIndex: 'parentName', key: 'parentName', width: 100 },
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
  let { data, code } = await apis.getJSON(apis.findProductCategoryTreeById + '1')
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
const addProductCategory = () => {
  let sortBy = 1
  if (state.tableData && state.tableData.length > 0) {
    let data = state.tableData[state.tableData.length - 1] as any
    sortBy = data.sortBy + 1
  }
  state.itemData.parentId = '0'
  state.itemData.sortBy = sortBy
  state.itemData.parentName = '一级分类'
  state.mode = Mode.CREATE
  state.formView = true
}

/**
 * 添加子分类
 */
const addChildProductCategory = (itemData: any) => {
  let sortBy = 1
  if (itemData.children && itemData.children.length > 0) {
    let data = itemData.children[itemData.children.length - 1]
    sortBy = data.sortBy + 1
  }
  state.itemData.parentId = itemData.productCategoryId
  state.itemData.sortBy = sortBy
  state.itemData.parentName = itemData.name
  state.mode = Mode.CREATE
  state.formView = true
}

/**
 * 删除
 */
const onDelete = async (item: any) => {
  const { code, msg } = await apis.deleteJSON(apis.productCategory, {
    data: [`${item.productCategoryId}`],
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
    state.expandedRowKeys.push(record.productCategoryId)
  } else {
    state.expandedRowKeys.splice(state.expandedRowKeys.indexOf(record.productCategoryId), 1)
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
