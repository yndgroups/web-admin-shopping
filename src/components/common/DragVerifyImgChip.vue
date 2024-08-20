<template>
  <div class="drag-verify-container">
    <div :style="dragVerifyImgStyle">
      <img
        ref="checkImg"
        crossOrigin="anonymous"
        :src="imgsrc"
        @load="checkimgLoaded"
        style="width: 100%"
      />
      <canvas
        ref="mainCanvas"
        class="main-canvas"
      ></canvas>
      <canvas
        ref="moveCanvas"
        :class="{ goFirst: state.isOk, goKeep: state.isKeep }"
        class="move-canvas"
      ></canvas>
      <div
        class="refresh"
        v-if="showRefresh && !isPassing"
      >
        <i
          :class="refreshIcon"
          @click="refreshimg"
        ></i>
      </div>
      <div
        class="tips success"
        v-if="showTips && isPassing"
      >
        {{ successTip }}
      </div>
      <div
        class="tips danger"
        v-if="showTips && !isPassing && state.showErrorTip"
      >
        {{ failTip }}
      </div>
    </div>
    <div
      ref="dragVerify"
      class="drag-verify"
      :style="dragVerifyStyle"
      @mousemove="dragMoving"
      @mouseup="dragFinish"
      @mouseleave="dragFinish"
      @touchmove="dragMoving"
      @touchend="dragFinish"
    >
      <div
        class="progress_bar"
        :class="{ goFirst2: state.isOk }"
        ref="progressBar"
        :style="progressBarStyle"
      >
        {{ successMessage }}
      </div>

      <div
        class="dv-text"
        :style="textStyle"
        ref="message"
      >
        {{ messageText }}
      </div>

      <div
        class="dv-handler dv-handler_bg"
        :class="{ goFirst: state.isOk }"
        @mousedown="dragStart"
        @touchstart="dragStart"
        ref="handler"
        :style="handlerStyle"
      >
        <right-square-filled class="slider-icon" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
let props = defineProps({
  isPassing: {
    type: Boolean,
    default: false,
  },
  width: {
    type: Number,
    default: 250,
  },
  height: {
    type: Number,
    default: 40,
  },
  text: {
    type: String,
    default: 'swiping to the right side',
  },
  successText: {
    type: String,
    default: 'success',
  },
  background: {
    type: String,
    default: '#eee',
  },
  progressBarBg: {
    type: String,
    default: '#76c61d',
  },
  completedBg: {
    type: String,
    default: '#76c61d',
  },
  circle: {
    type: Boolean,
    default: false,
  },
  radius: {
    type: String,
    default: '4px',
  },
  handlerIcon: {
    type: String,
  },
  successIcon: {
    type: String,
  },
  handlerBg: {
    type: String,
    default: '#fff',
  },
  textSize: {
    type: String,
    default: '14px',
  },
  textColor: {
    type: String,
    default: '#333',
  },
  imgsrc: {
    type: String,
  },
  barWidth: {
    type: Number,
    default: 40,
  },
  barRadius: {
    type: Number,
    default: 8,
  },
  showRefresh: {
    type: Boolean,
    default: false,
  },
  refreshIcon: {
    type: String,
  },
  showTips: {
    type: Boolean,
    default: true,
  },
  successTip: {
    type: String,
    default: '验证通过，超过80%用户',
  },
  failTip: {
    type: String,
    default: '验证未通过，拖动滑块将悬浮图像正确合并',
  },
  diffWidth: {
    type: Number,
    default: 20,
  },
})

let state = reactive({
  isMoving: false,
  x: 0,
  isOk: false,
  isKeep: false,
  clipBarx: 0,
  showErrorTip: false,
  showBar: false,
  key: '',
})

let emit = defineEmits(['passfail', 'handlerMove', 'passcallback', 'refresh'])

let checkImg = ref<any>(null)
let dragVerify = ref<any>(null)
let mainCanvas = ref<any>(null)
let moveCanvas = ref<any>(null)
let progressBar = ref<any>(null)
let handler = ref<any>(null)
let message = ref<any>(null)

onMounted(() => {
  const dragEl = dragVerify.value as any
  dragEl.style.setProperty('--textColor', props.textColor)
  dragEl.style.setProperty('--width', Math.floor(props.width / 2) + 'px')
  dragEl.style.setProperty('--pwidth', -Math.floor(props.width / 2) + 'px')
})

