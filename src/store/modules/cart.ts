import { defineStore } from 'pinia'
interface IFarmInfo {
  [path: string]: any
}
export const useCartStore = defineStore({
  id: 'cart',
  state: (): IFarmInfo => {
    return {
      cart: {},
    }
  },
  getters: {},
  actions: {},
})
