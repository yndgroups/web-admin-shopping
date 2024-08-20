<template>
  <div class="router-config">
    <div
      v-if="isMobile()"
      class="nav"
      ref="customNav"
      @touchmove="dragHandle($event)"
      @touchstart="touchStartHandle($event)"
      @click="state.showNav"
      style="width: 50px; height: 50px; font-size: 12px"
    >
      约定式
      <br />
      导航
    </div>
    <div
      v-else
      ref="customNav"
      class="nav"
      style="width: 60px; height: 40px; font-size: 14px"
      @click="state.showNav = true"
    >
      约定式
      <br />
      导航
    </div>
    <div
      v-if="state.showNav"
      class="nav-mask"
      @click="state.showNav = false"
    ></div>
    <div
      v-if="state.showNav"
      class="custom-nav"
      :style="{ width: !isMobile() ? '600px' : '' }"
    >
      <ul
        class="nav-list"
        v-if="navLists && navLists.length"
      >
        <li
          v-for="(page, i) in navLists"
          :key="i"
          :title="page.name"
          header="This is panel nest panel"
        >
          <RouterLink
            @click="state.showNav = false"
            :to="page.path"
          >
            {{ page.meta.title ? page.meta.title : page.name }} -
            {{ page.path }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import { isMobile } from 'encjs/core/device'
console.log(isMobile())
const customNav = ref<HTMLElement>() as any
const state = reactive({
  showNav: false,
  active: '',
  activeNames: [],
  navList: new Array<any>(),
  coord: {
    client: {
      x: 0,
      y: 0,
    },
    elPosition: {
      x: 0,
      y: 0,
    } as any,
  },
})

const navLists = computed<any>(() => {
  if (window.navList && window.navList.length) {
    return window.navList
  } else {
    return []
  }
})

Logger.log(window.navList, 'pages')

/**
 * 开始拖动
 *
 * @param evt 事件参数
 */
const touchStartHandle = (evt: any) => {
  if (!customNav.value) {
    return
  }
  let element = evt.targetTouches[0]
  // 记录点击的坐标
  state.coord.client = {
    x: element.clientX,
    y: element.clientY,
  }
  // 记录需要移动的元素坐标
  state.coord.elPosition.left = customNav.value.offsetLeft
  state.coord.elPosition.top = customNav.value.offsetTop
}

/**
 * 拖动执行事件
 *
 * @param evt 事件参数
 */
const dragHandle = (evt: any) => {
  if (!customNav.value) {
    return
  }
  let element = evt.targetTouches[0]
  // 根据初始client位置计算移动距离（元素移动位置+光标移动后的位置-光标点击时的初始位置）
  let x = state.coord.elPosition.left + (element.clientX - state.coord.client.x)
  let y = state.coord.elPosition.top + (element.clientY - state.coord.client.y)
  // 限制可移动距离，不超出可视区域
  x = x <= 0 ? 0 : x >= innerWidth - customNav.value.offsetWidth ? innerWidth - customNav.value.offsetWidth : x
  // 50是头部的高度
  y = y <= 50 ? 50 : x >= innerHeight - customNav.value.offsetHeight ? innerHeight - customNav.value.offsetHeight : y
  // 移动当前元素
  customNav.value.style.left = x + 'px'
  customNav.value.style.top = y + 'px'
}

nextTick(() => {
  // 绑定鼠标按下对象
  customNav.value.onmousedown = function () {
    // 获取鼠标在div上按下的位置
    let e: any = window.event as any
    // 获取鼠标在当前事件源的位置
    let x1 = e.offsetX
    let y1 = e.offsetY

    // 绑定移动事件
    document.onmousemove = function () {
      // 获取鼠标在浏览器中的位置 - 每个事件都有自己独特的事件对象
      let e = window.event as any
      let x2 = e.clientX
      let y2 = e.clientY

      // 计算left和top
      let l = x2 - x1
      let t = y2 - y1

      // 设置不能超出左上角和右上角
      if (l < 0) {
        l = 0
      }
      if (t < 0) {
        t = 0
      }
      // 设置left和top的最大值 不能超过事件源本身
      if (t > document.documentElement.clientHeight - customNav.value.offsetHeight) {
        t = document.documentElement.clientHeight - customNav.value.offsetHeight
      }
      if (l > document.documentElement.clientWidth - customNav.value.offsetWidth) {
        l = document.documentElement.clientWidth - customNav.value.offsetWidth
      }

      // 设置div的left和top
      customNav.value.style.left = l + 'px'
      customNav.value.style.top = t + 'px'
    }
  }
  window.onmouseup = function () {
    document.onmousemove = null
  }
})
</script>
<style lang="scss" scoped>
.router-config {
  .nav {
    position: fixed;
    background-color: $primary-color;
    z-index: 99;
    text-align: center;
    color: #f7f7f7;
    top: 10px;
    left: 10px;
    font-size: 12px;
    display: -webkit-box;
    -webkit-box-orient: horizontal;
    -webkit-box-pack: center;
    -webkit-box-align: center;
    cursor: pointer;
    border-radius: 5px;
  }

  .nav-list li {
    padding-top: 10px;
  }

  .custom-nav {
    position: fixed;
    z-index: 99998;
    width: 80vw;
    background: #ffffff;
    right: 0;
    top: 0;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
    height: 100vh;
  }

  .nav-mask {
    width: 100vw;
    min-height: 100vh;
    position: fixed;
    background: rgba($color: #000000, $alpha: 0.5);
    z-index: 99998;
    left: -10vw;
    top: 0;
  }
}
</style>
