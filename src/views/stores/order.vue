<template>
  <div class="page-list-container bg-white">
    <CommonYndCrud :config="crudConfig">
      <!-- 搜索栏 -->
      <template #search="{ params }">
        <a-form-item
          name="status"
          label="订单状态"
        >
          <a-select
            v-model:value="params.status"
            :options="order.common.orderStatus"
          ></a-select>
        </a-form-item>
        <a-form-item
          name="name"
          label="订单号"
        >
          <a-input
            v-model:value="params.orderNo"
            placeholder="请输入订单号"
          />
        </a-form-item>
        <a-form-item
          name="userPhone"
          label="手机号"
        >
          <a-input
            v-model:value="params.userPhone"
            placeholder="请输入手机号"
          />
        </a-form-item>
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
            @click="methods.onOpenModal(Mode.DETAIL, `${record.orderId}`)"
            v-auth="'admin:order:find'"
          >
            <span>查看</span>
          </a-button>
          <a-button
            type="link"
            :size="config.formSize"
            @click="methods.onOpenModal(Mode.UPDATE, `${record.orderId}`)"
            v-auth="'admin:order:edit'"
          >
            <span>编辑</span>
          </a-button>
          <a-popconfirm
            title="您确定要删除这条数据吗？"
            trigger="click"
            @confirm="methods.onDelete([record.orderId])"
          >
            <template v-slot:icon>
              <question-circle-outlined style="color: red" />
            </template>
            <a-button
              type="link"
              :size="config.formSize"
              v-auth="'admin:order:del'"
            >
              <span class="text-danger">删除</span>
            </a-button>
          </a-popconfirm>
        </template>
      </template>

      <!-- 表单选中框 -->
      <template #modal="{ modelData, mode, methods, readOnly }">
        <OrderDetail
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
import { order } from '@/config/data/enum'
const columns = [
  { title: '订单号', dataIndex: 'orderNo', key: 'orderNo' },
  { title: '支付金额', dataIndex: 'payPrice', key: 'payPrice' },
  { title: '总价格', dataIndex: 'totalPrice', key: 'totalPrice' },
  { title: '支付金额', dataIndex: 'payPrice', key: 'payPrice' },
  { title: '下单手机号', dataIndex: 'userPhone', key: 'userPhone' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '操作', key: 'operation', width: 200 },
]
let crudConfig: CrudConfig = {
  apis: {
    list: apis.orderFindPageList,
    findById: apis.orderFindOrderById,
  },
  modalConfig: { title: '订单', width: 1000 },
  tableConfig: {
    columns: columns,
    tableKey: 'orderId',
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
