<template>
  <div
    class="side-nav"
    :style="{ width: collapsed ? '70px' : '200px', overflow: 'hidden' }"
  >
    <a-menu
      mode="inline"
      theme="light"
      :inline-collapsed="collapsed"
      v-model:selectedKeys="state.selectedKey"
      @select="selectMenu"
      v-model:openKeys="state.openKeys"
      :style="{ height: '100%', borderRight: 0 }"
    >
      <template v-for="item in state.menuList">
        <a-sub-menu
          v-if="item.children && item.children.length"
          :key="item.children[0].path.split('/')[1]"
        >
          <template #title>
            <span>
              <i
                :class="item.icon"
                class="pd-r5"
              ></i>
              <span v-show="!collapsed">{{ item.menuName }}</span>
            </span>
          </template>
          <template v-if="item.children && item.children.length">
            <a-menu-item
              v-for="citem in item.children"
              :key="citem.url"
              :pathLabel="[`${item.menuName}`, `${citem.menuName}`]"
            >
              <i
                :class="citem.icon"
                class="pd-r5"
              ></i>
              {{ citem.menuName }}
            </a-menu-item>
          </template>
        </a-sub-menu>
        <a-menu-item
          v-else
          :key="item.path"
          :pathLabel="[`${item.menuName}`]"
        >
          <i
            :class="item.icon"
            class="pd-r5"
          ></i>
          <span v-show="!collapsed">{{ item.menuName }}</span>
        </a-menu-item>
      </template>
    </a-menu>
  </div>
</template>
<script lang="ts" lang="ts" setup>
import apis from '@/apis'
let props = defineProps({
  collapsed: {
    type: Boolean,
    dedfault: true,
  },
  appId: {
    type: String,
    dedfault: '',
  },
})
const route = useRoute()
interface Menu {
  menuName: string
  menuId: string
  parentId: string
  icon: string
  url: string
  path: string
  type: number
  sortBy: number
  children: Menu[]
}
interface Data {
  selectedKey: string[]
  openKeys: string[]
  collapsed: true
  menuList: Menu[]
  powerSign: ''
}

let state = reactive<Data>({
  selectedKey: [],
  openKeys: [],
  collapsed: true,
  menuList: [],
  powerSign: '',
})
let emit = defineEmits(['setPathLabel'])
// state.openKeys = [route.path.split('/')[1], route.path];
state.openKeys = [route.path.split('/')[1], route.path]
state.selectedKey = [route.path]
/**
 * 根据应用id获取菜单
 */
const getMenuData = async (appId: any) => {
  let menuList = sessionStorage.getItem('menuList')
  let powerSign = sessionStorage.getItem('powerSign')
  if (menuList && powerSign) {
    state.menuList = JSON.parse(menuList)
    state.powerSign = JSON.parse(powerSign)
  } else {
    let { data, code } = await apis.getJSON(apis.menuFindTreeListByAppId)
    if (code === 1) {
      sessionStorage.setItem('menuList', JSON.stringify(data['menuList']))
      sessionStorage.setItem('powerSign', JSON.stringify(data['powerSign']))
      state.menuList = data['menuList']
      state.powerSign = data['powerSign']
    } else {
      state.menuList = []
    }
  }
}

/**
 * 生命周期函数
 */
onMounted(() => {
  getMenuData(props.appId)
  emit('setPathLabel', ['首页'])
})

/**
 * 监听应用id
 */
watch(
  () => props.appId,
  (nv, ov) => {
    if (nv != ov) {
      sessionStorage.removeItem('menuList')
      sessionStorage.removeItem('currentMenuList')
      sessionStorage.removeItem('powerSign')
    }
    state.menuList = []
    getMenuData(nv)
  },
)

// 菜单选择
const selectMenu = ({ item, key }: any) => {
  emit('setPathLabel', item.pathLabel)
}
</script>
