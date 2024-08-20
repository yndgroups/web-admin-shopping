<template>
  <div class="page-list-container bg-white">
    <CommonYndCrud :config="crudConfig">
      <!-- 搜索栏 -->
      <template #search="{ params }">
        <a-col :span="8">
          <a-form-item
            name="name"
            label="店铺名称"
          >
            <a-input
              v-model:value="params.store_id"
              placeholder="请输入店铺名称"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            name="introduce"
            label="地区编码"
          >
            <a-input
              v-model:value="params.areaCode"
              placeholder="请输入地区编码"
            />
          </a-form-item>
        </a-col>
      </template>

      <!-- 功能按钮 -->
      <template #action="{ action }">
        <a-button
          type="primary"
          html-type="submit"
          @click="action.onOpenModal(Mode.CREATE)"
          :size="config.formSize"
        >
          添加用户
        </a-button>
      </template>

      <!-- 表格栏 -->
      <template #tableColumns="{ column, record, methods }">
        <template v-if="column.key === 'operation'">
          <a-button
            type="link"
            :size="config.formSize"
            @click="methods.onOpenModal(Mode.DETAIL, `${record.adId}`)"
          >
            <span>查看</span>
          </a-button>
          <a-popconfirm
            title="您确定要删除这条数据吗？"
            trigger="click"
            @confirm="methods.onDelete([record.roleId])"
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
      <template #modal="{ modelData, mode, methods }">
        <StoreAdForm
          :model-data="modelData"
          :mode="mode"
          :methods="methods"
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
  { title: '用户名', dataIndex: 'userName', key: 'userName', width: 150 },
  {
    title: '真实姓名',
    dataIndex: 'realName',
    key: 'realName',
    width: 150,
  },
  { title: '用户电话', dataIndex: 'phone', key: 'phone', width: 150 },
  { title: '用户邮箱', dataIndex: 'email', key: 'email', width: 200 },
  {
    title: '帐号类型',
    dataIndex: 'accountType',
    key: 'accountType',
    width: 150,
    dictType: 'account-type',
  },
  {
    title: '来源分类',
    dataIndex: 'regType',
    key: 'regType',
    width: 150,
    dictType: 'reg-type',
  },
  { title: '操作', dataIndex: 'operation', key: 'operation', width: 200, fixed: 'right' },
]
let crudConfig: CrudConfig = {
  apis: {
    list: apis.userFindPageList,
    cud: apis.user,
    findById: apis.userFindById,
  },
  modalConfig: { title: '用户' },
  tableConfig: {
    columns: columns,
    tableKey: 'userId',
  },
  searchParams: { params: {}, showButton: true, showSearch: true },
}
</script>
