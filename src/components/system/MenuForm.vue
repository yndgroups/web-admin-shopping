<template>
  <a-modal
    v-model:open="showModal"
    :maskClosable="false"
    :width="config.modelWidth"
    :title="mode == Md.CREATE ? '添加菜单' : mode === Md.UPDATE ? '修改菜单' : '详情'"
    @ok="handleOk"
    @cancel="emit('closeModal')"
  >
    <a-form
      :model="state.addForm"
      ref="addForm"
      :rules="state.rules"
      :label-col="state.labelCol"
      :wrapper-col="state.wrapperCol"
    >
      <a-form-item
        label="父级菜单"
        name="name"
      >
        <a-input
          :value="state.parentName"
          disabled
        />
      </a-form-item>
      <a-form-item
        label="菜单名称"
        name="name"
      >
        <a-input v-model:value.trim="state.addForm.name" />
      </a-form-item>
      <a-form-item
        label="菜单类型"
        name="type"
      >
        <a-select
          v-model:value="state.addForm.type"
          :options="menu.menuTypeList"
        ></a-select>
      </a-form-item>
      <a-form-item
        label="菜单地址"
        name="url"
        :key="state.addForm.type + 1"
        :rules="[
          {
            required: state.addForm.type == 1,
            message: '菜单地址不能为空',
            trigger: 'blur',
          },
        ]"
      >
        <a-input v-model:value.trim="state.addForm.url" />
      </a-form-item>
      <a-form-item
        label="菜单图标"
        name="icon"
        :key="state.addForm.type + 2"
        :rules="[
          {
            required: state.addForm.type == 1,
            message: '请选择菜的图标',
            trigger: 'blur',
          },
        ]"
      >
        <a-select
          v-model:value="state.addForm.icon"
          allowClear
        >
          <a-select-option
            v-for="(icon, index) in icons"
            :key="index"
            :value="icon"
          >
            <component
              v-if="state.addForm.icon"
              :is="icon"
            ></component>
            <span class="pd-l5">{{ icon }}</span>
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="权限值"
        name="powerSign"
        :key="state.addForm.type + 3"
        :rules="[
          {
            required: state.addForm.type == 2,
            message: '权限值不能为空',
            trigger: 'blur',
          },
        ]"
      >
        <a-input v-model:value="state.addForm.powerSign" />
      </a-form-item>
      <a-form-item
        label="排序"
        name="sortBy"
      >
        <a-input-number v-model:value.number="state.addForm.sortBy" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
import config from '@/config/theme'
import { menu } from '@/config/data/enum'
import { message } from 'ant-design-vue'
import apis from '@/apis'
import { Mode as Md } from '@/core'
const icons = inject('icons') as any
const showModal = ref(true)
const addForm = ref<HTMLElement>() as any
let props = defineProps({
  mode: {
    type: String,
    default: Md.DETAIL,
  },
  itemData: {
    type: Object,
    default: () => {},
  },
})
const emit = defineEmits(['refreshData', 'closeModal'])
const state = reactive<any>({
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
  addForm: {
    menuId: '',
    icon: '',
    name: '',
    parentId: '',
    powerSign: '',
    sortBy: 1,
    url: '',
    type: 1,
  },
  parentName: '',
  rules: {
    name: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
    type: [{ required: true, message: '请选择菜单', trigger: 'change' }],
  },
})
// 生命周期
onBeforeMount(() => {
  state.parentName = props.itemData.parentName
  switch (props.mode) {
    case Md.CREATE:
      state.addForm.parentId = props.itemData.parentId
      state.addForm.sortBy = props.itemData.sortBy
      break
    case Md.UPDATE: // 添加子菜单
      state.addForm.parentId = props.itemData.menuId + ''
      state.addForm.menuId = `${props.itemData['menuId']}`
      state.addForm.icon = props.itemData['icon'] || ''
      state.addForm.name = props.itemData['name'] || ''
      state.addForm.parentId = props.itemData['parentId'] || '0'
      state.addForm.powerSign = props.itemData['powerSign'] || ''
      state.addForm.sortBy = props.itemData['sortBy'] || 1
      state.addForm.url = props.itemData['url'] || ''
      state.addForm.type = props.itemData['type'] || 1
      break
  }
})

/**
 * 提交表单
 */
const handleOk = () => {
  addForm.value.validate().then(async () => {
    let { code, msg } = await apis.request({
      url: apis.menu,
      method: props.mode === Md.UPDATE ? 'put' : 'post',
      data: state.addForm,
    })
    if (code == 1) {
      message.success(msg)
      emit('refreshData', true)
      return
    }
    message.error(msg)
  })
}
</script>
