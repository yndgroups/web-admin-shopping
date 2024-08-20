<template>
  <a-form-item
    name="values"
    label="商家结算费率"
  >
    <a-checkbox-group v-model:value="form.values">
      <a-checkbox>按平台默认比例</a-checkbox>
      <a-checkbox>自定义结算比例</a-checkbox>
    </a-checkbox-group>
  </a-form-item>
  <a-form-item
    name="name"
    label="银行分类"
  >
    <a-select
      v-model:value="form.orderType"
      placeholder="请选择银行分类"
      allowClear
      :options="order.search.orderType"
    ></a-select>
  </a-form-item>

  <a-form-item
    name="name"
    label="银行卡号"
  >
    <a-input
      v-model:value="form.name"
      placeholder="请输入银行卡号"
      allow-clear
    ></a-input>
  </a-form-item>

  <a-form-item
    name="name"
    label="持卡人姓名"
  >
    <a-input
      v-model:value="form.name"
      placeholder="请输入持卡人姓名"
      allow-clear
    ></a-input>
  </a-form-item>

  <a-form-item
    name="name"
    label="入账金额冻结天数"
  >
    <a-input
      v-model:value="form.name"
      placeholder="入账金额冻结天数"
      allow-clear
    ></a-input>
  </a-form-item>
</template>

<script lang="ts" setup>
import { order } from '@/config/data/enum'
const props = defineProps({
  formData: {
    type: Object,
    default: () => {},
  },
})
const form = computed(() => props.formData)
</script>
