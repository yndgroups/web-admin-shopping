<template>
  <div class="page-list-container bg-white">
    <CommonYndCrud
      :request="curdApi"
      :modalConfig="{ title: '员工' }"
      :tableConfig="{ columns }"
      :searchParams="searchParams"
    >
      <!-- 搜索栏 -->
      <template #search="{ params }">
        <a-col :span="6">
          <a-form-item
            name="businessName"
            label="员工姓名"
          >
            <a-input
              v-model:value="params.name"
              :size="config.formSize"
              allowClear
              placeholder="请输入员工姓名"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item
            name="introduction"
            label="员工电话"
          >
            <a-input
              :size="config.formSize"
              v-model:value="params.phone"
              placeholder="请输入员工电话"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item
            name="introduction"
            label="员工邮箱"
          >
            <a-input
              :size="config.formSize"
              v-model:value="params.email"
              placeholder="请输入员工邮箱"
            ></a-input>
          </a-form-item>
        </a-col>
      </template>

      <template #action="{ action }">
        <a-button
          type="primary"
          @click="action.onOpenModal(1)"
          :size="config.formSize"
        >
          <template #icon><PlusSquareOutlined /></template>
          添加员工
        </a-button>
      </template>

      <!-- 表格栏 -->
      <template #tableColumns="{ column, record, methods }">
        <template v-if="column.key === 'avatar'">
          <img
            v-if="record.avatar"
            class="w-80"
            :src="showImag(record.avatar)"
            alt=""
          />
        </template>
        <template v-if="column.key === 'operation'">
          <a-popconfirm
            title="您确定要删除这条数据吗？"
            trigger="click"
            @confirm="methods.onDelete([record.staffId])"
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
          <a-button
            type="link"
            :size="config.formSize"
            @click="methods.onOpenModal(2, record)"
          >
            <span class="text-warning">修改</span>
          </a-button>
        </template>
      </template>

      <!-- 表单选中框 -->
      <template #modal="{ modelData, methods, mode }">
        <power-add-edit-emp
          :methods="methods"
          :modalData="modelData"
          :mode="mode"
        ></power-add-edit-emp>
      </template>
    </CommonYndCrud>
  </div>
</template>
<script lang="ts" setup layout="shopping" title="员工管理">
import config from '@/config/theme'
import apis from '@/apis'
import { showImag } from '@/utils'
const columns = [
  { title: '联系电话', dataIndex: 'avatar', key: 'avatar' },
  { title: '员工姓名', dataIndex: 'realName', key: 'realName' },
  { title: '岗位名称', dataIndex: 'jobName', key: 'jobName' },
  { title: '联系电话', dataIndex: 'phone', key: 'phone' },
  { title: '电子邮箱', dataIndex: 'email', key: 'email' },
  { title: '操作', key: 'operation', width: 150 },
]
const curdApi = {
  list: apis.getStoreStaffList,
  cud: apis.storeStaff,
}
const searchParams = {
  showButton: true,
}
</script>
