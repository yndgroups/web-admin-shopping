// 运行时环境
export const runtime = window.Runtime

// 部署访问根目录
export const webRootPath = window.location.origin + import.meta.env.VITE_APP_WEB_ROOT_PATH

export interface AnyObj {
  [key: string]: any
}

export interface Viewport {
  vh: number
  vw: number
  timer: number
}

export interface Request {
  // 列表
  list: string
  // 新增
  create?: string
  // 更新
  update?: string
  // 删除
  delete?: string
  // 详情
  detail?: string
}

export interface ModalConfig {
  title: string
  width?: number | string
}

/**
 * 显示模式
 */
export enum Mode {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  DETAIL = 'detail',
  OTHER = 'other',
}

export interface TableConfig {
  tableKey: string
  columns: Array<AnyObj>
}

export interface PageCrudContainerOptions {
  request: Request
  modalConfig: ModalConfig
  searchParams?: AnyObj
  tableConfig: TableConfig
  rowSelection?: AnyObj
}

export interface Product {
  // 商品id
  productId: string
  // 是否虚拟商品(0:否 1:是)
  isVirtual: number
  // 店铺id
  storeId: string
  // 分类id
  categoryId: string
  // 商品名称
  productName: string
  // 关键字
  keyword: string
  // 销售价
  price: null | string
  // 成本价
  costPrice: null | string
  // 会员价
  vipPrice: null | string
  // 市场价
  marketPrice: null | string
  // 商品图片
  image: string
  // 轮播图
  sliderImage: string
  // 推荐图
  recommendImage: string
  // 库存
  stock: null | number
  // 库存预警
  stockWarning: null | number
  // 单位名
  unitName: string
  // 规格(1:单规格[默认] 2:多规格)
  specType: number
  // 状态(1:未上架[默认] 2:上架 3:草稿)
  isDisplay: number
  // 运费类型（1:包邮 2:统一运费 3:运费模板)
  freightType: number
  // 统一运价
  freightRate: number
  // 运费模板id
  freightTempId: string
  // 简介
  introduction: string
  // 商品编号
  sn: string
  // 销量
  sales: number
  // 品牌id
  brandId: string
  // 虚拟商品类型
  virtualType: number
  // 是否开启限购
  isLimit: number
  // 限购类型(1:单次限购 2:永久限购)
  limitType: number
  // 限购数量
  limitNum: number
  // 浏览量
  views: number
  // 是否代理 0:不可代理 1:可代理)
  merUse: number
  // 商品条码(条形码)
  barCode: string
  // 秒杀状态(0:未开启 1:已开启)
  isSeckill: number
  // 砍价状态(0:未开启 1:开启)
  isBargain: number
  // 活动显示排序(1:秒杀 2:砍价 3:拼团)
  activity: number
  // 是否热卖
  isHot: number
  // 是否优惠(如果有优惠，优惠券必填)
  isBenefit: number
  // 是否精品
  isBest: number
  // 是否新品
  isNew: number
  // 获得积分
  giveIntegral: number
  // 是否优品推荐
  isGood: number
  // 是否单独分佣
  isSub: number
  // 是否开启会员价格
  isVip: number
  // 商品二维码地址(用户小程序海报)
  codePath: string
  // 主图视频链接
  videoLink: null | string
  // 商品spu
  spu: string
  // 标签id(比如热卖 特惠等)
  labelId: string
  // 复制口令
  commandWord: string
  // 推荐商品id
  recommendList: string
  // 是否会员专属商品
  vipProduct: number
  // 是否预售商品
  presale: number
  // 预售结束后几天内发货:
  presaleDay: number
  // 预售开始时间
  presaleStartTime: string
  // 预售结束时间
  presaleEndTime: string
  sortBy: number
  skuList: AnyObj
  content: string
}
