<template>
  <div class="page-list-container bg-white">
    <!-- 表单搜索区 -->
    <a-card title="条件搜索">
      <template #extra>
        <a-button
          :size="config.formSize"
          @click="showForm"
          type="primary"
          class="mg-r10"
        >
          <template #icon>
            <PlusSquareOutlined />
          </template>
          添加标签
        </a-button>
      </template>
      <a-form layout="inline">
        <a-form-item>
          <a-input
            v-model:value="pageInfo.params.keyWord"
            :size="config.formSize"
            allowClear
            placeholder="请输入用户昵称或手机号"
          ></a-input>
        </a-form-item>
        <a-form-item>
          <a-button
            :size="config.formSize"
            @click="search"
            type="primary"
            class="mg-l10 mg-r10"
          >
            搜索
          </a-button>
          <a-button
            :size="config.formSize"
            @click="reset"
            class="mg-r10"
          >
            重置
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <!-- 数据展示区 -->
    <div class="page-content">
      <a-card
        size="small"
        class="page-conten"
        :bordered="false"
      >
        <!-- 数据表格 -->
        <a-table
          :columns="columns"
          :data-source="state.tableData"
          :loading="state.loading"
          :row-key="(record:any) => record.productId"
          :scroll="{ y: pageHeight - config.tableSubtractHight }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'images'">
              <img
                v-if="record.images"
                class="w-80"
                :src="showImag(JSON.parse(record.images)[0].thumbnail)"
                alt=""
              />
            </template>
            <template v-if="column.key === 'operation'">
              <a-dropdown>
                <a
                  class="ant-dropdown-link"
                  @click.prevent
                >
                  <AppstoreAddOutlined style="font-size: 30px" />
                </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <a-button
                        type="link"
                        :size="config.formSize"
                        @click="operation(record, 2)"
                      >
                        <span>查看</span>
                      </a-button>
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item>
                      <a-button
                        type="link"
                        :size="config.formSize"
                        @click="operation(record, 3)"
                      >
                        <span class="text-warning">修改</span>
                      </a-button>
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item>
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
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
          </template>
        </a-table>
        <!-- 分页 -->
        <div class="pd-t15 text-right">
          <a-pagination
            :size="config.paginationSize"
            :show-total="(total: number) => `共 ${total} 条`"
            show-size-changer
            show-quick-jumper
            v-model:current="state.pageInfo.pageIndex"
            v-model:pageSize="state.pageInfo.pageSize"
            :total="state.pageInfo.totalCount"
            @showSizeChange="onShowSizeChange"
            @change="pageChange"
          />
        </div>
      </a-card>
    </div>
    <div v-if="state.formView">
      <ProductEditForm
        @closeModal="state.formView = false"
        :appId="state.appId"
        :item-data="state.itemData"
        :operation-type="state.mode"
      />
    </div>
  </div>
</template>
<script lang="ts" setup layout="shopping">
import config from '@/config/theme'
import { editParams, pager } from '@/utils/plugin.mixins'
import { showImag } from '@/utils'
import apis from '@/apis'
import { message } from 'ant-design-vue'

const columns = [
  { title: '标签名称', dataIndex: 'key', key: 'key' },
  { title: '标签人数', dataIndex: 'key', key: 'key' },
  { title: '标签类型', dataIndex: 'key', key: 'key' },
  { title: '达标条件', dataIndex: 'key', key: 'key' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '操作', key: 'operation', width: 100 },
]
let state = reactive<any>({
  ...editParams,
  ...pager({ businessName: '', caption: '', introduction: '', name: '' }),
  itemData: null,
})
let { pageHeight, pageInfo } = toRefs(state) as any

// 生命周期函数
onMounted(() => {
  // getListData();
})

// watch(() => {
//   console.log(state,'w')
// })

const showForm = (record: any) => {
  state.mode = 1
  state.itemData = record
  state.formView = true
}

// 表格操作
const rowSelection = {
  onChange: (selectedRowKeys: any, selectedRows: any) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  },
  onSelect: (record: any, selected: any, selectedRows: any) => {
    console.log(record, selected, selectedRows)
  },
  onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
    console.log(selected, selectedRows, changeRows)
  },
}

/** 表单相关操作 */
const operation = (itemData: any, mode: any, formView = true) => {
  state.itemData = itemData
  state.mode = mode
  state.formView = formView
}

/**
 * 获取列表数据
 */
const getListData = async () => {
  state.loading = true
  state.tableData = []
  let { data, code, msg } = await apis.postJSON(apis.findProductPageList, {
    data: state.pageInfo,
  })
  if (code == 1) {
    state.tableData = data.list
    state.pageInfo.totalCount = data.totalCount
  } else {
    state.tableData = []
    state.totalCount = 0
    message.warning(msg)
  }
  state.loading = false
}

/**
 * 搜索
 */
const search = () => {
  state.pageInfo.pageIndex = 1
  getListData()
}

/**
 * 重置表单搜索
 */
const reset = () => {
  for (let k in state.pageInfo.params) {
    state.pageInfo.params[k] = ''
  }
  getListData()
}

/**
 * 删除
 */
const onDelete = async (item: any) => {
  const { code, msg } = await apis.deleteJSON(apis.storeRank, {
    data: { idArr: [`${item.storeRankId}`] },
  })
  if (code == 1) {
    message.success(msg)
    getListData()
    return
  }
  message.error(msg)
}

/**
 * 改变请求长度
 */
const onShowSizeChange = (pageIndex: number, pageSize: number) => {
  state.pageInfo.pageIndex = pageIndex
  state.pageInfo.pageSize = pageSize
  getListData()
}

/**
 * 分页操作
 */
const pageChange = (pageIndex: number, pageSize: number) => {
  state.pageInfo.pageIndex = pageIndex
  state.pageInfo.pageSize = pageSize
  getListData()
}
</script>