const draw = (ctx: any, x: any, y: any, operation: any) => {
  let l = props.barWidth
  let r = props.barRadius
  const PI = Math.PI
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI)
  ctx.lineTo(x + l, y)
  ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI)
  ctx.lineTo(x + l, y + l)
  ctx.lineTo(x, y + l)
  ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true)
  ctx.lineTo(x, y)
  ctx.lineWidth = 2
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
  ctx.stroke()
  ctx[operation]()
  ctx.globalCompositeOperation = 'destination-over'
}

const checkimgLoaded = () => {
  let barWidth = props.barWidth
  let imgHeight = checkImg.value.height
  let imgWidth = checkImg.value.width
  let halfWidth = Math.floor(props.width / 2)
  let refreshHeigth = 25
  let tipHeight = 20
  let x = halfWidth + Math.ceil(Math.random() * (halfWidth - barWidth - props.barRadius - 5))
  let y = refreshHeigth + Math.floor(Math.random() * (imgHeight - barWidth - refreshHeigth - tipHeight))
  mainCanvas.value.setAttribute('width', imgWidth)
  mainCanvas.value.setAttribute('height', imgHeight)
  mainCanvas.value.style.display = 'block'
  let canvasCtx = mainCanvas.value.getContext('2d')
  draw(canvasCtx, x, y, 'fill')
  state.clipBarx = x

  let mc = moveCanvas.value
  mc.setAttribute('width', imgWidth)
  mc.setAttribute('height', imgHeight)
  mc.style.display = 'block'
  const L = barWidth + props.barRadius * 2 + 3 //实际宽度
  let moveCtx = mc.getContext('2d')
  moveCtx.clearRect(0, 0, imgWidth, imgHeight)
  draw(moveCtx, x, y, 'clip')
  moveCtx.drawImage(checkImg.value, 0, 0, imgWidth, imgHeight)
  let y1 = y - props.barRadius * 2 - 1
  const ImageData = moveCtx.getImageData(x, y1, L, L)
  mc.setAttribute('width', L)
  mc.setAttribute('height', imgHeight)
  moveCtx.putImageData(ImageData, 0, y1)
}

// dragStart 开始移动元素
const dragStart = (e: any) => {
  if (!props.isPassing) {
    state.isMoving = true
    state.x = e.pageX || e.touches[0].pageX
  }
  state.showBar = true
  state.showErrorTip = false
  emit('handlerMove')
}

// dragMoving 移动
const dragMoving = (e: any) => {
  if (state.isMoving && !props.isPassing) {
    let x = (e.pageX || e.touches[0].pageX) - state.x
    handler.value.style.left = x + 'px'
    progressBar.value.style.width = x + props.height / 2 + 'px'
    moveCanvas.value.style.left = x + 'px'
  }
}

// dragFinish 拖动结束
const dragFinish = (e: any) => {
  if (state.isMoving && !props.isPassing) {
    let x = (e.pageX || e.changedTouches[0].pageX) - state.x
    if (Math.abs(x - state.clipBarx) > props.diffWidth) {
      state.isOk = true
      setTimeout(function () {
        handler.value.style.left = '0'
        progressBar.value.style.width = '0'
        moveCanvas.value.style.left = '0'
        state.isOk = false
      }, 500)
      emit('passfail')
      state.showErrorTip = true
    } else {
      passVerify()
    }
    state.isMoving = false
  }
}

// passVerify 验证通过
const passVerify = () => {
  emit('passcallback', true)
  state.isMoving = false
  handler.value.children[0].className = props.successIcon
  progressBar.value.style.background = props.completedBg
  message.value.style['-webkit-text-fill-color'] = 'unset'
  message.value.style.animation = 'slidetounlock2 3s infinite'
  progressBar.value.style.color = '#fff'
  progressBar.value.style.fontSize = props.textSize
  state.isKeep = true
  setTimeout(() => {
    moveCanvas.value ? (moveCanvas.value.style.left = state.clipBarx + 'px') : ''
    setTimeout(() => {
      state.isKeep = false
      moveCanvas.value ? (mainCanvas.value.style.display = 'none') : ''
      moveCanvas.value ? (moveCanvas.value.style.display = 'none') : ''
    }, 200)
  }, 100)
  emit('passcallback')
}
const reset = () => {
  reImg()
  checkimgLoaded()
}

