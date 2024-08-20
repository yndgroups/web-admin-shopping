<template>
  <a-modal
    v-model:open="showModal"
    title="订单详情"
    :width="1200"
    :bodyStyle="{ height: '70vh', overflowX: 'auto' }"
    @cancel="emit('closeModal')"
    class="modal-box"
    @ok="emit('closeModal')"
  >
    <a-descriptions
      title="基本信息"
      bordered
      :column="2"
    >
      <a-descriptions-item label="订单编号">{{ form.orderNo }}</a-descriptions-item>
      <a-descriptions-item label="下单号">{{ form.tradeNo }}</a-descriptions-item>
      <a-descriptions-item label="交易类型">{{ form.tradeTypeName }}</a-descriptions-item>
      <a-descriptions-item label="总金额">{{ form.totalPrice }}</a-descriptions-item>
      <a-descriptions-item label="支付金额">{{ form.payPrice }}</a-descriptions-item>
      <a-descriptions-item label="支付类型">{{ form.payTypeName }}</a-descriptions-item>
      <a-descriptions-item label="订单状态">{{ form.statusName }}</a-descriptions-item>
      <a-descriptions-item label="支付状态">
        {{ form.payStatusName }}
      </a-descriptions-item>
      <a-descriptions-item label="收货人电话">
        {{ form.userPhone }}
      </a-descriptions-item>
      <a-descriptions-item label="时间">
        {{ form.createTime }}
      </a-descriptions-item>
      <a-descriptions-item label="收货地址">
        {{ form.userAddress }}
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions
      title="商品信息"
      bordered
      style="margin-top: 20px"
    />
    <a-table
      :columns="columns"
      :data-source="form.productList"
      :pagination="false"
      bordered
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'image'">
          <img
            v-if="record.image"
            class="w-80"
            :src="record.image"
            alt="图片加载中...."
          />
        </template>
      </template>
    </a-table>
  </a-modal>
</template>

<script lang="ts" setup>
import apis from '@/apis'
import { message } from 'ant-design-vue'
interface Data {
  [key: string]: any
}
const emit = defineEmits(['getData', 'closeModal'])
const { proxy }: any = getCurrentInstance()
const props = defineProps({
  visible: {
    type: Boolean,
    default: () => false,
  },
  orderId: {
    type: String,
    default: '',
  },
})
const showModal = ref<boolean>(props.visible)
const form = ref<Data>({})
const columns = [
  {
    title: '商品图片',
    dataIndex: 'image',
    key: 'image',
  },
  { title: '商品名称', dataIndex: 'productName', key: 'productName' },
  { title: '商品单价', dataIndex: 'price', key: 'price' },
  { title: '市场价', dataIndex: 'marketPrice', key: 'marketPrice' },
]
onMounted(async () => {
  const { code, data, msg } = await apis.getJSON(apis.getOrderDetail + props.orderId)
  if (code === 1) {
    form.value = data || {}
  } else {
    message.warning(msg)
  }
})
</script>

<style lang="scss" scoped>
.productList {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
</style>
