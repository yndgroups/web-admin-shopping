<template>
  <a-modal
    v-model:open="showModal"
    :title="type === 0 ? '添加优惠卷' : type === 1 ? '修改优惠卷' : '详情'"
    :width="1200"
    :bodyStyle="{ height: '70vh', overflowX: 'auto' }"
    @cancel="emit('closeModal')"
    class="modal-box"
    @ok="submit"
    :okButtonProps="{ disabled: type === 2 }"
  >
    <a-form
      :model="formData"
      ref="form"
      layout="vertical"
    >
      <a-row :gutter="20">
        <a-col :span="12">
          <a-form-item
            label="名称"
            name="title"
            :rules="[{ required: true, message: '请输入优惠卷名称' }]"
          >
            <a-input
              v-model:value="formData.title"
              placeholder="请输入优惠卷名称"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="类型"
            name="type"
            :rules="[{ required: true, message: '请选择类型' }]"
          >
            <select-dict-select
              v-model:value="formData.type"
              dictType="types"
              @change="formData.type === 1 ? (formData.categoryId = []) : (formData.categoryId = ''), formData.type === 3 ? (formData.productId = []) : (formData.productId = '')"
            />
          </a-form-item>
        </a-col>
        <a-col
          v-if="formData.type === 1"
          :span="12"
        >
          <a-form-item
            label="分类id(类目)"
            name="categoryId"
            :rules="[{ required: true, message: '请选择分类id(类目)' }]"
          >
            <product-category-cascader
              v-model:value="formData.categoryId"
              placeholder="请选择商品分类"
              @change="
                (val:any) => {
                  val ? '' : (formData.categoryId = []);
                }
              "
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="兑换的优惠券面值"
            name="couponPrice"
            :rules="[{ required: true, message: '请输入兑换的优惠券面值' }]"
          >
            <a-input-number
              v-model:value="formData.couponPrice"
              placeholder="请输入兑换的优惠券面值"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="优惠券有效期限（单位：天）"
            name="couponTime"
            :rules="[{ required: true, message: '请输入优惠券有效期限（单位：天）' }]"
          >
            <a-input-number
              v-model:value="formData.couponTime"
              placeholder="请输入优惠券有效期限（单位：天）"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="使用开始时间"
            name="startUseTime"
            :rules="[{ required: true, message: '请选择使用开始时间' }]"
          >
            <a-date-picker
              v-model:value="formData.startUseTime"
              value-format="YYYY-MM-DD HH:mm:ss"
              :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
              style="width: 100%"
              placeholder="请选择使用开始时间"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="使用结束时间"
            name="endUseTime"
            :rules="[{ required: true, message: '请选择使用结束时间' }]"
          >
            <a-date-picker
              v-model:value="formData.endUseTime"
              value-format="YYYY-MM-DD HH:mm:ss"
              :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
              style="width: 100%"
              placeholder="请选择使用结束时间"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="消费满多少赠送"
            name="fullReduction"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <a-input-number
              v-model:value="formData.fullReduction"
              placeholder="请输入消费满多少赠送"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="优惠券图片"
            name="image"
            :rules="[{ required: true, message: '请上传优惠券图片' }]"
          >
            <common-ynd-upload
              v-model="formData.image"
              accept="image/*"
              ezWidth=""
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="兑换消耗积分值"
            name="integral"
            :rules="[{ required: true, message: '兑换消耗积分值' }]"
          >
            <a-input-number
              v-model:value="formData.integral"
              placeholder="请输入兑换消耗积分值"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="是否满赠"
            name="isFullGive"
            :rules="[{ required: true, message: '请选择' }]"
          >
            <select-dict-select
              v-model:value="formData.isFullGive"
              dictType="yes-or-no"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="是否首次关注赠送"
            name="isGiveSubscribe"
            :rules="[{ required: true, message: '请选择' }]"
          >
            <select-dict-select
              v-model:value="formData.isGiveSubscribe"
              dictType="yes-or-no"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="是否无限张数"
            name="isPermanent"
            :rules="[{ required: true, message: '请选择' }]"
          >
            <select-dict-select
              v-model:value="formData.isPermanent"
              dictType="yes-or-no"
            />
          </a-form-item>
        </a-col>
        <a-col
          v-if="formData.type === 2 || formData.type === 3"
          :span="12"
        >
          <a-form-item
            label="所属商品"
            name="productId"
            :rules="[{ required: true, message: '请选择所属商品' }]"
          >
            <select-produc-select
              v-model:value="formData.productId"
              :mode="formData.type === 2 ? '' : 'tags'"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="领取开始时间"
            name="receiveStartTime"
            :rules="[{ required: true, message: '请选择领取开始时间' }]"
          >
            <a-date-picker
              v-model:value="formData.receiveStartTime"
              value-format="YYYY-MM-DD HH:mm:ss"
              :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
              style="width: 100%"
              placeholder="请选择领取开始时间"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="领取结束时间"
            name="receiveEndTime"
            :rules="[{ required: true, message: '请选择领取开始时间' }]"
          >
            <a-date-picker
              v-model:value="formData.receiveEndTime"
              value-format="YYYY-MM-DD HH:mm:ss"
              :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
              style="width: 100%"
              placeholder="请选择领取结束时间"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="领取门槛"
            name="receiveThreshold"
            :rules="[{ required: true, message: '请选择领取门槛' }]"
          >
            <select-dict-select
              v-model:value="formData.receiveThreshold"
              dictType="receive-threshold"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="领取方式"
            name="receiveWays"
            :rules="[{ required: true, message: '请选择领取方式' }]"
          >
            <select-dict-select
              v-model:value="formData.receiveWays"
              dictType="receive-ways"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="状态"
            name="status"
            :rules="[{ required: true, message: '请选择状态' }]"
          >
            <select-dict-select
              v-model:value="formData.status"
              dictType="status"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="领取数量"
            name="totalCount"
            :rules="[{ required: true, message: '请输入领取数量' }]"
          >
            <a-input-number
              v-model:value="formData.totalCount"
              placeholder="请输入领取数量"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item
            label="最低消费多少金额可用优惠券"
            name="useMinPrice"
            :rules="[{ required: true, message: '请输入最低消费多少金额可用优惠券' }]"
          >
            <a-input-number
              v-model:value="formData.useMinPrice"
              placeholder="请输入最低消费多少金额可用优惠券"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { HttpMethod } from '@/config/axios'
