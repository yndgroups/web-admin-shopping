<template>
  <div class="page-crud">
    <!-- 搜索栏 -->
    <div
      class="crud-search"
      v-if="slots.search"
    >
      <a-card size="small">
        <template #title>搜索条件</template>
        <template
          #extra
          v-if="slots.action"
        >
          <slot
            name="action"
            :action="{ onOpenModal }"
          ></slot>
        </template>
        <CommonYndSearchForm
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
          :columns="config.tableConfig.columns || []"
          :data-source="tableData"
          :row-selection="config.rowSelection"
          :loading="loading"
          :pagination="false"
          tableLayout="fixed"
          :row-key="(record: any) => record[`${config.tableConfig.tableKey}`]"
          :scroll="{ y: vh - 330 }"
        >
          <template #bodyCell="{ column, record }: any">
            <CommonYndDictText
              v-if="column.dictType"
              :dictType="column.dictType"
              :value="record[column.key]"
            />
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
    <template v-if="slots.modal && state.modalVisible">
      <a-modal
        v-model:open="state.modalVisible"
        :title="modalConfig.title + (state.mode === Mode.CREATE ? '添加' : state.mode === Mode.UPDATE ? '修改' : '详情')"
        :width="modalConfig.width || 600"
        @cancel="closeModal"
        :okButtonProps="{ disabled: state.mode === Mode.DETAIL }"
        :destroyOnClose="true"
        :footer="null"
      >
        <slot
          name="modal"
          :mode="state.mode"
          :submitLoading="submitLoading"
          :modelData="state.modelData"
          :methods="{ onSave, onValidateFail, closeModal }"
          :readOnly="state.mode === Mode.DETAIL"
        />
      </a-modal>
    </template>
  </div>
</template>
<script lang="ts" setup>
import themeConfig from '@/config/theme'
import { editParams, pager } from '@/utils/plugin.mixins'
import { message, type FormInstance } from 'ant-design-vue'
import apis from '@/apis'
import { HttpMethod } from '@/config/axios'
import { type Viewport, type AnyObj, type PageCrudContainerOptions, type Request, Mode } from '@/core'
import type { PropType } from 'vue'
const slots = useSlots()
const vh = computed(() => {
  let { vh } = inject('viewport') as Viewport
  return vh
})
// 不能将类型“Readonly<ExtractPropTypes<{ apis: { type: ObjectConstructor; }; }>>”分配给类型“Readonly<PropsType>”。
//   属性“apis”的类型不兼容。ts(2322)
let props = defineProps({
  config: {
    type: Object as PropType<PageCrudContainerOptions>,
    required: true,
    default: () => {},
  },
})

const request: Request = props.config.request
const modalConfig = props.config.modalConfig as AnyObj
const formRef = ref<FormInstance>()

let state = reactive<any>({
  ...editParams,
  ...pager(props.config.searchParams),
  itemData: null,
  modelData: {},
  modalVisible: false,
  mode: Mode.CREATE, // 1:新增 2:修改 3:查看
  open: false,
  submitLoading: false,
  readOnly: false,
})

let { pageInfo, tableData, loading, submitLoading } = toRefs(state)
/**
 * 生命周期函数
 */
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
    state.pageInfo.totalCount = data.totalCount || data.count
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
const onOpenModal = (mode: Mode, record: any = null) => {
  Logger.log(`onOpenModal: mode => 【${mode}】 \n (record: any)=> 【${JSON.stringify(record)}】`)
  if (mode === Mode.CREATE || mode === Mode.DETAIL) {
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
 * 表单校验
 * @param errorInfo 失败信息
 */
const onValidateFail = (errorInfo: any) => {
  message.error('表单校验不通过，请按要求填写')
}

/**
 * 保存数据
 */
const onSave = async (formData: any) => {
  if (state.mode === Mode.CREATE && !request.create) {
    return
  }
  if (state.mode === Mode.UPDATE && !request.update) {
    return
  }
  state.submitLoading = true
  let { code, msg } = await apis.request({
    url: state.mode === Mode.CREATE ? request?.create : request?.update,
    method: state.mode === Mode.CREATE ? HttpMethod.POST : HttpMethod.PUT,
    data: formData,
  })
  Logger.log(`ajaxResult: code => 【${code}】 message => 【${msg}】,888888`)
  if (code === 1) {
    message.success(state.mode === Mode.CREATE ? '新增成功' : '修改成功')
    state.modalVisible = false
    onListRequest()
  } else {
    message.warning(msg)
  }
  state.submitLoading = false
}

/*
 * 刷洗数据
 */
const onRefresh = () => {
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
  if (!request.delete) {
    return
  }
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
  const { code, msg } = await apis.deleteJSON(request?.delete, {
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
