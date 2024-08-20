import { reactive, nextTick } from 'vue'
import { initMapConfig } from './initMapConfig'

const state = reactive<any>({
  mapContainer: {},
  placeSearch: {},
  localContainer: {
    animate: {
      start: {},
    },
  },
})

// 初始化地图
export const initMap = (mapContainer: any, lnglat: any, then: Function) => {
  state.mapContainer = mapContainer
  initMapConfig(['AMap.ToolBar', 'AMap.Driving', 'AMap.OverView'], []).then((AMap: any) => {
    const map = new AMap.Map(mapContainer, {
      zoom: 11, //级别
      center: [lnglat.lng || 116.397428, lnglat.lat || 39.90923], //中心点坐标
      viewMode: '2D', //使用3D视图
      resizeEnable: true,
    })
    AMap.plugin(['AMap.PlaceSearch'], function () {
      //构造地点查询类
      state.placeSearch = new AMap.PlaceSearch({
        pageSize: 3, // 单页显示结果条数
        pageIndex: 1, // 页码
        citylimit: false, //是否强制限制在设置的城市内搜索
        map: map, // 展现结果的地图实例
        panel: 'panel', // 结果列表将在此容器中进行展示。
        autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
      })
      AMap.Event.addListener(state.placeSearch, 'listElementClick', (value: any) => {
        const { data } = value
        setMarker(map, { ...data.location })
        setGeocoder(map, { ...data.location }, then)
        document.querySelector<any>('#panel').innerHTML = ''
      })
    })
    map.on('click', (enven: any) => mapClick(enven, map, then))
    setMarker(map, { ...lnglat })
  })
}

function mapClick(event: any, map: any, then: Function) {
  setMarker(map, { ...event.lnglat })
  setGeocoder(map, { ...event.lnglat }, then)
}

function setMarker(map: any, lnglat: any) {
  const marker = new AMap.Marker({
    icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
    position: [lnglat.lng || 116.397428, lnglat.lat || 39.90923],
  })
  map.clearMap()
  map.add(marker)
  map.setFitView()
}

function setGeocoder(map: any, lnglat: any, then: Function) {
  map.plugin(['AMap.Geocoder'], function () {
    const geocoder = new AMap.Geocoder({})
    geocoder.getAddress(lnglat, function (status: any, result: any) {
      if (status === 'complete' && result.info === 'OK') {
        result.regeocode.addressComponent.lnglat = lnglat
        then(result.regeocode.addressComponent)
      }
    })
  })
}

export function search(val: any) {
  if (val) {
    nextTick(() => {
      state.placeSearch.search(val)
    })
  } else {
    document.querySelector<any>('#panel').innerHTML = ''
  }
}
