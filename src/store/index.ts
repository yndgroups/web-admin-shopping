import type { App } from 'vue'
import { createPinia } from 'pinia'
import { useCartStore } from './modules/cart'
import { useProductStore } from './modules/product'
import { useLayoutStore } from './modules/layout'
const store = createPinia()
export { store }
export function useStore(app: App<Element>) {
  app.use(store)
  useCartStore(store)
  useProductStore(store)
  useLayoutStore(store)
}
