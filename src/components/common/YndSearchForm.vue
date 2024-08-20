<template>
  <a-form
    class="form-box"
    ref="form"
    v-bind="$attrs"
  >
    <!-- @mouseover="open = true" -->
    <!-- @mouseout="open = false" -->
    <div
      ref="child"
      class="child-box"
      :class="open ? 'open-child' : 'fold-child'"
    >
      <slot></slot>
    </div>

    <div class="right-box">
      <span v-if="childLength > 4">
        <a-button
          :size="config.formSize"
          type="link"
          v-if="!open"
          @click="open = true"
        >
          展开
          <down-outlined />
        </a-button>
        <a-button
          :size="config.formSize"
          type="link"
          v-else
          @click="open = false"
        >
          折叠
          <UpOutlined />
        </a-button>
      </span>
      <a-button
        :size="config.formSize"
        @click="emits('search')"
        type="primary"
        class="mg-l10 mg-r10"
      >
        <template #icon>
          <search-outlined />
        </template>
        <span>搜索</span>
      </a-button>
      <a-button
        :size="config.formSize"
        @click="reset"
        class="mg-r10"
      >
        <template #icon>
          <redo-outlined />
        </template>
        <span>重置</span>
      </a-button>
    </div>
  </a-form>
</template>

<script lang="ts" setup>
import config from '@/config/theme'
const pageInfo = ref({
  params: {},
})
const open = ref(false)
const visible = ref(true)
const emits = defineEmits(['search', 'reset'])
const child = ref<any>(null)
const childLength = ref(0)
const form = ref<any>(null)
function reset() {
  form.value.resetFields()
  emits('reset')
}
onMounted(() => {
  childLength.value = child.value.children.length || 0
})
</script>

<style lang="scss" scoped>
.form-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .child-box {
    flex: 90%;
    display: flex;
    flex-wrap: wrap;
  }
  .right-box {
    flex: 10%;
    display: flex;
    align-items: center;
    padding-top: 3px;
  }
}

.open-child {
  height: auto;
}
.fold-child {
  height: 40px;
  overflow-y: hidden;
}
</style>

<style lang="scss">
.child-box {
  .ant-form-item {
    min-width: 240px;
    margin-right: 10px;
  }
}
</style>
