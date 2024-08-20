import { defineStore } from 'pinia'
interface IFarmInfo {
  [path: string]: any
}
export const useProductStore = defineStore({
  id: 'product',
  state: (): IFarmInfo => {
    return {
      product: {},
    }
  },
  getters: {},
  actions: {},
})
