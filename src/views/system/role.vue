<template>
  <div class="page-list-container bg-white">
    <CommonYndCrud
      :config="crudConfig"
      ref="commonYndCrud"
    >
      <!-- 功能按钮 -->
      <template #action="{ action }">
        <a-button
          type="primary"
          html-type="submit"
          @click="action.onOpenModal(Mode.CREATE)"
          :size="themeConfig.formSize"
        >
          新增
        </a-button>
      </template>

      <!-- 表格栏 -->
      <template #tableColumns="{ column, record, methods }">
        <template v-if="column.key === 'operation'">
          <a-button
            type="link"
            v-auth="'admin:role:authMenu'"
            :size="themeConfig.formSize"
            @click="authRole(record)"
          >
            <span class="text-sueeess">菜单授权</span>
          </a-button>
          <a-button
            type="link"
            :size="themeConfig.formSize"
            @click="authFunc(record)"
          >
            <span class="text-sueeess">功能授权</span>
          </a-button>
          <a-button
            type="link"
            :size="themeConfig.formSize"
            @click="methods.onOpenModal(Mode.UPDATE, record.roleId)"
            v-auth="'admin:role:edit'"
          >
            <span class="text-warning">修改</span>
          </a-button>
          <span v-auth="'admin:role:del'">
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
        </template>
      </template>

      <!-- 表单选中框 -->
      <template #modal="{ modelData, methods }">
        <div class="pd-b20 text-danger">
          <span class="text-danger">*</span>
          <span>角色唯一标识（从1开始递增的数字）</span>
        </div>
        <a-form
          :model="modelData"
          ref="formRef"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-form-item
            label="角色名称"
            name="name"
            :rules="[{ required: true, message: '请输入角色名称' }]"
          >
            <a-input
              v-model:value="modelData.name"
              placeholder="请输入角色名称"
              allow-clear
            />
          </a-form-item>
          <a-form-item
            label="角色唯一标识"
            name="uniqueIdentification"
            :rules="[{ required: true, type: 'number', message: '请输入角色唯一标识' }]"
          >
            <a-input-number
              v-model:value="modelData.uniqueIdentification"
              placeholder="请输入角色唯一标识"
              allow-clear
              style="width: 100%"
              :min="0"
              :max="20"
            />
          </a-form-item>
          <a-form-item
            label="介绍"
            name="introduce"
            :rules="[{ required: true, message: '请输入角色介绍' }]"
          >
            <a-textarea
              v-model:value="modelData.introduce"
              placeholder="请输入角色介绍"
              allow-clear
              :maxlength="100"
            />
          </a-form-item>
          <a-form-item
            label="排序"
            name="sortBy"
            :rules="[{ required: true, type: 'number', message: '请输入排序' }]"
          >
            <a-input-number
              v-model:value="modelData.sortBy"
              placeholder="请输入排序"
              allow-clear
              style="width: 100%"
              :min="0"
              :max="20"
            />
          </a-form-item>
          <div>
            <div class="text-center">
              <a-button
                class="mg-r10"
                @click="methods.closeModal"
              >
                取消
              </a-button>
              <a-button
                type="primary"
                @click="methods.onValidate(formRef)"
              >
                确定
              </a-button>
            </div>
          </div>
        </a-form>
      </template>
    </CommonYndCrud>
    <div v-if="state.visible">
      <system-role-menu
        @closeModal="closeModal"
        :roleItem="state.roleItem"
        :visible="state.visible"
      />
    </div>
    <div v-if="state.funcVisible">
      <system-role-func
        @closeModal="closeModal"
        :roleItem="state.roleItem"
        :visible="state.funcVisible"
      />
    </div>
  </div>
</template>
<script lang="ts" setup layout="shopping" title="角色管理">
import themeConfig from '@/config/theme'
import apis from '@/apis'
import { Mode } from '@/core'
import type { CrudConfig } from '@/core/types'
import type { FormInstance } from 'ant-design-vue'
const formRef = ref<FormInstance>()
let state = reactive<any>({
  visible: false,
  funcVisible: false,
  roleItem: {},
})
const commonYndCrud = ref<HTMLElement>()
const columns = [
  { title: '角色名称', dataIndex: 'name', key: 'name', width: 150 },
  { title: '排序', dataIndex: 'sortBy', key: 'sortBy', width: 80 },
  { title: '角色介绍', dataIndex: 'introduce', key: 'introduce' },
  {
    title: '唯一标识',
    dataIndex: 'uniqueIdentification',
    key: 'uniqueIdentification',
    width: 90,
  },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '操作', key: 'operation', width: 280 },
]
let crudConfig: CrudConfig = {
  apis: {
    list: apis.findRoleList,
    cud: apis.role,
    findById: apis.findRoleById,
  },
  modalConfig: { title: '角色', showFooter: true },
  tableConfig: {
    columns: columns,
    tableKey: 'roleId',
  },
  searchParams: { params: {}, showButton: true, showSearch: false },
}

const authRole = (record: any) => {
  state.roleItem = record
  state.visible = true
}

const authFunc = (record: any) => {
  state.roleItem = record
  state.funcVisible = true
}

// 关闭模态框
const closeModal = (isRefresh: boolean = false) => {
  if (isRefresh) {
    let refs = commonYndCrud.value as any
    refs.onRefresh()
  }
  state.visible = false
  state.funcVisible = false
}
</script>
