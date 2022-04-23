import { createStore } from 'vuex'

export default createStore({
  state: {
    hx2022MsgData: {},
    hx2022Path: '/hx2022',
    sensorPath: '/sensors',
    user: null,
  },
  getters: {
  },
  mutations: {
    changeHx2022MsgData(state, val) {
      state.hx2022MsgData = val
    },
    changeUser(state, val) {
      state.user = val
    }
  },
  actions: {
  },
  modules: {
  }
})
