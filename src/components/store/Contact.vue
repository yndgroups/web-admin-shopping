<template>
  <a-form-item
    name="name"
    label="联系人"
  >
    <a-input
      v-model:value="form.name"
      placeholder="请输入联系人"
      allow-clear
    ></a-input>
  </a-form-item>

  <a-form-item
    name="name"
    label="联系电话"
  >
    <a-input
      v-model:value="form.mobile"
      placeholder="请输入联系电话"
      allow-clear
    ></a-input>
  </a-form-item>

  <a-form-item
    name="name"
    label="微信"
  >
    <a-input
      v-model:value="form.wechat"
      placeholder="请输入微信"
      allow-clear
    ></a-input>
  </a-form-item>

  <a-form-item
    name="name"
    label="地址"
  >
    <a-input
      v-model:value="form.address"
      placeholder="请输入地址"
      allow-clear
    ></a-input>
  </a-form-item>
</template>

<script lang="ts" setup>
const props = defineProps({
  formData: {
    type: Object,
    default: () => {},
  },
})
const form = computed(() => props.formData)
</script>
