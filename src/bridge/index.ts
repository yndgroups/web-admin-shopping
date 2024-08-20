// import { isMobile } from 'vant/lib/utils'
enum TitleBarStatus {
  hide = 0,
  show = 1,
}

/**
 * js调用原生方法
 */
class JsCall implements JsCallNative {
  constructor() {}
  setTitleBar(status: TitleBarStatus, title?: string) {
    Logger.log('js调用了app方法{setTitleBar},参数为:', TitleBarStatus[status], title)
  }
}

/**
 * 原生调用js方法
 */
class NativeCall implements NativeCallJs {
  constructor() {}
  toast(msg: string) {
    Logger.log('app调用了js方法{toast},参数:', msg)
  }
}

// 注入全局对象
window.JsCall = new JsCall()
window.NativeCall = new NativeCall()

/**
 * 打印当前已经实现的js调用原生方法
 */
for (const key in window.JsCall) {
  Logger.log('原生方法:', key)
}

/**
 * 打印当前已经实现的原生调用js方法
 */
for (const key in window.NativeCall) {
  Logger.log('js方法:', key)
}
export {}
