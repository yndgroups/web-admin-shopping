<template>
  <a-form-item
    name="name"
    label="商家名称"
  >
    <a-input
      v-model:value="form.name"
      show-count
      :maxlength="30"
      placeholder="请输入商家名称"
      allow-clear
    ></a-input>
  </a-form-item>

  <a-form-item
    name="orderType"
    label="商家分类"
  >
    <a-select
      v-model:value="form.orderType"
      placeholder="请选商家分类"
      allowClear
      :options="order.search.orderType"
    ></a-select>
  </a-form-item>

  <a-form-item label="商家简介">
    <CommonYndTnymce
      v-model:value="form.introduction"
      :height="400"
      placeholder="请输入商家简介"
    />
  </a-form-item>

  <a-form-item label="商家LOGO">
    <common-ynd-upload
      v-model="form.image"
      title=" "
    />
  </a-form-item>

  <a-form-item label="商家背景图">
    <common-ynd-upload
      v-model="form.image"
      title=" "
    />
  </a-form-item>

  <a-form-item label="商家资质图">
    <common-ynd-upload
      v-model="form.image"
      title=" "
    />
  </a-form-item>

  <a-modal
    v-model:open="state.previewVisible"
    :footer="null"
    @cancel="state.previewVisible = false"
  >
    <img
      alt="example"
      style="width: 100%"
      :src="state.previewImage"
    />
  </a-modal>
</template>

<script lang="ts" setup>
import { order } from '@/config/data/enum'
const props = defineProps({
  formData: {
    type: Object,
    default: () => {},
  },
})
const form = computed(() => {
  return props.formData
})

const state = ref({
  previewImage: '',
  previewVisible: false,
})

const handlePreview = async (file: any) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj)
  }

  state.value.previewImage = file.url || file.preview
  state.value.previewVisible = true
}

function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}
</script>
