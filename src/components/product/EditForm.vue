<template>
  <a-modal
    v-model:open="showModal"
    title="添加商品"
    :width="1200"
    :bodyStyle="{ padding: '0 24px' }"
    style="top: 10px"
    @cancel="emits('closeModal', false)"
  >
    <div
      v-if="!state.loadOver"
      class="text-center pd-t50 pd-b50"
    >
      <a-spin />
    </div>
    <div v-if="state.loadOver">
      <product-goods-type v-model="formData.isVirtual"></product-goods-type>
      <a-tabs
        v-model:activeKey="state.activeKey"
        style="height: 80px; overflow: hidden"
      >
        <!-- :disabled="state.activeKey <= index && mode === 1" -->
        <a-tab-pane
          v-for="item in state.tabList"
          :key="item.value"
          :tab="item.label"
        ></a-tab-pane>
      </a-tabs>
      <div>
        <ProductBasics
          v-show="state.activeKey === 1 && state.loadOver"
          :form-data="formData"
          ref="productBasics"
        />
        <ProductStock
          v-show="state.activeKey === 2 && state.loadOver"
          :form-data="formData"
          ref="productStock"
        />
        <ProductDescribe
          v-show="state.activeKey === 3 && state.loadOver"
          :form-data="formData"
          :show-key="state.activeKey"
          ref="productDescribe"
        />
        <div v-show="(state.activeKey === 4 || state.activeKey === 5 || state.activeKey === 6 || state.activeKey === 7 || state.activeKey === 8) && state.loadOver">功能暂无开放</div>
        <!-- <ProductLimit
          v-show="state.activeKey === 4 && state.loadOver"
          :form-data="formData"
          ref="productLimit"
        /> -->
        <!-- <ProductWriteOff
          v-show="state.activeKey === 5 && state.loadOver"
          :form-data="formData"
          ref="productWriteOff"
        /> -->
        <!-- <ProductShare
          v-show="state.activeKey === 6 && state.loadOver"
          :form-data="formData"
          ref="productShare"
        /> -->
        <!-- <ProductOther
          v-show="state.activeKey === 7 && state.loadOver"
          :form-data="formData"
          ref="productOther"
        /> -->
        <!-- <ProductGifts
          v-show="state.activeKey === 8 && state.loadOver"
          :form-data="formData"
          ref="productGifts"
        /> -->
      </div>
    </div>
    <template #footer>
      <div class="text-center pd-b20 pd-t20">
        <a-button
          key="back"
          @click="emits('closeModal')"
        >
          取消
        </a-button>
        <a-button
          key="prev"
          v-if="state.activeKey > 1"
          type="primary"
          @click="prevStep"
        >
          上一步
        </a-button>
        <a-button
          key="next"
          v-if="state.activeKey < state.tabList.length"
          type="primary"
          @click="nextStep"
        >
          下一步
        </a-button>
        <a-button
          key="submit"
          html-type="submit"
          type="primary"
          danger
          @click="saveProduct"
          v-if="state.activeKey >= 3"
        >
          保存
        </a-button>
        <!-- v-if="state.activeKey == state.tabList.length" -->
      </div>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import apis from '@/apis'
import { HttpMethod } from '@/config/axios'
import { Mode, type Product } from '@/core'
import { message } from 'ant-design-vue'
const props = defineProps({
  visible: {
    type: Boolean,
    default: () => false,
  },
  mode: {
    type: String,
    defualt: Mode.CREATE,
  },
  productId: {
    type: String,
    defualt: '',
  },
})
const showModal = ref<boolean>(props.visible)
provide('mode', props.mode)
let emits = defineEmits(['closeModal'])
let productBasics = ref<any>()
let productStock = ref<any>()
let productDescribe = ref<any>()
let productLimit = ref<any>()
let productWriteOff = ref<any>()
let productShare = ref<any>()
let productGifts = ref<any>()
const state = reactive({
  activeKey: 1,
  loadOver: false,
  tabList: [
    { label: '基础设置', value: 1 },
    { label: '价格库存', value: 2 },
    { label: '商品详情', value: 3 },
    { label: '购买设置', value: 4 },
    { label: '核销设置', value: 5 },
    { label: '分享设置', value: 6 },
    { label: '其他设置', value: 7 },
    { label: '多买赠礼', value: 8 },
  ],
})

