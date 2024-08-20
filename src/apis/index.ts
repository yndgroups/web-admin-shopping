import { postJSON, getJSON, putJSON, deleteJSON, request } from '@/config/axios'

const common = '/api/sys'
const sys_prefix = '/api/sys'
const store_prefix = '/api/store'
const order_prefix = '/api/order'

export const appId = import.meta.env.VITE_APP_ID
export const imageViewHost = import.meta.env.VITE_APP_IMG_VIEW_HOST

export default {
  // 应用id
  appId: appId,
  // 图片预览地址
  imageViewHost: imageViewHost,
  // 文件上传删除
  removeFile: `${sys_prefix}/file/remove`,
  // 文件上传
  fileUpload: `${sys_prefix}/file/upload/`,
  // 创建匿名token
  createAnonymityToken: `${common}/auth/createAnonymityToken/${appId}`,
  // 登录
  login: `${common}/auth/login`,
  // 退出
  logout: `${common}/user/logout`,
  // 地区管理
  area: `${common}/area`,
  // 地区列表
  findPageAreaList: `${common}/area/findPageList`,
  // 地区详情
  findAreaById: `${common}/area/findById`,
  // 菜单管理
  menu: `${common}/menu`,
  // 树形菜单
  menuTreeAll: `${common}/menu/treeAll`,
  // 用户
  user: `${sys_prefix}/user`,
  // 查询用户信息
  findUserIdByUserParam: `${sys_prefix}/findUserIdByUserParam`,
  // 店铺管理
  store: `${store_prefix}/store`,
  storeFindPageList: `${store_prefix}/store/findPageList`,
  storeFindById: `${store_prefix}/store/findById/`,

  // 商品管理
  product: `${store_prefix}/product`,
  // 商品列表
  findProductPageList: `${store_prefix}/product/findPageList`,
  /// 商品详情
  findProductById: `${store_prefix}/product/findById/`,
  // 根据分类id查询品牌 {productCategoryId}
  findBrandListByProductCategoryId: `${store_prefix}/brand/findListByProductCategoryId/`,
  // 根据父id获取产品分类 {parentId}
  categoryFindListByParentId: `${store_prefix}/productCategory/findListByParentId/`,
  // 根据店铺id拉取规格
  findSpecListByStoreId: `${store_prefix}/productSpec/findSpecListByStoreId/`,
  // 广告管理
  storeAd: `${store_prefix}/ad`,
  // 广告详情
  storeAdFindById: `${store_prefix}/ad/findById/`,
  // 广告列表
  storeAdFindPageList: `${store_prefix}/ad/findPageList`,
  // 商品规格管理
  storeProductSpec: `${store_prefix}/productSpec`,
  // 规格列表
  storeProductSpecFindPageList: `${store_prefix}/productSpec/findPageList`,
  // 规格详情
  storeProductSpecFindById: `${store_prefix}/productSpec/findById/`,
  // 订单统计
  orderStatistics: `${order_prefix}/order/statistics`,
  // 订单列表
  orderFindPageList: `${order_prefix}/order/findPageList`,
  // 订单想去
  orderFindOrderById: `${order_prefix}/order/findById/`,
  // 角色
  role: `${sys_prefix}/role`,
  // 角色列表
  findRoleList: `${sys_prefix}/role/list`,
  // 角色详情
  findRoleById: `${sys_prefix}/role/findById/`,
  // 给角色添加功能权限
  addFuncToRole: `${sys_prefix}/role/addFuncToRole`,
  // 给角色添加菜单权限
  addMenuToRole: `${sys_prefix}/role/addMenuToRole`,
  // 根据角色id查询已授权的菜单信息
  findFuncInfoByRoleId: `${sys_prefix}/role/findFuncInfoByRoleId/`,
  // 根据角色id查询已授权的菜单信息
  findMenuInfoByRoleId: `${sys_prefix}/role/findMenuIdsByRoleId/`,
  // 用户详情
  userFindById: `${sys_prefix}/user/findById/`,
  // 用户列表
  userFindPageList: `${sys_prefix}/user/findPageList`,
  // 分类
  productCategory: `${store_prefix}/productCategory`,
  // 树形分类
  findProductCategoryTreeById: `${store_prefix}/productCategory/findTreeById/`,
  // 查询店铺
  storeFindList: `${store_prefix}/findStoreList`,
  // request绑定
  postJSON,
  getJSON,
  putJSON,
  deleteJSON,
  request,
}
