<template>
  <div class="page-list-container bg-white">
    <YndPageCrudContainer :config="pageCrudContainerOptions">
      <!-- 搜索栏 -->
      <template #search="{ params }">
        <a-col :span="10">
          <a-form-item
            name="name"
            label="地区名称"
          >
            <a-input
              v-model:value="params.areaName"
              placeholder="请输入地区名称"
            />
          </a-form-item>
        </a-col>
        <a-col :span="10">
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
          :size="themeConfig.formSize"
        >
          添加地区
        </a-button>
      </template>

      <!-- 表格栏 -->
      <template #tableColumns="{ column, record, methods }">
        <template v-if="column.key === 'logo'">
          <img
            v-if="record.logo"
            class="w-80"
            :src="showImag(record.logo)"
            alt=""
          />
        </template>
        <template v-if="column.key === 'operation'">
          <span v-auth="'admin:app:del'">
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
                :size="themeConfig.formSize"
              >
                <span class="text-danger">删除</span>
              </a-button>
            </a-popconfirm>
          </span>
          <a-button
            type="link"
            :size="themeConfig.formSize"
            @click="methods.onOpenModal(Mode.UPDATE, record)"
            v-auth="'admin:app:edit'"
          >
            <span class="text-warning">修改</span>
          </a-button>
        </template>
      </template>
      <!-- 表单选中框 -->
      <template #modal="{ modelData, mode, methods }">
        <SystemAreaForm
          :item-data="modelData"
          :mode="mode"
          :methods="methods"
        />
      </template>
    </YndPageCrudContainer>
  </div>
</template>
<script lang="ts" setup layout="shopping" title="应用管理">
import themeConfig from '@/config/theme'
import apis from '@/apis'
import { showImag } from '@/utils'
import { type PageCrudContainerOptions, Mode } from '@/core'
// 构建表格参数
const pageCrudContainerOptions: PageCrudContainerOptions = {
  request: {
    list: apis.findPageAreaList,
    create: apis.area,
    update: apis.area,
    delete: apis.area,
    detail: apis.findAreaById,
  },
  modalConfig: {
    title: '地区',
  },
  tableConfig: {
    tableKey: 'areaId',
    columns: [
      { title: '地区编码', dataIndex: 'areaCode', key: 'areaCode', width: 140 },
      { title: '父编码', dataIndex: 'parentCode', key: 'parentCode', width: 140 },
      { title: '级别', dataIndex: 'areaTag', key: 'areaTag', width: 80, align: 'center' },
      { title: '来源年限', dataIndex: 'year', key: 'year', width: 100, align: 'center' },
      { title: '地区名称', dataIndex: 'areaName', key: 'areaName' },
      { title: '全称', dataIndex: 'fullAreaName', key: 'fullAreaName' },
      { title: '操作', key: 'operation', width: 200, align: 'center' },
    ],
  },
}
</script>