let formData = reactive<Product>({
  content: '', //商品详情
  skuList: [], // SKU列表
  sortBy: 0, // 排序
  // 商品id
  productId: '',
  // 是否虚拟商品(0:否 1:是)
  isVirtual: 0,
  // 店铺id
  storeId: '1',
  // 分类id
  categoryId: '',
  // 商品名称
  productName: '',
  // 关键字
  keyword: '',
  // 销售价
  price: null,
  // 成本价
  costPrice: null,
  // 会员价
  vipPrice: null,
  // 市场价
  marketPrice: null,
  // 商品图片
  image: '',
  // 轮播图
  sliderImage: '',
  // 推荐图
  recommendImage: '',
  // 库存
  stock: null,
  // 库存预警
  stockWarning: null,
  // 单位名
  unitName: '',
  // 规格(1:单规格[默认] 2:多规格)
  specType: 1,
  // 状态(1:未上架[默认] 2:上架 3:草稿)
  isDisplay: 0,
  // 运费类型（1:包邮 2:统一运费 3:运费模板)
  freightType: 0,
  // 统一运价
  freightRate: 0,
  // 运费模板id
  freightTempId: '',
  // 简介
  introduction: '',
  // 商品编号
  sn: '',
  // 销量
  sales: 0,
  // 品牌id
  brandId: '',
  // 虚拟商品类型
  virtualType: 0,
  // 是否开启限购
  isLimit: 0,
  // 限购类型(1:单次限购 2:永久限购)
  limitType: 0,
  // 限购数量
  limitNum: 0,
  // 浏览量
  views: 0,
  // 是否代理 0:不可代理 1:可代理)
  merUse: 0,
  // 商品条码(条形码)
  barCode: '',
  // 秒杀状态(0:未开启 1:已开启)
  isSeckill: 0,
  // 砍价状态(0:未开启 1:开启)
  isBargain: 0,
  // 活动显示排序(1:秒杀 2:砍价 3:拼团)
  activity: 0,
  // 是否热卖
  isHot: 0,
  // 是否优惠(如果有优惠，优惠券必填)
  isBenefit: 0,
  // 是否精品
  isBest: 0,
  // 是否新品
  isNew: 0,
  // 获得积分
  giveIntegral: 0,
  // 是否优品推荐
  isGood: 0,
  // 是否单独分佣
  isSub: 0,
  // 是否开启会员价格
  isVip: 0,
  // 商品二维码地址(用户小程序海报)
  codePath: '',
  // 主图视频链接
  videoLink: '',
  // 商品spu
  spu: '',
  // 标签id(比如热卖 特惠等)
  labelId: '',
  // 复制口令
  commandWord: '',
  // 推荐商品id
  recommendList: '',
  // 是否会员专属商品
  vipProduct: 0,
  // 是否预售商品
  presale: 0,
  // 预售结束后几天内发货:
  presaleDay: 0,
  // 预售开始时间
  presaleStartTime: '',
  // 预售结束时间
  presaleEndTime: '',
})

const saveProduct = async () => {
  formData.image = removeImgHost(formData.image)
  formData.recommendImage = removeImgHost(formData.recommendImage)
  formData.sliderImage = removeImgHost(formData.sliderImage)
  let { code, msg } = await apis.request({
    url: apis.product,
    method: props.mode == Mode.CREATE ? HttpMethod.POST : HttpMethod.PUT,
    data: formData,
  })
  if (code === 1) {
    message.success(msg || '')
    emits('closeModal', true)
  } else {
    message.error(msg || '')
  }
}

