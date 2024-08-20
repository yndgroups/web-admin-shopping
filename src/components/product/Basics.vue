<template>
  <div>
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
            label="商品分类"
            name="categoryId"
          >
            <product-category-cascader
              v-model:value="state.productCategoryIdArr"
              @change="changeProductCategoryId"
              productCategoryId="0"
              placeholder="请选择商品分类"
            />
          </a-form-item>
        </a-col>

        <a-col :span="22">
          <!-- name="brandId" -->
          <a-form-item label="商品品牌">
            <a-select
              placeholder="请选择商品品牌"
              :allowClear="true"
              v-model:value="form.brandId"
              :options="state.brandOptions"
            ></a-select>
          </a-form-item>
        </a-col>

        <a-col :span="22">
          <a-form-item
            label="商品名称"
            name="productName"
          >
            <a-input
              v-model:value="form.productName"
              placeholder="请输入商品名称"
              allow-clear
            />
          </a-form-item>
        </a-col>

        <a-col :span="22">
          <a-form-item
            label="关键词"
            name="keyword"
          >
            <a-input
              v-model:value="form.keyword"
              placeholder="请输入关键词"
              allow-clear
            />
          </a-form-item>
        </a-col>

        <a-col :span="22">
          <a-form-item
            label="商品简介"
            name="introduction"
          >
            <a-textarea
              v-model:value="form.introduction"
              :rows="4"
              placeholder="请输入商品简介"
              allow-clear
            />
          </a-form-item>
        </a-col>

        <a-col :span="22">
          <a-form-item
            label="商品单位"
            name="unitName"
          >
            <a-input
              v-model:value="form.unitName"
              placeholder="请输入商品名称"
              allow-clear
            />
          </a-form-item>
        </a-col>

        <a-col :span="22">
          <a-form-item
            label="商品主图"
            name="image"
          >
            <common-ynd-upload
              v-model="form.image"
              title=" "
            />
          </a-form-item>
        </a-col>

        <a-col :span="22">
          <a-form-item
            label="推荐图"
            name="recommendImage"
          >
            <common-ynd-upload
              v-model="form.recommendImage"
              title=" "
            />
          </a-form-item>
        </a-col>

        <a-col :span="22">
          <a-form-item
            label="商品轮播图"
            name="sliderImage"
          >
            <common-ynd-upload
              title=" "
              v-model="form.sliderImage"
              :max-count="5"
              ez-width="auto"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
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
  </div>
</template>

<script lang="ts" setup>
import apis from '@/apis'
import { message } from 'ant-design-vue'

let mode = inject('mode')
const props = defineProps({
  formData: {
    type: Object,
    default: () => {},
  },
})
const form = computed(() => props.formData)
const rules = {
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
  brandId: [{ required: true, message: '请选择品牌', trigger: 'change' }],
  unitName: [{ required: true, message: '请选输入单位', trigger: 'blur' }],
  keyword: [{ required: true, message: '请选输入关键词', trigger: 'blur' }],
  introduction: [{ required: true, message: '请选输入商品简介', trigger: 'blur' }],
  productName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  image: [{ required: true, message: '请上传主图', trigger: 'change' }],
  recommendImage: [{ required: true, message: '请上传主图', trigger: 'change' }],
  sliderImage: [{ required: true, message: '请上轮播图', trigger: 'change' }],
} as any
const layout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 17,
  },
}
const formRef = ref<Element>()
const state = reactive({
  productCategoryIdArr: [],
  brandOptions: [],
  previewImage: '',
  previewVisible: false,
})

onMounted(() => {
  if (mode != 1) {
    if (props.formData.categoryId !== undefined && props.formData.categoryId != null && props.formData.categoryId != '') {
      getBrandList(props.formData.categoryId)
    }
  }
})

/**
 * 值改变之后查询品牌
 */
let timer: NodeJS.Timeout
const changeProductCategoryId = async (productCategoryIdArr: Array<string> = []) => {
  if (productCategoryIdArr !== undefined && productCategoryIdArr.length < 1) {
    return
  }
  form.value.categoryId = productCategoryIdArr[productCategoryIdArr.length - 1]
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    getBrandList(productCategoryIdArr[productCategoryIdArr.length - 1])
  }, 2000)
}

const getBrandList = async (productCategoryId: string) => {
  state.brandOptions = []
  // 查询品牌
  let { data, code, msg } = await apis.getJSON(apis.findBrandListByProductCategoryId + productCategoryId)
  if (code === 1) {
    if (Array.isArray(data)) {
      state.brandOptions = data.map(item => {
        return {
          value: `${item.brandId}`,
          label: item.name,
        }
      }) as []
    }
  } else {
    state.brandOptions = []
    message.warning(msg)
  }
}

defineExpose({
  formRef,
})
</script>
