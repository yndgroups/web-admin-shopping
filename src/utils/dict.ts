type Data = {
  [key: string]: any[]
}

const data: Data = {
  //   计费方式
  'billing-methods': [
    { label: 'DHL快递收费', value: 1 },
    { label: 'ups快递收费', value: 2 },
    { label: 'FEDEX快递收费', value: 3 },
    { label: 'EMS快递收费', value: 4 },
  ],
  //是否包邮
  appoint: [
    { label: '包邮', value: 0 },
    { label: '不包邮', value: 1 },
  ],
  // 是否送达
  no_delivery: [
    { label: '送达', value: 0 },
    { label: '不送达', value: 1 },
  ],
  // 展示类型
  'display-Type': [
    { label: '文字展示', value: 0 },
    { label: '图片展示', value: 1 },
  ],
  'yes-or-no': [
    { label: '否', value: 0 },
    { label: '是', value: 1 },
  ],
  display: [
    { label: '显示', value: 1 },
    { label: '不显示', value: 0 },
  ],
  enabled: [
    { label: '可用', value: 1 },
    { label: '不可用', value: 0 },
  ],
  net: [
    { label: '需要', value: 1 },
    { label: '不需要', value: 0 },
  ],

  'receive-threshold': [
    { label: '普通', value: 1 },
    { label: '新人', value: 2 },
    { label: '首单', value: 3 },
    { label: '指定用户[会员券]', value: 4 },
  ],
  'receive-ways': [
    { label: '手动领取', value: 1 },
    { label: '自动发放', value: 2 },
  ],
  status: [
    { label: '未开启', value: 1 },
    { label: '正常', value: 2 },
    { label: '无效', value: 3 },
  ],
  types: [
    { label: '类目', value: 1 },
    { label: '单品', value: 2 },
    { label: '指定商品', value: 3 },
    { label: '全品', value: 4 },
  ],
  // 1:待付款[默认] 2:待发货 3:已发货 4:待收货 5:已收货 6:待评价 7:订单关闭
  'order-type': [
    { label: '全部', value: 0 },
    { label: '待付款', value: 1 },
    { label: '待发货', value: 2 },
    { label: '已发货', value: 3 },
    { label: '待收货', value: 4 },
    { label: '已收货', value: 5 },
    { label: '待评价', value: 6 },
    { label: '订单关闭', value: 7 },
  ],
  'account-type': [
    { label: '个人账户', value: 1 },
    { label: '企业', value: 2 },
  ],
  'reg-type': [
    { label: '后台端', value: 1 },
    { label: '前端', value: 2 },
    { label: '微信公众号', value: 3 },
    { label: '微信小程序', value: 4 },
  ],
  'status-type': [
    { label: '启用(审核通过)', value: 1 },
    { label: '禁用', value: 2 },
    { label: '待审核', value: 3 },
  ],
}

export default data