const reImg = () => {
  emit('passcallback', false)
  let hand = handler.value as any
  let msg = message.value as any
  hand.style.left = '0'
  progressBar.value.style.width = '0'
  hand.children[0].className = props.handlerIcon
  msg.style['-webkit-text-fill-color'] = 'transparent'
  msg.style.animation = 'slidetounlock 3s infinite'
  msg.style.color = props.background
  moveCanvas.value.style.left = '0px'
}

const refreshimg = () => {
  emit('refresh')
}

let handlerStyle = computed(() => {
  return {
    width: props.height + 'px',
    height: props.height + 'px',
    background: props.handlerBg,
  }
})

let messageText = computed(() => {
  return props.isPassing ? '' : props.text
})

let successMessage = computed(() => {
  return props.isPassing ? props.successText : ''
})

let dragVerifyStyle = computed(() => {
  return {
    width: props.width + 'px',
    height: props.height + 'px',
    lineHeight: props.height + 'px',
    background: props.background,
    borderRadius: props.circle ? props.height / 2 + 'px' : props.radius,
  }
})

let dragVerifyImgStyle = computed<any>(() => {
  return {
    width: props.width + 'px',
    position: 'relative',
    overflow: 'hidden',
  }
})

let progressBarStyle = computed(() => {
  return {
    background: props.progressBarBg,
    height: props.height + 'px',
    borderRadius: props.circle ? props.height / 2 + 'px 0 0 ' + props.height / 2 + 'px' : props.radius,
  }
})

let textStyle = computed(() => {
  return {
    height: props.height + 'px',
    width: props.width + 'px',
    fontSize: props.textSize,
  }
})
</script>
<style lang="scss" scoped>
.drag-verify-container {
  .ok {
    color: rgb(88, 146, 21) !important;
  }

  .slider-icon {
    font-size: 48px;
    color: rgb(88, 146, 21);
    border: 1px solid rgb(221, 244, 194);
    background-color: rgb(228, 233, 228);
  }

  .drag-verify {
    position: relative;
    background-color: #e8e8e8;
    text-align: center;
    overflow: hidden;
  }

  .drag-verify .dv-handler {
    position: absolute;
    top: 0px;
    left: 0px;
    cursor: move;
  }

  .drag-verify .dv-handler i {
    color: #666;
    padding-left: 0;
    font-size: 16px;
  }

  .drag-verify .dv-handler .el-icon-circle-check {
    color: #6c6;
    margin-top: 9px;
  }

  .drag-verify .progress_bar {
    position: absolute;
    height: 34px;
    width: 0px;
  }

  .drag-verify .dv-text {
    position: absolute;
    top: 0px;
    color: transparent;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    -o-user-select: none;
    -ms-user-select: none;
    background: -webkit-gradient(linear, left top, right top, color-stop(0, var(--textColor)), color-stop(0.4, var(--textColor)), color-stop(0.5, #fff), color-stop(0.6, var(--textColor)), color-stop(1, var(--textColor)));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-size-adjust: none;
    animation: slidetounlock 3s infinite;
  }

  .drag-verify .dv-text * {
    -webkit-text-fill-color: var(--textColor);
  }

  .goFirst {
    left: 0px !important;
    transition: left 0.5s;
  }

  .goKeep {
    transition: left 0.2s;
  }

  .goFirst2 {
    width: 0px !important;
    transition: width 0.5s;
  }

  .drag-verify-container {
    position: relative;
    line-height: 0;
  }

  .refresh {
    position: absolute;
    right: 5px;
    top: 5px;
    cursor: pointer;
    font-size: 20px;
    z-index: 200;
  }

  .tips {
    position: absolute;
    bottom: 0;
    height: 20px;
    line-height: 20px;
    text-align: center;
    width: 100%;
    font-size: 12px;
    z-index: 200;
  }

  .tips.success {
    background: rgba(255, 255, 255, 0.6);
    color: green;
  }

  .tips.danger {
    background: rgba(0, 0, 0, 0.6);
    color: yellow;
  }

  .main-canvas {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .move-canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
}

@-webkit-keyframes slidetounlock {
  0% {
    background-position: var(--pwidth) 0;
  }

  100% {
    background-position: var(--width) 0;
  }
}

@-webkit-keyframes slidetounlock2 {
  0% {
    background-position: var(--pwidth) 0;
  }

  100% {
    background-position: var(--pwidth) 0;
  }
}
</style>
