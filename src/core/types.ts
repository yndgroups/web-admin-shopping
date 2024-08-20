interface AnyObj {
  [k: string]: any
}

export enum OrderStatus {
  /// 待付款 1
  WaitPay = 1,
  ///  待发货 2
  WaitDelivery = 2,
  /// 已发货 3
  AlreadyDelivery = 3,
  /// 待收货 4
  WaitReceivingGoods = 4,
  /// 已收货 5
  AlreadyReceivingGoods = 5,
  /// 待评价 6
  WaitComment = 6,
  /// 订单关闭 7
  Close = 7,
  /// 退款中 8
  Refund = 8,
}

export enum Mode {
  create = 'CREATE',
  update = 'UPDATE',
  delete = 'DELETE',
  detail = 'DETAIL',
}

// api类型
interface apis {
  create?: string
  update?: string
  delete?: string
  cud?: string
  list: string
  findById?: string
}

interface modalConfig {
  title: string
  formField?: AnyObj
  width?: number | string
  showFooter?: boolean
}

interface tableConfig {
  rowSelection?: AnyObj
  tableKey: string
  columns: any[]
}

interface searchParams {
  params: AnyObj
  showButton: boolean
  showSearch: boolean
}

export interface CrudConfig {
  apis: apis
  modalConfig: modalConfig
  tableConfig: tableConfig
  searchParams?: searchParams
  rowSelection?: AnyObj
}