onMounted(() => {
  if (props.mode !== Mode.CREATE) {
    getDetail()
  } else {
    state.loadOver = true
  }
})

/**
 * 上一步
 */
const prevStep = () => {
  state.activeKey > 1 ? (state.activeKey -= 1) : (state.activeKey = 1)
}

const nextStepValidate = (formRef: any, msg: string) => {
  formRef
    .validate()
    .then(() => {
      state.activeKey < state.tabList.length ? (state.activeKey += 1) : (state.activeKey = state.tabList.length)
    })
    .catch((error: any) => {
      message.error(msg)
    })
}

const nextStep = () => {
  // 表单校验
  switch (true) {
    case state.activeKey == 1: // 商品基本信息
      nextStepValidate(productBasics.value.formRef, '请按要求正确填写【商品基础信息】！')
      break
    case state.activeKey == 2: // 价格存储
      if (formData.specType === 2) {
        if (formData.skuList.length === 0) {
          message.error('请填写多规格参数信息！')
          return
        } else {
          formData.skuList = formData.skuList.map((item: any) => {
            if (!item.image) {
              item.image = formData.image
            }
            return item
          })
          formData.price = null
          formData.vipPrice = null
          formData.marketPrice = null
          formData.costPrice = null
          formData.stock = null
          formData.stockWarning = null
        }
      } else {
        formData.skuList = [
          {
            price: formData.price ? `${formData.price}` : null,
            vipPrice: formData.vipPrice ? `${formData.vipPrice}` : null,
            marketPrice: formData.marketPrice ? `${formData.marketPrice}` : null,
            costPrice: formData.costPrice ? `${formData.costPrice}` : null,
            skuName: '单规格商品',
            image: formData.image || null,
            sn: formData.sn || null,
            stock: Number(`${formData.stock || 0}`),
            stockWarning: Number(`${formData.stockWarning || 0}`),
          },
        ]
      }
      nextStepValidate(productStock.value.formRef, '请按要求正确填写【商品规格参数级详细信息】！')
      break
    case state.activeKey == 3: // 商品详情
      nextStepValidate(productDescribe.value.formRef, '请按要求进行正确填写【商品详情】！')
      break
    case state.activeKey == 4: // 商品限购设置
      nextStepValidate(productLimit.value.formRef, '请按要求正确填写【商品限购设置】')
      break
    case state.activeKey == 5: // 商品核销设置
      nextStepValidate(productWriteOff.value.formRef, '请按要求正确填写【商品核销设置】')
      break
    case state.activeKey == 6: // 分享设置
      nextStepValidate(productWriteOff.value.formRef, '请按要求正确填写【分享设置参数信息】')
      break
    case state.activeKey == 7: // 分享设置
      nextStepValidate(productWriteOff.value.formRef, '请按要求正确填写【其他设置】')
      break
    case state.activeKey == 8: // 分享设置
      nextStepValidate(productWriteOff.value.formRef, '请按要求正确填写【多买赠礼】')
      break
  }
}

