import { createStore } from 'vuex'

export default createStore({
  state: {
    hx2022MsgData: {},
  },
  getters: {
  },
  mutations: {
    changeHx2022MsgData(state, val) {
      state.hx2022MsgData = val
    },
  },
  actions: {
  },
  modules: {
  }
})
