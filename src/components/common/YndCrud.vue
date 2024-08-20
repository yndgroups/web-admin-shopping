<template>
  <div class="page-crud">
    <!-- 搜索栏 -->
    <div class="crud-search">
      <a-card size="small">
        <template #title>搜索条件</template>
        <template #extra>
          <slot
            name="action"
            :action="{ onOpenModal }"
          ></slot>
        </template>
        <CommonYndSearchForm
          v-if="searchParams.showSearch"
          ref="formRef"
          :model="pageInfo.params"
          @search="onSearch"
          @reset="onReset"
        >
          <slot
            name="search"
            :params="pageInfo.params"
          ></slot>
        </CommonYndSearchForm>
      </a-card>
    </div>

    <!-- 表格数据封装 -->
    <div class="crud-content">
      <a-card
        size="small"
        :bordered="false"
      >
        <a-table
          :columns="config.tableConfig.columns"
          :data-source="tableData"
          :row-selection="config.tableConfig?.rowSelection || {}"
          :loading="loading"
          :pagination="false"
          tableLayout="fixed"
          :row-key="(record: any) => record[`${config.tableConfig.tableKey}`]"
          :scroll="{ y: tableHeight }"
        >
          <template #bodyCell="{ column, record }: any">
            <!-- <CommonYndDictText
              v-if="column.dictType"
              :dictType="column.dictType"
              :value="record[column.key]"
            /> -->
            <slot
              name="tableColumns"
              :column="column"
              :record="record"
              :methods="{ onDelete, onOpenModal }"
            ></slot>
          </template>
        </a-table>
        <!-- 数据表格 -->
        <div class="crud-pager pd-t15 text-right">
          <a-pagination
            :size="themeConfig.paginationSize"
            :show-total="(total: number) => `共 ${total} 条`"
            show-size-changer
            show-quick-jumper
            v-model:current="pageInfo.pageIndex"
            v-model:pageSize="pageInfo.pageSize"
            :total="pageInfo.totalCount"
            @showSizeChange="onChangePageSize"
            @change="onChangePageIndex"
          />
        </div>
      </a-card>
    </div>

    <!-- 自定义弹框 -->
    <template v-if="state.modalVisible">
      <a-modal
        v-model:open="state.modalVisible"
        :title="modalConfig.title + (state.mode === Mode.CREATE ? '添加' : state.mode === Mode.UPDATE ? '修改' : '详情')"
        :width="modalConfig.width || 600"
        @cancel="closeModal"
        :okButtonProps="{ disabled: state.mode === 3 }"
        :destroyOnClose="true"
        :footer="null"
      >
        <slot
          name="modal"
          :mode="state.mode"
          :readOnly="state.mode === Mode.DETAIL"
          :submitLoading="submitLoading"
          :modelData="state.modelData"
          :methods="{ onValidate, closeModal, onSubmitRequest }"
        />
      </a-modal>
    </template>
    <slot
      name="custom"
      :methods="{ onValidate, closeModal, onSubmitRequest }"
    ></slot>
  </div>
</template>
<script lang="ts" setup>
import themeConfig from '@/config/theme'
import type { CrudConfig } from '@/core/types'
import { editParams, pager } from '@/utils/plugin.mixins'
import { message, type FormInstance } from 'ant-design-vue'
import apis from '@/apis'
import { HttpMethod } from '@/config/axios'
import { type Viewport, type AnyObj, Mode } from '@/core'
import type { PropType } from 'vue'
import { inject } from 'vue'
let viewport = inject<Ref<Viewport>>('viewport')
const tableHeight = computed(() => {
  let total = viewport?.value.vh || 500
  return total - 350
})
// 不能将类型“Readonly<ExtractPropTypes<{ apis: { type: ObjectConstructor; }; }>>”分配给类型“Readonly<PropsType>”。
//   属性“apis”的类型不兼容。ts(2322)
let props = defineProps({
  config: {
    type: Object as PropType<CrudConfig>,
    default: () => {},
  },
})

const request = props.config.apis
const modalConfig = props.config.modalConfig
const searchParams = props.config.searchParams || { params: {}, showButton: true, showSearch: true }

let state = reactive<any>({
  ...editParams,
  ...pager(props.config.searchParams?.params || {}),
  itemData: null,
  values: [],
  modelData: {},
  modalVisible: false,
  mode: Mode.OTHER,
  open: false,
  showFrom: false,
  submitLoading: false,
})

let { pageInfo, tableData, loading, submitLoading } = toRefs(state)

onMounted(() => {
  // @ts-ignore
  Logger.info('测试日志')
  onListRequest()
})

/**
 * 获取列表数据
 */
