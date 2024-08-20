<template>
  <div class="page-list-container bg-white">
    <CommonYndCrud :config="crudConfig">
      <!-- 搜索栏 -->
      <template #search="{ params }">
        <a-col :span="8">
          <a-form-item
            name="name"
            label="店铺"
          >
            <CommonYndSelectStore
              v-model:value="params.storeName"
              placeholder="请输入选择店铺"
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
          v-auth="'admin:ad:add'"
        >
          添加轮播图
        </a-button>
      </template>

      <!-- 表格栏 -->
      <template #tableColumns="{ column, record, methods }">
        <template v-if="column.key === 'content' && record.content">
          <a-carousel arrows>
            <template #prevArrow>
              <div
                class="custom-slick-arrow"
                style="left: 10px; z-index: 1"
              >
                <left-circle-outlined />
              </div>
            </template>
            <template #nextArrow>
              <div
                class="custom-slick-arrow"
                style="right: 10px"
              >
                <right-circle-outlined />
              </div>
            </template>
            <div
              style="width: 200px; height: 120px"
              v-for="(item, index) in record.content"
              :key="index"
            >
              <img
                style="width: 100%; height: 120px"
                :src="item.imageUrl"
                :alt="item.title"
              />
            </div>
          </a-carousel>
        </template>
        <template v-if="column.key === 'operation'">
          <a-button
            type="link"
            :size="config.formSize"
            @click="methods.onOpenModal(Mode.DETAIL, `${record.adId}`)"
            v-auth="'admin:ad:find'"
          >
            <span>查看</span>
          </a-button>
          <a-button
            type="link"
            :size="config.formSize"
            @click="methods.onOpenModal(Mode.UPDATE, `${record.adId}`)"
            v-auth="'admin:ad:edit'"
          >
            <span>编辑</span>
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
              v-auth="'admin:ad:del'"
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
  { title: '店铺名称', dataIndex: 'storeName', key: 'storeName' },
  { title: '广告类型', dataIndex: 'adTypeName', key: 'adTypeName' },
  { title: '呈现类型', dataIndex: 'viewTypeName', key: 'viewTypeName' },
  { title: '广告位置', dataIndex: 'positionName', key: 'positionName' },
  { title: '广告信息', dataIndex: 'content', key: 'content' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '操作', key: 'operation', width: 180 },
]
let crudConfig: CrudConfig = {
  apis: {
    list: apis.storeAdFindPageList,
    cud: apis.storeAd,
    findById: apis.storeAdFindById,
  },
  modalConfig: { title: '广告', width: 1000 },
  tableConfig: {
    columns: columns,
    tableKey: 'adId',
  },
  searchParams: { params: {}, showButton: true, showSearch: true },
}
</script>
