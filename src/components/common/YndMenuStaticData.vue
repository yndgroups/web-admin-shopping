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
      <template v-for="menu in menuList">
        <a-sub-menu
          v-if="menu.children && menu.children != 'null' && menu.children.length && menu.children[0].type == 1"
          :key="'pid_' + menu.menuId"
          :path="menu.menuId"
          :menuId="menu.menuId"
        >
          <template #title>
            <span>
              <component
                v-if="menu.icon"
                :is="menu.icon"
              ></component>
              <span v-show="!collapsed">{{ menu.name }}</span>
            </span>
          </template>
          <template v-if="menu.children && menu.children && menu.children.length">
            <template v-for="citem in menu.children">
              <a-menu-item
                v-if="citem.type == 1"
                :pathLabel="[`${menu.name}`, `${citem.name}`]"
                :path="citem.url"
                :key="citem.menuId"
                :menuId="citem.menuId"
              >
                <component
                  v-if="citem.icon"
                  :is="citem.icon"
                ></component>
                {{ citem.name }}
              </a-menu-item>
            </template>
          </template>
        </a-sub-menu>
        <a-menu-item
          v-else
          :pathLabel="[`${menu.name}`]"
          :path="menu.url"
          :key="menu.url"
          :menuId="menu.menuId"
        >
          <component
            v-if="menu.icon"
            :is="menu.icon"
          ></component>
          <span v-show="!collapsed">{{ menu.name }}</span>
        </a-menu-item>
      </template>
    </a-menu>
  </div>
</template>
<script lang="ts" setup>
let props = defineProps({
  collapsed: {
    type: Boolean,
    dedfault: true,
  },
  appId: {
    type: String,
    dedfault: '',
  },
  menuList: {
    type: Array<any>,
    default: [],
  },
})
const router = useRouter()
interface Data {
  selectedKey: any[]
  openKeys: any[]
  collapsed: true
  menuList: any[]
}
let state = reactive<Data>({
  selectedKey: new Array<any>(),
  openKeys: [],
  collapsed: true,
  menuList: [],
})

let emits = defineEmits(['setPathLabel'])

watch(
  () => props.menuList,
  (nv: any, ov: any) => {
    state.selectedKey = [nv[0].menuId]
    emits('setPathLabel', [props.menuList[0].menuName])
    router.push(nv[0].url)
  },
)

onMounted(() => {
  state.selectedKey = [props.menuList[0].menuId]
})

// 菜单选择
const selectMenu = ({ item }: any) => {
  console.log(item, 'item')
  emits('setPathLabel', item.urlLabel)
  state.selectedKey = [item.menuId]
  router.push(item.path)
}
</script>
