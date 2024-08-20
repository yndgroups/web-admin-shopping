<template>
  <CommonYndCrud
    :config="crudConfig"
    ref="commonYndCrud"
  >
    <!-- 搜索栏 -->
    <template #search="{ params }">
      <a-col :span="8">
        <a-form-item
          name="productName"
          label="商品名称"
        >
          <a-input
            v-model:value="params.productName"
            placeholder="请输入商品名称"
          />
        </a-form-item>
      </a-col>
    </template>

    <!-- 功能按钮 -->
    <template #action>
      <a-button
        type="primary"
        html-type="submit"
        @click="onOpenModal(Mode.CREATE, '')"
        :size="config.formSize"
      >
        添加商品
      </a-button>
    </template>

    <!-- 表格栏 -->
    <template #tableColumns="{ column, record, methods }">
      <template v-if="column.key === 'image'">
        <img
          v-if="record.image"
          class="w-60"
          :src="showImg(record.image)"
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
                  @click="onOpenModal(Mode.DETAIL, `${record.productId}`)"
                >
                  <span>查看</span>
                </a-button>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item>
                <a-button
                  type="link"
                  :size="config.formSize"
                  @click="onOpenModal(Mode.UPDATE, `${record.productId}`)"
                >
                  <span class="text-warning">修改</span>
                </a-button>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item>
                <a-popconfirm
                  title="您确定要删除这条数据吗？"
                  trigger="click"
                  @confirm="methods.onDelete([record.productId])"
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
    <template #custom="">
      <ProductEditForm
        v-if="state.showFormView"
        :visible="state.showFormView"
        @closeModal="closeModal"
        :product-id="state.productId"
        :mode="state.mode"
      />
    </template>
  </CommonYndCrud>
</template>
<script lang="ts" setup layout="shopping" title="广告">
import config from '@/config/theme'
import apis from '@/apis'
import { Mode } from '@/core'
import type { CrudConfig } from '@/core/types'
import { showImg } from '@/utils/index'
const commonYndCrud = ref<HTMLElement>() as any
const columns = [
  { title: '商品图片', dataIndex: 'image', key: 'image', with: 80 },
  { title: '商品名称', dataIndex: 'productName', key: 'productName', minWidth: 300 },
  { title: '价格', dataIndex: 'price', key: 'price' },
  { title: '单位', dataIndex: 'unitName', key: 'unitName' },
  { title: '库存', dataIndex: 'stock', key: 'stock' },
  { title: '库存预警', dataIndex: 'stockWarning', key: 'stockWarning' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '操作', key: 'operation', width: 100 },
]
let crudConfig: CrudConfig = {
  apis: {
    list: apis.findProductPageList,
    cud: apis.product,
    findById: apis.storeAdFindById,
  },
  modalConfig: { title: '广告' },
  tableConfig: {
    columns: columns,
    tableKey: 'adId',
  },
  searchParams: { params: {}, showButton: true, showSearch: true },
}
let state = reactive({
  productId: '',
  mode: Mode.DETAIL,
  showFormView: false,
})

const closeModal = (bool: boolean = false) => {
  state.showFormView = false
  if (bool) {
    commonYndCrud.value?.onRefresh()
  }
}

// 开启模式
function onOpenModal(mode: Mode, productId: string) {
  state.productId = productId || ''
  state.mode = mode
  state.showFormView = true
}
</script>
