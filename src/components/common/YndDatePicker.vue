<template>
  <div>
    <a-range-picker
      format="YYYY-MM-DD"
      :placeholder="['开始日期', '结束日期']"
      class="date"
      :value="dataValue"
      :disabled-date="disabledDate"
      @calendarChange="onCalendarChange"
      @OpenChange="onOpenChange"
      @change="changeDate"
      :locale="locale"
    />
  </div>
</template>
<script lang="ts" setup>
import 'dayjs/locale/zh-cn'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
import dayjs from 'dayjs'
dayjs.locale('zh-cn')
let dataValue = ref<any>(['', ''])
let currentDate = ref<any>(['', dayjs()])
let clickType = ref('')

const disabledDate = (current: any): any => {
  if (dataValue.value[0] === '' && dataValue.value[1] === '') {
    return current > dayjs()
  }
  // 选中日期
  /* console.log(clickType.value, 'clickType')
    console.log(dayjs(current).format('YYYY-MM-DD')) */
  if (clickType.value == 'start') {
    return current > dayjs()
  }
  if (clickType.value == 'end') {
    return current > dayjs()
  }
}
const onOpenChange = (open: any) => {}

const onCalendarChange = (date: any, dateArr: any, dateInfo: any) => {
  currentDate.value = dateArr
  clickType.value = dateInfo.range
  if (dateInfo.range === 'start') {
    currentDate.value[0] = dateArr[0]
  }
  if (dateInfo.range === 'end') {
    currentDate.value[1] = dateArr[1]
  }
}

const changeDate = (val: any) => {
  let diff = dayjs(val[1], 'day').diff(val[0], 'day')
  if (diff > 7) {
    alert('只能选择七天之内的时间')
    dataValue.value = ['', '']
  } else {
    dataValue.value = [val[0]]
  }
}
</script>
