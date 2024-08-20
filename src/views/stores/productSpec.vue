<template>
  <div class="page-list-container bg-white">
    <CommonYndCrud :config="crudConfig">
      <!-- 搜索栏 -->
      <template #search="{ params }">
        <a-col :span="8">
          <a-form-item
            name="name"
            label="规格名称"
          >
            <a-input
              v-model:value="params.name"
              placeholder="请输入规格名称"
            />
          </a-form-item>
        </a-col>
      </template>

      <!-- 功能按钮 -->
      <template #action="{ action }">
        <a-button
          type="primary"
          html-type="submit"
          @click="
            action.onOpenModal(Mode.CREATE, {
              storeId: '1', // 此处写死的，以后多商户的时候记得处理
              sortBy: 1,
              name: '',
              options: [{ name: '', options: [''] }],
            })
          "
          :size="config.formSize"
        >
          添加规格
        </a-button>
      </template>

      <!-- 表格栏 -->
      <template #tableColumns="{ column, record, methods }">
        <template v-if="column.key === 'options' && record.options && record.options.length">
          <dl
            v-for="(o, i) in record.options"
            :key="i"
            class="table-item"
          >
            <dt>{{ o.name }}:</dt>
            <dd>
              {{ o.options.join(',') }}
            </dd>
          </dl>
        </template>
        <template v-if="column.key === 'operation'">
          <a-button
            type="link"
            :size="config.formSize"
            @click="methods.onOpenModal(Mode.DETAIL, `${record.specId}`)"
          >
            <span>查看</span>
          </a-button>
          <a-button
            type="link"
            :size="config.formSize"
            @click="methods.onOpenModal(Mode.UPDATE, `${record.specId}`)"
          >
            <span>编辑</span>
          </a-button>
          <a-popconfirm
            title="您确定要删除这条数据吗？"
            trigger="click"
            @confirm="methods.onDelete([record.specId])"
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

      <!-- 表单选中框 -->
      <template #modal="{ modelData, mode, methods, readOnly }">
        <StoreSpecForm
          :model-data="modelData"
          :mode="mode"
          :methods="methods"
          :readOnly="readOnly"
        />
      </template>
    </CommonYndCrud>
  </div>
</template>
<script lang="ts" setup layout="shopping" title="广告">
import config from '@/config/theme'
import apis from '@/apis'
import { Mode } from '@/core'
import type { CrudConfig } from '@/core/types'
const columns = [
  { title: '规格名称', dataIndex: 'name', key: 'name' },
  { title: '规格配置', dataIndex: 'options', key: 'options' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '操作', key: 'operation', width: 200 },
]
let crudConfig: CrudConfig = {
  apis: {
    list: apis.storeProductSpecFindPageList,
    cud: apis.storeProductSpec,
    findById: apis.storeProductSpecFindById,
  },
  modalConfig: { title: '商品规格', width: 1000 },
  tableConfig: {
    columns: columns,
    tableKey: 'specId',
  },
  searchParams: { params: {}, showButton: true, showSearch: true },
}
</script>
<style lang="scss">
.table-item {
  display: flex;
  dt {
    font-weight: bold;
    padding-right: 5px;
  }
  dd {
    flex: 1;
  }
}
</style>
