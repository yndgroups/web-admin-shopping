/**
 * @description 表单操作参数
 *
 * @author yangdaqiong
 * @date 2021-09-24
 */
export const editParams = {
  appId: '',
  loading: false,
  formView: false,
  itemData: null,
  mode: 1, // 1添加父菜单 2、添加子菜单 3、修改
  shrink: false, // 收縮表单
  tableData: [], // 表格数据
}

interface PageInfo {
  pageInfo: {
    pageIndex: number
    pageSize: number
    total: number
    totalCount: number
    params: any
  }
}

/**
 * @description 分页调取参数
 *
 * @author yangdaqiong
 * @date 2021-09-24
 */
export const pager = (params: any = {}): PageInfo => {
  return {
    pageInfo: {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      totalCount: 0,
      params: params,
    },
  }
}

/**
 * @description 关闭模态框
 *
 * @param {*} context 上下文对象
 * @author yangdaqiong
 * @date 2021-09-24
 */
export const closeModal = (context: any) => {
  context.formView = false
}
