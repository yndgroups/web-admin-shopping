<template>
  <a-form-item
    name="values"
    label="开启商品审核"
  >
    <a-checkbox-group v-model:value="form.values">
      <a-checkbox>是</a-checkbox>
      <a-checkbox>否</a-checkbox>
    </a-checkbox-group>
  </a-form-item>
  <a-form-item
    name="values"
    label="提现设置"
  >
    <a-checkbox-group v-model:value="form.values">
      <a-checkbox>开启</a-checkbox>
      <a-checkbox>关闭</a-checkbox>
    </a-checkbox-group>
  </a-form-item>
  <a-form-item
    name="values"
    label="销售数据是否显示"
  >
    <a-checkbox-group v-model:value="form.values">
      <a-checkbox>核销数据</a-checkbox>
      <a-checkbox>自提数据</a-checkbox>
    </a-checkbox-group>
  </a-form-item>
  <a-form-item
    name="values"
    label="门店信息中商家资质隐藏开关"
  >
    <a-checkbox-group v-model:value="form.values">
      <a-checkbox>显示</a-checkbox>
      <a-checkbox>隐藏</a-checkbox>
    </a-checkbox-group>
  </a-form-item>
  <a-form-item
    name="values"
    label="同城配送规则设置"
  >
    <a-checkbox-group v-model:value="form.values">
      <a-checkbox>开启单独设置</a-checkbox>
      <a-checkbox>默认设置</a-checkbox>
    </a-checkbox-group>
  </a-form-item>
  <a-form-item
    name="orderType"
    label="上传可选分类"
  >
    <a-select
      v-model:value="form.orderType"
      placeholder="请选择银行分类"
      allowClear
      :options="order.search.orderType"
    ></a-select>
  </a-form-item>
  <a-form-item
    name="checked"
    label="是否开启扫码枪"
  >
    <a-switch
      v-model:checked="form.checked"
      checked-children="开"
      un-checked-children="关"
    />
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