// 获取详情
const getDetail = async () => {
  let { data, code } = await apis.getJSON(apis.findProductById + props.productId)
  if (code === 1) {
    formData.productId = data.productId || ''
    formData.isVirtual = data.isVirtual || 1
    formData.storeId = data.storeId || '1'
    formData.categoryId = data.categoryId || ''
    formData.productName = data.productName || ''
    formData.keyword = data.keyword || ''
    let product = data.skuList[0] || {}
    formData.image = removeUndefined(product.image || '')
    // 单规格数据回填
    if (formData.specType === 1) {
      formData.price = product.price || null
      formData.costPrice = product.costPrice || null
      formData.marketPrice = product.marketPrice || null
      formData.vipPrice = product.vipPrice || null
      formData.stock = product.stock || null
      formData.stockWarning = product.stockWarning || null
      formData.sn = product.sn || null
    }
    formData.specType = data.specType || 1
    formData.sliderImage = removeUndefined(data.sliderImage)
    formData.recommendImage = removeUndefined(data.recommendImage)
    formData.unitName = data.unitName || ''
    // 状态(1:未上架[默认] 2:上架 3:草稿)
    formData.isDisplay = data.isDisplay || 2
    // 运费类型（1:包邮 2:统一运费 3:运费模板)
    formData.freightType = data.freightType || 1
    // 统一运价
    formData.freightRate = data.freightRate || 0
    // 运费模板id
    formData.freightTempId = data.freightTempId || ''
    // 简介
    formData.introduction = data.introduction || ''
    // 商品编号
    formData.sn = data.sn || ''
    // 品牌id
    formData.brandId = data.brandId || '1'
    // 虚拟商品类型
    formData.virtualType = data.virtualType || 0
    // 是否开启限购[0未开启，1开启]
    formData.isLimit = data.isLimit || 0
    // 限购数量
    formData.limitNum = data.limitNum || 1
    //  限购类型(1:单次限购 2:永久限购)
    formData.limitType = data.limitType || 1
    // 限购数量
    formData.limitNum = data.limitNum || 1
    // 是否代理 0:不可代理 1:可代理)
    formData.merUse = data.merUse || 0
    // 商品条码(条形码)
    formData.barCode = data.barCode || ''
    // 秒杀状态(0:未开启 1:已开启)
    formData.isSeckill = data.isSeckill || 0
    // 砍价状态(0:未开启 1:开启)
    formData.isBargain = data.isBargain || 0
    //  活动显示排序(1:秒杀 2:砍价 3:拼团)
    formData.activity = data.activity || 0
    // 是否热卖
    formData.isHot = data.isHot || 0
    // 是否优惠(如果有优惠，优惠券必填)
    formData.isBenefit = data.isBenefit || 0
    // 是否精品
    formData.isBest = data.isBest || 0
    // 是否新品
    formData.isNew = data.isNew || 0
    // 获得积分
    formData.giveIntegral = data.giveIntegral || 0
    // 是否优品推荐
    formData.isGood = data.isGood || 0
    // 是否单独分佣
    formData.isSub = data.isSub || 0
    // 是否开启会员价格
    formData.isVip = data.isVip || 0
    // 商品二维码地址(用户小程序海报)
    formData.codePath = data.codePath || ''
    // 主图视频链接
    formData.videoLink = data.videoLink || ''
    //  商品spu
    formData.spu = data.spu || ''
    // 标签id(比如热卖 特惠等)
    formData.labelId = data.labelId || ''
    // 复制口令
    formData.commandWord = data.commandWord || ''
    // 是否会员专属商品 推荐商品id
    formData.recommendList = data.recommendList || ''
    // 开启vip
    formData.vipProduct = data.vipProduct || 0
    // 是否预售商品
    formData.presale = data.presale || 0
    // 预售结束后几天内发货:
    formData.presaleDay = data.presaleDay || 0
    // 预售开始时间
    formData.presaleStartTime = data.presaleStartTime || ''
    // 预售结束时间
    formData.presaleEndTime = data.presaleEndTime || ''
    formData.skuList = data.skuList || []
    formData.sortBy = data.sortBy || 0
    formData.content = data.content || ''
    // sales: 0, // views: 0, // giveIntegral
    state.loadOver = true
  }
  console.log(formData, 'formData')
}
function removeUndefined(str: string) {
  // 使用正则表达式来匹配 'undefined'（不包括前面的斜杠）并设置全局标志 'g'
  return str.replace(/undefined/g, '')
}

function removeImgHost(str: string): string {
  return str.replace(apis.imageViewHost, '')
}
</script>

<style lang="scss" scoped>
// .a-tab-pane-box {
.ant-tabs-tabpane {
  // max-height: 95vh;
  // overflow-y: auto;
  // overflow-x: hidden;
  padding: 0 10px;
}
</style>

<style lang="scss">
.modal-box {
  .ant-tabs-content {
    height: 50vh;
    overflow-y: auto;
  }
}
</style>
