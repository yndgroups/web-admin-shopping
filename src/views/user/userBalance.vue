<template>
  <div class="page-list-container bg-white">
    <!-- 表单搜索区 -->
    <a-card title="条件搜索">
      <a-form layout="inline">
        <a-form-item>
          <a-input
            style="width: 240px"
            v-model:value="pageInfo.params.keyWord"
            :size="config.formSize"
            allowClear
            placeholder="请输入用户昵称或充值金额"
          ></a-input>
        </a-form-item>
        <a-form-item>
          <a-select
            style="width: 140px"
            :size="config.formSize"
            v-model:value="pageInfo.params.orderType"
            placeholder="请选择充值状态"
            allowClear
            :options="user.search.rechargeStatus"
          ></a-select>
        </a-form-item>
        <a-form-item>
          <a-button
            :size="config.formSize"
            @click="search"
            type="primary"
            class="mg-l10 mg-r10"
          >
            <template #icon>
              <SearchOutlined />
            </template>
            <span>搜索</span>
          </a-button>
          <a-button
            :size="config.formSize"
            @click="reset"
            class="mg-r10"
          >
            <template #icon>
              <RedoOutlined />
            </template>
            <span>重置</span>
          </a-button>
          <span v-if="pageInfo.params.length > 3">
            <a-button
              :size="config.formSize"
              type="link"
              v-if="!state.shrink"
              @click="state.shrink = true"
            >
              展开
              <DownOutlined />
            </a-button>
            <a-button
              :size="config.formSize"
              type="link"
              v-else
              @click="state.shrink = false"
            >
              折叠
              <UpOutlined />
            </a-button>
          </span>
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
        <a-tabs v-model:activeKey="tabActiveKey">
          <a-tab-pane
            key="1"
            tab="充值记录"
          ></a-tab-pane>
          <a-tab-pane
            key="2"
            tab="积分明细"
            force-render
          ></a-tab-pane>
          <a-tab-pane
            key="3"
            tab="余额明细"
          ></a-tab-pane>
        </a-tabs>
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
import { user } from '@/config/data/enum'
import { showImag } from '@/utils'
import apis from '@/apis'
import { message } from 'ant-design-vue'

const columns = [
  { title: '用户', dataIndex: 'key', key: 'key' },
  { title: '支付金额', dataIndex: 'key', key: 'key' },
  { title: '支付方式', dataIndex: 'key', key: 'key' },
  { title: '充值类型', dataIndex: 'key', key: 'key' },
  { title: '到账余额', dataIndex: 'key', key: 'key' },
  { title: '时间', dataIndex: 'key', key: 'key' },
  { title: '操作员', dataIndex: 'key', key: 'key' },
  { title: '状态', dataIndex: 'key', key: 'key' },
  { title: '申请时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '操作', key: 'operation', width: 100 },
]
let state = reactive<any>({
  ...editParams,
  ...pager({ businessName: '', caption: '', introduction: '', name: '' }),
  itemData: null,

  tabActiveKey: '1',
})
let { pageHeight, pageInfo, tabActiveKey } = toRefs(state) as any

// 生命周期函数
onMounted(() => {
  // getListData();
})

/** 表单相关操作 */
const operation = (itemData: any, mode: number, formView = true) => {
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
  const { code, msg } = await apis.postJSON(apis.storeRank, {
    data: { idArr: [`${item.storeRankId}`] },
  })
  if (code === 1) {
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
