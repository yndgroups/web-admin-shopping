<template>
  <div class="page-container">
    <CommonYndCrud
      :request="curdApi"
      :modalConfig="{ title: '应用' }"
      :tableConfig="{ columns }"
      ref="commonYndCrud"
    >
      <!-- 搜索栏 -->
      <template #search="{ params }">
        <a-col :span="8">
          <a-form-item
            name="title"
            label="标题关键词"
          >
            <a-input
              v-model:value="params.title"
              placeholder="请输入协议标题关键词"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            name="content"
            label="内容关键词"
          >
            <a-input
              v-model:value="params.content"
              placeholder="请输入协议内容关键词"
            />
          </a-form-item>
        </a-col>
      </template>

      <!-- 功能按钮 -->
      <template #action>
        <a-button
          type="primary"
          html-type="submit"
          danger
          @click="add"
          :size="config.formSize"
        >
          新增
        </a-button>
      </template>
      <!-- 表格栏 -->
      <template #tableColumns="{ column, record, methods }">
        <template v-if="column.key === 'display'">
          <span v-if="record.display == 1">显示</span>
          <span v-else>隐藏</span>
        </template>
        <template v-if="column.key === 'operation'">
          <a-button
            type="link"
            :size="config.formSize"
            @click="edit(record)"
            v-auth="'admin:agreement:edit'"
          >
            <span class="text-primary">修改</span>
          </a-button>
          <span v-auth="'admin:agreement:del'">
            <a-popconfirm
              title="您确定要删除这条数据吗？"
              trigger="click"
              @confirm="methods.onDelete([record.agreeId])"
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
          </span>
        </template>
      </template>
    </CommonYndCrud>
    <system-agreement-form
      @closeModal="closeModal"
      :mode="state.mode"
      :itemData="state.itemData"
      v-if="state.showForm"
    />
  </div>
</template>
<script lang="ts" setup layout="shopping" title="协议管理">
import config from '@/config/theme'
import apis from '@/apis'
const commonYndCrud = ref<HTMLElement>()
/**
 * 表格表头
 */
let columns = [
  { title: '标题', dataIndex: 'title', key: 'title' },
  { title: '显示', dataIndex: 'display', key: 'display', width: 100, align: 'center' },
  {
    title: '发布时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 200,
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: 200,
  },
  { title: '操作', key: 'operation', width: 150, align: 'center' },
]
const curdApi = {
  list: apis.agreementFindPageList,
  cud: apis.agreement,
  create: apis.agreement,
}

let state = reactive<any>({
  showForm: false,
  itemData: {},
  mode: 1,
})

const closeModal = (bool: boolean) => {
  if (bool) {
    let refs = commonYndCrud.value as any
    refs.onRefresh()
  }
  state.showForm = false
}

const add = () => {
  state.mode = 1
  state.showForm = true
}

const edit = (record: any) => {
  state.itemData = record
  state.mode = 2
  state.showForm = true
}
</script>
