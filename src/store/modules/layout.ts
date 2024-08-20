import { defineStore } from 'pinia'
interface IFarmInfo {
  [path: string]: any
}
export const useLayoutStore = defineStore({
  id: 'layout',
  state: (): IFarmInfo => {
    return {
      tableHeight: 500,
    }
  },
  getters: {},
  actions: {
    setTableHeight(innerHeight: number) {
      this.tableHeight = innerHeight
    },
  },
})
