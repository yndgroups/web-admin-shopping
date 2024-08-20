<template>
  <!-- 分享 -->
  <a-form
    :model="form"
    :rules="rules"
    labelAlign="right"
    v-bind="layout"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 16 }"
    ref="formRef"
  >
    <a-row :gutter="10">
      <a-col :span="22">
        <a-form-item
          label="分享标题"
          name="name"
        >
          <a-input
            v-model:value="form.shareName"
            placeholder="请输入分享标题"
            allow-clear
          />
        </a-form-item>
      </a-col>
      <a-col :span="22">
        <a-form-item
          label="分享描述"
          name="name"
        >
          <a-input
            v-model:value="form.shareDescribe"
            placeholder="请输入分享描述"
            allow-clear
          />
        </a-form-item>
      </a-col>
      <a-col :span="22">
        <a-form-item
          label="公众号分享图片"
          name="shareWechatPictrue"
        >
          <common-ynd-upload
            v-model="form.shareWechatPictrue"
            title=" "
          />
        </a-form-item>
      </a-col>
      <a-col :span="22">
        <a-form-item
          label="小程序分享图片"
          name="shareAppletPictrue"
        >
          <common-ynd-upload
            v-model="form.shareAppletPictrue"
            title=" "
          />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script lang="ts" setup>
const props = defineProps({
  formData: {
    type: Object,
    default: () => {},
  },
})
const layout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 17,
  },
}
const form = computed(() => props.formData)
const formRef = ref<Element>()
const rules = {
  productName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
}
</script>
