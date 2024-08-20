export const order = {
  // 公共
  common: {
    appTypes: ['微信小程序', 'H5', '微信公众号', '支付宝小程序', '抖音-头条', '快手'],
    // 支付方式
    paymentMethod: [
      { label: '后台确认支付', value: 1 },
      { label: '微信', value: 2 },
      { label: '支付宝', value: 3 },
      { label: '余额', value: 4 },
      { label: '零元购', value: 5 },
    ],
    // 渠道
    channel: [
      { label: '导入', value: 1 },
      { label: '微信小程序', value: 2 },
      { label: 'H5', value: 3 },
      { label: '公众号', value: 4 },
      { label: '安卓', value: 5 },
      { label: '苹果', value: 6 },
      { label: '支付宝小程序', value: 7 },
      { label: '百度小程序', value: 8 },
      { label: '头条/字节跳动小程序', value: 9 },
    ],
    // 配送方式
    expressType: [
      { label: '快递', value: 1 },
      { label: '自提', value: 2 },
      { label: '核销', value: 3 },
      { label: '虚拟商品(卡密)', value: 4 },
      { label: '社区团购', value: 5 },
      { label: '同城配送', value: 6 },
    ],
    // 申请退款
    isRefund: [
      { label: '未申请', value: 1 },
      { label: '已申请', value: 2 },
      { label: '已完成', value: 3 },
    ],
    // 订单类型
    orderType: [
      { label: '普通订单', value: 1 },
      { label: '拼团订单', value: 2 },
      { label: '秒杀', value: 3 },
      { label: '卡密订单', value: 4 },
      { label: '砍价订单', value: 5 },
      { label: '社区团购', value: 6 },
      { label: '免单', value: 7 },
      { label: '激活码', value: 8 },
    ],
    // 订单状态
    orderStatus: [
      { label: '待付款', value: 1 },
      { label: '待发货', value: 2 },
      { label: '已发货', value: 3 },
      { label: '待收货', value: 4 },
      { label: '已收货', value: 5 },
      { label: '待评价', value: 6 },
      { label: '订单关闭', value: 7 },
      { label: '退款中', value: 8 },
    ],
  },
  // 搜索条件
  search: {
    keyWordType: [
      // 关键词搜索类型
      { label: '订单编号', value: 1 },
      { label: '支付单号', value: 2 },
      { label: '商品名称', value: 3 },
      { label: '买家姓名', value: 4 },
      { label: '买家电话', value: 5 },
      { label: '购物车单号', value: 6 },
      { label: '商家名称', value: 7 },
      { label: '用户昵称', value: 8 },
      { label: '订单核销码', value: 9 },
    ],
    orderType: [
      // 订单类型
      { label: '全部', value: 1 },
      { label: '普通订单', value: 2 },
      { label: '拼团订单', value: 3 },
      { label: '秒杀订单', value: 4 },
      { label: '砍价订单', value: 5 },
    ],
    payType: [
      // 支付类型
      { label: '全部', value: 1 },
      { label: '余额支付', value: 2 },
      { label: '微信支付', value: 3 },
      { label: '支付宝支付', value: 4 },
      { label: '后台支付', value: 5 },
    ],
    orderFrom: [
      // 订单来源
      { label: '全部', value: 1 },
      { label: '微信小程序', value: 2 },
      { label: 'H5', value: 3 },
      { label: '微信公众号', value: 4 },
      { label: '字节跳动', value: 5 },
      { label: '快手', value: 6 },
    ],
    afterSalesStatus: [
      // 售后状态
      { label: '全部', value: 1 },
      { label: '进行中', value: 2 },
      { label: '已拒绝', value: 3 },
      { label: '已完成', value: 4 },
      { label: '已取消', value: 5 },
    ],
    afterSalesType: [
      // 售后类型
      { label: '全部', value: 1 },
      { label: '退款', value: 2 },
      { label: '退款退货', value: 3 },
      { label: '换货', value: 4 },
    ],
    consumptionMode: [
      { label: '快递发货', value: 1 },
      { label: '核销', value: 2 },
      { label: '自提', value: 3 },
      { label: '卡密', value: 4 },
    ],
  },
}

export const store = {
  search: {
    withdrawType: [
      { label: '微信', value: 1 },
      { label: '银行卡', value: 2 },
    ],
    viewGoodStore: [
      { label: '是', value: 1 },
      { label: '否', value: 0 },
    ],
  },
}

export const user = {
  search: {
    blackList: [
      { label: '全部', value: 1 },
      { label: '是', value: 2 },
      { label: '否', value: 3 },
    ],
    regsterFormType: [
      { label: '头条', value: 1 },
      { label: '快手', value: 2 },
    ],
    rechargeStatus: [
      { label: '未支付', value: 1 },
      { label: '已支付', value: 2 },
      { label: '已经退款', value: 3 },
    ],
  },
}

export const menu = {
  menuTypeList: [
    { label: '按钮', value: 2 },
    { label: '菜单', value: 1 },
  ],
}

export default {
  order,
  store,
  user,
  menu,
}
