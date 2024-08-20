interface Area {
  [key: string]: string
}

const areaInfo: Area = {
  '100000': '中华人民共和国',
  '110000': '北京市',
  '120000': '天津市',
  '130000': '河北省',
  '140000': '山西省',
  '150000': '内蒙古自治区',
  '210000': '辽宁省',
  '220000': '吉林省',
  '230000': '黑龙江省',
  '310000': '上海市',
  '320000': '江苏省',
  '330000': '浙江省',
  '340000': '安徽省',
  '350000': '福建省',
  '360000': '江西省',
  '370000': '山东省',
  '410000': '河南省',
  '420000': '湖北省',
  '430000': '湖南省',
  '440000': '广东省',
  '450000': '广西壮族自治区',
  '460000': '海南省',
  '500000': '重庆市',
  '510000': '四川省',
  '520000': '贵州省',
  '530000': '云南省',
  '540000': '西藏自治区',
  '650000': '新疆维吾尔自治区',
  '630000': '青海省',
  '620000': '甘肃省',
  '610000': '陕西省',
  '640000': '宁夏回族自治区',
  '710000': '台湾省',
  '810000': '香港特别行政区',
  '820000': '澳门特别行政区',
}

// 根据地区名称获取地区编码
export function getAreaCodeByAreaName(areaName: string): string {
  if (areaName === '') {
    return ''
  }
  let areaCode: string = '' // 没有匹配到地区信息返回空，所以调用函数时请注意空判断
  for (const k in areaInfo) {
    if (areaInfo[k] === areaName) {
      areaCode = k
    }
  }
  return areaCode
}

// 根据地区编码获取地区级别
export const getAreaLevel = (areaCode: string): number => {
  let level = 0
  if (areaCode.indexOf('00000') != -1) {
    level = 0
  } else if (areaCode.indexOf('0000') != -1) {
    level = 1
  } else if (areaCode.indexOf('00') != -1) {
    level = 2
  }
  return level
}