const onListRequest = async () => {
  state.loading = true
  state.tableData = []
  let { data, code, msg } = await apis.postJSON(request.list, {
    data: state.pageInfo,
  })
  if (code === 1) {
    state.tableData = data['list'] || []
    state.pageInfo.totalCount = data.totalCount || data.count || 0
  } else {
    state.tableData = []
    state.pageInfo.totalCount = 0
    message.warning(msg)
  }
  state.loading = false
}

/**
 * 开启模态框
 */
const onOpenModal = async (mode: Mode, record: any = {}) => {
  // 编辑和详情时
  if (mode === Mode.UPDATE || mode === Mode.DETAIL) {
    // 请求详情接口数据数据做回显
    let { code, data, msg } = await apis.getJSON(request.findById + record)
    if (code === 1 && data) {
      state.modelData = data
    } else {
      message.error(msg || '详情查询失败')
    }
  } else {
    state.modelData = record
  }
  state.mode = mode
  state.modalVisible = true
}

/**
 * 关闭模态框
 */
const closeModal = () => {
  state.modelData = {}
  state.modalVisible = false
  state.submitLoading = false
}

/**
 * 表单校验, 校验通过，提交数据
 */
const onValidate = (formRef: Ref<FormInstance> | undefined | any) => {
  formRef?.validate().then(async () => {
    onSubmitRequest()
  })
}

/**
 * 请求后端接口
 *
 * @param formData 需要提交的数据
 * @param mode 提交模式
 */
const onSubmitRequest = async () => {
  let method = state.mode === Mode.CREATE ? HttpMethod.POST : state.mode === Mode.UPDATE ? HttpMethod.PUT : state.mode === Mode.DELETE ? HttpMethod.DELETE : undefined
  if (!method) {
    return
  }
  let { code, msg } = await apis.request({
    url: request.cud,
    method: method,
    data: state.modelData,
  })
  switch (state.mode) {
    case Mode.CREATE:
      if (code == 1) {
        message.success('新增成功')
      } else {
        message.error('新增失败')
      }
      break
    case Mode.UPDATE:
      if (code == 1) {
        message.success('修改成功')
      } else {
        message.error('修改失败')
      }
      break
    case Mode.DELETE:
      if (code == 1) {
        message.success('删除成功')
      } else {
        message.error('删除失败')
      }
      break
  }
  onRefresh()
}

/*
 * 刷新数据， 新增和删除时将索引变为1，避免数据列表获取失败
 * 删除时如果当页面有数据
 */
const onRefresh = () => {
  state.modalVisible = false
  switch (state.mode) {
    case Mode.CREATE:
      state.pageInfo.pageIndex = 1
      break
    case Mode.DELETE:
      if (state.tableData.length == 1 && state.pageInfo.pageIndex > 1) {
        state.pageInfo.pageIndex -= 1
      }
      break
  }
  state.modelData = {}
  onListRequest()
}

/**
 * 搜索
 */
const onSearch = () => {
  state.pageInfo.pageIndex = 1
  onListRequest()
}

/**
 * 重置表单搜索
 */
const onReset = () => {
  for (let k in state.pageInfo.params) {
    delete state.pageInfo.params[k]
  }
  onListRequest()
}

/**
 * 删除
 * @param ids 删除的id集合
 */
const onDelete = async (ids: Array<string> = []) => {
  Logger.log(`onDelete: ids =>`, ids)
  if (Array.isArray(ids)) {
    for (let i = 0; i < ids.length; i++) {
      if (!ids[i]) {
        message.error(`id参数第【${i + 1}】项不能${ids[i]}`)
        return
      }
    }
  } else {
    message.error('id参数只能是个数组')
    return
  }
  let url = request?.cud || undefined
  if (!url) {
    return
  }
  const { code, msg } = await apis.deleteJSON(url, {
    data: ids,
  })
  if (code == 1) {
    message.success(msg)
    onListRequest()
    return
  }
  message.error(msg || '删除失败')
}

/**
 * 改变请求长度
 * @param pageIndex 其实索引
 * @param pageSize 分页长度
 */
const onChangePageSize = (pageIndex: number, pageSize: number) => {
  state.pageInfo.pageIndex = pageIndex
  state.pageInfo.pageSize = pageSize
  onListRequest()
}

/**
 * 分页操作
 * @param pageIndex 其实索引
 * @param pageSize 分页长度
 */
const onChangePageIndex = (pageIndex: number, pageSize: number) => {
  state.pageInfo.pageIndex = pageIndex
  state.pageInfo.pageSize = pageSize
  onListRequest()
}

defineExpose({
  onRefresh,
  onValidate,
})
</script>
<style lang="scss" scoped>
.page-crud {
  height: calc(100vh - 108px);
  background: #f2f2f2;
  overflow: hidden;

  .crud-search {
    margin-bottom: 5px;
  }

  .crud-content {
    height: calc(100vh - 200px);
    background: #ffffff;
  }
}
</style>
