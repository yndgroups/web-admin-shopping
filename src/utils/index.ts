import apis from '@/apis'

export interface AnyObj {
  [k: string]: any
}

/**
 *
 * @param target
 *
 * 注意下面的两种写法
 # 写法1
 toastContainer.setAttribute(
  'style',
  `width: 100vw;height: ${h}px;
  display: flex;justify-content: center;align-items: center
 `)

 # 写法2
 toastContainer.style.display = 'block'
toastContainer.style.width = '100vw'
toastContainer.style.height = h + 'px'
toastContainer.style.display = 'flex'
toastContainer.style.justifyContent = 'center'
toastContainer.style.alignItems = 'center'
 */
interface ToastOptions {
  msg: string
  icon?: string
  duration?: number
}
export function toast(toastOptions: string | ToastOptions) {
  const dm = document.querySelector('.toast-container')
  if (dm) {
    document.body.removeChild(dm)
  }
  let time: number = 3000
  if (typeof toastOptions === 'object') {
    time = toastOptions.duration || 3000
  }
  const show = [{ opacity: 0 }, { opacity: 1 }]
  const hide = [{ opacity: 1 }, { opacity: 0 }]

  // 顶层容器
  const toastContainer = document.createElement('div')
  toastContainer.setAttribute('class', 'toast-container')
  toastContainer.setAttribute(
    'style',
    `position: fixed;
    z-index:99999;background: rgba(0,0,0,0.5);
    border-radius: 5px;padding:8px 10px;
    color: #fff;font-szie:12px
    `,
  )
  // 创建文本节点
  if (typeof toastOptions === 'string') {
    const textNode = document.createTextNode(toastOptions)
    toastContainer.appendChild(textNode)
  } else {
    const textNode = document.createTextNode(toastOptions.msg)
    toastContainer.appendChild(textNode)
  }
  toastContainer.animate(show, 1000)
  // 插入到body中
  document.body.appendChild(toastContainer)

  // 计算水平剧中
  const cw = toastContainer.clientWidth / 2
  toastContainer.style.left = `calc(100vw / 2 - ${cw}px)`
  // 计算垂直居中
  toastContainer.style.top = `calc(100vh / 2 - ${toastContainer.clientHeight}px)`
  setTimeout(function () {
    toastContainer.animate(hide, 1000)
    setTimeout(function () {
      document.body.removeChild(toastContainer)
    }, 1000)
  }, time)
}

export const showImag = (url: string): string => {
  if (url.includes('http') || url.includes('https')) {
    return url
  } else {
    const APP_IMG_VIEW_HOST = import.meta.env.VITE_APP_IMG_VIEW_HOST
    if (url.startsWith('/')) {
      return APP_IMG_VIEW_HOST ? APP_IMG_VIEW_HOST + url : url
    } else {
      return APP_IMG_VIEW_HOST ? APP_IMG_VIEW_HOST + '/' + url : url
    }
  }
}

export function showImg(url: string) {
  if (url.includes('https://') || url.includes('http://')) {
    return url
  } else {
    return apis.imageViewHost + url
  }
}

export default {
  toast,
  showImg,
}