import apis from '@/apis'
import { message } from 'ant-design-vue'
interface Data {
  [key: string]: any
}
const { proxy }: any = getCurrentInstance()
const props = defineProps({
  visible: {
    type: Boolean,
    default: () => false,
  },
  row: {
    type: Object,
    default: () => {},
  },
  type: {
    type: Number,
    default: 0,
  },
})
const showModal = ref<boolean>(props.visible)
let formData = reactive<Data>({
  categoryId: [], //分类id(类目)

  couponId: '', //string优惠券id

  couponPrice: 0, //number兑换的优惠券面值

  couponTime: 0, //integer优惠券有效期限（单位：天）

  endUseTime: '', //string使用结束时间

  fullReduction: 0, //number消费满多少赠送

  image: '', //string优惠券图片

  integral: 0, //integer兑换消耗积分值

  isFullGive: 0, //integer是否满赠(0:否[默认] 1:是)

  isGiveSubscribe: 0, //integer是否首次关注赠送(0:否[默认]1:是)

  isPermanent: 0, //integer是否无限张数(0:否 1:是)

  productId: '', //string所属商品id(单品)

  receiveEndTime: '', //string领取结束时间

  receiveStartTime: '', //	string领取开始时间

  receiveThreshold: null, //integer领取门槛(1:普通 2:新人 3:首单 4:指定用户[会员券])

  receiveWays: null, //integer领取方式(1:手动领取 2:自动发放)

  startUseTime: '', //	string使用开始时间

  status: null, //	integer状态(1:未开启 2:正常 3:无效)

  title: '', //	string名称

  totalCount: 0, //	integer领取数量

  type: null, //	integer类型(1:类目 2:指定商品 3:单品 4:全品 )

  useMinPrice: 0, //	number最低消费多少金额可用优惠券
})
const form = ref<any>()
const emit = defineEmits(['getData', 'closeModal'])
function submit() {
  form.value.validateFields().then(async () => {
    let info = {
      ...formData,
      categoryId: formData.type === 1 ? formData.categoryId[formData.categoryId.length - 1 || 0] || '' : '',
      productId: formData.type === 2 ? formData.productId : formData.type === 3 ? formData.productId.join(',') : '',
    }
    let { code, msg } = await apis.request({
      url: apis.addEditCoupon,
      method: props.type === 0 ? HttpMethod.POST : HttpMethod.PUT,
      data: info,
    })
    if (code === 1) {
      message.success(props.type === 0 ? '新增成功' : '修改成功')
      emit('getData')
      emit('closeModal')
    } else {
      message.warning(msg)
    }
  })
}

onMounted(() => {
  if (props.type === 1 || props.type === 2) {
    for (let key in formData) {
      formData[key] = props.row[key]
    }
  }
})
</script>
