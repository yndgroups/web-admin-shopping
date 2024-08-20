<template>
  <div class="item-box">
    <div
      class="items"
      :class="value == 1 && 'active'"
      @click="value = 1"
    >
      <span class="text1">实物商品</span>
      <span class="text2">(物流发货)</span>
      <img
        class="icons"
        v-if="value === 1"
        src="/static/images/select.png"
        alt=""
      />
    </div>
    <div
      class="items"
      :class="value == 2 && 'active'"
      @click="value = 2"
    >
      <span class="text1">虚拟商品</span>
      <span class="text2">(无需物流)</span>
      <img
        class="icons"
        v-if="value === 2"
        src="/static/images/select.png"
        alt=""
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: Number,
    default: 1,
  },
})
const emit = defineEmits(['update:modelValue'])
const value = computed({
  get() {
    return props.modelValue
  },
  set(data) {
    emit('update:modelValue', data)
  },
})
</script>

<style lang="scss" scoped>
.item-box {
  display: flex;
  padding: 10px 0;
  .items {
    width: 130px;
    height: 80px;
    border: 1px #ccc solid;
    border-radius: 10px;
    position: relative;
    margin-right: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    &:hover {
      cursor: pointer;
    }
    .icons {
      width: 30px;
      height: 30px;
      position: absolute;
      bottom: 0;
      right: 0;
      padding: 0 1px 1px 0;
      border-radius: 0 0 10px 0;
    }
    .text1 {
      color: black;
      font-weight: bold;
    }
    .text2 {
      color: #ccc;
    }
  }
  .active {
    border: 1px #0798ff solid;
    .text1 {
      color: #0798ff;
      font-weight: bold;
    }
  }
}
</style>
