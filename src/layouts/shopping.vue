<template>
  <div class="layout-container">
    <CommonYndHeader @setMenuList="setMenuList" />
    <main class="layout-main">
      <aside
        class="layout-aside"
        :style="{ width: collapsed ? '60px' : '200px' }"
      >
        <CommonYndMenuStaticData
          v-if="menuList && menuList.length"
          :collapsed="collapsed"
          :menuList="menuList"
          @setPathLabel="setPathLabel"
        />
      </aside>
      <section
        class="layout-section"
        :style="{
          width: collapsed ? 'calc(100vw - 60px)' : 'calc(100vw - 200px)',
        }"
      >
        <CommonYndBreadcrumb
          :pathLabel="pathLabel"
          class="mg-b5"
          @setCollapsed="setCollapsed"
        ></CommonYndBreadcrumb>
        <div class="layout-child-container">
          <router-view />
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts" setup>
let state = reactive({
  collapsed: false,
  showMenu: false,
  pathLabel: [],
  menuList: [],
  firstLabel: '',
})
let { collapsed, pathLabel, menuList, showMenu } = toRefs(state)

const setCollapsed = (bool: boolean) => {
  state.collapsed = bool
}

const setPathLabel = (arr: any) => {
  if (state.firstLabel) {
    state.pathLabel = [state.firstLabel, ...arr] as any
  } else {
    state.pathLabel = arr
  }
}

// 设置菜单
const setMenuList = (menuList: any) => {
  state.menuList = menuList
  sessionStorage.setItem('currentMenuList', JSON.stringify(menuList))
}
</script>
<style lang="scss" scoped>
.layout-container {
  .layout-header {
    height: 60px;
  }

  .layout-aside,
  .layout-section {
    height: calc(100vh - 67px);
    min-height: 400px;
  }

  .layout-main {
    display: flex;
    overflow: hidden;

    .layout-aside {
      width: 200px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .layout-child-container {
      padding: 5px;
      border-radius: 10px 10px 10px 0;
      overflow: hidden;
      height: calc(100vh - 96px);
      background-color: #f3f3f3;
    }
  }
}
</style>
