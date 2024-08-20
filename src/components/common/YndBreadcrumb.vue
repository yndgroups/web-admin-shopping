<template>
  <div class="ez-breadcrumb">
    <div
      class="pd-r10 pd-l10 fs18 text-btn"
      @click="toggleCollapsed"
    >
      <MenuUnFoldOutlined v-if="collapsed" />
      <MenuFoldOutlined v-else />
    </div>
    <a-breadcrumb>
      <a-breadcrumb-item
        v-for="(label, index) in pathLabel"
        :key="index"
      >
        {{ label }}
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  pathLabel: {
    type: Array,
    default: () => [],
  },
})
let state = reactive({
  collapsed: false,
})
let emit = defineEmits(['setCollapsed'])
let { collapsed } = toRefs(state)
// 切换菜单类型
const toggleCollapsed = () => {
  state.collapsed = !state.collapsed
  emit('setCollapsed', state.collapsed)
}
</script>
<style lang="scss">
.ez-breadcrumb {
  display: flex;
  background: #fff;
  align-items: center;
  position: relative;
  height: 25px;

  &::before {
    content: '';
    position: absolute;
    height: 44px;
    width: 6px;
    left: -6px;
    z-index: 1;
    top: 0px;
    background-color: #fff;
  }
}
</style>
