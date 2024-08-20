<template>
  <div class="map-box">
    <div class="input-box">
      <a-input
        v-model:value="address"
        placeholder="输入地区名称，如：贵阳"
        id="search"
        allowClear
        class="search"
      />
      <div class="lng">经度 ：{{ lngs }}</div>
      <div class="lat">纬度 ：{{ lats }}</div>
    </div>
    <div id="panel"></div>
    <div
      class="map"
      ref="map"
    ></div>
  </div>
</template>
<script setup lang="ts">
import { initMap, search } from '@/config/map/mapHandler'
let map = ref(null)
const props = defineProps({
  address: {
    type: String,
    default: '',
  },
  lat: {
    type: String,
    default: '26.648693',
  },
  lng: {
    type: String,
    default: '106.624082',
  },
})
const show = ref(false)
const emit = defineEmits(['update:address', 'update:lat', 'update:lng'])
const address = computed({
  get() {
    return props.address
  },
  set(data) {
    emit('update:address', data)
  },
})
const lats = computed({
  get() {
    return props.lat
  },
  set(data) {
    emit('update:lat', JSON.stringify(data))
  },
})
const lngs = computed({
  get() {
    return props.lng
  },
  set(data) {
    emit('update:lng', JSON.stringify(data))
  },
})
watch(
  () => address.value,
  val => {
    if (show.value) {
      search(val)
    }
    show.value = true
  },
)

function initMaps(map: any, lat: number, lng: number) {
  initMap(map, { lat: lat, lng: lng }, (res: any) => {
    const { lnglat, province, street, streetNumber, township, city, district } = res
    show.value = false
    address.value = province + city + district + street + township + streetNumber
    lats.value = lnglat.lat
    lngs.value = lnglat.lng
  })
}
// lng:经度  lat：纬度
onMounted(() => {
  nextTick(() => {
    initMaps(map.value, Number(lats.value), Number(lngs.value))
  })
})
</script>
<style lang="scss" scoped>
.map-box {
  width: 100%;
  height: 40vh;
  position: relative;

  .map {
    width: 100%;
    height: 100%;
    position: relative;
  }

  #panel {
    position: absolute;
    background-color: white;
    max-height: 90%;
    overflow-x: auto;
    top: 35px;
    z-index: 200;
    width: 40%;
  }

  .input-box {
    display: flex;
    color: #838383;
    margin-bottom: 20px;
    .search {
      flex: 50%;
    }

    .lng {
      flex: 25%;
      border: 1px solid #d9d9d9;
      margin-left: 10px;
      margin-right: 10px;
      display: flex;
      align-items: center;
      padding: 5px 10px;
      border-radius: 5px;
    }

    .lat {
      flex: 25%;
      border: 1px solid #d9d9d9;
      display: flex;
      align-items: center;
      padding: 5px 10px;
      border-radius: 5px;
    }
  }
}
</style>
