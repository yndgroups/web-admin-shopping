<template>
  <div class="goods-specs">
    <div class="select-spec-options">
      <span class="label">选择规格：</span>
      <a-select
        ref="select"
        style="width: 200px"
        v-model:value="state.specId"
        :options="state.options"
        @change="handleChange"
        placeholder="请选择规格"
      ></a-select>
    </div>
    <h3 class="list-item-title">商品规格：</h3>
    <!-- 商品规格参数 -->
    <template v-if="state.specList && state.specList.length">
      <ul>
        <li
          class="pd-t10"
          v-for="(item, index) in state.specList"
          :key="index"
        >
          <strong class="pd-r10">{{ item.name }}:</strong>
          <template v-if="item.options && item.options.length">
            <a-checkbox-group
              v-model:value="state.spec[index]"
              :options="item.options"
            />
          </template>
        </li>
      </ul>
    </template>
    <h3 class="list-item-title mg-t30">{{ form.productName }} 商品详细参数：</h3>
    <div
      class="pd-t10"
      style="width: 100%; overflow: hidden"
    >
      <a-table
        :dataSource="form.skuList"
        :columns="columns"
        :scroll="{ x: 1100 }"
        bordered
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'skuTiile'">
            <h3 class="spec-item">
              {{ record.skuName }}
            </h3>
          </template>
          <template v-if="column.key === 'price'">
            <a-form-item
              :name="['skuList', record.key, 'price']"
              :rules="state.rules.price"
              :label-col="{ span: 2 }"
            >
              <template #label>&nbsp;</template>
              <a-input-number
                style="width: 80px"
                v-model:value="record.price"
                placeholder="销售价"
              />
            </a-form-item>
          </template>
          <template v-if="column.key === 'vipPrice'">
            <a-form-item
              :name="['skuList', record.key, 'vipPrice']"
              :rules="state.rules.vipPrice"
              :label-col="{ span: 2 }"
            >
              <template #label>&nbsp;</template>
              <a-input-number
                style="width: 80px"
                v-model:value="record.vipPrice"
                placeholder="会员价"
              />
            </a-form-item>
          </template>
          <template v-if="column.key === 'costPrice'">
            <a-form-item
              :name="['skuList', record.key, 'costPrice']"
              :rules="state.rules.costPrice"
              :label-col="{ span: 2 }"
            >
              <template #label>&nbsp;</template>
              <a-input-number
                style="width: 80px"
                v-model:value="record.costPrice"
                placeholder="成本价"
              />
            </a-form-item>
          </template>
          <template v-if="column.key === 'marketPrice'">
            <a-form-item
              :name="['skuList', record.key, 'marketPrice']"
              :rules="state.rules.marketPrice"
              :label-col="{ span: 2 }"
            >
              <template #label>&nbsp;</template>
              <a-input-number
                style="width: 80px"
                v-model:value="record.marketPrice"
                placeholder="市场价"
              />
            </a-form-item>
          </template>
          <template v-if="column.key === 'sn'">
            <a-form-item
              :name="['skuList', record.key, 'sn']"
              :rules="state.rules.sn"
              :label-col="{ span: 2 }"
            >
              <template #label>&nbsp;</template>
              <a-input
                style="width: 125px"
                v-model:value="record.sn"
                placeholder="商品编码"
              />
            </a-form-item>
          </template>
          <template v-if="column.key === 'stock'">
            <a-form-item
              :name="['skuList', record.key, 'stock']"
              :rules="state.rules.stock"
              :label-col="{ span: 2 }"
            >
              <template #label>&nbsp;</template>
              <a-input-number
                style="width: 100px"
                v-model:value="record.stock"
                placeholder="库存"
              />
            </a-form-item>
          </template>
          <template v-if="column.key === 'stockWarning'">
            <a-form-item
              :name="['skuList', record.key, 'stockWarning']"
              :rules="state.rules.stockWarning"
              :label-col="{ span: 2 }"
            >
              <template #label>&nbsp;</template>
              <a-input-number
                style="width: 80px"
                v-model:value="record.stockWarning"
                placeholder="库存预警"
              />
            </a-form-item>
          </template>

          <!-- <template v-if="column.key === 'image'">
            <common-ynd-upload v-model="form.image" />
          </template> -->
        </template>
      </a-table>
    </div>
  </div>
