import type { ButtonSize } from 'ant-design-vue/es/button'

interface Theme {
  buttonSize: ButtonSize
  formSize: ButtonSize
  pageHeight: number
  tableSubtractHight: number
  modelWidth: number
  labelCol: {
    span: number
  }
  wrapperCol: {
    span: number
  }
  paginationSize: 'default' | 'small'
}

const theme: Theme = {
  buttonSize: 'small',
  formSize: 'small',
  pageHeight: 930,
  tableSubtractHight: 378,
  modelWidth: 800,
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
  paginationSize: 'small',
}

export default theme
