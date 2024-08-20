<template>
  <div>
    <a-form
      :model="form"
      labelAlign="right"
      v-bind="layout"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 12 }"
      ref="formRef"
    >
      <!-- 价格库存 -->
      <a-row :gutter="10">
        <a-col :span="24">
          <a-form-item
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 16 }"
            label="商品规格"
            name="specType"
          >
            <a-radio-group v-model:value="form.specType">
              <a-radio :value="1">单规格</a-radio>
              <a-radio :value="2">多规格</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>

        <template v-if="form.specType == 1">
          <a-col :span="12">
            <a-form-item
              label="销售价"
              name="price"
              :rules="[
                {
                  required: form.specType == 1,
                  message: '请输入销售价',
                  trigger: 'blur',
                },
              ]"
            >
              <a-input-number
                type="number"
                v-model:value="form.price"
                allow-clear
              >
                <template #addonBefore>￥</template>
                <template #addonAfter>元</template>
              </a-input-number>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item
              label="会员价"
              name="vipPrice"
              :rules="[
                {
                  required: form.isVip == 1,
                  message: '请输入销售价',
                  trigger: 'blur',
                },
              ]"
            >
              <a-input-number
                type="number"
                v-model:value="form.vipPrice"
                allow-clear
              >
                <template #addonBefore>￥</template>
                <template #addonAfter>元</template>
              </a-input-number>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item
              label="市场价"
              name="marketPrice"
            >
              <a-input-number
                type="number"
                v-model:value="form.marketPrice"
                allow-clear
              >
                <template #addonBefore>￥</template>
                <template #addonAfter>元</template>
              </a-input-number>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item
              label="成本价"
              name="costPrice"
            >
              <a-input-number
                type="number"
                v-model:value="form.costPrice"
                allow-clear
              >
                <template #addonBefore>￥</template>
                <template #addonAfter>元</template>
              </a-input-number>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item
              label="商品库存"
              name="stock"
              :rules="[
                {
                  required: form.specType == 1,
                  message: '请输入商品库存',
                  trigger: 'blur',
                },
                { validator: stockValidator, trigger: 'change' },
              ]"
            >
              <a-input-number
                type="number"
                v-model:value="form.stock"
                allow-clear
                style="width: 260px"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item
              label="库存预警"
              name="stockWarning"
              :rules="[
                {
                  required: form.specType == 1,
                  message: '请输入库存预警',
                  trigger: 'blur',
                },
                { validator: stockWarningValidator, trigger: 'change' },
              ]"
            >
              <a-input-number
                type="number"
                v-model:value="form.stockWarning"
                allow-clear
                style="width: 260px"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <!-- :rules="[
                {
                  required: form.specType == 1,
                  message: '请输入商品编码',
                  trigger: 'blur',
                },
              ]" -->
            <a-form-item
              label="商品编码"
              name="sn"
            >
              <a-input
                style="width: 260px"
                v-model:value="form.sn"
                allow-clear
              />
            </a-form-item>
          </a-col>
        </template>
        <a-col
          v-else
          :span="24"
        >
          <product-specs :form-data="form" />
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import type { Rule } from 'ant-design-vue/es/form'
const formRef = ref<Element>()
const rules: Record<string, Rule[]> = {
  productName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
}
const layout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 17,
  },
}
const props = defineProps({
  formData: {
    type: Object,
    default: () => {},
  },
})
const form = computed(() => props.formData)
defineExpose({
  formRef,
})

// 校验库存警告
async function stockWarningValidator(_rule: Rule, value: string) {
  if (value === '') {
    return Promise.reject('值不能为空')
  } else {
    if (Number(value) <= 0) {
      return Promise.reject('库存警告不能为0')
    }
    return Promise.resolve()
  }
}
// 校验库存
async function stockValidator(_rule: Rule, value: string) {
  if (value === '') {
    return Promise.reject('值不能为空')
  } else {
    if (Number(value) <= 0) {
      return Promise.reject('库存必须大于0')
    }
    return Promise.resolve()
  }
}
</script>