</template>
<script lang="ts" setup>
import apis from '@/apis'
import { message } from 'ant-design-vue'
const props = defineProps({
  formData: {
    type: Object,
    default: () => {},
  },
})
const form = computed(() => props.formData)
const columns = [
  {
    title: 'sku标题',
    dataIndex: 'skuTiile',
    key: 'skuTiile',
    fixed: 'left',
    width: 200,
  },
  {
    title: '销售价',
    dataIndex: 'price',
    key: 'price',
    width: 115,
  },
  {
    title: '库存',
    dataIndex: 'stock',
    key: 'stock',
    width: 125,
  },
  {
    title: '库存预警',
    dataIndex: 'stockWarning',
    key: 'stockWarning',
    width: 115,
  },
  {
    title: '会员价',
    dataIndex: 'vipPrice',
    key: 'vipPrice',
    width: 115,
  },
  {
    title: '成本价',
    dataIndex: 'costPrice',
    key: 'costPrice',
    width: 115,
  },
  {
    title: '市场价',
    dataIndex: 'marketPrice',
    key: 'marketPrice',
    width: 115,
  },
  {
    title: '商品编码',
    dataIndex: 'sn',
    key: 'sn',
    width: 160,
  },
  // {
  //   title: '规格图片',
  //   dataIndex: 'image',
  //   key: 'image',
  //   fixed: 'right',
  // },
] as any
interface skuItem {
  key: number // 索引
  costPrice: number | null // 成本价
  vipPrice: number | null // 会员价
  price: number | null // 销售价
  marketPrice: number | null // 市场价
  sn: string // sku编码
  stock: number | null // 库存数量
  stockWarning: number | null // 库存预警数量
  storeNo: string // 商家编码
  skuName: string // 规格名称
  image: string // 规格图片
}
let timer: NodeJS.Timeout
let state = reactive({
  options: [] as any,
  specId: '',
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
  specList: new Array<any>(),
  spec: new Array<any>(),
  rules: {
    // costPice: [
    //   {
    //     required: true,
    //     type: 'number',
    //     message: '请输入',
    //     trigger: 'blur',
    //   },
    // ],
    price: [
      {
        required: true,
        type: 'number',
        message: '请输入',
        trigger: 'change',
      },
    ],
    // vipPrice: [
    //   {
    //     required: true,
    //     type: 'number',
    //     message: '请输入',
    //     trigger: 'change',
    //   },
    // ],
    // marketPrice: [
    //   {
    //     required: true,
    //     type: 'number',
    //     message: '请输入',
    //     trigger: 'change',
    //   },
    // ],
    // sn: [{ required: true, message: '请输入', trigger: 'change' }],
    stock: [
      {
        required: true,
        type: 'number',
        message: '请输入',
        trigger: 'change',
      },
    ],
    stockWarning: [
      {
        required: true,
        type: 'number',
        message: '请输入',
        trigger: 'change',
      },
    ],
  } as any,
  specData: [] as any,
})

const formRef = ref(null)
watch(state.spec, (nv, ov) => {
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    let tempArr = new Array<any>()
    if (nv.length > 0) {
      nv.forEach((item: any) => {
        if (item.length > 0) {
          tempArr.push(item)
        }
      })
    }
    if (tempArr.length == 0) {
      form.value.skuList = []
      return
    }
    let dkr = calcDescartes(tempArr)
    form.value.skuList = []
    let dkrArr = new Array<any>()
    dkr.forEach((item: any, index: number) => {
      let temp: skuItem = {
        key: index,
        costPrice: null, // 成本价
        price: null, // 销售价
        vipPrice: null, // 会员价
        marketPrice: null, // 市场价
        sn: '',
        stock: null,
        stockWarning: null,
        storeNo: '',
        image: '',
        skuName: Array.isArray(item) ? Array.from(item).join('-') : item,
      }
      dkrArr.push(temp)
    })
    if (dkrArr.length) {
      form.value.skuList = dkrArr as []
    }
  }, 1000)
})

// 选择变化之后
const handleChange = (value: any) => {
  state.specList = []
  form.value.skuList = []
  let lists = state.specData.filter((o: any) => o.specId === `${value}`)
  if (lists.length > 0) {
    state.specList = lists[0].options || []
  }
}

// 获取商品的属性规格
const getSpec = async (storeId: string) => {
  let { data, code, msg } = await apis.getJSON(apis.findSpecListByStoreId + storeId)
  if (code === 1) {
    state.specData = data.map((item: any) => {
      if (item.options) {
        if (typeof item.options === 'string') {
          item.options = JSON.parse(item.options)
        } else {
          item.options = Array.isArray(item.options) ? item.options : []
        }
      } else {
        item.options = []
      }
      state.options.push({ label: item.name, value: item.specId })
      return item
    })
  } else {
    state.specList = []
    message.warning(msg)
  }
}

onMounted(() => {
  // 根据店铺id拉取店铺下的商品规格设置
  getSpec('1')
})

/**
 * 迪卡尔集
 */
const calcDescartes = (array: Array<any>) => {
  if (array.length < 2) return array[0] || []
  return array.reduce((total, currentValue) => {
    let res = new Array<any>()
    total.forEach((t: any) => {
      currentValue.forEach((cv: any) => {
        if (t instanceof Array)
          // 或者使用 Array.isArray(t)
          res.push([...t, cv])
        else res.push([t, cv])
      })
    })
    return res
  })
}

defineExpose({
  formRef,
  state,
  getSpec,
})
</script>
<style lang="scss" scoped>
.select-spec-options {
  padding-bottom: 15px;

  .label {
    font-weight: bold;
    font-size: 18px;

    &:before {
      content: '*';
      color: red;
      display: inline-block;
      padding-right: 3px;
    }
  }
}
</style>
